import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/store/auth.store";
import { getInitials } from "@/utils/Initials";
import { DASHBOARD_LINKS } from "@/utils/constants";
import { X } from "@/svg/Common";

export default function DashMobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { user, isAuthenticated } = useAuthStore();

  return (
    <div className="lg:hidden">
      {/* Top Bar */}
      <div className="h-16 border-b border-zinc-900 bg-black/80 px-5 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2">
          <span className="text-md font-black tracking-[0.2em]">HOOK_ZEN</span>
        </Link>

        <button
          onClick={() => setIsOpen(true)}
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

      {/* Slide-over Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/90 z-70"
            />

            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 h-full w-[280px] bg-black border-r border-zinc-900 z-80 flex flex-col p-6"
            >
              <div className="flex justify-between items-center mb-10">
                <span className="text-[14px] text-zinc-600 tracking-widest uppercase">
                  // Mobile_Access
                </span>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 border border-zinc-800 text-zinc-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Links */}
              <nav className="flex-1 space-y-4">
                {DASHBOARD_LINKS?.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-4 py-3 px-4 text-[12px] font-bold tracking-[0.2em] border ${
                      pathname === item.href
                        ? "border-cyan-500/50 bg-cyan-500/5 text-cyan-400"
                        : "border-transparent text-zinc-500"
                    }`}
                  >
                    {item.icon}
                    {item.name}
                  </Link>
                ))}
              </nav>

              {/* Bottom User Info */}
              <div className="mt-auto pt-6 border-t border-zinc-900">
                {isAuthenticated && user ? (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 border border-cyan-500/30 bg-cyan-500/5 flex items-center justify-center text-cyan-400 text-xs font-black">
                      {getInitials(user.full_name)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-black text-white truncate uppercase">
                        {user.full_name}
                      </p>
                      <p className="text-[10px] text-zinc-600 truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-[10px] text-zinc-700 italic">
                    SESSION_UNAUTHORIZED
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
