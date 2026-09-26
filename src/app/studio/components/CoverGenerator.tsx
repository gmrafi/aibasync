"use client";

import { useState, useRef } from "react";
import { Download, FileText } from "lucide-react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

export default function CoverGenerator() {
  const [courseTitle, setCourseTitle] = useState("Introduction to Computer Science");
  const [courseCode, setCourseCode] = useState("CSE 101");
  const [instructorName, setInstructorName] = useState("Dr. Md. Example Rahman");
  const [instructorDesig, setInstructorDesig] = useState("Professor, Dept of CSE");
  const [studentName, setStudentName] = useState("Jane Doe");
  const [studentId, setStudentId] = useState("2021331000");
  const [date, setDate] = useState("10 October 2026");

  const previewRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  const exportPDF = async () => {
    if (!previewRef.current) return;
    setIsExporting(true);
    try {
      const canvas = await html2canvas(previewRef.current, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("Assignment_Cover.pdf");
    } catch (err) {
      console.error(err);
    }
    setIsExporting(false);
  };

  return (
    <div className="flex h-full flex-col md:flex-row">
      {/* Controls Sidebar */}
      <div className="w-full border-r border-slate-200 bg-white p-6 md:w-80 dark:border-slate-800 dark:bg-slate-900 md:overflow-y-auto">
        <h2 className="mb-4 text-lg font-bold">Cover Page Details</h2>
        
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500">Course Title</label>
            <input type="text" value={courseTitle} onChange={(e) => setCourseTitle(e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-900" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500">Course Code</label>
            <input type="text" value={courseCode} onChange={(e) => setCourseCode(e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-900" />
          </div>
          
          <div className="pt-2">
            <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">Submitted To</h3>
            <div className="space-y-3">
              <input type="text" placeholder="Teacher's Name" value={instructorName} onChange={(e) => setInstructorName(e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-900" />
              <input type="text" placeholder="Designation" value={instructorDesig} onChange={(e) => setInstructorDesig(e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-900" />
            </div>
          </div>

          <div className="pt-2">
            <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">Submitted By</h3>
            <div className="space-y-3">
              <input type="text" placeholder="Student Name" value={studentName} onChange={(e) => setStudentName(e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-900" />
              <input type="text" placeholder="Student ID" value={studentId} onChange={(e) => setStudentId(e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-900" />
            </div>
          </div>

          <div className="pt-2">
            <label className="mb-1 block text-xs font-medium text-slate-500">Date of Submission</label>
            <input type="text" value={date} onChange={(e) => setDate(e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-900" />
          </div>
        </div>
      </div>

      {/* Preview Stage */}
      <div className="flex flex-1 flex-col items-center overflow-y-auto bg-slate-100 p-6 dark:bg-slate-950">
        <div className="mb-4 flex w-full max-w-[210mm] justify-end">
          <button
            onClick={exportPDF}
            disabled={isExporting}
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-50"
          >
            <Download className="h-4 w-4" />
            {isExporting ? "Generating PDF..." : "Export as PDF"}
          </button>
        </div>

        {/* A4 Paper Preview Container */}
        <div className="relative shadow-xl">
          {/* A4 Aspect Ratio Box (210x297mm) rendered strictly at 794x1123 pixels for html2canvas */}
          <div 
            ref={previewRef}
            className="flex flex-col items-center justify-between bg-white px-12 py-20 text-black"
            style={{ width: "794px", height: "1123px", transform: "scale(0.8)", transformOrigin: "top center" }}
          >
            <div className="text-center">
              <h1 className="mb-2 text-4xl font-bold uppercase tracking-widest text-slate-800">Assignment</h1>
              <div className="mx-auto mt-6 h-1 w-24 bg-emerald-600"></div>
            </div>

            <div className="w-full space-y-2 rounded-xl border-2 border-dashed border-slate-300 p-8 text-center">
              <p className="text-lg text-slate-500">Course Title</p>
              <h2 className="text-2xl font-bold text-slate-800">{courseTitle || "Course Title"}</h2>
              <p className="mt-4 text-lg text-slate-500">Course Code</p>
              <h3 className="text-xl font-bold text-slate-700">{courseCode || "Course Code"}</h3>
            </div>

            <div className="flex w-full justify-between px-8">
              <div className="w-1/2 pr-4 text-left">
                <h4 className="mb-4 text-lg font-bold uppercase text-slate-800 underline decoration-emerald-500 underline-offset-4">Submitted To</h4>
                <p className="text-lg font-bold text-slate-800">{instructorName}</p>
                <p className="text-slate-600">{instructorDesig}</p>
              </div>
              <div className="w-1/2 pl-4 text-left">
                <h4 className="mb-4 text-lg font-bold uppercase text-slate-800 underline decoration-emerald-500 underline-offset-4">Submitted By</h4>
                <p className="text-lg font-bold text-slate-800">{studentName}</p>
                <p className="text-slate-600">ID: {studentId}</p>
              </div>
            </div>

            <div className="text-center">
              <p className="text-lg text-slate-600">Date of Submission</p>
              <p className="text-xl font-bold text-slate-800">{date}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
