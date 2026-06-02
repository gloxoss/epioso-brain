export interface Skill {
  id: string;
  name: string;
  description: string;
  category: "Agency" | "Content" | "Logic" | "Ops";
  lastUsed: string;
  usageCount: number;
  path: string;
  stale: boolean;
  hoursSaved: number;
  type: "SOP" | "Script" | "Workflow" | "Agentic";
  duplicate?: boolean;
}

export interface DuplicateGroup {
  id: string;
  name: string;
  paths: string[];
}

export interface Recommendation {
  id: string;
  title: string;
  category: "Cost" | "Skill" | "Memory" | "Workflow" | "Security";
  reason: string;
  evidence: string;
  costSaved?: string;
  hoursSaved?: number;
  actionSteps: string[];
  confidence: number;
  status: "Open" | "Accepted" | "Done" | "Dismissed";
  date: string;
}

export interface MemorySource {
  id: string;
  name: string;
  type: "Folder" | "Obsidian" | "Project Docs" | "Chroma" | "Supabase pgvector";
  path: string;
  indexedCount: number;
  freshnessScore: number;
  status: "ok" | "stale" | "error";
  lastScan: string;
  purpose: string;
}

export interface MemoryItem {
  id: string;
  title: string;
  type: string;
  path: string;
  linkedProject: string;
  lastModified: string;
  status: "fresh" | "stale";
}

export interface IndexingEvent {
  id: string;
  timestamp: string;
  sourceName: string;
  eventType: "scan_start" | "scan_complete" | "vector_added" | "error";
  message: string;
}

export interface WikiPage {
  id: string;
  title: string;
  summary: string;
  sourcePath: string;
  lastModified: string;
  backlinks: { id: string; title: string }[];
  outgoingLinks: { id: string; title: string }[];
  tags: string[];
  contentSnippet: string;
  lintFindings: string[];
  openQuestions: string[];
}

export interface LintFinding {
  id: string;
  pageId: string;
  pageTitle: string;
  type: "stale" | "orphan" | "missing_links" | "broken_link";
  severity: "warning" | "info" | "critical";
  message: string;
}

export interface WikiOpenQuestion {
  id: string;
  pageId: string;
  pageTitle: string;
  question: string;
  contextNeeded: string;
}

export interface FourCAudit {
  overallReadiness: number;
  contextScore: number;
  connectionsScore: number;
  capabilitiesScore: number;
  cadenceScore: number;
}

export interface OperatingBucket {
  id: string;
  name: string;
  description: string;
  contextScore: number; // 0-100
  connectionsScore: number;
  capabilitiesScore: number;
  cadenceScore: number;
  connectedSources: string[];
  activeCapabilities: string[];
  cadenceJobs: string[];
  auditFindingsCount: number;
}

export interface DailyLoopState {
  date: string;
  priorities: string[];
  calendarSummary: { time: string; event: string; type: "internal" | "client" | "task" }[];
  activeSessionsCount: number;
  corrections: { id: string; original: string; corrected: string; project: string; category: "code" | "content" | "config" }[];
  manualPastes: { id: string; contentSnippet: string; source: string; target: string; time: string }[];
  dayClosed: boolean;
}

export interface PocArtifact {
  id: string;
  name: string;
  type: "Dashboard" | "Report" | "Workflow";
  purpose: string;
  dataSources: string[];
  usageCount: number;
  status: "Testing" | "Promoted" | "Discarded";
  dateCreated: string;
  notes: string;
}

export interface CadenceJob {
  id: string;
  name: string;
  cronExpression: string;
  description: string;
  status: "active" | "running" | "idle";
  lastRun: string;
}

