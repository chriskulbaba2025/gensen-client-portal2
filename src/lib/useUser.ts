// src/lib/useUser.ts
'use client';
import { useEffect, useState } from 'react';

export function useUser() {
  const [user, setUser] = useState<{ email: string; sub: string; name: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/auth/user')
      .then(r => r.json())
      .then(d => setUser(d.ok ? d.user : null))
      .finally(() => setLoading(false));
  }, []);

  return { user, loading };
}
