import { useAuthStore } from "@/store/auth.store";
import { useUpdateProfile } from "@/hooks/useUser";
import VariantButton from "@/common/VariantButton";
import Input from "@/common/Input";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useEffect } from "react";
import { getInitials } from "@/utils/Initials";

interface ProfileSchema {
  full_name: string;
}

function UserProfile() {
  const user = useAuthStore((s) => s.user);
  const { updateProfile, isPending } = useUpdateProfile();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileSchema>({
    defaultValues: {
      full_name: user?.full_name || "",
    },
  });

  useEffect(() => {
    if (user) {
      reset({ full_name: user.full_name });
    }
  }, [user, reset]);

  const onSubmit = (data: ProfileSchema) => {
    if (data.full_name === user?.full_name) return;

    updateProfile(data, {
      onSuccess: () => {
        toast.success("Profile updated successfully");
      },
      onError: (error) => {
        toast.error(error.message || "Failed to update profile");
      },
    });
  };

  const initials = getInitials(user?.full_name);

  return (
    <div className="w-full p-4 space-y-8">
      {/* Top Profile Card */}
      <div className="relative p-6 border border-zinc-900 bg-black/40 overflow-hidden group">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          {/* Initials Avatar */}
          <div className="relative shrink-0">
            <div className="w-16 h-16 border border-cyan-500/50 flex items-center justify-center bg-cyan-500/5 relative z-10">
              <span className="text-xl font-black font-mono text-cyan-400">
                {initials}
              </span>
            </div>
            {/* Decorative Glitch Effect */}
            <div className="absolute -inset-1 border border-cyan-500/20 animate-pulse" />
          </div>

          <div className="space-y-1">
            <h3 className="text-sm font-black font-mono tracking-widest text-zinc-100 uppercase">
              {user?.full_name || "ACCESS_DENIED"}
            </h3>
            <div className="flex flex-col gap-0.5">
              <p className="text-[11px] text-zinc-500 font-mono break-all lowercase tracking-tighter">
                {user?.email}
              </p>
              <div className="flex items-center gap-2">
                <div
                  className={`h-1 w-1 rounded-full ${user?.is_email_verified ? "bg-cyan-500" : "bg-red-500 animate-pulse"}`}
                />
                <span
                  className={`text-[9px] font-mono font-bold tracking-widest uppercase ${user?.is_email_verified ? "text-cyan-500/70" : "text-red-500/70"}`}
                >
                  {user?.is_email_verified
                    ? "VERIFIED_SECURE"
                    : "UNVERIFIED_ACCOUNT"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Update Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-md">
        <div className="space-y-4">
          <Input
            label="Full_Name_Override"
            name="full_name"
            placeholder="ENTER NEW IDENTITY"
            register={register}
            error={errors.full_name?.message}
            disabled={isPending}
          />
        </div>

        <div className="pt-2">
          <VariantButton
            type="submit"
            label="commit_changes"
            variant="cyan"
            isLoading={isPending}
          />
        </div>
      </form>
    </div>
  );
}

export default UserProfile;
