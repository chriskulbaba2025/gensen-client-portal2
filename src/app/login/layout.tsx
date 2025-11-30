// src/app/login/layout.tsx
import '../globals.css';

export const metadata = {
  title: 'Login – GENSEN Voice Forge',
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      {children}
    </div>
  );
}
