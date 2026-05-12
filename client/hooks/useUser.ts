import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userService } from "@/services/user.service";
import { useAuthStore } from "@/store/auth.store";
import type { UpdateUserPayload } from "@/types/user.types";
import type { ApiError } from "@/types/api.types";

export function useUpdateUser() {
  const queryClient = useQueryClient();
  const updateUserLocally = useAuthStore((s) => s.updateUserLocally);

  const mutation = useMutation({
    mutationFn: (payload: UpdateUserPayload) => userService.updateMe(payload),
    onSuccess: (res) => {
      if (res.data) {
        updateUserLocally(res.data);
        // Invalidate 'auth' queries to keep data fresh
        queryClient.invalidateQueries({ queryKey: ["auth"] });
      }
    },
  });

  return {
    updateUser: mutation.mutate,
    updateUserAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: mutation.error as ApiError | null,
    isSuccess: mutation.isSuccess,
  };
}
