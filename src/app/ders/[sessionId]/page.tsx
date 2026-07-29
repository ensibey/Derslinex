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
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${student.isAttended ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                    {student.isAttended ? "✅ Katıldı" : "❌ Katılmadı"}
                  </span>
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

// ─── İnteraktif Dijital Beyaz Tahta Modalı ─────────────────────────────────────
function WhiteboardModal({ onClose }: { onClose: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState("#FFFFFF");
  const [lineWidth, setLineWidth] = useState(4);
  const [isEraser, setIsEraser] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth * 0.85;
    canvas.height = window.innerHeight * 0.75;

    ctx.fillStyle = "#0D1B35";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

    ctx.strokeStyle = isEraser ? "#0D1B35" : color;
    ctx.lineWidth = isEraser ? lineWidth * 4 : lineWidth;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    ctx.lineTo(clientX - rect.left, clientY - rect.top);
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

    ctx.fillStyle = "#0D1B35";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const downloadCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `derslinex-tahta-${Date.now()}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0A1628] border border-indigo-500/30 rounded-3xl p-5 shadow-2xl space-y-4 max-w-5xl w-full">
        {/* Toolbar */}
        <div className="flex items-center justify-between flex-wrap gap-3 border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-white font-black text-base flex items-center gap-2">
              🎨 İnteraktif Dijital Beyaz Tahta
            </span>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={() => setIsEraser(false)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition border ${ !isEraser ? "bg-indigo-600 text-white border-indigo-400" : "bg-[#1E293B] text-slate-400 border-white/10" }`}
            >
              ✏️ Kalem
            </button>
            <button
              onClick={() => setIsEraser(true)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition border ${ isEraser ? "bg-amber-600 text-white border-amber-400" : "bg-[#1E293B] text-slate-400 border-white/10" }`}
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
                className="w-20 accent-indigo-500"
              />
            </div>

            <button
              onClick={clearCanvas}
              className="bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 text-xs font-black px-3 py-1.5 rounded-xl transition"
            >
              🗑️ Temizle
            </button>

            <button
              onClick={downloadCanvas}
              className="bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-xs font-black px-3 py-1.5 rounded-xl transition"
            >
              💾 Kaydet
            </button>

            <button
              onClick={onClose}
              className="bg-white/10 hover:bg-white/20 text-white font-black text-xs px-3 py-1.5 rounded-xl transition"
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
  const iframeRef = useRef<HTMLIFrameElement>(null);

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
        headers: { "Content-Type": "application/json" },
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
      alert("Ders bitirilirken bir hata oluştu.");
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
    <div className="min-h-screen bg-[#0A1628] flex flex-col">
      {/* Üst Bar */}
      <div className="flex items-center justify-between px-5 py-3 bg-[#0F1F3D] border-b border-white/10">
        <div className="flex items-center gap-3">
          <span className="text-white font-black text-lg">📚 Derslinex Canlı Ders</span>
          {status === "live" && (
            <span className="flex items-center gap-1.5 bg-red-600/20 border border-red-500/40 text-red-400 text-xs font-black px-2.5 py-1 rounded-full">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              CANLI
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          {status === "live" && (
            <>
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

      {/* Jitsi Meet / Video Odası iframe */}
      {status === "live" && roomUrl && (
        <iframe
          ref={iframeRef}
          src={roomUrl}
          className="flex-1 w-full border-0"
          allow="camera; microphone; fullscreen; speaker; display-capture; autoplay; clipboard-write"
          allowFullScreen
          title="Canlı Ders Odası"
        />
      )}

      {/* Dijital Beyaz Tahta Modalı */}
      {showWhiteboard && <WhiteboardModal onClose={() => setShowWhiteboard(false)} />}

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
