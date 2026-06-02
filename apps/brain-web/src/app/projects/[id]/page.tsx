"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { Badge, Card, CardContent, CardHeader, CardTitle, Button } from "../../../components/ui";

interface ProjectSession {
  readonly id: string;
  readonly objective: string;
  readonly status: string;
  readonly date: string;
}

interface ProjectRecommendation {
  readonly id: string;
  readonly title: string;
  readonly category: string;
  readonly hoursSaved: number;
  readonly status: string;
}

interface ProjectFile {
  readonly name: string;
  readonly path: string;
}

interface ProjectAgent {
  readonly name: string;
  readonly role: string;
  readonly lastActive: string;
}

interface ProjectStats {
  readonly sessions: number;
  readonly hoursSaved: number;
  readonly activeTasks: number;
  readonly gitState: string;
}

interface ProjectDetails {
  readonly id: string;
  readonly name: string;
  readonly type: string;
  readonly status: string;
  readonly priority: string;
  readonly localPath: string;
  readonly lastUpdated: string;
  readonly goal: string;
  readonly description: string;
  readonly stats: ProjectStats;
  readonly sessions: readonly ProjectSession[];
  readonly recommendations: readonly ProjectRecommendation[];
  readonly linkedFiles: readonly ProjectFile[];
  readonly agents: readonly ProjectAgent[];
  readonly notes: string;
}

const PROJECTS_DETAIL_MAP: Record<string, ProjectDetails> = {
  "medi-core": {
    id: "medi-core",
    name: "MediCore Healthcare",
    type: "Medical Web App",
    status: "Needs Review",
    priority: "P0",
    localPath: "D:/Users/zakio/Desktop/Work/Epioso/medi-core",
    lastUpdated: "2026-06-02T02:00:00Z",
    goal: "Build patient registration & HIPAA compliance validator.",
    description: "Enterprise healthcare portal with vector RAG search grounded in 5.8M medical QA pairs (MIRIAD).",
    stats: { sessions: 18, hoursSaved: 48, activeTasks: 3, gitState: "Dirty (3 changed files)" },
    sessions: [
      { id: "sess-02", objective: "Implement HIPAA schema validation rules", status: "Completed", date: "2026-06-02" },
      { id: "sess-04", objective: "Verify patient de-identification pipelines", status: "In Progress", date: "2026-06-01" },
    ],
    recommendations: [
      { id: "rec-03", title: "Refresh stale healthcare project documentation", category: "Memory", hoursSaved: 8, status: "Open" },
    ],
    linkedFiles: [
      { name: "pre-dev/02-PRD.md", path: "C:/Users/oussama/Documents/Oussama Context base/epioso-os-roadmap/pre-dev/02-PRD.md" },
      { name: "pre-dev/02-SRS.md", path: "C:/Users/oussama/Documents/Oussama Context base/epioso-os-roadmap/pre-dev/02-SRS.md" },
      { name: "pre-dev/05-database-schema.md", path: "C:/Users/oussama/Documents/Oussama Context base/epioso-os-roadmap/pre-dev/05-database-schema.md" },
    ],
    agents: [
      { name: "Codex", role: "Database compliance check", lastActive: "2 hours ago" },
      { name: "Claude", role: "RAG Prompt tuning", lastActive: "5 mins ago" },
    ],
    notes: "Oussama notes: HIPAA guidelines require strict logging of vector DB requests. Staged De-ID model needs verification with raw medical text chunking.",
  },
  "epioso-web": {
    id: "epioso-web",
    name: "Epioso IT Agency Website",
    type: "Brand Portfolio",
    status: "Active",
    priority: "P1",
    localPath: "D:/Users/zakio/Desktop/Work/Epioso/epioso-web",
    lastUpdated: "2026-06-01T15:30:00Z",
    goal: "Redesign brand experience with black/orange editorial gallery.",
    description: "Modern studio portfolio site featuring huge geometry typography, cinematic case study layouts, and paper-textured forms.",
    stats: { sessions: 24, hoursSaved: 114, activeTasks: 2, gitState: "Clean" },
    sessions: [
      { id: "sess-03", objective: "Design warm paper contact layout", status: "Completed", date: "2026-06-01" },
      { id: "sess-05", objective: "Scaffold responsive CSS grids", status: "Completed", date: "2026-05-30" },
    ],
    recommendations: [
      { id: "rec-01", title: "Consolidate duplicate ops-guardian skills", category: "Skill", hoursSaved: 4, status: "Open" },
    ],
    linkedFiles: [
      { name: "epioso-design.md", path: "C:/Users/oussama/Downloads/epioso-design.md" },
      { name: "epioso-skill.md", path: "C:/Users/oussama/Downloads/epioso-skill.md" },
    ],
    agents: [
      { name: "Hermes", role: "CSS design token generation", lastActive: "1 day ago" },
    ],
    notes: "Oussama notes: Design system uses Satoshi/Cabinet Grotesk display fonts. Ensure standard viewport is 375px mobile-first.",
  },
  "agent-os": {
    id: "agent-os",
    name: "EPIOSO AgentOS",
    type: "Infrastructure",
    status: "Active",
    priority: "P0",
    localPath: "D:/Users/zakio/Desktop/Work/Epioso/epioso-brain",
    lastUpdated: "2026-06-02T02:30:00Z",
    goal: "Automate local task queue and model spend calculations.",
    description: "Private local-only dashboard plane managing agent logs, n8n webhook sync, and system audits.",
    stats: { sessions: 32, hoursSaved: 180, activeTasks: 5, gitState: "Dirty (5 changed files)" },
    sessions: [
      { id: "sess-01", objective: "Implement dynamic dashboard routes", status: "Completed", date: "2026-06-02" },
      { id: "sess-06", objective: "Add cheaper model recommendations system", status: "Completed", date: "2026-06-02" },
    ],
    recommendations: [
      { id: "rec-02", title: "Demote GPT-4o usage on deterministic n8n linting", category: "Cost", hoursSaved: 0.5, status: "Accepted" },
    ],
    linkedFiles: [
      { name: "06-epioso-agentos-prd-and-build-plan.md", path: "C:/Users/oussama/Documents/Oussama Context base/epioso-os-roadmap/06-epioso-agentos-prd-and-build-plan.md" },
    ],
    agents: [
      { name: "Codex", role: "Local workspace lint check", lastActive: "Just now" },
    ],
    notes: "Oussama notes: The registry now has 31 pages. Need to ensure all newly created pages pass strict TypeScript lints.",
  },
  "fez-clinic": {
    id: "fez-clinic",
    name: "Fez Clinic Automation",
    type: "Client Project",
    status: "Needs Review",
    priority: "P2",
    localPath: "D:/Users/zakio/Desktop/Work/Epioso/fez-clinic",
    lastUpdated: "2026-05-25T14:00:00Z",
    goal: "Deploy custom n8n pipelines for patient text reminders.",
    description: "Integration of SMS gateway with local appointment calendars to improve clinic schedule density.",
    stats: { sessions: 5, hoursSaved: 12, activeTasks: 1, gitState: "No Git" },
    sessions: [
      { id: "sess-07", objective: "Configure calendar cron trigger jobs", status: "Completed", date: "2026-05-25" },
    ],
    recommendations: [
      { id: "rec-04", title: "Automate daily planning and EOD loops", category: "Workflow", hoursSaved: 3, status: "Open" },
    ],
    linkedFiles: [
      { name: "pre-dev/03-Scoping-Fez.md", path: "C:/Users/oussama/Documents/Oussama Context base/epioso-os-roadmap/pre-dev/03-Scoping-Fez.md" },
    ],
    agents: [
      { name: "Claude", role: "SMS script draft translation", lastActive: "1 week ago" },
    ],
    notes: "Oussama notes: Local clinic wants privacy-first compliance. Keep patient phone numbers out of external LLM logs.",
  },
};

