// src/app/layout.tsx
import './globals.css';
import { ReactNode } from 'react';
import { Raleway } from 'next/font/google';
import { UserProvider } from '@/context/UserContext';
import NavBar from '@/components/Navbar';

const raleway = Raleway({
  weight: ['400', '600'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-raleway',
});

export const metadata = {
  title: 'Gensen Client Portal',
  description: 'Client access dashboard for Gensen services',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={`${raleway.variable} font-sans`}>
        <UserProvider>
          <NavBar />
          {children}
        </UserProvider>
      </body>
    </html>
  );
}
