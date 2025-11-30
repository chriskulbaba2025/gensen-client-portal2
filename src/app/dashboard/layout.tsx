"use client";

import { ReactNode } from "react";
import ClientWrapper from "@/components/ClientWrapper";
import QuickLinks from "@/components/QuickLinks";
import useInactivityTimeout from "@/hooks/useInactivityTimeout";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  // Auto-logout hook (already implemented in your project)
  useInactivityTimeout();

  return (
    <ClientWrapper>
      <div className="min-h-screen flex bg-[#f8f9fb]">
        
        {/* Left Navigation Rail */}
        <aside className="w-[80px] border-r border-gray-200 bg-white">
          <QuickLinks />
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {children}
        </main>

      </div>
    </ClientWrapper>
  );
}