// Mock Data Definitions
export const mockSkills: Skill[] = [
  {
    id: "sk-01",
    name: "epioso-agency-scoping",
    description: "Schedules fixed-price estimates, generates agency white-label proposals, and scopes web builds based on brief.",
    category: "Agency",
    lastUsed: "2026-06-01T15:30:00Z",
    usageCount: 42,
    path: "D:/Users/zakio/Desktop/Work/Epioso/.skills/epioso-agency/scoping.md",
    stale: false,
    hoursSaved: 84,
    type: "SOP"
  },
  {
    id: "sk-02",
    name: "epioso-agency-invoice-generator",
    description: "Automates proposal to invoice conversion. Calculates tax rules for international clients.",
    category: "Agency",
    lastUsed: "2026-04-12T10:15:00Z",
    usageCount: 15,
    path: "D:/Users/zakio/Desktop/Work/Epioso/.skills/epioso-agency/invoice.md",
    stale: true,
    hoursSaved: 30,
    type: "Script"
  },
  {
    id: "sk-03",
    name: "epioso-content-brief-creator",
    description: "Generates creative social briefs from raw screenshots, meeting audio transcripts, or chat text.",
    category: "Content",
    lastUsed: "2026-05-31T18:45:00Z",
    usageCount: 88,
    path: "D:/Users/zakio/Desktop/Work/Epioso/.skills/epioso-content/briefing.md",
    stale: false,
    hoursSaved: 132,
    type: "Agentic"
  },
  {
    id: "sk-04",
    name: "epioso-content-scheduler",
    description: "Schedules posts via local n8n, generates Darija hashtags, and optimizes publication calendar.",
    category: "Content",
    lastUsed: "2026-06-01T09:00:00Z",
    usageCount: 114,
    path: "D:/Users/zakio/Desktop/Work/Epioso/.skills/epioso-content/scheduling.md",
    stale: false,
    hoursSaved: 57,
    type: "Workflow"
  },
  {
    id: "sk-05",
    name: "epioso-logics-n8n-node-validator",
    description: "Lints custom JavaScript nodes in n8n pipelines for scope safety, timeout handling, and type compliance.",
    category: "Logic",
    lastUsed: "2026-05-28T14:20:00Z",
    usageCount: 29,
    path: "D:/Users/zakio/Desktop/Work/Epioso/.skills/epioso-logics/n8n-validator.md",
    stale: false,
    hoursSaved: 43.5,
    type: "Workflow"
  },
  {
    id: "sk-06",
    name: "epioso-logics-patient-schema-lint",
    description: "Validates MediCore JSON-schema structures for healthcare operations against compliance rules.",
    category: "Logic",
    lastUsed: "2026-03-02T11:00:00Z",
    usageCount: 8,
    path: "D:/Users/zakio/Desktop/Work/Epioso/.skills/epioso-logics/medi-lint.md",
    stale: true,
    hoursSaved: 16,
    type: "SOP"
  },
  {
    id: "sk-07",
    name: "epioso-ops-git-guardian",
    description: "Checks files before staging to block private client credentials, local data tables, or raw database backups.",
    category: "Ops",
    lastUsed: "2026-06-02T01:30:00Z",
    usageCount: 215,
    path: "D:/Users/zakio/Desktop/Work/Epioso/epioso-brain/.skills/ops-guardian.md",
    stale: false,
    hoursSaved: 107.5,
    type: "Script",
    duplicate: true
  },
  {
    id: "sk-08",
    name: "ops-guardian",
    description: "Scans project folders for uncommitted API tokens and keys. Duplicates git-guardian logic.",
    category: "Ops",
    lastUsed: "2026-05-15T12:00:00Z",
    usageCount: 12,
    path: "D:/Users/zakio/Desktop/Work/Epioso/.skills/ops-guardian.md",
    stale: false,
    hoursSaved: 6,
    type: "Script",
    duplicate: true
  }
];

export const mockDuplicateGroups: DuplicateGroup[] = [
  {
    id: "dup-1",
    name: "ops-guardian / epioso-ops-git-guardian",
    paths: [
      "D:/Users/zakio/Desktop/Work/Epioso/epioso-brain/.skills/ops-guardian.md",
      "D:/Users/zakio/Desktop/Work/Epioso/.skills/ops-guardian.md"
    ]
  }
];

