"use client";

import { ConditionalLayout } from "@/components/ConditionalLayout";

export default function LayoutClient({ children }: { children: React.ReactNode }) {
  return <ConditionalLayout>{children}</ConditionalLayout>;
}
