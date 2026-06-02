import { ConfigService } from "@nestjs/config";
import { API_ROUTE_PREFIX } from "@epioso-brain/shared-types";

export const LOCAL_API_DEFAULTS = {
  host: "127.0.0.1",
  apiPort: 3333,
  webPort: 4200,
} as const;

const LOCAL_HOSTNAMES = ["127.0.0.1", "localhost", "::1"] as const;

export interface LocalApiConfig {
  readonly host: string;
  readonly port: number;
  readonly webOrigin: string;
  readonly apiPrefix: typeof API_ROUTE_PREFIX;
}

export function resolveLocalApiConfig(configService: ConfigService): LocalApiConfig {
  const host = assertLocalHost(configService.get<string>("BRAIN_HOST") ?? LOCAL_API_DEFAULTS.host);
  const port = readPort(configService, "BRAIN_API_PORT", LOCAL_API_DEFAULTS.apiPort);
  const webOrigin = resolveLocalWebOrigin(configService);

  return {
    host,
    port,
    webOrigin,
    apiPrefix: API_ROUTE_PREFIX,
  };
}

export function assertLocalHost(value: string): string {
  const host = value.trim();

  if (!isLocalHostname(host)) {
    throw new Error("BRAIN_HOST must stay local: 127.0.0.1, localhost, or ::1.");
  }

  return host;
}

export function assertLocalOrigin(value: string): string {
  try {
    const origin = new URL(value);

    if ((origin.protocol !== "http:" && origin.protocol !== "https:") || !isLocalHostname(origin.hostname)) {
      throw new Error("Origin must use a local HTTP(S) hostname.");
    }

    return origin.origin;
  } catch {
    throw new Error("BRAIN_WEB_ORIGIN must be a valid local HTTP(S) origin.");
  }
}

function resolveLocalWebOrigin(configService: ConfigService): string {
  const explicitOrigin = configService.get<string>("BRAIN_WEB_ORIGIN");

  if (explicitOrigin !== undefined && explicitOrigin.trim().length > 0) {
    return assertLocalOrigin(explicitOrigin);
  }

  const webPort = readPort(configService, "BRAIN_WEB_PORT", LOCAL_API_DEFAULTS.webPort);

  return `http://${LOCAL_API_DEFAULTS.host}:${webPort}`;
}

function readPort(configService: ConfigService, key: string, fallback: number): number {
  const rawValue = configService.get<string>(key);

  if (rawValue === undefined || rawValue.trim().length === 0) {
    return fallback;
  }

  const value = Number.parseInt(rawValue, 10);

  if (!Number.isInteger(value) || value < 1 || value > 65_535) {
    throw new Error(`${key} must be a valid TCP port.`);
  }

  return value;
}

function isLocalHostname(value: string): boolean {
  return LOCAL_HOSTNAMES.includes(value as (typeof LOCAL_HOSTNAMES)[number]);
}
