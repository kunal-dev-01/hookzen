"use client";

import { useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useVerifyEmail } from "@/hooks/useAuth";
import { Loader } from "@/common/Loader";
import FormHead from "@/common/FormHead";
import BackButton from "@/common/BackButton";
import { motion } from "framer-motion";
import { containerVariants, itemVariants } from "@/animation/form";

function VerifyContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();
  const { verifyEmail, isPending, isSuccess, error } = useVerifyEmail();
  const hasRequested = useRef(false);

  useEffect(() => {
    if (token && !hasRequested.current) {
      hasRequested.current = true;
      verifyEmail({ token });
    }
  }, [token, verifyEmail]);

  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        router.replace("/dashboard");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, router]);

  if (!token) {
    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md space-y-6"
      >
        <FormHead title="MISSING_IDENTITY" />
        <div className="p-4 border-l-2 border-red-600 bg-red-600/5 text-red-500 font-mono text-[10px] uppercase tracking-[0.2em] leading-relaxed">
          [!] CRITICAL_ERROR: NO_VERIFICATION_TOKEN_FOUND.
          <br />
          ACCESS_REQUEST_ABORTED.
        </div>
        <div className="flex justify-center pt-4">
          <BackButton
            onClick={() => router.push("/auth/login")}
            label="RETURN_TO_BASE_STATION"
          />
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full max-w-md space-y-8"
    >
      <FormHead title="IDENTITY_VALIDATION" />

      <div className="relative p-8 border border-zinc-900 bg-black/40 backdrop-blur-sm">
        {/* Corner Brackets */}
        <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-cyan-500/50" />
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-cyan-500/50" />

        <div className="flex flex-col items-center text-center space-y-8">
          {isPending && (
            <motion.div variants={itemVariants} className="space-y-6 w-full">
              <div className="flex justify-center">
                <div className="relative">
                  <Loader className="w-16 h-16 text-cyan-500" />
                  <div className="absolute inset-0 animate-ping opacity-20 bg-cyan-500 rounded-full" />
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-[10px] font-mono text-cyan-500 tracking-[0.4em] uppercase animate-pulse">
                  Decrypting_Access_Key...
                </p>
                <div className="h-1 w-full bg-zinc-900 overflow-hidden relative">
                  <motion.div
                    initial={{ left: "-100%" }}
                    animate={{ left: "100%" }}
                    transition={{
                      repeat: Infinity,
                      duration: 1.5,
                      ease: "linear",
                    }}
                    className="absolute h-full w-1/3 bg-cyan-500 shadow-[0_0_15px_#22d3ee]"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {isSuccess && (
            <motion.div variants={itemVariants} className="space-y-6">
              <div className="inline-flex p-4 border border-green-500/30 bg-green-500/5 text-green-500">
                <svg
                  className="w-10 h-10"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="square"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div className="space-y-3">
                <h3 className="text-sm font-black text-white tracking-[0.3em] uppercase">
                  Auth_Sequence_Success
                </h3>
                <div className="p-2 border border-dashed border-zinc-800">
                  <p className="text-[10px] font-mono text-zinc-400 uppercase leading-relaxed">
                    Identity verified. Authorization tokens generated.
                    <br />
                    Redirecting to [DASHBOARD] in 3s...
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {error && (
            <motion.div variants={itemVariants} className="space-y-6">
              <div className="inline-flex p-4 border border-red-500/30 bg-red-500/5 text-red-500">
                <svg
                  className="w-10 h-10"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="square"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <div className="space-y-3">
                <h3 className="text-sm font-black text-red-500 tracking-[0.3em] uppercase">
                  Access_Denied
                </h3>
                <p className="text-[10px] font-mono text-zinc-500 uppercase px-4 leading-relaxed">
                  {error.message ||
                    "Security token checksum mismatch or expired."}
                </p>
              </div>
              <div className="pt-4">
                <BackButton
                  onClick={() => router.push("/auth/login")}
                  label="RETURN_TO_LOGIN_INTERFACE"
                />
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Hex Data Footer */}
      <div className="flex justify-between px-2 opacity-30">
        <div className="text-[8px] font-mono text-cyan-700 tracking-tighter">
          0x41 0x55 0x54 0x48
        </div>
        <div className="text-[8px] font-mono text-cyan-700 tracking-tighter">
          0x53 0x59 0x53 0x54 0x45 0x4D
        </div>
      </div>
    </motion.div>
  );
}

export default function Verify() {
  return (
    <main className="flex items-center justify-center p-6 relative">
      <div className="relative z-10 w-full flex justify-center">
        <Suspense
          fallback={
            <div className="text-cyan-500 font-mono text-[10px] animate-pulse uppercase tracking-[0.5em]">
              INITIALIZING_SECURE_SCAN...
            </div>
          }
        >
          <VerifyContent />
        </Suspense>
      </div>
    </main>
  );
}
