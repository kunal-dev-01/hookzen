import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useResendVerification } from "@/hooks/useAuth";
import CountdownButton from "@/common/CountdownButton";
import BackButton from "@/common/BackButton";
import FormHead from "@/common/FormHead";
import { Mail } from "@/svg/Common";
import { containerVariants, itemVariants } from "@/animation/form";
import { toast } from "sonner";

interface ResendVerifyProps {
  email: string;
  onBack: () => void;
}

export default function ResendVerify({ email, onBack }: ResendVerifyProps) {
  const [countdown, setCountdown] = useState(0);
  const { resend, isPending, isSuccess } = useResendVerification();

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const handleResend = () => {
    resend(
      { email },
      {
        onSuccess: () => {
          setCountdown(60);
          toast.success("New verification link sent successfully");
        },
        onError: (err) => {
          toast.error(err.message || "Failed to resend verification link");
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
      <FormHead title="VERIFY_IDENTITY" />

      <div className="space-y-6">
        <motion.div
          variants={itemVariants}
          className="relative p-6 border-l-2 border-cyan-500 bg-zinc-900/30 overflow-hidden"
        >
          {/* Decorative scanner line */}
          <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-cyan-500/50 to-transparent" />

          <div className="flex items-start gap-5 relative z-10">
            <div className="shrink-0">
              <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                <Mail className="w-6 h-6 animate-pulse" />
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <h3 className="text-[10px] font-black text-cyan-500 tracking-[0.3em] uppercase mb-1">
                  Status: DISPATCHED
                </h3>
                <p className="text-[12px] text-zinc-300 font-mono break-all leading-tight">
                  Target_Node: <span className="text-white">{email}</span>
                </p>
              </div>

              <div className="space-y-1">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-1 w-4 bg-cyan-500/40" />
                  ))}
                </div>
                <p className="text-[9px] text-zinc-500 uppercase tracking-tighter italic">
                  // Secure_transmission_in_progress
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="space-y-4">
          <motion.div
            variants={itemVariants}
            className="bg-zinc-900/20 p-3 border border-zinc-800"
          >
            <p className="text-[9px] text-zinc-500 font-mono leading-relaxed text-center">
              [SYSTEM_MESSAGE]: Check your inbox or spam directory. Remote
              activation link expires in 24 hours.
            </p>
          </motion.div>

          <motion.div variants={itemVariants}>
            <CountdownButton
              onClick={handleResend}
              isLoading={isPending}
              countdown={countdown}
            />
          </motion.div>

          {isSuccess && !countdown && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-3 bg-cyan-500/10 border-l-2 border-cyan-500 text-cyan-400 text-[10px] font-mono uppercase tracking-wider"
            >
              {">"} SUCCESS: NEW_LINK_SENT
            </motion.div>
          )}
        </div>

        <motion.div variants={itemVariants} className="flex justify-center">
          <BackButton
            type="button"
            onClick={onBack}
            label="ABORT_AND_RETURN"
            className="w-full flex items-center justify-center"
          />
        </motion.div>
      </div>
    </motion.div>
  );
}
