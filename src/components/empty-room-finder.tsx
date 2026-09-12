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
  MapPin,
  Search,
  User,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full max-w-2xl max-h-[85vh] bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl flex flex-col text-zinc-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/30 flex items-center justify-center text-violet-400">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white tracking-tight">
                  ফাঁকা রুম ডিটেক্টর
                </h3>
                <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  {freeRoomsCount}টি রুম এখন ফাঁকা
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                এই মুহূর্তে আড্ডা বা পড়ার জন্য ফাঁকা ক্লাসরুম খুঁজুন
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-full transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filters Bar */}
        <div className="p-4 border-b border-zinc-800/80 bg-zinc-900/30 space-y-3">
          <div className="flex flex-col sm:flex-row gap-2">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="রুম নম্বর বা শিক্ষকের নাম লিখুন..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-violet-500 transition-colors"
              />
            </div>

            {/* Floor Filter Tabs */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setFloorFilter("ALL")}
                className={`px-3 py-2 rounded-xl text-xs font-mono font-medium transition-all cursor-pointer ${
                  floorFilter === "ALL"
                    ? "bg-violet-600 text-white font-bold"
                    : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200"
                }`}
              >
                সব তলা
              </button>
              <button
                type="button"
                onClick={() => setFloorFilter("2")}
                className={`px-3 py-2 rounded-xl text-xs font-mono font-medium transition-all cursor-pointer ${
                  floorFilter === "2"
                    ? "bg-violet-600 text-white font-bold"
                    : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200"
                }`}
              >
                ২য় তলা
              </button>
              <button
                type="button"
                onClick={() => setFloorFilter("3")}
                className={`px-3 py-2 rounded-xl text-xs font-mono font-medium transition-all cursor-pointer ${
                  floorFilter === "3"
                    ? "bg-violet-600 text-white font-bold"
                    : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200"
                }`}
              >
                ৩য় তলা
              </button>
            </div>
          </div>

          {/* Toggle between Free only vs All Rooms */}
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-zinc-500">
              বর্তমান সময়: <strong className="text-zinc-300">{currentTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</strong>
            </span>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setStatusFilter("FREE")}
                className={`px-2.5 py-1 rounded-lg text-xs transition-colors cursor-pointer ${
                  statusFilter === "FREE"
                    ? "bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                কেবল ফাঁকা ({freeRoomsCount})
              </button>
              <span className="text-zinc-600">|</span>
              <button
                type="button"
                onClick={() => setStatusFilter("ALL")}
                className={`px-2.5 py-1 rounded-lg text-xs transition-colors cursor-pointer ${
                  statusFilter === "ALL"
                    ? "bg-zinc-800 text-zinc-200 font-bold border border-zinc-700"
                    : "text-zinc-400 hover:text-zinc-200"
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
            <div className="text-center py-12 text-zinc-500 text-xs font-mono">
              কোনো রুম পাওয়া যায়নি।
            </div>
          ) : (
            filtered.map((room) => (
              <div
                key={room.room}
                className={`p-3.5 sm:p-4 rounded-xl border transition-all ${
                  room.isFree
                    ? "bg-emerald-950/20 border-emerald-900/40 hover:border-emerald-700/60"
                    : "bg-zinc-900/40 border-zinc-800/80 opacity-75"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center font-mono font-bold text-sm ${
                        room.isFree
                          ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                          : "bg-rose-500/15 text-rose-300 border border-rose-500/30"
                      }`}
                    >
                      <span className="text-[10px] font-normal opacity-70">রুম</span>
                      <span>{room.room}</span>
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-zinc-400">
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

                      {/* Detail text */}
                      {room.isFree ? (
                        <div className="mt-1 text-xs font-mono text-zinc-300">
                          {room.freeUntil === "সারা দিন" ? (
                            <span className="text-emerald-300 font-semibold flex items-center gap-1">
                              <Sparkles className="w-3 h-3 text-amber-400" />
                              আজ আর কোনো ক্লাস নেই (সারা দিন ফাঁকা)
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-zinc-300">
                              <Clock className="w-3 h-3 text-cyan-400" />
                              ফাঁকা আছে:{" "}
                              <strong className="text-white">
                                {formatMinutesBengali(room.freeDurationMinutes || 0)}
                              </strong>{" "}
                              ({minutesToTime12(room.freeUntil || "")} পর্যন্ত)
                            </span>
                          )}
                        </div>
                      ) : (
                        <div className="mt-1 text-xs font-mono text-zinc-400">
                          <span className="text-zinc-200 font-medium">
                            {room.currentClass?.courseTitle}
                          </span>{" "}
                          ({room.currentClass?.batch} • {room.currentClass?.instructor})
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Room Quick Action Tag */}
                  {room.isFree && (
                    <div className="hidden sm:flex items-center gap-1 text-xs font-mono px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                      <Coffee className="w-3 h-3" />
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
