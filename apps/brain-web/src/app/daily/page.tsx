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
import { mockDailyLoopState, type DailyLoopState } from "../../lib/intelligence-mock-data";

export default function DailyLoopPage() {
  const [state, setState] = useState<DailyLoopState>(mockDailyLoopState);
  const [newPriority, setNewPriority] = useState("");
  const [newCorrection, setNewCorrection] = useState({ original: "", corrected: "", project: "" });
  const [newPaste, setNewPaste] = useState({ contentSnippet: "", source: "", target: "" });

  const handleAddPriority = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPriority.trim()) return;
    setState((current) => ({
      ...current,
      priorities: [...current.priorities, newPriority.trim()],
    }));
    setNewPriority("");
  };

  const handleAddCorrection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCorrection.original.trim() || !newCorrection.corrected.trim()) return;
    setState((current) => ({
      ...current,
      corrections: [
        ...current.corrections,
        {
          id: `corr-${Date.now()}`,
          original: newCorrection.original.trim(),
          corrected: newCorrection.corrected.trim(),
          project: newCorrection.project.trim() || "Workspace",
          category: "code",
        },
      ],
    }));
    setNewCorrection({ original: "", corrected: "", project: "" });
  };

  const handleAddPaste = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPaste.contentSnippet.trim()) return;
    setState((current) => ({
      ...current,
      manualPastes: [
        ...current.manualPastes,
        {
          id: `mp-${Date.now()}`,
          contentSnippet: newPaste.contentSnippet.trim(),
          source: newPaste.source.trim() || "External",
          target: newPaste.target.trim() || "Workspace",
          time: new Date().toISOString(),
        },
      ],
    }));
    setNewPaste({ contentSnippet: "", source: "", target: "" });
  };

  const handleCloseDay = () => {
    setState((current) => ({
      ...current,
      dayClosed: true,
    }));
    alert("Day closed. Review logs processed. Daily summary written to local workspace archive.");
  };

  return (
    <section className="space-y-6">
      <PageHeader
        description="Daily operational loop: morning planning alignment and end-of-day leverage review logs."
        eyebrow="PLAN / WORK / REVIEW"
        title="Daily Loop"
        actions={
          <Button onClick={handleCloseDay} disabled={state.dayClosed}>
            {state.dayClosed ? "Day Completed" : "Close End-of-Day Review"}
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column: Morning Plan */}
        <Card className="flex flex-col h-full">
          <CardHeader className="bg-[#EDE8E4]/40 border-b border-neutral-200">
            <CardTitle className="text-[#FF6B2D]">1. Morning Plan</CardTitle>
            <CardDescription>Daily goals, priorities, and sync schedule.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 space-y-4 pt-4">
            {/* Priorities */}
            <div className="space-y-2">
              <p className="text-xs font-bold text-neutral-700 uppercase tracking-wider">Today's Priorities</p>
              <ul className="space-y-1.5">
                {state.priorities.map((p, idx) => (
                  <li key={idx} className="flex gap-2 items-start text-xs text-neutral-800 leading-normal">
                    <span className="text-[#FF6B2D] font-bold font-mono">0{idx + 1}.</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>

              {!state.dayClosed && (
                <form onSubmit={handleAddPriority} className="flex gap-2 pt-2">
                  <input
                    type="text"
                    placeholder="Add task priority..."
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value)}
                    className="flex-1 rounded border border-neutral-300 px-2 py-1 text-xs text-neutral-800"
                  />
                  <Button type="submit" size="sm">
                    Add
                  </Button>
                </form>
              )}
            </div>

            {/* Calendar summary */}
            <div className="space-y-2 border-t border-neutral-100 pt-3">
              <p className="text-xs font-bold text-neutral-700 uppercase tracking-wider">Schedule Syncs</p>
              <div className="space-y-2">
                {state.calendarSummary.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-start text-xs bg-neutral-50 p-2 rounded border border-neutral-100">
                    <div>
                      <span className="font-mono text-neutral-500 mr-2">{item.time}</span>
                      <span className="font-semibold text-neutral-800">{item.event}</span>
                    </div>
                    <Badge variant={item.type === "client" ? "warning" : item.type === "task" ? "info" : "neutral"}>
                      {item.type}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Center Column: Actions Queue & Active Sessions */}
        <Card className="flex flex-col h-full">
          <CardHeader className="bg-[#EDE8E4]/40 border-b border-neutral-200">
            <CardTitle className="text-[#FF6B2D]">2. Today's Action Queue</CardTitle>
            <CardDescription>Staged write events and running agent sessions.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 space-y-4 pt-4">
            <div className="space-y-2">
              <p className="text-xs font-bold text-neutral-700 uppercase tracking-wider">Running Sessions</p>
              <div className="border border-neutral-250 p-3 rounded-lg space-y-2.5 bg-neutral-900 text-white font-mono text-xs">
                <div className="flex justify-between">
                  <span className="text-[#FF6B2D] font-bold">● CLAUDE CODE</span>
                  <Badge variant="private">375px Build</Badge>
                </div>
                <div className="space-y-1 text-white/80 text-[11px]">
                  <p>Obj: Build audit / bucket structures</p>
                  <p>Touched: apps/brain-web/src/app/audit/page.tsx</p>
                  <p>Status: active loop - awaiting user review</p>
                </div>
              </div>

              <div className="border border-neutral-200 p-3 rounded-lg space-y-2.5 text-xs">
                <div className="flex justify-between font-mono">
                  <span className="font-bold text-neutral-900">● n8n Webhook Listener</span>
                  <Badge variant="success">Waiting</Badge>
                </div>
                <div className="space-y-1 text-neutral-600 text-[11px]">
                  <p>Obj: Scrape healthcare pdf compliance</p>
                  <p>Waiting for ChromaDB connection restoration</p>
                </div>
              </div>
            </div>

            <div className="border-t border-neutral-100 pt-3 space-y-2">
              <p className="text-xs font-bold text-neutral-700 uppercase tracking-wider">Day Sync Statistics</p>
              <div className="grid grid-cols-2 gap-2 text-center text-xs">
                <div className="bg-neutral-50 p-2.5 rounded border border-neutral-100">
                  <p className="font-bold text-neutral-900">2 Active</p>
                  <p className="text-neutral-500">Agent sessions</p>
                </div>
                <div className="bg-neutral-50 p-2.5 rounded border border-neutral-100">
                  <p className="font-bold text-emerald-600">84%</p>
                  <p className="text-neutral-500">Leverage rating</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right Column: EOD Review Log */}
        <Card className="flex flex-col h-full">
          <CardHeader className="bg-[#EDE8E4]/40 border-b border-neutral-200">
            <CardTitle className="text-[#FF6B2D]">3. End-of-Day Review</CardTitle>
            <CardDescription>Capture corrections & manual copy/pastes.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 space-y-4 pt-4 overflow-y-auto max-h-[500px]">
            {/* Correction logs */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <p className="text-xs font-bold text-neutral-700 uppercase tracking-wider">Correction Log</p>
                <span className="text-[10px] text-neutral-500">Stops stale agent patterns</span>
              </div>
              <div className="space-y-2">
                {state.corrections.map((c) => (
                  <div key={c.id} className="p-2 bg-neutral-50 rounded border border-neutral-100 text-[11px] space-y-1">
                    <div className="flex justify-between text-neutral-500">
                      <span className="font-semibold text-neutral-700">{c.project}</span>
                      <span>Correction</span>
                    </div>
                    <p className="line-through text-rose-700 font-mono">Original: {c.original}</p>
                    <p className="text-emerald-700 font-semibold font-mono">Corrected: {c.corrected}</p>
                  </div>
                ))}
              </div>

              {!state.dayClosed && (
                <form onSubmit={handleAddCorrection} className="border border-neutral-200 p-2.5 rounded bg-neutral-50/50 space-y-2">
                  <p className="text-[10px] font-bold text-neutral-600">Log new AI correction:</p>
                  <input
                    type="text"
                    placeholder="Project name..."
                    value={newCorrection.project}
                    onChange={(e) => setNewCorrection({ ...newCorrection, project: e.target.value })}
                    className="w-full rounded border border-neutral-300 px-2 py-1 text-xs text-neutral-800"
                  />
                  <input
                    type="text"
                    placeholder="AI prompt/output error..."
                    value={newCorrection.original}
                    onChange={(e) => setNewCorrection({ ...newCorrection, original: e.target.value })}
                    className="w-full rounded border border-neutral-300 px-2 py-1 text-xs text-neutral-800"
                  />
                  <input
                    type="text"
                    placeholder="Human fix applied..."
                    value={newCorrection.corrected}
                    onChange={(e) => setNewCorrection({ ...newCorrection, corrected: e.target.value })}
                    className="w-full rounded border border-neutral-300 px-2 py-1 text-xs text-neutral-800"
                  />
                  <Button type="submit" size="sm" className="w-full h-7 text-xs">
                    Log Correction
                  </Button>
                </form>
              )}
            </div>

            {/* Manual pastes */}
            <div className="space-y-2 border-t border-neutral-100 pt-3">
              <div className="flex justify-between items-center">
                <p className="text-xs font-bold text-neutral-700 uppercase tracking-wider">Manual Paste Log</p>
                <span className="text-[10px] text-neutral-500">Highlights automation candidates</span>
              </div>
              <div className="space-y-2">
                {state.manualPastes.map((p) => (
                  <div key={p.id} className="p-2 bg-neutral-50 rounded border border-neutral-100 text-[11px] space-y-1">
                    <div className="flex justify-between text-neutral-500 font-mono text-[9px]">
                      <span>Src: {p.source} &rarr; Dst: {p.target}</span>
                      <span>{new Date(p.time).toLocaleTimeString()}</span>
                    </div>
                    <code className="block max-h-12 overflow-y-auto bg-white p-1 border border-neutral-200 text-neutral-600 rounded">
                      {p.contentSnippet}
                    </code>
                  </div>
                ))}
              </div>

              {!state.dayClosed && (
                <form onSubmit={handleAddPaste} className="border border-neutral-200 p-2.5 rounded bg-neutral-50/50 space-y-2">
                  <p className="text-[10px] font-bold text-neutral-600">Log manual data copy/paste:</p>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Source..."
                      value={newPaste.source}
                      onChange={(e) => setNewPaste({ ...newPaste, source: e.target.value })}
                      className="rounded border border-neutral-300 px-2 py-1 text-xs text-neutral-800"
                    />
                    <input
                      type="text"
                      placeholder="Target..."
                      value={newPaste.target}
                      onChange={(e) => setNewPaste({ ...newPaste, target: e.target.value })}
                      className="rounded border border-neutral-300 px-2 py-1 text-xs text-neutral-800"
                    />
                  </div>
                  <textarea
                    placeholder="Content snippet..."
                    value={newPaste.contentSnippet}
                    onChange={(e) => setNewPaste({ ...newPaste, contentSnippet: e.target.value })}
                    rows={2}
                    className="w-full rounded border border-neutral-300 px-2 py-1 text-xs text-neutral-800"
                  />
                  <Button type="submit" size="sm" className="w-full h-7 text-xs">
                    Log Paste
                  </Button>
                </form>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Panel: Generated Follow-Ups */}
      <Card>
        <CardHeader className="border-b border-neutral-200 bg-neutral-50">
          <CardTitle>System-Suggested Follow-ups</CardTitle>
          <CardDescription>
            Based on logged manual pastes and corrections, the dream engine recommends staging these items.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4 grid gap-4 md:grid-cols-3 text-xs">
          <div className="border border-neutral-200 p-3 rounded-lg space-y-2 bg-[#EDE8E4]/30">
            <div className="flex justify-between items-center">
              <span className="font-bold text-neutral-900">Create Memory Entry</span>
              <Badge variant="info">HIPAA Schema</Badge>
            </div>
            <p className="text-neutral-600 leading-normal">
              A healthcare schema correction was logged. Update wiki note to sync with latest MediCore HIPAA validation parameters.
            </p>
            <Button size="sm" variant="secondary" className="w-full h-7" onClick={() => alert("Creating wiki page draft...")}>
              Draft Wiki Note
            </Button>
          </div>

          <div className="border border-neutral-200 p-3 rounded-lg space-y-2 bg-[#EDE8E4]/30">
            <div className="flex justify-between items-center">
              <span className="font-bold text-neutral-900">Create n8n Automation</span>
              <Badge variant="success">Pastes detected</Badge>
            </div>
            <p className="text-neutral-600 leading-normal">
              You copy-pasted brand config settings between design file and globals.css. Create a deterministic config syncer.
            </p>
            <Button size="sm" variant="secondary" className="w-full h-7" onClick={() => alert("Converting to automation task...")}>
              Stage SOP Task
            </Button>
          </div>

          <div className="border border-neutral-200 p-3 rounded-lg space-y-2 bg-[#EDE8E4]/30">
            <div className="flex justify-between items-center">
              <span className="font-bold text-neutral-900">Refactor Skill</span>
              <Badge variant="warning">TS strict error</Badge>
            </div>
            <p className="text-neutral-600 leading-normal">
              Logged typescript function signature errors. Update `ops-guardian` typescript types definition definitions.
            </p>
            <Button size="sm" variant="secondary" className="w-full h-7" onClick={() => alert("Routing to skill file...")}>
              Open Skill Source
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
