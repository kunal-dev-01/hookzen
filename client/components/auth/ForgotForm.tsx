import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import {
  forgotPasswordSchema,
  type ForgotPasswordSchema,
} from "@/schemas/auth.schemas";
import { useForgotPassword } from "@/hooks/useAuth";
import Input from "@/common/Input";
import Submit from "@/common/SubmitButton";
import FormHead from "@/common/FormHead";
import { containerVariants, itemVariants } from "@/animation/form";
import BackButton from "@/common/BackButton";

interface ForgotFormProps {
  onSuccess: (email: string) => void;
}

export default function ForgotForm({ onSuccess }: ForgotFormProps) {
  const { forgotPassword, isPending, error } = useForgotPassword();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordSchema>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = (data: ForgotPasswordSchema) => {
    forgotPassword(data, {
      onSuccess: () => {
        onSuccess(data.email);
      },
    });
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full max-w-md space-y-8"
    >
      <FormHead title="RECOVER_ACCESS" />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <motion.div
          variants={itemVariants}
          className="bg-zinc-900/20 p-4 border-l-2 border-zinc-700"
        >
          <p className="text-[10px] text-zinc-500 font-mono leading-relaxed">
            [SECURITY_PROTOCOL]: Enter your registered identifier. A remote
            recovery link will be dispatched to your node.
          </p>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Input
            label="Enter_Your_Email"
            name="email"
            type="email"
            placeholder="user@email.com"
            register={register}
            error={errors.email?.message}
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
            DISPATCH_RECOVERY_LINK
          </Submit>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="flex items-center justify-end mt-6"
        >
          <BackButton
            className="w-full flex items-center justify-center"
            label="Back_to_login"
            onClick={() => router.push("/auth/login")}
          />
        </motion.div>
      </form>
    </motion.div>
  );
}
