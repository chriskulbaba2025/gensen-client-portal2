import type { ReactNode } from 'react';

export default function ClientSignupLayout({ children }: { children: ReactNode }) {
  return (
    <div className="bg-[#f7f9fc] text-[#0b1320] min-h-screen flex flex-col items-center justify-center">
      {children}
    </div>
  );
}
