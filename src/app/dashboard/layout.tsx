'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ClientWrapper from '@/components/ClientWrapper';
import QuickLinks from '@/components/QuickLinks';
import useInactivityTimeout from '@/hooks/useInactivityTimeout';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  useInactivityTimeout();

  // ✅ redirect to login if no cookie found
  useEffect(() => {
    const cookies = document.cookie.split(';').map((c) => c.trim());
    const hasSession = cookies.some((c) => c.startsWith('gensen_session='));
    if (!hasSession) {
      router.push('/login');
    }
  }, [router]);

  return (
    <ClientWrapper>
      <div className="min-h-screen flex">
        <aside className="w-[80px]">
          <QuickLinks inline />
        </aside>

        <main className="flex-1 p-[20px]">
          {children}
        </main>
      </div>
    </ClientWrapper>
  );
}
