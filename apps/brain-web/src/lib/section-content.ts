import type { NavigationKey } from "./navigation";

export interface SectionPageContent {
  readonly key: NavigationKey;
  readonly eyebrow: string;
  readonly title: string;
  readonly description: string;
  readonly emptyTitle: string;
  readonly emptyDescription: string;
  readonly tableCaption: string;
  readonly tableDescription: string;
  readonly nextSteps: readonly string[];
}

export const sectionPages = {
  projects: {
    key: "projects",
    eyebrow: "Registry",
    title: "Projects",
    description:
      "Project folders, Git state, docs, and health notes will be grouped here after the first local scan.",
    emptyTitle: "No projects have been scanned yet",
    emptyDescription:
      "After the scanner runs, this page will show each local project, its clean or dirty Git state, missing docs, and the next useful review step.",
    tableCaption: "Project registry preview",
    tableDescription: "The first rows will be created from local workspace scans.",
    nextSteps: [
      "Connect the scanner API to read the workspace root.",
      "Show Git state in plain language: clean, changed, ahead, behind, or no Git.",
      "Link each project to docs, sessions, and staged tasks.",
    ],
  },
  sessions: {
    key: "sessions",
    eyebrow: "Agent ledger",
    title: "Agent Sessions",
    description:
      "Agent sessions will show who worked on what, what changed, and what still needs human review.",
    emptyTitle: "No agent sessions have been imported yet",
    emptyDescription:
      "When Codex, Claude, or Hermes sessions are imported, this page will list the project, current status, staged output, and review decision.",
    tableCaption: "Agent session preview",
    tableDescription: "Imported sessions will be grouped by project and review state.",
    nextSteps: [
      "Import local session metadata without uploading private files.",
      "Mark outputs as needs review, approved, or blocked.",
      "Keep an audit trail for every accepted change.",
    ],
  },
  tasks: {
    key: "tasks",
    eyebrow: "Work queue",
    title: "Tasks",
    description:
      "Tasks will move from draft to queued, running, staged output, and approved once the API queue is available.",
    emptyTitle: "No tasks are waiting right now",
    emptyDescription:
      "Draft work requests, queued automation jobs, and staged agent outputs will appear here with clear review buttons before anything writes to disk.",
    tableCaption: "Task queue preview",
    tableDescription: "Rows will show owner, state, risk, and the next review action.",
    nextSteps: [
      "Create tasks from project findings or manual notes.",
      "Queue only the work you explicitly approve.",
      "Keep risky actions staged until review is complete.",
    ],
  },
  clients: {
    key: "clients",
    eyebrow: "Studio work",
    title: "Clients & Work",
    description:
      "Client accounts and delivery work will connect projects, proposals, active tasks, and handoff notes.",
    emptyTitle: "No client work has been connected yet",
    emptyDescription:
      "Once client records are wired in, this page will show active accounts, linked projects, current deliverables, and follow-up notes.",
    tableCaption: "Client work preview",
    tableDescription: "Connected client work will be grouped by account and delivery state.",
    nextSteps: [
      "Map client names to local projects and docs.",
      "Surface delivery deadlines and missing handoff notes.",
      "Keep proposal and NDA-sensitive material local.",
    ],
  },
  "content-command": {
    key: "content-command",
    eyebrow: "Publishing systems",
    title: "Content Command",
    description:
      "Content queues, brand briefs, and n8n publishing workflows will be monitored here.",
    emptyTitle: "No content workflows are connected yet",
    emptyDescription:
      "After content integrations are added, this page will show queued posts, campaign briefs, automation health, and items needing approval.",
    tableCaption: "Content workflow preview",
    tableDescription: "Workflow rows will show queue state, next post, and review needs.",
    nextSteps: [
      "Connect n8n workflow status and execution history.",
      "Show briefs, posting queues, and missing approvals.",
      "Keep generated copy staged before publishing.",
    ],
  },
  creative: {
    key: "creative",
    eyebrow: "Creative pipeline",
    title: "Creative Engine",
    description:
      "Brand context, prompt variants, and asset requests will live here once the creative adapter is wired.",
    emptyTitle: "No creative requests are active yet",
    emptyDescription:
      "Creative briefs, prompt variants, generation requests, and staged assets will appear here with approval controls before export.",
    tableCaption: "Creative request preview",
    tableDescription: "Rows will show brand, requested output, state, and approval need.",
    nextSteps: [
      "Connect brand context and prompt variant storage.",
      "Stage generated assets for review before they leave the local machine.",
      "Track the source brief for every creative request.",
    ],
  },
} as const satisfies Record<string, SectionPageContent>;
