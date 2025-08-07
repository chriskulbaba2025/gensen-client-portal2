'use client';

import Image from 'next/image';
import { Gauge, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useUser } from '@/context/UserContext';

export default function Navbar() {
  const router = useRouter();
  const { user } = useUser();

  // Unified click handler for nav actions
  const handleClick = (href: string, external = false) => (e: React.MouseEvent) => {
    if (!user) {
      e.preventDefault();
      return router.push('/login');
    }
    if (external) {
      // for external links, window.open
      e.preventDefault();
      window.open(href, '_blank', 'noopener');
    }
    // for internal links, no need to preventDefault—Next.js <Link> will handle
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  return (
    <nav className="flex justify-between items-center px-[40px] py-[20px] border-b bg-white shadow-sm">
      {/* Logo */}
      <a
        href="/dashboard/welcome"
        onClick={handleClick('/dashboard/welcome')}
        className="flex items-center"
      >
        <Image
          src="https://responsegenerators.ca/wp-content/uploads/2025/07/Gensen-Logo-Final-version-lower-case-logo-and-spaces1.webp"
          alt="GENSEN Logo"
          width={60}
          height={60}
        />
        <span className="ml-[12px] text-[24px] font-bold text-gray-800">GENSEN</span>
      </a>

      {/* Nav Links */}
      <div className="flex items-center gap-[24px] text-[16px] text-gray-700">
        <a
          href="/dashboard/welcome"
          onClick={handleClick('/dashboard/welcome')}
          className="flex items-center gap-[8px] hover:text-orange-500"
        >
          <Gauge size={20} /> Dashboard
        </a>

        <a
          href="https://gensen-voice-builder.vercel.app/"
          onClick={handleClick('https://gensen-voice-builder.vercel.app/', true)}
          className="flex items-center gap-[8px] hover:text-orange-500"
        >
          <Gauge size={20} /> Brand Voice
        </a>

        <a
          href="https://gensen-map-builder.vercel.app/"
          onClick={handleClick('https://gensen-map-builder.vercel.app/', true)}
          className="flex items-center gap-[8px] hover:text-orange-500"
        >
          <Gauge size={20} /> Topical Map
        </a>

        <a
          href="/generate/step-1"
          onClick={handleClick('/generate/step-1')}
          className="flex items-center gap-[8px] hover:text-orange-500"
        >
          <Gauge size={20} /> Content Generator
        </a>

        <button
          onClick={handleLogout}
          className="flex items-center gap-[8px] hover:text-orange-500 bg-transparent border-none p-0"
        >
          <LogOut size={20} /> Logout
        </button>
      </div>
    </nav>
  );
}
