"use client";

import { ReactNode } from "react";
import ClientWrapper from "@/components/ClientWrapper";
import QuickLinks from "@/components/QuickLinks";
import useInactivityTimeout from "@/hooks/useInactivityTimeout";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  // 🕒 Session timeout handler
  useInactivityTimeout();

  // ✅ All auth checks handled server-side by middleware
  return (
    <ClientWrapper>
      <div className="min-h-screen flex">
        {/* Left rail */}
        <aside className="w-[80px]">
          <QuickLinks inline />
        </aside>

        {/* Main content area */}
        <main className="flex-1 p-[20px]">
          {children}
        </main>
      </div>
    </ClientWrapper>
  );
}
