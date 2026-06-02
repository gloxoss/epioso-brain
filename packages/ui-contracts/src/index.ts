export type UiNavigationKey =
  | "dashboard"
  | "projects"
  | "sessions"
  | "tasks"
  | "clients"
  | "content-command"
  | "creative"
  | "system";

export interface UiNavigationContract {
  readonly key: UiNavigationKey;
  readonly label: string;
  readonly href: string;
  readonly description: string;
}

export type UiStatusTone = "neutral" | "success" | "warning" | "danger" | "info" | "private";

export interface UiMetricContract {
  readonly label: string;
  readonly value: string;
  readonly detail: string;
  readonly tone: UiStatusTone;
}

export interface UiEmptyStateContract {
  readonly title: string;
  readonly description: string;
}

export interface UiTableColumnContract {
  readonly key: string;
  readonly header: string;
  readonly align?: "left" | "center" | "right";
}

export interface UiShellStatusContract {
  readonly workspacePrivacyLabel: string;
  readonly lastScanLabel: string;
  readonly reviewCountLabel: string;
}
