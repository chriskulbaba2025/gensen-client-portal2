// src/app/layout.tsx
import './globals.css';
import type { ReactNode } from 'react';
import Navbar from '@/components/Navbar';
import { UserProvider } from '@/context/UserContext';

export const metadata = {
  title: 'GENSEN Voice Forge',
  description: 'MVP wizard for agency brand voice creation',
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <UserProvider>
          <Navbar />
          {children}
        </UserProvider>
      </body>
    </html>
  );
}
