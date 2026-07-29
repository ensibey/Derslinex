"use client";

import React, { useRef, useState, useEffect } from "react";

export function ScratchpadModal({
  questionText,
  onClose,
}: {
  questionText: string;
  onClose: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState("#fbbf24"); // Amber yellow
  const [lineWidth, setLineWidth] = useState(3);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas dimensions
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = "touches" in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = "touches" in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = "touches" in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = "touches" in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="bg-[#0D1B35] border border-white/10 rounded-3xl shadow-2xl w-full max-w-3xl flex flex-col h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-[#1E293B]">
          <div className="flex items-center gap-3">
            <span className="text-xl">✏️</span>
            <h3 className="font-black text-white text-sm">İşlem Karalama & Çizim Tahtası</h3>
          </div>

          <div className="flex items-center gap-2">
            {/* Color Palette */}
            {["#fbbf24", "#38bdf8", "#4ade80", "#f43f5e", "#ffffff"].map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className={`w-6 h-6 rounded-full border-2 transition ${
                  color === c ? "border-white scale-110" : "border-transparent opacity-70"
                }`}
                style={{ backgroundColor: c }}
              />
            ))}

            <button
              onClick={clearCanvas}
              className="bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30 text-xs font-black px-3 py-1.5 rounded-xl transition ml-2"
            >
              🧹 Temizle
            </button>
            <button onClick={onClose} className="text-slate-400 hover:text-white font-black text-sm px-2">
              ✕
            </button>
          </div>
        </div>

        {/* Question Snippet */}
        <div className="p-3 bg-white/5 border-b border-white/5 text-xs font-bold text-slate-300 truncate">
          <strong className="text-indigo-400">Soru:</strong> {questionText}
        </div>

        {/* Canvas Area */}
        <div className="flex-1 relative bg-[#0A1628] cursor-crosshair">
          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            className="w-full h-full block"
          />
        </div>
      </div>
    </div>
  );
}
