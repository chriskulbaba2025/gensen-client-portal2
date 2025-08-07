// src/components/Navbar.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Gauge, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useUser } from '@/context/UserContext';

export default function Navbar() {
  const router = useRouter();
  const { user } = useUser();
  if (!user) return null;

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  return (
    <>
      <nav className="flex justify-between items-center px-[40px] py-[20px] border-b bg-white shadow-sm">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center nav-item">
          <Image
            src="https://responsegenerators.ca/wp-content/uploads/2025/07/Gensen-Logo-Final-version-lower-case-logo-and-spaces1.webp"
            alt="GENSEN Logo"
            width={60}
            height={60}
          />
          <span className="ml-[12px] text-[24px] font-bold text-gray-800">
            GENSEN
          </span>
        </Link>

        {/* Nav Links */}
        <div className="flex items-center gap-[24px] text-[16px] text-gray-700">
          <Link
            href="/dashboard"
            className="flex items-center gap-[8px] nav-item"
          >
            <Gauge size={20} /> Dashboard
          </Link>

          <a
            href="https://gensen-voice-builder.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-[8px] nav-item"
          >
            <Gauge size={20} /> Brand Voice
          </a>

          <a
            href="https://gensen-map-builder.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-[8px] nav-item"
          >
            <Gauge size={20} /> Topical Map
          </a>

          <Link
            href="/generate/step-1"
            className="flex items-center gap-[8px] nav-item"
          >
            <Gauge size={20} /> Content Generator
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center gap-[8px] bg-transparent border-none p-0 nav-item"
          >
            <LogOut size={20} /> Logout
          </button>
        </div>
      </nav>

      <style jsx>{`
        .nav-item {
          position: relative;
          transition: color 0.2s ease-in-out;
        }
        .nav-item::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 100%;
          height: 2px;
          background-color: #f66630;
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.3s ease-in-out;
        }
        .nav-item:hover::after {
          transform: scaleX(1);
        }
        .nav-item:hover {
          color: #f66630;
        }
      `}</style>
    </>
  );
}
