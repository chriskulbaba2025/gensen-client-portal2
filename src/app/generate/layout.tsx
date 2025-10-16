// src/app/generate/layout.tsx
'use client';

import { ReactNode } from 'react';
import ClientWrapper from '@/components/ClientWrapper';
import useInactivityTimeout from '@/hooks/useInactivityTimeout'; // ✅ FIXED

export default function GenerateLayout({ children }: { children: ReactNode }) {
  useInactivityTimeout(); // ✅ now works

  return (
    <ClientWrapper>
      <div className="min-h-screen p-[20px]">
        {children}
      </div>
    </ClientWrapper>
  );
}
