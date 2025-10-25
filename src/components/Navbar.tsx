// src/components/Navbar.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Gauge, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';

export default function Navbar() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'GET' });
    } catch (e) {
      console.error('Logout error', e);
    } finally {
      router.push('https://portal.omnipressence.com/login');
    }
  };

  return (
    <nav className="flex justify-between items-center px-[40px] py-[20px] border-b border-[#00000020] bg-white z-50">
      {/* Logo */}
      <a href="/dashboard/welcome" className="flex items-center no-underline">
        <Image
          src="https://omnipressence.com/wp-content/uploads/2025/09/Gensen-Logo-Final-version-lower-case-logo-and-spaces1-356x295-1.webp"
          alt="Gensen Logo"
          width={80}
          height={80}
          className="rounded-[8px]"
        />
        <span className="ml-[40px] text-[24px] font-semibold text-black">
          GENSEN
        </span>
      </a>

      {/* Nav Items */}
      <div className="flex items-center space-x-[40px]">
        <NavItem
          href="https://portal.omnipressence.com/dashboard/welcome"
          label="Dashboard"
          Icon={Gauge}
          external
        />
        <NavItem
          href="https://voice.omnipressence.com/dashboard/welcome"
          label="Brand Voice"
          Icon={Gauge}
          external
        />
        <NavItem
          href="https://map.omnipressence.com/dashboard/welcome"
          label="Topical Map"
          Icon={Gauge}
          external
        />
        <NavItem
          href="https://portal.omnipressence.com/generate/step-1"
          label="Content Generator"
          Icon={Gauge}
          external
        />
        <NavItemButton onClick={handleLogout} label="Logout" Icon={LogOut} />
      </div>
    </nav>
  );
}

type IconType = React.ComponentType<{ size?: number; className?: string }>;

type NavItemProps = {
  href?: string;
  label: string;
  Icon: IconType;
  external?: boolean;
};

function NavItem({ href = '#', label, Icon, external = false }: NavItemProps) {
  const content = (
    <>
      <Icon size={18} />
      <span className="nav-hover">{label}</span>
      <style jsx>{`
        .nav-hover {
          position: relative;
        }
        .nav-hover::after {
          content: '';
          position: absolute;
          left: 50%;
          bottom: -2px;
          transform: translateX(-50%) scaleX(0);
          transform-origin: center;
          width: 100%;
          height: 2px;
          background: linear-gradient(
            90deg,
            rgba(10, 162, 251, 0) 0%,
            rgba(10, 162, 251, 0.8) 50%,
            rgba(10, 162, 251, 0) 100%
          );
          box-shadow: 0 0 6px rgba(10, 162, 251, 0.7);
          transition: transform 0.25s ease-in-out;
        }
        a:hover .nav-hover::after {
          transform: translateX(-50%) scaleX(1);
        }
      `}</style>
    </>
  );

  const base =
    'flex items-center gap-[8px] text-[16px] font-medium text-black hover:text-[#0aa2fb] no-underline';

  if (external)
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={base}>
        {content}
      </a>
    );

  return (
    <Link href={href} className={base}>
      {content}
    </Link>
  );
}

function NavItemButton({
  onClick,
  label,
  Icon,
}: {
  onClick: () => void;
  label: string;
  Icon: IconType;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-[8px] text-[16px] font-medium text-black hover:text-[#0aa2fb] no-underline select-none"
      style={{ background: 'transparent', border: 0, padding: 0 }}
    >
      <Icon size={18} />
      <span className="nav-hover">{label}</span>
    </button>
  );
}
