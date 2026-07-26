"use client";

import React, { useState, useEffect, useCallback } from "react";
import { hocalar } from "@/data/hocalar";

interface Student {
  id: number;
  name: string;
  phone: string;
  email: string;
  status: string;
}

interface Teacher {
  id: number;
  name: string;
  phone: string;
  email: string;
  branch: string;
  status: string;
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

export default function ProfilPage() {
  const [role, setRole] = useState<"student" | "teacher">("student");
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  
  // Student Auth Form States
  const [studentForm, setStudentForm] = useState({ name: "", phone: "", email: "", password: "" });
  const [studentProfile, setStudentProfile] = useState<Student | null>(null);

  // Teacher Auth Form States
  const [teacherForm, setTeacherForm] = useState({ name: "", phone: "", email: "", password: "", branch: "" });
  const [teacherProfile, setTeacherProfile] = useState<Teacher | null>(null);

  // Feedback States
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>("");
  const [feedbackContent, setFeedbackContent] = useState("");
  const [feedbackRating, setFeedbackRating] = useState<number>(5);
  const [studentFeedbacks, setStudentFeedbacks] = useState<Feedback[]>([]);
  const [teacherFeedbacks, setTeacherFeedbacks] = useState<Feedback[]>([]);
  
  // Common states
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [loading, setLoading] = useState(false);
  const [dbTeachers, setDbTeachers] = useState<any[]>([]);

  useEffect(() => {
    // Check auto-login from localstorage on mount
    const savedRole = localStorage.getItem("derslinex_role");
    const savedUser = localStorage.getItem("derslinex_user");
    
    if (savedRole && savedUser) {
      const parsedUser = JSON.parse(savedUser);
      if (savedRole === "student") {
        setStudentProfile(parsedUser);
        setRole("student");
      } else {
        setTeacherProfile(parsedUser);
        setRole("teacher");
      }
    }

    fetchDbTeachers();
  }, []);

  const fetchDbTeachers = async () => {
    try {
      const res = await fetch("/api/profil/ogretmen");
      const data = await res.json();
      if (data.success) {
        setDbTeachers(data.teachers || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const showMsg = (text: string, type: "success" | "error") => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 5000);
  };

  const handleLogout = () => {
    localStorage.removeItem("derslinex_role");
    localStorage.removeItem("derslinex_user");
    setStudentProfile(null);
    setTeacherProfile(null);
    setStudentFeedbacks([]);
    setTeacherFeedbacks([]);
    showMsg("Oturum kapatıldı.", "success");
  };

  // STUDENT AUTH & SAVE
  const handleStudentAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const endpoint = authMode === "login" ? "/api/auth/login/ogrenci" : "/api/auth/register/ogrenci";
      const payload = authMode === "login" 
        ? { email: studentForm.email, password: studentForm.password }
        : studentForm;

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        const student = data.student;
        setStudentProfile(student);
        localStorage.setItem("derslinex_role", "student");
        localStorage.setItem("derslinex_user", JSON.stringify(student));
        showMsg(authMode === "login" ? "Giriş başarılı!" : "Kayıt başarıyla oluşturuldu!", "success");
      } else {
        showMsg(data.error || "Giriş/Kayıt işlemi başarısız.", "error");
      }
    } catch (err) {
      showMsg("Bağlantı hatası oluştu.", "error");
    } finally {
      setLoading(false);
    }
  };

