"use client";

import React from "react";

export default function PageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full bg-[#f0f2f5] dark:bg-[#101010] p-[40px] flex justify-center">
      <div className="w-full max-w-[1400px]">{children}</div>
    </div>
  );
}
