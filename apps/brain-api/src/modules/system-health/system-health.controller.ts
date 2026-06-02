import { Controller, Get } from "@nestjs/common";
import type { ApiSuccessResponse, SystemHealthStatus } from "@epioso-brain/shared-types";

import { createApiSuccessResponse } from "../../common/contracts/api-response.contract.js";
import { SystemHealthService } from "./system-health.service.js";

@Controller("system")
export class SystemHealthController {
  public constructor(private readonly systemHealthService: SystemHealthService) {}

  @Get("health")
  public getHealth(): ApiSuccessResponse<SystemHealthStatus> {
    return createApiSuccessResponse(this.systemHealthService.getStatus());
  }
}
