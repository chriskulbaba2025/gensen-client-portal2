import { useEffect } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';

const TIMEOUT_DURATION = 20 * 60 * 1000; // 20 minutes

export function useInactivityTimeout() {
  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const logout = () => {
      signOut(auth);
      window.location.href = '/login?error=timeout';
    };

    const resetTimer = () => {
      clearTimeout(timeout);
      timeout = setTimeout(logout, TIMEOUT_DURATION);
    };

    const activityEvents = ['mousemove', 'keydown', 'scroll', 'click'];

    activityEvents.forEach(event =>
      window.addEventListener(event, resetTimer)
    );

    resetTimer(); // Initialize the timer on mount

    return () => {
      activityEvents.forEach(event =>
        window.removeEventListener(event, resetTimer)
      );
      clearTimeout(timeout);
    };
  }, []);
}
