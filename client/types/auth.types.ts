import type { User } from "./user.types";

// ── REQUESTS ──────────────────────────────────────────────────────────────

export interface RegisterRequest {
  full_name: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface VerifyEmailRequest {
  token: string;
}

export interface ResendVerificationRequest {
  email: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
}

// ── RESPONSES ─────────────────────────────────────────────────────────────

export interface AuthData {
  user: User;
  access_token: string;
}

export interface RefreshData {
  access_token: string;
}

export interface SessionView {
  id: string;
  ip_address: string;
  browser: string;
  os: string;
  device_name: string;
  city: string;
  country: string;
  created_at: string;
  is_current: boolean;
}
