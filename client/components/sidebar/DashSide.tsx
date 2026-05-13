import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { getInitials } from "@/utils/Initials";
import { DASHBOARD_LINKS } from "@/utils/constants";
import FormHead from "@/common/FormHead";

export default function DashSide() {
  const pathname = usePathname();

  const { user, isAuthenticated } = useAuthStore();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-black border-r border-zinc-900 flex flex-col z-50">
      <div className="p-6 border-b border-zinc-900">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <h1 className="text-xl md:text-2xl font-bold">HOOK_ZEN</h1>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-2 mt-4">
        {DASHBOARD_LINKS?.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`
                flex items-center gap-4 px-4 py-3 text-[12px] font-bold tracking-[0.2em] transition-all
                ${
                  isActive
                    ? "bg-cyan-500/10 border-l-2 border-cyan-500 text-cyan-400"
                    : "text-zinc-500 hover:text-white hover:bg-zinc-900"
                }
              `}
            >
              {item.icon}
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-5 border-t border-zinc-900 bg-zinc-950/80 relative overflow-hidden group select-none">
        <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-cyan-500/20 to-transparent" />

        {isAuthenticated && user ? (
          <div className="flex items-center gap-4 relative z-10 animate-in fade-in duration-500">
            <div className="shrink-0 relative">
              <div className="w-12 h-12 border border-cyan-500/40 bg-cyan-500/5 flex items-center justify-center text-cyan-400 font-mono text-sm font-black shadow-[0_0_15px_rgba(34,211,238,0.05)] transition-colors group-hover:border-cyan-500">
                {getInitials(user.full_name)}
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 border-2 border-black rounded-full shadow-[0_0_5px_#22c55e]" />
            </div>

            <div className="flex-1 min-w-0 flex flex-col justify-center">
              <h3 className="text-[11px] font-black text-white truncate uppercase tracking-[0.2em] mb-0.5">
                {user.full_name}
              </h3>
              <div className="flex items-center gap-1.5 overflow-hidden">
                <span className="text-[7px] text-zinc-600 font-mono font-bold italic shrink-0">
                  {"//"}
                </span>
                <p className="text-[10px] text-zinc-400 truncate font-mono tracking-tight lowercase">
                  {user.email}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-4 relative z-10 opacity-50 grayscale">
            <div className="w-12 h-12 border border-zinc-800 bg-zinc-900/50 flex items-center justify-center text-zinc-600 font-mono text-xs italic">
              ??
            </div>
            <div className="flex flex-col gap-1">
              <div className="h-2 w-24 bg-zinc-800 animate-pulse" />
              <div className="h-1.5 w-32 bg-zinc-900 animate-pulse" />
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
