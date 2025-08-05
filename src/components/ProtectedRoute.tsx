// components/ProtectedRoute.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';

const TIMEOUT = 20 * 60 * 1000;

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [userChecked, setUserChecked] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const logout = () => {
      signOut(auth);
      router.push('/login?error=timeout');
    };

    const resetTimer = () => {
      clearTimeout(timeout);
      timeout = setTimeout(logout, TIMEOUT);
    };

    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.replace('/login?error=unauthorized');
      } else {
        setUserChecked(true);
        resetTimer();
        ['click', 'keydown', 'mousemove', 'scroll'].forEach((e) =>
          window.addEventListener(e, resetTimer)
        );
      }
    });

    window.addEventListener('beforeunload', logout);

    return () => {
      unsub();
      clearTimeout(timeout);
      window.removeEventListener('beforeunload', logout);
      ['click', 'keydown', 'mousemove', 'scroll'].forEach((e) =>
        window.removeEventListener(e, resetTimer)
      );
    };
  }, [router]);

  if (!userChecked) return null;

  return <>{children}</>;
}
