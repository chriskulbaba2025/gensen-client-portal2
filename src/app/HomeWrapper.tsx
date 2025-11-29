"use client";

import React from "react";

export default function HomeWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full bg-[#f8fafc] dark:bg-[#0e0e0e] flex justify-center items-start p-[40px]">
      <div className="w-full max-w-[1200px]">
        {children}
      </div>
    </div>
  );
}
