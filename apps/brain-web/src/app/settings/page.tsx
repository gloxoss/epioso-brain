"use client";

import { useState } from "react";
import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle, PageHeader } from "../../components/ui";

interface SettingsState {
  workspaceRoots: string[];
  ignorePatterns: string[];
  staleThresholdDays: number;
  apiKeys: { id: string; name: string; prefix: string; created: string; status: "active" | "revoked" }[];
  scanSchedule: string;
  commandPolicy: "strict-approval" | "semi-autonomous" | "fully-autonomous";
  demoMode: boolean;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<SettingsState>({
    workspaceRoots: ["D:/Users/zakio/Desktop/Work/Epioso/epioso-brain"],
    ignorePatterns: ["**/node_modules/**", "**/.next/**", "**/dist/**", "**/cache/**"],
    staleThresholdDays: 30,
    apiKeys: [
      { id: "1", name: "Codex Editor Key", prefix: "ep_live_9f82...", created: "2026-05-15", status: "active" },
      { id: "2", name: "n8n Webhook Key", prefix: "ep_live_2a77...", created: "2026-05-20", status: "active" },
      { id: "3", name: "Claude CLI Temp Key", prefix: "ep_temp_b32e...", created: "2026-05-01", status: "revoked" }
    ],
    scanSchedule: "0 */4 * * * (Every 4 hours)",
    commandPolicy: "strict-approval",
    demoMode: false
  });

  const [inputRoot, setInputRoot] = useState("");
  const [inputPattern, setInputPattern] = useState("");
  const [inputKeyName, setInputKeyName] = useState("");
  const [showKeyDialog, setShowKeyDialog] = useState(false);
  const [newKey, setNewKey] = useState<string | null>(null);

  const addRoot = () => {
    if (!inputRoot.trim()) return;
    setSettings({
      ...settings,
      workspaceRoots: [...settings.workspaceRoots, inputRoot]
    });
    setInputRoot("");
  };

  const removeRoot = (path: string) => {
    setSettings({
      ...settings,
      workspaceRoots: settings.workspaceRoots.filter(r => r !== path)
    });
  };

  const addPattern = () => {
    if (!inputPattern.trim()) return;
    setSettings({
      ...settings,
      ignorePatterns: [...settings.ignorePatterns, inputPattern]
    });
    setInputPattern("");
  };

  const removePattern = (pat: string) => {
    setSettings({
      ...settings,
      ignorePatterns: settings.ignorePatterns.filter(p => p !== pat)
    });
  };

  const createApiKey = () => {
    if (!inputKeyName.trim()) return;
    const generated = `ep_live_${Math.random().toString(16).substring(2, 18)}${Math.random().toString(16).substring(2, 18)}`;
    setNewKey(generated);
    setSettings({
      ...settings,
      apiKeys: [
        ...settings.apiKeys,
        {
          id: String(settings.apiKeys.length + 1),
          name: inputKeyName,
          prefix: `${generated.substring(0, 11)}...`,
          created: new Date().toISOString().split("T")[0]!,
          status: "active"
        }
      ]
    });
    setInputKeyName("");
    setShowKeyDialog(true);
  };

  const revokeKey = (id: string) => {
    setSettings({
      ...settings,
      apiKeys: settings.apiKeys.map(k => k.id === id ? { ...k, status: "revoked" as const } : k)
    });
  };

