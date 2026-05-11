import { EyeClose, EyeOpen } from "@/svg/Common";
import { useState } from "react";
import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  register: any;
  error?: string;
  name: string;
  variant?: "default" | "form" | "danger";
}

const Input = ({
  label,
  type = "text",
  placeholder,
  register,
  error,
  name,
  disabled,
  variant = "form", // Defaulted to form for the gateway look
  ...rest
}: InputProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  const variantStyles = {
    default: {
      border: "border-zinc-800 hover:border-zinc-700 focus:border-zinc-500",
      bg: "bg-transparent",
      label: "text-zinc-500",
    },
    form: {
      border: "border-zinc-800 focus:border-white hover:border-zinc-600",
      bg: "bg-black", // Matching your specific background
      label: "text-zinc-400",
    },
    danger: {
      border: "border-red-900 focus:border-red-500",
      bg: "bg-red-500/5",
      label: "text-red-500",
    },
  };

  const currentVariant = error ? "danger" : variant;
  const styles = variantStyles[currentVariant];

  return (
    <div className="flex flex-col gap-2 w-full group/container">
      {/* Label with a more technical look */}
      <div className="flex items-center gap-2">
        <div
          className={`h-1 w-1 ${error ? "bg-red-500" : "bg-zinc-700"} group-focus-within/container:bg-white transition-colors`}
        />
        <label
          htmlFor={name}
          className={`text-[10px] font-bold tracking-[0.2em] uppercase ${styles.label} group-focus-within/container:text-white transition-colors`}
        >
          {label}
        </label>
      </div>

      <div className="relative overflow-hidden">
        <input
          id={name}
          disabled={disabled}
          type={isPassword ? (showPassword ? "text" : "password") : type}
          placeholder={placeholder}
          {...rest}
          {...register(name)}
          className={`
            w-full px-4 py-2 text-sm font-medium border outline-none transition-all duration-200
            rounded-none 
            ${isPassword ? "pr-12" : ""} 
            ${styles.border} 
            ${styles.bg}
            text-zinc-100 placeholder:text-zinc-700 
            disabled:cursor-not-allowed disabled:opacity-50
            relative z-10
          `}
        />

        {/* Focus Glow / Scanline effect */}
        <div className="absolute bottom-0 left-0 h-px w-0 bg-white z-20 transition-all duration-300 group-focus-within/container:w-full" />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            tabIndex={-1}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 p-1.5 text-zinc-600 hover:text-white transition-colors focus:outline-none"
          >
            {showPassword ? (
              <EyeOpen className="w-4 h-4" />
            ) : (
              <EyeClose className="w-4 h-4" />
            )}
          </button>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-1.5 mt-1">
          <span className="text-[10px] font-bold text-red-500 tracking-tighter uppercase italic">
            [!] Error: {error}
          </span>
        </div>
      )}
    </div>
  );
};

export default Input;
