import {
  Catch,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import type { ArgumentsHost, ExceptionFilter } from "@nestjs/common";
import { HttpAdapterHost } from "@nestjs/core";
import {
  API_ERROR_CODES,
  type ApiErrorCode,
  type ApiResponseMeta,
} from "@epioso-brain/shared-types";

import type { CreateApiErrorResponseInput } from "../contracts/api-response.contract.js";
import { createApiErrorResponse } from "../contracts/api-response.contract.js";

interface HttpRequestLike {
  readonly method?: string;
  readonly url?: string;
  readonly headers?: Readonly<Record<string, string | readonly string[] | undefined>>;
}

interface HttpExceptionRecord {
  readonly code?: unknown;
  readonly error?: unknown;
  readonly message?: unknown;
  readonly details?: unknown;
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter<unknown> {
  public constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  public catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const context = host.switchToHttp();
    const request = context.getRequest<HttpRequestLike>();
    const response = context.getResponse<unknown>();
    const statusCode = getStatusCode(exception);
    const exceptionResponse = getExceptionResponse(exception);
    const requestId = readRequestId(request);
    const meta = createResponseMeta(request, requestId);

    httpAdapter.reply(
      response,
      createApiErrorResponse(
        createErrorResponseInput({
          code: getErrorCode(statusCode, exceptionResponse),
          message: getErrorMessage(statusCode, exceptionResponse),
          details: getErrorDetails(exceptionResponse),
          requestId,
          meta,
        }),
      ),
      statusCode,
    );
  }
}

interface ErrorResponseInputValues {
  readonly code: ApiErrorCode;
  readonly message: string;
  readonly details: unknown;
  readonly requestId: string | undefined;
  readonly meta: ApiResponseMeta;
}

function createErrorResponseInput(values: ErrorResponseInputValues): CreateApiErrorResponseInput {
  const baseInput = {
    code: values.code,
    message: values.message,
    meta: values.meta,
  };

  const inputWithDetails =
    values.details === undefined
      ? baseInput
      : {
          ...baseInput,
          details: values.details,
        };

  if (values.requestId === undefined) {
    return inputWithDetails;
  }

  return {
    ...inputWithDetails,
    requestId: values.requestId,
  };
}

function getStatusCode(exception: unknown): number {
  if (exception instanceof HttpException) {
    return exception.getStatus();
  }

  return HttpStatus.INTERNAL_SERVER_ERROR;
}

function getExceptionResponse(exception: unknown): unknown {
  if (exception instanceof HttpException) {
    return exception.getResponse();
  }

  return undefined;
}

function getErrorCode(statusCode: number, exceptionResponse: unknown): ApiErrorCode {
  const explicitCode = readExplicitErrorCode(exceptionResponse);

  if (explicitCode !== undefined) {
    return explicitCode;
  }

  if (statusCode === HttpStatus.BAD_REQUEST && hasValidationMessages(exceptionResponse)) {
    return "VALIDATION_ERROR";
  }

  switch (statusCode) {
    case HttpStatus.BAD_REQUEST:
      return "BAD_REQUEST";
    case HttpStatus.UNAUTHORIZED:
      return "UNAUTHORIZED";
    case HttpStatus.FORBIDDEN:
      return "FORBIDDEN";
    case HttpStatus.NOT_FOUND:
      return "NOT_FOUND";
    case HttpStatus.CONFLICT:
      return "CONFLICT";
    case HttpStatus.SERVICE_UNAVAILABLE:
      return "SERVICE_UNAVAILABLE";
    default:
      return "INTERNAL_ERROR";
  }
}

function getErrorMessage(statusCode: number, exceptionResponse: unknown): string {
  if (statusCode >= HttpStatus.INTERNAL_SERVER_ERROR) {
    return "Internal server error";
  }

  if (typeof exceptionResponse === "string") {
    return exceptionResponse;
  }

  if (isHttpExceptionRecord(exceptionResponse)) {
    if (typeof exceptionResponse.message === "string") {
      return exceptionResponse.message;
    }

    if (Array.isArray(exceptionResponse.message)) {
      return "Validation failed";
    }

    if (typeof exceptionResponse.error === "string") {
      return exceptionResponse.error;
    }
  }

  return "Request failed";
}

function getErrorDetails(exceptionResponse: unknown): unknown {
  if (!isHttpExceptionRecord(exceptionResponse)) {
    return undefined;
  }

  if (Array.isArray(exceptionResponse.message)) {
    return {
      validationErrors: exceptionResponse.message,
    };
  }

  return exceptionResponse.details;
}

function readExplicitErrorCode(exceptionResponse: unknown): ApiErrorCode | undefined {
  if (!isHttpExceptionRecord(exceptionResponse) || typeof exceptionResponse.code !== "string") {
    return undefined;
  }

  return isApiErrorCode(exceptionResponse.code) ? exceptionResponse.code : undefined;
}

function createResponseMeta(request: HttpRequestLike, requestId: string | undefined): ApiResponseMeta {
  const baseMeta = {
    timestamp: new Date().toISOString(),
  };

  const metaWithPath =
    request.url === undefined
      ? baseMeta
      : {
          ...baseMeta,
          path: request.url,
        };

  const metaWithMethod =
    request.method === undefined
      ? metaWithPath
      : {
          ...metaWithPath,
          method: request.method,
        };

  if (requestId === undefined) {
    return metaWithMethod;
  }

  return {
    ...metaWithMethod,
    requestId,
  };
}

function readRequestId(request: HttpRequestLike): string | undefined {
  const header = request.headers?.["x-request-id"];

  if (typeof header === "string") {
    return header;
  }

  if (Array.isArray(header)) {
    return header.find((value) => value.length > 0);
  }

  return undefined;
}

function hasValidationMessages(exceptionResponse: unknown): boolean {
  return isHttpExceptionRecord(exceptionResponse) && Array.isArray(exceptionResponse.message);
}

function isApiErrorCode(value: string): value is ApiErrorCode {
  return API_ERROR_CODES.includes(value as ApiErrorCode);
}

function isHttpExceptionRecord(value: unknown): value is HttpExceptionRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
