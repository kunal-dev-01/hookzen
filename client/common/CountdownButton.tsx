import React from "react";
import type { ButtonHTMLAttributes } from "react";
import { Loader } from "@/common/Loader";

interface CountdownButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  countdown?: number;
  defaultText?: string;
  countdownText?: (seconds: number) => string;
  icon?: React.ReactNode;
}

export default function CountdownButton({
  isLoading = false,
  countdown = 0,
  defaultText = "RESEND_LINK",
  countdownText = (sec) => `RETRY_LOCKOUT: ${sec}S`,
  icon,
  className = "",
  ...rest
}: CountdownButtonProps) {
  const isDisabled = countdown > 0 || isLoading || rest.disabled;

  return (
    <button
      disabled={isDisabled}
      {...rest}
      className={`
        relative overflow-hidden
        flex items-center justify-center gap-3 w-full py-2.5 px-6 
        bg-black font-mono text-[11px] tracking-[0.25em] uppercase
        transition-all duration-300
        ${
          !isDisabled
            ? "border border-cyan-500/50 text-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.15)]"
            : "border border-zinc-800 text-zinc-600 opacity-60"
        }
        disabled:cursor-not-allowed
        ${className}
      `}
    >
      {!isDisabled && (
        <div className="absolute inset-0 bg-linear-to-r from-transparent via-cyan-500/10 to-transparent -translate-x-full animate-[shimmer_3s_infinite]" />
      )}

      <span className="relative z-10 flex items-center gap-2">
        {isLoading ? (
          <Loader className="w-5 h-5 text-cyan-500" />
        ) : (
          !isDisabled && <span className="animate-pulse">[!]</span>
        )}

        <span className="font-bold">
          {countdown > 0 ? countdownText(countdown) : defaultText}
        </span>
      </span>

      <div
        className={`absolute left-0 top-0 h-full w-[2px] ${!isDisabled ? "bg-cyan-500 shadow-[0_0_8px_#22d3ee]" : "bg-zinc-800"}`}
      />

      {!isDisabled && (
        <>
          <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-cyan-500/50" />
          <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-cyan-500/50" />
        </>
      )}
    </button>
  );
}
