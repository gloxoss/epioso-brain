export type PageCategory = "Operations" | "Creative & Content" | "Intelligence & System";

export interface PageInfo {
  readonly key: string;
  readonly label: string;
  readonly shortLabel: string;
  readonly href: string;
  readonly description: string;
  readonly category: PageCategory;
  readonly iconName: string;
  readonly badgeText?: string;
  readonly badgeTone?: "neutral" | "success" | "warning" | "info";
  readonly isLocked?: boolean;
}

export const pageRegistry: readonly PageInfo[] = [
  // Operations Category
  {
    key: "dashboard",
    label: "Dashboard Control Plane",
    shortLabel: "Dashboard",
    href: "/",
    description: "Overview of your workspace, agent sessions, and active review queues.",
    category: "Operations",
    iconName: "LayoutDashboard",
  },
  {
    key: "projects",
    label: "Workspace Projects",
    shortLabel: "Projects",
    href: "/projects",
    description: "Local project folders, Git status, and doc compliance metrics.",
    category: "Operations",
    iconName: "FolderGit",
    badgeText: "4 active",
    badgeTone: "info",
  },
  {
    key: "sessions",
    label: "Agent Sessions Ledger",
    shortLabel: "Sessions",
    href: "/sessions",
    description: "Staged output audits and conversation logs from Codex, Claude, and Hermes.",
    category: "Operations",
    iconName: "History",
    badgeText: "2 pending",
    badgeTone: "warning",
  },
  {
    key: "tasks",
    label: "Interactive Task Queue",
    shortLabel: "Tasks",
    href: "/tasks",
    description: "Review and explicitly approve file writes or external actions before they run.",
    category: "Operations",
    iconName: "CheckSquare",
    badgeText: "3 staged",
    badgeTone: "warning",
  },
  {
    key: "clients",
    label: "Clients & Deliveries",
    shortLabel: "Clients",
    href: "/clients",
    description: "Client accounts, proposal links, and active delivery pipelines.",
    category: "Operations",
    iconName: "Users",
  },

  // Creative & Content Category
  {
    key: "content-command",
    label: "Content Command Center",
    shortLabel: "Content",
    href: "/content-command",
    description: "n8n publishing pipelines, campaign briefs, and automated social queues.",
    category: "Creative & Content",
    iconName: "Megaphone",
    badgeText: "1 queued",
    badgeTone: "success",
  },
  {
    key: "creative",
    label: "Creative Prompt Engine",
    shortLabel: "Creative",
    href: "/creative",
    description: "Brand design system, prompt variables, and generated asset validation.",
    category: "Creative & Content",
    iconName: "Sparkles",
  },

  // Intelligence & System Category
  {
    key: "roi",
    label: "ROI & Time Saved",
    shortLabel: "ROI Tracker",
    href: "/roi",
    description: "Net savings, hourly value multiples, and automated workflow return on investment.",
    category: "Intelligence & System",
    iconName: "TrendingUp",
    badgeText: "+$2,450",
    badgeTone: "success",
  },
  {
    key: "costs",
    label: "Subscriptions & API Costs",
    shortLabel: "Costs",
    href: "/costs",
    description: "Model subscription plans, API token usage, and provider limits.",
    category: "Intelligence & System",
    iconName: "CreditCard",
  },
  {
    key: "goals",
    label: "Dream Recommendations & Planning",
    shortLabel: "Dream Engine",
    href: "/goals",
    description: "Daily self-improving suggestions, repeated task patterns, and memory audits.",
    category: "Intelligence & System",
    iconName: "Compass",
    badgeText: "5 tips",
    badgeTone: "info",
  },
  {
    key: "reports",
    label: "Audit Reports Log",
    shortLabel: "Reports",
    href: "/reports",
    description: "Weekly AIOS performance audits, 4C maturity scores, and logs.",
    category: "Intelligence & System",
    iconName: "FileText",
  },
  {
    key: "system",
    label: "System Settings & Adapters",
    shortLabel: "System",
    href: "/system",
    description: "Local safety rules, workspace file scanners, and active API integrations.",
    category: "Intelligence & System",
    iconName: "Sliders",
  },
  {
    key: "tools",
    label: "Tools & Models Registry",
    shortLabel: "Tools",
    href: "/tools",
    description: "Track AI tools, active models, monthly cost, and limits.",
    category: "Intelligence & System",
    iconName: "Cpu",
  },
  {
    key: "buckets",
    label: "Operating Buckets Map",
    shortLabel: "Buckets",
    href: "/buckets",
    description: "Coverage analysis of the 7 business operating axes.",
    category: "Intelligence & System",
    iconName: "Layers",
  },
] as const;

export function getPageByKey(key: string): PageInfo | undefined {
  return pageRegistry.find((page) => page.key === key);
}

export function getPageByHref(href: string): PageInfo | undefined {
  return pageRegistry.find((page) =>
    page.href === "/" ? href === "/" : href.startsWith(page.href)
  );
}

export function getPagesByCategory(category: PageCategory): PageInfo[] {
  return pageRegistry.filter((page) => page.category === category);
}
