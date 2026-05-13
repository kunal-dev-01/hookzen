"use client";
import { motion } from "framer-motion";
import VariantButton from "@/common/VariantButton";
import { Zap } from "@/svg/More";
import { useRouter } from "next/navigation";
import { Features } from "@/svg/Extra";
import TerminalVisual from "./TerminalVisual";

export default function Hero() {
  const router = useRouter();

  // Animation logic ONLY for "PIPELINES"
  const specialWord = "PIPELINES";
  const letters = Array.from(specialWord);

  const container = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  const letterVariants = {
    visible: { opacity: 1, transition: { duration: 0 } },
    hidden: { opacity: 0 },
  };

  return (
    <section className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 items-center py-10 md:py-20 overflow-hidden">
      {/* Left Grid: Content */}
      <div className="flex flex-col gap-6 z-10">
        {/* Status Badge */}
        <div className="flex items-center gap-2 text-cyan-500 font-mono text-[10px] tracking-[0.3em] uppercase">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
          </span>
          System_Status: Operational
        </div>

        {/* Heading: Static + Animated Word */}
        <h1 className="text-3xl md:text-5xl font-black tracking-tighter uppercase italic leading-[0.9] flex flex-wrap gap-x-3">
          <span className="text-zinc-100">Forge Resilient Data</span>

          <motion.span
            variants={container}
            initial="hidden"
            animate="visible"
            className="text-transparent bg-clip-text bg-linear-to-l from-cyan-400 to-indigo-500 inline-flex"
          >
            {letters.map((char, index) => (
              <motion.span variants={letterVariants} key={index}>
                {char}
              </motion.span>
            ))}
          </motion.span>
        </h1>

        {/* Description */}
        <p className="max-w-md text-zinc-400 text-sm md:text-base leading-relaxed font-medium">
          Secure your endpoints with{" "}
          <span className="text-zinc-100 font-bold tracking-tight">
            HOOK_ZEN
          </span>
          . Route and scale your events with{" "}
          <span className="text-zinc-200 underline decoration-cyan-500/30 underline-offset-4 italic">
            low latency
          </span>
          . Built for high-throughput and mission-critical reliability.
        </p>

        {/* Actions */}
        <div className="flex flex-col md:flex-row items-center gap-4 mt-4">
          <div className="w-full md:w-auto md:min-w-[220px]">
            <VariantButton
              onClick={() => router.push("/auth/login")}
              variant="cyan"
              label="INITIALIZE_INSTANCE"
              icon={Zap}
            />
          </div>
          <div className="w-full md:w-auto md:min-w-[180px]">
            <VariantButton
              onClick={() => router.push("/#features")}
              variant="default"
              label="FEATURES"
              icon={Features}
            />
          </div>
        </div>

        {/* Technical Metadata Footer */}
        <div className="mt-8 pt-8 border-t border-zinc-900 flex gap-8">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-zinc-600 uppercase font-bold tracking-widest">
              Protocol
            </span>
            <span className="text-xs text-zinc-400 font-mono italic">
              L7_ROUTING_SECURE
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-zinc-600 uppercase font-bold tracking-widest">
              Throughput
            </span>
            <span className="text-xs text-zinc-400 font-mono italic">
              100K/SEC
            </span>
          </div>
        </div>
      </div>

      {/* Right Grid: Isolated Container */}
      <div className="relative aspect-square w-full flex items-center">
        <div className="relative w-full h-full bg-zinc-950 border border-zinc-900 overflow-hidden">
          {/* Glow Layer */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.1)_0%,transparent_70%)]" />

          <div className="relative z-10 w-full h-full">
            <TerminalVisual />
          </div>
        </div>
      </div>
    </section>
  );
}
