import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { motion } from "framer-motion";
import { loginSchema, type LoginSchema } from "@/schemas/auth.schemas";
import { useLogin } from "@/hooks/useAuth";
import Input from "@/common/Input";
import Submit from "@/common/SubmitButton";
import FormHead from "@/common/FormHead";
import { containerVariants, itemVariants } from "@/animation/form";

export default function LoginForm() {
  const { login, isPending, error } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginSchema) => {
    login(data);
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full max-w-md space-y-8"
    >
      <FormHead title="Welcome_Back" />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <motion.div variants={itemVariants}>
          <Input
            label="Your_Email"
            name="email"
            type="email"
            placeholder="user@gmail.com"
            register={register}
            error={errors.email?.message}
            disabled={isPending}
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <Input
            label="Your_Password"
            name="password"
            type="password"
            placeholder="••••••••"
            register={register}
            error={errors.password?.message}
            disabled={isPending}
          />

          <div className="flex items-center justify-end mt-6">
            <Link
              href="/auth/forgot"
              className="text-[10px] text-zinc-500 uppercase hover:text-cyan-500 transition-colors"
            >
              //Forgot_Password?
            </Link>
          </div>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-3 bg-red-500/10 border-l-2 border-red-500 text-red-500 text-[10px] font-mono uppercase tracking-wider"
          >
            {">"} AUTH_FAILURE: {error.message}
          </motion.div>
        )}

        <motion.div variants={itemVariants} className="mt-8">
          <Submit type="submit" loading={isPending}>
            LOGIN_ACCESS
          </Submit>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="flex items-center justify-center pt-4"
        >
          <p className="text-[10px] font-medium text-zinc-500 tracking-widest uppercase">
            New operator?{" "}
            <Link
              href="/auth/register"
              className="text-cyan-500 hover:text-cyan-400 transition-colors font-bold ml-2 underline decoration-cyan-500/30 underline-offset-4"
            >
              REQUEST_ACCESS
            </Link>
          </p>
        </motion.div>
      </form>
    </motion.div>
  );
}
