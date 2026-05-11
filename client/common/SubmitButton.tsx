import React from "react";
import type { ButtonHTMLAttributes } from "react";
import { Loader } from "@/common/Loader";

type Props = {
  loading?: boolean;
  children: React.ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export default function Submit({
  loading = false,
  children,
  className = "",
  ...rest
}: Props) {
  return (
    <button
      disabled={loading || rest.disabled}
      {...rest}
      className={`
        outline-none relative overflow-hidden group
        w-full flex items-center justify-center gap-2
        py-3 px-6 cursor-pointer
        bg-black border border-cyan-500/30
        text-cyan-400 font-mono text-xs tracking-[0.25em] uppercase
        transition-all duration-300 ease-out
        hover:border-cyan-400 hover:text-cyan-300
        hover:shadow-[0_0_15px_rgba(34,211,238,0.2)]
        active:scale-[0.99]
        disabled:opacity-40 disabled:cursor-not-allowed
        ${className}
      `}
    >
      {/* Background Subtle Scanner (Diagonal lines) */}
      <div className="absolute inset-0 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(34,211,238,0.5)_10px,rgba(34,211,238,0.5)_11px)]" />

      {/* Content */}
      <span className="relative z-10 flex items-center justify-center gap-3">
        {loading ? (
          <Loader />
        ) : (
          <span className="text-cyan-500 group-hover:translate-x-1 transition-transform">
            {">>"}
          </span>
        )}
        <span className="font-bold">{loading ? "EXECUTING..." : children}</span>
      </span>

      {/* Glitch Line at Bottom */}
      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-cyan-500 shadow-[0_0_12px_#22d3ee]">
        {/* Animated Scanning Glitch */}
        <div className="absolute top-0 left-0 h-full w-full bg-cyan-300 transition-transform duration-600 ease-in-out -translate-x-full group-hover:translate-x-full" />
      </div>

      {/* Corner Accents (Hacker Aesthetic) */}
      <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-cyan-500" />
      <div className="absolute top-0 right-0 w-1.5 h-1.5 border-t border-r border-cyan-500" />
    </button>
  );
}
