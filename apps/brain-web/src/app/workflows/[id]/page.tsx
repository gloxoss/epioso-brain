"use client";

import { use, useState } from "react";
import Link from "next/link";
import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle, PageHeader } from "../../../components/ui";

interface Workflow {
  id: string;
  name: string;
  trigger: string;
  agent: string;
  status: "idle" | "running" | "error" | "approval_needed";
  lastRun: string;
  nextRun: string;
  hoursSaved: number;
}

interface Step {
  id: string;
  name: string;
  actionType: string;
  status: "success" | "pending" | "error" | "skipped";
  payload: string;
}

interface RunLog {
  id: string;
  timestamp: string;
  status: "success" | "error";
  durationMs: number;
}

const ALL_WORKFLOWS: Record<string, Workflow> = {
  "wf-1": { id: "wf-1", name: "Daily Client Update Draft", trigger: "Cron: 18:00 (Daily)", agent: "n8n Automation Agent", status: "approval_needed", lastRun: "2026-06-01T18:00:00Z", nextRun: "2026-06-02T18:00:00Z", hoursSaved: 15 },
  "wf-2": { id: "wf-2", name: "Hourly Git Scan Watcher", trigger: "Cron: Every hour", agent: "Claude Code CLI", status: "running", lastRun: "2026-06-02T02:00:00Z", nextRun: "2026-06-02T03:00:00Z", hoursSaved: 28 },
  "wf-3": { id: "wf-3", name: "Darija Copy Variant Generation", trigger: "Web Hook trigger", agent: "Hermes Variant Agent", status: "idle", lastRun: "2026-05-30T14:00:00Z", nextRun: "Manual on Demand", hoursSaved: 12 },
  "wf-4": { id: "wf-4", name: "Scrape Medical Site Specs", trigger: "Manual on demand", agent: "n8n Automation Agent", status: "error", lastRun: "2026-05-25T14:00:00Z", nextRun: "Manual on Demand", hoursSaved: 8 }
};

const STEPS_DATA: Record<string, Step[]> = {
  "wf-1": [
    { id: "s-1", name: "Read active sessions logs", actionType: "read_file", status: "success", payload: "D:/Users/zakio/Desktop/Work/Epioso/codex-handoffs/*.json" },
    { id: "s-2", name: "Query LLM for summary", actionType: "mcp", status: "success", payload: "Model: gemini-flash, prompt: Summarize sessions." },
    { id: "s-3", name: "Format markdown message", actionType: "logic", status: "success", payload: "Code snippet: return \`# Daily Scoping...\`" },
    { id: "s-4", name: "Request human review", actionType: "approval", status: "pending", payload: "Payload: Draft content. Requires confirmation." },
    { id: "s-5", name: "Send slack message to client channel", actionType: "execute_url", status: "skipped", payload: "Webhook: https://hooks.slack.com/services/..." }
  ],
  "wf-2": [
    { id: "s-1", name: "Query local workspace git status", actionType: "run_command", status: "success", payload: "Command: git status -s" },
    { id: "s-2", name: "Filter excluded files", actionType: "logic", status: "success", payload: "Filter: config.ignorePatterns" },
    { id: "s-3", name: "Log modified file count", actionType: "write_file", status: "success", payload: "Write file: cache/git-state.json" }
  ],
  "wf-3": [
    { id: "s-1", name: "Fetch brief context", actionType: "read_file", status: "success", payload: "Read file: docs/briefs/clinic-automation.md" },
    { id: "s-2", name: "Generate variants with model", actionType: "mcp", status: "success", payload: "Model: claude-3-5-sonnet, prompt: Generate copy." },
    { id: "s-3", name: "Write generated options", actionType: "write_file", status: "success", payload: "Write file: docs/posts/variant-draft-1.md" }
  ],
  "wf-4": [
    { id: "s-1", name: "Fetch staging specifications url", actionType: "execute_url", status: "success", payload: "URL: https://stage.clinic.medicore.ma/api/specs" },
    { id: "s-2", name: "Extract target markdown tables", actionType: "logic", status: "success", payload: "Parser: regex clinic-spec-tables" },
    { id: "s-3", name: "Save local copy specs", actionType: "write_file", status: "error", payload: "Write file: D:/Users/zakio/Desktop/Work/Epioso/medicore/spec-sheets.md" }
  ]
};

