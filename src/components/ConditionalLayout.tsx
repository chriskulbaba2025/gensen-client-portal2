'use client';

import { usePathname } from 'next/navigation';
import { UserProvider } from '@/context/UserContext';
import NavbarWrapper from '@/components/NavbarWrapper';
import type { ReactNode } from 'react';

export function ConditionalLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isStandalone = pathname.startsWith('/client-signup');

  if (isStandalone) {
    return <>{children}</>;
  }

  return (
    <UserProvider>
      <NavbarWrapper />
      {children}
    </UserProvider>
  );
}
