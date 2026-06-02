export type BrainRuntimeMode = "local";
export * from "./api.js";
export interface BrainWorkspaceConfig {
    readonly name: "epioso-brain";
    readonly runtimeMode: BrainRuntimeMode;
    readonly publicDeployEnabled: false;
    readonly approvalRequired: true;
}
export declare const brainWorkspaceConfig: {
    readonly name: "epioso-brain";
    readonly runtimeMode: "local";
    readonly publicDeployEnabled: false;
    readonly approvalRequired: true;
};
//# sourceMappingURL=index.d.ts.map