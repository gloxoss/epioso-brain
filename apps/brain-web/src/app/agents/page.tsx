"use client";

import { useState } from "react";
import Link from "next/link";
import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle, PageHeader } from "../../components/ui";

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
  agentName: string;
  action: string;
  project: string;
  status: "success" | "warning" | "error";
  message: string;
}

export default function AgentHubPage() {
  const [agents, setAgents] = useState<Agent[]>([
    { id: "codex", name: "Codex Editor Agent", type: "IDE Extension", status: "idle", lastActivity: "2026-06-02T02:30:00Z", allowedScope: ["read_file", "write_file", "search"], hoursSaved: 48 },
    { id: "claude-code", name: "Claude Code CLI", type: "Terminal Agent", status: "active", lastActivity: "2026-06-02T02:40:00Z", allowedScope: ["read_file", "write_file", "run_command", "mcp"], hoursSaved: 104 },
    { id: "hermes", name: "Hermes Variant Agent", type: "Creative Writer", status: "idle", lastActivity: "2026-06-01T18:15:00Z", allowedScope: ["read_file", "write_file", "search_web"], hoursSaved: 32 },
    { id: "n8n-runner", name: "n8n Automation Agent", type: "Workflow Executor", status: "active", lastActivity: "2026-06-02T02:38:00Z", allowedScope: ["mcp", "execute_url"], hoursSaved: 56 }
  ]);

  const [logs, setLogs] = useState<ActivityLog[]>([
    { id: "log-1", timestamp: "2026-06-02T02:40:00Z", agentName: "Claude Code CLI", action: "Run Type-Check", project: "EPIOSO Brain", status: "success", message: "Successfully executed npm run type-check." },
    { id: "log-2", timestamp: "2026-06-02T02:38:00Z", agentName: "n8n Automation Agent", action: "Client Report Draft", project: "MediCore Healthcare", status: "success", message: "Generated daily summary report for Fez Clinic scoping." },
    { id: "log-3", timestamp: "2026-06-02T02:35:00Z", agentName: "Claude Code CLI", action: "Modify tsconfig.json", project: "EPIOSO Brain", status: "warning", message: "Configured local typeRoots. Overrode implicit type declaration mappings." },
    { id: "log-4", timestamp: "2026-06-02T02:30:00Z", agentName: "Codex Editor Agent", action: "Write settings.tsx", project: "EPIOSO Brain", status: "success", message: "Created settings component framework." },
    { id: "log-5", timestamp: "2026-06-02T02:15:00Z", agentName: "n8n Automation Agent", action: "Publish Post", project: "EPIOSO Content", status: "error", message: "Failed to publish variant draft. Hostinger server refused connection (500)." }
  ]);

  const [filterProject, setFilterProject] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showRegisterDialog, setShowRegisterDialog] = useState(false);
  const [newAgentName, setNewAgentName] = useState("");
  const [newAgentType, setNewAgentType] = useState("MCP Server");
  const [newAgentScopes, setNewAgentScopes] = useState<string[]>([]);
  const [apiKeyCreated, setApiKeyCreated] = useState<string | null>(null);

  const toggleScope = (scope: string) => {
    if (newAgentScopes.includes(scope)) {
      setNewAgentScopes(newAgentScopes.filter(s => s !== scope));
    } else {
      setNewAgentScopes([...newAgentScopes, scope]);
    }
  };

  const handleRegisterAgent = () => {
    if (!newAgentName.trim()) return;
    const id = newAgentName.toLowerCase().replace(/\s+/g, "-");
    const generatedKey = `ep_live_${Math.random().toString(16).substring(2, 18)}`;
    
    setAgents([
      ...agents,
      {
        id,
        name: newAgentName,
        type: newAgentType,
        status: "idle",
        lastActivity: new Date().toISOString(),
        allowedScope: newAgentScopes,
        hoursSaved: 0
      }
    ]);
    setApiKeyCreated(generatedKey);
  };

  const filteredLogs = logs.filter(l => {
    const projectMatch = filterProject === "all" || l.project === filterProject;
    const statusMatch = filterStatus === "all" || l.status === filterStatus;
    return projectMatch && statusMatch;
  });

  return (
    <section className="space-y-6 bg-black p-6 md:p-8 rounded-xl border border-neutral-800 text-white">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <PageHeader
          eyebrow="CONTROL / ACTIVITY"
          title="Agent Hub"
          description="Register and manage active agent scopes, monitor runtimes, and trace command logs."
          className="text-white"
        />
        <Button onClick={() => {
          setNewAgentName("");
          setNewAgentScopes([]);
          setApiKeyCreated(null);
          setShowRegisterDialog(true);
        }} className="bg-[#FF6B2D] border-[#FF6B2D] hover:bg-[#E85A1F] text-black font-semibold h-10 px-5 rounded-md">
          Register Agent
        </Button>
      </div>

      {/* KPI strip */}
      <div className="grid gap-3 grid-cols-2 md:grid-cols-4">
        <Card className="bg-[#181818] border-neutral-800 text-white">
          <CardContent className="py-4 space-y-1">
            <span className="text-xs text-neutral-500 uppercase font-semibold">Active Agents</span>
            <p className="text-3xl font-bold tracking-tight text-[#FF6B2D]">{agents.filter(a => a.status === "active").length}</p>
          </CardContent>
        </Card>
        <Card className="bg-[#181818] border-neutral-800 text-white">
          <CardContent className="py-4 space-y-1">
            <span className="text-xs text-neutral-500 uppercase font-semibold">Logs Today</span>
            <p className="text-3xl font-bold tracking-tight text-white">{logs.length}</p>
          </CardContent>
        </Card>
        <Card className="bg-[#181818] border-neutral-800 text-white">
          <CardContent className="py-4 space-y-1">
            <span className="text-xs text-neutral-500 uppercase font-semibold">Failed Tasks</span>
            <p className="text-3xl font-bold tracking-tight text-rose-500">{logs.filter(l => l.status === "error").length}</p>
          </CardContent>
        </Card>
        <Card className="bg-[#181818] border-neutral-800 text-white">
          <CardContent className="py-4 space-y-1">
            <span className="text-xs text-neutral-500 uppercase font-semibold">Total Hours Saved</span>
            <p className="text-3xl font-bold tracking-tight text-emerald-500">{agents.reduce((acc, a) => acc + a.hoursSaved, 0)}h</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
        {/* Left Column: Agent Cards Grid */}
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            {agents.map(a => (
              <Card key={a.id} className="bg-[#181818] border-neutral-800 hover:border-neutral-700 transition-colors text-white">
                <CardHeader className="border-neutral-800 flex flex-row items-center justify-between pb-2">
                  <div>
                    <Link href={`/agents/${a.id}`} className="hover:text-[#FF6B2D] transition-colors">
                      <CardTitle className="text-white text-base font-bold">{a.name}</CardTitle>
                    </Link>
                    <CardDescription className="text-neutral-500 text-xs mt-0.5">{a.type}</CardDescription>
                  </div>
                  <Badge variant={a.status === "active" ? "success" : a.status === "paused" ? "warning" : "neutral"}>
                    {a.status.toUpperCase()}
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-3 pb-3">
                  <div className="space-y-1">
                    <span className="text-[10px] text-neutral-500 uppercase font-bold tracking-wider block">Allowed Scope</span>
                    <div className="flex flex-wrap gap-1">
                      {a.allowedScope.map(s => (
                        <Badge key={s} className="bg-black/50 text-neutral-300 border-neutral-800 text-[10px] py-0 h-5">
                          {s}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between border-t border-neutral-800/60 pt-2 text-xs">
                    <span className="text-neutral-500">Last activity:</span>
                    <span className="font-mono text-neutral-300">{new Date(a.lastActivity).toLocaleTimeString()}</span>
                  </div>
                </CardContent>
                <div className="border-t border-neutral-800/80 px-4 py-2 flex justify-between bg-black/20 rounded-b-lg">
                  <span className="text-xs text-neutral-500">Saved: <strong className="text-emerald-500 font-semibold">{a.hoursSaved}h</strong></span>
                  <Link href={`/agents/${a.id}`} className="text-xs text-[#FF6B2D] font-semibold hover:underline">
                    Inspect agent &rarr;
                  </Link>
                </div>
              </Card>
            ))}
          </div>

          {/* Activity Timeline / Log */}
          <Card className="bg-[#181818] border-neutral-800 text-white">
            <CardHeader className="border-neutral-800 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div>
                <CardTitle className="text-white">Activity Trace Logs</CardTitle>
                <CardDescription className="text-neutral-500">Real-time reports sent by authenticated agents.</CardDescription>
              </div>
              <div className="flex flex-wrap gap-2 text-xs">
                <select
                  value={filterProject}
                  onChange={(e) => setFilterProject(e.target.value)}
                  className="bg-black border border-neutral-800 text-white px-2 py-1 rounded"
                >
                  <option value="all">All Projects</option>
                  <option value="EPIOSO Brain">EPIOSO Brain</option>
                  <option value="MediCore Healthcare">MediCore Healthcare</option>
                  <option value="EPIOSO Content">EPIOSO Content</option>
                </select>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="bg-black border border-neutral-800 text-white px-2 py-1 rounded"
                >
                  <option value="all">All Statuses</option>
                  <option value="success">Success</option>
                  <option value="warning">Warning</option>
                  <option value="error">Error</option>
                </select>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-neutral-800 font-mono text-xs">
                {filteredLogs.length > 0 ? (
                  filteredLogs.map(log => (
                    <div key={log.id} className="p-3.5 hover:bg-neutral-900/30 transition-colors flex flex-col md:flex-row md:items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-neutral-500">{new Date(log.timestamp).toLocaleTimeString()}</span>
                          <span className="text-[#FF6B2D] font-bold">[{log.agentName}]</span>
                          <Badge className="text-[10px] h-4 leading-none" variant={log.status === "success" ? "success" : log.status === "warning" ? "warning" : "danger"}>
                            {log.status.toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-neutral-300 font-sans">{log.message}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-neutral-400 block text-[10px] uppercase font-bold tracking-wider">{log.action}</span>
                        <span className="text-neutral-500 block text-[11px] mt-0.5">{log.project}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-neutral-500 font-sans">
                    No trace logs match the selected filters.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Panel: Webhook status */}
        <div className="space-y-6">
          <Card className="bg-[#181818] border-neutral-800 text-white">
            <CardHeader className="border-neutral-800">
              <CardTitle className="text-white">Webhook Connection</CardTitle>
              <CardDescription className="text-neutral-500">Expose a local hook for agents to report their trace logs.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-xs">
              <div className="space-y-1">
                <span className="text-neutral-500 block">POST WEBHOOK URL</span>
                <div className="bg-black border border-neutral-800 p-2.5 rounded text-white font-mono break-all select-all flex items-center justify-between">
                  <span>http://127.0.0.1:4000/agents/log</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-neutral-500 block">WEBHOOK AUTH STATUS</span>
                <div className="flex items-center gap-2">
                  <Badge variant="success">ENABLED</Badge>
                  <span className="text-neutral-400">Tokens validated locally</span>
                </div>
              </div>

              <div className="border-t border-neutral-800 pt-3 space-y-2">
                <span className="text-neutral-500 font-bold block">Quick Runbook (cURL)</span>
                <pre className="bg-black p-2.5 border border-neutral-800 rounded font-mono text-[10px] text-neutral-400 whitespace-pre-wrap leading-normal">
{`curl -X POST http://127.0.0.1:4000/agents/log \\
  -H "Authorization: Bearer <agent_key>" \\
  -H "Content-Type: application/json" \\
  -d '{
    "taskName": "build_scaffold",
    "status": "success",
    "project": "EPIOSO Brain",
    "message": "Scaffold built."
  }'`}
                </pre>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modal for Register Agent */}
      {showRegisterDialog && (
        <div className="fixed inset-0 bg-neutral-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#181818] border border-neutral-800 p-6 rounded-xl max-w-md w-full space-y-4">
            <h4 className="text-lg font-bold text-white">Register New Agent</h4>
            
            {!apiKeyCreated ? (
              <div className="space-y-4 text-sm text-neutral-300">
                <div className="space-y-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400">Agent Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Claude Code CLI"
                    value={newAgentName}
                    onChange={(e) => setNewAgentName(e.target.value)}
                    className="w-full bg-black border border-neutral-800 text-white rounded px-3 py-2 text-sm"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400">Agent Type</label>
                  <select
                    value={newAgentType}
                    onChange={(e) => setNewAgentType(e.target.value)}
                    className="w-full bg-black border border-neutral-800 text-white rounded px-3 py-2 text-sm"
                  >
                    <option>Terminal CLI</option>
                    <option>IDE extension</option>
                    <option>MCP Server</option>
                    <option>Cron Worker</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400">Permissions Scopes</label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {["read_file", "write_file", "run_command", "mcp", "search_web", "execute_url"].map(scope => (
                      <label key={scope} className="flex items-center gap-2 cursor-pointer p-1.5 bg-black/40 rounded border border-neutral-850">
                        <input
                          type="checkbox"
                          checked={newAgentScopes.includes(scope)}
                          onChange={() => toggleScope(scope)}
                          className="accent-[#FF6B2D]"
                        />
                        <span>{scope}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button variant="secondary" onClick={() => setShowRegisterDialog(false)}>Cancel</Button>
                  <Button onClick={handleRegisterAgent} className="bg-[#FF6B2D] border-[#FF6B2D] hover:bg-[#E85A1F] text-black">
                    Register
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-xs text-neutral-400 leading-normal">
                  Agent successfully registered. Copy this token key. It will not be shown again.
                </p>
                <div className="bg-black border border-neutral-800 p-3 rounded font-mono text-sm break-all text-white select-all">
                  {apiKeyCreated}
                </div>
                <div className="flex justify-end pt-2">
                  <Button onClick={() => setShowRegisterDialog(false)} className="bg-[#FF6B2D] border-[#FF6B2D] text-black hover:bg-[#E85A1F]">
                    Done
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
