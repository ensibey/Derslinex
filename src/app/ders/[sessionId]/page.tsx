"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";

interface Student {
  id: number;
  name: string;
  isAttended: boolean;
}

interface FeedbackEntry {
  rating: number;
  comment: string;
  homeworkGiven: boolean;
}

// ─── Ders Sonu Değerlendirme Modalı ──────────────────────────────────────────

function FeedbackModal({
  students,
  sessionId,
  teacherId,
  onDone,
}: {
  students: Student[];
  sessionId: number;
  teacherId: number;
  onDone: () => void;
}) {
  const [feedbacks, setFeedbacks] = useState<Record<number, FeedbackEntry>>(() =>
    Object.fromEntries(
      students.map((s) => [s.id, { rating: 5, comment: "", homeworkGiven: false }])
    )
  );
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const update = (studentId: number, field: keyof FeedbackEntry, value: unknown) => {
    setFeedbacks((prev) => ({
      ...prev,
      [studentId]: { ...prev[studentId], [field]: value },
    }));
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/sessions/${sessionId}/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teacherId,
          feedbacks: students.map((s) => ({
            studentId: s.id,
            ...feedbacks[s.id],
          })),
        }),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(onDone, 2000);
      }
    } finally {
      setSaving(false);
    }
  };

  if (saved) {
    return (
      <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-10 text-center shadow-2xl">
          <div className="text-5xl mb-4">✅</div>
          <h3 className="text-xl font-black text-[#1E3A8A]">Değerlendirmeler Kaydedildi!</h3>
          <p className="text-gray-500 mt-2">Yönlendiriliyorsunuz...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#1E3A8A] to-indigo-700 rounded-t-3xl p-6">
          <h2 className="text-xl font-black text-white">📝 Ders Sonu Değerlendirme</h2>
          <p className="text-indigo-200 text-sm mt-1">Her öğrenci için puan, yorum ve ödev bilgisini girin</p>
        </div>

        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
          {students.map((student) => (
            <div key={student.id} className="border border-[#EFECE6] rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-b from-[#1E3A8A] to-indigo-800 flex items-center justify-center text-white font-black">
                  {student.name.charAt(0)}
                </div>
                <div>
                  <p className="font-black text-gray-900">{student.name}</p>
                  <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${student.isAttended ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                      {student.isAttended ? "✅ Katıldı (%100 Katılım)" : "❌ Katılmadı / Devamsız"}
                    </span>
                    <span className="text-[10px] text-gray-500 font-bold bg-gray-100 px-2 py-0.5 rounded-full">
                      ⏱️ Katılım Zamanı: {student.isAttended ? "0. Dk - Ders Sonu (Full)" : "Katılmadı"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Rating */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Performans Puanı (1-5)</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => update(student.id, "rating", star)}
                      className={`text-2xl transition ${star <= feedbacks[student.id]?.rating ? "opacity-100 scale-110" : "opacity-30"}`}
                    >
                      ⭐
                    </button>
                  ))}
                </div>
              </div>

              {/* Comment */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Öğretmen Notu / Yorumu</label>
                <textarea
                  rows={2}
                  value={feedbacks[student.id]?.comment}
                  onChange={(e) => update(student.id, "comment", e.target.value)}
                  placeholder="Öğrencinin ders performansı, eksikleri..."
                  className="w-full bg-[#FAF8F5] border border-[#EFECE6] rounded-xl p-3 text-sm focus:outline-none focus:border-[#1E3A8A]"
                />
              </div>

              {/* Homework Checkbox */}
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={feedbacks[student.id]?.homeworkGiven}
                  onChange={(e) => update(student.id, "homeworkGiven", e.target.checked)}
                  className="w-4 h-4 text-[#1E3A8A] rounded accent-[#1E3A8A]"
                />
                <span className="text-sm font-bold text-gray-700">📚 Bu öğrenciye ödev verildi</span>
              </label>
            </div>
          ))}
        </div>

        <div className="p-6 border-t border-[#EFECE6] flex justify-end gap-3">
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="bg-[#1E3A8A] hover:bg-indigo-900 text-white font-black px-8 py-3.5 rounded-xl transition shadow-lg shadow-indigo-900/20 disabled:opacity-50"
          >
            {saving ? "Kaydediliyor..." : "💾 Değerlendirmeleri Kaydet ve Bitir"}
          </button>
        </div>
      </div>
    </div>
  );
}