const RUN_LOGS: Record<string, RunLog[]> = {
  "wf-1": [
    { id: "log-r1", timestamp: "2026-06-01T18:00:00Z", status: "success", durationMs: 12400 },
    { id: "log-r2", timestamp: "2026-05-31T18:00:00Z", status: "success", durationMs: 11900 }
  ],
  "wf-2": [
    { id: "log-r3", timestamp: "2026-06-02T02:00:00Z", status: "success", durationMs: 4200 },
    { id: "log-r4", timestamp: "2026-06-02T01:00:00Z", status: "success", durationMs: 3900 },
    { id: "log-r5", timestamp: "2026-06-02T00:00:00Z", status: "success", durationMs: 4500 }
  ],
  "wf-3": [
    { id: "log-r6", timestamp: "2026-05-30T14:00:00Z", status: "success", durationMs: 18200 }
  ],
  "wf-4": [
    { id: "log-r7", timestamp: "2026-05-25T14:00:00Z", status: "error", durationMs: 8200 }
  ]
};

export default function WorkflowDetailPage({ params }: { readonly params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const wfId = resolvedParams.id;
  const workflow = ALL_WORKFLOWS[wfId] ?? ALL_WORKFLOWS["wf-1"]!;
  const steps = STEPS_DATA[wfId] ?? [];
  const logs = RUN_LOGS[wfId] ?? [];

  const [status, setStatus] = useState<"idle" | "running" | "error" | "approval_needed">(workflow.status);

  const toggleStatus = () => {
    setStatus(status === "error" ? "idle" : "error");
  };

  const handleDryRun = () => {
    setStatus("running");
    setTimeout(() => {
      setStatus("idle");
    }, 1500);
  };

  return (
    <section className="space-y-6 bg-black p-6 md:p-8 rounded-xl border border-neutral-800 text-white min-h-[85vh]">
      <div className="flex items-center gap-2 text-sm text-[#FF6B2D] mb-2 font-semibold">
        <Link href="/workflows" className="hover:underline">
          &larr; Back to Workflows
        </Link>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-neutral-800 pb-4 gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-extrabold tracking-tight text-white">{workflow.name}</h1>
            <Badge variant={status === "running" ? "info" : status === "approval_needed" ? "warning" : status === "error" ? "danger" : "neutral"}>
              {status.toUpperCase().replace("_", " ")}
            </Badge>
          </div>
          <p className="text-sm text-neutral-500 mt-1">Agent: {workflow.agent} | Trigger: {workflow.trigger}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button onClick={handleDryRun} variant="secondary" className="text-xs bg-neutral-850 hover:bg-neutral-800 border-neutral-850 text-white font-semibold">
            Run Dry-Run
          </Button>
          <Button onClick={toggleStatus} className="text-xs bg-[#FF6B2D] border-[#FF6B2D] hover:bg-[#E85A1F] text-black font-semibold">
            {status === "error" ? "Clear Error State" : "Flag Failure Test"}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_22rem]">
        {/* Main flow steps trace */}
        <div className="space-y-6">
          <Card className="bg-[#181818] border-neutral-800 text-white">
            <CardHeader className="border-neutral-800">
              <CardTitle className="text-white">Workflow Steps Trace</CardTitle>
              <CardDescription className="text-neutral-500">Atomic blocks compiled in this deterministic flow.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {steps.map((step, idx) => (
                  <div key={step.id} className="p-4 bg-black/40 border border-neutral-850 rounded-lg flex items-start gap-4">
                    <div className={`size-6 rounded-full shrink-0 flex items-center justify-center text-xs font-mono font-bold ${
                      step.status === "success" ? "bg-emerald-950 text-emerald-300 border border-emerald-800" :
                      step.status === "pending" ? "bg-amber-950 text-amber-300 border border-amber-800" :
                      step.status === "error" ? "bg-rose-950 text-rose-300 border border-rose-800" :
                      "bg-neutral-900 text-neutral-500 border border-neutral-800"
                    }`}>
                      {idx + 1}
                    </div>
                    
                    <div className="flex-1 min-w-0 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-neutral-200">{step.name}</span>
                        <Badge variant={step.status === "success" ? "success" : step.status === "pending" ? "warning" : step.status === "error" ? "danger" : "neutral"} className="text-[10px] py-0 h-4 leading-none">
                          {step.status.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="grid gap-1 grid-cols-[5rem_1fr] text-xs font-mono">
                        <span className="text-neutral-500 font-sans">Action:</span>
                        <span className="text-[#FF6B2D] font-bold">{step.actionType}</span>
                        <span className="text-neutral-500 font-sans">Config:</span>
                        <span className="text-neutral-450 truncate">{step.payload}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Runs history */}
          <Card className="bg-[#181818] border-neutral-800 text-white">
            <CardHeader className="border-neutral-800">
              <CardTitle className="text-white">Run History Logs</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-neutral-800 font-mono text-xs">
                {logs.map(log => (
                  <div key={log.id} className="p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-neutral-500">{new Date(log.timestamp).toLocaleDateString()} {new Date(log.timestamp).toLocaleTimeString()}</span>
                      <Badge variant={log.status === "success" ? "success" : "danger"}>
                        {log.status.toUpperCase()}
                      </Badge>
                    </div>
                    <span className="text-neutral-450">Duration: {log.durationMs}ms</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Side Panel: permissions, approval gates, linked project, estimated ROI */}
        <div className="space-y-6">
          {/* Human review note (Warm Paper) */}
          {status === "approval_needed" && (
            <div className="bg-[#EDE8E4] text-neutral-950 p-5 rounded-xl shadow-md space-y-3 text-xs leading-relaxed">
              <span className="text-[10px] font-bold tracking-widest uppercase text-neutral-500">HUMAN REVIEW REQUIRED</span>
              <h4 className="font-bold text-sm text-neutral-900">Review Output Draft before Post</h4>
              <p className="text-neutral-700">
                This workflow compiles data from private local folders. In accordance with the security policy, n8n Slack updates cannot run automatically until you verify the compiled message draft.
              </p>
              <div className="flex gap-2 pt-1.5">
                <Link href="/approvals" className="w-full">
                  <Button className="w-full bg-[#FF6B2D] border-[#FF6B2D] hover:bg-[#E85A1F] text-black font-semibold text-xs py-1.5">
                    Open approval queue
                  </Button>
                </Link>
              </div>
            </div>
          )}

          <Card className="bg-[#181818] border-neutral-800 text-white">
            <CardHeader className="border-neutral-800">
              <CardTitle className="text-white">Workflow Scope Boundaries</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <span className="text-neutral-500 block uppercase font-bold tracking-wider">Estimated ROI</span>
                <span className="text-[#76f05d] text-base font-bold font-mono">+{workflow.hoursSaved} hrs saved</span>
                <span className="text-neutral-450 block mt-0.5 mt-1 font-sans">Valued at: <strong>${workflow.hoursSaved * 75}</strong> (rate: $75/hr)</span>
              </div>

              <div className="border-t border-neutral-800 pt-3 space-y-1.5">
                <span className="text-neutral-500 block uppercase font-bold tracking-wider">Required Permissions</span>
                <div className="flex flex-wrap gap-1">
                  {Array.from(new Set(steps.map(s => s.actionType))).map(perm => (
                    <Badge key={perm} className="bg-black/60 text-neutral-300 border-neutral-800 text-[10px] py-0 h-5">
                      {perm}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="border-t border-neutral-800 pt-3 space-y-1">
                <span className="text-neutral-500 block uppercase font-bold tracking-wider">Target Project Link</span>
                <span className="font-mono text-neutral-300 block">EPIOSO Brain</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
