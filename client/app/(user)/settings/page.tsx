"use client";

import Heading from "@/common/Heading";
import SubHeading from "@/common/SubHeading";
import UserProfile from "@/components/user/settings/UserProfile";
import Notifications from "@/components/user/settings/Notifications";
import Sessions from "@/components/user/settings/Sessions";
import { Bell, Shield, User } from "@/svg/Common";

function Settings() {
  return (
    <div className="w-full overflow-hidden">
      <div className="w-full mb-6">
        <Heading
          title="Settings"
          description="Manage your account preferences"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-4 border border-zinc-800 flex flex-col items-start">
          <SubHeading
            title="USER_IDENTITY"
            description="Manage identity information"
            icon={User}
            iconBgColor="bg-cyan-500/5"
            iconClassName="text-cyan-500"
          />
          <UserProfile />
        </div>

        <div className="lg:col-span-8 space-y-6">
          <div className="border border-zinc-800 flex flex-col items-start">
            <SubHeading
              title="SYSTEM_ALERTS"
              description="Configure event monitoring and protocol notifications"
              icon={Bell}
              accentColor="lime"
              iconBgColor="bg-lime-500/5"
              iconClassName="text-lime-400"
            />
            <Notifications />
          </div>

          <div className="border border-zinc-800 flex flex-col items-start">
            <SubHeading
              title="ACTIVE_SESSIONS"
              description="Authorized access points and session persistence logs"
              icon={Shield}
              accentColor="red"
              iconBgColor="bg-red-500/5"
              iconClassName="text-red-400"
            />
            <Sessions />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
