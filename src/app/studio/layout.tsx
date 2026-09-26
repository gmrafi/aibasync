import type { Metadata } from "next";
import { Bricolage_Grotesque, JetBrains_Mono } from "next/font/google";

const bricolage = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-bricolage" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains" });

export const metadata: Metadata = {
  title: "DocuSuite Studio | AIBA Sync",
  description: "Privacy-first utility hub for students and professionals.",
};

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${bricolage.variable} ${jetbrains.variable} min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50`}>
      {children}
    </div>
  );
}
