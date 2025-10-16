'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from 'react-oidc-context';

export default function CallbackPage() {
  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (auth.isAuthenticated) {
      // redirect after login success
      router.push('/dashboard');
    } else if (auth.error) {
      console.error('Login error:', auth.error);
      router.push('/login'); // fallback
    }
  }, [auth, router]);

  return <p>Completing login…</p>;
}
