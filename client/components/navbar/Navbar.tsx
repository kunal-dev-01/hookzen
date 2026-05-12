import FormHead from "@/common/FormHead";
import Link from "next/link";
import { DESKTOP_MENU } from "@/utils/constants";

interface NavbarProps {
  onOpenSidebar: () => void;
}

export default function Navbar({ onOpenSidebar }: NavbarProps) {
  return (
    <nav className="w-full max-w-6xl relative group">
      <div className="absolute inset-0 bg-zinc-900/40 border border-zinc-800 backdrop-blur-md group-hover:border-cyan-500/30 transition-colors duration-500" />

      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-cyan-500" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-cyan-500" />

      <div className="relative z-10 flex items-center justify-between px-6 py-3">
        <Link href="/" className="flex items-center">
          <FormHead title="HOOK_ZEN" />
        </Link>

        {/* Navigation Links (Desktop - Static Pages) */}
        <div className="hidden md:flex items-center gap-8">
          {DESKTOP_MENU.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-[10px] font-bold tracking-[0.2em] text-zinc-400 hover:text-cyan-400 transition-colors relative group/link"
            >
              {item.label}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-cyan-500 transition-all group-hover/link:w-full" />
            </Link>
          ))}
        </div>

        {/* Right Side: Auth Actions */}
        <div className="flex items-center gap-3">
          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/auth/login"
              className="text-[10px] font-bold tracking-[0.2em] text-zinc-400 hover:text-white px-4 py-2 transition-colors uppercase"
            >
              LOGIN
            </Link>
            <Link
              href="/auth/register"
              className="text-[10px] font-bold tracking-[0.2em] bg-cyan-600/10 border border-cyan-500/50 text-cyan-400 px-5 py-2 hover:bg-cyan-500 hover:text-black transition-all uppercase"
            >
              INITIALIZE_REGISTER
            </Link>
          </div>

          {/* Mobile Auth Button (Always Visible on Mobile) */}
          <Link
            href="/auth/login"
            className="md:hidden text-[9px] font-bold tracking-[0.2em] border border-zinc-800 text-zinc-400 px-4 py-2 hover:border-cyan-500 transition-all uppercase"
          >
            LOGIN
          </Link>

          {/* Sidebar Trigger (Mobile Only) */}
          <button
            onClick={onOpenSidebar}
            className="md:hidden p-2 border border-zinc-800 hover:border-cyan-500 transition-all group/btn"
            aria-label="Toggle Menu"
          >
            <div className="space-y-1">
              <div className="w-4 h-px bg-zinc-400 group-hover/btn:bg-cyan-400 transition-colors" />
              <div className="w-6 h-px bg-cyan-500" />
              <div className="w-3 h-px bg-zinc-400 group-hover/btn:bg-cyan-400 transition-colors" />
            </div>
          </button>
        </div>
      </div>

      {/* Footer Text */}
      <div className="absolute -bottom-4 right-2 text-[8px] text-zinc-800 font-mono select-none">
        0x5F 0x41 0x55 0x54 0x48 0x5F 0x52 0x45 0x51
      </div>
    </nav>
  );
}