export default function ProjectDetailPage() {
  const { id } = useParams();
  const projectId = typeof id === "string" ? id : "";
  const project = PROJECTS_DETAIL_MAP[projectId];

  const [activeTab, setActiveTab] = useState<"overview" | "sessions" | "recommendations" | "files" | "agents" | "notes">("overview");
  const [copied, setCopied] = useState(false);
  const [notesText, setNotesText] = useState(project?.notes ?? "");

  if (!project) {
    return (
      <div className="space-y-4">
        <h1 className="text-xl font-bold text-white">Project Not Found</h1>
        <p className="text-sm text-neutral-400">The project ID &ldquo;{projectId}&rdquo; was not found in the workspace registry.</p>
        <Link href="/projects" className="inline-flex h-9 items-center rounded-md bg-brand-orange px-4 text-xs font-semibold text-black transition-colors hover:bg-brand-orange-hover">
          Back to Projects
        </Link>
      </div>
    );
  }

  const statusColorMap: Record<string, "neutral" | "info" | "success" | "warning" | "danger" | "private"> = {
    "Active": "success" as const,
    "Needs Review": "warning" as const,
    "Completed": "success" as const,
    "Done": "success" as const,
    "Clean": "success" as const,
    "Dirty (3 changed files)": "warning" as const,
    "Dirty (5 changed files)": "warning" as const,
    "No Git": "neutral" as const,
  };

  const priorityColorMap: Record<string, "neutral" | "info" | "success" | "warning" | "danger" | "private"> = {
    "P0": "danger" as const,
    "P1": "warning" as const,
    "P2": "neutral" as const,
  };

  function handleCopyPath() {
    if (!project) return;
    navigator.clipboard.writeText(project.localPath);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-400">
        <Link href="/projects" className="hover:text-brand-orange transition-colors">Projects</Link>
        <span>/</span>
        <span className="text-white">{project.name}</span>
      </div>

      {/* Project Command Header */}
      <div className="rounded-lg border border-neutral-800 bg-brand-black-soft p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={statusColorMap[project.status] || "neutral"}>{project.status}</Badge>
              <Badge variant={priorityColorMap[project.priority] || "neutral"}>{project.priority} Priority</Badge>
              <span className="text-xs text-neutral-500 font-mono">Last updated: {new Date(project.lastUpdated).toLocaleDateString()}</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white">{project.name}</h1>
            <p className="text-sm text-neutral-400">{project.type} &bull; <button onClick={handleCopyPath} aria-label="Copy local path" className="font-mono text-neutral-300 hover:text-brand-orange transition-colors underline cursor-pointer">{project.localPath}</button> {copied ? <span className="text-brand-orange text-xs font-semibold ml-2">Copied!</span> : null}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="primary" className="font-semibold text-black" onClick={() => alert("Starting session preselected for project: " + project.name)}>
              Start Session
            </Button>
            <Button variant="secondary" className="border-neutral-800 text-white" onClick={() => alert("Running local scanner review...")}>
              Run Project Review
            </Button>
          </div>
        </div>

        {/* Goal Strip */}
        <div className="mt-6 border-t border-neutral-800 pt-4">
          <p className="text-xs font-bold uppercase tracking-widest text-brand-orange">Strategic Target / Goal</p>
          <p className="mt-1 text-sm text-neutral-200">{project.goal}</p>
        </div>
      </div>

      {/* Metric Strip */}
      <div className="grid gap-3 grid-cols-2 md:grid-cols-4">
        <Card>
          <CardContent className="space-y-1 py-4">
            <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">Total Sessions</p>
            <p className="text-2xl font-bold text-white">{project.stats.sessions}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-1 py-4">
            <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">Hours Saved</p>
            <p className="text-2xl font-bold text-brand-orange">{project.stats.hoursSaved} hrs</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-1 py-4">
            <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">Active Tasks</p>
            <p className="text-2xl font-bold text-white">{project.stats.activeTasks}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-1 py-4">
            <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">Git State</p>
            <p className="text-base font-semibold truncate text-neutral-200">{project.stats.gitState}</p>
          </CardContent>
        </Card>
      </div>

      {/* Segmented Tab Navigation */}
      <div className="flex border-b border-neutral-800 overflow-x-auto">
        {(["overview", "sessions", "recommendations", "files", "agents", "notes"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`border-b-2 px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors whitespace-nowrap ${
              activeTab === tab
                ? "border-brand-orange text-brand-orange"
                : "border-transparent text-neutral-400 hover:text-white"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      <div className="space-y-6">
        {activeTab === "overview" && (
          <div className="grid gap-6 md:grid-cols-3">
            <div className="md:col-span-2 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Project Overview</CardTitle>
                </CardHeader>
                <CardContent className="text-sm leading-relaxed text-neutral-300">
                  {project.description}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Next Operational Move</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="rounded-md border border-neutral-800 bg-neutral-900/50 p-4">
                    <p className="text-sm font-semibold text-white">Execute Static Analysis & Local Linting</p>
                    <p className="mt-1 text-xs text-neutral-400">Run code review pipeline to evaluate uncommitted scripts against strict workspace compliance criteria before check-in.</p>
                    <div className="mt-3 flex items-center justify-between text-xs">
                      <span className="text-brand-orange font-bold font-mono">P0 Priority</span>
                      <Button variant="secondary" size="sm" onClick={() => alert("Initiating lint task check...")}>Run Lint Check</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Strategic Notes sidebar (warm paper) */}
            <div>
              <Card className="bg-brand-paper border-brand-light-grey text-neutral-900">
                <CardHeader className="border-neutral-200">
                  <CardTitle className="text-neutral-950 font-bold uppercase tracking-wider text-xs">Strategic Notebook Context</CardTitle>
                </CardHeader>
                <CardContent className="pt-4 text-xs space-y-3">
                  <p className="leading-relaxed font-serif text-neutral-800 italic">
                    &ldquo;This project serves as a cornerstone of our agency operations. The RAG systems and compliance structures built here must be modular enough to bootstrap other Moroccan clinical pipelines.&rdquo;
                  </p>
                  <div className="rounded bg-brand-paper-soft p-3 border border-neutral-300">
                    <p className="font-bold text-neutral-900">Key Constraints</p>
                    <p className="mt-1 text-neutral-700 leading-normal">Always verify patient de-id limits before running external APIs. Write access stays locked.</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === "sessions" && (
          <Card>
            <CardHeader>
              <CardTitle>Recent Work Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              {project.sessions.length > 0 ? (
                <div className="space-y-4">
                  {project.sessions.map((sess) => (
                    <div key={sess.id} className="flex flex-col gap-2 rounded-lg border border-neutral-800 bg-neutral-900/20 p-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <Link href={`/sessions/${sess.id}`} className="text-sm font-bold text-white hover:text-brand-orange transition-colors">
                          {sess.objective}
                        </Link>
                        <p className="text-xs text-neutral-500 font-mono mt-1">ID: {sess.id} &bull; Date: {sess.date}</p>
                      </div>
                      <div>
                        <Badge variant={sess.status === "Completed" ? "success" : "warning"}>{sess.status}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-neutral-400">No active or recorded sessions for this project.</p>
              )}
            </CardContent>
          </Card>
        )}

        {activeTab === "recommendations" && (
          <Card>
            <CardHeader>
              <CardTitle>Active Intelligence Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              {project.recommendations.length > 0 ? (
                <div className="space-y-3">
                  {project.recommendations.map((rec) => (
                    <div key={rec.id} className="rounded-lg border border-neutral-800 bg-neutral-900/30 p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <Badge variant="info">{rec.category}</Badge>
                        <span className="text-xs text-brand-orange font-semibold font-mono">+{rec.hoursSaved} hrs savings</span>
                      </div>
                      <h4 className="text-sm font-bold text-white">{rec.title}</h4>
                      <div className="flex items-center justify-between pt-2">
                        <span className="text-xs text-neutral-500 font-mono">Status: {rec.status}</span>
                        <Button variant="secondary" size="sm" onClick={() => alert("Implementing action items...")}>View Steps</Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-neutral-400">No open recommendations found for this project.</p>
              )}
            </CardContent>
          </Card>
        )}

        {activeTab === "files" && (
          <Card>
            <CardHeader>
              <CardTitle>Linked Workspace Files & Context</CardTitle>
            </CardHeader>
            <CardContent>
              {project.linkedFiles.length > 0 ? (
                <div className="divide-y divide-neutral-800">
                  {project.linkedFiles.map((file) => (
                    <div key={file.name} className="flex items-center justify-between py-3">
                      <div>
                        <p className="text-sm font-semibold text-white">{file.name}</p>
                        <p className="text-xs text-neutral-500 font-mono">{file.path}</p>
                      </div>
                      <Button variant="secondary" size="sm" onClick={() => {
                        navigator.clipboard.writeText(file.path);
                        alert("File path copied to clipboard!");
                      }}>
                        Copy Path
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-neutral-400">No workspace file context linked yet.</p>
              )}
            </CardContent>
          </Card>
        )}

        {activeTab === "agents" && (
          <Card>
            <CardHeader>
              <CardTitle>Registered Agents Activity</CardTitle>
            </CardHeader>
            <CardContent>
              {project.agents.length > 0 ? (
                <div className="divide-y divide-neutral-800">
                  {project.agents.map((agent) => (
                    <div key={agent.name} className="flex items-center justify-between py-3">
                      <div>
                        <p className="text-sm font-bold text-white">{agent.name}</p>
                        <p className="text-xs text-neutral-400">{agent.role}</p>
                      </div>
                      <span className="text-xs text-neutral-500 font-mono">Last active: {agent.lastActive}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-neutral-400">No active agents associated with this project.</p>
              )}
            </CardContent>
          </Card>
        )}

        {activeTab === "notes" && (
          <Card className="bg-brand-paper border-brand-light-grey text-neutral-900">
            <CardHeader className="border-neutral-200">
              <CardTitle className="text-neutral-950 font-bold">Understanding & Strategic Notes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <textarea
                value={notesText}
                onChange={(e) => setNotesText(e.target.value)}
                rows={6}
                className="w-full rounded-md border border-neutral-300 bg-white p-3 font-mono text-xs text-neutral-950 focus:border-brand-orange focus:outline-none"
                placeholder="Write strategic engineering notebook notes here..."
              />
              <div className="flex justify-end gap-2">
                <Button variant="secondary" className="bg-neutral-200 border-neutral-300 text-neutral-800 hover:bg-neutral-300" onClick={() => setNotesText(project.notes)}>
                  Reset Notes
                </Button>
                <Button variant="primary" className="text-black font-semibold" onClick={() => alert("Strategic notes committed to local ledger successfully!")}>
                  Commit Notes
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
