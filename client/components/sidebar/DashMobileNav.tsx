"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/store/auth.store";
import { getInitials } from "@/utils/Initials";
import { DASHBOARD_LINKS } from "@/utils/constants";
import { X } from "@/svg/Common";
import FormHead from "@/common/FormHead";

export default function DashMobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { user, isAuthenticated } = useAuthStore();

  return (
    <div className="lg:hidden">
      {/* --- TOP FIXED BAR --- */}
      <div className="fixed top-0 left-0 right-0 h-16 border-b border-zinc-900 bg-black/80 backdrop-blur-md px-5 flex items-center justify-between z-50">
        <Link href="/dashboard" className="flex items-center gap-2">
          <FormHead title="Hook_zen" />
        </Link>

        <button
          onClick={() => setIsOpen(true)}
          className="p-2 border border-zinc-800 hover:border-cyan-500 transition-all group/btn"
          aria-label="Toggle Menu"
        >
          <div className="space-y-1.5">
            <div className="w-4 h-px bg-zinc-400 group-hover/btn:bg-cyan-400 transition-colors" />
            <div className="w-6 h-px bg-cyan-500" />
            <div className="w-3 h-px bg-zinc-400 group-hover/btn:bg-cyan-400 transition-colors" />
          </div>
        </button>
      </div>

      {/* --- SIDEBAR OVERLAY & MENU --- */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Dark Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/95 z-60"
            />

            {/* Sidebar Panel */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 h-full w-[280px] bg-black border-r border-zinc-900 z-70 flex flex-col p-6 shadow-2xl shadow-cyan-500/10"
            >
              <div className="flex justify-between items-center mb-10">
                <span className="text-[10px] text-zinc-500 tracking-[0.3em] font-mono">
                  // NAVIGATION_CORE
                </span>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 border border-zinc-800 text-zinc-500 hover:text-white hover:border-zinc-600 transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="flex-1 space-y-3">
                {DASHBOARD_LINKS?.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-4 py-3.5 px-4 text-[11px] font-bold tracking-[0.2em] border transition-all ${
                      pathname === item.href
                        ? "border-cyan-500/40 bg-cyan-500/5 text-cyan-400"
                        : "border-transparent text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/50"
                    }`}
                  >
                    <span
                      className={
                        pathname === item.href
                          ? "text-cyan-400"
                          : "text-zinc-600"
                      }
                    >
                      {item.icon}
                    </span>
                    {item.name}
                  </Link>
                ))}
              </nav>

              {/* Footer User Profile */}
              <div className="mt-auto pt-6 border-t border-zinc-900">
                {isAuthenticated && user ? (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 border border-cyan-500/30 bg-cyan-500/5 flex items-center justify-center text-cyan-400 text-xs font-black shadow-[0_0_15px_rgba(6,182,212,0.1)]">
                      {getInitials(user.full_name)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-black text-white truncate uppercase tracking-wider">
                        {user.full_name}
                      </p>
                      <p className="text-[10px] text-zinc-600 truncate font-mono">
                        {user.email}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-[10px] text-zinc-700 italic font-mono uppercase tracking-tighter">
                    &gt; SESSION_UNAUTHORIZED
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
