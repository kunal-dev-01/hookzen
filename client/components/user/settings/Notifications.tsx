import { useAuthStore } from "@/store/auth.store";
import { useUpdateUser } from "@/hooks/useUser";
import { Switch } from "@/common/SwitchButton";
import { Bell, Shield } from "@/svg/Common";

function Notifications() {
  const user = useAuthStore((s) => s.user);
  const { updateUser, isPending } = useUpdateUser();

  const preferences = user?.preferences?.notifications || {
    email: false,
    webhook_failures: false,
  };

  const handleToggle = (key: keyof typeof preferences) => {
    const newPreferences = {
      ...user?.preferences,
      notifications: {
        ...preferences,
        [key]: !preferences[key],
      },
    };

    updateUser({ preferences: newPreferences });
  };

  const NotificationItem = ({
    title,
    description,
    isEnabled,
    onToggle,
    icon: Icon,
    id,
  }: {
    title: string;
    description: string;
    isEnabled: boolean;
    onToggle: () => void;
    icon: any;
    id: string;
  }) => (
    <div className="group relative flex items-start justify-between p-4 border border-zinc-900 bg-black/40 hover:border-zinc-700 transition-colors duration-200">
      <div className="flex gap-4">
        <div className="mt-1 shrink-0">
          <div
            className={`p-2 rounded-sm ${isEnabled ? "bg-cyan-500/10 text-cyan-500" : "bg-zinc-900 text-zinc-600"}`}
          >
            <Icon className="w-4 h-4" />
          </div>
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h4 className="text-xs font-black font-mono tracking-tighter uppercase text-zinc-200">
              {title}
            </h4>
            <span
              className={`text-[9px] font-mono px-1 border ${isEnabled ? "border-cyan-500/50 text-cyan-500 bg-cyan-500/5" : "border-zinc-800 text-zinc-600"}`}
            >
              {isEnabled ? "[PROTOCOL_ACTIVE]" : "[STANDBY]"}
            </span>
          </div>
          <p className="text-[11px] text-zinc-500 font-mono leading-relaxed max-w-md">
            {description}
          </p>
        </div>
      </div>

      <div className="flex items-center self-center">
        <Switch checked={isEnabled} onChange={onToggle} isLoading={isPending} />
      </div>

      {/* Decorative Scanner Line */}
      {isEnabled && (
        <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-cyan-500/40 shadow-[0_0_8px_rgba(6,182,212,0.5)]" />
      )}
    </div>
  );

  return (
    <div className="w-full space-y-4 p-4 lg:p-6 bg-[#050505]">
      <div className="flex flex-col gap-1 mb-6 border-l-2 border-zinc-800 pl-4">
        <span className="text-[10px] font-mono text-zinc-500 tracking-[0.2em] uppercase">
          Communication Layer
        </span>
        <h3 className="text-sm font-black font-mono text-white tracking-tight uppercase">
          Notification_Protocols
        </h3>
      </div>

      <div className="grid grid-cols-1 gap-3">
        <NotificationItem
          id="email-notif"
          title="Email_Dispatch"
          description="Direct data feed to primary verified email address for account-level security events and critical updates."
          isEnabled={preferences.email}
          onToggle={() => handleToggle("email")}
          icon={Bell}
        />

        <NotificationItem
          id="webhook-notif"
          title="Webhook_Failure_Monitor"
          description="Immediate alerts when endpoint reconciliation fails or external protocol timeouts are detected."
          isEnabled={preferences.webhook_failures}
          onToggle={() => handleToggle("webhook_failures")}
          icon={Shield}
        />
      </div>

      {/* Footer Stats/Decorative */}
      <div className="mt-8 pt-4 border-t border-zinc-900 flex items-center justify-between">
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
            <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
              System Link: Stable
            </span>
          </div>
          <div className="flex items-center gap-2 text-[9px] font-mono text-zinc-600">
            <span>NODES: 02</span>
            <span>|</span>
            <span>UPTIME: 99.99%</span>
          </div>
        </div>
        <span className="text-[9px] font-mono text-zinc-700 select-none">
          HX-PROTO-V1.0
        </span>
      </div>
    </div>
  );
}

export default Notifications;
