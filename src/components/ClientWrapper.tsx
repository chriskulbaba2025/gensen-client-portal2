'use client';

import { ReactNode } from 'react';
import { UserProvider } from '@/context/UserContext';

export default function ClientWrapper({ children }: { children: ReactNode }) {
  return <UserProvider>{children}</UserProvider>;
}
