import { HttpException } from "@nestjs/common";
import type { HttpStatus } from "@nestjs/common";
import type { ApiErrorCode } from "@epioso-brain/shared-types";

import { redactSecrets } from "../security/redact-secrets.js";

export interface ApiExceptionOptions {
  readonly statusCode: HttpStatus;
  readonly code: ApiErrorCode;
  readonly message: string;
  readonly details?: unknown;
}

export class ApiException extends HttpException {
  public constructor(options: ApiExceptionOptions) {
    super(createApiExceptionBody(options), options.statusCode);
  }
}

interface ApiExceptionBody {
  readonly code: ApiErrorCode;
  readonly message: string;
  readonly details?: unknown;
}

function createApiExceptionBody(options: ApiExceptionOptions): ApiExceptionBody {
  if (options.details === undefined) {
    return {
      code: options.code,
      message: options.message,
    };
  }

  return {
    code: options.code,
    message: options.message,
    details: redactSecrets(options.details),
  };
}
