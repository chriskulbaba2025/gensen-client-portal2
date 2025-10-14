// src/app/dashboard/layout.tsx
'use client';

import { ReactNode } from 'react';
import ClientWrapper from '@/components/ClientWrapper';
import QuickLinks from '@/components/QuickLinks';
import useInactivityTimeout from '@/hooks/useInactivityTimeout';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  useInactivityTimeout();

  return (
    <ClientWrapper>
      <div className="min-h-screen flex">
        {/* Left rail: fixed width */}
        <aside className="w-[80px]">
          <QuickLinks inline />
        </aside>

        {/* Content area: fills remaining space */}
        <main className="flex-1 p-[20px]">
          {children}
        </main>
      </div>
    </ClientWrapper>
  );
}
