"use client";

import { useState } from "react";
import { Camera, FileText, ScanLine, Wrench } from "lucide-react";
import PhotoCraft from "./components/PhotoCraft";
import CoverGenerator from "./components/CoverGenerator";

const TABS = [
  { id: "photocraft", label: "PhotoCraft", icon: Camera },
  { id: "cover", label: "Varsity Cover", icon: FileText },
  { id: "scanner", label: "Doc Scanner", icon: ScanLine },
  { id: "tools", label: "Quick Tools", icon: Wrench },
];

export default function StudioPage() {
  const [activeTab, setActiveTab] = useState("photocraft");

  return (
    <div className="flex h-screen flex-col font-sans">
      {/* Header */}
      <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-sm">
            <Wrench className="h-4 w-4" />
          </div>
          <h1 className="font-['Bricolage_Grotesque'] text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            DocuSuite <span className="text-emerald-600">Studio</span>
          </h1>
        </div>

        {/* Pill Navigation */}
        <nav className="hidden space-x-1 rounded-full border border-slate-200 bg-slate-50 p-1 md:flex dark:border-slate-800 dark:bg-slate-950">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                  isActive
                    ? "bg-white text-emerald-700 shadow-sm dark:bg-slate-800 dark:text-emerald-400"
                    : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden bg-slate-50 dark:bg-slate-950">
        {activeTab === "photocraft" && <PhotoCraft />}
        {activeTab === "cover" && <CoverGenerator />}
        {activeTab === "scanner" && (
          <div className="flex h-full items-center justify-center text-slate-500">
            Scanner Module (Coming Soon)
          </div>
        )}
        {activeTab === "tools" && (
          <div className="flex h-full items-center justify-center text-slate-500">
            Quick Tools (Coming Soon)
          </div>
        )}
      </main>
    </div>
  );
}
