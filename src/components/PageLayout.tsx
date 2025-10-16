'use client';
import React from 'react';

export default function PageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#f9f9f9] dark:bg-[#1a1a1a] p-[20px]">
      {/* you can add header/nav here if desired */}
      {children}
    </div>
  );
}
