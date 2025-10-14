'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

// ───────────────────────────────────────────────
// Types
// ───────────────────────────────────────────────
interface User {
  email: string;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
}

// ───────────────────────────────────────────────
// Context setup
// ───────────────────────────────────────────────
const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  // ───────────────────────────────────────────────
  // Placeholder effect for AWS or custom auth later
  // ───────────────────────────────────────────────
  useEffect(() => {
    // Example logic: load a stored user session
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem('user');
      }
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

// ───────────────────────────────────────────────
// Hook
// ───────────────────────────────────────────────
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within a UserProvider');
  return context;
};
