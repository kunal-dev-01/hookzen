export default function PowerSpecs() {
  return (
    <section className="w-full flex flex-col gap-4">
      {/* Top Row: Bada (Left) - Chota (Right) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 h-auto md:h-[300px]">
        {/* Large Card (8 Cols) */}
        <div className="md:col-span-8 group relative bg-zinc-900/10 border border-zinc-800 p-8 overflow-hidden">
          <GridPattern />
          <div className="relative z-10">
            <h3 className="text-xl font-bold text-zinc-200">CORE_ENGINE</h3>
            <p className="text-zinc-500 text-sm mt-2 max-w-sm">
              High-throughput event processing unit built with Rust. Designed
              for parallel execution and memory safety.
            </p>
          </div>
          {/* Corner Accent */}
          <div className="absolute top-0 left-0 w-10 h-1 border-t-2 border-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        {/* Small Card (4 Cols) */}
        <div className="md:col-span-4 group relative bg-zinc-900/10 border border-zinc-800 p-8 overflow-hidden">
          <GridPattern />
          <div className="relative z-10 text-center flex flex-col items-center justify-center h-full">
            <div className="text-4xl font-black text-cyan-500/20 group-hover:text-cyan-500 transition-colors">
              0.0ms
            </div>
            <div className="text-[10px] font-mono tracking-widest text-zinc-600 mt-2 uppercase">
              Mean_Latency
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row: Chota (Left) - Bada (Right) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 h-auto md:h-[300px]">
        {/* Small Card (4 Cols) */}
        <div className="md:col-span-4 group relative bg-zinc-900/10 border border-zinc-800 p-8 overflow-hidden">
          <GridPattern />
          <div className="relative z-10 flex flex-col justify-end h-full">
            <div className="w-full h-1 bg-zinc-800 mb-4 overflow-hidden">
              <div className="w-2/3 h-full bg-cyan-500/50" />
            </div>
            <span className="text-[10px] font-mono text-zinc-500 uppercase">
              Buffer_Utilization
            </span>
          </div>
        </div>

        {/* Large Card (8 Cols) */}
        <div className="md:col-span-8 group relative bg-zinc-900/10 border border-zinc-800 p-8 overflow-hidden">
          <GridPattern />
          <div className="relative z-10">
            <h3 className="text-xl font-bold text-zinc-200">
              GLOBAL_EDGE_NETWORK
            </h3>
            <p className="text-zinc-500 text-sm mt-2 max-w-sm">
              Distributed across 250+ locations to ensure your webhooks are
              delivered with local-speed efficiency.
            </p>
          </div>
          {/* Decorative Elements */}
          <div className="absolute bottom-4 right-4 text-[40px] font-black text-zinc-800/50 select-none">
            INFRA_v2
          </div>
        </div>
      </div>
    </section>
  );
}

// Reusable Grid Pattern Background
function GridPattern() {
  return (
    <div className="absolute inset-0 pointer-events-none opacity-[0.03] group-hover:opacity-[0.07] transition-opacity duration-700">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px]" />
    </div>
  );
}
