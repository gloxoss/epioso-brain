export type BrainRuntimeMode = "local";

export * from "./api.js";

export interface BrainWorkspaceConfig {
  readonly name: "epioso-brain";
  readonly runtimeMode: BrainRuntimeMode;
  readonly publicDeployEnabled: false;
  readonly approvalRequired: true;
}

export const brainWorkspaceConfig = {
  name: "epioso-brain",
  runtimeMode: "local",
  publicDeployEnabled: false,
  approvalRequired: true,
} as const satisfies BrainWorkspaceConfig;
