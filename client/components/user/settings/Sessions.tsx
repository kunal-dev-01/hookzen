import { useSessions, useRevokeSession, useLogout } from "@/hooks/useAuth";
import VariantButton from "@/common/VariantButton";
import { motion, AnimatePresence } from "framer-motion";

function Sessions() {
  const { sessions, isPending: isLoadingSessions } = useSessions();
  const { revokeSession, isPending: isRevoking } = useRevokeSession();
  const { logout, isPending: isLoggingOut } = useLogout();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoadingSessions) {
    return (
      <div className="p-6 border border-zinc-900 bg-black/20 text-[10px] text-zinc-600 tracking-[0.2em]">
        &gt; INITIALIZING_SESSION_SCAN...
      </div>
    );
  }

  return (
    <div className="w-full p-4 space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-zinc-900 pb-8 px-1">
        <div className="space-y-2">
          <h3 className="text-[14px] font-black tracking-[0.3em] uppercase text-zinc-100 font-mono">
            // TERMINAL_ACCESS_LOGS
          </h3>
          <p className="text-[10px] text-zinc-500 uppercase tracking-tight font-mono max-w-md leading-relaxed">
            AUTHORIZED_NODES: Monitoring active authentication streams and
            system access points for this protocol.
          </p>
        </div>

        <div className="w-full md:w-auto shrink-0">
          <VariantButton
            label="TERMINATE_SESSION"
            variant="default"
            onClick={() => logout()}
            isLoading={isLoggingOut}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <AnimatePresence mode="popLayout">
          {sessions.map((session, index) => (
            <motion.div
              key={session.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ delay: index * 0.05 }}
              className={`relative group p-4 sm:p-6 border ${
                session.is_current
                  ? "border-cyan-500/30 bg-cyan-500/2"
                  : "border-zinc-900 bg-zinc-950/30"
              } transition-all duration-300 hover:border-zinc-700`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                {/* Session Data */}
                <div className="flex-1 space-y-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <div
                      className={`w-1.5 h-1.5 rounded-full ${session.is_current ? "bg-cyan-500 shadow-[0_0_8px_cyan]" : "bg-zinc-700"}`}
                    />
                    <span className="text-[13px] font-bold text-zinc-200 tracking-tight uppercase">
                      {session.device_name || "REDACTED_DEVICE"}
                    </span>
                    {session.is_current && (
                      <span className="text-[8px] px-2 py-0.5 border border-cyan-500/50 text-cyan-400 font-black uppercase">
                        LOCAL_HOST
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <DataPoint
                      label="Location"
                      value={`${session.city}, ${session.country}`}
                    />
                    <DataPoint label="IP_Addr" value={session.ip_address} />
                    <DataPoint label="Browser" value={session.browser} />
                    <DataPoint
                      label="Logged_In"
                      value={formatDate(session.created_at)}
                    />
                  </div>
                </div>

                {/* Revoke Action */}
                <div className="shrink-0 pt-4 lg:pt-0 border-t lg:border-none border-zinc-900/50">
                  {!session.is_current ? (
                    <VariantButton
                      label="REVOKE"
                      variant="delete"
                      className="w-full lg:w-32"
                      onClick={() => revokeSession(session.id)}
                      isLoading={isRevoking}
                    />
                  ) : (
                    <div className="flex items-center justify-center lg:justify-end gap-2 text-cyan-500/40">
                      <span className="text-[9px] font-black tracking-widest uppercase">
                        SECURE_CONNECTION
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Small helper for cleaner grid code
function DataPoint({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <p className="text-[8px] text-zinc-600 uppercase tracking-[0.2em]">
        {label}
      </p>
      <p className="text-[10px] text-zinc-400 uppercase truncate" title={value}>
        {value}
      </p>
    </div>
  );
}

export default Sessions;
