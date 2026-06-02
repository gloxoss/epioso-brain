export declare const API_VERSION = "v1";
export declare const API_ROUTE_PREFIX = "api/v1";
export declare const API_PATH_PREFIX = "/api/v1";
export declare const API_ERROR_CODES: readonly ["BAD_REQUEST", "VALIDATION_ERROR", "UNAUTHORIZED", "FORBIDDEN", "NOT_FOUND", "CONFLICT", "LOCAL_ONLY_VIOLATION", "SERVICE_UNAVAILABLE", "INTERNAL_ERROR"];
export type ApiVersion = typeof API_VERSION;
export type ApiErrorCode = (typeof API_ERROR_CODES)[number];
export type ApiRuntimeMode = "local";
export type ApiHealthStatus = "ok" | "degraded" | "error";
export interface ApiResponseMeta {
    readonly timestamp: string;
    readonly requestId?: string;
    readonly path?: string;
    readonly method?: string;
}
export interface ApiError {
    readonly code: ApiErrorCode;
    readonly message: string;
    readonly details?: unknown;
    readonly requestId?: string;
}
export interface ApiSuccessResponse<TData = unknown> {
    readonly ok: true;
    readonly data: TData;
    readonly meta?: ApiResponseMeta;
}
export interface ApiErrorResponse {
    readonly ok: false;
    readonly error: ApiError;
    readonly meta: ApiResponseMeta;
}
export type ApiResponse<TData = unknown> = ApiSuccessResponse<TData> | ApiErrorResponse;
export interface PaginationMeta {
    readonly page: number;
    readonly pageSize: number;
    readonly totalItems: number;
    readonly totalPages: number;
}
export interface PaginatedData<TItem> {
    readonly items: readonly TItem[];
    readonly pagination: PaginationMeta;
}
export type PaginatedResponse<TItem> = ApiSuccessResponse<PaginatedData<TItem>>;
export interface SystemHealthCheck {
    readonly name: string;
    readonly status: ApiHealthStatus;
    readonly message?: string;
}
export interface SystemHealthStatus {
    readonly service: "epioso-brain-api";
    readonly status: ApiHealthStatus;
    readonly runtimeMode: ApiRuntimeMode;
    readonly localOnly: true;
    readonly apiVersion: ApiVersion;
    readonly host: string;
    readonly port: number;
    readonly uptimeSeconds: number;
    readonly timestamp: string;
    readonly checks: readonly SystemHealthCheck[];
}
//# sourceMappingURL=api.d.ts.map