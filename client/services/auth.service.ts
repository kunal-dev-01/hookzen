/**
 * @file auth.service.ts
 * Methods for authentication API calls.
 */

import { apiClient } from '@/lib/axios'
import type { BackendSuccessResponse } from '@/types/api.types'
import type {
  RegisterRequest,
  LoginRequest,
  AuthData,
  RefreshData,
  VerifyEmailRequest,
  ResendVerificationRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  SessionView,
} from '@/types/auth.types'

const BASE = '/auth'

// ── ACCOUNT ──────────────────────────────────────────────────────────────

async function register(data: RegisterRequest) {
  const res = await apiClient.post<BackendSuccessResponse<null>>(`${BASE}/register`, data)
  return res.data
}

async function verifyEmail(data: VerifyEmailRequest) {
  const res = await apiClient.post<BackendSuccessResponse<AuthData>>(`${BASE}/verify-email`, data)
  return res.data
}

async function resendVerification(data: ResendVerificationRequest) {
  const res = await apiClient.post<BackendSuccessResponse<null>>(`${BASE}/resend-verification`, data)
  return res.data
}

// ── LOGIN / LOGOUT ────────────────────────────────────────────────────────

async function login(data: LoginRequest) {
  const res = await apiClient.post<BackendSuccessResponse<AuthData>>(`${BASE}/login`, data)
  return res.data
}

async function refresh() {
  const res = await apiClient.post<BackendSuccessResponse<RefreshData>>(`${BASE}/refresh`)
  return res.data
}

async function logout() {
  const res = await apiClient.post<BackendSuccessResponse<null>>(`${BASE}/logout`)
  return res.data
}

// ── PASSWORD ──────────────────────────────────────────────────────────────

async function forgotPassword(data: ForgotPasswordRequest) {
  const res = await apiClient.post<BackendSuccessResponse<null>>(`${BASE}/forgot-password`, data)
  return res.data
}

async function resetPassword(data: ResetPasswordRequest) {
  const res = await apiClient.post<BackendSuccessResponse<null>>(`${BASE}/reset-password`, data)
  return res.data
}

// ── SESSIONS ──────────────────────────────────────────────────────────────

async function getSessions() {
  const res = await apiClient.get<BackendSuccessResponse<SessionView[]>>(`${BASE}/sessions`)
  return res.data.data ?? []
}

async function revokeSession(sessionId: string) {
  const res = await apiClient.delete<BackendSuccessResponse<null>>(`${BASE}/sessions/${sessionId}`)
  return res.data
}

async function revokeAllSessions() {
  const res = await apiClient.delete<BackendSuccessResponse<null>>(`${BASE}/sessions`)
  return res.data
}

export const authService = {
  register,
  verifyEmail,
  resendVerification,
  login,
  refresh,
  logout,
  forgotPassword,
  resetPassword,
  getSessions,
  revokeSession,
  revokeAllSessions,
}
