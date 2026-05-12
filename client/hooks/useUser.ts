import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { userService } from "@/services/user.service";
import { useAuthStore } from "@/store/auth.store";
import type { UpdateUserPayload, UpdatePreferencesPayload } from "@/types/user.types";
import type { ApiError } from "@/types/api.types";

export const userKeys = {
  me: ["user", "me"] as const,
};

// ── GET ME ──────────────────────────────────────────────────────────────

export function useMe() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const query = useQuery({
    queryKey: userKeys.me,
    queryFn: userService.getMe,
    enabled: isAuthenticated,
  });

  return {
    user: query.data?.data,
    isPending: query.isPending,
    isError: query.isError,
    error: query.error as ApiError | null,
    refetch: query.refetch,
  };
}

// ── UPDATE PROFILE ────────────────────────────────────────────────────────

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const updateUserLocally = useAuthStore((s) => s.updateUserLocally);

  const mutation = useMutation({
    mutationFn: (payload: UpdateUserPayload) => userService.updateProfile(payload),
    onSuccess: (res) => {
      if (res.data) {
        updateUserLocally(res.data);
        queryClient.invalidateQueries({ queryKey: userKeys.me });
      }
    },
  });

  return {
    updateProfile: mutation.mutate,
    updateProfileAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: mutation.error as ApiError | null,
    isSuccess: mutation.isSuccess,
  };
}

// ── UPDATE PREFERENCES ────────────────────────────────────────────────────

export function useUpdatePreferences() {
  const queryClient = useQueryClient();
  const updateUserLocally = useAuthStore((s) => s.updateUserLocally);

  const mutation = useMutation({
    mutationFn: (payload: UpdatePreferencesPayload) =>
      userService.updatePreferences(payload),
    onSuccess: (res) => {
      if (res.data) {
        updateUserLocally(res.data);
        queryClient.invalidateQueries({ queryKey: userKeys.me });
      }
    },
  });

  return {
    updatePreferences: mutation.mutate,
    updatePreferencesAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: mutation.error as ApiError | null,
    isSuccess: mutation.isSuccess,
  };
}
