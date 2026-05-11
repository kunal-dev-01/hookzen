"use client";

import React, { useState, useEffect } from "react";
import { useResendVerification } from "@/hooks/useAuth";
import CountdownButton from "@/common/CountdownButton";
import BackButton from "@/common/BackButton";
import FormHead from "@/common/FormHead";
import { Mail } from "@/svg/Common";

interface ResendVerifyProps {
  email: string;
  onBack: () => void;
}

export default function ResendVerify({ email, onBack }: ResendVerifyProps) {
  const [countdown, setCountdown] = useState(0);
  const { resend, isPending, isSuccess, error } = useResendVerification();

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
          setCountdown(60); // 60 seconds cooldown
        },
      },
    );
  };

  return (
    <div className="w-full max-w-md space-y-8 animate-in fade-in zoom-in-95 duration-500">
      <FormHead title="VERIFY EMAIL" />

      <div className="space-y-6">
        <div className="flex flex-col items-center justify-center p-8 border border-zinc-800 bg-black/50 relative group">
          <div className="absolute inset-0 bg-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />

          <div className="relative z-10 flex flex-col items-center text-center space-y-4">
            <div className="p-4 rounded-full bg-zinc-900 border border-zinc-800 text-cyan-500 shadow-[0_0_20px_rgba(34,211,238,0.1)]">
              <Mail className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-bold text-white tracking-[0.2em] uppercase">
                Verification Link Sent
              </h3>
              <p className="text-[11px] text-zinc-500 font-medium leading-relaxed tracking-wider">
                We've dispatched a secure transmission to:
                <br />
                <span className="text-cyan-400 font-mono mt-1 inline-block uppercase">
                  {email}
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest text-center italic">
            Check your inbox (and spam) to complete activation.
          </p>

          <CountdownButton
            onClick={handleResend}
            isLoading={isPending}
            countdown={countdown}
            defaultText="RESEND_VERIFICATION_LINK"
            countdownText={(sec) => `SYSTEM_LOCKOUT: ${sec}S`}
            className="h-12 border border-zinc-800 hover:border-cyan-500/50"
          />

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-bold uppercase tracking-wider italic text-center">
              [!] TRANSMISSION_FAILURE: {error.message}
            </div>
          )}

          {isSuccess && !countdown && (
            <div className="p-3 bg-green-500/10 border border-green-500/20 text-green-500 text-[10px] font-bold uppercase tracking-wider italic text-center">
              [+] NEW_LINK_DISPATCHED_SUCCESSFULLY
            </div>
          )}
        </div>

        <div className="pt-4 flex justify-center">
          <BackButton onClick={onBack} label="BACK_TO_REGISTRATION" />
        </div>
      </div>
    </div>
  );
}
