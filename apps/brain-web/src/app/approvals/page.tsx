"use client";

import { useState } from "react";
import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle, PageHeader } from "../../components/ui";

interface ApprovalRequest {
  id: string;
  action: string;
  agent: string;
  riskLevel: "critical" | "high" | "medium";
  targetSystem: string;
  reason: string;
  createdTime: string;
  payload: string;
  explanation: string;
}

export default function ApprovalsPage() {
  const [requests, setRequests] = useState<ApprovalRequest[]>([
    {
      id: "appr-1",
      action: "Command Execution",
      agent: "Claude Code CLI",
      riskLevel: "critical",
      targetSystem: "powershell.exe",
      reason: "Deploy changes to production server",
      createdTime: "2026-06-02T02:30:00Z",
      payload: "ssh oussama@epioso.tech 'cd ep-prod && pm2 restart brain-api'",
      explanation: "This command runs outside the sandbox and executes remote commands on your production server. If the script contains errors, it could crash the live API."
    },
    {
      id: "appr-2",
      action: "External Webhook Send",
      agent: "n8n Automation Agent",
      riskLevel: "high",
      targetSystem: "Slack Webhook API",
      reason: "Send Scoping Summary to Fez Medical Clinic group chat",
      createdTime: "2026-06-02T02:35:00Z",
      payload: JSON.stringify({
        text: "Scoping draft compiled. Estimated budget: $12,500. Next step: sign proposal."
      }, null, 2),
      explanation: "This sends sensitive scoping and estimated pricing data externally to a third-party Slack channel. Verify that all values are correct."
    },
    {
      id: "appr-3",
      action: "File Write",
      agent: "Codex Editor Agent",
      riskLevel: "medium",
      targetSystem: "workspace/.env.local",
      reason: "Configure local port settings",
      createdTime: "2026-06-02T02:10:00Z",
      payload: "PORT=4000\nLOCAL_ONLY_API_KEY=ep_live_9f82d001...",
      explanation: "This writes environment config parameters to your disk. Risk is low since it targets local-only config."
    }
  ]);

  const [selectedId, setSelectedId] = useState<string>("appr-1");
  const [actionCount, setActionCount] = useState({ approved: 4, rejected: 1 });

  const selectedRequest = requests.find(r => r.id === selectedId) ?? requests[0];

  const handleApprove = (id: string) => {
    setRequests(requests.filter(r => r.id !== id));
    setActionCount(prev => ({ ...prev, approved: prev.approved + 1 }));
    // Auto-select another request if available
    const remaining = requests.filter(r => r.id !== id);
    if (remaining.length > 0) {
      setSelectedId(remaining[0]!.id);
    }
  };

  const handleReject = (id: string) => {
    setRequests(requests.filter(r => r.id !== id));
    setActionCount(prev => ({ ...prev, rejected: prev.rejected + 1 }));
    // Auto-select another request if available
    const remaining = requests.filter(r => r.id !== id);
    if (remaining.length > 0) {
      setSelectedId(remaining[0]!.id);
    }
  };

  return (
    <section className="space-y-6 bg-black p-6 md:p-8 rounded-xl border border-neutral-800 text-white min-h-[85vh]">
      <PageHeader
        eyebrow="GOVERNANCE / HUMAN GATE"
        title="Approvals"
        description="Verify and approve staged agent actions. Risky writes, command executions, and outbound web sends require explicit human verification."
        className="text-white"
      />

      {/* KPI strip */}
      <div className="grid gap-3 grid-cols-2 md:grid-cols-5">
        <Card className="bg-[#181818] border-neutral-800 text-white">
          <CardContent className="py-4 space-y-1">
            <span className="text-xs text-neutral-500 uppercase font-semibold">Pending Requests</span>
            <p className="text-3xl font-bold tracking-tight text-[#FF6B2D]">{requests.length}</p>
          </CardContent>
        </Card>
        <Card className="bg-[#181818] border-neutral-800 text-white">
          <CardContent className="py-4 space-y-1">
            <span className="text-xs text-neutral-500 uppercase font-semibold">Critical Risk</span>
            <p className="text-3xl font-bold tracking-tight text-rose-500">
              {requests.filter(r => r.riskLevel === "critical").length}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-[#181818] border-neutral-800 text-white">
          <CardContent className="py-4 space-y-1">
            <span className="text-xs text-neutral-500 uppercase font-semibold">Approved Today</span>
            <p className="text-3xl font-bold tracking-tight text-emerald-550">{actionCount.approved}</p>
          </CardContent>
        </Card>
        <Card className="bg-[#181818] border-neutral-800 text-white">
          <CardContent className="py-4 space-y-1">
            <span className="text-xs text-neutral-500 uppercase font-semibold">Rejected Today</span>
            <p className="text-3xl font-bold tracking-tight text-neutral-450">{actionCount.rejected}</p>
          </CardContent>
        </Card>
        <Card className="bg-[#181818] border-neutral-800 text-white">
          <CardContent className="py-4 space-y-1">
            <span className="text-xs text-neutral-500 uppercase font-semibold">Expiring Staged</span>
            <p className="text-3xl font-bold tracking-tight text-neutral-400">0</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_24rem]">
        {/* Left Column: Approval Queue & Detail Panel */}
        <div className="space-y-6">
          {requests.length > 0 ? (
            <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_1.25fr]">
              {/* Queue List */}
              <div className="space-y-3">
                <p className="text-xs font-bold uppercase tracking-widest text-[#FF6B2D]">REQUEST QUEUE</p>
                <div className="space-y-2">
                  {requests.map(r => {
                    const isSelected = r.id === selectedId;
                    return (
                      <button
                        key={r.id}
                        onClick={() => setSelectedId(r.id)}
                        className={`w-full text-left p-3.5 rounded-lg border transition-all space-y-2 ${
                          isSelected
                            ? "bg-[#242424] border-[#FF6B2D] text-white"
                            : "bg-[#181818] border-neutral-800 text-neutral-400 hover:border-neutral-700 hover:text-white"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                            r.riskLevel === "critical" ? "bg-rose-950 text-rose-350 border border-rose-900" :
                            r.riskLevel === "high" ? "bg-amber-955 text-amber-300 border border-amber-900" :
                            "bg-neutral-900 text-neutral-400 border border-neutral-800"
                          }`}>
                            {r.riskLevel.toUpperCase()}
                          </span>
                          <span className="text-xs font-mono text-neutral-500">{new Date(r.createdTime).toLocaleTimeString()}</span>
                        </div>
                        <div className="space-y-0.5">
                          <p className="font-bold text-sm text-white">{r.action}</p>
                          <p className="text-xs text-neutral-500 truncate">Agent: {r.agent}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Detail Panel (Warm Paper Layout) */}
              {selectedRequest && (
                <div className="bg-[#EDE8E4] text-neutral-950 p-6 rounded-xl flex flex-col justify-between shadow-lg h-fit space-y-6">
                  <div className="space-y-4">
                    <div className="border-b border-neutral-300 pb-3 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-bold tracking-widest text-neutral-500 uppercase">{selectedRequest.action}</span>
                        <h3 className="text-xl font-bold text-neutral-900 mt-0.5">{selectedRequest.agent}</h3>
                      </div>
                      <Badge variant={selectedRequest.riskLevel === "critical" ? "danger" : selectedRequest.riskLevel === "high" ? "warning" : "neutral"} className="text-[10px] py-0.5 px-2">
                        {selectedRequest.riskLevel.toUpperCase()}
                      </Badge>
                    </div>

                    <div className="space-y-1.5 text-xs text-neutral-800">
                      <span className="font-bold text-neutral-500 uppercase block tracking-wider">Reason:</span>
                      <p className="font-semibold text-neutral-900">{selectedRequest.reason}</p>
                    </div>

                    <div className="space-y-1.5 text-xs text-neutral-800">
                      <span className="font-bold text-neutral-500 uppercase block tracking-wider">Target Resource:</span>
                      <p className="font-mono text-neutral-900 bg-white/60 p-2 border border-neutral-300 rounded break-all">{selectedRequest.targetSystem}</p>
                    </div>

                    <div className="space-y-1.5 text-xs text-neutral-800">
                      <span className="font-bold text-neutral-500 uppercase block tracking-wider">Staged Payload Preview:</span>
                      <pre className="font-mono text-[11px] text-neutral-900 bg-white p-3 border border-neutral-300 rounded overflow-x-auto whitespace-pre-wrap leading-normal">
                        {selectedRequest.payload}
                      </pre>
                    </div>

                    <div className="space-y-1.5 text-xs bg-rose-50/50 border border-rose-200/50 p-3 rounded-lg text-rose-900">
                      <span className="font-bold block tracking-wider uppercase text-rose-950">Safety Risk Explanation:</span>
                      <p className="leading-relaxed">{selectedRequest.explanation}</p>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4 border-t border-neutral-300">
                    <Button
                      onClick={() => handleReject(selectedRequest.id)}
                      variant="secondary"
                      className="flex-1 bg-white hover:bg-neutral-50 border-neutral-350 text-rose-700 font-semibold text-xs"
                    >
                      Reject Staged Action
                    </Button>
                    <Button
                      onClick={() => handleApprove(selectedRequest.id)}
                      className="flex-1 bg-[#FF6B2D] border-[#FF6B2D] hover:bg-[#E85A1F] text-black font-semibold text-xs"
                    >
                      Approve & Execute
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-[#181818] border border-neutral-800 p-12 text-center rounded-xl">
              <span className="text-3xl block">✓</span>
              <h4 className="text-lg font-bold text-white mt-2">All Clear! No pending approvals.</h4>
              <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
                No risky agent scripts, CLI commands, or file writes are currently staged.
              </p>
            </div>
          )}
        </div>

        {/* Right Panel: Policy summary */}
        <div className="space-y-6">
          <Card className="bg-[#181818] border-neutral-800 text-white">
            <CardHeader className="border-neutral-800">
              <CardTitle className="text-white">Governance Policies</CardTitle>
              <CardDescription className="text-neutral-500">Local guardrail parameters currently active.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-xs">
              <div className="space-y-1">
                <span className="text-neutral-500 block uppercase font-bold tracking-wider">COMMAND POLICIES</span>
                <div className="bg-black/45 border border-neutral-850 p-2.5 rounded font-mono text-neutral-300 leading-normal">
                  STRICT_APPROVAL: Block all remote ssh, npm publishing, and server restarts pending user action.
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-neutral-500 block uppercase font-bold tracking-wider">FILE WRITE BOUNDS</span>
                <div className="bg-black/45 border border-neutral-850 p-2.5 rounded font-mono text-neutral-300 leading-normal font-semibold text-[#FF6B2D]">
                  RESTRICTED_ROOT: Write is only allowed inside registered workspace paths.
                </div>
              </div>

              <div className="text-[10px] text-neutral-500 leading-normal pt-2">
                Policy edits can be configured directly inside the settings page or local config file.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
