import { Module } from "@nestjs/common";

import { SystemHealthController } from "./system-health.controller.js";
import { SystemHealthService } from "./system-health.service.js";

@Module({
  controllers: [SystemHealthController],
  providers: [SystemHealthService],
})
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class SystemHealthModule {}
