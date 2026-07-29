"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";

interface Student {
  id: number;
  name: string;
  phone: string;
  email: string;
  status: string;
  isBanned: boolean;
  createdAt: string;
}

interface Teacher {
  id: number;
  name: string;
  phone: string;
  email: string;
  branch: string;
  egitim: string | null;
  ozgecmis: string | null;
  status: string;
  isBanned: boolean;
  points?: number;
  createdAt: string;
}

interface Feedback {
  id: number;
  studentName: string;
  studentEmail: string | null;
  teacherId: number;
  teacherName: string;
  content: string;
  rating: number;
  createdAt: string;
}

interface Lesson {
  id: number;
  title: string;
  price: number;
  format: string;
  description: string | null;
  teacherId: number;
  teacherName: string;
  createdAt: string;
}

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  content: string;
  category: string;
  authorId: number;
  authorName: string;
  createdAt: string;
}

// ─── Brand Logo Header Component ──────────────────────────────────────────────
function BrandLogoHeader({ subBadge = "ADMIN PANELİ" }: { subBadge?: string }) {
  const [imgError, setImgError] = useState(false);

  return (
    <Link href="/" className="flex items-center gap-3 group">
      <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-600 p-0.5 shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform flex-shrink-0">
        <div className="w-full h-full bg-[#0D1B35] rounded-[10px] flex items-center justify-center overflow-hidden relative">
          {!imgError ? (
            <img
              src="/logo.png?v=9"
              alt="Derslinex Logo"
              className="w-full h-full object-contain p-1"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center font-black text-white text-xs tracking-tighter">
              DX
            </div>
          )}
        </div>
      </div>
      <div className="min-w-0">
        <span className="text-white font-black text-base tracking-tight block leading-tight group-hover:text-indigo-300 transition-colors">
          Derslinex
        </span>
        <span className="text-[9px] font-black uppercase tracking-widest text-indigo-400 block leading-tight mt-0.5">
          {subBadge}
        </span>
      </div>
    </Link>
  );
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<"teachers" | "students" | "lessons" | "blogs" | "feedbacks" | "sessions" | "tasks" | "questions">("teachers");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [liveSessions, setLiveSessions] = useState<any[]>([]);
  const [adminTasks, setAdminTasks] = useState<any[]>([]);
  const [questionsList, setQuestionsList] = useState<any[]>([]);
  const [editingQuestionId, setEditingQuestionId] = useState<number | null>(null);
  const [editQuestionForm, setEditQuestionForm] = useState<any>({});

  // Task Create Form
  const [taskForm, setTaskForm] = useState({
    teacherId: "",
    title: "",
    description: "",
    points: 50,
  });
  const [taskCreating, setTaskCreating] = useState(false);

  // Session Create Form
  const [sessionForm, setSessionForm] = useState({
    title: "",
    description: "",
    teacherId: "",
    studentIds: [] as number[],
    startTime: "",
    durationMinutes: 60,
    capacity: 1,
    recordSession: false,
  });
  const [sessionCreating, setSessionCreating] = useState(false);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [tRes, sRes, fRes, lRes, bRes, sessRes, taskRes, qRes] = await Promise.all([
        fetch("/api/profil/ogretmen"),
        fetch("/api/profil/ogrenci"),
        fetch("/api/gorus"),
        fetch("/api/admin/lessons"),
        fetch("/api/admin/blogs"),
        fetch("/api/admin/sessions"),
        fetch("/api/admin/tasks"),
        fetch("/api/admin/questions"),
      ]);

      const tData = await tRes.json();
      const sData = await sRes.json();
      const fData = await fRes.json();
      const lData = await lRes.json();
      const bData = await bRes.json();
      const sessData = await sessRes.json();
      const taskData = await taskRes.json();
      const qData = await qRes.json();

      if (tData.success) setTeachers(tData.teachers || []);
      if (sData.success) setStudents(sData.students || []);
      if (fData.success) setFeedbacks(fData.feedbacks || []);
      if (lData.success) setLessons(lData.lessons || []);
      if (bData.success) setBlogs(bData.posts || []);
      if (sessData.success) setLiveSessions(sessData.sessions || []);
      if (taskData.success) setAdminTasks(taskData.tasks || []);
      if (qData.success) setQuestionsList(qData.questions || []);
    } catch (e) {
      console.error("Data fetch error", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const showMsg = (text: string, type: "success" | "error") => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 5000);
  };

  const handleUpdateStatus = async (id: number, type: "teacher" | "student", currentStatus: string) => {
    try {
      const nextStatus = currentStatus === "İletişime Geçildi" ? "Beklemede" : "İletişime Geçildi";
      const res = await fetch("/api/admin/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, type, action: "status", value: nextStatus }),
      });
      const data = await res.json();
      if (data.success) {
        showMsg("Durum güncellendi.", "success");
        fetchData();
      } else {
        showMsg(data.error || "İşlem başarısız.", "error");
      }
    } catch {
      showMsg("Bağlantı hatası", "error");
    }
  };

  const handleBanToggle = async (id: number, type: "teacher" | "student", isBanned: boolean) => {
    try {
      const res = await fetch("/api/admin/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, type, action: "ban", value: !isBanned }),
      });
      const data = await res.json();
      if (data.success) {
        showMsg(isBanned ? "Kullanıcı engeli kaldırıldı." : "Kullanıcı engellendi.", "success");
        fetchData();
      } else {
        showMsg(data.error || "İşlem başarısız.", "error");
      }
    } catch {
      showMsg("Bağlantı hatası", "error");
    }
  };

  const handleDeleteUser = async (id: number, type: "teacher" | "student") => {
    if (!confirm("Bu kullanıcıyı silmek istediğinize emin misiniz? Bu işlem geri alınamaz!")) return;
    try {
      const res = await fetch(`/api/admin/users?id=${id}&type=${type}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        showMsg("Kullanıcı silindi.", "success");
        fetchData();
      } else {
        showMsg(data.error || "İşlem başarısız.", "error");
      }
    } catch {
      showMsg("Bağlantı hatası", "error");
    }
  };

  const handleDeleteLesson = async (id: number) => {
    if (!confirm("Bu ders ilanını silmek istediğinize emin misiniz?")) return;
    try {
      const res = await fetch(`/api/admin/lessons?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        showMsg("Ders ilanı silindi.", "success");
        fetchData();
      } else {
        showMsg(data.error || "İşlem başarısız.", "error");
      }
    } catch {
      showMsg("Bağlantı hatası", "error");
    }
  };

  const handleDeleteBlog = async (id: number) => {
    if (!confirm("Bu blog makalesini silmek istediğinize emin misiniz?")) return;
    try {
      const res = await fetch(`/api/admin/blogs?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        showMsg("Blog makalesi silindi.", "success");
        fetchData();
      } else {
        showMsg(data.error || "İşlem başarısız.", "error");
      }
    } catch {
      showMsg("Bağlantı hatası", "error");
    }
  };

  const handleDeleteFeedback = async (id: number) => {
    if (!confirm("Bu görüş kaydını silmek istediğinize emin misiniz?")) return;
    try {
      const res = await fetch(`/api/gorus?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        showMsg(data.message || "Görüş silindi.", "success");
        fetchData();
      } else {
        showMsg(data.error || "İşlem başarısız.", "error");
      }
    } catch {
      showMsg("Bağlantı hatası", "error");
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0A1628] font-sans text-slate-100">
      {/* Mobile Overlay */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/60 z-30 md:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Left Sidebar (SincApp Dark Layout) */}
      <aside className={`fixed top-0 left-0 h-full w-[240px] bg-[#0D1B35] border-r border-white/5 flex flex-col z-40 transform transition-transform duration-300 ${ sidebarOpen ? "translate-x-0" : "-translate-x-full" } md:translate-x-0 md:static md:flex`}>
        <div className="px-5 py-5 border-b border-white/5 flex items-center justify-between">
          <BrandLogoHeader subBadge="ADMIN PANELİ" />
          <button className="md:hidden text-slate-400 hover:text-white" onClick={() => setSidebarOpen(false)}>✕</button>
        </div>

        {/* Admin Profile Info */}
        <div className="px-4 py-4 border-b border-white/5 bg-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-0.5 shadow-lg shadow-indigo-500/20 flex-shrink-0">
              <div className="w-full h-full bg-[#0D1B35] rounded-[10px] flex items-center justify-center text-white font-black text-xs">
                ⚡
              </div>
            </div>
            <div className="min-w-0">
              <p className="text-white font-black text-xs truncate">Sistem Yöneticisi</p>
              <p className="text-emerald-400 text-[10px] font-bold flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Süper Admin (Canlı)
              </p>
            </div>
          </div>
        </div>

        {/* Sidebar Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
          {[
            { key: "teachers", label: "Öğretmenler", count: teachers.length, icon: "👨‍🏫" },
            { key: "students", label: "Öğrenciler", count: students.length, icon: "🎓" },
            { key: "questions", label: "Soru Havuzu", count: questionsList.length, icon: "📝" },
            { key: "tasks", label: "Görev & Puan", count: adminTasks.length, icon: "🏆" },
            { key: "lessons", label: "Özel Dersler", count: lessons.length, icon: "📚" },
            { key: "blogs", label: "Blog Yazıları", count: blogs.length, icon: "✍️" },
            { key: "sessions", label: "Canlı Dersler", count: liveSessions.length, icon: "🎥" },
            { key: "feedbacks", label: "Görüşler", count: feedbacks.length, icon: "💬" },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => { setActiveTab(t.key as any); setSidebarOpen(false); }}
              className={`relative w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-left transition-all text-xs font-bold overflow-hidden ${
                activeTab === t.key
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-900/50 border border-indigo-400/30 font-black"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {activeTab === t.key && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-indigo-300 rounded-r-full shadow-[0_0_10px_rgba(165,180,252,0.9)]" />
              )}
              <span className="text-base">{t.icon}</span>
              <span className="flex-1 truncate">{t.label}</span>
              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                activeTab === t.key ? "bg-white/20 text-white" : "bg-white/5 text-slate-400"
              }`}>{t.count}</span>
            </button>
          ))}
        </nav>

        <div className="px-3 pb-4">
          <Link href="/" className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-slate-400 hover:text-white hover:bg-white/5 transition-all text-xs font-bold">
            <span className="text-base">🌐</span> Kamusal Siteye Dön
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="bg-[#0D1B35]/80 backdrop-blur border-b border-white/5 px-4 md:px-6 py-3 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button className="md:hidden text-slate-400 hover:text-white p-1" onClick={() => setSidebarOpen(true)}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
            <h1 className="text-white font-black text-sm uppercase tracking-wider flex items-center gap-2">
              <span>⚙️</span> Denetim & Yönetim Merkezi
            </h1>
          </div>
          <div className="flex items-center gap-3">
            {message && (
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold ${ message.type === "success" ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-red-500/20 text-red-400 border border-red-500/30" }`}>
                <span>{message.text}</span>
                <button onClick={() => setMessage(null)} className="opacity-60 hover:opacity-100">✕</button>
              </div>
            )}
            <button
              onClick={fetchData}
              disabled={loading}
              className="bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 font-bold px-3.5 py-1.5 rounded-xl transition text-xs flex items-center gap-1.5"
            >
              <span>🔄</span> {loading ? "Yükleniyor..." : "Yenile"}
            </button>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6 overflow-y-auto space-y-6">
          {/* Glassmorphism Stat Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {[
              { label: "Öğretmen", val: teachers.length, icon: "👨‍🏫", color: "from-blue-500/20 to-indigo-500/20 border-blue-500/30" },
              { label: "Öğrenci", val: students.length, icon: "🎓", color: "from-purple-500/20 to-pink-500/20 border-purple-500/30" },
              { label: "Soru Havuzu", val: questionsList.length, icon: "📝", color: "from-amber-500/20 to-orange-500/20 border-amber-500/30" },
              { label: "Görevler", val: adminTasks.length, icon: "🏆", color: "from-emerald-500/20 to-teal-500/20 border-emerald-500/30" },
              { label: "İlanlar", val: lessons.length, icon: "📚", color: "from-cyan-500/20 to-blue-500/20 border-cyan-500/30" },
              { label: "Bloglar", val: blogs.length, icon: "✍️", color: "from-rose-500/20 to-red-500/20 border-rose-500/30" },
              { label: "Canlı Ders", val: liveSessions.length, icon: "🎥", color: "from-indigo-500/20 to-violet-500/20 border-indigo-500/30" },
              { label: "Görüşler", val: feedbacks.length, icon: "💬", color: "from-sky-500/20 to-indigo-500/20 border-sky-500/30" },
            ].map((s) => (
              <div key={s.label} className={`bg-gradient-to-br ${s.color} border rounded-2xl p-3 backdrop-blur-md hover:scale-105 transition-transform duration-200`}>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">{s.label}</span>
                <span className="text-lg font-black text-white mt-1 flex items-center justify-between">
                  <span>{s.val}</span>
                  <span className="text-sm opacity-80">{s.icon}</span>
                </span>
              </div>
            ))}
          </div>

          {/* Main Content Box */}
          <div className="bg-[#1E293B] rounded-3xl border border-white/5 overflow-hidden shadow-2xl">

            {/* TEACHERS TAB */}
            {activeTab === "teachers" && (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-[#0D1B35] border-b border-white/10 text-slate-400 font-black uppercase text-[11px]">
                      <th className="p-4 sm:p-5">Adı Soyadı</th>
                      <th className="p-4 sm:p-5">Branş / Puan</th>
                      <th className="p-4 sm:p-5">İletişim</th>
                      <th className="p-4 sm:p-5">Eğitim / Hakkında</th>
                      <th className="p-4 sm:p-5">Durum / Ban</th>
                      <th className="p-4 sm:p-5 text-right">İşlemler</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-semibold text-slate-300">
                    {teachers.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-10 text-center text-slate-500 font-semibold">
                          Henüz kayıtlı öğretmen bulunmuyor.
                        </td>
                      </tr>
                    ) : (
                      teachers.map((t) => (
                        <tr key={t.id} className={`hover:bg-white/5 transition-colors ${t.isBanned ? "bg-red-500/10" : ""}`}>
                          <td className="p-4 sm:p-5 font-black text-white">
                            <div>{t.name}</div>
                            <span className="text-[10px] text-slate-500 font-semibold block mt-0.5">
                              Kayıt: {new Date(t.createdAt).toLocaleDateString("tr-TR")}
                            </span>
                          </td>
                          <td className="p-4 sm:p-5 space-y-1">
                            <span className="bg-indigo-500/20 text-indigo-300 text-xs px-2.5 py-1 rounded-full border border-indigo-500/30 font-bold block w-fit">
                              {t.branch}
                            </span>
                            <span className="text-xs font-black text-purple-400 block">
                              ⭐ {t.points || 0} Puan
                            </span>
                          </td>
                          <td className="p-4 sm:p-5 space-y-0.5 text-xs text-slate-400">
                            <div>📞 {t.phone}</div>
                            <div>✉️ {t.email}</div>
                          </td>
                          <td className="p-4 sm:p-5 max-w-xs text-xs space-y-1">
                            {t.egitim && <div><span className="text-slate-500 font-bold block text-[10px] uppercase">Eğitim:</span>{t.egitim}</div>}
                            {t.ozgecmis && <div className="line-clamp-2 text-slate-400"><span className="text-slate-500 font-bold block text-[10px] uppercase">Özgeçmiş:</span>{t.ozgecmis}</div>}
                            {!t.egitim && !t.ozgecmis && <span className="text-slate-600 italic">Profil Bilgisi Girilmemiş</span>}
                          </td>
                          <td className="p-4 sm:p-5 space-y-1.5">
                            <div>
                              <span className={`inline-block text-[10px] px-2.5 py-0.5 rounded-full font-bold border ${ t.status === "İletişime Geçildi" ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" : "bg-amber-500/20 text-amber-400 border-amber-500/30" }`}>
                                {t.status === "İletişime Geçildi" ? "Yayında / Onaylı" : "Onay Bekliyor"}
                              </span>
                            </div>
                            {t.isBanned && (
                              <div>
                                <span className="inline-block text-[10px] bg-red-500/20 text-red-400 border border-red-500/30 px-2.5 py-0.5 rounded-full font-bold">
                                  ⛔ Yasaklı
                                </span>
                              </div>
                            )}
                          </td>
                          <td className="p-4 sm:p-5 text-right">
                            <div className="flex items-center justify-end gap-2 flex-wrap">
                              {t.status === "İletişime Geçildi" && (
                                <a
                                  href={`/ogretmenler/${t.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs px-3 py-1.5 rounded-xl border font-black bg-white/5 hover:bg-white/10 text-indigo-300 border-white/10 transition"
                                >
                                  🔍 Profil
                                </a>
                              )}
                              <button
                                onClick={() => handleUpdateStatus(t.id, "teacher", t.status)}
                                className={`text-xs px-3 py-1.5 rounded-xl border font-black transition ${ t.status === "İletişime Geçildi" ? "bg-amber-500/20 text-amber-400 border-amber-500/30 hover:bg-amber-500/30" : "bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-500" }`}
                              >
                                {t.status === "İletişime Geçildi" ? "Beklemeye Al" : "Onayla"}
                              </button>
                              <button
                                onClick={() => handleBanToggle(t.id, "teacher", t.isBanned)}
                                className={`text-xs px-3 py-1.5 rounded-xl border font-black transition ${ t.isBanned ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" : "bg-red-500/20 text-red-400 border-red-500/30" }`}
                              >
                                {t.isBanned ? "Engeli Kaldır" : "Engelle"}
                              </button>
                              <button
                                onClick={() => handleDeleteUser(t.id, "teacher")}
                                className="text-xs px-3 py-1.5 rounded-xl font-black bg-red-600/80 hover:bg-red-600 text-white transition"
                              >
                                Sil
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* STUDENTS TAB */}
            {activeTab === "students" && (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-[#0D1B35] border-b border-white/10 text-slate-400 font-black uppercase text-[11px]">
                      <th className="p-4 sm:p-5">Adı Soyadı</th>
                      <th className="p-4 sm:p-5">İletişim</th>
                      <th className="p-4 sm:p-5">Durum / Ban</th>
                      <th className="p-4 sm:p-5 text-right">İşlemler</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-semibold text-slate-300">
                    {students.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="p-10 text-center text-slate-500">
                          Henüz kayıtlı öğrenci bulunmuyor.
                        </td>
                      </tr>
                    ) : (
                      students.map((s) => (
                        <tr key={s.id} className={`hover:bg-white/5 transition-colors ${s.isBanned ? "bg-red-500/10" : ""}`}>
                          <td className="p-4 sm:p-5 font-black text-white">
                            <div>{s.name}</div>
                            <span className="text-[10px] text-slate-500 font-semibold block mt-0.5">
                              Kayıt: {new Date(s.createdAt).toLocaleDateString("tr-TR")}
                            </span>
                          </td>
                          <td className="p-4 sm:p-5 space-y-0.5 text-xs text-slate-400">
                            <div>📞 {s.phone}</div>
                            <div>✉️ {s.email}</div>
                          </td>
                          <td className="p-4 sm:p-5 space-y-1.5">
                            <div>
                              <span className={`inline-block text-[10px] px-2.5 py-0.5 rounded-full font-bold border ${ s.status === "İletişime Geçildi" ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" : "bg-amber-500/20 text-amber-400 border-amber-500/30" }`}>
                                {s.status}
                              </span>
                            </div>
                            {s.isBanned && (
                              <div>
                                <span className="inline-block text-[10px] bg-red-500/20 text-red-400 border border-red-500/30 px-2.5 py-0.5 rounded-full font-bold">
                                  ⛔ Yasaklı
                                </span>
                              </div>
                            )}
                          </td>
                          <td className="p-4 sm:p-5 text-right">
                            <div className="flex items-center justify-end gap-2 flex-wrap">
                              <button
                                onClick={() => handleUpdateStatus(s.id, "student", s.status)}
                                className={`text-xs px-3 py-1.5 rounded-xl border font-black transition ${ s.status === "İletişime Geçildi" ? "bg-white/5 hover:bg-white/10 text-slate-300 border-white/10" : "bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-500" }`}
                              >
                                {s.status === "İletişime Geçildi" ? "Beklemeye Al" : "İletişime Geçildi İşaretle"}
                              </button>
                              <button
                                onClick={() => handleBanToggle(s.id, "student", s.isBanned)}
                                className={`text-xs px-3 py-1.5 rounded-xl border font-black transition ${ s.isBanned ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" : "bg-red-500/20 text-red-400 border-red-500/30" }`}
                              >
                                {s.isBanned ? "Engeli Kaldır" : "Engelle"}
                              </button>
                              <button
                                onClick={() => handleDeleteUser(s.id, "student")}
                                className="text-xs px-3 py-1.5 rounded-xl font-black bg-red-600/80 hover:bg-red-600 text-white transition"
                              >
                                Sil
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* QUESTIONS TAB */}
            {activeTab === "questions" && (
              <div className="p-6 space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
                  <div>
                    <h3 className="text-lg font-black text-white">📝 Öğretmen Soru Havuzu & İnceleme ({questionsList.length})</h3>
                    <p className="text-xs text-slate-400 font-semibold mt-0.5">Öğretmenler tarafından yazılan soruları inceleyin, onaylayarak öğretmene +20 puan tanımlayın.</p>
                  </div>
                </div>

                {questionsList.length === 0 ? (
                  <p className="text-slate-500 font-semibold text-sm py-12 text-center">Henüz soru havuzuna soru eklenmedi.</p>
                ) : (
                  <div className="space-y-6">
                    {questionsList.map((q: any) => (
                      <div key={q.id} className="bg-[#0D1B35] border border-white/10 rounded-2xl p-6 space-y-4 shadow-xl">
                        {/* Header */}
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/5 pb-3">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`text-xs font-black px-2.5 py-0.5 rounded-full ${ q.status === "APPROVED" ? "bg-emerald-500/20 text-emerald-400" : q.status === "REJECTED" ? "bg-red-500/20 text-red-400" : "bg-amber-500/20 text-amber-400 animate-pulse" }`}>
                              {q.status === "APPROVED" ? "✅ Onaylandı (+ " + q.points + " Puan verildi)" : q.status === "REJECTED" ? "❌ Reddedildi" : "⏳ İnceleme Bekliyor"}
                            </span>
                            <span className="text-xs font-bold bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full">📚 {q.subject}</span>
                            <span className="text-xs font-bold bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full">🎯 {q.examType}</span>
                            {q.topic && <span className="text-xs font-bold bg-white/5 text-slate-300 px-2 py-0.5 rounded-full">🏷️ {q.topic}</span>}
                            <span className="text-xs font-black bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full">⚡ {q.difficulty}</span>
                          </div>
                          <p className="text-xs font-bold text-slate-400">
                            👨‍🏫 Yazar: <span className="text-white font-black">{q.teacher?.name} ({q.teacher?.branch})</span>
                          </p>
                        </div>

                        {/* Edit Form or Read View */}
                        {editingQuestionId === q.id ? (
                          <div className="bg-[#1E293B] border border-indigo-500/40 rounded-2xl p-5 space-y-4">
                            <h5 className="font-black text-indigo-400 text-xs uppercase tracking-wider">✏️ Soru Düzenleme & Sınıflandırma Formu</h5>
                            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                              <div>
                                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-wider mb-1">Ders / Branş</label>
                                <input type="text" value={editQuestionForm.subject} onChange={(e) => setEditQuestionForm({ ...editQuestionForm, subject: e.target.value })} className="w-full bg-[#0D1B35] border border-white/10 text-white px-3 py-2 rounded-xl text-xs font-bold focus:outline-none" />
                              </div>
                              <div>
                                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-wider mb-1">Sınav Türü</label>
                                <input type="text" value={editQuestionForm.examType} onChange={(e) => setEditQuestionForm({ ...editQuestionForm, examType: e.target.value })} className="w-full bg-[#0D1B35] border border-white/10 text-white px-3 py-2 rounded-xl text-xs font-bold focus:outline-none" />
                              </div>
                              <div>
                                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-wider mb-1">Konu Adı</label>
                                <input type="text" value={editQuestionForm.topic} onChange={(e) => setEditQuestionForm({ ...editQuestionForm, topic: e.target.value })} className="w-full bg-[#0D1B35] border border-white/10 text-white px-3 py-2 rounded-xl text-xs font-bold focus:outline-none" />
                              </div>
                              <div>
                                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-wider mb-1">Zorluk Derecesi</label>
                                <select value={editQuestionForm.difficulty} onChange={(e) => setEditQuestionForm({ ...editQuestionForm, difficulty: e.target.value })} className="w-full bg-[#0D1B35] border border-white/10 text-white px-3 py-2 rounded-xl text-xs font-bold focus:outline-none">
                                  <option value="Kolay">Kolay</option>
                                  <option value="Orta">Orta</option>
                                  <option value="Zor">Zor</option>
                                  <option value="ÖSYM Tipi">ÖSYM Tipi</option>
                                </select>
                              </div>
                            </div>
                            <div>
                              <label className="block text-[11px] font-black text-slate-400 uppercase tracking-wider mb-1">Soru Metni</label>
                              <textarea rows={3} value={editQuestionForm.questionText} onChange={(e) => setEditQuestionForm({ ...editQuestionForm, questionText: e.target.value })} className="w-full bg-[#0D1B35] border border-white/10 text-white px-3 py-2 rounded-xl text-xs font-semibold focus:outline-none" />
                            </div>
                            <div className="grid sm:grid-cols-2 gap-2">
                              {["A", "B", "C", "D", "E"].map((opt) => (
                                <div key={opt}>
                                  <label className="block text-[10px] font-bold text-slate-500">Şık {opt}</label>
                                  <input type="text" value={editQuestionForm[`option${opt}`]} onChange={(e) => setEditQuestionForm({ ...editQuestionForm, [`option${opt}`]: e.target.value })} className="w-full bg-[#0D1B35] border border-white/10 text-white px-3 py-1.5 rounded-lg text-xs font-semibold focus:outline-none" />
                                </div>
                              ))}
                            </div>
                            <div className="grid sm:grid-cols-2 gap-3 pt-2">
                              <div>
                                <label className="block text-[11px] font-black text-emerald-400 uppercase tracking-wider mb-1">Doğru Şık</label>
                                <select value={editQuestionForm.correctOption} onChange={(e) => setEditQuestionForm({ ...editQuestionForm, correctOption: e.target.value })} className="w-full bg-[#0D1B35] border border-emerald-500/40 text-emerald-300 font-bold px-3 py-2 rounded-xl text-xs focus:outline-none">
                                  <option value="A">A Şıkkı</option>
                                  <option value="B">B Şıkkı</option>
                                  <option value="C">C Şıkkı</option>
                                  <option value="D">D Şıkkı</option>
                                  <option value="E">E Şıkkı</option>
                                </select>
                              </div>
                              <div>
                                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-wider mb-1">Detaylı Çözüm</label>
                                <input type="text" value={editQuestionForm.solutionText} onChange={(e) => setEditQuestionForm({ ...editQuestionForm, solutionText: e.target.value })} className="w-full bg-[#0D1B35] border border-white/10 text-white px-3 py-2 rounded-xl text-xs font-semibold focus:outline-none" />
                              </div>
                            </div>
                            <div className="flex justify-end gap-2 pt-2 border-t border-white/10">
                              <button type="button" onClick={() => setEditingQuestionId(null)} className="bg-white/5 hover:bg-white/10 text-slate-300 font-bold text-xs px-4 py-2 rounded-xl transition">Vazgeç</button>
                              <button type="button" onClick={async () => { try { const res = await fetch("/api/admin/questions", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ questionId: q.id, ...editQuestionForm }) }); const data = await res.json(); if (data.success) { showMsg("✅ Soru detayları ve sınıflandırması güncellendi!", "success"); setEditingQuestionId(null); fetchData(); } else { showMsg(data.error || "Güncellenemedi", "error"); } } catch { showMsg("Bağlantı hatası", "error"); } }} className="bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs px-5 py-2 rounded-xl transition">💾 Kaydet & Güncelle</button>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <div className="font-bold text-white text-sm whitespace-pre-wrap leading-relaxed bg-[#1E293B] p-4 rounded-xl border border-white/5">
                              {q.questionText}
                            </div>
                            {q.imageUrl && (
                              <div className="max-w-md my-2">
                                <img src={q.imageUrl} alt="Soru Görseli" className="rounded-xl border border-white/10 max-h-60 object-contain" />
                              </div>
                            )}
                            <div className="grid sm:grid-cols-2 gap-2 text-xs font-semibold">
                              {["A", "B", "C", "D", "E"].map((opt) => {
                                const val = q[`option${opt}`];
                                if (!val && opt !== "A" && opt !== "B") return null;
                                const isCorrect = q.correctOption === opt;
                                return (
                                  <div key={opt} className={`p-2.5 rounded-xl border flex items-center gap-2 ${ isCorrect ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300 font-black" : "bg-white/5 border-white/5 text-slate-400" }`}>
                                    <span className={`w-6 h-6 rounded-lg flex items-center justify-center font-black text-xs ${ isCorrect ? "bg-emerald-500 text-white" : "bg-white/10 text-slate-300" }`}>{opt}</span>
                                    <span>{val}</span>
                                    {isCorrect && <span className="ml-auto text-emerald-400 font-black">✓ Doğru Şık</span>}
                                  </div>
                                );
                              })}
                            </div>
                            {q.solutionText && (
                              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 text-xs text-amber-300">
                                <p className="font-black mb-1">💡 Detaylı Çözüm:</p>
                                <p className="font-semibold whitespace-pre-wrap">{q.solutionText}</p>
                              </div>
                            )}
                            {q.rejectionReason && (
                              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-xs text-red-300 font-bold">
                                ❌ Red Sebebi: {q.rejectionReason}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/5">
                          <button onClick={() => { setEditingQuestionId(q.id); setEditQuestionForm({ subject: q.subject, examType: q.examType, topic: q.topic || "", difficulty: q.difficulty, questionText: q.questionText, imageUrl: q.imageUrl || "", optionA: q.optionA, optionB: q.optionB, optionC: q.optionC || "", optionD: q.optionD || "", optionE: q.optionE || "", correctOption: q.correctOption, solutionText: q.solutionText || "" }); }} className="bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/30 font-black text-xs px-3.5 py-2 rounded-xl transition">
                            ✏️ Düzenle
                          </button>
                          {q.status !== "APPROVED" && (
                            <button onClick={async () => { try { const res = await fetch("/api/admin/questions", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ questionId: q.id, status: "APPROVED" }) }); const data = await res.json(); if (data.success) { showMsg(`✅ Soru onaylandı ve öğretmene +${q.points} puan tanımlandı!`, "success"); fetchData(); } else { showMsg(data.error || "İşlem başarısız", "error"); } } catch { showMsg("Bağlantı hatası", "error"); } }} className="bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs px-4 py-2 rounded-xl transition">
                              ✅ Soruyu Onayla & +{q.points} Puan Ver
                            </button>
                          )}
                          {q.status === "PENDING_APPROVAL" && (
                            <button onClick={async () => { const reason = prompt("Lütfen red sebebini yazın:", "Soruda hatalı şık veya metin bulunmaktadır."); if (reason === null) return; try { const res = await fetch("/api/admin/questions", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ questionId: q.id, status: "REJECTED", rejectionReason: reason }) }); const data = await res.json(); if (data.success) { showMsg("Soru reddedildi.", "error"); fetchData(); } } catch { showMsg("Bağlantı hatası", "error"); } }} className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold text-xs px-3.5 py-2 rounded-xl transition">
                              ❌ Reddet
                            </button>
                          )}
                          <button onClick={async () => { if (!confirm("Bu soruyu silmek istediğinize emin misiniz?")) return; try { const res = await fetch(`/api/admin/questions?id=${q.id}`, { method: "DELETE" }); const data = await res.json(); if (data.success) { showMsg("Soru silindi.", "success"); fetchData(); } } catch { showMsg("Bağlantı hatası", "error"); } }} className="text-xs text-red-400 hover:text-red-300 font-bold px-2 py-1">
                            🗑️ Sil
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TASKS TAB */}
            {activeTab === "tasks" && (
              <div className="p-6 space-y-8">
                {/* Task Creation Form */}
                <div className="bg-[#0D1B35] border border-white/10 rounded-2xl p-6 shadow-xl">
                  <h3 className="text-base font-black text-indigo-400 mb-4 flex items-center gap-2">
                    <span>🏆</span> Öğretmene Yeni Görev & Puan Atama
                  </h3>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-1.5">Öğretmen Seçin</label>
                      <select value={taskForm.teacherId} onChange={(e) => setTaskForm({ ...taskForm, teacherId: e.target.value })} className="w-full bg-[#1E293B] border border-white/10 text-white px-4 py-2.5 rounded-xl text-xs font-bold focus:outline-none">
                        <option value="">Seçiniz...</option>
                        {teachers.map((t) => (
                          <option key={t.id} value={t.id}>{t.name} ({t.branch}) — Mevcut: {t.points || 0} Puan</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-1.5">Görev Başlığı</label>
                      <input type="text" placeholder="Örn: 2 Adet Blog Yazısı Yaz" value={taskForm.title} onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })} className="w-full bg-[#1E293B] border border-white/10 text-white px-4 py-2.5 rounded-xl text-xs font-bold focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-1.5">Ödül Puanı</label>
                      <input type="number" placeholder="Örn: 100" value={taskForm.points} onChange={(e) => setTaskForm({ ...taskForm, points: parseInt(e.target.value) || 50 })} className="w-full bg-[#1E293B] border border-white/10 text-white px-4 py-2.5 rounded-xl text-xs font-bold focus:outline-none" />
                    </div>
                    <div className="sm:col-span-4">
                      <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-1.5">Açıklama (Opsiyonel)</label>
                      <input type="text" placeholder="Görev detayları..." value={taskForm.description} onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })} className="w-full bg-[#1E293B] border border-white/10 text-white px-4 py-2.5 rounded-xl text-xs font-bold focus:outline-none placeholder:text-slate-600" />
                    </div>
                  </div>
                  <button onClick={async () => { if (!taskForm.teacherId || !taskForm.title) { showMsg("Lütfen öğretmen ve görev başlığını giriniz.", "error"); return; } setTaskCreating(true); try { const res = await fetch("/api/admin/tasks", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(taskForm) }); const data = await res.json(); if (data.success) { showMsg("🏆 Görev başarıyla öğretmene atandı!", "success"); setTaskForm({ teacherId: "", title: "", description: "", points: 50 }); fetchData(); } else { showMsg(data.error || "Görev atanamadı", "error"); } } catch { showMsg("Bağlantı hatası", "error"); } finally { setTaskCreating(false); } }} disabled={taskCreating} className="mt-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black py-2.5 px-6 rounded-xl text-xs transition disabled:opacity-60">
                    {taskCreating ? "Atanıyor..." : "➕ Görevi Atayarak Gönder"}
                  </button>
                </div>

                {/* Task List */}
                <div>
                  <h3 className="text-lg font-black text-white mb-4">📋 Atanan Görevler & Başvurular ({adminTasks.length})</h3>
                  {adminTasks.length === 0 ? (
                    <p className="text-slate-500 font-semibold text-sm py-8 text-center">Henüz öğretmen görevi atanmadı.</p>
                  ) : (
                    <div className="space-y-4">
                      {adminTasks.map((task: any) => (
                        <div key={task.id} className="bg-[#0D1B35] border border-white/10 rounded-2xl p-5 flex flex-wrap justify-between items-center gap-4 shadow-xl">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`text-xs font-black px-2.5 py-0.5 rounded-full ${ task.status === "COMPLETED" ? "bg-emerald-500/20 text-emerald-400" : task.status === "SUBMITTED" ? "bg-amber-500/20 text-amber-400 animate-pulse" : task.status === "REJECTED" ? "bg-red-500/20 text-red-400" : "bg-blue-500/20 text-blue-400" }`}>
                                {task.status === "COMPLETED" ? "✅ Tamamlandı (+ " + task.points + " Puan verildi)" : task.status === "SUBMITTED" ? "⏳ Öğretmen Tamamladı (Onay Bekliyor)" : task.status === "REJECTED" ? "❌ Reddedildi" : "⏳ Devam Ediyor"}
                              </span>
                              <span className="text-xs font-black bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full">⭐ {task.points} Puan</span>
                            </div>
                            <h4 className="font-black text-white text-base">{task.title}</h4>
                            <p className="text-xs text-slate-400 font-bold mt-0.5">
                              👨‍🏫 Öğretmen: {task.teacher?.name} ({task.teacher?.branch}) — Toplam Puanı: <span className="text-indigo-400 font-black">{task.teacher?.points || 0} Puan</span>
                            </p>
                            {task.description && <p className="text-xs text-slate-400 mt-1 font-semibold">{task.description}</p>}
                            {task.proof && <p className="text-xs text-amber-300 font-bold mt-1.5 bg-amber-500/10 p-2 rounded-lg border border-amber-500/20">📌 Kanıt/Not: {task.proof}</p>}
                          </div>
                          <div className="flex items-center gap-2">
                            {task.status !== "COMPLETED" && (
                              <button onClick={async () => { try { const res = await fetch("/api/admin/tasks", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ taskId: task.id, status: "COMPLETED" }) }); const data = await res.json(); if (data.success) { showMsg(`✅ Görev onaylandı ve öğretmene +${task.points} puan verildi!`, "success"); fetchData(); } else { showMsg(data.error || "İşlem başarısız", "error"); } } catch { showMsg("Bağlantı hatası", "error"); } }} className="bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs px-3.5 py-2 rounded-xl transition shadow-xs">
                                ✅ Onayla & Puan Ver
                              </button>
                            )}
                            {task.status === "SUBMITTED" && (
                              <button onClick={async () => { try { const res = await fetch("/api/admin/tasks", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ taskId: task.id, status: "REJECTED" }) }); const data = await res.json(); if (data.success) { showMsg("Görev reddedildi.", "error"); fetchData(); } } catch { showMsg("Bağlantı hatası", "error"); } }} className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-bold px-3 py-2 rounded-xl transition">
                                ❌ Reddet
                              </button>
                            )}
                            <button onClick={async () => { if (!confirm("Bu görevi silmek istediğinize emin misiniz?")) return; try { const res = await fetch(`/api/admin/tasks?id=${task.id}`, { method: "DELETE" }); const data = await res.json(); if (data.success) { showMsg("Görev silindi.", "success"); fetchData(); } } catch { showMsg("Bağlantı hatası", "error"); } }} className="text-xs text-red-400 hover:text-red-300 font-bold px-2 py-1">
                              🗑️ Sil
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* LESSONS MODERATION TAB */}
            {activeTab === "lessons" && (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-[#0D1B35] border-b border-white/10 text-slate-400 font-black uppercase text-[11px]">
                      <th className="p-4 sm:p-5">Ders Başlığı</th>
                      <th className="p-4 sm:p-5">Açan Öğretmen</th>
                      <th className="p-4 sm:p-5">Ücret / Format</th>
                      <th className="p-4 sm:p-5">Açıklama</th>
                      <th className="p-4 sm:p-5 text-right">İşlem</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-semibold text-slate-300">
                    {lessons.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-10 text-center text-slate-500">
                          Sistemde kayıtlı ders ilanı bulunmuyor.
                        </td>
                      </tr>
                    ) : (
                      lessons.map((l) => (
                        <tr key={l.id} className="hover:bg-white/5 transition-colors">
                          <td className="p-4 sm:p-5 font-black text-white">{l.title}</td>
                          <td className="p-4 sm:p-5 text-indigo-400 font-black">{l.teacherName}</td>
                          <td className="p-4 sm:p-5 space-y-1">
                            <div className="text-amber-400 font-black">{l.price} TL / Saat</div>
                            <span className="inline-block text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full border border-blue-500/30 font-bold uppercase">
                              {l.format}
                            </span>
                          </td>
                          <td className="p-4 sm:p-5 max-w-sm text-xs text-slate-400 leading-relaxed truncate">
                            {l.description || "-"}
                          </td>
                          <td className="p-4 sm:p-5 text-right">
                            <button
                              onClick={() => handleDeleteLesson(l.id)}
                              className="text-xs px-3 py-1.5 rounded-xl font-black bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 transition shadow-xs"
                            >
                              🗑️ İlanı Sil
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* BLOGS MODERATION TAB */}
            {activeTab === "blogs" && (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-[#0D1B35] border-b border-white/10 text-slate-400 font-black uppercase text-[11px]">
                      <th className="p-4 sm:p-5">Başlık</th>
                      <th className="p-4 sm:p-5">Yazar</th>
                      <th className="p-4 sm:p-5">Kategori / Tarih</th>
                      <th className="p-4 sm:p-5">İçerik Özeti</th>
                      <th className="p-4 sm:p-5 text-right">İşlem</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-semibold text-slate-300">
                    {blogs.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-10 text-center text-slate-500">
                          Sistemde yazılmış blog makalesi bulunmuyor.
                        </td>
                      </tr>
                    ) : (
                      blogs.map((b) => (
                        <tr key={b.id} className="hover:bg-white/5 transition-colors">
                          <td className="p-4 sm:p-5 font-black text-white">
                            <div>{b.title}</div>
                            <a
                              href={`/blog/${b.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[10px] text-indigo-400 hover:underline font-bold"
                            >
                              🔗 Sitede Gör
                            </a>
                          </td>
                          <td className="p-4 sm:p-5 text-indigo-300 font-black">{b.authorName}</td>
                          <td className="p-4 sm:p-5 space-y-0.5 text-xs">
                            <span className="inline-block text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-md font-black uppercase">
                              {b.category}
                            </span>
                            <div className="text-slate-500 font-bold block mt-1">
                              {new Date(b.createdAt).toLocaleDateString("tr-TR")}
                            </div>
                          </td>
                          <td className="p-4 sm:p-5 max-w-sm text-xs text-slate-400 leading-relaxed truncate">
                            {b.content}
                          </td>
                          <td className="p-4 sm:p-5 text-right">
                            <button
                              onClick={() => handleDeleteBlog(b.id)}
                              className="text-xs px-3 py-1.5 rounded-xl font-black bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 transition shadow-xs"
                            >
                              🗑️ Makaleyi Sil
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* LIVE SESSIONS TAB */}
            {activeTab === "sessions" && (
              <div className="p-6 space-y-8">
                {/* Session Creation Form */}
                <div className="bg-[#0D1B35] border border-white/10 rounded-2xl p-6 shadow-xl">
                  <h3 className="text-base font-black text-indigo-400 mb-4 flex items-center gap-2">
                    <span>🎥</span> Öğretmen & Öğrencilere Canlı Ders Açma & Davet
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-1.5">Ders Başlığı</label>
                      <input
                        type="text"
                        placeholder="Örn: YKS Birebir Matematik Kampı"
                        value={sessionForm.title}
                        onChange={(e) => setSessionForm({ ...sessionForm, title: e.target.value })}
                        className="w-full bg-[#1E293B] border border-white/10 text-white px-4 py-2.5 rounded-xl text-xs font-bold focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-1.5">Eğitmen Seçin</label>
                      <select
                        value={sessionForm.teacherId}
                        onChange={(e) => setSessionForm({ ...sessionForm, teacherId: e.target.value })}
                        className="w-full bg-[#1E293B] border border-white/10 text-white px-4 py-2.5 rounded-xl text-xs font-bold focus:outline-none"
                      >
                        <option value="">Seçiniz...</option>
                        {teachers.map((t) => (
                          <option key={t.id} value={t.id}>{t.name} ({t.branch})</option>
                        ))}
                      </select>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-1.5">Katılımcı Öğrenciler</label>
                      <select
                        multiple
                        value={sessionForm.studentIds.map(String)}
                        onChange={(e) => {
                          const selected = Array.from(e.target.selectedOptions, (option) => parseInt(option.value));
                          setSessionForm({ ...sessionForm, studentIds: selected });
                        }}
                        className="w-full bg-[#1E293B] border border-white/10 text-white px-4 py-2 rounded-xl text-xs font-bold focus:outline-none h-28"
                      >
                        {students.map((s) => (
                          <option key={s.id} value={s.id}>{s.name} ({s.email})</option>
                        ))}
                      </select>
                      <p className="text-[10px] text-slate-500 mt-1 font-semibold">Ctrl/Cmd tuşu ile birden fazla öğrenci seçebilirsiniz</p>
                    </div>
                    <div>
                      <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-1.5">Tarih & Saat</label>
                      <input
                        type="datetime-local"
                        value={sessionForm.startTime}
                        onChange={(e) => setSessionForm({ ...sessionForm, startTime: e.target.value })}
                        className="w-full bg-[#1E293B] border border-white/10 text-white px-4 py-2.5 rounded-xl text-xs font-bold focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-1.5">Süre (dakika)</label>
                      <input
                        type="number"
                        min={15}
                        max={240}
                        value={sessionForm.durationMinutes}
                        onChange={(e) => setSessionForm({ ...sessionForm, durationMinutes: parseInt(e.target.value) || 60 })}
                        className="w-full bg-[#1E293B] border border-white/10 text-white px-4 py-2.5 rounded-xl text-xs font-bold focus:outline-none"
                      />
                    </div>
                  </div>
                  <button
                    onClick={async () => {
                      if (!sessionForm.title || !sessionForm.teacherId || !sessionForm.studentIds.length || !sessionForm.startTime) {
                        showMsg("Lütfen tüm zorunlu alanları doldurun.", "error");
                        return;
                      }
                      setSessionCreating(true);
                      try {
                        const res = await fetch("/api/admin/sessions", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            ...sessionForm,
                            teacherId: parseInt(sessionForm.teacherId),
                          }),
                        });
                        const data = await res.json();
                        if (data.success) {
                          showMsg("✅ Canlı ders oluşturuldu ve mailler gönderildi!", "success");
                          setSessionForm({ title: "", description: "", teacherId: "", studentIds: [], startTime: "", durationMinutes: 60, capacity: 1, recordSession: false });
                          fetchData();
                        } else {
                          showMsg(data.error || "Ders oluşturulamadı", "error");
                        }
                      } catch {
                        showMsg("Bağlantı hatası", "error");
                      } finally {
                        setSessionCreating(false);
                      }
                    }}
                    disabled={sessionCreating}
                    className="mt-5 bg-indigo-600 hover:bg-indigo-500 text-white font-black py-3 px-8 rounded-xl text-xs transition disabled:opacity-60"
                  >
                    {sessionCreating ? "Oluşturuluyor..." : "🚀 Ders Oluştur & Mailler Gönder"}
                  </button>
                </div>

                {/* Live Sessions List */}
                <div>
                  <h3 className="text-lg font-black text-white mb-4">📋 Tüm Canlı Dersler ({liveSessions.length})</h3>
                  {liveSessions.length === 0 ? (
                    <p className="text-slate-500 font-semibold text-sm py-8 text-center">Henüz ders oluşturulmadı.</p>
                  ) : (
                    <div className="space-y-4">
                      {liveSessions.map((s: any) => (
                        <div key={s.id} className="bg-[#0D1B35] border border-white/10 rounded-2xl p-5 flex flex-wrap justify-between items-center gap-4 shadow-xl">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`text-xs font-black px-2.5 py-0.5 rounded-full ${
                                s.status === "LIVE" ? "bg-red-500/20 text-red-400 animate-pulse" :
                                s.status === "ENDED" ? "bg-[#1E293B] text-slate-400" :
                                s.status === "CANCELLED" ? "bg-rose-500/20 text-rose-400" :
                                "bg-blue-500/20 text-blue-400"
                              }`}>{s.status}</span>
                              {s.recordSession && <span className="text-xs font-bold bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full">🔴 Kayıt</span>}
                            </div>
                            <h4 className="font-black text-white text-base">{s.title}</h4>
                            <p className="text-xs text-slate-400 font-semibold mt-0.5">
                              👨‍🏫 {s.teacher?.name} • {new Date(s.startTime).toLocaleString("tr-TR", { timeZone: "Europe/Istanbul" })} • {s.durationMinutes} dk
                            </p>
                            <p className="text-xs text-indigo-400 font-bold mt-1">
                              🎓 Katılımcılar: {s.participants?.map((p: any) => p.student?.name).join(", ")}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            {s.status !== "CANCELLED" && s.status !== "ENDED" && (
                              <button
                                onClick={async () => {
                                  if (!confirm(`"${s.title}" dersini iptal etmek istediğinize emin misiniz? Katılımcılara iptal maili gönderilecektir.`)) return;
                                  try {
                                    const res = await fetch(`/api/admin/sessions?id=${s.id}`, { method: "DELETE" });
                                    const data = await res.json();
                                    if (data.success) {
                                      showMsg("🚫 Canlı ders iptal edildi ve mailler gönderildi.", "success");
                                      fetchData();
                                    } else {
                                      showMsg(data.error || "İşlem başarısız", "error");
                                    }
                                  } catch {
                                    showMsg("Bağlantı hatası", "error");
                                  }
                                }}
                                className="bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 text-xs font-black px-3.5 py-2 rounded-xl transition"
                              >
                                🚫 İptal Et
                              </button>
                            )}
                            <a
                              href={`/ders/${s.id}`}
                              target="_blank"
                              className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black px-4 py-2 rounded-xl transition"
                            >
                              🔗 Odaya Gir
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* FEEDBACKS TAB */}
            {activeTab === "feedbacks" && (
              <div className="p-6">
                {feedbacks.length === 0 ? (
                  <p className="text-center py-12 text-slate-500 font-semibold">
                    Henüz öğrenciler tarafından yazılmış bir görüş veya talep bulunmamaktadır.
                  </p>
                ) : (
                  <div className="grid sm:grid-cols-2 gap-4">
                    {feedbacks.map((f) => (
                      <div key={f.id} className="p-5 bg-[#0D1B35] border border-white/10 rounded-2xl relative shadow-xl space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="font-black text-sm text-white block">{f.studentName}</span>
                            <span className="text-[10px] text-slate-400">{f.studentEmail || "E-posta Gizli"}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 font-black text-xs px-2 py-0.5 rounded-md">
                              {f.rating} ★
                            </span>
                            <button
                              onClick={() => handleDeleteFeedback(f.id)}
                              className="text-xs text-red-400 hover:text-red-300 font-bold"
                            >
                              Sil
                            </button>
                          </div>
                        </div>
                        <p className="text-slate-300 text-xs font-semibold leading-relaxed p-3 bg-[#1E293B] rounded-xl border border-white/5">
                          "{f.content}"
                        </p>
                        <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold border-t border-white/5 pt-2">
                          <span>Hedef Öğretmen: <span className="text-indigo-400 font-black">{f.teacherName}</span></span>
                          <span>{new Date(f.createdAt).toLocaleDateString("tr-TR")}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>
        </main>
      </div>
    </div>
  );
}
