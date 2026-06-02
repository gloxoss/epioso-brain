"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { Badge, Card, CardContent, CardHeader, CardTitle, Button } from "../../../components/ui";

interface FileTouched {
  readonly name: string;
  readonly path: string;
}

interface ActivityItem {
  readonly timestamp: string;
  readonly message: string;
}

interface Blocker {
  readonly id: string;
  readonly message: string;
  readonly resolved: boolean;
}

interface SessionDetails {
  readonly id: string;
  readonly objective: string;
  readonly project: { id: string; name: string };
  readonly status: "Completed" | "In Progress" | "Blocked";
  readonly startTime: string;
  readonly endTime: string;
  readonly filesTouched: readonly FileTouched[];
  readonly agentActivity: readonly ActivityItem[];
  readonly blockers: readonly Blocker[];
  readonly notes: string;
  readonly logs: string;
}

const SESSIONS_DETAIL_MAP: Record<string, SessionDetails> = {
  "sess-01": {
    id: "sess-01",
    objective: "Implement dynamic dashboard routes",
    project: { id: "agent-os", name: "EPIOSO AgentOS" },
    status: "Completed",
    startTime: "2026-06-02T01:00:00Z",
    endTime: "2026-06-02T02:30:00Z",
    filesTouched: [
      { name: "apps/brain-web/src/app/projects/[id]/page.tsx", path: "D:/Users/zakio/Desktop/Work/Epioso/epioso-brain/apps/brain-web/src/app/projects/[id]/page.tsx" },
      { name: "apps/brain-web/src/app/sessions/[id]/page.tsx", path: "D:/Users/zakio/Desktop/Work/Epioso/epioso-brain/apps/brain-web/src/app/sessions/[id]/page.tsx" },
    ],
    agentActivity: [
      { timestamp: "01:05", message: "Parsed 04-project-detail.md layout constraints." },
      { timestamp: "01:15", message: "Scaffolded project dynamic router layout with 6 segmented tabs." },
      { timestamp: "01:45", message: "Integrated local Satoshi & Geist typography scale tokens." },
      { timestamp: "02:22", message: "Code-review check passed with 0 compile warnings." },
    ],
    blockers: [],
    notes: "Finished scoping out the 5 planned screens. Projects and sessions dynamic routes are fully structured. Need to compile-test next.",
    logs: "Codex: [02:30:00] Done.",
  },
  "sess-02": {
    id: "sess-02",
    objective: "Implement HIPAA schema validation rules",
    project: { id: "medi-core", name: "MediCore Healthcare" },
    status: "Completed",
    startTime: "2026-06-02T00:30:00Z",
    endTime: "2026-06-02T02:00:00Z",
    filesTouched: [
      { name: "packages/shared-types/src/api.ts", path: "D:/Users/zakio/Desktop/Work/Epioso/epioso-brain/packages/shared-types/src/api.ts" },
    ],
    agentActivity: [
      { timestamp: "00:35", message: "Scanned local database schemas in pre-dev specifications." },
      { timestamp: "00:50", message: "Identified stale Patient model mappings mismatching HIPAA standard." },
      { timestamp: "01:20", message: "Modified shared-types api constraints to enforce sanitization checks." },
    ],
    blockers: [],
    notes: "HIPAA schemas verified. The database holds patient_id as a strict UUID type. Need to double-check if RAG logs need custom masking.",
    logs: "Claude: [02:00:00] HIPAA validators deployed.",
  },
  "sess-03": {
    id: "sess-03",
    objective: "Design warm paper contact layout",
    project: { id: "epioso-web", name: "Epioso IT Agency Website" },
    status: "Completed",
    startTime: "2026-06-01T14:00:00Z",
    endTime: "2026-06-01T15:30:00Z",
    filesTouched: [
      { name: "apps/brain-web/src/app/globals.css", path: "D:/Users/zakio/Desktop/Work/Epioso/epioso-brain/apps/brain-web/src/app/globals.css" },
    ],
    agentActivity: [
      { timestamp: "14:05", message: "Extracted brand colors from C:/Users/oussama/Downloads/epioso-design.md." },
      { timestamp: "14:20", message: "Mapped #FF6B2D and warm off-whites into tailwind v4 globals." },
      { timestamp: "15:10", message: "Built contact panel component with availability dot indicator." },
    ],
    blockers: [],
    notes: "Warm paper contact forms look amazing on the dark gallery canvas. The CSS transition timings use epioso standard bezier.",
    logs: "Hermes: [15:30:00] Design tokens imported.",
  },
  "sess-04": {
    id: "sess-04",
    objective: "Verify patient de-identification pipelines",
    project: { id: "medi-core", name: "MediCore Healthcare" },
    status: "Blocked",
    startTime: "2026-06-01T09:00:00Z",
    endTime: "Pending",
    filesTouched: [],
    agentActivity: [
      { timestamp: "09:05", message: "Started ClinicalBERT token categorization models check." },
    ],
    blockers: [
      { id: "blk-1", message: "Missing local DeId-Small model weights in cache directory", resolved: false },
    ],
    notes: "Blocked because the local model weights for DeId-Small are missing. Need to coordinate downloading clinical checkpoints.",
    logs: "Codex: [09:10:00] Weight download failed.",
  },
};

