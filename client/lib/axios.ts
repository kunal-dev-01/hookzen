/**
 * @file axios.ts
 * Axios client with interceptors for token attachment and silent refresh.
 */

import axios, {
  type AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from "axios"
import { useAuthStore } from "@/store/auth.store"
import { ApiError, type BackendErrorResponse, type BackendSuccessResponse } from "@/types/api.types"

// ─────────────────────────────────────────────────────────────────────────────
// CLIENT
// ─────────────────────────────────────────────────────────────────────────────

const apiClient: AxiosInstance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api/v1`,
  withCredentials: true,
  timeout: 30_000,
  headers: { "Content-Type": "application/json" },
})

// ─────────────────────────────────────────────────────────────────────────────
// REQUEST — attach access token
// ─────────────────────────────────────────────────────────────────────────────

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().accessToken
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// ─────────────────────────────────────────────────────────────────────────────
// RESPONSE — silent refresh + error mapping
// ─────────────────────────────────────────────────────────────────────────────

type RetryConfig = InternalAxiosRequestConfig & { _retry?: boolean }

let isRefreshing = false
let refreshQueue: Array<(token: string) => void> = []

const flushQueue = (token: string) => {
  refreshQueue.forEach((cb) => cb(token))
  refreshQueue = []
}

const clearQueueWithError = () => {
  refreshQueue.forEach((cb) => cb(""))
  refreshQueue = []
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<BackendErrorResponse>) => {
    const config = error.config as RetryConfig | undefined
    const status = error.response?.status

    const authPaths = [
      "/auth/login",
      "/auth/refresh",
    ]

    const isAuthEndpoint = authPaths.some((path) => config?.url === path)

    // ── 401 → try silent refresh ────────────────────────────────────────────
    if (status === 401 && config && !config._retry && !isAuthEndpoint) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          refreshQueue.push((newToken: string) => {
            if (!newToken) {
              reject(toApiError(error))
              return
            }
            config.headers.Authorization = `Bearer ${newToken}`
            resolve(apiClient(config))
          })
        })
      }

      config._retry = true
      isRefreshing = true

      try {
        const { data } = await apiClient.post<BackendSuccessResponse<{ access_token: string }>>("/auth/refresh")
        const newToken = data.data?.access_token

        if (!newToken) throw new Error("No token received")

        useAuthStore.getState().setAccessToken(newToken)
        flushQueue(newToken)

        config.headers.Authorization = `Bearer ${newToken}`
        return apiClient(config)
      } catch {
        clearQueueWithError()
        useAuthStore.getState().clearAuth()
        if (typeof window !== "undefined") {
          window.location.replace("/auth/login")
        }
        return Promise.reject(toApiError(error))
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(toApiError(error))
  },
)

// ─────────────────────────────────────────────────────────────────────────────
// ERROR MAPPING
// ─────────────────────────────────────────────────────────────────────────────

function toApiError(error: AxiosError<BackendErrorResponse>): ApiError {
  const status = error.response?.status ?? 0
  const body = error.response?.data

  if (!body) {
    return new ApiError(
      error.message || "Network error",
      status,
      0,
    )
  }

  if (body.success === false && body.error) {
    return new ApiError(
      body.error.message || "An error occurred",
      status,
      body.error.code,
      body.error.fields ?? null,
    )
  }

  return new ApiError("An unexpected error occurred", status, 0)
}

export { apiClient }
