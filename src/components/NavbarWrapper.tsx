'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';

export default function NavbarWrapper() {
  const pathname = usePathname();

  // Hide navbar on the login page
  const hideNavbar = pathname === '/login';

  if (hideNavbar) return null;
  return <Navbar />;
}
