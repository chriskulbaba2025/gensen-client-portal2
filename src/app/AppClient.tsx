"use client";
import { ConditionalLayout } from "@/components/ConditionalLayout";

export default function AppClient({ children }: { children: React.ReactNode }) {
  return <ConditionalLayout>{children}</ConditionalLayout>;
}

