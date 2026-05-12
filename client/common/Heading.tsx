import React from "react";

interface HeadingProps {
  title: string;
  description?: string;
  className?: string;
}

const Heading: React.FC<HeadingProps> = ({
  title,
  description,
  className = "",
}) => {
  return (
    <div className={`flex flex-col gap-4 w-full ${className}`}>
      <div className="flex items-center gap-0">
        <div className="w-2.5 h-2.5 rounded-full border-2 border-cyan-500 bg-black shadow-[0_0_8px_#22d3ee] shrink-0" />

        <div className="h-px w-full bg-linear-to-r from-cyan-500 via-cyan-500/50 to-transparent" />
      </div>

      <div className="space-y-1">
        <h1 className="lg:text-4xl text-2xl font-black tracking-[0.15em] text-zinc-900 dark:text-white uppercase">
          <span className="text-cyan-500 mr-2 opacity-50">#</span>
          {title}
        </h1>

        {description && (
          <div className="flex items-start gap-3">
            <div className="h-full w-0.5 bg-zinc-800 mt-1.5 shrink-0" />
            <p className="lg:text-sm text-xs text-zinc-500 dark:text-zinc-500 tracking-wider leading-relaxed uppercase">
              {`// ${description}`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Heading;
