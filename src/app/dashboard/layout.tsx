// src/app/dashboard/layout.tsx  (remove Navbar)
"use client";

<<<<<<< HEAD
import { ReactNode } from 'react';
import ClientWrapper from '@/components/ClientWrapper';
import QuickLinks from '@/components/QuickLinks';
import useInactivityTimeout from '@/hooks/useInactivityTimeout';
=======
import { ReactNode } from "react";
import ClientWrapper from "@/components/ClientWrapper";
import QuickLinks from "@/components/QuickLinks";
import { useInactivityTimeout } from "@/hooks/useInactivityTimeout";
import { useAuth } from "react-oidc-context";
import { useRouter } from "next/navigation";
>>>>>>> 79875a4 (Update Navbar and tiles to link to brand voice)

export default function DashboardLayout({ children }: { children: ReactNode }) {
  useInactivityTimeout();
  const auth = useAuth();
  const router = useRouter();

  if (!auth.isLoading && !auth.isAuthenticated) {
    router.replace("/login");
    return null;
  }
  if (auth.isLoading) return <div className="min-h-screen grid place-items-center">Loading…</div>;
  if (auth.error) return <div className="min-h-screen grid place-items-center text-red-600">Error: {auth.error.message}</div>;

  return (
    <ClientWrapper>
      <div className="min-h-screen flex">
        <aside className="w-[80px] border-r border-gray-200">
          <QuickLinks inline />
        </aside>
        <main className="flex-1 p-[20px] overflow-y-auto">{children}</main>
      </div>
    </ClientWrapper>
  );
}
