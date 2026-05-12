import React from "react";

interface SubHeadingProps {
  title: string;
  description?: string;
  icon: React.ElementType;
  iconBgColor?: string;
  iconClassName?: string;
  accentColor?: "cyan" | "lime" | "emerald" | "red" | "zinc";
  className?: string;
}

const SubHeading: React.FC<SubHeadingProps> = ({
  title,
  description,
  icon: Icon,
  iconBgColor = "bg-zinc-900/50",
  iconClassName = "text-cyan-500",
  accentColor = "cyan", // Default accent
  className = "",
}) => {
  const accents = {
    cyan: {
      border: "group-hover:border-cyan-500/50",
      text: "group-hover:text-cyan-400",
      corner: "border-cyan-500",
      shadow: "group-hover:shadow-[0_0_15px_rgba(34,211,238,0.1)]",
    },
    lime: {
      border: "group-hover:border-lime-500/50",
      text: "group-hover:text-lime-400",
      corner: "border-lime-500",
      shadow: "group-hover:shadow-[0_0_15px_rgba(163,230,53,0.1)]",
    },
    red: {
      border: "group-hover:border-red-500/50",
      text: "group-hover:text-red-400",
      corner: "border-red-500",
      shadow: "group-hover:shadow-[0_0_15px_rgba(239,68,68,0.1)]",
    },
  };

  const activeAccent =
    accents[accentColor as keyof typeof accents] || accents.cyan;

  return (
    <div
      className={`flex flex-col sm:flex-row items-start gap-4 p-2 group transition-all ${className}`}
    >
      <div className="relative shrink-0">
        <div
          className={`absolute -top-1 -left-1 w-2 h-2 border-t border-l opacity-0 group-hover:opacity-100 transition-opacity ${activeAccent.corner}`}
        />

        <div
          className={`
            p-3 border border-zinc-800 relative z-10 
            shadow-[inset_0_0_10px_rgba(0,0,0,0.5)] 
            transition-all duration-300
            ${iconBgColor}
            ${activeAccent.border}
            ${activeAccent.shadow}
          `}
        >
          <Icon className={`w-5 h-5 ${iconClassName}`} />
        </div>
      </div>

      {/* Technical Text Content */}
      <div className="flex flex-col gap-1 py-0.5 w-full min-w-0">
        <h2
          className={`text-base lg:text-lg font-black text-white tracking-widest uppercase transition-colors wrap-break-word ${activeAccent.text}`}
        >
          {title}
        </h2>

        {description && (
          <div className="flex items-start sm:items-center gap-2">
            <span
              className={`text-[10px] tracking-tighter hidden sm:inline shrink-0 ${iconClassName}`}
            >
              {">_"}
            </span>
            <p className="text-[11px] lg:text-xs text-zinc-500 tracking-tight leading-relaxed uppercase wrap-break-word">
              {description}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubHeading;