export const mockRecommendations: Recommendation[] = [
  {
    id: "rec-01",
    title: "Consolidate duplicate ops-guardian skills",
    category: "Skill",
    reason: "Reduces skill duplication and potential configuration drift between local folders.",
    evidence: "Found identical helper logic inside two skill files at different paths: `.skills/ops-guardian.md` and `epioso-brain/.skills/ops-guardian.md`.",
    hoursSaved: 4,
    actionSteps: [
      "Compare ops-guardian.md and epioso-ops-git-guardian.md files.",
      "Merge unique custom rules into the core git-guardian.",
      "Delete the duplicate .skills/ops-guardian.md file.",
      "Rescan skills list to verify cleanup."
    ],
    confidence: 95,
    status: "Open",
    date: "2026-06-02T02:00:00Z"
  },
  {
    id: "rec-02",
    title: "Demote GPT-4o usage on deterministic n8n linting",
    category: "Cost",
    reason: "Saves API costs by routing simple script validation tasks to cheaper models like Gemini Flash.",
    evidence: "Detected 14 consecutive sessions where a premium model (GPT-4o) was used to parse static JavaScript functions in n8n validator.",
    costSaved: "$34.50 / month",
    hoursSaved: 0.5,
    actionSteps: [
      "Open n8n-validator skill configuration.",
      "Modify model priority list to place Gemini Flash above GPT-4o.",
      "Run mock test to ensure regex syntax parsing remains fully accurate."
    ],
    confidence: 88,
    status: "Accepted",
    date: "2026-06-02T01:30:00Z"
  },
  {
    id: "rec-03",
    title: "Refresh stale healthcare project documentation",
    category: "Memory",
    reason: "Ensures RAG and agents do not retrieve obsolete patient schema specs during code generation.",
    evidence: "The file `pre-dev/02-SRS.md` in MediCore has not been modified or accessed in 92 days, while schema definitions were updated recently.",
    hoursSaved: 8,
    actionSteps: [
      "Compare SRS goals with the live PostgreSQL database schemas.",
      "Update stale JSON schema validation markdown docs.",
      "Commit changes to rebuild the RAG chunk cache."
    ],
    confidence: 90,
    status: "Open",
    date: "2026-06-02T00:45:00Z"
  },
  {
    id: "rec-04",
    title: "Automate daily planning and end-of-day loop trigger",
    category: "Workflow",
    reason: "Ensures consistency in learning audit and time saving metrics tracking.",
    evidence: "End-of-day reviews are being missed or filled 24+ hours late on 4 out of 5 weekdays.",
    hoursSaved: 3,
    actionSteps: [
      "Configure local scheduler to send a system notification at 18:00 daily.",
      "Automatically pop open the /daily screen with pre-filled AI session logs."
    ],
    confidence: 82,
    status: "Open",
    date: "2026-06-01T18:00:00Z"
  },
  {
    id: "rec-05",
    title: "Block unverified webhook payloads on development",
    category: "Security",
    reason: "Prevents mock execution of untrusted n8n trigger events.",
    evidence: "The client-automation webhook endpoint is running without token check in local development profile.",
    actionSteps: [
      "Open local environment config profile.",
      "Enforce API_TOKEN verification checks.",
      "Test payload rejection with dummy curl requests."
    ],
    confidence: 99,
    status: "Done",
    date: "2026-05-30T10:00:00Z"
  }
];

export const mockMemorySources: MemorySource[] = [
  {
    id: "mem-01",
    name: "Epioso OS Roadmap Vault",
    type: "Obsidian",
    path: "C:/Users/oussama/Documents/Oussama Context base/epioso-os-roadmap",
    indexedCount: 38,
    freshnessScore: 92,
    status: "ok",
    lastScan: "2026-06-02T02:10:00Z",
    purpose: "Primary business goals, PRD documents, C4 diagrams, and chronological build roadmap."
  },
  {
    id: "mem-02",
    name: "Studio Skill Definitions",
    type: "Folder",
    path: "D:/Users/zakio/Desktop/Work/Epioso/.skills",
    indexedCount: 8,
    freshnessScore: 85,
    status: "ok",
    lastScan: "2026-06-02T01:45:00Z",
    purpose: "Core capability SOPs, instruction prompts, and validation scripts for agent operations."
  },
  {
    id: "mem-03",
    name: "Pre-dev Spec Registry",
    type: "Project Docs",
    path: "C:/Users/oussama/Documents/Oussama Context base/epioso-os-roadmap/pre-dev",
    indexedCount: 31,
    freshnessScore: 54,
    status: "stale",
    lastScan: "2026-06-02T00:00:00Z",
    purpose: "Initial project charters, competitive analyses, ERDs, APIs, and privacy specifications."
  },
  {
    id: "mem-04",
    name: "Local Agent Logs",
    type: "Folder",
    path: "D:/Users/zakio/Desktop/Work/Epioso/codex-handoffs",
    indexedCount: 142,
    freshnessScore: 98,
    status: "ok",
    lastScan: "2026-06-02T02:22:00Z",
    purpose: "Chronological transaction files, terminal logs, and files-touched metadata from agent sessions."
  },
  {
    id: "mem-05",
    name: "Healthcare Vector Store",
    type: "Chroma",
    path: "http://127.0.0.1:8000 (Collection: medicore-specs)",
    indexedCount: 840,
    freshnessScore: 40,
    status: "error",
    lastScan: "2026-05-25T14:00:00Z",
    purpose: "Vectorized health compliance PDFs and WHO regulatory manuals for diagnostic RAG."
  }
];

