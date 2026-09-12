import type { Metadata, Viewport } from "next";
import { Noto_Sans_Bengali, Geist_Mono } from "next/font/google";
import "./globals.css";

const notoBengali = Noto_Sans_Bengali({
  subsets: ["bengali"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-noto-bengali",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#090d1a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "AIBA Radar // Routine & Room Finder",
  description:
    "Zero-friction, blazing-fast campus class routine and empty room radar for Army Institute of Business Administration (AIBA), Sylhet. Fall 2026.",
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
    title: "AIBA Radar // Routine & Room Finder",
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
      className={`${notoBengali.variable} ${notoBengali.className} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
