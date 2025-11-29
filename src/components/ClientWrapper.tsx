"use client";

import React from "react";

export default function ClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full bg-[#f8fafc] dark:bg-[#101010] flex justify-center">
      <div className="w-full max-w-[1400px] px-[40px] py-[20px]">
        {children}
      </div>
    </div>
  );
}
