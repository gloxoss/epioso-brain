import "reflect-metadata";

import { Logger, ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { HttpAdapterHost } from "@nestjs/core";

import { AppModule } from "./app/app.module.js";
import { resolveLocalApiConfig } from "./common/config/local-api.config.js";
import { AllExceptionsFilter } from "./common/filters/all-exceptions.filter.js";
import { redactSecrets } from "./common/security/redact-secrets.js";

const logger = new Logger("BrainApiBootstrap");

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  const configService = app.get(ConfigService);
  const localApiConfig = resolveLocalApiConfig(configService);

  app.setGlobalPrefix(localApiConfig.apiPrefix);
  app.enableCors({
    origin: localApiConfig.webOrigin,
    credentials: false,
    methods: ["GET", "HEAD", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Authorization", "Content-Type", "X-Request-Id"],
    exposedHeaders: ["X-Request-Id"],
    maxAge: 600,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: false,
      },
      validationError: {
        target: false,
        value: false,
      },
    }),
  );
  app.useGlobalFilters(new AllExceptionsFilter(app.get(HttpAdapterHost)));

  await app.listen(localApiConfig.port, localApiConfig.host);
  logger.log(
    `EPIOSO Brain API listening at http://${localApiConfig.host}:${localApiConfig.port}/${localApiConfig.apiPrefix}`,
  );
}

void bootstrap().catch((error: unknown) => {
  logger.error("Failed to start EPIOSO Brain API.", toSafeErrorMessage(error));
  process.exitCode = 1;
});

function toSafeErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    const redacted = redactSecrets(error.message);

    return typeof redacted === "string" ? redacted : "Startup error";
  }

  return "Startup error";
}
