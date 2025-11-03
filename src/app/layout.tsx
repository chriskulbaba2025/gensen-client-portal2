import './globals.css';
import type { ReactNode } from 'react';
import { Raleway } from 'next/font/google';
import { ConditionalLayout } from '@/components/ConditionalLayout';

export const metadata = {
  title: 'GENSEN Voice Forge',
  description: 'MVP wizard for agency brand voice creation',
  icons: {
    icon: 'https://omnipressence.com/wp-content/uploads/2025/09/favicon-logo-64-x-64.webp',
  },
};

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
        <ConditionalLayout>{children}</ConditionalLayout>
      </body>
    </html>
  );
}
