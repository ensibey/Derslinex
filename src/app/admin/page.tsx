"use client";

import React, { useState, useEffect, useCallback } from "react";

interface Student {
  id: number;
  name: string;
  phone: string;
  email: string;
  status: string;
  createdAt: string;
}

interface Teacher {
  id: number;
  name: string;
  phone: string;
  email: string;
  branch: string;
  status: string;
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

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<"teachers" | "students" | "feedbacks">("teachers");
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [tRes, sRes, fRes] = await Promise.all([
        fetch("/api/profil/ogretmen"),
        fetch("/api/profil/ogrenci"),
        fetch("/api/gorus"),
      ]);

      const tData = await tRes.json();
      const sData = await sRes.json();
      const fData = await fRes.json();

      if (tData.success) setTeachers(tData.teachers || []);
      if (sData.success) setStudents(sData.students || []);
      if (fData.success) setFeedbacks(fData.feedbacks || []);
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
        fetchData(); // reload
      } else {
        showMsg("Durum güncellenemedi", "error");
      }
    } catch (err) {
      showMsg("Bağlantı hatası", "error");
    }
  };

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-10">
          <div>
            <span className="text-[#B45309] text-xs font-black uppercase tracking-widest block mb-1">
              DERSLINEX KONTROL PANELİ
            </span>
            <h1 className="text-4xl font-black text-[#1E3A8A]">Yönetim Paneli</h1>
            <p className="text-gray-500 font-semibold mt-1">
              Kayıtlı öğrencileri, öğretmenleri ve tüm ders/randevu görüşlerini yönetin.
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
            <button className="text-xs opacity-60 hover:opacity-100" onClick={() => setMessage(null)}>
              ✕
            </button>
          </div>
        )}

        {/* Tabs */}
        <div className="flex bg-white/70 backdrop-blur border border-[#EFECE6] p-1.5 rounded-2xl mb-8 shadow-sm overflow-x-auto">
          <button
            onClick={() => setActiveTab("teachers")}
            className={`py-3.5 px-6 text-sm font-black rounded-xl transition-all duration-200 whitespace-nowrap flex-1 ${
              activeTab === "teachers"
                ? "bg-[#1E3A8A] text-white shadow-sm"
                : "text-gray-600 hover:text-[#1E3A8A] hover:bg-white"
            }`}
          >
            👨‍🏫 Öğretmen Başvuruları ({teachers.length})
          </button>
          <button
            onClick={() => setActiveTab("students")}
            className={`py-3.5 px-6 text-sm font-black rounded-xl transition-all duration-200 whitespace-nowrap flex-1 ${
              activeTab === "students"
                ? "bg-[#1E3A8A] text-white shadow-sm"
                : "text-gray-600 hover:text-[#1E3A8A] hover:bg-white"
            }`}
          >
            🎓 Kayıtlı Öğrenciler ({students.length})
          </button>
          <button
            onClick={() => setActiveTab("feedbacks")}
            className={`py-3.5 px-6 text-sm font-black rounded-xl transition-all duration-200 whitespace-nowrap flex-1 ${
              activeTab === "feedbacks"
                ? "bg-[#1E3A8A] text-white shadow-sm"
                : "text-gray-600 hover:text-[#1E3A8A] hover:bg-white"
            }`}
          >
            💬 Öğrenci Görüşleri ({feedbacks.length})
          </button>
        </div>

        {/* CONTENT */}
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
                    <th className="p-4 sm:p-5">Kayıt Tarihi</th>
                    <th className="p-4 sm:p-5">Durum</th>
                    <th className="p-4 sm:p-5 text-right">İşlem</th>
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
                      <tr key={t.id} className="hover:bg-[#FAF8F5]/50 transition-colors">
                        <td className="p-4 sm:p-5 font-black text-gray-900">{t.name}</td>
                        <td className="p-4 sm:p-5">
                          <span className="bg-blue-50 text-blue-700 text-xs px-2.5 py-1 rounded-full border border-blue-100">
                            {t.branch}
                          </span>
                        </td>
                        <td className="p-4 sm:p-5 space-y-0.5 text-xs">
                          <div>📞 {t.phone}</div>
                          <div>✉️ {t.email}</div>
                        </td>
                        <td className="p-4 sm:p-5 text-xs text-gray-500">
                          {new Date(t.createdAt).toLocaleDateString("tr-TR")}
                        </td>
                        <td className="p-4 sm:p-5">
                          <span
                            className={`inline-block text-xs px-2.5 py-1 rounded-full font-bold border ${
                              t.status === "İletişime Geçildi"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : "bg-amber-50 text-amber-700 border-amber-200"
                            }`}
                          >
                            {t.status === "İletişime Geçildi" ? "Onaylandı" : "Beklemede"}
                          </span>
                        </td>
                        <td className="p-4 sm:p-5 text-right flex items-center justify-end gap-2">
                          {t.status === "İletişime Geçildi" && (
                            <a
                              href={`/ogretmenler/${t.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs px-3 py-1.5 rounded-lg border font-black bg-white hover:bg-gray-50 text-[#1E3A8A] border-[#EFECE6] transition-all flex items-center gap-1 shadow-xs"
                            >
                              🔍 Profili Gör
                            </a>
                          )}
                          <button
                            onClick={() => handleUpdateStatus(t.id, "teacher", t.status)}
                            className={`text-xs px-3.5 py-1.5 rounded-lg border font-black transition-all shadow-xs ${
                              t.status === "İletişime Geçildi"
                                ? "bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-200"
                                : "bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600"
                            }`}
                          >
                            {t.status === "İletişime Geçildi" ? "Beklemeye Al" : "Onayla ve Yayına Al"}
                          </button>
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
                    <th className="p-4 sm:p-5">Kayıt Tarihi</th>
                    <th className="p-4 sm:p-5">Durum</th>
                    <th className="p-4 sm:p-5 text-right">İşlem</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EFECE6] font-semibold text-gray-700">
                  {students.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-10 text-center text-gray-400">
                        Henüz kayıtlı öğrenci bulunmuyor.
                      </td>
                    </tr>
                  ) : (
                    students.map((s) => (
                      <tr key={s.id} className="hover:bg-[#FAF8F5]/50 transition-colors">
                        <td className="p-4 sm:p-5 font-black text-gray-900">{s.name}</td>
                        <td className="p-4 sm:p-5 space-y-0.5 text-xs">
                          <div>📞 {s.phone}</div>
                          <div>✉️ {s.email}</div>
                        </td>
                        <td className="p-4 sm:p-5 text-xs text-gray-500">
                          {new Date(s.createdAt).toLocaleDateString("tr-TR")}
                        </td>
                        <td className="p-4 sm:p-5">
                          <span
                            className={`inline-block text-xs px-2.5 py-1 rounded-full font-bold border ${
                              s.status === "İletişime Geçildi"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : "bg-amber-50 text-amber-700 border-amber-200"
                            }`}
                          >
                            {s.status}
                          </span>
                        </td>
                        <td className="p-4 sm:p-5 text-right">
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
                <div className="grid sm:grid-cols-2 gap-4">
                  {feedbacks.map((f) => (
                    <div key={f.id} className="p-4 bg-[#FAF8F5] border border-[#EFECE6] rounded-2xl relative shadow-xs">
                      <div className="flex justify-between items-center mb-2">
                        <div>
                          <span className="font-black text-sm text-[#1E3A8A] block">{f.studentName}</span>
                          <span className="text-[10px] text-gray-400">{f.studentEmail || "E-posta Gizli"}</span>
                        </div>
                        <div className="text-right">
                          <span className="bg-amber-50 text-amber-700 border border-amber-200 font-black text-xs px-2 py-0.5 rounded-md">
                            {f.rating} ★
                          </span>
                        </div>
                      </div>
                      <p className="text-gray-655 text-xs font-semibold leading-relaxed mb-4 p-3 bg-white rounded-xl border border-[#EFECE6]/50">
                        {f.content}
                      </p>
                      <div className="flex justify-between items-center text-[10px] text-gray-500 font-bold border-t border-[#EFECE6] pt-2">
                        <span>Hedef Öğretmen: <span className="text-indigo-650 font-black">{f.teacherName}</span></span>
                        <span>{new Date(f.createdAt).toLocaleDateString("tr-TR")}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