export default function SessionDetailPage() {
  const { id } = useParams();
  const sessionId = typeof id === "string" ? id : "";
  const [session, setSession] = useState<SessionDetails | undefined>(SESSIONS_DETAIL_MAP[sessionId]);

  const [notesText, setNotesText] = useState(session?.notes ?? "");
  const [isNotesSaved, setIsNotesSaved] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!session) {
    return (
      <div className="space-y-4">
        <h1 className="text-xl font-bold text-white">Session Not Found</h1>
        <p className="text-sm text-neutral-400">The session ID &ldquo;{sessionId}&rdquo; was not found in the local ledger.</p>
        <Link href="/sessions" className="inline-flex h-9 items-center rounded-md bg-brand-orange px-4 text-xs font-semibold text-black transition-colors hover:bg-brand-orange-hover">
          Back to Sessions
        </Link>
      </div>
    );
  }

  const statusColorMap: Record<string, "neutral" | "info" | "success" | "warning" | "danger" | "private"> = {
    "Completed": "success" as const,
    "In Progress": "info" as const,
    "Blocked": "danger" as const,
  };

  function handleSaveNotes() {
    setIsNotesSaved(true);
    setTimeout(() => setIsNotesSaved(false), 2000);
  }

  function handleToggleStatus() {
    if (!session) return;
    const nextStatus = session.status === "Completed" ? "In Progress" : "Completed";
    setSession({
      ...session,
      status: nextStatus,
    });
  }

  function handleCopyFilePath(path: string, index: number) {
    navigator.clipboard.writeText(path);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  }

  return (
    <div className="space-y-6">
      {/* Back button and label */}
      <div className="flex items-center gap-3">
        <Link
          href="/sessions"
          className="inline-flex h-8 items-center rounded border border-neutral-800 bg-brand-black-soft px-3 text-xs font-semibold text-neutral-300 hover:bg-brand-graphite transition-colors"
        >
          &larr; Back to Sessions
        </Link>
        <Badge variant="private">Session Ledger Detail</Badge>
      </div>

      {/* Main Grid: Metadata left, Notebook editor right */}
      <div className="grid gap-6 lg:grid-cols-[1fr_22rem]">
        
        {/* Left Column: Metadata, files touched, activities */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Session Ledger Metadata</CardTitle>
              <Badge variant={statusColorMap[session.status] || "neutral"}>{session.status}</Badge>
            </CardHeader>
            <CardContent className="space-y-4 pt-4 text-sm">
              <div>
                <p className="text-xs text-neutral-500 font-bold uppercase tracking-widest">Objective</p>
                <h2 className="text-lg font-bold text-white mt-1">{session.objective}</h2>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs text-neutral-500 font-bold uppercase tracking-widest">Project</p>
                  <Link href={`/projects/${session.project.id}`} className="inline-block mt-1 text-sm font-semibold text-brand-orange hover:underline">
                    {session.project.name}
                  </Link>
                </div>
                <div>
                  <p className="text-xs text-neutral-500 font-bold uppercase tracking-widest">Session ID</p>
                  <p className="mt-1 font-mono text-xs text-neutral-300">{session.id}</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-500 font-bold uppercase tracking-widest">Started At</p>
                  <p className="mt-1 font-mono text-xs text-neutral-300">{new Date(session.startTime).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-500 font-bold uppercase tracking-widest">Ended At</p>
                  <p className="mt-1 font-mono text-xs text-neutral-300">
                    {session.endTime === "Pending" ? "Active Loop Running" : new Date(session.endTime).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="border-t border-neutral-800 pt-4 flex gap-2">
                <Button variant={session.status === "Completed" ? "secondary" : "primary"} onClick={handleToggleStatus} className={session.status !== "Completed" ? "text-black" : "text-white"}>
                  {session.status === "Completed" ? "Reopen Session" : "Complete Session"}
                </Button>
                {session.status !== "Blocked" && (
                  <Button variant="danger" className="border-rose-950 bg-rose-950/20 text-rose-400 hover:bg-rose-950/50" onClick={() => setSession({ ...session, status: "Blocked" })}>
                    Mark Blocked
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Files Touched panel */}
          <Card>
            <CardHeader>
              <CardTitle>Files Touched Ledger ({session.filesTouched.length})</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              {session.filesTouched.length > 0 ? (
                <div className="divide-y divide-neutral-800">
                  {session.filesTouched.map((file, idx) => (
                    <div key={file.name} className="flex items-center justify-between py-3">
                      <div className="min-w-0 pr-4">
                        <p className="text-sm font-semibold truncate text-white">{file.name}</p>
                        <p className="text-xs text-neutral-500 font-mono truncate">{file.path}</p>
                      </div>
                      <Button variant="secondary" size="sm" onClick={() => handleCopyFilePath(file.path, idx)}>
                        {copiedIndex === idx ? "Copied" : "Copy Path"}
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-neutral-400 py-2">No files were modified in this session ledger.</p>
              )}
            </CardContent>
          </Card>

          {/* Agent Activity Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Agent Run Activity Timeline</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              {session.agentActivity.length > 0 ? (
                <div className="space-y-4">
                  {session.agentActivity.map((activity, idx) => (
                    <div key={idx} className="flex gap-3 text-xs leading-normal">
                      <span className="font-mono text-neutral-500 shrink-0 font-bold">{activity.timestamp}</span>
                      <span className="text-neutral-300">{activity.message}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-neutral-400 py-2">No agent actions recorded for this segment.</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Warm Paper Engineering Notebook */}
        <div className="space-y-6">
          <Card className="bg-brand-paper border-brand-light-grey text-neutral-900 shadow-lg">
            <CardHeader className="border-neutral-200">
              <CardTitle className="text-neutral-950 font-bold uppercase tracking-wider text-xs">Engineering Notebook Note</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <p className="text-xs text-neutral-700 leading-relaxed font-sans">
                Oussama, log strategic notes here when reviewing this session. Capture technical details, security reviews, RAG validation decisions, or architectural outcomes.
              </p>
              <textarea
                value={notesText}
                onChange={(e) => setNotesText(e.target.value)}
                rows={12}
                className="w-full rounded-md border border-neutral-300 bg-white p-3 font-mono text-xs text-neutral-950 focus:border-brand-orange focus:outline-none"
                placeholder="Type your notes here..."
              />
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-mono text-neutral-500">Local-only notebook</span>
                <Button variant="primary" className="text-black font-semibold h-8" onClick={handleSaveNotes}>
                  {isNotesSaved ? "Notes Saved" : "Save Notes"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Connected Agent Terminal Output Logs */}
          <Card className="bg-neutral-950 border-neutral-800 text-neutral-300 font-mono">
            <CardHeader className="border-neutral-800">
              <CardTitle className="text-white text-xs font-mono">Console logs ledger</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 text-xs">
              <pre className="overflow-x-auto whitespace-pre-wrap">{session.logs}</pre>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom Blockers & Next Actions */}
      {session.blockers.length > 0 && (
        <Card className="border-rose-950/40 bg-rose-950/5">
          <CardHeader className="border-rose-950/10">
            <CardTitle className="text-rose-400">P0 Session Blockers</CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-3">
            {session.blockers.map((blk) => (
              <div key={blk.id} className="flex flex-wrap items-center justify-between gap-4 text-sm text-neutral-300">
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-rose-500 shrink-0" />
                  <span>{blk.message}</span>
                </div>
                <Button variant="secondary" size="sm" className="border-neutral-800 hover:border-neutral-700 text-white" onClick={() => alert("Marking blocker " + blk.id + " as resolved...")}>
                  Resolve Blocker
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
