export type NavigationKey =
  | "dashboard"
  | "projects"
  | "sessions"
  | "tasks"
  | "clients"
  | "content-command"
  | "creative"
  | "agents"
  | "workflows"
  | "approvals"
  | "connectors"
  | "tools"
  | "settings"
  | "onboarding"
  | "system"
  | "goals"
  | "costs"
  | "roi"
  | "reports"
  | "content-proof"
  | "buckets";

export interface NavigationItem {
  readonly key: NavigationKey;
  readonly label: string;
  readonly shortLabel: string;
  readonly href: string;
  readonly description: string;
}

export const dashboardNavigation = [
  {
    key: "dashboard",
    label: "Dashboard",
    shortLabel: "Dashboard",
    href: "/",
    description: "Overview of what needs attention.",
  },
  {
    key: "projects",
    label: "Projects",
    shortLabel: "Projects",
    href: "/projects",
    description: "Local project folders, Git state, and docs.",
  },
  {
    key: "goals",
    label: "Goals & Milestones",
    shortLabel: "Goals",
    href: "/goals",
    description: "Studio targets, roadmap timelines, and status.",
  },
  {
    key: "sessions",
    label: "Agent Sessions",
    shortLabel: "Sessions",
    href: "/sessions",
    description: "Codex, Claude, and Hermes work sessions.",
  },
  {
    key: "tasks",
    label: "Tasks",
    shortLabel: "Tasks",
    href: "/tasks",
    description: "Work waiting to be reviewed, queued, or approved.",
  },
  {
    key: "clients",
    label: "Clients & Work",
    shortLabel: "Clients",
    href: "/clients",
    description: "Client accounts, active work, and delivery notes.",
  },
  {
    key: "costs",
    label: "Costs & Spend",
    shortLabel: "Costs",
    href: "/costs",
    description: "Manual spend registry and token cost estimates.",
  },
  {
    key: "roi",
    label: "ROI & Efficiency",
    shortLabel: "ROI",
    href: "/roi",
    description: "Hours saved, gross savings value, and net ROI.",
  },
  {
    key: "content-proof",
    label: "Content & Proof",
    shortLabel: "Proof",
    href: "/content-proof",
    description: "Master's portfolio and Hugging Face proofs.",
  },
  {
    key: "content-command",
    label: "Content Command",
    shortLabel: "Content",
    href: "/content-command",
    description: "Posting queues, briefs, and content systems.",
  },
  {
    key: "creative",
    label: "Creative Engine",
    shortLabel: "Creative",
    href: "/creative",
    description: "Brand context, prompts, and asset requests.",
  },
  {
    key: "agents",
    label: "Agent Hub",
    shortLabel: "Agents",
    href: "/agents",
    description: "Register and monitor active agents and activity timelines.",
  },
  {
    key: "workflows",
    label: "Workflows & Automations",
    shortLabel: "Workflows",
    href: "/workflows",
    description: "Track scheduled tasks, n8n workflows, and automation runs.",
  },
  {
    key: "approvals",
    label: "Approvals & Governance",
    shortLabel: "Approvals",
    href: "/approvals",
    description: "Review and approve risky agent commands and file writes.",
  },
  {
    key: "connectors",
    label: "Connectors",
    shortLabel: "Connectors",
    href: "/connectors",
    description: "Manage local and API integrations.",
  },
  {
    key: "tools",
    label: "Tools & Models",
    shortLabel: "Tools",
    href: "/tools",
    description: "AI stack, providers, active models and registry.",
  },
  {
    key: "buckets",
    label: "Operating Buckets",
    shortLabel: "Buckets",
    href: "/buckets",
    description: "Core business operating coverage and 4C scores.",
  },
  {
    key: "settings",
    label: "Settings",
    shortLabel: "Settings",
    href: "/settings",
    description: "Configure workspace roots, stale thresholds, and local policy.",
  },
  {
    key: "onboarding",
    label: "Onboarding Wizard",
    shortLabel: "Onboarding",
    href: "/onboarding",
    description: "Setup AgentOS tools, folders, and settings.",
  },
  {
    key: "reports",
    label: "Operations Reports",
    shortLabel: "Reports",
    href: "/reports",
    description: "Daily, weekly, and monthly system audits.",
  },
  {
    key: "system",
    label: "System",
    shortLabel: "System",
    href: "/system",
    description: "Local health, safety checks, and integrations.",
  },
] as const satisfies readonly NavigationItem[];

export const shellStatus = {
  workspaceBadge: "Private workspace",
  lastScanLabel: "Last scan: not run yet",
  reviewCountLabel: "0 items to review",
  refreshReadyLabel: "Scanner API pending",
  refreshRequestedLabel: "Refresh is queued for API integration.",
} as const;

