import { Dashboard } from "@/svg/Auth";
import { Settings } from "@/svg/Common";
import { Payment, Projects } from "@/svg/More";

export const MOBILE_MENU = [
  { label: "TERMINAL", href: "/", desc: "Main_Access_Point" },
  { label: "ENGINE_SPECS", href: "/#features", desc: "Technical_Capabilities" },
  { label: "BLUEPRINT", href: "/#how-it-works", desc: "System_Architecture" },
  {
    label: "NETWORK_STATUS",
    href: "/status",
    desc: "Live_Infrastructure_Logs",
  },
];

export const DESKTOP_MENU = [
  { label: "TERMINAL", href: "/" },
  { label: "ENGINE_SPECS", href: "/#features" },
  { label: "BLUEPRINT", href: "/#how-it-works" },
  { label: "NET_STATUS", href: "/status" },
];

export const DASHBOARD_LINKS = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: <Dashboard className="w-5 h-5" />,
  },
  {
    name: "Projects",
    href: "/projects",
    icon: <Projects className="w-6.5 h-6.5" />,
  },
  {
    name: "Payments",
    href: "/payments",
    icon: <Payment className="w-6 h-6" />,
  },
  {
    name: "Settings",
    href: "/settings",
    icon: <Settings className="w-6.5 h-6.5" />,
  },
];
