"use client";

import { useState, useRef, useEffect } from "react";
import { UploadCloud, Image as ImageIcon, Download, Settings, RefreshCw } from "lucide-react";

export default function PhotoCraft() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [processedUrl, setProcessedUrl] = useState<string | null>(null);
  const [processedSize, setProcessedSize] = useState<number>(0);
  
  const [targetWidth, setTargetWidth] = useState(300);
  const [targetHeight, setTargetHeight] = useState(300);
  const [maxKb, setMaxKb] = useState(100);
  const [isProcessing, setIsProcessing] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setImageSrc(event.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const processImage = () => {
    if (!imageSrc || !canvasRef.current) return;
    setIsProcessing(true);

    const img = new window.Image();
    img.src = imageSrc;
    img.onload = () => {
      const canvas = canvasRef.current!;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      canvas.width = targetWidth;
      canvas.height = targetHeight;

      // Fill white background in case of transparency
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, targetWidth, targetHeight);

      // Simple center crop logic
      const scale = Math.max(targetWidth / img.width, targetHeight / img.height);
      const x = (targetWidth / scale - img.width) / 2;
      const y = (targetHeight / scale - img.height) / 2;

      ctx.save();
      ctx.scale(scale, scale);
      ctx.drawImage(img, x, y);
      ctx.restore();

      // Compression loop to hit target KB
      let quality = 0.95;
      let dataUrl = canvas.toDataURL("image/jpeg", quality);
      let sizeKb = Math.round((dataUrl.length * (3 / 4)) / 1024);

      while (sizeKb > maxKb && quality > 0.1) {
        quality -= 0.05;
        dataUrl = canvas.toDataURL("image/jpeg", quality);
        sizeKb = Math.round((dataUrl.length * (3 / 4)) / 1024);
      }

      setProcessedUrl(dataUrl);
      setProcessedSize(sizeKb);
      setIsProcessing(false);
    };
  };

  useEffect(() => {
    if (imageSrc) processImage();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageSrc, targetWidth, targetHeight, maxKb]);

  const presetPassport = () => { setTargetWidth(300); setTargetHeight(300); setMaxKb(100); };
  const presetSignature = () => { setTargetWidth(300); setTargetHeight(80); setMaxKb(60); };

  return (
    <div className="flex h-full flex-col md:flex-row">
      {/* Controls Sidebar */}
      <div className="w-full border-r border-slate-200 bg-white p-6 md:w-80 dark:border-slate-800 dark:bg-slate-900 md:overflow-y-auto">
        <h2 className="mb-4 text-lg font-bold">Photo & Signature</h2>
        
        <div className="mb-6 space-y-3">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Upload Image</label>
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-6 transition hover:border-emerald-500 hover:bg-emerald-50 dark:border-slate-700 dark:bg-slate-950 dark:hover:border-emerald-500 dark:hover:bg-emerald-900/20"
          >
            <UploadCloud className="mb-2 h-8 w-8 text-slate-400" />
            <span className="text-sm text-slate-500">Click to upload or drag & drop</span>
            <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
          </div>
        </div>

        <div className="mb-6 space-y-4">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Presets</label>
          <div className="grid grid-cols-2 gap-2">
            <button onClick={presetPassport} className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800">
              Passport (300x300)
            </button>
            <button onClick={presetSignature} className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800">
              Signature (300x80)
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Custom Settings</label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="mb-1 block text-xs text-slate-500">Width (px)</span>
              <input type="number" value={targetWidth} onChange={(e) => setTargetWidth(Number(e.target.value))} className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-900" />
            </div>
            <div>
              <span className="mb-1 block text-xs text-slate-500">Height (px)</span>
              <input type="number" value={targetHeight} onChange={(e) => setTargetHeight(Number(e.target.value))} className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-900" />
            </div>
            <div className="col-span-2">
              <span className="mb-1 block text-xs text-slate-500">Max File Size (KB)</span>
              <input type="number" value={maxKb} onChange={(e) => setMaxKb(Number(e.target.value))} className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-900" />
            </div>
          </div>
        </div>
      </div>

      {/* Preview Stage */}
      <div className="flex flex-1 flex-col items-center justify-center bg-slate-50 p-6 dark:bg-slate-950">
        <canvas ref={canvasRef} className="hidden" />
        
        {processedUrl ? (
          <div className="flex flex-col items-center">
            <div className="relative mb-6 overflow-hidden rounded-xl bg-white p-2 shadow-sm dark:bg-slate-900">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={processedUrl} alt="Processed" style={{ width: targetWidth, height: targetHeight, objectFit: 'contain' }} className="border border-slate-100 dark:border-slate-800" />
            </div>
            <div className="mb-6 flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                <Settings className="h-4 w-4" />
                {targetWidth}x{targetHeight} px
              </div>
              <div className={`flex items-center gap-1.5 rounded-full px-3 py-1 font-medium ${processedSize <= maxKb ? 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                {processedSize} KB / {maxKb} KB
              </div>
            </div>
            <a
              href={processedUrl}
              download="processed_image.jpg"
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
            >
              <Download className="h-4 w-4" />
              Download Image
            </a>
          </div>
        ) : (
          <div className="flex flex-col items-center text-slate-400 dark:text-slate-600">
            <ImageIcon className="mb-4 h-16 w-16 opacity-20" />
            <p>Upload an image to see live preview</p>
          </div>
        )}
      </div>
    </div>
  );
}
