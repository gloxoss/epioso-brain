export interface MetricCardContent {
  readonly label: string;
  readonly value: string;
  readonly detail: string;
  readonly badge: string;
  readonly tone: "neutral" | "success" | "warning" | "info";
}

export interface DashboardReviewRow {
  readonly id: string;
  readonly area: string;
  readonly status: string;
  readonly nextStep: string;
}

export interface DashboardQueueRow {
  readonly id: string;
  readonly queue: string;
  readonly state: string;
  readonly note: string;
}

export const dashboardHeader = {
  eyebrow: "Local control plane",
  title: "Dashboard",
  description:
    "Your private studio dashboard will collect project scans, agent work, and review queues on this screen. Nothing is uploaded from this local app.",
} as const;

export const dashboardMetrics = [
  {
    label: "Known projects",
    value: "0",
    detail: "Project registry is waiting for the first workspace scan.",
    badge: "Registry",
    tone: "neutral",
  },
  {
    label: "Open agent sessions",
    value: "0",
    detail: "Imported Codex, Claude, and Hermes sessions will appear here.",
    badge: "Sessions",
    tone: "info",
  },
  {
    label: "Tasks needing review",
    value: "0",
    detail: "Work stays staged until you approve the next action.",
    badge: "Approval",
    tone: "warning",
  },
  {
    label: "Local safety",
    value: "On",
    detail: "Write actions are designed to require explicit approval.",
    badge: "Private",
    tone: "success",
  },
] as const satisfies readonly MetricCardContent[];

export const dashboardReviewRows = [] as const satisfies readonly DashboardReviewRow[];

export const dashboardQueueRows = [] as const satisfies readonly DashboardQueueRow[];