  // TEACHER AUTH & SAVE
  const handleTeacherAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const endpoint = authMode === "login" ? "/api/auth/login/ogretmen" : "/api/auth/register/ogretmen";
      const payload = authMode === "login" 
        ? { email: teacherForm.email, password: teacherForm.password }
        : teacherForm;

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        const teacher = data.teacher;
        setTeacherProfile(teacher);
        localStorage.setItem("derslinex_role", "teacher");
        localStorage.setItem("derslinex_user", JSON.stringify(teacher));
        showMsg(authMode === "login" ? "Giriş başarılı!" : "Başvurunuz alındı ve kayıt oluşturuldu!", "success");
        fetchDbTeachers(); // Refresh teacher list
      } else {
        showMsg(data.error || "Giriş/Kayıt işlemi başarısız.", "error");
      }
    } catch (err) {
      showMsg("Bağlantı hatası oluştu.", "error");
    } finally {
      setLoading(false);
    }
  };

  // FEEDBACKS
  const fetchStudentFeedbacks = useCallback(async () => {
    if (!studentProfile) return;
    try {
      const res = await fetch("/api/gorus");
      const data = await res.json();
      if (data.success) {
        const filtered = (data.feedbacks || []).filter(
          (f: Feedback) => f.studentEmail === studentProfile.email
        );
        setStudentFeedbacks(filtered);
      }
    } catch (e) {
      console.error(e);
    }
  }, [studentProfile]);

  useEffect(() => {
    if (studentProfile) {
      fetchStudentFeedbacks();
    }
  }, [studentProfile, fetchStudentFeedbacks]);

  const fetchTeacherFeedbacks = useCallback(async (tId: number) => {
    try {
      const res = await fetch(`/api/gorus?teacherId=${tId}`);
      const data = await res.json();
      if (data.success) {
        setTeacherFeedbacks(data.feedbacks || []);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    if (teacherProfile) {
      fetchTeacherFeedbacks(teacherProfile.id);
    }
  }, [teacherProfile, fetchTeacherFeedbacks]);

  const handleSendFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentProfile) return;
    if (!selectedTeacherId || !feedbackContent.trim()) {
      showMsg("Lütfen öğretmen seçin ve görüşünüzü yazın.", "error");
      return;
    }

    setLoading(true);
    try {
      let teacherName = "";
      const sId = selectedTeacherId;
      if (sId.startsWith("static-")) {
        const found = hocalar.find((h) => h.id === sId.replace("static-", ""));
        teacherName = found ? found.isim : "Öğretmen";
      } else {
        const found = dbTeachers.find((h) => h.id.toString() === sId);
        teacherName = found ? found.name : "Öğretmen";
      }

      const res = await fetch("/api/gorus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentName: studentProfile.name,
          studentEmail: studentProfile.email,
          teacherId: sId.startsWith("static-") ? parseInt(sId.replace("static-", "")) * 1000 : parseInt(sId),
          teacherName,
          content: feedbackContent,
          rating: feedbackRating,
        }),
      });

      const data = await res.json();
      if (data.success) {
        showMsg("Görüşünüz / talebiniz başarıyla iletildi!", "success");
        setFeedbackContent("");
        fetchStudentFeedbacks();
      } else {
        showMsg(data.error || "Görüş gönderilemedi", "error");
      }
    } catch (err) {
      showMsg("Bir hata oluştu", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <span className="text-[#B45309] text-xs font-black uppercase tracking-widest block mb-2">DERSLINEX PORTALI</span>
          <h1 className="text-4xl sm:text-5xl font-black text-[#1E3A8A] leading-tight">Profil & Giriş Sistemi</h1>
          <p className="text-gray-500 font-semibold mt-2">
            Öğrenci veya öğretmen hesabı oluşturarak derslerinizi, görüş ve randevu taleplerinizi yönetin.
          </p>
        </div>

        {/* Global Alert */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-xl text-sm font-bold border transition-all shadow-sm flex items-center justify-between ${
              message.type === "success"
                ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                : "bg-rose-50 text-rose-800 border-rose-200"
            }`}
          >
            <span>{message.text}</span>
            <button className="text-xs opacity-60 hover:opacity-100" onClick={() => setMessage(null)}>✕</button>
          </div>
        )}

        {/* Auth Mode & Role Switch Container */}
        {(!studentProfile && !teacherProfile) && (
          <div className="space-y-6">
            {/* Role Select */}
            <div className="grid grid-cols-2 bg-white/70 backdrop-blur border border-[#EFECE6] p-1.5 rounded-2xl shadow-sm">
              <button
                onClick={() => { setRole("student"); setAuthMode("login"); }}
                className={`py-3 px-4 text-xs sm:text-sm font-black rounded-xl transition-all duration-200 ${
                  role === "student" ? "bg-[#1E3A8A] text-white shadow-sm" : "text-gray-600 hover:bg-white"
                }`}
              >
                🎓 Öğrenci Giriş/Kayıt
              </button>
              <button
                onClick={() => { setRole("teacher"); setAuthMode("login"); }}
                className={`py-3 px-4 text-xs sm:text-sm font-black rounded-xl transition-all duration-200 ${
                  role === "teacher" ? "bg-[#1E3A8A] text-white shadow-sm" : "text-gray-600 hover:bg-white"
                }`}
              >
                👨‍🏫 Öğretmen Giriş/Kayıt
              </button>
            </div>

            {/* Auth mode toggle link */}
            <div className="text-center">
              <span className="text-xs text-gray-500 font-bold">
                {authMode === "login" ? "Hesabınız yok mu?" : "Zaten üye misiniz?"}{" "}
                <button
                  onClick={() => setAuthMode(authMode === "login" ? "register" : "login")}
                  className="text-[#B45309] font-black underline ml-1 hover:text-[#92400E]"
                >
                  {authMode === "login" ? "Kayıt Olun" : "Giriş Yapın"}
                </button>
              </span>
            </div>

            {/* AUTH FORMS */}
            <div className="bg-white rounded-3xl border border-[#EFECE6] p-6 sm:p-8 shadow-sm">
              <h3 className="text-lg font-black text-[#1E3A8A] mb-6 text-center">
                {role === "student" ? "🎓 Öğrenci" : "👨‍🏫 Öğretmen"}{" "}
                {authMode === "login" ? "Giriş Paneli" : "Kayıt Paneli"}
              </h3>

              {role === "student" ? (
                <form onSubmit={handleStudentAuth} className="space-y-4">
                  {authMode === "register" && (
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-2">Adı Soyadı</label>
                        <input
                          type="text"
                          required
                          value={studentForm.name}
                          onChange={(e) => setStudentForm({ ...studentForm, name: e.target.value })}
                          className="w-full bg-[#FAF8F5] border border-[#EFECE6] px-4 py-3 rounded-xl text-sm font-bold focus:outline-none focus:border-[#FAF0E3]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-2">Telefon</label>
                        <input
                          type="text"
                          required
                          placeholder="05xx xxx xx xx"
                          value={studentForm.phone}
                          onChange={(e) => setStudentForm({ ...studentForm, phone: e.target.value })}
                          className="w-full bg-[#FAF8F5] border border-[#EFECE6] px-4 py-3 rounded-xl text-sm font-bold focus:outline-none focus:border-[#FAF0E3]"
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-2">E-posta Adresi</label>
                    <input
                      type="email"
                      required
                      value={studentForm.email}
                      onChange={(e) => setStudentForm({ ...studentForm, email: e.target.value })}
                      className="w-full bg-[#FAF8F5] border border-[#EFECE6] px-4 py-3 rounded-xl text-sm font-bold focus:outline-none focus:border-[#FAF0E3]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-2">Şifre</label>
                    <input
                      type="password"
                      required
                      value={studentForm.password}
                      onChange={(e) => setStudentForm({ ...studentForm, password: e.target.value })}
                      className="w-full bg-[#FAF8F5] border border-[#EFECE6] px-4 py-3 rounded-xl text-sm font-bold focus:outline-none focus:border-[#FAF0E3]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white font-black py-3.5 rounded-xl text-sm transition-all"
                  >
                    {loading ? "İşlem yapılıyor..." : authMode === "login" ? "Giriş Yap" : "Kayıt Ol"}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleTeacherAuth} className="space-y-4">
                  {authMode === "register" && (
                    <>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-2">Adı Soyadı</label>
                          <input
                            type="text"
                            required
                            value={teacherForm.name}
                            onChange={(e) => setTeacherForm({ ...teacherForm, name: e.target.value })}
                            className="w-full bg-[#FAF8F5] border border-[#EFECE6] px-4 py-3 rounded-xl text-sm font-bold focus:outline-none focus:border-[#FAF0E3]"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-2">Telefon</label>
                          <input
                            type="text"
                            required
                            placeholder="05xx xxx xx xx"
                            value={teacherForm.phone}
                            onChange={(e) => setTeacherForm({ ...teacherForm, phone: e.target.value })}
                            className="w-full bg-[#FAF8F5] border border-[#EFECE6] px-4 py-3 rounded-xl text-sm font-bold focus:outline-none focus:border-[#FAF0E3]"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-2">Uzmanlık Branşınız</label>
                        <input
                          type="text"
                          required
                          placeholder="Matematik, Fizik vb."
                          value={teacherForm.branch}
                          onChange={(e) => setTeacherForm({ ...teacherForm, branch: e.target.value })}
                          className="w-full bg-[#FAF8F5] border border-[#EFECE6] px-4 py-3 rounded-xl text-sm font-bold focus:outline-none focus:border-[#FAF0E3]"
                        />
                      </div>
                    </>
                  )}

                  <div>
                    <label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-2">E-posta Adresi</label>
                    <input
                      type="email"
                      required
                      value={teacherForm.email}
                      onChange={(e) => setTeacherForm({ ...teacherForm, email: e.target.value })}
                      className="w-full bg-[#FAF8F5] border border-[#EFECE6] px-4 py-3 rounded-xl text-sm font-bold focus:outline-none focus:border-[#FAF0E3]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-2">Şifre</label>
                    <input
                      type="password"
                      required
                      value={teacherForm.password}
                      onChange={(e) => setTeacherForm({ ...teacherForm, password: e.target.value })}
                      className="w-full bg-[#FAF8F5] border border-[#EFECE6] px-4 py-3 rounded-xl text-sm font-bold focus:outline-none focus:border-[#FAF0E3]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white font-black py-3.5 rounded-xl text-sm transition-all"
                  >
                    {loading ? "İşlem yapılıyor..." : authMode === "login" ? "Giriş Yap" : "Kayıt Ol / Başvur"}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

        {/* LOGGED IN WORKSPACES */}
        {(studentProfile || teacherProfile) && (
          <div className="space-y-8">
            <div className="flex justify-between items-center bg-white border border-[#EFECE6] p-4 sm:p-5 rounded-3xl shadow-xs">
              <div>
                <span className="text-[10px] text-[#B45309] font-black uppercase tracking-widest">AKTİF OTURUM</span>
                <h4 className="text-base font-black text-[#1E3A8A]">
                  Merhaba, {studentProfile ? studentProfile.name : teacherProfile?.name}
                </h4>
                <p className="text-xs text-gray-500 font-bold">
                  Rol: {studentProfile ? "🎓 Öğrenci" : `👨‍🏫 Öğretmen (${teacherProfile?.branch})`} | Onay: {studentProfile ? studentProfile.status : teacherProfile?.status}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="bg-rose-50 hover:bg-rose-100 text-rose-700 font-black text-xs px-4 py-2.5 rounded-xl transition"
              >
                Oturumu Kapat ✕
              </button>
            </div>

            {/* Student View (Send Feedback) */}
            {studentProfile && (
              <div className="grid md:grid-cols-12 gap-8">
                {/* Feedback Form */}
                <div className="md:col-span-7 bg-white rounded-3xl border border-[#EFECE6] p-6 sm:p-8 shadow-sm">
                  <h3 className="text-lg font-black text-[#1E3A8A] mb-4">Görüş / Randevu Talebi Gönder</h3>
                  <form onSubmit={handleSendFeedback} className="space-y-4">
                    <div>
                      <label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-2">Öğretmen Seçin</label>
                      <select
                        value={selectedTeacherId}
                        onChange={(e) => setSelectedTeacherId(e.target.value)}
                        required
                        className="w-full bg-[#FAF8F5] border border-[#EFECE6] px-4 py-3 rounded-xl text-sm font-bold focus:outline-none"
                      >
                        <option value="">Lütfen listeden seçin...</option>
                        <optgroup label="Sistem Öğretmenleri">
                          {hocalar.map((h) => (
                            <option key={`static-${h.id}`} value={`static-${h.id}`}>
                              {h.isim} ({h.dersler.join(", ")})
                            </option>
                          ))}
                        </optgroup>
                        {dbTeachers.length > 0 && (
                          <optgroup label="Yeni Kayıtlı Öğretmenler">
                            {dbTeachers.map((h) => (
                              <option key={h.id} value={h.id}>
                                {h.name} ({h.branch})
                              </option>
                            ))}
                          </optgroup>
                        )}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-2">Puanınız (1 - 5)</label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((num) => (
                          <button
                            key={num}
                            type="button"
                            onClick={() => setFeedbackRating(num)}
                            className={`w-10 h-10 rounded-xl font-black text-sm transition-all border ${
                              feedbackRating === num
                                ? "bg-amber-500 text-white border-amber-500"
                                : "bg-[#FAF8F5] text-gray-600 border-[#EFECE6]"
                            }`}
                          >
                            {num} ★
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-2">Mesajınız / Talebiniz</label>
                      <textarea
                        rows={4}
                        value={feedbackContent}
                        onChange={(e) => setFeedbackContent(e.target.value)}
                        required
                        placeholder="Öğretmenle ilgili görüşlerinizi veya ders saati talebinizi yazın..."
                        className="w-full bg-[#FAF8F5] border border-[#EFECE6] px-4 py-3 rounded-xl text-sm font-bold focus:outline-none focus:border-[#FAF0E3]"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white font-black py-3.5 rounded-xl text-sm transition-all"
                    >
                      Görüşü / Talebi Gönder
                    </button>
                  </form>
                </div>

                {/* Past Feedbacks */}
                <div className="md:col-span-5 bg-white rounded-3xl border border-[#EFECE6] p-6 shadow-sm">
                  <h3 className="text-base font-black text-[#1E3A8A] mb-4">Geçmiş Görüşleriniz</h3>
                  {studentFeedbacks.length === 0 ? (
                    <p className="text-xs text-gray-500 font-bold">Henüz görüş belirtmemişsiniz.</p>
                  ) : (
                    <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1">
                      {studentFeedbacks.map((f) => (
                        <div key={f.id} className="p-3 bg-[#FAF8F5] border border-[#EFECE6] rounded-xl text-xs space-y-1">
                          <div className="flex justify-between items-center">
                            <span className="font-black text-[#1E3A8A]">{f.teacherName}</span>
                            <span className="text-amber-500 font-black">{f.rating} ★</span>
                          </div>
                          <p className="text-gray-600 font-semibold">{f.content}</p>
                          <span className="text-[9px] text-gray-400 block text-right">
                            {new Date(f.createdAt).toLocaleDateString("tr-TR")}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Teacher View (Received Feedbacks) */}
            {teacherProfile && (
              <div className="bg-white rounded-3xl border border-[#EFECE6] p-6 sm:p-8 shadow-sm">
                <h3 className="text-lg font-black text-[#1E3A8A] mb-4">Öğrencilerden Gelen Görüşler & Talepler</h3>
                {teacherFeedbacks.length === 0 ? (
                  <p className="text-sm text-gray-500 font-semibold">Henüz size iletilen bir görüş veya randevu talebi bulunmamaktadır.</p>
                ) : (
                  <div className="grid sm:grid-cols-2 gap-4">
                    {teacherFeedbacks.map((f) => (
                      <div key={f.id} className="p-4 bg-[#FAF8F5] border border-[#EFECE6] rounded-2xl relative shadow-xs">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-black text-sm text-[#1E3A8A]">{f.studentName}</span>
                          <span className="text-amber-500 font-bold text-xs">{f.rating} ★</span>
                        </div>
                        <p className="text-gray-655 text-xs font-semibold leading-relaxed mb-3">{f.content}</p>
                        <div className="flex justify-between items-center text-[10px] text-gray-400">
                          <span>{f.studentEmail || "E-posta Gizli"}</span>
                          <span>{new Date(f.createdAt).toLocaleDateString("tr-TR")}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