export const mockMemoryItems: MemoryItem[] = [
  {
    id: "item-01",
    title: "06-epioso-agentos-prd-and-build-plan.md",
    type: "markdown",
    path: "C:/Users/oussama/Documents/Oussama Context base/epioso-os-roadmap/06-epioso-agentos-prd-and-build-plan.md",
    linkedProject: "EPIOSO AgentOS",
    lastModified: "2026-06-01T20:30:00Z",
    status: "fresh"
  },
  {
    id: "item-02",
    title: "02-PRD.md",
    type: "markdown",
    path: "C:/Users/oussama/Documents/Oussama Context base/epioso-os-roadmap/pre-dev/02-PRD.md",
    linkedProject: "Epioso Web",
    lastModified: "2026-05-24T14:00:00Z",
    status: "fresh"
  },
  {
    id: "item-03",
    title: "02-SRS.md",
    type: "markdown",
    path: "C:/Users/oussama/Documents/Oussama Context base/epioso-os-roadmap/pre-dev/02-SRS.md",
    linkedProject: "MediCore Healthcare",
    lastModified: "2026-03-02T11:00:00Z",
    status: "stale"
  },
  {
    id: "item-04",
    title: "05-database-schema.md",
    type: "markdown",
    path: "C:/Users/oussama/Documents/Oussama Context base/epioso-os-roadmap/pre-dev/05-database-schema.md",
    linkedProject: "MediCore Healthcare",
    lastModified: "2026-03-02T11:00:00Z",
    status: "stale"
  }
];

export const mockIndexingEvents: IndexingEvent[] = [
  {
    id: "evt-01",
    timestamp: "2026-06-02T02:22:00Z",
    sourceName: "Local Agent Logs",
    eventType: "scan_complete",
    message: "Finished scanning folder. Added 4 new session metadata logs."
  },
  {
    id: "evt-02",
    timestamp: "2026-06-02T02:10:00Z",
    sourceName: "Epioso OS Roadmap Vault",
    eventType: "scan_complete",
    message: "Vault scan complete. 38 files verified. Cache matches hashes."
  },
  {
    id: "evt-03",
    timestamp: "2026-06-02T02:08:00Z",
    sourceName: "Epioso OS Roadmap Vault",
    eventType: "scan_start",
    message: "Incremental directory scan triggered."
  },
  {
    id: "evt-04",
    timestamp: "2026-05-25T14:00:00Z",
    sourceName: "Healthcare Vector Store",
    eventType: "error",
    message: "Connection failed to ChromaDB host at 127.0.0.1:8000. Target refused connection."
  }
];

