const REDACTED_VALUE = "[REDACTED]";
const MAX_REDACTION_DEPTH = 8;

const SECRET_KEY_PATTERNS = [
  /api[-_]?key/i,
  /authorization/i,
  /cookie/i,
  /password/i,
  /secret/i,
  /token/i,
];

export function redactSecrets(value: unknown, depth = 0): unknown {
  if (depth > MAX_REDACTION_DEPTH) {
    return "[TRUNCATED]";
  }

  if (typeof value === "string") {
    return redactSecretText(value);
  }

  if (Array.isArray(value)) {
    return value.map((item) => redactSecrets(item, depth + 1));
  }

  if (isRecord(value)) {
    return redactRecord(value, depth);
  }

  return value;
}

export function redactSecretText(value: string): string {
  return value
    .replace(/(Bearer\s+)[A-Za-z0-9._~+/=-]+/gi, `$1${REDACTED_VALUE}`)
    .replace(/([?&](?:api[-_]?key|key|password|secret|token)=)[^&\s]+/gi, `$1${REDACTED_VALUE}`)
    .replace(/:\/\/([^:\s/@]+):([^@\s]+)@/g, `://${REDACTED_VALUE}:${REDACTED_VALUE}@`);
}

function redactRecord(value: Record<string, unknown>, depth: number): Record<string, unknown> {
  const redacted: Record<string, unknown> = {};

  for (const [key, item] of Object.entries(value)) {
    redacted[key] = isSecretKey(key) ? REDACTED_VALUE : redactSecrets(item, depth + 1);
  }

  return redacted;
}

function isSecretKey(key: string): boolean {
  return SECRET_KEY_PATTERNS.some((pattern) => pattern.test(key));
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
