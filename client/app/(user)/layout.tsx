"use client";
import React from "react";
import DashSide from "@/components/sidebar/DashSide";
import DashMobileNav from "@/components/sidebar/DashMobileNav";

interface UserLayoutProps {
  children: React.ReactNode;
}

export default function UserLayout({ children }: UserLayoutProps) {
  return (
    <div className="min-h-screen bg-black text-zinc-300 relative">
      <div className="hidden lg:block">
        <DashSide />
      </div>

      <div className="lg:hidden sticky top-0 z-50">
        <DashMobileNav />
      </div>

      <div className="lg:ml-64 flex flex-col min-h-screen">
        <main className="p-8 grow">
          <div className="max-w-6xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