export const mockWikiPages: WikiPage[] = [
  {
    id: "wiki-index",
    title: "Brain Hub Index",
    summary: "Root entry point for Oussama's local-first Markdown knowledge base. Links core modules.",
    sourcePath: "C:/Users/oussama/Documents/Oussama Context base/epioso-os-roadmap/wiki/index.md",
    lastModified: "2026-06-02T01:00:00Z",
    backlinks: [],
    outgoingLinks: [
      { id: "wiki-leverage", title: "AI Leverage Framework" },
      { id: "wiki-n8n-sop", title: "n8n Deployment SOP" },
      { id: "wiki-medi-schema", title: "MediCore Healthcare Schemas" }
    ],
    tags: ["index", "os", "core"],
    contentSnippet: "# Brain Index\nWelcome to the local knowledge base. Use the links below to navigate:\n- [[AI Leverage Framework]] - 3M rules and scoring\n- [[n8n Deployment SOP]] - Pipeline deployments\n- [[MediCore Healthcare Schemas]] - Compliance layouts",
    lintFindings: [],
    openQuestions: ["What is the target deployment IP for the staging server?"]
  },
  {
    id: "wiki-leverage",
    title: "AI Leverage Framework",
    summary: "The 3M operational mindset: Mindset, Method, and Machine. Establishes AI scaffolding strategies.",
    sourcePath: "C:/Users/oussama/Documents/Oussama Context base/epioso-os-roadmap/wiki/ai-leverage.md",
    lastModified: "2026-06-01T14:20:00Z",
    backlinks: [{ id: "wiki-index", title: "Brain Hub Index" }],
    outgoingLinks: [
      { id: "wiki-stale-page", title: "Legacy Workspace Settings" }
    ],
    tags: ["theory", "3m", "governance"],
    contentSnippet: "# AI Leverage Framework\nLeverage is measured as: value of time saved / tool cost.\n## 3M Strategy:\n1. **Mindset**: delegate 30-90% incrementally\n2. **Method**: micro-chunk tasks\n3. **Machine**: automate loops",
    lintFindings: ["Contains link to stale page: [[Legacy Workspace Settings]]"],
    openQuestions: []
  },
  {
    id: "wiki-n8n-sop",
    title: "n8n Deployment SOP",
    summary: "Step-by-step procedure for deploying workflows from local test grids to Hostinger SSH.",
    sourcePath: "C:/Users/oussama/Documents/Oussama Context base/epioso-os-roadmap/wiki/n8n-sop.md",
    lastModified: "2026-05-30T10:15:00Z",
    backlinks: [{ id: "wiki-index", title: "Brain Hub Index" }],
    outgoingLinks: [],
    tags: ["sop", "ops", "n8n"],
    contentSnippet: "# n8n Deployment SOP\nTo deploy a workflow:\n1. Export JSON from local UI.\n2. Run `ssh oussama@epioso.tech`\n3. Import JSON to PM2 backend instance.",
    lintFindings: [],
    openQuestions: ["Need to document environment keys rotation cadence."]
  },
  {
    id: "wiki-medi-schema",
    title: "MediCore Healthcare Schemas",
    summary: "Compliance documentation for HIPAA and WHO health schemas. Marked as legacy format.",
    sourcePath: "C:/Users/oussama/Documents/Oussama Context base/epioso-os-roadmap/wiki/medi-schema.md",
    lastModified: "2026-03-02T11:00:00Z",
    backlinks: [{ id: "wiki-index", title: "Brain Hub Index" }],
    outgoingLinks: [],
    tags: ["healthcare", "schemas", "stale"],
    contentSnippet: "# MediCore Schemas\n*Warning: Legacy HIPAA rules list.*\nUse the following properties for patient data:\n- patient_id (uuid)\n- dob (iso-date)\n- diagnostic_code (icd-10)",
    lintFindings: ["Stale page warning: Page has not been updated in 92 days.", "Orphan check: Outgoing links count is 0."],
    openQuestions: ["How should we handle European GDPR guidelines for patient logs?"]
  },
  {
    id: "wiki-orphan-page",
    title: "Orphaned Notes Draft",
    summary: "A scratchpad of ideas on game matrices for couples app. No other page links here.",
    sourcePath: "C:/Users/oussama/Documents/Oussama Context base/epioso-os-roadmap/wiki/orphan-draft.md",
    lastModified: "2026-05-20T18:00:00Z",
    backlinks: [],
    outgoingLinks: [],
    tags: ["draft", "creative"],
    contentSnippet: "# Couples App Draft\nLet's map transition rules:\n- State A (Initial) -> State B (Question 1) via command\n- Stagger animations using GSAP rules.",
    lintFindings: ["Orphan page: No other wiki pages link to this page."],
    openQuestions: []
  }
];

export const mockLintFindings: LintFinding[] = [
  {
    id: "lf-01",
    pageId: "wiki-leverage",
    pageTitle: "AI Leverage Framework",
    type: "broken_link",
    severity: "warning",
    message: "Broken wiki link: [[Legacy Workspace Settings]] does not resolve to an active file."
  },
  {
    id: "lf-02",
    pageId: "wiki-medi-schema",
    pageTitle: "MediCore Healthcare Schemas",
    type: "stale",
    severity: "warning",
    message: "Memory drift warning: Page has not been modified in 92 days. Verify schema compliance."
  },
  {
    id: "lf-03",
    pageId: "wiki-orphan-page",
    pageTitle: "Orphaned Notes Draft",
    type: "orphan",
    severity: "info",
    message: "Orphan page detected: No active page links to [[Orphaned Notes Draft]]. Consider linking from Index."
  }
];

