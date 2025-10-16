// src/hooks/useInactivityTimeout.ts
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const TIMEOUT_DURATION = 20 * 60 * 1000; // 20 minutes

export default function useInactivityTimeout() {
  const router = useRouter();

  useEffect(() => {
    let timer: NodeJS.Timeout;

    const resetTimer = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        localStorage.removeItem('user'); // clear session
        router.push('/login'); // redirect to login
      }, TIMEOUT_DURATION);
    };

    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
    events.forEach((event) => window.addEventListener(event, resetTimer));

    resetTimer();

    return () => {
      clearTimeout(timer);
      events.forEach((event) =>
        window.removeEventListener(event, resetTimer)
      );
    };
  }, [router]);
}
