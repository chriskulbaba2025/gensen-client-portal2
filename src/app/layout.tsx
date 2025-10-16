<<<<<<< HEAD
import './globals.css';
import type { ReactNode } from 'react';
import { Raleway } from 'next/font/google';
import { UserProvider } from '@/context/UserContext';
import NavbarWrapper from '@/components/NavbarWrapper';

export const metadata = {
  title: 'GENSEN Voice Forge',
  description: 'MVP wizard for agency brand voice creation',
};

// ✅ Import Raleway and set it as a CSS variable
const raleway = Raleway({
  subsets: ['latin'],
  variable: '--font-raleway',
  weight: ['400', '500', '600', '700'],
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${raleway.variable} font-[Raleway] flex flex-col min-h-screen bg-[#f7f9fc] text-[#0a0a0a]`}
      >
        <UserProvider>
          <NavbarWrapper />
          {children}
        </UserProvider>
=======
﻿// src/app/layout.tsx
import "./globals.css";
import type { ReactNode } from "react";
import Navbar from "@/components/Navbar";
import CognitoProvider from "@/components/CognitoProvider";
import { UserProvider } from "@/context/UserContext";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <CognitoProvider>
          <UserProvider>
            <Navbar />
            {children}
          </UserProvider>
        </CognitoProvider>
>>>>>>> 79875a4 (Update Navbar and tiles to link to brand voice)
      </body>
    </html>
  );
}