export const mockWikiOpenQuestions: WikiOpenQuestion[] = [
  {
    id: "wq-01",
    pageId: "wiki-index",
    pageTitle: "Brain Hub Index",
    question: "What is the target deployment IP for the staging server?",
    contextNeeded: "Requires adding standard Hostinger variables to .env."
  },
  {
    id: "wq-02",
    pageId: "wiki-n8n-sop",
    pageTitle: "n8n Deployment SOP",
    question: "How should environment keys rotation cadence be documented?",
    contextNeeded: "Requires security checklist clarification."
  },
  {
    id: "wq-03",
    pageId: "wiki-medi-schema",
    pageTitle: "MediCore Healthcare Schemas",
    question: "How should we handle European GDPR guidelines for patient logs?",
    contextNeeded: "Compliance team feedback needed."
  }
];

export const mockFourCAudit: FourCAudit = {
  overallReadiness: 65,
  contextScore: 82,
  connectionsScore: 58,
  capabilitiesScore: 70,
  cadenceScore: 50
};

export const mockOperatingBuckets: OperatingBucket[] = [
  {
    id: "bucket-rev",
    name: "Revenue",
    description: "Tracks active invoices, proposal conversions, and fixed-price contract milestones.",
    contextScore: 80,
    connectionsScore: 40,
    capabilitiesScore: 60,
    cadenceScore: 30,
    connectedSources: ["Excel sheet (Manual)", "epioso-agency-invoice-generator"],
    activeCapabilities: ["Pricing matrix calculation", "Proposal output PDF generator"],
    cadenceJobs: ["Monthly invoice reminder"],
    auditFindingsCount: 2
  },
  {
    id: "bucket-cust",
    name: "Customers & Leads",
    description: "Monitors agency leads, client onboarding states, and work-in-progress delivery logs.",
    contextScore: 90,
    connectionsScore: 70,
    capabilitiesScore: 80,
    cadenceScore: 60,
    connectedSources: ["Obsidian Leads Vault", "Local Workspace DB"],
    activeCapabilities: ["Lead prioritization parsing", "Client folder scaffolder"],
    cadenceJobs: ["Weekly lead follow-up scanner", "EOD client update draft"],
    auditFindingsCount: 0
  },
  {
    id: "bucket-cal",
    name: "Calendar & Schedule",
    description: "Syncs meeting times, developer focus blocks, and deadline dates.",
    contextScore: 60,
    connectionsScore: 30,
    capabilitiesScore: 50,
    cadenceScore: 40,
    connectedSources: ["Google Calendar API (Staged)"],
    activeCapabilities: ["Focus block allocator"],
    cadenceJobs: ["Daily calendar sweep"],
    auditFindingsCount: 1
  },
  {
    id: "bucket-comm",
    name: "Communications",
    description: "Reviews client emails, n8n Slack reports, and client chat notifications.",
    contextScore: 50,
    connectionsScore: 20,
    capabilitiesScore: 40,
    cadenceScore: 10,
    connectedSources: ["Slack Webhook (n8n)"],
    activeCapabilities: ["Urgent error alerting"],
    cadenceJobs: [],
    auditFindingsCount: 3
  },
  {
    id: "bucket-task",
    name: "Tasks",
    description: "Tracks agent queues, human-in-the-loop approvals, and staged terminal outputs.",
    contextScore: 95,
    connectionsScore: 90,
    capabilitiesScore: 90,
    cadenceScore: 80,
    connectedSources: ["Nx Workspace Engine", "npx skills checker", "Agent Log Folder"],
    activeCapabilities: ["Pre-write gatekeeper", "Task prioritization solver", "Staged output diff viewer"],
    cadenceJobs: ["Incremental directory watcher", "Hourly scan queue worker"],
    auditFindingsCount: 0
  },
  {
    id: "bucket-meet",
    name: "Meetings",
    description: "Summarizes client brief transcriptions and extracts actionable code tasks.",
    contextScore: 70,
    connectionsScore: 50,
    capabilitiesScore: 70,
    cadenceScore: 60,
    connectedSources: ["Whisper Audio Upload (Manual)", "Obsidian Meeting Notes"],
    activeCapabilities: ["Action-item extraction agent"],
    cadenceJobs: ["Weekly archive compiler"],
    auditFindingsCount: 1
  },
  {
    id: "bucket-know",
    name: "Knowledge",
    description: "Maintains Markdown wikis, project READMEs, hot cache files, and vector stores.",
    contextScore: 90,
    connectionsScore: 80,
    capabilitiesScore: 80,
    cadenceScore: 70,
    connectedSources: ["Roadmap Obsidian Vault", "Local Skill files", "Wiki Markdown Folder"],
    activeCapabilities: ["Incremental link compiler", "Stale notes detector", "Orphan checker"],
    cadenceJobs: ["Daily wiki compiler", "Weekly memory audit"],
    auditFindingsCount: 3
  }
];

