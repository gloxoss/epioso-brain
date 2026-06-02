import type {
  ApiErrorCode,
  ApiErrorResponse,
  ApiResponseMeta,
  ApiSuccessResponse,
} from "@epioso-brain/shared-types";

import { redactSecrets } from "../security/redact-secrets.js";

export interface CreateApiErrorResponseInput {
  readonly code: ApiErrorCode;
  readonly message: string;
  readonly meta: ApiResponseMeta;
  readonly details?: unknown;
  readonly requestId?: string;
}

export function createApiSuccessResponse<TData>(
  data: TData,
  meta?: ApiResponseMeta,
): ApiSuccessResponse<TData> {
  if (meta === undefined) {
    return {
      ok: true,
      data,
    };
  }

  return {
    ok: true,
    data,
    meta,
  };
}

export function createApiErrorResponse(input: CreateApiErrorResponseInput): ApiErrorResponse {
  const baseError = {
    code: input.code,
    message: input.message,
  };

  const errorWithDetails =
    input.details === undefined
      ? baseError
      : {
          ...baseError,
          details: redactSecrets(input.details),
        };

  const error =
    input.requestId === undefined
      ? errorWithDetails
      : {
          ...errorWithDetails,
          requestId: input.requestId,
        };

  return {
    ok: false,
    error,
    meta: input.meta,
  };
}
