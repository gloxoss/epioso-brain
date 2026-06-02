import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { AdaptersModule } from "../modules/adapters/adapters.module.js";
import { AuditModule } from "../modules/audit/audit.module.js";
import { DocumentsModule } from "../modules/documents/documents.module.js";
import { GitStatusModule } from "../modules/git-status/git-status.module.js";
import { ProjectsModule } from "../modules/projects/projects.module.js";
import { ScansModule } from "../modules/scans/scans.module.js";
import { SessionsModule } from "../modules/sessions/sessions.module.js";
import { SystemHealthModule } from "../modules/system-health/system-health.module.js";
import { TasksModule } from "../modules/tasks/tasks.module.js";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      envFilePath: [".env.local", ".env"],
    }),
    ProjectsModule,
    ScansModule,
    GitStatusModule,
    DocumentsModule,
    SessionsModule,
    TasksModule,
    AdaptersModule,
    AuditModule,
    SystemHealthModule,
  ],
})
// Nest modules are declarative containers; decorators provide their runtime behavior.
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class AppModule {}
