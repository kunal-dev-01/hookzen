import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { X } from "@/svg/Common";
import { MOBILE_MENU } from "@/utils/constants";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/90 z-60"
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 22, stiffness: 150 }}
            className="fixed top-0 right-0 h-full w-full max-w-[300px] bg-black border-l border-zinc-900 z-70 p-8 flex flex-col"
          >
            <div className="flex items-center justify-between mb-12">
              <div className="space-y-1">
                <h2 className="text-[10px] font-black tracking-[0.4em] text-cyan-500 uppercase">
                  GUEST_PROTOCOL
                </h2>
                <div className="h-px w-full bg-linear-to-r from-cyan-500 to-transparent" />
              </div>
              <button
                onClick={onClose}
                className="p-2 border border-zinc-800 text-zinc-500 hover:text-cyan-400 hover:border-cyan-500/50 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Navigation Links */}
            <nav className="flex flex-col gap-8 grow">
              {MOBILE_MENU.map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.05 }}
                >
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className="group block"
                  >
                    <div className="flex items-baseline justify-between">
                      <span className="text-sm font-bold tracking-[0.2em] text-zinc-400 group-hover:text-white transition-colors uppercase">
                        {item.label}
                      </span>
                    </div>
                    <p className="text-[9px] text-zinc-600 font-mono tracking-widest mt-1 group-hover:text-cyan-600 transition-colors">
                      {">"} {item.desc}
                    </p>
                  </Link>
                </motion.div>
              ))}
            </nav>

            <div className="mt-auto space-y-4 pt-8 border-t border-zinc-900">
              <div className="text-[9px] text-zinc-700 font-mono tracking-widest uppercase mb-4">
                // Identity_Check_Required
              </div>

              <Link
                href="/auth/login"
                onClick={onClose}
                className="block w-full py-3 text-center border border-zinc-800 text-zinc-400 font-mono text-[10px] font-bold tracking-[0.3em] uppercase hover:bg-zinc-900 hover:text-white transition-all"
              >
                SECURE_LOGIN
              </Link>

              <Link
                href="/auth/register"
                onClick={onClose}
                className="block w-full py-3 text-center bg-cyan-500/10 border border-cyan-500/50 text-cyan-400 font-mono text-[10px] font-bold tracking-[0.3em] uppercase hover:bg-cyan-500 hover:text-black transition-all"
              >
                START_INITIALIZATION
              </Link>
            </div>

            <div className="absolute inset-0 pointer-events-none opacity-[0.02] bg-[linear-gradient(rgba(34,211,238,1)_1px,transparent_1px)] bg-size-[100%_3px]" />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
