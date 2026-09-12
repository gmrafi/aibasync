import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#09090b",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "CLASSR // AIBA Sylhet Routine Terminal",
  description:
    "Zero-friction, blazing-fast campus class routine and empty room finder for Army Institute of Business Administration (AIBA), Sylhet. Fall 2026.",
  manifest: "/manifest.json",
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
  authors: [
    {
      name: "Md. Golam Mubasshir Rafi",
      url: "https://www.gmrafi.com.bd/",
    },
  ],
  creator: "Md. Golam Mubasshir Rafi",
  openGraph: {
    title: "CLASSR // AIBA Sylhet Routine Terminal",
    description: "Instant class countdowns, empty room finder & offline routine for AIBA Sylhet students.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="bn"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-[#09090b] text-[#f4f4f5]">
        {children}
      </body>
    </html>
  );
}
