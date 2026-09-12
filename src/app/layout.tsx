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
  title: "AIBA Sync // Routine & Room Radar",
  description:
    "Zero-friction, blazing-fast campus class routine and empty room radar for Army Institute of Business Administration (AIBA), Sylhet. Fall 2026.",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  authors: [
    {
      name: "Md. Golam Mubasshir Rafi",
      url: "https://www.gmrafi.com.bd/",
    },
  ],
  creator: "Md. Golam Mubasshir Rafi",
  openGraph: {
    title: "AIBA Sync // Routine & Room Radar",
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
      suppressHydrationWarning
      className={`${notoBengali.variable} ${notoBengali.className} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const stored = localStorage.getItem('aiba_sync_user_pref_v3');
                if (stored) {
                  const p = JSON.parse(stored);
                  if (p.theme === 'dark') {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (e) {}
            `,
          }}
        />
        {/* Google Analytics 4 (gtag.js) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-X9YDHXPHFB" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-X9YDHXPHFB');
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
