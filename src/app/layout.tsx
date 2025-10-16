// src/app/layout.tsx
import "./globals.css";
import type { ReactNode } from "react";
import { Raleway } from "next/font/google";
import { UserProvider } from "@/context/UserContext";
import NavbarWrapper from "@/components/NavbarWrapper";
import CognitoProvider from "@/components/CognitoProvider";

export const metadata = {
  title: "GENSEN Voice Forge",
  description: "MVP wizard for agency brand voice creation",
};

const raleway = Raleway({
  subsets: ["latin"],
  variable: "--font-raleway",
  weight: ["400", "500", "600", "700"],
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${raleway.variable} font-[Raleway] flex flex-col min-h-screen bg-[#f7f9fc] text-[#0a0a0a]`}
      >
        <CognitoProvider>
          <UserProvider>
            <NavbarWrapper />
            {children}
          </UserProvider>
        </CognitoProvider>
      </body>
    </html>
  );
}
