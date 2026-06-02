"use client";

import { use, useState } from "react";
import Link from "next/link";
import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle, PageHeader } from "../../../components/ui";

interface Agent {
  id: string;
  name: string;
  type: string;
  status: "idle" | "active" | "paused";
  lastActivity: string;
  allowedScope: string[];
  hoursSaved: number;
}

interface ActivityLog {
  id: string;
  timestamp: string;
  action: string;
  project: string;
  status: "success" | "warning" | "error";
  message: string;
  filesTouched: string[];
}

const ALL_AGENTS: Record<string, Agent> = {
  "codex": { id: "codex", name: "Codex Editor Agent", type: "IDE Extension", status: "idle", lastActivity: "2026-06-02T02:30:00Z", allowedScope: ["read_file", "write_file", "search"], hoursSaved: 48 },
  "claude-code": { id: "claude-code", name: "Claude Code CLI", type: "Terminal Agent", status: "active", lastActivity: "2026-06-02T02:40:00Z", allowedScope: ["read_file", "write_file", "run_command", "mcp"], hoursSaved: 104 },
  "hermes": { id: "hermes", name: "Hermes Variant Agent", type: "Creative Writer", status: "idle", lastActivity: "2026-06-01T18:15:00Z", allowedScope: ["read_file", "write_file", "search_web"], hoursSaved: 32 },
  "n8n-runner": { id: "n8n-runner", name: "n8n Automation Agent", type: "Workflow Executor", status: "active", lastActivity: "2026-06-02T02:38:00Z", allowedScope: ["mcp", "execute_url"], hoursSaved: 56 }
};

const ALL_LOGS: Record<string, ActivityLog[]> = {
  "claude-code": [
    { id: "log-1", timestamp: "2026-06-02T02:40:00Z", action: "Run Type-Check", project: "EPIOSO Brain", status: "success", message: "Successfully executed npm run type-check.", filesTouched: ["apps/brain-web/tsconfig.json", "apps/brain-web/src/components/app-shell.tsx"] },
    { id: "log-2", timestamp: "2026-06-02T02:35:00Z", action: "Modify tsconfig.json", project: "EPIOSO Brain", status: "warning", message: "Configured local typeRoots. Overrode implicit type declaration mappings.", filesTouched: ["apps/brain-web/tsconfig.json"] },
    { id: "log-3", timestamp: "2026-06-02T02:00:00Z", action: "Scaffold Page", project: "EPIOSO Brain", status: "success", message: "Created the initial onboarding page component framework.", filesTouched: ["apps/brain-web/src/app/onboarding/page.tsx"] }
  ],
  "codex": [
    { id: "log-4", timestamp: "2026-06-02T02:30:00Z", action: "Write settings.tsx", project: "EPIOSO Brain", status: "success", message: "Created settings component framework.", filesTouched: ["apps/brain-web/src/app/settings/page.tsx"] },
    { id: "log-5", timestamp: "2026-06-02T02:10:00Z", action: "Autocomplete function", project: "EPIOSO Brain", status: "success", message: "Added autocomplete scopes for the apiKeys configuration block.", filesTouched: ["apps/brain-web/src/app/settings/page.tsx"] }
  ],
  "hermes": [
    { id: "log-6", timestamp: "2026-06-01T18:15:00Z", action: "ScScope Variant", project: "EPIOSO Content", status: "success", message: "Successfully scoped 4 marketing variants for Fez Clinic automation launch.", filesTouched: ["docs/briefs/clinic-automation.md"] }
  ],
  "n8n-runner": [
    { id: "log-7", timestamp: "2026-06-02T02:38:00Z", action: "Client Report Draft", project: "MediCore Healthcare", status: "success", message: "Generated daily summary report for Fez Clinic scoping.", filesTouched: ["docs/reports/clinic-scoping-draft.md"] },
    { id: "log-8", timestamp: "2026-06-02T02:15:00Z", action: "Publish Post", project: "EPIOSO Content", status: "error", message: "Failed to publish variant draft. Hostinger server refused connection (500).", filesTouched: ["docs/posts/variant-draft-1.md"] }
  ]
};

