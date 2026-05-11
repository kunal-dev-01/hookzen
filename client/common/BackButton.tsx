import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "@/svg/Common";

interface BackButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
}

export default function BackButton({
  label = "RETURN_TO_SYSTEM",
  className = "",
  onClick,
  ...props
}: BackButtonProps) {
  const router = useRouter();

  const handleBack = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (onClick) {
      onClick(e);
    } else {
      router.back();
    }
  };

  return (
    <button
      onClick={handleBack}
      className={`
        group relative flex w-fit items-center gap-4 px-6 py-2 
        text-xs font-bold tracking-widest uppercase
        text-zinc-400 hover:text-white
        transition-all duration-150 ease-in-out
        border border-zinc-800 bg-black
        hover:border-zinc-500 active:bg-zinc-900
        cursor-pointer overflow-hidden
        ${className}
      `}
      {...props}
    >
      {/* Aggressive Scanner Effect */}
      <div className="absolute inset-0 w-1 bg-white/20 -translate-x-full group-hover:animate-scan" />

      {/* Glitch-like background highlight */}
      <div className="absolute inset-0 -z-10 bg-zinc-800/0 group-hover:bg-zinc-800/50 transition-colors duration-100" />

      <ArrowLeft className="h-4 w-4 transition-transform duration-200 ease-out group-hover:-translate-x-2 group-active:scale-90" />

      <span className="relative">{label}</span>

      {/* Industrial Accents */}
      <div className="absolute top-0 right-0 h-[4px] w-[4px] border-t border-r border-zinc-500 opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="absolute bottom-0 left-0 h-[4px] w-[4px] border-b border-l border-zinc-500 opacity-0 group-hover:opacity-100 transition-opacity" />
    </button>
  );
}
