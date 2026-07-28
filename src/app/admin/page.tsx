"use client";

import React, { useState, useEffect, useCallback } from "react";

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

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<"teachers" | "students" | "lessons" | "blogs" | "feedbacks" | "sessions">("teachers");
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [liveSessions, setLiveSessions] = useState<any[]>([]);

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
      const [tRes, sRes, fRes, lRes, bRes, sessRes] = await Promise.all([
        fetch("/api/profil/ogretmen"),
        fetch("/api/profil/ogrenci"),
        fetch("/api/gorus"),
        fetch("/api/admin/lessons"),
        fetch("/api/admin/blogs"),
        fetch("/api/admin/sessions"),
      ]);

      const tData = await tRes.json();
      const sData = await sRes.json();
      const fData = await fRes.json();
      const lData = await lRes.json();
      const bData = await bRes.json();
      const sessData = await sessRes.json();

      if (tData.success) setTeachers(tData.teachers || []);
      if (sData.success) setStudents(sData.students || []);
      if (fData.success) setFeedbacks(fData.feedbacks || []);
      if (lData.success) setLessons(lData.lessons || []);
      if (bData.success) setBlogs(bData.posts || []);
      if (sessData.success) setLiveSessions(sessData.sessions || []);
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

  const handleUpdateStatus = async (id: number, role: "student" | "teacher", currentStatus: string) => {
    const newStatus = currentStatus === "Beklemede" ? "İletişime Geçildi" : "Beklemede";
    try {
      const res = await fetch("/api/admin/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, role, status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        showMsg("Durum başarıyla güncellendi", "success");
        fetchData();
      } else {
        showMsg("Durum güncellenemedi", "error");
      }
    } catch (err) {
      showMsg("Bağlantı hatası", "error");
    }
  };

  const handleBanToggle = async (id: number, role: "student" | "teacher", isCurrentlyBanned: boolean) => {
    const action = isCurrentlyBanned ? "unban" : "ban";
    if (!confirm(`Bu kullanıcıyı ${isCurrentlyBanned ? "etkinleştirmek" : "yasaklamak"} istediğinize emin misiniz?`)) return;
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, role, action }),
      });
      const data = await res.json();
      if (data.success) {
        showMsg(data.message || "İşlem başarılı.", "success");
        fetchData();
      } else {
        showMsg(data.error || "İşlem başarısız.", "error");
      }
    } catch (err) {
      showMsg("Bağlantı hatası", "error");
    }
  };

  const handleDeleteUser = async (id: number, role: "student" | "teacher") => {
    if (!confirm("Kullanıcıyı ve ona ait TÜM verileri (ilanlar, bloglar vb.) TAMAMEN silmek istediğinize emin misiniz? Bu işlem geri alınamaz!")) return;
    try {
      const res = await fetch(`/api/admin/users?id=${id}&role=${role}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        showMsg(data.message || "Kullanıcı silindi.", "success");
        fetchData();
      } else {
        showMsg(data.error || "Silme başarısız.", "error");
      }
    } catch (err) {
      showMsg("Bağlantı hatası", "error");
    }
  };

  const handleDeleteLesson = async (id: number) => {
    if (!confirm("Bu özel ders teklifini kaldırmak istediğinize emin misiniz?")) return;
    try {
      const res = await fetch(`/api/admin/lessons?id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        showMsg(data.message || "Ders kaldırıldı.", "success");
        fetchData();
      } else {
        showMsg(data.error || "İşlem başarısız.", "error");
      }
    } catch (err) {
      showMsg("Bağlantı hatası", "error");
    }
  };

  const handleDeleteBlog = async (id: number) => {
    if (!confirm("Bu blog yazısını silmek istediğinize emin misiniz?")) return;
    try {
      const res = await fetch(`/api/admin/blogs?id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        showMsg(data.message || "Blog yazısı silindi.", "success");
        fetchData();
      } else {
        showMsg(data.error || "İşlem başarısız.", "error");
      }
    } catch (err) {
      showMsg("Bağlantı hatası", "error");
    }
  };

  const handleDeleteFeedback = async (id: number) => {
    if (!confirm("Bu görüşü / randevu talebini kaldırmak istediğinize emin misiniz?")) return;
    try {
      const res = await fetch(`/api/gorus?id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        showMsg(data.message || "Görüş silindi.", "success");
        fetchData();
      } else {
        showMsg(data.error || "İşlem başarısız.", "error");
      }
    } catch (err) {
      showMsg("Bağlantı hatası", "error");
    }
  };

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
          <div>
            <span className="text-[#B45309] text-xs font-black uppercase tracking-widest block mb-1">
              DERSLINEX KONTROL PANELİ
            </span>
            <h1 className="text-4xl font-black text-[#1E3A8A]">Yönetim & Moderasyon</h1>
            <p className="text-gray-500 font-semibold mt-1 text-sm sm:text-base">
              Üye yönetimi, yasaklama/silme ve ders/blog içeriklerinin denetim merkezi.
            </p>
          </div>
          <button
            onClick={fetchData}
            disabled={loading}
            className="self-start md:self-auto bg-white border border-[#EFECE6] text-gray-700 font-bold px-5 py-2.5 rounded-xl hover:bg-gray-50 transition shadow-sm text-sm"
          >
            {loading ? "Yükleniyor..." : "🔄 Verileri Yenile"}
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {[
            { label: "Öğretmenler", val: teachers.length, icon: "👨‍🏫" },
            { label: "Öğrenciler", val: students.length, icon: "🎓" },
            { label: "Canlı Dersler", val: liveSessions.length, icon: "🎥" },
            { label: "Ders İlanları", val: lessons.length, icon: "📚" },
            { label: "Bloglar", val: blogs.length, icon: "✍️" },
            { label: "Görüş & Talep", val: feedbacks.length, icon: "💬" },
          ].map((s) => (
            <div key={s.label} className="bg-white border border-[#EFECE6] p-4 sm:p-5 rounded-2xl shadow-xs hover:border-[#1E3A8A]/30 transition-all">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">{s.label}</span>
              <span className="text-xl sm:text-2xl font-black text-[#1E3A8A] block mt-1.5 flex items-center gap-2">
                <span>{s.icon}</span>
                <span>{s.val}</span>
              </span>
            </div>
          ))}
        </div>

        {/* Global message */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-xl text-sm font-bold border transition-all shadow-sm flex items-center justify-between ${
              message.type === "success"
                ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                : "bg-rose-50 text-rose-800 border-rose-200"
            }`}
          >
            <span>{message.text}</span>
            <button className="text-xs opacity-60 hover:opacity-100 font-black" onClick={() => setMessage(null)}>
              ✕
            </button>
          </div>
        )}

        {/* Tabs Bar */}
        <div className="flex bg-white/70 backdrop-blur border border-[#EFECE6] p-1.5 rounded-2xl mb-8 shadow-sm overflow-x-auto gap-1">
          {[
            { key: "teachers", label: "Öğretmenler", count: teachers.length, icon: "👨‍🏫" },
            { key: "students", label: "Öğrenciler", count: students.length, icon: "🎓" },
            { key: "lessons", label: "Özel Dersler", count: lessons.length, icon: "📚" },
            { key: "blogs", label: "Bloglar", count: blogs.length, icon: "✍️" },
            { key: "feedbacks", label: "Görüşler", count: feedbacks.length, icon: "💬" },
            { key: "sessions", label: "Canlı Dersler", count: liveSessions.length, icon: "🎥" },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key as any)}
              className={`py-3 px-5 text-xs sm:text-sm font-black rounded-xl transition-all duration-200 whitespace-nowrap flex-1 flex items-center justify-center gap-1.5 ${
                activeTab === t.key
                  ? "bg-[#1E3A8A] text-white shadow-xs"
                  : "text-gray-600 hover:text-[#1E3A8A] hover:bg-white"
              }`}
            >
              <span>{t.icon}</span>
              <span>{t.label} ({t.count})</span>
            </button>
          ))}
        </div>

        {/* Content Box */}
        <div className="bg-white rounded-3xl border border-[#EFECE6] overflow-hidden shadow-sm">
          
          {/* TEACHERS TAB */}
          {activeTab === "teachers" && (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-[#FAF8F5] border-b border-[#EFECE6] text-gray-500 font-black uppercase text-xs">
                    <th className="p-4 sm:p-5">Adı Soyadı</th>
                    <th className="p-4 sm:p-5">Branş</th>
                    <th className="p-4 sm:p-5">İletişim</th>
                    <th className="p-4 sm:p-5">Eğitim / Hakkında</th>
                    <th className="p-4 sm:p-5">Durum / Ban</th>
                    <th className="p-4 sm:p-5 text-right">İşlemler</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EFECE6] font-semibold text-gray-700">
                  {teachers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-10 text-center text-gray-400">
                        Henüz kayıtlı öğretmen başvurusu bulunmuyor.
                      </td>
                    </tr>
                  ) : (
                    teachers.map((t) => (
                      <tr key={t.id} className={`hover:bg-[#FAF8F5]/50 transition-colors ${t.isBanned ? "bg-rose-50/20" : ""}`}>
                        <td className="p-4 sm:p-5 font-black text-gray-900">
                          <div>{t.name}</div>
                          <span className="text-[10px] text-gray-400 font-bold block mt-0.5">
                            Kayıt: {new Date(t.createdAt).toLocaleDateString("tr-TR")}
                          </span>
                        </td>
                        <td className="p-4 sm:p-5">
                          <span className="bg-blue-50 text-blue-700 text-xs px-2.5 py-1 rounded-full border border-blue-100 font-bold">
                            {t.branch}
                          </span>
                        </td>
                        <td className="p-4 sm:p-5 space-y-0.5 text-xs">
                          <div>📞 {t.phone}</div>
                          <div className="text-gray-500">{t.email}</div>
                        </td>
                        <td className="p-4 sm:p-5 max-w-xs text-xs space-y-1.5">
                          {t.egitim && <div><span className="text-gray-400 font-bold block text-[10px] uppercase">Eğitim:</span>{t.egitim}</div>}
                          {t.ozgecmis && <div className="line-clamp-2 text-gray-500 leading-relaxed"><span className="text-gray-400 font-bold block text-[10px] uppercase">Özgeçmiş:</span>{t.ozgecmis}</div>}
                          {!t.egitim && !t.ozgecmis && <span className="text-gray-400 italic">Profil Bilgisi Girilmemiş</span>}
                        </td>
                        <td className="p-4 sm:p-5 space-y-1.5">
                          <div>
                            <span
                              className={`inline-block text-[10px] px-2.5 py-0.5 rounded-full font-bold border ${
                                t.status === "İletişime Geçildi"
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                  : "bg-amber-50 text-amber-700 border-amber-200"
                              }`}
                            >
                              {t.status === "İletişime Geçildi" ? "Onaylı" : "Beklemede"}
                            </span>
                          </div>
                          {t.isBanned && (
                            <div>
                              <span className="inline-block text-[10px] bg-red-100 text-red-700 border border-red-200 px-2.5 py-0.5 rounded-full font-bold">
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
                                className="text-xs px-3 py-1.5 rounded-lg border font-black bg-white hover:bg-gray-50 text-[#1E3A8A] border-[#EFECE6] transition-all shadow-xs"
                              >
                                🔍 Profili Gör
                              </a>
                            )}
                            <button
                              onClick={() => handleUpdateStatus(t.id, "teacher", t.status)}
                              className={`text-xs px-3 py-1.5 rounded-lg border font-black transition-all shadow-xs ${
                                t.status === "İletişime Geçildi"
                                  ? "bg-amber-50 hover:bg-amber-100 text-amber-800 border-amber-200"
                                  : "bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600"
                              }`}
                            >
                              {t.status === "İletişime Geçildi" ? "Beklemeye Al" : "Onayla"}
                            </button>
                            <button
                              onClick={() => handleBanToggle(t.id, "teacher", t.isBanned)}
                              className={`text-xs px-3 py-1.5 rounded-lg border font-black transition-all shadow-xs ${
                                t.isBanned
                                  ? "bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200"
                                  : "bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-200"
                              }`}
                            >
                              {t.isBanned ? "Engeli Kaldır" : "Engelle"}
                            </button>
                            <button
                              onClick={() => handleDeleteUser(t.id, "teacher")}
                              className="text-xs px-3 py-1.5 rounded-lg font-black transition-all bg-red-650 hover:bg-red-700 text-white shadow-xs"
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
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-[#FAF8F5] border-b border-[#EFECE6] text-gray-500 font-black uppercase text-xs">
                    <th className="p-4 sm:p-5">Adı Soyadı</th>
                    <th className="p-4 sm:p-5">İletişim</th>
                    <th className="p-4 sm:p-5">Durum / Ban</th>
                    <th className="p-4 sm:p-5 text-right">İşlemler</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EFECE6] font-semibold text-gray-700">
                  {students.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="p-10 text-center text-gray-400">
                        Henüz kayıtlı öğrenci bulunmuyor.
                      </td>
                    </tr>
                  ) : (
                    students.map((s) => (
                      <tr key={s.id} className={`hover:bg-[#FAF8F5]/50 transition-colors ${s.isBanned ? "bg-rose-50/20" : ""}`}>
                        <td className="p-4 sm:p-5 font-black text-gray-900">
                          <div>{s.name}</div>
                          <span className="text-[10px] text-gray-400 font-bold block mt-0.5">
                            Kayıt: {new Date(s.createdAt).toLocaleDateString("tr-TR")}
                          </span>
                        </td>
                        <td className="p-4 sm:p-5 space-y-0.5 text-xs font-semibold">
                          <div>📞 {s.phone}</div>
                          <div className="text-gray-500">✉️ {s.email}</div>
                        </td>
                        <td className="p-4 sm:p-5 space-y-1.5">
                          <div>
                            <span
                              className={`inline-block text-[10px] px-2.5 py-0.5 rounded-full font-bold border ${
                                s.status === "İletişime Geçildi"
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                  : "bg-amber-50 text-amber-700 border-amber-200"
                              }`}
                            >
                              {s.status}
                            </span>
                          </div>
                          {s.isBanned && (
                            <div>
                              <span className="inline-block text-[10px] bg-red-100 text-red-700 border border-red-200 px-2.5 py-0.5 rounded-full font-bold">
                                ⛔ Yasaklı
                              </span>
                            </div>
                          )}
                        </td>
                        <td className="p-4 sm:p-5 text-right">
                          <div className="flex items-center justify-end gap-2 flex-wrap">
                            <button
                              onClick={() => handleUpdateStatus(s.id, "student", s.status)}
                              className={`text-xs px-3.5 py-1.5 rounded-lg border font-black transition-all shadow-xs ${
                                s.status === "İletişime Geçildi"
                                  ? "bg-white hover:bg-gray-50 text-gray-700 border-[#EFECE6]"
                                  : "bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600"
                              }`}
                            >
                              {s.status === "İletişime Geçildi" ? "Beklemeye Al" : "İletişime Geçildi İşaretle"}
                            </button>
                            <button
                              onClick={() => handleBanToggle(s.id, "student", s.isBanned)}
                              className={`text-xs px-3 py-1.5 rounded-lg border font-black transition-all shadow-xs ${
                                s.isBanned
                                  ? "bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200"
                                  : "bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-200"
                              }`}
                            >
                              {s.isBanned ? "Engeli Kaldır" : "Engelle"}
                            </button>
                            <button
                              onClick={() => handleDeleteUser(s.id, "student")}
                              className="text-xs px-3 py-1.5 rounded-lg font-black bg-red-650 hover:bg-red-700 text-white shadow-xs"
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

          {/* LESSONS MODERATION TAB */}
          {activeTab === "lessons" && (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-[#FAF8F5] border-b border-[#EFECE6] text-gray-500 font-black uppercase text-xs">
                    <th className="p-4 sm:p-5">Ders Başlığı</th>
                    <th className="p-4 sm:p-5">Açan Öğretmen</th>
                    <th className="p-4 sm:p-5">Ücret / Format</th>
                    <th className="p-4 sm:p-5">Açıklama</th>
                    <th className="p-4 sm:p-5 text-right">İşlem</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EFECE6] font-semibold text-gray-700">
                  {lessons.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-10 text-center text-gray-400">
                        Sistemde kayıtlı ders ilanı bulunmuyor.
                      </td>
                    </tr>
                  ) : (
                    lessons.map((l) => (
                      <tr key={l.id} className="hover:bg-[#FAF8F5]/50 transition-colors">
                        <td className="p-4 sm:p-5 font-black text-gray-900">{l.title}</td>
                        <td className="p-4 sm:p-5 text-[#1E3A8A] font-black">{l.teacherName}</td>
                        <td className="p-4 sm:p-5 space-y-1">
                          <div className="text-[#B45309] font-black">{l.price} TL / Saat</div>
                          <span className="inline-block text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-100 font-bold uppercase">
                            {l.format}
                          </span>
                        </td>
                        <td className="p-4 sm:p-5 max-w-sm text-xs text-gray-500 leading-relaxed truncate">
                          {l.description || "-"}
                        </td>
                        <td className="p-4 sm:p-5 text-right">
                          <button
                            onClick={() => handleDeleteLesson(l.id)}
                            className="text-xs px-3 py-1.5 rounded-lg font-black bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-all shadow-xs"
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
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-[#FAF8F5] border-b border-[#EFECE6] text-gray-500 font-black uppercase text-xs">
                    <th className="p-4 sm:p-5">Başlık</th>
                    <th className="p-4 sm:p-5">Yazar</th>
                    <th className="p-4 sm:p-5">Kategori / Tarih</th>
                    <th className="p-4 sm:p-5">İçerik Özeti</th>
                    <th className="p-4 sm:p-5 text-right">İşlem</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EFECE6] font-semibold text-gray-700">
                  {blogs.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-10 text-center text-gray-400">
                        Sistemde dynamic olarak yazılmış blog yazısı bulunmuyor.
                      </td>
                    </tr>
                  ) : (
                    blogs.map((b) => (
                      <tr key={b.id} className="hover:bg-[#FAF8F5]/50 transition-colors">
                        <td className="p-4 sm:p-5 font-black text-gray-900">
                          <div>{b.title}</div>
                          <a
                            href={`/blog/${b.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] text-blue-650 hover:underline font-bold"
                          >
                            🔗 Sitede Gör
                          </a>
                        </td>
                        <td className="p-4 sm:p-5 text-[#1E3A8A] font-black">{b.authorName}</td>
                        <td className="p-4 sm:p-5 space-y-0.5 text-xs">
                          <span className="inline-block text-[10px] bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-md font-black uppercase">
                            {b.category}
                          </span>
                          <div className="text-gray-400 font-bold block mt-1">
                            {new Date(b.createdAt).toLocaleDateString("tr-TR")}
                          </div>
                        </td>
                        <td className="p-4 sm:p-5 max-w-sm text-xs text-gray-500 leading-relaxed truncate">
                          {b.content}
                        </td>
                        <td className="p-4 sm:p-5 text-right">
                          <button
                            onClick={() => handleDeleteBlog(b.id)}
                            className="text-xs px-3 py-1.5 rounded-lg font-black bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-all shadow-xs"
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

          {/* FEEDBACKS TAB */}
          {activeTab === "feedbacks" && (
            <div className="p-6">
              {feedbacks.length === 0 ? (
                <p className="text-center py-10 text-gray-400 font-semibold">
                  Henüz öğrenciler tarafından yazılmış bir görüş veya talep bulunmamaktadır.
                </p>
              ) : (
                <div className="grid sm:grid-cols-2 gap-6">
                  {feedbacks.map((f) => (
                    <div key={f.id} className="p-5 bg-[#FAF8F5]/50 border border-[#EFECE6] rounded-2xl relative shadow-xs hover:border-[#1E3A8A]/35 transition-all">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <span className="font-black text-sm text-[#1E3A8A] block">{f.studentName}</span>
                          <span className="text-[10px] text-gray-400">{f.studentEmail || "E-posta Gizli"}</span>
                        </div>
                        <div className="flex gap-2">
                          <span className="bg-amber-50 text-amber-700 border border-amber-200 font-black text-xs px-2 py-0.5 rounded-md">
                            {f.rating} ★
                          </span>
                          <button
                            onClick={() => handleDeleteFeedback(f.id)}
                            className="text-xs text-rose-600 hover:text-rose-800 font-bold"
                          >
                            Sil
                          </button>
                        </div>
                      </div>
                      <p className="text-gray-655 text-xs font-semibold leading-relaxed mb-4 p-3 bg-white rounded-xl border border-[#EFECE6]/50">
                        {f.content}
                      </p>
                      <div className="flex justify-between items-center text-[10px] text-gray-500 font-bold border-t border-[#EFECE6]/40 pt-2">
                        <span>Hedef Öğretmen: <span className="text-indigo-650 font-black">{f.teacherName}</span></span>
                        <span>{new Date(f.createdAt).toLocaleDateString("tr-TR")}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* SESSIONS TAB */}
          {activeTab === "sessions" && (
            <div className="p-6 space-y-8">
              {/* Ders Oluşturma Formu */}
              <div className="bg-[#FAF8F5] rounded-2xl border border-[#EFECE6] p-6">
                <h3 className="text-lg font-black text-[#1E3A8A] mb-5">🎥 Yeni Canlı Ders Oluştur</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-1.5">Ders Başlığı</label>
                    <input
                      type="text"
                      placeholder="Matematik — Türevler"
                      value={sessionForm.title}
                      onChange={(e) => setSessionForm({ ...sessionForm, title: e.target.value })}
                      className="w-full bg-white border border-[#EFECE6] px-4 py-2.5 rounded-xl text-sm font-bold focus:outline-none focus:border-[#1E3A8A]/50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-1.5">Öğretmen</label>
                    <select
                      value={sessionForm.teacherId}
                      onChange={(e) => setSessionForm({ ...sessionForm, teacherId: e.target.value })}
                      className="w-full bg-white border border-[#EFECE6] px-4 py-2.5 rounded-xl text-sm font-bold focus:outline-none"
                    >
                      <option value="">Öğretmen seçin...</option>
                      {teachers.map((t) => (
                        <option key={t.id} value={t.id}>{t.name} — {t.branch}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-1.5">Öğrenciler (çoklu seçim)</label>
                    <select
                      multiple
                      value={sessionForm.studentIds.map(String)}
                      onChange={(e) => {
                        const selected = Array.from(e.target.selectedOptions, (o) => parseInt(o.value));
                        setSessionForm({ ...sessionForm, studentIds: selected });
                      }}
                      className="w-full bg-white border border-[#EFECE6] px-4 py-2 rounded-xl text-sm font-bold focus:outline-none h-28"
                    >
                      {students.map((s) => (
                        <option key={s.id} value={s.id}>{s.name} ({s.email})</option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-400 mt-1 font-semibold">Ctrl/Cmd tuşu ile birden fazla öğrenci seçebilirsiniz</p>
                  </div>
                  <div>
                    <label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-1.5">Tarih & Saat</label>
                    <input
                      type="datetime-local"
                      value={sessionForm.startTime}
                      onChange={(e) => setSessionForm({ ...sessionForm, startTime: e.target.value })}
                      className="w-full bg-white border border-[#EFECE6] px-4 py-2.5 rounded-xl text-sm font-bold focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-1.5">Süre (dakika)</label>
                    <input
                      type="number"
                      min={15}
                      max={240}
                      value={sessionForm.durationMinutes}
                      onChange={(e) => setSessionForm({ ...sessionForm, durationMinutes: parseInt(e.target.value) || 60 })}
                      className="w-full bg-white border border-[#EFECE6] px-4 py-2.5 rounded-xl text-sm font-bold focus:outline-none"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={sessionForm.recordSession}
                        onChange={(e) => setSessionForm({ ...sessionForm, recordSession: e.target.checked })}
                        className="w-5 h-5 accent-[#1E3A8A]"
                      />
                      <span className="text-sm font-bold text-gray-700">🔴 Dersi Kaydet (Cloud Recording)</span>
                    </label>
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
                  className="mt-5 bg-[#1E3A8A] hover:bg-[#163070] text-white font-black py-3 px-8 rounded-xl transition disabled:opacity-60"
                >
                  {sessionCreating ? "Oluşturuluyor..." : "🚀 Ders Oluştur & Mailler Gönder"}
                </button>
              </div>

              {/* Mevcut Oturumlar */}
              <div>
                <h3 className="text-lg font-black text-[#1E3A8A] mb-4">📋 Tüm Canlı Dersler ({liveSessions.length})</h3>
                {liveSessions.length === 0 ? (
                  <p className="text-gray-400 font-semibold text-sm py-8 text-center">Henüz ders oluşturulmadı.</p>
                ) : (
                  <div className="space-y-4">
                    {liveSessions.map((s: any) => (
                      <div key={s.id} className="bg-white border border-[#EFECE6] rounded-2xl p-5">
                        <div className="flex flex-wrap gap-3 justify-between items-start">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`text-xs font-black px-2.5 py-0.5 rounded-full ${
                                s.status === "LIVE" ? "bg-red-100 text-red-700 border border-red-200" :
                                s.status === "ENDED" ? "bg-gray-100 text-gray-600" :
                                s.status === "CANCELLED" ? "bg-rose-100 text-rose-700" :
                                "bg-blue-100 text-blue-700"
                              }`}>{s.status}</span>
                              {s.recordSession && <span className="text-xs font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">🔴 Kayıt</span>}
                            </div>
                            <h4 className="font-black text-gray-900 text-base">{s.title}</h4>
                            <p className="text-xs text-gray-500 font-semibold mt-0.5">
                              👨‍🏫 {s.teacher?.name} • {new Date(s.startTime).toLocaleString("tr-TR")} • {s.durationMinutes} dk
                            </p>
                            <p className="text-xs text-indigo-600 font-bold mt-1">
                              🎓 {s.participants?.map((p: any) => p.student?.name).join(", ")}
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
                                className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-black px-3.5 py-2 rounded-xl transition"
                              >
                                🚫 Dersi İptal Et
                              </button>
                            )}
                            <a
                              href={`/ders/${s.id}`}
                              target="_blank"
                              className="bg-[#1E3A8A] hover:bg-[#163070] text-white text-xs font-black px-4 py-2 rounded-xl transition"
                            >
                              🔗 Odaya Gir
                            </a>
                          </div>
                        </div>
                        {s.recordingUrl && (
                          <a
                            href={s.recordingUrl}
                            target="_blank"
                            className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:underline"
                          >
                            📹 Ders Kaydını İzle
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
