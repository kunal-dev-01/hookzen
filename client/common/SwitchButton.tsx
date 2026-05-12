// @/common/Switch.tsx
import React from "react";
import { Loader } from "./Loader";

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  isLoading?: boolean;
}

export const Switch: React.FC<SwitchProps> = ({
  checked,
  onChange,
  disabled,
  isLoading = false,
}) => {
  const isDisabled = disabled || isLoading;

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={isDisabled}
      onClick={() => onChange(!checked)}
      className={`
        relative inline-flex h-6 w-12 shrink-0 cursor-pointer items-center 
        border border-zinc-900 transition-all duration-300 ease-in-out 
        focus:outline-none p-1 overflow-hidden select-none
        ${isDisabled ? "opacity-30 cursor-not-allowed" : "hover:border-zinc-700"}
        ${checked ? "bg-zinc-900" : "bg-black"}
      `}
    >
      <span className="sr-only">Toggle Protocol</span>

      {/* Track Background Glow (Subtle) */}
      <div
        className={`absolute inset-0 transition-opacity duration-300 ${checked ? "opacity-10 bg-cyan-500" : "opacity-0"}`}
      />

      {/* Switch Handle (Cyan Slider) */}
      <span
        className={`
          pointer-events-none relative z-10 flex items-center justify-center h-full w-4 
          transform transition-all duration-200 ease-[cubic-bezier(0.2,1,0.3,1)]
          ${checked ? "translate-x-6 bg-cyan-500 shadow-[0_0_12px_#22d3ee]" : "translate-x-0 bg-zinc-800"}
        `}
      >
        {isLoading ? (
          <Loader
            className={`w-2.5 h-2.5 animate-spin ${checked ? "text-black" : "text-cyan-500"}`}
          />
        ) : (
          /* Mechanical Detail (Simple Line) */
          <div
            className={`w-px h-2 ${checked ? "bg-black/40" : "bg-zinc-600"}`}
          />
        )}
      </span>

      {/* Invisible Status Markers for alignment feel */}
      <div className="absolute inset-0 flex items-center justify-between px-2 pointer-events-none">
        <span
          className={`text-[6px] font-black font-mono transition-opacity ${checked ? "opacity-0" : "opacity-20 text-zinc-500"}`}
        >
          OFF
        </span>
        <span
          className={`text-[6px] font-black font-mono transition-opacity ${checked ? "opacity-100 text-black" : "opacity-0"}`}
        >
          ON
        </span>
      </div>
    </button>
  );
};
