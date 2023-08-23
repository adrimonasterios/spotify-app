import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SpotifyAuthenticationProvider } from "./_providers/SpotifyAuthenticationProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SpotifyAuthenticationProvider>
      <html lang="en">
        <body className={inter.className}>{children}</body>
      </html>
    </SpotifyAuthenticationProvider>
  );
}
