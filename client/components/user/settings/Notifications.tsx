import { useAuthStore } from "@/store/auth.store";
import { useUpdateUser } from "@/hooks/useUser";
import { Switch } from "@/common/SwitchButton";

function Notifications() {
  const user = useAuthStore((s) => s.user);
  const { updateUser, isPending } = useUpdateUser();

  // Safely getting preferences with fallbacks
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
  }: {
    title: string;
    description: string;
    isEnabled: boolean;
    onToggle: () => void;
  }) => (
    <div className="group relative flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-4 border border-zinc-900 bg-black/40 hover:border-zinc-800 transition-all duration-300">
      <div className="space-y-1.5">
        <div className="flex items-center gap-3">
          <h4 className="text-[11px] font-black font-mono tracking-widest uppercase text-zinc-100">
            {title}
          </h4>
          <span
            className={`text-[8px] font-mono px-1.5 py-0.5 border transition-colors ${
              isEnabled
                ? "border-cyan-500/50 text-cyan-400 bg-cyan-500/5"
                : "border-zinc-800 text-zinc-600 bg-zinc-900/50"
            }`}
          >
            {isEnabled ? "ACTIVE" : "DISABLED"}
          </span>
        </div>
        <p className="text-[11px] text-zinc-500 font-mono leading-relaxed max-w-lg">
          {description}
        </p>
      </div>

      <div className="flex items-center justify-end sm:justify-center">
        <Switch checked={isEnabled} onChange={onToggle} isLoading={isPending} />
      </div>

      {/* Side Status Bar */}
      {isEnabled && (
        <div className="absolute left-0 top-0 bottom-0 w-px bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.4)]" />
      )}
    </div>
  );

  return (
    <div className="w-full p-4">
      <div className="grid grid-cols-1 gap-4">
        <NotificationItem
          title="Email_Dispatch"
          description="Direct data feed to primary verified email address for account-level security events and critical updates."
          isEnabled={preferences.email}
          onToggle={() => handleToggle("email")}
        />

        <NotificationItem
          title="Webhook_Monitor"
          description="Immediate alerts when endpoint reconciliation fails or external protocol timeouts are detected."
          isEnabled={preferences.webhook_failures}
          onToggle={() => handleToggle("webhook_failures")}
        />
      </div>
    </div>
  );
}

export default Notifications;
