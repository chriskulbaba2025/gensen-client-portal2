'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ClientWrapper from '@/components/ClientWrapper';
import QuickLinks from '@/components/QuickLinks';
import useInactivityTimeout from '@/hooks/useInactivityTimeout';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useInactivityTimeout();

  useEffect(() => {
    const cookies = document.cookie.split(';').map(c => c.trim());
    const hasSession = cookies.some(c => c.startsWith('gensen_session='));
    if (!hasSession) {
      router.push('/login');
    } else {
      setChecked(true);
    }
  }, [router]);

  if (!checked) {
    return <div>Loading…</div>;
  }

  return (
    <ClientWrapper>
      <div className="min-h-screen flex">
        <aside className="w-[80px]"><QuickLinks inline /></aside>
        <main className="flex-1 p-[20px]">{children}</main>
      </div>
    </ClientWrapper>
  );
}
