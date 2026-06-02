"use client";

import { useState } from "react";
import Link from "next/link";
import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle, PageHeader } from "../../components/ui";

interface Workflow {
  id: string;
  name: string;
  trigger: string;
  agent: string;
  status: "idle" | "running" | "error" | "approval_needed" | "paused";
  lastRun: string;
  nextRun: string;
  hoursSaved: number;
}

interface WorkflowRun {
  id: string;
  workflowId: string;
  workflowName: string;
  status: "success" | "error" | "aborted";
  durationMs: number;
  timestamp: string;
  errorLog?: string;
}

export default function WorkflowsPage() {
  const [workflows, setWorkflows] = useState<Workflow[]>([
    { id: "wf-1", name: "Daily Client Update Draft", trigger: "Cron: 18:00 (Daily)", agent: "n8n Automation Agent", status: "approval_needed", lastRun: "2026-06-01T18:00:00Z", nextRun: "2026-06-02T18:00:00Z", hoursSaved: 15 },
    { id: "wf-2", name: "Hourly Git Scan Watcher", trigger: "Cron: Every hour", agent: "Claude Code CLI", status: "running", lastRun: "2026-06-02T02:00:00Z", nextRun: "2026-06-02T03:00:00Z", hoursSaved: 28 },
    { id: "wf-3", name: "Darija Copy Variant Generation", trigger: "Web Hook trigger", agent: "Hermes Variant Agent", status: "idle", lastRun: "2026-05-30T14:00:00Z", nextRun: "Manual on Demand", hoursSaved: 12 },
    { id: "wf-4", name: "Scrape Medical Site Specs", trigger: "Manual on demand", agent: "n8n Automation Agent", status: "error", lastRun: "2026-05-25T14:00:00Z", nextRun: "Manual on Demand", hoursSaved: 8 }
  ]);

  const [runs, setRuns] = useState<WorkflowRun[]>([
    { id: "run-1", workflowId: "wf-2", workflowName: "Hourly Git Scan Watcher", status: "success", durationMs: 4200, timestamp: "2026-06-02T02:00:00Z" },
    { id: "run-2", workflowId: "wf-1", workflowName: "Daily Client Update Draft", status: "success", durationMs: 12400, timestamp: "2026-06-01T18:00:00Z" },
    { id: "run-3", workflowId: "wf-4", workflowName: "Scrape Medical Site Specs", status: "error", durationMs: 8200, timestamp: "2026-05-25T14:00:00Z", errorLog: "Hostinger API connection failed. Refused connection (500) at scrape target node." }
  ]);

  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newWfName, setNewWfName] = useState("");
  const [newWfTrigger, setNewWfTrigger] = useState("");
  const [newWfAgent, setNewWfAgent] = useState("n8n Automation Agent");

  const handleToggle = (id: string) => {
    setWorkflows(
      workflows.map(wf =>
        wf.id === id ? { ...wf, status: wf.status === "paused" ? "idle" : "paused" } : wf
      )
    );
  };

  const handleRunManual = (id: string) => {
    setWorkflows(
      workflows.map(wf =>
        wf.id === id ? { ...wf, status: "running" as const, lastRun: new Date().toISOString() } : wf
      )
    );
    setTimeout(() => {
      setWorkflows(
        workflows.map(wf =>
          wf.id === id ? { ...wf, status: "idle" as const } : wf
        )
      );
      setRuns([
        { id: `run-${Date.now()}`, workflowId: id, workflowName: workflows.find(w => w.id === id)!.name, status: "success", durationMs: 3500, timestamp: new Date().toISOString() },
        ...runs
      ]);
    }, 2000);
  };

  const handleAddWorkflow = () => {
    if (!newWfName.trim() || !newWfTrigger.trim()) return;
    setWorkflows([
      ...workflows,
      {
        id: `wf-${workflows.length + 1}`,
        name: newWfName,
        trigger: newWfTrigger,
        agent: newWfAgent,
        status: "idle",
        lastRun: "Never",
        nextRun: "Manual on demand",
        hoursSaved: 0
      }
    ]);
    setShowAddDialog(false);
  };

  return (
    <section className="space-y-6 bg-black p-6 md:p-8 rounded-xl border border-neutral-800 text-white min-h-[85vh]">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <PageHeader
          eyebrow="AUTOMATION / SCHEDULED WORK"
          title="Workflows"
          description="Track n8n pipelines, scheduled cron scripts, and deterministic human-in-the-loop automations."
          className="text-white"
        />
        <Button onClick={() => setShowAddDialog(true)} className="bg-[#FF6B2D] border-[#FF6B2D] hover:bg-[#E85A1F] text-black font-semibold h-10 px-5 rounded-md">
          Add Workflow
        </Button>
      </div>

      {/* KPI strip */}
      <div className="grid gap-3 grid-cols-2 md:grid-cols-5">
        <Card className="bg-[#181818] border-neutral-800 text-white">
          <CardContent className="py-4 space-y-1">
            <span className="text-xs text-neutral-500 uppercase font-semibold">Active Workflows</span>
            <p className="text-3xl font-bold tracking-tight text-[#FF6B2D]">
              {workflows.filter(w => w.status !== "idle" && w.status !== "error").length}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-[#181818] border-neutral-800 text-white">
          <CardContent className="py-4 space-y-1">
            <span className="text-xs text-neutral-500 uppercase font-semibold">Scheduled</span>
            <p className="text-3xl font-bold tracking-tight text-white">
              {workflows.filter(w => w.trigger.toLowerCase().includes("cron")).length}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-[#181818] border-neutral-800 text-white">
          <CardContent className="py-4 space-y-1">
            <span className="text-xs text-neutral-500 uppercase font-semibold">Errors</span>
            <p className="text-3xl font-bold tracking-tight text-rose-500">{workflows.filter(w => w.status === "error").length}</p>
          </CardContent>
        </Card>
        <Card className="bg-[#181818] border-neutral-800 text-white">
          <CardContent className="py-4 space-y-1">
            <span className="text-xs text-neutral-500 uppercase font-semibold">Approval Needed</span>
            <p className="text-3xl font-bold tracking-tight text-amber-500">{workflows.filter(w => w.status === "approval_needed").length}</p>
          </CardContent>
        </Card>
        <Card className="bg-[#181818] border-neutral-800 text-white">
          <CardContent className="py-4 space-y-1">
            <span className="text-xs text-neutral-500 uppercase font-semibold">Time Saved</span>
            <p className="text-3xl font-bold tracking-tight text-[#76f05d]">{workflows.reduce((acc, w) => acc + w.hoursSaved, 0)}h</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_22rem]">
        {/* Main Workflows grid */}
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            {workflows.map(wf => (
              <Card key={wf.id} className="bg-[#181818] border-neutral-800 hover:border-neutral-700 transition-colors text-white">
                <CardHeader className="border-neutral-800 flex flex-row items-start justify-between pb-2">
                  <div>
                    <Link href={`/workflows/${wf.id}`} className="hover:text-[#FF6B2D] transition-colors">
                      <CardTitle className="text-white text-base font-bold">{wf.name}</CardTitle>
                    </Link>
                    <CardDescription className="text-neutral-500 text-xs mt-0.5">Agent: {wf.agent}</CardDescription>
                  </div>
                  <Badge variant={wf.status === "running" ? "info" : wf.status === "approval_needed" ? "warning" : wf.status === "error" ? "danger" : "neutral"}>
                    {wf.status.replace("_", " ").toUpperCase()}
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-3 pb-3 text-xs">
                  <div className="grid grid-cols-2 gap-2 text-neutral-400">
                    <div>
                      <span className="text-[10px] text-neutral-500 uppercase font-bold block">Trigger</span>
                      <span className="font-semibold text-neutral-200">{wf.trigger}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-neutral-500 uppercase font-bold block">Next Run</span>
                      <span className="font-mono text-neutral-300">{wf.nextRun.includes("Manual") ? "Manual" : new Date(wf.nextRun).toLocaleTimeString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-neutral-800/60 pt-2">
                    <span className="text-neutral-500">Last run status:</span>
                    <span className="font-mono text-neutral-300">{wf.lastRun !== "Never" ? new Date(wf.lastRun).toLocaleDateString() : "Never"}</span>
                  </div>
                </CardContent>
                <div className="border-t border-neutral-800/80 px-4 py-2 bg-black/20 rounded-b-lg flex items-center justify-between">
                  <span className="text-xs text-neutral-500">Saved: <strong className="text-emerald-500 font-semibold">{wf.hoursSaved}h</strong></span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleRunManual(wf.id)}
                      className="text-xs text-[#FF6B2D] hover:underline font-semibold"
                    >
                      Run Now
                    </button>
                    <span className="text-neutral-800">|</span>
                    <Link href={`/workflows/${wf.id}`} className="text-xs text-[#FF6B2D] hover:underline font-semibold">
                      Inspect &rarr;
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Runs history */}
          <Card className="bg-[#181818] border-neutral-800 text-white">
            <CardHeader className="border-neutral-800">
              <CardTitle className="text-white">Workflow Execution Logs</CardTitle>
              <CardDescription className="text-neutral-500">Auditable trace of the latest automated runs.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-neutral-800 font-mono text-xs">
                {runs.map(r => (
                  <div key={r.id} className="p-3.5 hover:bg-neutral-900/30 transition-colors flex flex-col md:flex-row md:items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-neutral-500">{new Date(r.timestamp).toLocaleTimeString()}</span>
                        <span className="text-white font-bold font-sans">{r.workflowName}</span>
                        <Badge variant={r.status === "success" ? "success" : "danger"}>
                          {r.status.toUpperCase()}
                        </Badge>
                      </div>
                      {r.errorLog && (
                        <p className="text-rose-400 mt-1 font-sans bg-rose-950/20 border border-rose-950/40 p-2 rounded max-w-2xl">{r.errorLog}</p>
                      )}
                    </div>
                    <div className="shrink-0 text-right">
                      <span className="text-neutral-400 block">Duration: {r.durationMs}ms</span>
                      <span className="text-neutral-500 text-[10px] block mt-0.5">ID: {r.id}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right panel: Approvals and failures alerts */}
        <div className="space-y-6">
          <Card className="bg-[#181818] border-neutral-800 text-white">
            <CardHeader className="border-neutral-800">
              <CardTitle className="text-white">Approval Alerts</CardTitle>
              <CardDescription className="text-neutral-500">Risky workflow runs staged for validation.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3.5 bg-amber-950/25 border border-amber-900/50 rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-500 font-mono">STAGED RUN</span>
                  <Badge variant="warning">HI-RISK</Badge>
                </div>
                <div className="space-y-1">
                  <span className="font-bold text-sm block">Daily Client Update Draft</span>
                  <p className="text-xs text-neutral-400 leading-normal">
                    Triggered automatically. Requires review before drafting message in project channel due to active client workspace tokens.
                  </p>
                </div>
                <div className="flex gap-2">
                  <Link href="/approvals" className="flex-1">
                    <Button size="sm" className="w-full bg-[#FF6B2D] border-[#FF6B2D] text-black hover:bg-[#E85A1F] text-xs">
                      Review approval queue &rarr;
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modal for Add Workflow */}
      {showAddDialog && (
        <div className="fixed inset-0 bg-neutral-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#181818] border border-neutral-800 p-6 rounded-xl max-w-md w-full space-y-4">
            <h4 className="text-lg font-bold text-white">Add Automation Workflow</h4>
            
            <div className="space-y-3 text-sm text-neutral-300">
              <div className="space-y-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400">Workflow Name</label>
                <input
                  type="text"
                  placeholder="e.g. Scrape scoping targets"
                  value={newWfName}
                  onChange={(e) => setNewWfName(e.target.value)}
                  className="w-full bg-black border border-neutral-800 text-white rounded px-3 py-2 text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400">Trigger Policy / Cron</label>
                <input
                  type="text"
                  placeholder="e.g. Cron: 0 9 * * *"
                  value={newWfTrigger}
                  onChange={(e) => setNewWfTrigger(e.target.value)}
                  className="w-full bg-black border border-neutral-800 text-white rounded px-3 py-2 text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400">Assign Owner Agent</label>
                <select
                  value={newWfAgent}
                  onChange={(e) => setNewWfAgent(e.target.value)}
                  className="w-full bg-black border border-neutral-800 text-white rounded px-3 py-2 text-sm"
                >
                  <option>n8n Automation Agent</option>
                  <option>Claude Code CLI</option>
                  <option>Codex Editor Agent</option>
                  <option>Hermes Variant Agent</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="secondary" onClick={() => setShowAddDialog(false)}>Cancel</Button>
                <Button onClick={handleAddWorkflow} className="bg-[#FF6B2D] border-[#FF6B2D] hover:bg-[#E85A1F] text-black">
                  Create Workflow
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
