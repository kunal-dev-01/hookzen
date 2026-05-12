"use client";
import React from "react";
import DashSide from "@/components/sidebar/DashSide";
import DashMobileNav from "@/components/sidebar/DashMobileNav";

interface UserLayoutProps {
  children: React.ReactNode;
}

export default function UserLayout({ children }: UserLayoutProps) {
  return (
    <div className="min-h-screen relative">
      <div className="hidden lg:block">
        <DashSide />
      </div>

      <div className="lg:hidden">
        <DashMobileNav />
      </div>

      <div className="lg:ml-64 flex flex-col min-h-screen">
        <main className="px-5 lg:px-0 py-24 lg:py-10 grow">
          <div className="max-w-6xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
