// src/components/ClientWrapper.tsx
'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useUser } from '@/context/UserContext';

const TIMEOUT = 20 * 60 * 1000;
const PUBLIC_PATHS = ['/login', '/register', '/forgot-password'];

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { setUser } = useUser();
  const [loading, setLoading] = useState(true);

  const isPublic = useMemo(() => PUBLIC_PATHS.includes(pathname), [pathname]);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const logout = () => {
      console.log('[AUTH] 🔒 Auto-logging out (inactivity)');
      signOut(auth);
      setUser(null);
      router.push('/login?error=timeout');
    };

    const resetTimer = () => {
      clearTimeout(timeout);
      timeout = setTimeout(logout, TIMEOUT);
    };

    const unsub = onAuthStateChanged(auth, user => {
      if (user) {
        console.log('[AUTH] ✅ Logged in:', user.email);
        setUser(user);
        if (!isPublic) {
          resetTimer();
          ['click', 'keydown', 'mousemove', 'scroll'].forEach(e =>
            window.addEventListener(e, resetTimer)
          );
        }
      } else {
        console.log('[AUTH] ❌ Not logged in — redirecting');
        setUser(null);
        if (!isPublic) router.replace('/login?error=unauthorized');
      }
      setLoading(false);
    });

    return () => {
      unsub();
      clearTimeout(timeout);
      ['click', 'keydown', 'mousemove', 'scroll'].forEach(e =>
        window.removeEventListener(e, resetTimer)
      );
    };
  }, [router, pathname, isPublic, setUser]);

  if (loading) return null;

  return <>{children}</>;
}
