import { describe, expect, it } from "vitest";

import { brainWorkspaceConfig } from "./index.js";

describe("brainWorkspaceConfig", () => {
  it("keeps the workspace local-only by default", () => {
    expect(brainWorkspaceConfig.runtimeMode).toBe("local");
    expect(brainWorkspaceConfig.publicDeployEnabled).toBe(false);
    expect(brainWorkspaceConfig.approvalRequired).toBe(true);
  });
});
