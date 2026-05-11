import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth.store";
import type { ApiError } from "@/types/api.types";
import type {
  RegisterRequest,
  LoginRequest,
  VerifyEmailRequest,
  ResendVerificationRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
} from "@/types/auth.types";

export const authKeys = {
  me: ["auth", "me"] as const,
  sessions: ["auth", "sessions"] as const,
};

// ── REGISTER ──────────────────────────────────────────────────────────────

export function useRegister() {
  const mutation = useMutation({
    mutationFn: (data: RegisterRequest) => authService.register(data),
  });

  return {
    register: mutation.mutate,
    registerAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    isSuccess: mutation.isSuccess,
    error: mutation.error as ApiError | null,
    data: mutation.data,
  };
}

// ── VERIFY EMAIL ──────────────────────────────────────────────────────────

export function useVerifyEmail() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: VerifyEmailRequest) => authService.verifyEmail(data),
    onSuccess: (res) => {
      if (res.data) {
        setAuth(res.data.user, res.data.access_token);
        queryClient.invalidateQueries({ queryKey: authKeys.me });
      }
    },
  });

  return {
    verifyEmail: mutation.mutate,
    verifyEmailAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    isSuccess: mutation.isSuccess,
    error: mutation.error as ApiError | null,
  };
}

// ── LOGIN ─────────────────────────────────────────────────────────────────

export function useLogin() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: LoginRequest) => authService.login(data),
    onSuccess: (res) => {
      if (res.data) {
        setAuth(res.data.user, res.data.access_token);
        queryClient.invalidateQueries({ queryKey: authKeys.me });
      }
    },
  });

  return {
    login: mutation.mutate,
    loginAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    isSuccess: mutation.isSuccess,
    error: mutation.error as ApiError | null,
    data: mutation.data,
  };
}

// ── LOGOUT ────────────────────────────────────────────────────────────────

export function useLogout() {
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const queryClient = useQueryClient();
  const router = useRouter();

  const cleanup = () => {
    clearAuth();
    queryClient.clear();
    router.replace("/auth/login");
  };

  const mutation = useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: cleanup,
    onError: cleanup, // Always cleanup locally
  });

  return {
    logout: mutation.mutate,
    logoutAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
  };
}

// ── PASSWORD ──────────────────────────────────────────────────────────────

export function useForgotPassword() {
  const mutation = useMutation({
    mutationFn: (data: ForgotPasswordRequest) =>
      authService.forgotPassword(data),
  });

  return {
    forgotPassword: mutation.mutate,
    isPending: mutation.isPending,
    isSuccess: mutation.isSuccess,
    error: mutation.error as ApiError | null,
  };
}

export function useResetPassword() {
  const mutation = useMutation({
    mutationFn: (data: ResetPasswordRequest) => authService.resetPassword(data),
  });

  return {
    resetPassword: mutation.mutate,
    isPending: mutation.isPending,
    isSuccess: mutation.isSuccess,
    error: mutation.error as ApiError | null,
  };
}

// ── SESSIONS ──────────────────────────────────────────────────────────────

export function useSessions() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const query = useQuery({
    queryKey: authKeys.sessions,
    queryFn: authService.getSessions,
    enabled: isAuthenticated,
  });

  return {
    sessions: query.data ?? [],
    isPending: query.isPending,
    isError: query.isError,
    error: query.error as ApiError | null,
    refetch: query.refetch,
  };
}

export function useResendVerification() {
  const mutation = useMutation({
    mutationFn: (data: ResendVerificationRequest) =>
      authService.resendVerification(data),
  });

  return {
    resend: mutation.mutate,
    resendAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    isSuccess: mutation.isSuccess,
    error: mutation.error as ApiError | null,
  };
}

export function useRevokeSession() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (sessionId: string) => authService.revokeSession(sessionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authKeys.sessions });
    },
  });

  return {
    revokeSession: mutation.mutate,
    isPending: mutation.isPending,
  };
}
