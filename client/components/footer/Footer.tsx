import { DESKTOP_MENU } from "@/utils/constants";
import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="w-full py-10 border-t border-zinc-900 font-mono px-4 md:px-0">
      <div className="flex flex-col md:flex-row justify-between items-start gap-12 text-[10px] tracking-[0.2em] uppercase">
        {/* Left Side: Brand Identity - Center on Mobile */}
        <div className="space-y-4 max-w-xs w-full text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <div className="w-2 h-2 bg-cyan-500 animate-pulse shadow-[0_0_8px_#22d3ee]" />
            <span className="text-white font-black tracking-[0.4em]">
              HOOK_ZEN_v2.0
            </span>
          </div>
          <p className="text-zinc-600 leading-relaxed mx-auto md:mx-0">
            High-performance webhook gateway for modern engineering teams.{" "}
            <br />
            <span className="text-zinc-800 mt-2 block italic text-[9px]">
              // BUILT_BY_KUNAL_2026 // INDIA_NODE_ACTIVE
            </span>
          </p>
        </div>

        {/* Middle: Integrated Public Menu - 2 Columns on Mobile */}
        <div className="flex flex-col gap-3 w-full md:w-auto items-center md:items-start border-y md:border-none border-zinc-900/50 py-8 md:py-0">
          <span className="text-zinc-700 font-black mb-2 tracking-[0.3em]">
            // NAVIGATION
          </span>
          <div className="grid grid-cols-2 gap-x-12 gap-y-3 text-center md:text-left">
            {DESKTOP_MENU.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-zinc-500 hover:text-cyan-400 transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Right Side: Network & Legal - Responsive Gap */}
        <div className="flex justify-between md:justify-start w-full md:w-auto gap-8 md:gap-12">
          <div className="flex flex-col gap-3 items-start">
            <span className="text-zinc-700 font-black mb-1 tracking-[0.3em]">
              // NETWORK
            </span>
            <a
              href="https://github.com"
              target="_blank"
              className="text-zinc-500 hover:text-cyan-400 transition-colors"
            >
              SOURCE_CODE
            </a>
            <Link
              href="/status"
              className="text-zinc-500 hover:text-cyan-400 transition-colors"
            >
              SYSTEM_HEALTH
            </Link>
          </div>
          <div className="flex flex-col gap-3 items-start">
            <span className="text-zinc-700 font-black mb-1 tracking-[0.3em]">
              // LEGAL
            </span>
            <Link
              href="/terms"
              className="text-zinc-500 hover:text-cyan-400 transition-colors"
            >
              TERMS_OF_SERVICE
            </Link>
            <Link
              href="/privacy"
              className="text-zinc-500 hover:text-cyan-400 transition-colors"
            >
              PRIVACY_POLICY
            </Link>
          </div>
        </div>
      </div>

      {/* Status Bar (Sub-Footer) - Stack on Mobile */}
      <div className="mt-12 pt-6 border-t border-zinc-900/50 flex flex-col md:flex-row justify-between items-center gap-6 opacity-40 group hover:opacity-100 transition-opacity duration-500">
        <div className="flex flex-wrap justify-center gap-4 md:gap-6 text-[8px] text-zinc-500 font-bold uppercase">
          <span>LATENCY: 14.2MS</span>
          <span>UPTIME: 99.9%</span>
          <span className="hidden sm:inline">NODE: DELHI_NCR</span>
        </div>

        <div className="text-[8px] text-zinc-600 font-mono select-none hidden lg:block">
          0x48 0x4F 0x4F 0x4B 0x5F 0x5A 0x45 0x4E 0x5F 0x43 0x4F 0x52 0x45
        </div>

        <div className="text-[9px] text-zinc-500 tracking-widest">
          &copy; {currentYear} HOOK_ZEN
        </div>
      </div>
    </div>
  );
}