export const mockCadenceJobs: CadenceJob[] = [
  {
    id: "job-01",
    name: "EOD Client Update Draft",
    cronExpression: "0 18 * * 1-5",
    description: "Compiles completed agent sessions and writes a draft message summary for clients.",
    status: "active",
    lastRun: "2026-06-01T18:00:00Z"
  },
  {
    id: "job-02",
    name: "Hourly Scan Queue Worker",
    cronExpression: "0 * * * *",
    description: "Fires incremental directory scanners on local project workspaces to detect file modifications.",
    status: "running",
    lastRun: "2026-06-02T02:00:00Z"
  },
  {
    id: "job-03",
    name: "Weekly Memory Audit",
    cronExpression: "0 9 * * 5",
    description: "Lints the local Markdown wiki directories to report orphan files, dead links, and stale pages.",
    status: "idle",
    lastRun: "2026-05-29T09:00:00Z"
  }
];

export const mockDailyLoopState: DailyLoopState = {
  date: "2026-06-02",
  priorities: [
    "Implement TASK 03 Intelligence pages in Next.js workspace.",
    "Verify typescript strict compliance and compilation parameters.",
    "Draft proposal overview for the Fez Medical Clinic automation."
  ],
  calendarSummary: [
    { time: "09:30 AM", event: "Daily sync with Lead Designer on portfolio assets", type: "internal" },
    { time: "11:00 AM", event: "Project scoping call: Fez Clinic Automation", type: "client" },
    { time: "04:00 PM", event: "Release validation gate: Brain Web features", type: "task" }
  ],
  activeSessionsCount: 2,
  corrections: [
    {
      id: "corr-1",
      original: "const cn = (...classes) => classes.filter(Boolean).join(' ')",
      corrected: "export function cn(...classes: readonly (string | false | null | undefined)[]): string",
      project: "EPIOSO Brain",
      category: "code"
    },
    {
      id: "corr-2",
      original: "Site dyalek khaso ykhdem lyoum, machi gha yban.",
      corrected: "Site dyalek khaso ykhdem, machi ghi yban.",
      project: "EPIOSO Content",
      category: "content"
    }
  ],
  manualPastes: [
    {
      id: "mp-1",
      contentSnippet: "export interface ApiResponseMeta { timestamp: string; }",
      source: "packages/shared-types/src/api.ts",
      target: "apps/brain-web/src/components/ui/data-table.tsx",
      time: "2026-06-02T01:12:00Z"
    },
    {
      id: "mp-2",
      contentSnippet: "--color-brand-primary: #FF6B2D;",
      source: "epioso-design.md",
      target: "apps/brain-web/src/app/globals.css",
      time: "2026-06-02T01:45:00Z"
    }
  ],
  dayClosed: false
};

export const mockPocArtifacts: PocArtifact[] = [
  {
    id: "poc-01",
    name: "Model Usage & Token Cost Counter",
    type: "Dashboard",
    purpose: "Lightweight card mapping raw provider costs before connecting LiteLLM database proxies.",
    dataSources: ["Anthropic Console export (CSV)", "Gemini console quota page"],
    usageCount: 14,
    status: "Testing",
    dateCreated: "2026-05-24",
    notes: "Very useful for catching developer token waste on large file context loops. Promoted flag pending."
  },
  {
    id: "poc-02",
    name: "Fez Clinic Diagnostic Workflow",
    type: "Workflow",
    purpose: "A raw prototype mapping patient data flows to verify clinic data compliance variables.",
    dataSources: ["MediCore compliance handbook", "Sample patient JSON spec"],
    usageCount: 2,
    status: "Discarded",
    dateCreated: "2026-05-25",
    notes: "Discarded in favor of deterministic PostgreSQL table constraints."
  },
  {
    id: "poc-03",
    name: "Darija Copywriting Variant Tester",
    type: "Report",
    purpose: "Generates alternative dialect options to test response metrics on premium local brands.",
    dataSources: ["Obsidian Brand voice rules", "Instagram post interaction stats"],
    usageCount: 45,
    status: "Promoted",
    dateCreated: "2026-05-20",
    notes: "Promoted to Creative Engine under Content Command. Connects to n8n variant pipeline."
  }
];
