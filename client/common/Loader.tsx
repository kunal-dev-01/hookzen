import { memo } from "react";

export const Loader = memo(
  ({ className = "w-4 h-4 text-cyan-500" }: { className?: string }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className={className}
    >
      {/* 3 Digital Blocks Loading Effect */}
      <rect x="2" y="2" width="6" height="20" fill="currentColor">
        <animate
          attributeName="opacity"
          values="0.2;1;0.2"
          dur="0.6s"
          repeatCount="indefinite"
        />
      </rect>
      <rect x="9" y="2" width="6" height="20" fill="currentColor">
        <animate
          attributeName="opacity"
          values="0.2;1;0.2"
          dur="0.6s"
          begin="0.2s"
          repeatCount="indefinite"
        />
      </rect>
      <rect x="16" y="2" width="6" height="20" fill="currentColor">
        <animate
          attributeName="opacity"
          values="0.2;1;0.2"
          dur="0.6s"
          begin="0.4s"
          repeatCount="indefinite"
        />
      </rect>
    </svg>
  ),
);

Loader.displayName = "Loader";
