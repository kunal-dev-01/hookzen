import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  resetPasswordSchema,
  type ResetPasswordSchema,
} from "@/schemas/auth.schemas";
import { useResetPassword } from "@/hooks/useAuth";
import Input from "@/common/Input";
import Submit from "@/common/SubmitButton";
import FormHead from "@/common/FormHead";
import PasswordStrength from "@/common/PasswordStrength";
import { containerVariants, itemVariants } from "@/animation/form";
import BackButton from "@/common/BackButton";

interface ResetFormProps {
  token: string;
}

export default function ResetForm({ token }: ResetFormProps) {
  const { resetPassword, isPending, error } = useResetPassword();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordSchema>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const password = watch("password", "");

  const onSubmit = (data: ResetPasswordSchema) => {
    resetPassword(
      { token, password: data.password },
      {
        onSuccess: () => {
          router.push("/auth/login?reset=success");
        },
      },
    );
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full max-w-md space-y-8"
    >
      <FormHead title="RESET_PASSWORD" />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <motion.div
          variants={itemVariants}
          className="bg-zinc-900/20 p-4 border-l-2 border-zinc-700"
        >
          <p className="text-[10px] text-zinc-500 font-mono leading-relaxed">
            [SECURITY_PROTOCOL]: Authorization token detected. Initialize a new
            cryptographic sequence to regain access.
          </p>
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-2">
          <Input
            label="New_password"
            name="password"
            type="password"
            placeholder="••••••••"
            register={register}
            error={errors.password?.message}
            disabled={isPending}
          />
          <PasswordStrength password={password} />
        </motion.div>

        <motion.div variants={itemVariants}>
          <Input
            label="Confirm_password"
            name="confirm_password"
            type="password"
            placeholder="••••••••"
            register={register}
            error={errors.confirm_password?.message}
            disabled={isPending}
          />
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-3 bg-red-500/10 border-l-2 border-red-500 text-red-500 text-[10px] font-mono uppercase tracking-wider"
          >
            {">"} ERROR: {error.message}
          </motion.div>
        )}

        <motion.div variants={itemVariants} className="mt-8">
          <Submit type="submit" loading={isPending}>
            UPDATE_SECURITY_CREDENTIALS
          </Submit>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="flex items-center justify-end mt-6"
        >
          <BackButton
            type="button"
            className="w-full flex items-center justify-center"
            label="Remember_password"
            onClick={() => router.push("/auth/login")}
          />
        </motion.div>
      </form>
    </motion.div>
  );
}