  return (
    <section className="space-y-6 bg-black p-6 md:p-8 rounded-xl border border-neutral-800 text-white">
      <PageHeader
        eyebrow="LOCAL POLICY / CONTROL"
        title="Settings"
        description="Configure workspace boundaries, scan policies, local API access keys, and execution guardrails."
        className="text-white"
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_22rem]">
        {/* Main Settings Panel */}
        <div className="space-y-6">
          {/* Section 1: Workspace Roots (Warm Paper Layout) */}
          <div className="bg-[#EDE8E4] text-neutral-950 p-6 rounded-xl shadow-md space-y-4">
            <h3 className="text-lg font-bold text-neutral-900">Workspace Roots</h3>
            <p className="text-sm text-neutral-700 leading-relaxed">
              Folders added here will be recursively scanned by AgentOS indexers. Local code symbols, markdown logs, and skills will be monitored automatically.
            </p>
            <div className="space-y-2">
              {settings.workspaceRoots.map(root => (
                <div key={root} className="flex items-center justify-between p-3 bg-white/80 border border-neutral-300 rounded-lg text-sm font-mono">
                  <span className="truncate mr-4 text-neutral-900">{settings.demoMode ? "[REDACTED_PATH]" : root}</span>
                  <button onClick={() => removeRoot(root)} className="text-rose-700 font-semibold text-xs hover:underline">Remove</button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="D:/Users/zakio/Desktop/Work/..."
                value={inputRoot}
                onChange={(e) => setInputRoot(e.target.value)}
                className="flex-1 bg-white border border-neutral-300 rounded px-3 py-1.5 text-sm"
              />
              <Button onClick={addRoot} className="bg-neutral-900 border-neutral-900 text-white hover:bg-neutral-800">Add Root</Button>
            </div>
          </div>

          {/* Section 2: Ignore Patterns & Stale Threshold */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="bg-[#181818] border-neutral-800 text-white">
              <CardHeader className="border-neutral-800">
                <CardTitle className="text-white">Ignore Patterns</CardTitle>
                <CardDescription className="text-neutral-400">Files and paths to bypass during workspace scans.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-1 bg-black/40 rounded border border-neutral-800">
                  {settings.ignorePatterns.map(pat => (
                    <Badge key={pat} className="bg-neutral-800 border-neutral-700 text-neutral-300 flex items-center gap-1.5">
                      <span className="font-mono text-xs">{pat}</span>
                      <button onClick={() => removePattern(pat)} className="text-[#FF6B2D] font-bold text-xs hover:text-white">&times;</button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="**/dist/**"
                    value={inputPattern}
                    onChange={(e) => setInputPattern(e.target.value)}
                    className="flex-1 bg-black border border-neutral-800 text-white rounded px-2.5 py-1 text-xs"
                  />
                  <Button size="sm" onClick={addPattern} className="bg-[#FF6B2D] text-black border-[#FF6B2D] hover:bg-[#E85A1F]">Add</Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#181818] border-neutral-800 text-white">
              <CardHeader className="border-neutral-800">
                <CardTitle className="text-white">Scan Schedules</CardTitle>
                <CardDescription className="text-neutral-400">Configure background indexing intervals and thresholds.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-400 uppercase mb-1">Background Scan Schedule</label>
                  <input
                    type="text"
                    value={settings.scanSchedule}
                    onChange={(e) => setSettings({ ...settings, scanSchedule: e.target.value })}
                    className="w-full bg-black border border-neutral-800 text-white rounded px-3 py-1.5 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-400 uppercase mb-1">Skill Stale Threshold (Days)</label>
                  <input
                    type="number"
                    value={settings.staleThresholdDays}
                    onChange={(e) => setSettings({ ...settings, staleThresholdDays: Number(e.target.value) })}
                    className="w-full bg-black border border-neutral-800 text-white rounded px-3 py-1.5 text-xs font-mono"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Section 3: Agent API Keys */}
          <Card className="bg-[#181818] border-neutral-800 text-white">
            <CardHeader className="border-neutral-800">
              <CardTitle className="text-white font-bold">Agent API Keys</CardTitle>
              <CardDescription className="text-neutral-400">
                Local-only API tokens used by CLI/MCP clients to authenticate activity reporting into AgentOS.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="divide-y divide-neutral-800">
                {settings.apiKeys.map(k => (
                  <div key={k.id} className="flex items-center justify-between py-3">
                    <div>
                      <p className="font-semibold text-sm">{k.name}</p>
                      <p className="text-xs text-neutral-500 font-mono mt-0.5">Prefix: {k.prefix} | Created: {k.created}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={k.status === "active" ? "success" : "danger"}>
                        {k.status.toUpperCase()}
                      </Badge>
                      {k.status === "active" && (
                        <button
                          onClick={() => revokeKey(k.id)}
                          className="text-xs font-semibold text-rose-500 hover:text-rose-400 hover:underline"
                        >
                          Revoke
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 border-t border-neutral-800 pt-4">
                <input
                  type="text"
                  placeholder="Key Name (e.g. Claude Code CLI)"
                  value={inputKeyName}
                  onChange={(e) => setInputKeyName(e.target.value)}
                  className="flex-1 bg-black border border-neutral-800 text-white rounded px-3 py-1.5 text-xs"
                />
                <Button size="sm" onClick={createApiKey} className="bg-[#FF6B2D] text-black border-[#FF6B2D] hover:bg-[#E85A1F]">
                  Generate Key
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Sticky Summary: Safety posture */}
        <div className="space-y-6">
          <div className="bg-[#181818] border border-neutral-800 p-5 rounded-xl space-y-4 text-sm h-fit">
            <p className="text-xs font-bold uppercase tracking-widest text-[#FF6B2D]">SAFETY POSTURE</p>

            <div className="space-y-4">
              <div>
                <span className="text-xs text-neutral-500 block">COMMAND EXECUTION POLICY</span>
                <select
                  value={settings.commandPolicy}
                  onChange={(e) => setSettings({ ...settings, commandPolicy: e.target.value as any })}
                  className="w-full bg-black border border-neutral-800 text-white rounded px-2.5 py-1.5 text-xs font-semibold mt-1"
                >
                  <option value="strict-approval">Strict Human Approval Required</option>
                  <option value="semi-autonomous">Semi-Autonomous (Read Only)</option>
                  <option value="fully-autonomous">Fully Autonomous (Dangerous)</option>
                </select>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div>
                  <span className="font-semibold block text-sm">Demo Redaction Mode</span>
                  <span className="text-xs text-neutral-500">Mask absolute disk paths in the UI.</span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.demoMode}
                  onChange={() => setSettings({ ...settings, demoMode: !settings.demoMode })}
                  className="accent-[#FF6B2D] size-4 rounded"
                />
              </div>

              <div className="border-t border-neutral-800 pt-3">
                <span className="text-xs text-neutral-500 block">COMPLIANCE RATING</span>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="success" className="bg-emerald-950 text-emerald-300 border-emerald-800">
                    LOCAL-ONLY (100%)
                  </Badge>
                  <span className="text-xs text-neutral-400">Zero Cloud Sync</span>
                </div>
              </div>

              <div className="text-xs text-neutral-500 leading-normal pt-2">
                AgentOS uses a local SQLite registry. External endpoints are only queried when testing connected models.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* API Key Modal */}
      {showKeyDialog && newKey && (
        <div className="fixed inset-0 bg-neutral-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#181818] border border-neutral-800 p-6 rounded-xl max-w-md w-full space-y-4">
            <h4 className="text-lg font-bold text-white">New API Key Generated</h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Copy this token now. For security purposes, this token will not be displayed again after you close this dialog.
            </p>
            <div className="bg-black border border-neutral-800 p-3 rounded font-mono text-sm break-all text-white select-all flex items-center justify-between">
              <span>{newKey}</span>
            </div>
            <div className="flex justify-end pt-2">
              <Button onClick={() => setShowKeyDialog(false)} className="bg-[#FF6B2D] border-[#FF6B2D] hover:bg-[#E85A1F] text-black">
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
