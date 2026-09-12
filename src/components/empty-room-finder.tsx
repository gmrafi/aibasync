"use client";

import { useState } from "react";
import { ALL_ROOMS } from "@/data/routine";
import { calculateEmptyRooms, formatMinutesBengali, minutesToTime12 } from "@/lib/time-utils";
import { ClassSlot } from "@/lib/types";
import {
  Building2,
  CheckCircle2,
  Clock,
  Coffee,
  Search,
  X,
  XCircle,
  Sparkles,
} from "lucide-react";

interface EmptyRoomFinderProps {
  isOpen: boolean;
  onClose: () => void;
  routineData: ClassSlot[];
  currentTime: Date;
}

export function EmptyRoomFinder({
  isOpen,
  onClose,
  routineData,
  currentTime,
}: EmptyRoomFinderProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [floorFilter, setFloorFilter] = useState<"ALL" | "2" | "3">("ALL");
  const [statusFilter, setStatusFilter] = useState<"FREE" | "ALL">("FREE");

  if (!isOpen) return null;

  const roomStatuses = calculateEmptyRooms(routineData, ALL_ROOMS, currentTime);
  const freeRoomsCount = roomStatuses.filter((r) => r.isFree).length;

  const filtered = roomStatuses.filter((item) => {
    // Floor filter
    if (floorFilter === "2" && !item.room.startsWith("2")) return false;
    if (floorFilter === "3" && !item.room.startsWith("3")) return false;

    // Status filter
    if (statusFilter === "FREE" && !item.isFree) return false;

    // Search filter
    if (searchTerm) {
      const matchRoom = item.room.toLowerCase().includes(searchTerm.toLowerCase());
      const matchClass =
        item.currentClass?.courseTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.currentClass?.instructor.toLowerCase().includes(searchTerm.toLowerCase());
      return matchRoom || matchClass;
    }

    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl animate-in fade-in duration-200">
      <div
        className="w-full max-w-2xl max-h-[85vh] bg-gradient-to-b from-slate-900/95 via-slate-900/90 to-slate-950 border border-slate-700/60 rounded-3xl shadow-2xl shadow-cyan-950/40 flex flex-col text-slate-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-violet-500/20 to-purple-600/30 border border-violet-500/40 flex items-center justify-center text-violet-300 shadow-inner">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white tracking-tight">
                  ফাঁকা রুম ডিটেক্টর
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  {freeRoomsCount}টি রুম এখন ফাঁকা
                </span>
              </div>
              <p className="text-xs text-slate-400">
                এই মুহূর্তে আড্ডা বা পড়ার জন্য ফাঁকা ক্লাসরুম খুঁজুন
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filters Bar */}
        <div className="p-4 border-b border-slate-800/80 bg-slate-950/40 space-y-3">
          <div className="flex flex-col sm:flex-row gap-2.5">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="রুম নম্বর বা শিক্ষকের নাম লিখুন..."
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors"
              />
            </div>

            {/* Floor Filter Tabs */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setFloorFilter("ALL")}
                className={`px-3.5 py-2 rounded-xl text-xs font-mono font-medium transition-all cursor-pointer ${
                  floorFilter === "ALL"
                    ? "bg-violet-600 text-white font-bold shadow-md shadow-violet-500/20"
                    : "bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-slate-200"
                }`}
              >
                সব তলা
              </button>
              <button
                type="button"
                onClick={() => setFloorFilter("2")}
                className={`px-3.5 py-2 rounded-xl text-xs font-mono font-medium transition-all cursor-pointer ${
                  floorFilter === "2"
                    ? "bg-violet-600 text-white font-bold shadow-md shadow-violet-500/20"
                    : "bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-slate-200"
                }`}
              >
                ২য় তলা
              </button>
              <button
                type="button"
                onClick={() => setFloorFilter("3")}
                className={`px-3.5 py-2 rounded-xl text-xs font-mono font-medium transition-all cursor-pointer ${
                  floorFilter === "3"
                    ? "bg-violet-600 text-white font-bold shadow-md shadow-violet-500/20"
                    : "bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-slate-200"
                }`}
              >
                ৩য় তলা
              </button>
            </div>
          </div>

          {/* Toggle between Free only vs All Rooms */}
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400">
              বর্তমান সময়: <strong className="text-slate-200">{currentTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</strong>
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setStatusFilter("FREE")}
                className={`px-3 py-1 rounded-lg text-xs transition-colors cursor-pointer ${
                  statusFilter === "FREE"
                    ? "bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                কেবল ফাঁকা ({freeRoomsCount})
              </button>
              <span className="text-slate-600">|</span>
              <button
                type="button"
                onClick={() => setStatusFilter("ALL")}
                className={`px-3 py-1 rounded-lg text-xs transition-colors cursor-pointer ${
                  statusFilter === "ALL"
                    ? "bg-slate-800 text-slate-200 font-bold border border-slate-700"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                সব রুম ({roomStatuses.length})
              </button>
            </div>
          </div>
        </div>

        {/* Room List Scrollable */}
        <div className="p-4 overflow-y-auto space-y-2.5 flex-1">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs font-mono">
              কোনো রুম পাওয়া যায়নি।
            </div>
          ) : (
            filtered.map((room) => (
              <div
                key={room.room}
                className={`p-4 rounded-2xl border transition-all ${
                  room.isFree
                    ? "bg-emerald-950/20 border-emerald-900/40 hover:border-emerald-700/60 shadow-sm"
                    : "bg-slate-900/40 border-slate-800/80 opacity-75"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3.5">
                    <div
                      className={`w-12 h-12 rounded-2xl flex flex-col items-center justify-center font-mono font-bold text-sm ${
                        room.isFree
                          ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 shadow-inner"
                          : "bg-rose-500/15 text-rose-300 border border-rose-500/40"
                      }`}
                    >
                      <span className="text-[9px] font-normal opacity-70">রুম</span>
                      <span>{room.room}</span>
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-slate-400">
                          {room.floor}
                        </span>
                        {room.isFree ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-emerald-400">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            এখন ফাঁকা
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-rose-400">
                            <XCircle className="w-3.5 h-3.5" />
                            ক্লাস চলছে
                          </span>
                        )}
                      </div>

                      {room.isFree ? (
                        <div className="mt-1 text-xs font-mono text-slate-300">
                          {room.freeUntil === "সারা দিন" ? (
                            <span className="text-emerald-300 font-semibold flex items-center gap-1">
                              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                              আজ আর কোনো ক্লাস নেই (সারা দিন ফাঁকা)
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-slate-300">
                              <Clock className="w-3.5 h-3.5 text-cyan-400" />
                              ফাঁকা আছে:{" "}
                              <strong className="text-white">
                                {formatMinutesBengali(room.freeDurationMinutes || 0)}
                              </strong>{" "}
                              ({minutesToTime12(room.freeUntil || "")} পর্যন্ত)
                            </span>
                          )}
                        </div>
                      ) : (
                        <div className="mt-1 text-xs font-mono text-slate-400">
                          <span className="text-slate-200 font-medium">
                            {room.currentClass?.courseTitle}
                          </span>{" "}
                          ({room.currentClass?.batch} • {room.currentClass?.instructor})
                        </div>
                      )}
                    </div>
                  </div>

                  {room.isFree && (
                    <div className="hidden sm:flex items-center gap-1 text-xs font-mono px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                      <Coffee className="w-3.5 h-3.5" />
                      <span>ব্যবহারযোগ্য</span>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
