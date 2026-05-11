import { memo, useMemo } from "react";

interface PasswordStrengthProps {
  password?: string;
}

const PasswordStrength = memo(({ password = "" }: PasswordStrengthProps) => {
  const { level, text, color, width } = useMemo(() => {
    if (!password) return { level: 0, text: "", color: "", width: "0%" };

    let score = 0;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    // Hacker theme colors: Red -> Yellow -> Cyan (for strong)
    if (score <= 2)
      return {
        level: 1,
        text: "VULNERABLE",
        color: "bg-red-500",
        width: "25%",
      };
    if (score <= 3)
      return { level: 2, text: "FAIR", color: "bg-orange-500", width: "50%" };
    if (score <= 4)
      return { level: 3, text: "SECURE", color: "bg-yellow-500", width: "75%" };
    return { level: 4, text: "ENCRYPTED", color: "bg-cyan-500", width: "100%" };
  }, [password]);

  if (!password) return null;

  return (
    <div className="flex flex-col gap-1.5 w-full mt-3 font-mono">
      {/* Header with Hacker Labels */}
      <div className="flex items-center justify-between text-[10px] tracking-widest uppercase">
        <span className="text-zinc-500">Security_Level:</span>
        <span className={level === 4 ? "text-cyan-400" : "text-zinc-400"}>
          {text} [{width}]
        </span>
      </div>

      {/* Main Single Bar Meter */}
      <div className="relative h-[4px] w-full bg-zinc-900 border border-zinc-800 overflow-hidden">
        {/* Dynamic Strength Fill */}
        <div
          className={`h-full transition-all duration-700 ease-out ${color} ${
            level === 4 ? "shadow-[0_0_10px_#22d3ee]" : ""
          }`}
          style={{ width: width }}
        />

        {/* Background Grid/Scanline on the bar for detail */}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.4)_1px,transparent_1px)] bg-size-[4px_100%] pointer-events-none" />
      </div>

      {/* Subtle Hint */}
      <div className="text-[9px] text-zinc-600 uppercase tracking-tighter italic">
        {level < 4
          ? "// Add special chars for maximum entropy"
          : "// System integrity verified"}
      </div>
    </div>
  );
});

export default PasswordStrength;
