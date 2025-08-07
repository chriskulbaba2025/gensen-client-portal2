// src/app/login/layout.tsx
import '../globals.css';  // fixed path

export const metadata = {
  title: 'Login – GENSEN Voice Forge',
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        {children}
      </body>
    </html>
  );
}
