'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Gauge, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function Navbar() {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  return (
    <nav className="flex justify-between items-center px-[40px] py-[20px] border-b border-[#00000020]">
      {/* Logo */}
      <Link href="/dashboard" className="flex items-center">
        <Image
          src="https://responsegenerators.ca/wp-content/uploads/2025/07/Gensen-Logo-Final-version-lower-case-logo-and-spaces1.webp"
          alt="Gensen Logo"
          width={40}
          height={40}
          className="cursor-pointer"
        />
        <span className="ml-[40px] text-[24px] font-semibold text-black">
          GENSEN
        </span>
      </Link>

      {/* Nav Items */}
      <div className="flex items-center space-x-[40px]">
        <NavItem href="/dashboard" label="Dashboard" Icon={Gauge} />
        <NavItem onClick={handleLogout} label="Logout" Icon={LogOut} />
      </div>
    </nav>
  );
}

type NavItemProps = {
  href?: string;
  onClick?: () => void;
  label: string;
  Icon: React.ComponentType<{ size: number }>;
};

function NavItem({ href, onClick, label, Icon }: NavItemProps) {
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
          background-color: #f66630;
          transition: transform 0.3s ease-in-out;
        }
        .nav-hover:hover::after {
          transform: translateX(-50%) scaleX(1);
        }
      `}</style>
    </>
  );

  const commonClasses =
    'flex items-center gap-[8px] text-[16px] font-medium text-black transition relative';

  if (href) {
    return (
      <Link
        href={href}
        className={commonClasses}
        style={{ color: 'inherit', textDecoration: 'none' }}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      onClick={onClick}
      className={`${commonClasses} bg-transparent border-none p-0 focus:outline-none`}
      style={{ color: 'inherit', background: 'none' }}
    >
      {content}
    </button>
  );
}
