"use client";

import { useState } from "react";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  PageHeader,
} from "../../components/ui";
import { mockPocArtifacts, type PocArtifact } from "../../lib/intelligence-mock-data";

export default function PocLabPage() {
  const [artifacts, setArtifacts] = useState<readonly PocArtifact[]>(mockPocArtifacts);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPoc, setNewPoc] = useState({ name: "", type: "Dashboard" as const, purpose: "", dataSources: "", notes: "" });

  const testingCount = artifacts.filter((a) => a.status === "Testing").length;
  const promotedCount = artifacts.filter((a) => a.status === "Promoted").length;
  const discardedCount = artifacts.filter((a) => a.status === "Discarded").length;
  const usedThisWeekCount = artifacts.reduce((acc, a) => acc + (a.status === "Testing" ? a.usageCount : 0), 0);
  const needsDecisionCount = artifacts.filter((a) => a.status === "Testing" && a.usageCount >= 10).length;

  const handleCreatePoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPoc.name.trim() || !newPoc.purpose.trim()) return;

    const created: PocArtifact = {
      id: `poc-${Date.now()}`,
      name: newPoc.name.trim(),
      type: newPoc.type,
      purpose: newPoc.purpose.trim(),
      dataSources: newPoc.dataSources.split(",").map((s) => s.trim()).filter(Boolean),
      usageCount: 0,
      status: "Testing",
      dateCreated: new Date().toISOString().split("T")[0]!,
      notes: newPoc.notes.trim()
    };

    setArtifacts((prev) => [created, ...prev]);
    setNewPoc({ name: "", type: "Dashboard", purpose: "", dataSources: "", notes: "" });
    setShowCreateModal(false);
  };

  const handleDecision = (id: string, status: "Promoted" | "Discarded" | "Testing") => {
    setArtifacts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status } : a))
    );
  };

  const handleIncrementUsage = (id: string) => {
    setArtifacts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, usageCount: a.usageCount + 1 } : a))
    );
  };

  const typeBadgeColors = {
    Dashboard: "info",
    Report: "neutral",
    Workflow: "success"
  } as const;

  return (
    <section className="space-y-6">
      <PageHeader
        description="Registry of lightweight dashboard cards, analytical scripts, and workflows. Evaluates prototypes before they are coded as custom codebase modules."
        eyebrow="TEST BEFORE BUILD"
        title="POC Lab"
        actions={
          <Button onClick={() => setShowCreateModal(true)}>
            Register New POC
          </Button>
        }
      />

      {/* KPI strip */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardContent className="pt-4 space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Active Testing</p>
            <p className="text-3xl font-bold text-neutral-900">{testingCount}</p>
            <p className="text-xs text-neutral-500">Prototypes in evaluation</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Promoted</p>
            <p className="text-3xl font-bold text-emerald-600">{promotedCount}</p>
            <p className="text-xs text-neutral-500">Coded into core system</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Discarded</p>
            <p className="text-3xl font-bold text-neutral-400">{discardedCount}</p>
            <p className="text-xs text-neutral-500">Archived to prevent bloat</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">POC Hits This Week</p>
            <p className="text-3xl font-bold text-[#FF6B2D]">{usedThisWeekCount}</p>
            <p className="text-xs text-neutral-500">Manual review trigger count</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Needs Decision</p>
            <p className="text-3xl font-bold text-rose-600">{needsDecisionCount}</p>
            <p className="text-xs text-neutral-500">Usage count &gt;= 10 times</p>
          </CardContent>
        </Card>
      </div>

      {showCreateModal && (
        <Card className="border-[#FF6B2D]/30 bg-[#EDE8E4]/20">
          <CardHeader>
            <CardTitle>Register New Prototype (POC)</CardTitle>
            <CardDescription>Document what you are testing to prevent building custom modules prematurely.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreatePoc} className="space-y-3 text-xs">
              <div className="grid gap-3 md:grid-cols-2">
                <div className="space-y-1">
                  <label className="font-bold text-neutral-700">Prototype Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. LiteLLM custom pricing calculator"
                    value={newPoc.name}
                    onChange={(e) => setNewPoc({ ...newPoc, name: e.target.value })}
                    className="w-full rounded border border-neutral-300 px-2.5 py-1.5 text-neutral-800"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-neutral-700">Prototype Type</label>
                  <select
                    value={newPoc.type}
                    onChange={(e) => setNewPoc({ ...newPoc, type: e.target.value as any })}
                    className="w-full rounded border border-neutral-300 px-2.5 py-1.5 text-neutral-850 bg-white"
                  >
                    <option value="Dashboard">Dashboard</option>
                    <option value="Report">Report</option>
                    <option value="Workflow">Workflow</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-neutral-700">Purpose & Metric of Success</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Must save 30 mins during project audits. Dismisses when manual CSV imports stop."
                  value={newPoc.purpose}
                  onChange={(e) => setNewPoc({ ...newPoc, purpose: e.target.value })}
                  className="w-full rounded border border-neutral-300 px-2.5 py-1.5 text-neutral-850"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-neutral-700">Data Sources (comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Local logs, n8n config file"
                  value={newPoc.dataSources}
                  onChange={(e) => setNewPoc({ ...newPoc, dataSources: e.target.value })}
                  className="w-full rounded border border-neutral-300 px-2.5 py-1.5 text-neutral-850"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-neutral-700">Notes / Prototype Links</label>
                <textarea
                  placeholder="Where the code snippet or spreadsheet resides..."
                  value={newPoc.notes}
                  onChange={(e) => setNewPoc({ ...newPoc, notes: e.target.value })}
                  rows={2}
                  className="w-full rounded border border-neutral-300 px-2.5 py-1.5 text-neutral-850"
                />
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <Button type="submit">Add to Registry</Button>
                <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Main Grid of Cards */}
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {artifacts
              .filter((a) => a.status === "Testing")
              .map((a) => (
                <Card key={a.id} className="border-l-4 border-l-[#FF6B2D] flex flex-col justify-between">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <Badge variant={typeBadgeColors[a.type]}>{a.type}</Badge>
                      <span className="text-[10px] font-mono text-neutral-500">Created: {a.dateCreated}</span>
                    </div>
                    <CardTitle className="mt-1 text-base">{a.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 flex-1 flex flex-col justify-between">
                    <p className="text-xs text-neutral-600 leading-normal">{a.purpose}</p>

                    <div className="bg-neutral-50 p-2 rounded border border-neutral-100 font-mono text-[10px] text-neutral-500 space-y-1">
                      <p className="truncate">Data: {a.dataSources.join(", ")}</p>
                      <p>Usage Hits: <strong className="text-neutral-800 text-xs">{a.usageCount}</strong></p>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-2 border-t border-neutral-100">
                      <Button size="sm" variant="secondary" className="h-7 text-xs" onClick={() => handleIncrementUsage(a.id)}>
                        Log Use Hit
                      </Button>
                      <Button size="sm" className="h-7 text-xs bg-emerald-600 hover:bg-emerald-700 border-emerald-600" onClick={() => handleDecision(a.id, "Promoted")}>
                        Promote
                      </Button>
                      <Button size="sm" variant="danger" className="h-7 text-xs border-rose-600 bg-rose-600 text-white" onClick={() => handleDecision(a.id, "Discarded")}>
                        Discard
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>

        {/* Right Side Panel: Promotion Criteria & Stats */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="bg-[#EDE8E4]/50">
              <CardTitle>Promotion Criteria Matrix</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs leading-relaxed text-neutral-600 pt-3">
              <p>To avoid dashboard fatigue and keep our codebase clean, only build when:</p>
              <ul className="list-disc list-inside space-y-1.5 text-neutral-700 font-semibold">
                <li>Usage hits exceeds 10 times in a week.</li>
                <li>Reduces workflow steps by 3+ manual clicks.</li>
                <li>Integrates with at least 2 distinct data streams.</li>
              </ul>
              <p className="border-t border-neutral-200 pt-2 text-[10px] font-mono text-neutral-500">
                Determined by 3M scaffolding logic.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>POC History Logs</CardTitle>
              <CardDescription>Decisions finalized for earlier modules.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-3 divide-y divide-neutral-150">
                {artifacts
                  .filter((a) => a.status !== "Testing")
                  .map((a) => (
                    <div key={a.id} className="pt-2.5 first:pt-0 space-y-1.5 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-neutral-800 truncate max-w-[150px]">{a.name}</span>
                        <Badge variant={a.status === "Promoted" ? "success" : "neutral"}>
                          {a.status.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-neutral-500 font-mono text-[10px]">Decision date: {a.dateCreated}</p>
                      <p className="text-neutral-600 leading-normal italic">"{a.notes}"</p>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