interface WhiteboardModalProps {
  sessionId: string;
  isOwner: boolean;
  role: "teacher" | "student" | null;
  userName: string;
  onClose: () => void;
}

function WhiteboardModal({ sessionId, isOwner, role, userName, onClose }: WhiteboardModalProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState("#FFFFFF");
  const [lineWidth, setLineWidth] = useState(4);
  const [isEraser, setIsEraser] = useState(false);
  const [lastDrawer, setLastDrawer] = useState<string>("Sistem");
  const [syncStatus, setSyncStatus] = useState<"live" | "syncing">("live");

  const lastUpdateRef = useRef<number>(0);
  const isSelfDrawingRef = useRef<boolean>(false);

  // Broadcast current canvas state to server
  const broadcastCanvasState = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      const dataUrl = canvas.toDataURL();
      const res = await fetch(`/api/sessions/${sessionId}/whiteboard`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageData: dataUrl,
          isOpen: true,
          drawerName: userName,
        }),
      });
      const data = await res.json();
      if (data.success && data.updatedAt) {
        lastUpdateRef.current = data.updatedAt;
      }
    } catch (e) {
      console.error("Whiteboard broadcast error:", e);
    }
  }, [sessionId, userName]);

  // Broadcast whiteboard open state on mount
  useEffect(() => {
    fetch(`/api/sessions/${sessionId}/whiteboard`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isOpen: true, drawerName: userName }),
    }).catch(() => {});
  }, [sessionId, userName]);

  // Setup canvas resolution
  const setupCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const newWidth = Math.min(window.innerWidth * 0.9, 1100);
    const newHeight = Math.min(window.innerHeight * 0.7, 650);

    canvas.width = newWidth;
    canvas.height = newHeight;

    ctx.fillStyle = "#0D1B35";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  useEffect(() => {
    setupCanvas();
  }, [setupCanvas]);

  // Periodic polling listener for live canvas drawing sync
  useEffect(() => {
    let isCancelled = false;
    const interval = setInterval(async () => {
      if (isSelfDrawingRef.current) return;
      try {
        const res = await fetch(`/api/sessions/${sessionId}/whiteboard`);
        const data = await res.json();
        if (isCancelled) return;

        if (data.success && data.imageData) {
          if (data.updatedAt > lastUpdateRef.current) {
            lastUpdateRef.current = data.updatedAt;
            if (data.lastDrawer) setLastDrawer(data.lastDrawer);
            setSyncStatus("syncing");

            const canvas = canvasRef.current;
            if (!canvas) return;
            const ctx = canvas.getContext("2d");
            if (!ctx) return;

            const img = new Image();
            img.onload = () => {
              ctx.save();
              ctx.globalCompositeOperation = "source-over";
              ctx.clearRect(0, 0, canvas.width, canvas.height);
              ctx.fillStyle = "#0D1B35";
              ctx.fillRect(0, 0, canvas.width, canvas.height);
              ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
              ctx.restore();
              setSyncStatus("live");
            };
            img.src = data.imageData;
          }
        }
      } catch {
        // ignore network glitches
      }
    }, 1000);

    return () => {
      isCancelled = true;
      clearInterval(interval);
    };
  }, [sessionId]);

  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    isSelfDrawingRef.current = true;
    const { x, y } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { x, y } = getCoordinates(e);

    ctx.save();
    if (isEraser) {
      ctx.globalCompositeOperation = "destination-out";
      ctx.lineWidth = lineWidth * 4;
    } else {
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
    }
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.restore();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    isSelfDrawingRef.current = false;
    broadcastCanvasState();
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.save();
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = "#0D1B35";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
    broadcastCanvasState();
  };

  const downloadCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `derslinex-tahta-${Date.now()}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  const handleCloseModal = async () => {
    if (isOwner) {
      await fetch(`/api/sessions/${sessionId}/whiteboard`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isOpen: false }),
      }).catch(() => {});
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0A1628] border border-indigo-500/30 rounded-3xl p-5 shadow-2xl space-y-4 max-w-5xl w-full">
        {/* Toolbar */}
        <div className="flex items-center justify-between flex-wrap gap-3 border-b border-white/10 pb-3">
          <div className="flex items-center gap-3">
            <span className="text-white font-black text-base flex items-center gap-2">
              🎨 Canlı Dijital Beyaz Tahta
            </span>
            <span className="text-[10px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              {syncStatus === "syncing" ? "Senkronize Ediliyor..." : "CANLI YAYIN AKTİF"}
            </span>
            {lastDrawer && (
              <span className="text-[10px] text-indigo-300 font-bold hidden sm:inline-block">
                ✍️ Çizen: {lastDrawer}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={() => setIsEraser(false)}
              aria-label="Kalem aracını seç"
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition border focus-visible:ring-2 focus-visible:ring-indigo-400 ${ !isEraser ? "bg-indigo-600 text-white border-indigo-400" : "bg-[#1E293B] text-slate-300 border-white/10" }`}
            >
              ✏️ Kalem
            </button>
            <button
              onClick={() => setIsEraser(true)}
              aria-label="Silgi aracını seç"
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition border focus-visible:ring-2 focus-visible:ring-amber-400 ${ isEraser ? "bg-amber-600 text-white border-amber-400" : "bg-[#1E293B] text-slate-300 border-white/10" }`}
            >
              🧹 Silgi
            </button>

            {!isEraser && (
              <div className="flex items-center gap-1.5 bg-[#0D1B35] p-1.5 rounded-xl border border-white/10">
                {["#FFFFFF", "#EF4444", "#F59E0B", "#10B981", "#3B82F6", "#06B6D4", "#EC4899"].map((c) => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    style={{ backgroundColor: c }}
                    aria-label={`${c} rengini seç`}
                    className={`w-6 h-6 rounded-lg border-2 transition ${ color === c ? "scale-110 border-white" : "border-transparent opacity-80" }`}
                  />
                ))}
              </div>
            )}

            <div className="flex items-center gap-2 bg-[#0D1B35] px-3 py-1.5 rounded-xl border border-white/10 text-xs font-bold text-slate-300">
              <span>Kalınlık:</span>
              <input
                type="range"
                min="2"
                max="20"
                value={lineWidth}
                onChange={(e) => setLineWidth(Number(e.target.value))}
                aria-label="Çizgi kalınlığı"
                className="w-20 accent-indigo-500"
              />
            </div>

            <button
              onClick={clearCanvas}
              aria-label="Tüm tahtayı temizle"
              className="bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 text-xs font-black px-3 py-1.5 rounded-xl transition focus-visible:ring-2 focus-visible:ring-red-400"
            >
              🗑️ Temizle
            </button>

            <button
              onClick={downloadCanvas}
              aria-label="Tahtayı resim olarak indir"
              className="bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-xs font-black px-3 py-1.5 rounded-xl transition focus-visible:ring-2 focus-visible:ring-emerald-400"
            >
              💾 Kaydet
            </button>

            <button
              onClick={handleCloseModal}
              aria-label="Tahtayı kapat"
              className="bg-white/10 hover:bg-white/20 text-white font-black text-xs px-3 py-1.5 rounded-xl transition focus-visible:ring-2 focus-visible:ring-white"
            >
              ✕ Kapat
            </button>
          </div>
        </div>

        {/* Canvas Area */}
        <div className="flex items-center justify-center bg-[#0D1B35] rounded-2xl border border-white/10 overflow-hidden cursor-crosshair relative">
          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            className="w-full h-[65vh] touch-none"
          />
        </div>
      </div>
    </div>
  );
}

// ─── Ders Materyalleri Modalı ────────────────────────────────────────────────
interface ResourceItem {
  id: number;
  title: string;
  fileUrl: string;
  createdAt: string;
}

function ResourcesModal({
  sessionId,
  isOwner,
  onClose,
}: {
  sessionId: string;
  isOwner: boolean;
  onClose: () => void;
}) {
  const [resources, setResources] = useState<ResourceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState("");

  const fetchResources = useCallback(async () => {
    try {
      const res = await fetch(`/api/sessions/${sessionId}/resources`);
      const data = await res.json();
      if (data.success) {
        setResources(data.resources || []);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !fileUrl.trim()) return;
    setSubmitting(true);
    setMsg("");
    try {
      const res = await fetch(`/api/sessions/${sessionId}/resources`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim(), fileUrl: fileUrl.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setMsg("✅ Materyal eklendi!");
        setTitle("");
        setFileUrl("");
        fetchResources();
      } else {
        setMsg(data.error || "Ekleme başarısız.");
      }
    } catch {
      setMsg("Bağlantı hatası.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Bu materyali silmek istediğinize emin misiniz?")) return;
    try {
      const res = await fetch(`/api/sessions/${sessionId}/resources?resourceId=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        fetchResources();
      }
    } catch {
      // ignore
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#0F1F3D] border border-white/10 text-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[85vh]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#162A52]">
          <h3 className="text-lg font-black flex items-center gap-2">
            <span>📁</span> Ders Materyalleri & Kaynaklar
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white font-bold text-lg">✕</button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {isOwner && (
            <form onSubmit={handleAdd} className="bg-white/5 border border-white/10 p-4 rounded-2xl space-y-3">
              <h4 className="text-xs font-black text-emerald-400 uppercase tracking-wider">Yeni Materyal / PDF Ekle</h4>
              {msg && <p className="text-xs font-bold text-indigo-300">{msg}</p>}
              <input
                type="text"
                placeholder="Materyal Başlığı (örn: Üslü Sayılar Ödev PDF)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-gray-400 focus:outline-none focus:border-indigo-400"
              />
              <input
                type="url"
                placeholder="Dosya Bağlantısı (URL / Google Drive / PDF linki)"
                value={fileUrl}
                onChange={(e) => setFileUrl(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-gray-400 focus:outline-none focus:border-indigo-400"
              />
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs py-2.5 rounded-xl transition disabled:opacity-50"
              >
                {submitting ? "Yükleniyor..." : "➕ Materyali Derse Ekle"}
              </button>
            </form>
          )}

          <div>
            <h4 className="text-xs font-black text-gray-400 uppercase tracking-wider mb-3">Mevcut Materyaller ({resources.length})</h4>
            {loading ? (
              <p className="text-xs text-gray-400">Yükleniyor...</p>
            ) : resources.length === 0 ? (
              <div className="text-center py-8 bg-white/5 rounded-2xl border border-white/5">
                <p className="text-3xl mb-2">📄</p>
                <p className="text-xs text-gray-400">Henüz bu ders için eklenmiş bir materyal bulunmuyor.</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {resources.map((item) => (
                  <div key={item.id} className="flex items-center justify-between bg-white/5 hover:bg-white/10 border border-white/10 p-3.5 rounded-2xl transition">
                    <div className="min-w-0 flex-1 pr-3">
                      <p className="font-bold text-xs text-white truncate">{item.title}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">{new Date(item.createdAt).toLocaleDateString("tr-TR")}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <a
                        href={item.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs px-3 py-1.5 rounded-xl transition flex items-center gap-1"
                      >
                        <span>📥</span> İndir
                      </a>
                      {isOwner && (
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="bg-red-500/20 hover:bg-red-500/30 text-red-300 text-xs font-bold px-2.5 py-1.5 rounded-xl transition"
                        >
                          🗑
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Ana Canlı Ders Sayfası ───────────────────────────────────────────────────

export default function LiveSessionPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const router = useRouter();

  const [status, setStatus] = useState<"loading" | "joining" | "live" | "error" | "ended">("loading");
  const [errorMsg, setErrorMsg] = useState("");
  const [roomUrl, setRoomUrl] = useState("");
  const [isOwner, setIsOwner] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);
  const [role, setRole] = useState<"teacher" | "student" | null>(null);
  const [sessionTitle, setSessionTitle] = useState("Canlı Ders");
  const [students, setStudents] = useState<Student[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showWhiteboard, setShowWhiteboard] = useState(false);
  const [showResources, setShowResources] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [notesText, setNotesText] = useState("");
  const [networkQuality, setNetworkQuality] = useState<"good" | "fair" | "poor">("good");
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const handleNetworkCheck = () => {
      const conn = (navigator as any).connection;
      if (conn) {
        if (conn.rtt > 300 || conn.downlink < 1.5) setNetworkQuality("poor");
        else if (conn.rtt > 150) setNetworkQuality("fair");
        else setNetworkQuality("good");
      }
    };
    handleNetworkCheck();
    window.addEventListener("online", handleNetworkCheck);
    window.addEventListener("offline", handleNetworkCheck);
    return () => {
      window.removeEventListener("online", handleNetworkCheck);
      window.removeEventListener("offline", handleNetworkCheck);
    };
  }, []);

  useEffect(() => {
    if (sessionId) {
      const saved = localStorage.getItem(`derslinex_notes_${sessionId}`);
      if (saved) setNotesText(saved);
    }
  }, [sessionId]);

  const joinSession = useCallback(async () => {
    const rawUser  = localStorage.getItem("derslinex_user")  || sessionStorage.getItem("derslinex_user");
    const rawRole  = localStorage.getItem("derslinex_role")  || sessionStorage.getItem("derslinex_role");

    if (!rawUser || !rawRole) {
      setErrorMsg("Giriş yapmanız gerekiyor.");
      setStatus("error");
      return;
    }

    const user = JSON.parse(rawUser) as { id: number; name: string };
    const userRole = rawRole as "teacher" | "student";

    setUserId(user.id);
    setRole(userRole);
    setStatus("joining");

    try {
      const res = await fetch(`/api/sessions/${sessionId}/join`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": String(user.id),
          "x-user-role": userRole,
        },
        body: JSON.stringify({ userId: user.id, role: userRole, userName: user.name }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMsg(data.error || "Odaya bağlanılamadı.");
        setStatus("error");
        return;
      }

      const fullUrl = data.token ? `${data.roomUrl}?t=${data.token}` : data.roomUrl;
      setRoomUrl(fullUrl);
      setIsOwner(data.isOwner);
      setStatus("live");
    } catch {
      setErrorMsg("Sunucuya bağlanılamadı.");
      setStatus("error");
    }
  }, [sessionId]);

  useEffect(() => {
    joinSession();
  }, [joinSession]);

  // Auto sync whiteboard open/close state for students when teacher opens/closes it
  useEffect(() => {
    if (status !== "live" || !sessionId) return;
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/sessions/${sessionId}/whiteboard`);
        const data = await res.json();
        if (data.success) {
          if (data.isOpen && !showWhiteboard) {
            setShowWhiteboard(true);
          } else if (!data.isOpen && showWhiteboard && !isOwner) {
            setShowWhiteboard(false);
          }
        }
      } catch {}
    }, 1500);

    return () => clearInterval(interval);
  }, [sessionId, status, showWhiteboard, isOwner]);

  const handleEndSession = async () => {
    if (!userId) return;
    if (!confirm("Dersi bitirmek istediğinizden emin misiniz? Odadaki herkes çıkarılacak.")) return;

    setStatus("ended");

    try {
      const res = await fetch(`/api/sessions/${sessionId}/end`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teacherId: userId }),
      });
      const data = await res.json();
      if (data.success && data.students && data.students.length > 0) {
        setStudents(data.students);
        setShowFeedback(true);
      } else {
        router.push("/profil");
      }
    } catch {
      router.push("/profil");
    }
  };

  if (status === "loading" || status === "joining") {
    return (
      <div className="min-h-screen bg-[#0A1628] flex flex-col items-center justify-center text-white gap-4">
        <div className="w-12 h-12 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin" />
        <p className="text-lg font-bold text-indigo-300">
          {status === "loading" ? "Hazırlanıyor..." : "Odaya bağlanılıyor..."}
        </p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="min-h-screen bg-[#0A1628] flex flex-col items-center justify-center text-white gap-6 px-4">
        <div className="text-6xl">🚫</div>
        <h1 className="text-2xl font-black">Erişim Engellendi</h1>
        <p className="text-indigo-300 text-center max-w-sm">{errorMsg}</p>
        <button
          onClick={() => router.push("/profil")}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-8 py-3 rounded-xl transition"
        >
          Profile Dön
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-40 bg-[#0A1628] flex flex-col h-screen w-screen overflow-hidden">
      {/* Üst Bar */}
      <div className="flex items-center justify-between px-5 py-3 bg-[#0F1F3D] border-b border-white/10 shrink-0 h-16">
        <div className="flex items-center gap-3">
          <span className="text-white font-black text-lg">📚 Derslinex Canlı Ders</span>
          {status === "live" && (
            <>
              <span className="flex items-center gap-1.5 bg-red-600/20 border border-red-500/40 text-red-400 text-xs font-black px-2.5 py-1 rounded-full">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                CANLI
              </span>
              <span className={`text-[10px] font-black px-2.5 py-1 rounded-full border hidden sm:inline-flex ${
                networkQuality === "good" ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" :
                networkQuality === "fair" ? "bg-amber-500/20 text-amber-300 border-amber-500/30" :
                "bg-red-500/20 text-red-300 border-red-500/30 animate-pulse"
              }`}>
                {networkQuality === "good" ? "📶 Ağ: Mükemmel" : networkQuality === "fair" ? "📶 Ağ: Orta" : "⚠️ Ağ Yavaş"}
              </span>
            </>
          )}
        </div>
        <div className="flex items-center gap-3">
          {status === "live" && (
            <>
              <button
                onClick={() => setShowNotes(!showNotes)}
                className={`font-black text-xs px-4 py-2 rounded-xl transition flex items-center gap-1.5 shadow-lg ${
                  showNotes ? "bg-amber-500 text-white" : "bg-amber-600/20 hover:bg-amber-600/40 text-amber-300 border border-amber-500/30"
                }`}
              >
                📝 Ders Notlarım
              </button>
              <button
                onClick={() => setShowResources(true)}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs px-4 py-2 rounded-xl transition flex items-center gap-1.5 shadow-lg shadow-emerald-900/50"
              >
                📁 Ders Materyalleri
              </button>
              <button
                onClick={() => setShowWhiteboard(true)}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs px-4 py-2 rounded-xl transition flex items-center gap-1.5 shadow-lg shadow-indigo-900/50"
              >
                🎨 Dijital Beyaz Tahta
              </button>
            </>
          )}

          {isOwner && status === "live" && (
            <button
              onClick={handleEndSession}
              className="bg-red-600 hover:bg-red-500 text-white font-black text-sm px-5 py-2 rounded-xl transition flex items-center gap-2"
            >
              ⏹ Dersi Bitir & Değerlendir
            </button>
          )}
          <button
            onClick={() => router.push("/profil")}
            className="text-gray-400 hover:text-white text-sm font-bold transition"
          >
            ✕ Çık
          </button>
        </div>
      </div>

      {/* Main Video & Side Notes Split Layout - Full Height */}
      <div className="flex-1 w-full h-[calc(100vh-64px)] flex overflow-hidden relative bg-[#050C16]">
        {status === "live" && roomUrl ? (
          <iframe
            ref={iframeRef}
            src={roomUrl}
            className="flex-1 w-full h-full border-0 bg-black"
            allow="camera; microphone; fullscreen; speaker; display-capture; autoplay; clipboard-write"
            allowFullScreen
            title="Canlı Ders Odası"
          />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-indigo-300 gap-3">
            <div className="w-10 h-10 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin" />
            <p className="font-bold text-sm">Video odası oluşturuluyor...</p>
          </div>
        )}

        {/* Collapsible Live Study Notes Side Drawer */}
        {showNotes && (
          <div className="w-80 md:w-96 bg-[#0F1F3D] border-l border-white/10 flex flex-col h-full shadow-2xl z-20">
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-[#0A1628]">
              <h3 className="font-black text-white text-sm flex items-center gap-2">
                <span>📝</span> Canlı Ders Notlarım
              </h3>
              <button onClick={() => setShowNotes(false)} className="text-slate-400 hover:text-white text-xs font-bold">
                ✕
              </button>
            </div>

            <div className="flex-1 p-4 flex flex-col gap-3 overflow-hidden">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] text-slate-400 font-bold">
                  * Aldığınız notlar cihazınıza kaydedilir.
                </span>

                {/* Rich Formatting Toolbar */}
                <div className="flex items-center gap-1 bg-[#0A1628] p-1 rounded-xl border border-white/10 text-xs font-black">
                  <button
                    type="button"
                    onClick={() => {
                      const next = notesText + " **Kalın Metin** ";
                      setNotesText(next);
                      localStorage.setItem(`derslinex_notes_${sessionId}`, next);
                    }}
                    className="px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-white font-black"
                    title="Kalın Yazı"
                  >
                    B
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const next = notesText + " *İtalik Metin* ";
                      setNotesText(next);
                      localStorage.setItem(`derslinex_notes_${sessionId}`, next);
                    }}
                    className="px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-white italic font-bold"
                    title="İtalik Yazı"
                  >
                    I
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const next = notesText + "\n- Madde: ";
                      setNotesText(next);
                      localStorage.setItem(`derslinex_notes_${sessionId}`, next);
                    }}
                    className="px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-white font-bold"
                    title="Madde Başlığı"
                  >
                    •
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const next = notesText + "\n📌 ÖNEMLİ: ";
                      setNotesText(next);
                      localStorage.setItem(`derslinex_notes_${sessionId}`, next);
                    }}
                    className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold"
                    title="Önemli Etiketi"
                  >
                    📌
                  </button>
                </div>
              </div>

              <textarea
                value={notesText}
                onChange={(e) => {
                  setNotesText(e.target.value);
                  localStorage.setItem(`derslinex_notes_${sessionId}`, e.target.value);
                }}
                placeholder="Ders esnasında aldığınız önemli notlar, formüller ve ödevler..."
                className="flex-1 bg-[#0A1628] border border-white/10 rounded-xl p-3 text-xs font-semibold text-white focus:outline-none focus:border-amber-500 leading-relaxed resize-none"
              />

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    const blob = new Blob([notesText], { type: "text/plain;charset=utf-8" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `ders_notlari_${sessionId}.txt`;
                    a.click();
                  }}
                  className="flex-1 bg-amber-600 hover:bg-amber-500 text-white font-black py-2 rounded-xl text-xs transition flex items-center justify-center gap-1"
                >
                  💾 Notları İndir (.txt)
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Dijital Beyaz Tahta Modalı */}
      {showWhiteboard && (
        <WhiteboardModal
          sessionId={sessionId as string}
          isOwner={isOwner}
          role={role}
          userName={role === "teacher" ? "Öğretmen" : "Öğrenci"}
          onClose={() => setShowWhiteboard(false)}
        />
      )}

      {/* Ders Materyalleri Modalı */}
      {showResources && <ResourcesModal sessionId={sessionId} isOwner={isOwner} onClose={() => setShowResources(false)} />}

      {/* Ders bitti - direkt profile yönlendir */}
      {status === "ended" && !showFeedback && (
        <div className="flex-1 flex flex-col items-center justify-center text-white gap-6 bg-[#0A1628]">
          <div className="text-6xl">✅</div>
          <h2 className="text-2xl font-black">Ders Sona Erdi</h2>
          <p className="text-indigo-300 text-sm">Profile yönlendiriliyorsunuz...</p>
        </div>
      )}

      {/* Ders Sonu Değerlendirme Modalı */}
      {showFeedback && userId && (
        <FeedbackModal
          students={students}
          sessionId={parseInt(sessionId)}
          teacherId={userId}
          onDone={() => {
            setShowFeedback(false);
            router.push("/profil");
          }}
        />
      )}
    </div>
  );
}
