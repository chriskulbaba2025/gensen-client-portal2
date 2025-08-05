// src/app/generate/step-1/layout.tsx
'use client';

import { ReactNode } from 'react';
import ClientWrapper from '@/components/ClientWrapper';

export default function GenerateStep1Layout({ children }: { children: ReactNode }) {
  return <ClientWrapper>{children}</ClientWrapper>;
}
