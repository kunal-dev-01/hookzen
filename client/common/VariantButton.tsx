"use client";
import React from "react";
import { motion, AnimatePresence, HTMLMotionProps } from "framer-motion";
import { Loader } from "./Loader";

type ButtonVariant = "default" | "save" | "delete" | "info" | "cyan" | "lime";

interface VariantButtonProps extends HTMLMotionProps<"button"> {
  icon?: React.ElementType;
  variant?: ButtonVariant;
  isLoading?: boolean;
  label: string;
}

// Technical Color Mapping
const variantConfig: Record<
  ButtonVariant,
  { border: string; bg: string; text: string; shadow: string }
> = {
  default: {
    border: "border-zinc-800",
    bg: "bg-zinc-900/50",
    text: "text-zinc-500",
    shadow: "group-hover:shadow-[0_0_15px_rgba(39,39,42,0.4)]",
  },
  save: {
    border: "border-indigo-500/50",
    bg: "bg-indigo-500/5",
    text: "text-indigo-400",
    shadow: "group-hover:shadow-[0_0_15px_rgba(99,102,241,0.2)]",
  },
  cyan: {
    border: "border-cyan-500/50",
    bg: "bg-cyan-500/5",
    text: "text-cyan-400",
    shadow: "group-hover:shadow-[0_0_15px_rgba(34,211,238,0.2)]",
  },
  lime: {
    border: "border-lime-500/50",
    bg: "bg-lime-500/5",
    text: "text-lime-400",
    shadow: "group-hover:shadow-[0_0_15px_rgba(163,230,53,0.2)]",
  },
  delete: {
    border: "border-red-500/50",
    bg: "bg-red-500/5",
    text: "text-red-400",
    shadow: "group-hover:shadow-[0_0_15px_rgba(239,68,68,0.2)]",
  },
  info: {
    border: "border-yellow-500/50",
    bg: "bg-yellow-500/5",
    text: "text-yellow-400",
    shadow: "group-hover:shadow-[0_0_15px_rgba(234,179,8,0.2)]",
  },
};

const VariantButton = ({
  icon: Icon,
  label,
  variant = "default",
  isLoading = false,
  disabled,
  className,
  ...props
}: VariantButtonProps) => {
  const isDisabled = disabled || isLoading;
  const config = variantConfig[variant];

  return (
    <div className="relative group w-full">
      {/* Corner Accents (Visible only on Hover) */}
      <div
        className={`absolute -top-px -left-px w-2 h-2 border-t border-l transition-all duration-300 opacity-0 group-hover:opacity-100 ${config.border.replace("border-", "border-").split("/")[0]}`}
      />
      <div
        className={`absolute -bottom-px -right-px w-2 h-2 border-b border-r transition-all duration-300 opacity-0 group-hover:opacity-100 ${config.border.replace("border-", "border-").split("/")[0]}`}
      />

      <motion.button
        whileTap={!isDisabled ? { scale: 0.98, x: 1, y: 1 } : {}}
        disabled={isDisabled}
        className={`
          relative w-full px-6 py-2.5 flex items-center justify-center gap-3
          border ${config.border} ${config.bg} ${config.text}
          font-mono text-[11px] font-black tracking-[0.2em] uppercase
          transition-all duration-300 overflow-hidden
          ${config.shadow}
          ${!isDisabled ? "hover:brightness-125 cursor-pointer" : "opacity-40 cursor-not-allowed"}
          ${className}
        `}
        {...props}
      >
        {/* Subtle Scanline Effect on Hover */}
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-white/2 to-transparent -translate-y-full group-hover:translate-y-full transition-transform duration-1000" />

        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2"
            >
              <Loader className="w-3 h-3 animate-spin" />
              <span className="tracking-[0.3em]">PROCESSING...</span>
            </motion.div>
          ) : (
            <div className="flex items-center gap-2.5 relative z-10">
              {Icon && <Icon className="h-4 w-4 stroke-3" />}
              <span>{label}</span>
            </div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
};

export default VariantButton;