export default function AgentDetailPage({ params }: { readonly params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const agentId = resolvedParams.id;
  const agent = ALL_AGENTS[agentId] ?? ALL_AGENTS["claude-code"]!;
  const logs = ALL_LOGS[agentId] ?? [];

  const [status, setStatus] = useState<"idle" | "active" | "paused">(agent.status);
  const [copiedKey, setCopiedKey] = useState(false);
  const [showRotateDialog, setShowRotateDialog] = useState(false);
  const [rotatedKey, setRotatedKey] = useState<string | null>(null);

  const togglePause = () => {
    setStatus(status === "paused" ? "idle" : "paused");
  };

  const handleRotateKey = () => {
    const generated = `ep_live_rot_${Math.random().toString(16).substring(2, 18)}`;
    setRotatedKey(generated);
    setShowRotateDialog(true);
  };

  return (
    <section className="space-y-6 bg-black p-6 md:p-8 rounded-xl border border-neutral-800 text-white min-h-[85vh]">
      <div className="flex items-center gap-2 text-sm text-[#FF6B2D] mb-2 font-semibold">
        <Link href="/agents" className="hover:underline">
          &larr; Back to Agent Hub
        </Link>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-neutral-800 pb-4 gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-extrabold tracking-tight text-white">{agent.name}</h1>
            <Badge variant={status === "active" ? "success" : status === "paused" ? "warning" : "neutral"}>
              {status.toUpperCase()}
            </Badge>
          </div>
          <p className="text-sm text-neutral-500 mt-1">Type: {agent.type} | ID: {agent.id}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button onClick={togglePause} variant="secondary" className="text-xs bg-neutral-850 hover:bg-neutral-800 border-neutral-850 text-white font-semibold">
            {status === "paused" ? "Reactivate Agent" : "Pause Agent"}
          </Button>
          <Button onClick={handleRotateKey} className="text-xs bg-[#FF6B2D] border-[#FF6B2D] hover:bg-[#E85A1F] text-black font-semibold">
            Rotate Access Key
          </Button>
        </div>
      </div>

      {/* Metrics strip */}
      <div className="grid gap-3 grid-cols-2 md:grid-cols-4">
        <Card className="bg-[#181818] border-neutral-800 text-white">
          <CardContent className="py-4 space-y-1">
            <span className="text-xs text-neutral-500 uppercase font-semibold">Total Logs</span>
            <p className="text-3xl font-bold tracking-tight text-[#FF6B2D]">{logs.length}</p>
          </CardContent>
        </Card>
        <Card className="bg-[#181818] border-neutral-800 text-white">
          <CardContent className="py-4 space-y-1">
            <span className="text-xs text-neutral-500 uppercase font-semibold">Success Rate</span>
            <p className="text-3xl font-bold tracking-tight text-emerald-500">
              {logs.length > 0 ? `${Math.round((logs.filter(l => l.status !== "error").length / logs.length) * 100)}%` : "100%"}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-[#181818] border-neutral-800 text-white">
          <CardContent className="py-4 space-y-1">
            <span className="text-xs text-neutral-500 uppercase font-semibold">Failures</span>
            <p className="text-3xl font-bold tracking-tight text-rose-500">{logs.filter(l => l.status === "error").length}</p>
          </CardContent>
        </Card>
        <Card className="bg-[#181818] border-neutral-800 text-white">
          <CardContent className="py-4 space-y-1">
            <span className="text-xs text-neutral-500 uppercase font-semibold">Hours Scaffolding Saved</span>
            <p className="text-3xl font-bold tracking-tight text-white">{agent.hoursSaved}h</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
        {/* Main activity log timeline */}
        <div className="space-y-6">
          <Card className="bg-[#181818] border-neutral-800 text-white">
            <CardHeader className="border-neutral-800">
              <CardTitle className="text-white">Activity Trace Logs</CardTitle>
              <CardDescription className="text-neutral-500">Detailed transaction trace of workspace events.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {logs.length > 0 ? (
                <div className="divide-y divide-neutral-800 text-sm font-mono">
                  {logs.map(log => (
                    <div key={log.id} className="p-4 hover:bg-neutral-900/35 transition-colors space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-neutral-500">{new Date(log.timestamp).toLocaleTimeString()}</span>
                          <span className="text-white font-bold font-sans">[{log.action}]</span>
                          <Badge variant={log.status === "success" ? "success" : log.status === "warning" ? "warning" : "danger"}>
                            {log.status.toUpperCase()}
                          </Badge>
                        </div>
                        <span className="text-neutral-400 text-xs font-sans">{log.project}</span>
                      </div>
                      
                      <p className="text-neutral-300 font-sans">{log.message}</p>
                      
                      {log.filesTouched.length > 0 && (
                        <div className="space-y-1">
                          <span className="text-[10px] text-neutral-500 uppercase font-bold tracking-wider font-sans">Files Touched:</span>
                          <div className="flex flex-wrap gap-1.5">
                            {log.filesTouched.map(f => (
                              <span key={f} className="text-xs bg-black/60 border border-neutral-850 px-2 py-0.5 rounded text-neutral-400 font-mono">
                                {f}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-neutral-500 font-sans">No activity logs recorded for this agent yet.</div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Side Panel: permissions/scope & key state */}
        <div className="space-y-6">
          <Card className="bg-[#181818] border-neutral-800 text-white">
            <CardHeader className="border-neutral-800">
              <CardTitle className="text-white">Permissions Scope</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-xs">
              <div className="space-y-2">
                <span className="text-neutral-500 font-bold block uppercase tracking-wider">AUTHORIZED ACTIONS</span>
                <div className="space-y-1.5">
                  {agent.allowedScope.map(scope => (
                    <div key={scope} className="flex items-center justify-between p-2 bg-black/40 border border-neutral-855 rounded font-mono text-[#FF6B2D]">
                      <span>{scope}</span>
                      <Badge variant="success" className="text-[10px] py-0 h-4 bg-emerald-950 text-emerald-300 border-emerald-800">OK</Badge>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-neutral-800 pt-3 space-y-1.5">
                <span className="text-neutral-500 font-bold block uppercase tracking-wider">LINKED WORKSPACE</span>
                <span className="font-mono text-neutral-300 block">D:/Users/zakio/Desktop/Work/Epioso/epioso-brain</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#181818] border-neutral-800 text-white">
            <CardHeader className="border-neutral-800">
              <CardTitle className="text-white">Local Token Security</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="space-y-1">
                <span className="text-neutral-500 block">ACTIVE TOKEN PREFIX</span>
                <span className="font-mono text-white text-sm block">ep_live_9f82d...</span>
              </div>

              <div className="space-y-1">
                <span className="text-neutral-500 block">KEY ROTATION POLICY</span>
                <span className="text-neutral-400 block leading-normal">
                  Rotate keys immediately if the hosting sandbox or local project credentials change.
                </span>
              </div>

              <div className="border-t border-neutral-800 pt-2 text-[10px] text-neutral-500 leading-normal">
                Credentials are encrypted and stored in local workspace SQLite db.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Rotate Key Dialog */}
      {showRotateDialog && rotatedKey && (
        <div className="fixed inset-0 bg-neutral-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#181818] border border-neutral-800 p-6 rounded-xl max-w-md w-full space-y-4">
            <h4 className="text-lg font-bold text-white">Access Token Rotated</h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Copy this rotated key token. It will not be shown again. Update your local client config environment variables with this new key.
            </p>
            <div className="bg-black border border-neutral-800 p-3 rounded font-mono text-sm break-all text-white select-all">
              {rotatedKey}
            </div>
            <div className="flex justify-end pt-2">
              <Button onClick={() => setShowRotateDialog(false)} className="bg-[#FF6B2D] border-[#FF6B2D] hover:bg-[#E85A1F] text-black">
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
