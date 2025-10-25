// src/hooks/useInactivityTimeout.ts
'use client';

import { useEffect } from 'react';

const TIMEOUT_DURATION = 30 * 60 * 1000; // 30 minutes

export default function useInactivityTimeout() {
  useEffect(() => {
    let timer: NodeJS.Timeout;

    const resetTimer = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        // full logout through API route
        window.location.href = '/api/auth/logout';
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
  }, []);
}
