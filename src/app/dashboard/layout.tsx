'use client';

import { ReactNode } from 'react';
import ClientWrapper from '@/components/ClientWrapper';
import QuickLinks from '@/components/QuickLinks';
import useInactivityTimeout from '@/hooks/useInactivityTimeout';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  useInactivityTimeout();

  return (
    <ClientWrapper>
      <div className="min-h-screen flex bg-[#F9FAFB] text-[#10284a]">
        <aside className="w-[80px] border-r border-gray-200">
          <QuickLinks inline />
        </aside>
        <main className="flex-1 p-[20px] overflow-y-auto">{children}</main>
      </div>
    </ClientWrapper>
  );
}
