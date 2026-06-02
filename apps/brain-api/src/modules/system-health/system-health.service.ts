import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { API_VERSION, type SystemHealthStatus } from "@epioso-brain/shared-types";

import { resolveLocalApiConfig } from "../../common/config/local-api.config.js";

@Injectable()
export class SystemHealthService {
  public constructor(private readonly configService: ConfigService) {}

  public getStatus(): SystemHealthStatus {
    const localApiConfig = resolveLocalApiConfig(this.configService);

    return {
      service: "epioso-brain-api",
      status: "ok",
      runtimeMode: "local",
      localOnly: true,
      apiVersion: API_VERSION,
      host: localApiConfig.host,
      port: localApiConfig.port,
      uptimeSeconds: Math.floor(process.uptime()),
      timestamp: new Date().toISOString(),
      checks: [
        {
          name: "local-bind",
          status: "ok",
          message: "API is configured for a local-only network binding.",
        },
        {
          name: "cors-origin",
          status: "ok",
          message: `CORS is limited to ${localApiConfig.webOrigin}.`,
        },
      ],
    };
  }
}
