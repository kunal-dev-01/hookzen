const MOCK_LOGS = [
  {
    method: "POST",
    path: "/v1/events",
    status: "200",
    latency: "4ms",
    payload: '{ "type": "user.signup" }',
  },
  {
    method: "GET",
    path: "/v1/health",
    status: "200",
    latency: "1ms",
    payload: '{ "status": "up" }',
  },
  {
    method: "POST",
    path: "/v1/webhooks",
    status: "201",
    latency: "12ms",
    payload: '{ "event": "order.paid" }',
  },
  {
    method: "POST",
    path: "/v1/alerts",
    status: "200",
    latency: "7ms",
    payload: '{ "level": "critical" }',
  },
];

export default function TerminalVisual() {
  return (
    <div className="w-full h-full text-[10px] md:text-[11px] flex flex-col p-4 bg-black/40">
      {/* Terminal Top Bar */}
      <div className="flex items-center justify-between mb-4 border-b border-zinc-800 pb-2">
        <div className="flex gap-1.5">
          <div className="w-2 h-2 rounded-full bg-red-500/50" />
          <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
          <div className="w-2 h-2 rounded-full bg-emerald-500/50" />
        </div>
        <div className="text-zinc-500 tracking-[0.2em]">HOOKZEN_SHELL v1.0</div>
      </div>

      {/* Logs Stream */}
      <div className="flex-1 space-y-3 overflow-hidden">
        {MOCK_LOGS.map((log, i) => (
          <div
            key={i}
            className="flex flex-col gap-1 animate-in fade-in slide-in-from-bottom-2 duration-500"
          >
            <div className="flex items-center gap-3">
              <span className="text-emerald-400 font-bold">[{log.status}]</span>
              <span className="text-zinc-200 uppercase font-black">
                {log.method}
              </span>
              <span className="text-zinc-500">{log.path}</span>
              <span className="ml-auto text-zinc-600 italic">
                {log.latency}
              </span>
            </div>
            <div className="pl-4 border-l border-zinc-800 text-zinc-500 break-all truncate">
              <span className="text-cyan-500/70">{">"}</span> {log.payload}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Stats Overlay */}
      <div className="mt-4 pt-2 border-t border-zinc-800 flex justify-between items-center text-[9px] text-zinc-500">
        <div className="flex gap-4">
          <span>CPU: 1.2%</span>
          <span>MEM: 42MB</span>
        </div>
        <div className="animate-pulse text-cyan-500 font-bold tracking-widest">
          LISTENING_ON_PORT:8080
        </div>
      </div>
    </div>
  );
}
