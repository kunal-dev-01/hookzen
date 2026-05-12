import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { motion } from "framer-motion";
import { registerSchema, type RegisterSchema } from "@/schemas/auth.schemas";
import { useRegister } from "@/hooks/useAuth";
import Input from "@/common/Input";
import Submit from "@/common/SubmitButton";
import PasswordStrength from "@/common/PasswordStrength";
import FormHead from "@/common/FormHead";
import { containerVariants, itemVariants } from "@/animation/form";
import { toast } from "sonner";

interface RegisterFormProps {
  onSuccess: (email: string) => void;
}

export default function RegisterForm({ onSuccess }: RegisterFormProps) {
  const { register: registerUser, isPending } = useRegister();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
  });

  const password = watch("password", "");

  const onSubmit = async (data: RegisterSchema) => {
    registerUser(data, {
      onSuccess: () => {
        onSuccess(data.email);
        toast.success("Account created successfully");
      },
      onError: (err) => {
        toast.error(err.message || "Failed to create account");
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
      <FormHead title="CREATE_ACCOUNT" />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <motion.div variants={itemVariants}>
          <Input
            label="Full_Name"
            name="full_name"
            placeholder="ENTER_YOUR_NAME"
            register={register}
            error={errors.full_name?.message}
            disabled={isPending}
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <Input
            label="Email_Address"
            name="email"
            type="email"
            placeholder="USER@SYSTEM.LOCAL"
            register={register}
            error={errors.email?.message}
            disabled={isPending}
          />
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-2">
          <Input
            label="Password"
            name="password"
            type="password"
            placeholder="••••••••"
            register={register}
            error={errors.password?.message}
            disabled={isPending}
          />
          <PasswordStrength password={password} />
        </motion.div>

        <motion.div variants={itemVariants} className="mt-8">
          <Submit type="submit" loading={isPending}>
            INITIALIZE_ACCOUNT
          </Submit>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="flex items-center justify-center pt-4"
        >
          <p className="text-[10px] font-medium text-zinc-500 tracking-widest uppercase">
            Already registered?{" "}
            <Link
              href="/auth/login"
              className="text-cyan-500 hover:text-cyan-400 transition-colors font-bold ml-2 underline decoration-cyan-500/30 underline-offset-4"
            >
              ACCESS_SYSTEM
            </Link>
          </p>
        </motion.div>
      </form>
    </motion.div>
  );
}
