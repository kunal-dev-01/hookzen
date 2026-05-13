"use client";
import React from "react";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import Sidebar from "@/components/sidebar/Sidebar";

interface MainLayoutProps {
  children: React.ReactNode;
}

function MainLayout({ children }: MainLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  return (
    <div className="w-full flex flex-col min-h-screen text-zinc-300">
      <header className="sticky top-0 z-50 w-full pt-6 flex justify-center px-6">
        <div className="w-full max-w-6xl">
          <Navbar onOpenSidebar={() => setIsSidebarOpen(true)} />
        </div>
      </header>

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <main className="w-full grow max-w-6xl mx-auto px-6 py-10 lg:px-0">
        {children}
      </main>

      <footer className="w-full mt-20 px-6 md:px-0">
        <div className="max-w-6xl mx-auto text-[10px] tracking-[0.3em] text-zinc-600 uppercase text-center px-6 border-t border-zinc-900">
          <Footer />
        </div>
      </footer>
    </div>
  );
}

export default MainLayout;
