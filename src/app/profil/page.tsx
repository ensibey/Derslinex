"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { hocalar } from "@/data/hocalar";
import Link from "next/link";

// ─── Yardımcı: Geri Sayım ─────────────────────────────────────────────────────
function useCountdown(targetDate: string | Date | null) {
  const [diff, setDiff] = useState(0);
  useEffect(() => {
    if (!targetDate) return;
    const update = () => setDiff(new Date(targetDate).getTime() - Date.now());
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [targetDate]);
  const totalSec = Math.max(0, Math.floor(diff / 1000));
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return { diff, label: `${pad(h)}:${pad(m)}:${pad(s)}`, isNow: diff <= 10 * 60_000 && diff > 0 };
}

// ─── Session Card (dark theme for student sidebar) ────────────────────────────
function SessionCardDark({ session, role }: { session: any; role: "student" | "teacher" }) {
  const { label, diff } = useCountdown(
    session.status === "SCHEDULED" || session.status === "LIVE" ? session.startTime : null
  );
  const startMs = new Date(session.startTime).getTime();
  const endMs = startMs + (session.durationMinutes || 60) * 60_000;
  const nowMs = Date.now();
  const fifteenMinsBefore = startMs - 15 * 60_000;
  const isEnded = session.status === "ENDED" || nowMs > endMs;
  const isLive = session.status === "LIVE";
  const canJoin = !isEnded && (isLive || role === "teacher" || nowMs >= fifteenMinsBefore);

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-3 hover:bg-white/10 transition">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1">
            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
              isLive ? "bg-red-500/20 text-red-400 animate-pulse" :
              isEnded ? "bg-gray-500/20 text-gray-400" :
              "bg-blue-500/20 text-blue-400"
            }`}>{isLive ? "🔴 CANLI" : isEnded ? "✅ Bitti" : "📅 Planlandı"}</span>
          </div>
          <p className="font-black text-white text-xs truncate">{session.title}</p>
          {session.teacher && (
            <p className="text-[10px] text-slate-400 mt-0.5">{session.teacher.name}</p>
          )}
          <p className="text-[10px] text-indigo-400 mt-0.5">
            {new Date(session.startTime).toLocaleString("tr-TR", { timeZone: "Europe/Istanbul", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
          </p>
        </div>
        {!isEnded && (
          canJoin ? (
            <Link href={`/ders/${session.id}`}>
              <button className="bg-red-600 hover:bg-red-500 text-white font-black text-[10px] px-2.5 py-1.5 rounded-lg transition flex-shrink-0">
                🚀 Katıl
              </button>
            </Link>
          ) : (
            <div className="text-right flex-shrink-0">
              <div className="font-black text-sm text-indigo-300 tabular-nums">{label}</div>
              <div className="text-[9px] text-slate-500">sonra</div>
            </div>
          )
        )}
      </div>
    </div>
  );
}

// ─── Session Card (light theme for sessions tab) ──────────────────────────────
function SessionCard({ session, role }: { session: any; role: "student" | "teacher" }) {
  const { label } = useCountdown(
    session.status === "SCHEDULED" || session.status === "LIVE" ? session.startTime : null
  );
  const startMs = new Date(session.startTime).getTime();
  const endMs = startMs + (session.durationMinutes || 60) * 60_000;
  const nowMs = Date.now();
  const fifteenMinsBefore = startMs - 15 * 60_000;
  const isEnded = session.status === "ENDED" || nowMs > endMs;
  const isLive = session.status === "LIVE";
  const canJoin = !isEnded && (isLive || role === "teacher" || nowMs >= fifteenMinsBefore);

  return (
    <div className="bg-[#1E293B] border border-white/10 rounded-2xl p-5">
      <div className="flex flex-wrap justify-between gap-3 mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className={`text-xs font-black px-2.5 py-0.5 rounded-full ${
              isLive ? "bg-red-500/20 text-red-400 animate-pulse" :
              isEnded ? "bg-gray-500/20 text-gray-400" :
              "bg-blue-500/20 text-blue-400"
            }`}>{isLive ? "🔴 CANLI" : isEnded ? "✅ Bitti" : "📅 Planlandı"}</span>
            {session.recordSession && <span className="text-xs font-bold bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full">🔴 Kayıtlı</span>}
          </div>
          <h4 className="font-black text-white text-base">{session.title}</h4>
          {role === "student" && session.teacher && (
            <p className="text-xs text-slate-400 font-semibold mt-0.5">👨🏫 {session.teacher.name} — {session.teacher.branch}</p>
          )}
          <p className="text-xs text-indigo-400 font-bold mt-0.5">
            🕐 {new Date(session.startTime).toLocaleString("tr-TR", { timeZone: "Europe/Istanbul" })} • {session.durationMinutes} dk
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          {!isEnded && (
            <div className="text-right">
              {canJoin ? (
                <Link href={`/ders/${session.id}`}>
                  <button className="bg-red-600 hover:bg-red-500 text-white font-black text-sm px-6 py-3 rounded-xl transition shadow-md animate-pulse">
                    🚀 {role === "teacher" ? "Yayını Başlat / Katıl" : "Derse Katıl"}
                  </button>
                </Link>
              ) : (
                <div className="text-center">
                  <div className="font-black text-2xl text-indigo-300 tabular-nums">{label}</div>
                  <div className="text-xs text-slate-500 font-semibold">sonra başlıyor</div>
                  <button disabled className="mt-2 opacity-40 cursor-not-allowed bg-slate-700 text-slate-400 font-black text-xs px-4 py-2 rounded-xl">15 dk kala aktifleşir</button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      {session.resources?.length > 0 && (
        <div className="border-t border-white/10 pt-3 mt-1">
          <p className="text-xs font-black text-slate-500 uppercase tracking-wider mb-2">📎 Ders Materyalleri</p>
          <div className="flex flex-wrap gap-2">
            {session.resources.map((r: any) => (
              <a key={r.id} href={r.fileUrl} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg text-xs font-bold text-indigo-400 hover:bg-white/10 transition">
                📄 {r.title}
              </a>
            ))}
          </div>
        </div>
      )}
      {isEnded && (
        <div className="border-t border-white/10 pt-3 mt-1 space-y-2">
          {session.recordingUrl && (
            <a href={session.recordingUrl} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-400 hover:underline">
              📹 Ders Kaydını İzle
            </a>
          )}
          {role === "student" && session.myFeedback && (
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3">
              <p className="text-xs font-black text-amber-400 mb-1">⭐ {"★".repeat(session.myFeedback.rating)}{"☆".repeat(5 - session.myFeedback.rating)} — Öğretmen Değerlendirmesi</p>
              {session.myFeedback.comment && <p className="text-xs text-amber-300 font-semibold">"{session.myFeedback.comment}"</p>}
              {session.myFeedback.homeworkGiven && <span className="inline-block mt-1 text-xs font-bold bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full">📝 Ödev verildi</span>}
            </div>
          )}
          {role === "student" && session.participation && (
            <span className={`inline-block text-xs font-bold px-2.5 py-0.5 rounded-full ${session.participation.isAttended ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
              {session.participation.isAttended ? "✅ Yoklama: Katıldı" : "❌ Yoklama: Katılmadı"}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

function StudentSessionsTab({ userId }: { userId: number }) {
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch("/api/user/my-sessions", { headers: { "x-user-id": String(userId), "x-user-role": "student" } })
      .then((r) => r.json())
      .then((d) => { if (d.success) setSessions(d.sessions); })
      .finally(() => setLoading(false));
  }, [userId]);
  const upcoming = sessions.filter((s) => s.status !== "ENDED" && s.status !== "CANCELLED");
  const past = sessions.filter((s) => s.status === "ENDED");
  if (loading) return <div className="py-12 text-center text-slate-500 font-semibold">Yükleniyor...</div>;
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-base font-black text-indigo-400 mb-4">📅 Yaklaşan Canlı Derslerim ({upcoming.length})</h3>
        {upcoming.length === 0 ? <p className="text-sm text-slate-500 font-semibold py-6 text-center">Yaklaşan dersiniz bulunmuyor.</p> : <div className="space-y-4">{upcoming.map((s) => <SessionCard key={s.id} session={s} role="student" />)}</div>}
      </div>
      <div>
        <h3 className="text-base font-black text-indigo-400 mb-4">🕐 Geçmiş Derslerim & Öğretmen Notları ({past.length})</h3>
        {past.length === 0 ? <p className="text-sm text-slate-500 font-semibold py-6 text-center">Henüz tamamlanan dersiniz yok.</p> : <div className="space-y-4">{past.map((s) => <SessionCard key={s.id} session={s} role="student" />)}</div>}
      </div>
    </div>
  );
}

function TeacherSessionsTab({ userId }: { userId: number }) {
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch("/api/user/my-sessions", { headers: { "x-user-id": String(userId), "x-user-role": "teacher" } })
      .then((r) => r.json())
      .then((d) => { if (d.success) setSessions(d.sessions); })
      .finally(() => setLoading(false));
  }, [userId]);
  const upcoming = sessions.filter((s) => s.status !== "ENDED" && s.status !== "CANCELLED");
  const past = sessions.filter((s) => s.status === "ENDED");
  if (loading) return <div className="py-12 text-center text-gray-400 font-semibold">Yükleniyor...</div>;
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-base font-black text-[#1E3A8A] mb-4">📅 Yaklaşan Canlı Derslerim ({upcoming.length})</h3>
        {upcoming.length === 0 ? <p className="text-sm text-gray-400 font-semibold py-6 text-center">Planlı dersiniz bulunmuyor.</p> : <div className="space-y-4">{upcoming.map((s) => <SessionCard key={s.id} session={s} role="teacher" />)}</div>}
      </div>
      <div>
        <h3 className="text-base font-black text-[#1E3A8A] mb-4">🕐 Geçmiş Derslerim ({past.length})</h3>
        {past.length === 0 ? <p className="text-sm text-gray-400 font-semibold py-6 text-center">Tamamlanan dersiniz yok.</p> : <div className="space-y-4">{past.map((s) => <SessionCard key={s.id} session={s} role="teacher" />)}</div>}
      </div>
    </div>
  );
}

// ─── Interfaces ────────────────────────────────────────────────────────────────
interface Student { id: number; name: string; phone: string; email: string; status: string; avatar?: string | null; }
interface Teacher { id: number; name: string; phone: string; email: string; branch: string; status: string; egitim?: string | null; ozgecmis?: string | null; linkedin?: string | null; youtube?: string | null; avatar?: string | null; }
interface Feedback { id: number; studentName: string; studentEmail: string | null; teacherId: number; teacherName: string; content: string; rating: number; createdAt: string; }

// ─── Student Sidebar Nav Items ─────────────────────────────────────────────────
const STUDENT_NAV = [
  { id: "panel",         icon: "🏠", label: "Genel Görünüm" },
  { id: "canli",         icon: "🎥", label: "Canlı Derslerim" },
  { id: "mesajlar",      icon: "💬", label: "Mesajlar" },
  { id: "degerlendirme", icon: "⭐", label: "Değerlendirmeler" },
  { id: "duzenle",       icon: "⚙️", label: "Profil Düzenle" },
];

// ─── Ana Sayfa ─────────────────────────────────────────────────────────────────
export default function ProfilPage() {
  const [role, setRole] = useState<"student" | "teacher">("student");
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [rememberMe, setRememberMe] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [studentForm, setStudentForm] = useState({ name: "", phone: "", email: "", password: "" });
  const [studentProfile, setStudentProfile] = useState<Student | null>(null);
  const [editingStudent, setEditingStudent] = useState(false);
  const [studentEditForm, setStudentEditForm] = useState({ name: "", phone: "", avatar: "" });

  const [teacherForm, setTeacherForm] = useState({ name: "", phone: "", email: "", password: "", branch: "" });
  const [teacherProfile, setTeacherProfile] = useState<Teacher | null>(null);
  const [editingTeacher, setEditingTeacher] = useState(false);
  const [teacherEditForm, setTeacherEditForm] = useState({ name: "", phone: "", branch: "", egitim: "", ozgecmis: "", linkedin: "", youtube: "", avatar: "" });

  const [teacherLessons, setTeacherLessons] = useState<any[]>([]);
  const [teacherBlogs, setTeacherBlogs] = useState<any[]>([]);
  const [teacherFaqs, setTeacherFaqs] = useState<any[]>([]);
  const [addingLesson, setAddingLesson] = useState(false);
  const [writingBlog, setWritingBlog] = useState(false);
  const [addingFaq, setAddingFaq] = useState(false);
  const [lessonForm, setLessonForm] = useState({ title: "", price: "", format: "online", description: "" });
  const [blogForm, setBlogForm] = useState({ title: "", category: "YKS Bilgi", content: "" });
  const [faqForm, setFaqForm] = useState({ question: "", answer: "" });

  const [dashboardTab, setDashboardTab] = useState<"panel" | "duzenle" | "dersler" | "bloglar" | "faq" | "mesajlar" | "canli" | "degerlendirme">("panel");
  const [chatRooms, setChatRooms] = useState<any[]>([]);
  const [activeRoomId, setActiveRoomId] = useState<number | null>(null);
  const [activeRoomMessages, setActiveRoomMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");

  const [selectedTeacherId, setSelectedTeacherId] = useState<string>("");
  const [feedbackContent, setFeedbackContent] = useState("");
  const [feedbackRating, setFeedbackRating] = useState<number>(5);
  const [studentFeedbacks, setStudentFeedbacks] = useState<Feedback[]>([]);
  const [teacherFeedbacks, setTeacherFeedbacks] = useState<Feedback[]>([]);

  const [studentSessions, setStudentSessions] = useState<any[]>([]);

  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [loading, setLoading] = useState(false);
  const [dbTeachers, setDbTeachers] = useState<any[]>([]);

  const fetchTeacherDashboardData = useCallback(async (teacherId: number) => {
    try {
      const [lRes, bRes, fRes] = await Promise.all([
        fetch(`/api/profil/ogretmen/dersler?teacherId=${teacherId}`),
        fetch(`/api/blog/yazar?authorId=${teacherId}`),
        fetch(`/api/profil/ogretmen/faq?teacherId=${teacherId}`),
      ]);
      const lData = await lRes.json();
      const bData = await bRes.json();
      const fData = await fRes.json();
      if (lData.success) setTeacherLessons(lData.lessons || []);
      if (bData.success) setTeacherBlogs(bData.posts || []);
      if (fData.success) setTeacherFaqs(fData.faqs || []);
    } catch (e) { console.error("Dashboard data fetch error:", e); }
  }, []);

  // Load student sessions for sidebar preview
  const fetchStudentSessions = useCallback(async (userId: number) => {
    try {
      const res = await fetch("/api/user/my-sessions", { headers: { "x-user-id": String(userId), "x-user-role": "student" } });
      const d = await res.json();
      if (d.success) setStudentSessions(d.sessions || []);
    } catch (e) { console.error(e); }
  }, []);

  useEffect(() => {
    const savedRole = localStorage.getItem("derslinex_role") || sessionStorage.getItem("derslinex_role");
    const savedUser = localStorage.getItem("derslinex_user") || sessionStorage.getItem("derslinex_user");
    if (savedRole && savedUser) {
      const parsedUser = JSON.parse(savedUser);
      if (savedRole === "student") {
        setStudentProfile(parsedUser);
        setStudentEditForm({ name: parsedUser.name, phone: parsedUser.phone, avatar: parsedUser.avatar || "" });
        setRole("student");
        fetchStudentSessions(parsedUser.id);
      } else {
        setTeacherProfile(parsedUser);
        setTeacherEditForm({ name: parsedUser.name, phone: parsedUser.phone, branch: parsedUser.branch, egitim: parsedUser.egitim || "", ozgecmis: parsedUser.ozgecmis || "", linkedin: parsedUser.linkedin || "", youtube: parsedUser.youtube || "", avatar: parsedUser.avatar || "" });
        setRole("teacher");
        fetchTeacherDashboardData(parsedUser.id);
      }
    }
    fetchDbTeachers();
  }, [fetchTeacherDashboardData, fetchStudentSessions]);

  const fetchChatRooms = useCallback(async () => {
    let url = "";
    if (role === "student" && studentProfile) url = `/api/chat/rooms?studentId=${studentProfile.id}`;
    else if (role === "teacher" && teacherProfile) url = `/api/chat/rooms?teacherId=${teacherProfile.id}`;
    else return;
    try {
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) setChatRooms(data.rooms || []);
    } catch (e) { console.error("Rooms fetch error:", e); }
  }, [role, studentProfile, teacherProfile]);

  useEffect(() => {
    if (!studentProfile && !teacherProfile) return;
    fetchChatRooms();
    const interval = setInterval(fetchChatRooms, 10000);
    return () => clearInterval(interval);
  }, [studentProfile, teacherProfile, fetchChatRooms]);

  useEffect(() => {
    if (!activeRoomId) return;
    const fetchMessages = async () => {
      try {
        const res = await fetch(`/api/chat/messages?roomId=${activeRoomId}`);
        const data = await res.json();
        if (data.success) setActiveRoomMessages(data.messages || []);
      } catch (e) { console.error("Messages fetch error:", e); }
    };
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [activeRoomId]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const startChatTeacherId = params.get("startChatWithTeacherId");
    const startChatTeacherName = params.get("teacherName");
    if (startChatTeacherId && startChatTeacherName) {
      window.history.replaceState({}, document.title, window.location.pathname);
      const initiateChat = async () => {
        const savedRole = localStorage.getItem("derslinex_role") || sessionStorage.getItem("derslinex_role");
        const savedUser = localStorage.getItem("derslinex_user") || sessionStorage.getItem("derslinex_user");
        if (savedRole === "student" && savedUser) {
          const parsedUser = JSON.parse(savedUser);
          try {
            const res = await fetch("/api/chat/rooms", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ studentId: parsedUser.id, studentName: parsedUser.name, teacherId: parseInt(startChatTeacherId), teacherName: startChatTeacherName }) });
            const data = await res.json();
            if (data.success && data.room) { setActiveRoomId(data.room.id); setDashboardTab("mesajlar"); showMsg(`${startChatTeacherName} ile sohbet başlatıldı!`, "success"); }
          } catch (e) { console.error("Chat initiation error:", e); }
        } else { showMsg("Lütfen öğretmenle sohbet başlatmak için önce Öğrenci Girişi yapın.", "error"); }
      };
      setTimeout(initiateChat, 800);
    }
  }, []);

  const fetchDbTeachers = async () => {
    try {
      const res = await fetch("/api/profil/ogretmen");
      const data = await res.json();
      if (data.success) setDbTeachers(data.teachers || []);
    } catch (e) { console.error(e); }
  };

  const showMsg = (text: string, type: "success" | "error") => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 5000);
  };

  const handleLogout = () => {
    localStorage.removeItem("derslinex_role"); localStorage.removeItem("derslinex_user");
    sessionStorage.removeItem("derslinex_role"); sessionStorage.removeItem("derslinex_user");
    setStudentProfile(null); setTeacherProfile(null);
    setStudentFeedbacks([]); setTeacherFeedbacks([]);
    showMsg("Oturum kapatıldı.", "success");
  };

  const handleStudentAuth = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    try {
      const endpoint = authMode === "login" ? "/api/auth/login/ogrenci" : "/api/auth/register/ogrenci";
      const payload = authMode === "login" ? { email: studentForm.email, password: studentForm.password } : studentForm;
      const res = await fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (data.success) {
        const student = data.student;
        setStudentProfile(student);
        setStudentEditForm({ name: student.name, phone: student.phone, avatar: student.avatar || "" });
        const storage = rememberMe ? localStorage : sessionStorage;
        storage.setItem("derslinex_role", "student"); storage.setItem("derslinex_user", JSON.stringify(student));
        fetchStudentSessions(student.id);
        showMsg(authMode === "login" ? "Giriş başarılı!" : "Kayıt başarıyla oluşturuldu!", "success");
      } else { showMsg(data.error || "Giriş/Kayıt işlemi başarısız.", "error"); }
    } catch { showMsg("Bağlantı hatası oluştu.", "error"); } finally { setLoading(false); }
  };

  const handleStudentUpdate = async (e: React.FormEvent) => {
    e.preventDefault(); if (!studentProfile) return; setLoading(true);
    try {
      const res = await fetch("/api/profil/ogrenci", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: studentProfile.email, name: studentEditForm.name, phone: studentEditForm.phone, avatar: studentEditForm.avatar }) });
      const data = await res.json();
      if (data.success) {
        const updated = data.student; setStudentProfile(updated);
        const storage = localStorage.getItem("derslinex_role") ? localStorage : sessionStorage;
        storage.setItem("derslinex_user", JSON.stringify(updated));
        window.dispatchEvent(new Event("derslinex_auth_change"));
        setEditingStudent(false); showMsg("Profil bilgileriniz başarıyla güncellendi!", "success");
      } else { showMsg(data.error || "Profil güncellenemedi.", "error"); }
    } catch { showMsg("Bağlantı hatası.", "error"); } finally { setLoading(false); }
  };

  const handleTeacherAuth = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    try {
      const endpoint = authMode === "login" ? "/api/auth/login/ogretmen" : "/api/auth/register/ogretmen";
      const payload = authMode === "login" ? { email: teacherForm.email, password: teacherForm.password } : teacherForm;
      const res = await fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (data.success) {
        const teacher = data.teacher; setTeacherProfile(teacher);
        setTeacherEditForm({ name: teacher.name, phone: teacher.phone, branch: teacher.branch, egitim: teacher.egitim || "", ozgecmis: teacher.ozgecmis || "", linkedin: teacher.linkedin || "", youtube: teacher.youtube || "", avatar: teacher.avatar || "" });
        const storage = rememberMe ? localStorage : sessionStorage;
        storage.setItem("derslinex_role", "teacher"); storage.setItem("derslinex_user", JSON.stringify(teacher));
        showMsg(authMode === "login" ? "Giriş başarılı!" : "Başvurunuz alındı ve kayıt oluşturuldu!", "success");
        fetchDbTeachers(); fetchTeacherDashboardData(teacher.id);
      } else { showMsg(data.error || "Giriş/Kayıt işlemi başarısız.", "error"); }
    } catch { showMsg("Bağlantı hatası oluştu.", "error"); } finally { setLoading(false); }
  };

  const handleTeacherUpdate = async (e: React.FormEvent) => {
    e.preventDefault(); if (!teacherProfile) return; setLoading(true);
    try {
      const res = await fetch("/api/profil/ogretmen", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: teacherProfile.email, name: teacherEditForm.name, phone: teacherEditForm.phone, branch: teacherEditForm.branch, egitim: teacherEditForm.egitim, ozgecmis: teacherEditForm.ozgecmis, linkedin: teacherEditForm.linkedin, youtube: teacherEditForm.youtube, avatar: teacherEditForm.avatar }) });
      const data = await res.json();
      if (data.success) {
        const updated = data.teacher; setTeacherProfile(updated);
        const storage = localStorage.getItem("derslinex_role") ? localStorage : sessionStorage;
        storage.setItem("derslinex_user", JSON.stringify(updated));
        window.dispatchEvent(new Event("derslinex_auth_change"));
        setEditingTeacher(false); showMsg("Profil bilgileriniz başarıyla güncellendi!", "success");
      } else { showMsg(data.error || "Profil güncellenemedi.", "error"); }
    } catch { showMsg("Bağlantı hatası.", "error"); } finally { setLoading(false); }
  };

  const handleAddLesson = async (e: React.FormEvent) => {
    e.preventDefault(); if (!teacherProfile) return; setLoading(true);
    try {
      const res = await fetch("/api/profil/ogretmen/dersler", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ teacherId: teacherProfile.id, ...lessonForm }) });
      const data = await res.json();
      if (data.success) { setLessonForm({ title: "", price: "", format: "online", description: "" }); setAddingLesson(false); showMsg("Ders teklifi başarıyla eklendi!", "success"); fetchTeacherDashboardData(teacherProfile.id); }
      else { showMsg(data.error || "Ders eklenemedi.", "error"); }
    } catch { showMsg("Bağlantı hatası.", "error"); } finally { setLoading(false); }
  };

  const handleDeleteLesson = async (lessonId: number) => {
    if (!teacherProfile) return;
    if (!confirm("Bu ders ilanını silmek istediğinize emin misiniz?")) return;
    try {
      const res = await fetch(`/api/profil/ogretmen/dersler?id=${lessonId}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) { showMsg("Ders ilanı silindi.", "success"); fetchTeacherDashboardData(teacherProfile.id); }
      else { showMsg(data.error || "İlan silinemedi.", "error"); }
    } catch { showMsg("Bağlantı hatası.", "error"); }
  };

  const handleAddBlog = async (e: React.FormEvent) => {
    e.preventDefault(); if (!teacherProfile) return; setLoading(true);
    try {
      const res = await fetch("/api/blog/yazar", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ authorId: teacherProfile.id, authorName: teacherProfile.name, ...blogForm }) });
      const data = await res.json();
      if (data.success) { setBlogForm({ title: "", category: "YKS Bilgi", content: "" }); setWritingBlog(false); showMsg("Blog yazısı başarıyla yayınlandı!", "success"); fetchTeacherDashboardData(teacherProfile.id); }
      else { showMsg(data.error || "Blog yazısı paylaşılamadı.", "error"); }
    } catch { showMsg("Bağlantı hatası.", "error"); } finally { setLoading(false); }
  };

  const handleDeleteBlog = async (postId: number) => {
    if (!teacherProfile) return;
    if (!confirm("Bu blog yazısını silmek istediğinize emin misiniz?")) return;
    try {
      const res = await fetch(`/api/blog/yazar?id=${postId}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) { showMsg("Blog yazısı silindi.", "success"); fetchTeacherDashboardData(teacherProfile.id); }
      else { showMsg(data.error || "Yazı silinemedi.", "error"); }
    } catch { showMsg("Bağlantı hatası.", "error"); }
  };

  const handleAddFaq = async (e: React.FormEvent) => {
    e.preventDefault(); if (!teacherProfile) return; setLoading(true);
    try {
      const res = await fetch("/api/profil/ogretmen/faq", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ teacherId: teacherProfile.id, ...faqForm }) });
      const data = await res.json();
      if (data.success) { setFaqForm({ question: "", answer: "" }); setAddingFaq(false); showMsg("Sıkça sorulan soru başarıyla eklendi!", "success"); fetchTeacherDashboardData(teacherProfile.id); }
      else { showMsg(data.error || "Soru eklenemedi.", "error"); }
    } catch { showMsg("Bağlantı hatası.", "error"); } finally { setLoading(false); }
  };

  const handleDeleteFaq = async (faqId: number) => {
    if (!teacherProfile) return;
    if (!confirm("Bu soruyu silmek istediğinize emin misiniz?")) return;
    try {
      const res = await fetch(`/api/profil/ogretmen/faq?id=${faqId}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) { showMsg("Soru silindi.", "success"); fetchTeacherDashboardData(teacherProfile.id); }
      else { showMsg(data.error || "Soru silinemedi.", "error"); }
    } catch { showMsg("Bağlantı hatası.", "error"); }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeRoomId || !newMessage.trim()) return;
    let senderId = 0; let senderRole = "";
    if (role === "student" && studentProfile) { senderId = studentProfile.id; senderRole = "student"; }
    else if (role === "teacher" && teacherProfile) { senderId = teacherProfile.id; senderRole = "teacher"; }
    else return;
    try {
      const res = await fetch("/api/chat/messages", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ roomId: activeRoomId, senderId, senderRole, content: newMessage.trim() }) });
      const data = await res.json();
      if (data.success) { setActiveRoomMessages((prev) => [...prev, data.message]); setNewMessage(""); fetchChatRooms(); }
    } catch (e) { console.error("Send message error:", e); }
  };

  const fetchStudentFeedbacks = useCallback(async () => {
    if (!studentProfile) return;
    try {
      const res = await fetch("/api/gorus"); const data = await res.json();
      if (data.success) { const filtered = (data.feedbacks || []).filter((f: Feedback) => f.studentEmail === studentProfile.email); setStudentFeedbacks(filtered); }
    } catch (e) { console.error(e); }
  }, [studentProfile]);

  useEffect(() => { if (studentProfile) fetchStudentFeedbacks(); }, [studentProfile, fetchStudentFeedbacks]);

  const fetchTeacherFeedbacks = useCallback(async (tId: number) => {
    try {
      const res = await fetch(`/api/gorus?teacherId=${tId}`); const data = await res.json();
      if (data.success) setTeacherFeedbacks(data.feedbacks || []);
    } catch (e) { console.error(e); }
  }, []);

  useEffect(() => { if (teacherProfile) fetchTeacherFeedbacks(teacherProfile.id); }, [teacherProfile, fetchTeacherFeedbacks]);

  const handleSendFeedback = async (e: React.FormEvent) => {
    e.preventDefault(); if (!studentProfile) return;
    if (!selectedTeacherId || !feedbackContent.trim()) { showMsg("Lütfen öğretmen seçin ve görüşünüzü yazın.", "error"); return; }
    setLoading(true);
    try {
      let teacherName = "";
      const sId = selectedTeacherId;
      if (sId.startsWith("static-")) { const found = hocalar.find((h) => h.id === sId.replace("static-", "")); teacherName = found ? found.isim : "Öğretmen"; }
      else { const found = dbTeachers.find((h) => h.id.toString() === sId); teacherName = found ? found.name : "Öğretmen"; }
      const res = await fetch("/api/gorus", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ studentName: studentProfile.name, studentEmail: studentProfile.email, teacherId: sId.startsWith("static-") ? parseInt(sId.replace("static-", "")) * 1000 : parseInt(sId), teacherName, content: feedbackContent, rating: feedbackRating }) });
      const data = await res.json();
      if (data.success) { showMsg("Görüşünüz / talebiniz başarıyla iletildi!", "success"); setFeedbackContent(""); fetchStudentFeedbacks(); }
      else { showMsg(data.error || "Görüş gönderilemedi", "error"); }
    } catch { showMsg("Bir hata oluştu", "error"); } finally { setLoading(false); }
  };

  // ─── Derived stats ────────────────────────────────────────────────────────────
  const upcomingSessions = studentSessions.filter((s) => s.status !== "ENDED" && s.status !== "CANCELLED");
  const pastSessions = studentSessions.filter((s) => s.status === "ENDED");
  const avgRating = pastSessions.length > 0 && pastSessions.some((s) => s.myFeedback)
    ? (pastSessions.filter((s) => s.myFeedback).reduce((acc: number, s: any) => acc + (s.myFeedback?.rating || 0), 0) / pastSessions.filter((s) => s.myFeedback).length).toFixed(1)
    : null;

  // ─── AUTH FORM ─────────────────────────────────────────────────────────────────
  if (!studentProfile && !teacherProfile) {
    return (
      <div className="bg-[#FAF8F5] min-h-screen py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-[#B45309] text-xs font-black uppercase tracking-widest block mb-2">DERSLİNEX PORTALI</span>
            <h1 className="text-4xl sm:text-5xl font-black text-[#1E3A8A] leading-tight">Profil & Giriş Sistemi</h1>
            <p className="text-gray-500 font-semibold mt-2">Öğrenci veya öğretmen hesabı oluşturarak derslerinizi, görüş ve randevu taleplerinizi yönetin.</p>
          </div>
          {message && (
            <div className={`mb-6 p-4 rounded-xl text-sm font-bold border flex items-center justify-between ${ message.type === "success" ? "bg-emerald-50 text-emerald-800 border-emerald-200" : "bg-rose-50 text-rose-800 border-rose-200" }`}>
              <span>{message.text}</span>
              <button className="text-xs opacity-60 hover:opacity-100" onClick={() => setMessage(null)}>✕</button>
            </div>
          )}
          <div className="space-y-6">
            <div className="grid grid-cols-2 bg-white/70 backdrop-blur border border-[#EFECE6] p-1.5 rounded-2xl shadow-sm">
              <button onClick={() => { setRole("student"); setAuthMode("login"); }} className={`py-3 px-4 text-xs sm:text-sm font-black rounded-xl transition-all duration-200 ${ role === "student" ? "bg-[#1E3A8A] text-white shadow-sm" : "text-gray-600 hover:bg-white" }`}>🎓 Öğrenci Giriş/Kayıt</button>
              <button onClick={() => { setRole("teacher"); setAuthMode("login"); }} className={`py-3 px-4 text-xs sm:text-sm font-black rounded-xl transition-all duration-200 ${ role === "teacher" ? "bg-[#1E3A8A] text-white shadow-sm" : "text-gray-600 hover:bg-white" }`}>👨🏫 Öğretmen Giriş/Kayıt</button>
            </div>
            <div className="text-center">
              <span className="text-xs text-gray-500 font-bold">
                {authMode === "login" ? "Hesabınız yok mu?" : "Zaten üye misiniz?"}{" "}
                <button onClick={() => setAuthMode(authMode === "login" ? "register" : "login")} className="text-[#B45309] font-black underline ml-1 hover:text-[#92400E]">
                  {authMode === "login" ? "Kayıt Olun" : "Giriş Yapın"}
                </button>
              </span>
            </div>
            <div className="bg-white rounded-3xl border border-[#EFECE6] p-6 sm:p-8 shadow-sm">
              <h3 className="text-lg font-black text-[#1E3A8A] mb-6 text-center">
                {role === "student" ? "🎓 Öğrenci" : "👨🏫 Öğretmen"}{" "}{authMode === "login" ? "Giriş Paneli" : "Kayıt Paneli"}
              </h3>
              {role === "student" ? (
                <form onSubmit={handleStudentAuth} className="space-y-4">
                  {authMode === "register" && (
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div><label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-2">Adı Soyadı</label><input type="text" required value={studentForm.name} onChange={(e) => setStudentForm({ ...studentForm, name: e.target.value })} className="w-full bg-[#FAF8F5] border border-[#EFECE6] px-4 py-3 rounded-xl text-sm font-bold focus:outline-none" /></div>
                      <div><label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-2">Telefon</label><input type="text" required placeholder="05xx xxx xx xx" value={studentForm.phone} onChange={(e) => setStudentForm({ ...studentForm, phone: e.target.value })} className="w-full bg-[#FAF8F5] border border-[#EFECE6] px-4 py-3 rounded-xl text-sm font-bold focus:outline-none" /></div>
                    </div>
                  )}
                  <div><label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-2">E-posta Adresi</label><input type="email" required value={studentForm.email} onChange={(e) => setStudentForm({ ...studentForm, email: e.target.value })} className="w-full bg-[#FAF8F5] border border-[#EFECE6] px-4 py-3 rounded-xl text-sm font-bold focus:outline-none" /></div>
                  <div><label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-2">Şifre</label><input type="password" required value={studentForm.password} onChange={(e) => setStudentForm({ ...studentForm, password: e.target.value })} className="w-full bg-[#FAF8F5] border border-[#EFECE6] px-4 py-3 rounded-xl text-sm font-bold focus:outline-none" /></div>
                  <div className="flex items-center gap-2 pt-1"><input type="checkbox" id="studentRemember" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="w-4 h-4 rounded" /><label htmlFor="studentRemember" className="text-xs text-gray-500 font-bold select-none cursor-pointer">Beni Hatırla</label></div>
                  <button type="submit" disabled={loading} className="w-full bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white font-black py-3.5 rounded-xl text-sm transition-all">{loading ? "İşlem yapılıyor..." : authMode === "login" ? "Giriş Yap" : "Kayıt Ol"}</button>
                </form>
              ) : (
                <form onSubmit={handleTeacherAuth} className="space-y-4">
                  {authMode === "register" && (
                    <>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div><label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-2">Adı Soyadı</label><input type="text" required value={teacherForm.name} onChange={(e) => setTeacherForm({ ...teacherForm, name: e.target.value })} className="w-full bg-[#FAF8F5] border border-[#EFECE6] px-4 py-3 rounded-xl text-sm font-bold focus:outline-none" /></div>
                        <div><label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-2">Telefon</label><input type="text" required placeholder="05xx xxx xx xx" value={teacherForm.phone} onChange={(e) => setTeacherForm({ ...teacherForm, phone: e.target.value })} className="w-full bg-[#FAF8F5] border border-[#EFECE6] px-4 py-3 rounded-xl text-sm font-bold focus:outline-none" /></div>
                      </div>
                      <div><label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-2">Uzmanlık Branşınız</label><input type="text" required placeholder="Matematik, Fizik vb." value={teacherForm.branch} onChange={(e) => setTeacherForm({ ...teacherForm, branch: e.target.value })} className="w-full bg-[#FAF8F5] border border-[#EFECE6] px-4 py-3 rounded-xl text-sm font-bold focus:outline-none" /></div>
                    </>
                  )}
                  <div><label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-2">E-posta Adresi</label><input type="email" required value={teacherForm.email} onChange={(e) => setTeacherForm({ ...teacherForm, email: e.target.value })} className="w-full bg-[#FAF8F5] border border-[#EFECE6] px-4 py-3 rounded-xl text-sm font-bold focus:outline-none" /></div>
                  <div><label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-2">Şifre</label><input type="password" required value={teacherForm.password} onChange={(e) => setTeacherForm({ ...teacherForm, password: e.target.value })} className="w-full bg-[#FAF8F5] border border-[#EFECE6] px-4 py-3 rounded-xl text-sm font-bold focus:outline-none" /></div>
                  <div className="flex items-center gap-2 pt-1"><input type="checkbox" id="teacherRemember" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="w-4 h-4 rounded" /><label htmlFor="teacherRemember" className="text-xs text-gray-500 font-bold select-none cursor-pointer">Beni Hatırla</label></div>
                  <button type="submit" disabled={loading} className="w-full bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white font-black py-3.5 rounded-xl text-sm transition-all">{loading ? "İşlem yapılıyor..." : authMode === "login" ? "Giriş Yap" : "Kayıt Ol / Başvur"}</button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── TEACHER DASHBOARD (unchanged UI) ────────────────────────────────────────
  if (teacherProfile) {
    return (
      <div className="bg-[#FAF8F5] min-h-screen py-16 px-4">
        <div className="max-w-4xl mx-auto">
          {message && (
            <div className={`mb-6 p-4 rounded-xl text-sm font-bold border flex items-center justify-between ${ message.type === "success" ? "bg-emerald-50 text-emerald-800 border-emerald-200" : "bg-rose-50 text-rose-800 border-rose-200" }`}>
              <span>{message.text}</span>
              <button className="text-xs opacity-60 hover:opacity-100" onClick={() => setMessage(null)}>✕</button>
            </div>
          )}
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center bg-white border border-[#EFECE6] p-5 rounded-3xl gap-4 shadow-sm">
              <div>
                <span className="text-[10px] text-[#B45309] font-black uppercase tracking-widest">DERSLİNEX HESABIM</span>
                <h4 className="text-xl font-black text-[#1E3A8A] mt-0.5">Merhaba, {teacherProfile.name}</h4>
                <p className="text-xs text-gray-500 font-bold mt-0.5">Rol: 👨🏫 Öğretmen ({teacherProfile.branch})</p>
              </div>
              <button onClick={handleLogout} className="self-start sm:self-auto bg-rose-50 hover:bg-rose-100 text-rose-700 font-black text-xs px-5 py-3 rounded-xl transition shadow-xs">Oturumu Güvenli Kapat ✕</button>
            </div>

            <div className="flex gap-1.5 border-b border-[#EFECE6] pb-1 overflow-x-auto scrollbar-none">
              {[{ id: "canli", label: "🎥 Canlı Derslerim" }, { id: "panel", label: "📊 Panelim" }, { id: "duzenle", label: "✏️ Profilimi Düzenle" }, { id: "dersler", label: "📚 Özel Derslerim" }, { id: "bloglar", label: "✍️ Bloglarım" }, { id: "faq", label: "❓ SSS (FAQ)" }, { id: "mesajlar", label: "💬 Mesajlarım" }].map((t) => (
                <button key={t.id} onClick={() => setDashboardTab(t.id as any)} className={`text-xs font-black px-4 py-2.5 rounded-t-xl transition-all whitespace-nowrap ${ dashboardTab === t.id ? "bg-[#1E3A8A] text-white" : "text-gray-500 hover:text-gray-700 bg-white/50 border border-b-0 border-[#EFECE6]" }`}>
                  {t.id === "mesajlar" ? `💬 Mesajlarım (${chatRooms.length})` : t.label}
                </button>
              ))}
            </div>

            {dashboardTab === "canli" && <TeacherSessionsTab userId={teacherProfile.id} />}

            {dashboardTab === "panel" && (
              <div className="space-y-6">
                <div className={`p-5 rounded-2xl border flex items-start sm:items-center gap-4 ${ teacherProfile.status === "İletişime Geçildi" ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-amber-50 border-amber-200 text-amber-800" }`}>
                  <span className="text-2xl mt-0.5 sm:mt-0">{teacherProfile.status === "İletişime Geçildi" ? "✅" : "⏳"}</span>
                  <div>
                    <h4 className="font-black text-sm">Profil Durumu: {teacherProfile.status === "İletişime Geçildi" ? "Onaylandı & Sitede Yayında" : "Başvuru Onay Bekliyor"}</h4>
                    <p className="text-xs opacity-90 font-bold mt-0.5">{teacherProfile.status === "İletişime Geçildi" ? "Tebrikler! Profiliniz web sitemizde aktif olarak yayındadır." : "Profil bilgileriniz incelenmektedir. Onaylandıktan sonra yayına alınacaktır."}</p>
                  </div>
                </div>
                <div className="grid md:grid-cols-12 gap-8">
                  <div className="md:col-span-4 space-y-6">
                    <div className="bg-white rounded-3xl border border-[#EFECE6] p-6 shadow-sm">
                      <div className="flex flex-col items-center pb-6 border-b border-[#FAF8F5]">
                        <div className="w-20 h-20 bg-gradient-to-b from-[#1E3A8A] to-indigo-800 rounded-full flex items-center justify-center text-3xl text-white font-black mb-3 shadow-sm overflow-hidden">
                          {teacherProfile.avatar ? <img src={teacherProfile.avatar} alt="Avatar" className="w-full h-full object-cover" /> : teacherProfile.name.charAt(0)}
                        </div>
                        <h3 className="text-lg font-black text-gray-900 text-center">{teacherProfile.name}</h3>
                        <span className="bg-blue-50 text-blue-700 text-xs px-2.5 py-0.5 rounded-full border border-blue-100 font-bold mt-1.5">{teacherProfile.branch}</span>
                      </div>
                      <div className="space-y-4 pt-6 text-sm font-semibold text-gray-700">
                        <div><span className="text-gray-400 block text-[10px] uppercase font-black mb-0.5">Telefon</span>{teacherProfile.phone}</div>
                        <div><span className="text-gray-400 block text-[10px] uppercase font-black mb-0.5">E-posta</span>{teacherProfile.email}</div>
                        <div><span className="text-gray-400 block text-[10px] uppercase font-black mb-0.5">Eğitim</span>{teacherProfile.egitim || "Girilmemiş"}</div>
                        {teacherProfile.linkedin && <div><span className="text-gray-400 block text-[10px] uppercase font-black mb-0.5">LinkedIn</span><a href={teacherProfile.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Bağlantıyı Gör ➔</a></div>}
                        {teacherProfile.youtube && <div><span className="text-gray-400 block text-[10px] uppercase font-black mb-0.5">YouTube</span><a href={teacherProfile.youtube} target="_blank" rel="noopener noreferrer" className="text-red-600 hover:underline">Tanıtım Videosunu Gör ➔</a></div>}
                      </div>
                      <button onClick={() => setDashboardTab("duzenle")} className="w-full mt-6 bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white font-black py-3 rounded-xl text-xs transition text-center shadow-xs">✏️ Profili Düzenle</button>
                      {teacherProfile.status === "İletişime Geçildi" && (
                        <a href={`/ogretmenler/${teacherProfile.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`} target="_blank" rel="noopener noreferrer" className="w-full mt-2 block bg-white hover:bg-gray-50 text-[#1E3A8A] border border-[#EFECE6] font-black py-2.5 rounded-xl text-xs transition text-center">🔍 Yayındaki Profili Gör</a>
                      )}
                    </div>
                  </div>
                  <div className="md:col-span-8 space-y-6">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {[{ label: "Ders İlanları", val: teacherLessons.length, icon: "📚", tab: "dersler" }, { label: "Blog Yazıları", val: teacherBlogs.length, icon: "✍️", tab: "bloglar" }, { label: "Sorular (FAQ)", val: teacherFaqs.length, icon: "❓", tab: "faq" }, { label: "Öğrenci Görüşleri", val: teacherFeedbacks.length, icon: "💬", tab: "panel" }].map((s) => (
                        <button key={s.label} onClick={() => setDashboardTab(s.tab as any)} className="bg-white border border-[#EFECE6] p-5 rounded-2xl shadow-xs text-center hover:border-[#1E3A8A]/45 hover:shadow-sm transition-all">
                          <span className="text-2xl block mb-1.5">{s.icon}</span>
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">{s.label}</span>
                          <span className="text-xl font-black text-[#1E3A8A] block mt-1">{s.val}</span>
                        </button>
                      ))}
                    </div>
                    <div className="bg-white rounded-3xl border border-[#EFECE6] p-6 sm:p-8 shadow-sm">
                      <h3 className="text-lg font-black text-[#1E3A8A] mb-3">Derslinex Eğitmen Kontrol Paneli 🚀</h3>
                      <div className="grid sm:grid-cols-2 gap-4">
                        {[{ title: "Profilini Tamamla", desc: "Mezuniyet bilgilerini, LinkedIn profil linkini ve kısa tanıtım yazını düzenle.", tab: "duzenle", action: "Profili Güncelle ➔" }, { title: "Özel Ders İlanları", desc: "Verdiğin her branş için saatlik ücret belirterek ilanlar aç.", tab: "dersler", action: "İlanları Yönet ➔" }, { title: "Blog Paylaşımları", desc: "YKS/LGS hazırlık tüyoları paylaşarak öğrencilerin dikkatini çek.", tab: "bloglar", action: "Blog Paylaş ➔" }, { title: "Soru ve Cevaplar", desc: "En sık sorulan soruları ekle.", tab: "faq", action: "Soru Ekle ➔" }].map((item) => (
                          <div key={item.title} className="p-4 bg-[#FAF8F5]/50 border border-[#EFECE6]/70 rounded-2xl flex flex-col justify-between hover:bg-[#FAF8F5] transition-all">
                            <div><h4 className="text-sm font-black text-gray-800">{item.title}</h4><p className="text-xs text-gray-500 font-semibold mt-1 leading-relaxed">{item.desc}</p></div>
                            <button onClick={() => setDashboardTab(item.tab as any)} className="text-xs text-[#B45309] hover:text-[#92400E] font-black mt-4 block text-left">{item.action}</button>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="bg-white rounded-3xl border border-[#EFECE6] p-6 sm:p-8 shadow-sm">
                      <h3 className="text-base font-black text-[#1E3A8A] mb-4">Öğrencilerden Gelen Son Görüşler</h3>
                      {teacherFeedbacks.length === 0 ? <p className="text-sm text-gray-500 font-semibold">Henüz iletilen bir öğrenci görüşü bulunmamaktadır.</p> : (
                        <div className="grid sm:grid-cols-2 gap-4">
                          {teacherFeedbacks.map((f) => (
                            <div key={f.id} className="p-4 bg-[#FAF8F5]/60 border border-[#EFECE6] rounded-2xl">
                              <div className="flex justify-between items-center mb-2"><span className="font-black text-sm text-[#1E3A8A]">{f.studentName}</span><span className="text-amber-500 font-bold text-xs">{f.rating} ★</span></div>
                              <p className="text-gray-600 text-xs font-semibold leading-relaxed mb-3">{f.content}</p>
                              <div className="flex justify-between text-[10px] text-gray-400 border-t border-[#EFECE6]/40 pt-2"><span>{f.studentEmail || "E-posta Gizli"}</span><span>{new Date(f.createdAt).toLocaleDateString("tr-TR")}</span></div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {dashboardTab === "duzenle" && (
              <div className="bg-white rounded-3xl border border-[#EFECE6] p-6 sm:p-8 max-w-3xl shadow-sm">
                <h3 className="text-lg font-black text-[#1E3A8A] mb-2">Profil Bilgilerimi Düzenle</h3>
                <form onSubmit={handleTeacherUpdate} className="space-y-6">
                  <div>
                    <label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-2">Profil Fotoğrafı</label>
                    <div className="flex flex-col sm:flex-row items-center gap-4 bg-[#FAF8F5] p-4 rounded-2xl border border-[#EFECE6]">
                      <div className="w-16 h-16 bg-gradient-to-b from-[#1E3A8A] to-indigo-800 rounded-full overflow-hidden flex items-center justify-center border border-[#EFECE6] shadow-xs flex-shrink-0">
                        {teacherEditForm.avatar ? <img src={teacherEditForm.avatar} alt="" className="w-full h-full object-cover" /> : <span className="text-2xl font-black text-white">{teacherEditForm.name.charAt(0) || "?"}</span>}
                      </div>
                      <div className="flex-1 w-full space-y-2.5">
                        <div className="flex items-center gap-2">
                          <label className="cursor-pointer bg-white hover:bg-gray-50 border border-[#EFECE6] px-3.5 py-1.5 rounded-xl text-xs font-black text-gray-700 transition shadow-xs">
                            <span>📁 Fotoğraf Seç</span>
                            <input type="file" accept="image/*" className="hidden" onChange={(e) => { const file = e.target.files?.[0]; if (file) { const reader = new FileReader(); reader.onloadend = () => setTeacherEditForm({ ...teacherEditForm, avatar: reader.result as string }); reader.readAsDataURL(file); }}} />
                          </label>
                          {teacherEditForm.avatar && <button type="button" onClick={() => setTeacherEditForm({ ...teacherEditForm, avatar: "" })} className="text-xs text-rose-600 hover:text-rose-800 font-bold">Kaldır</button>}
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {["👨🏫", "👩🏫", "🎓", "🧑💻", "👩💻", "🧑🎓", "👩🎓", "🧠", "📐", "🔬"].map((emoji) => (
                            <button key={emoji} type="button" onClick={() => { const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="#1E3A8A"/><text x="50" y="65" font-size="50" text-anchor="middle">${emoji}</text></svg>`; setTeacherEditForm({ ...teacherEditForm, avatar: `data:image/svg+xml;utf8,${encodeURIComponent(svg)}` }); }} className="w-7 h-7 rounded-lg bg-white border border-[#EFECE6] flex items-center justify-center hover:bg-amber-50 transition-all text-sm shadow-xs">{emoji}</button>
                          ))}
                        </div>
                        <input type="url" placeholder="Resim URL (https://...)" value={teacherEditForm.avatar.startsWith("data:") ? "" : teacherEditForm.avatar} onChange={(e) => setTeacherEditForm({ ...teacherEditForm, avatar: e.target.value })} className="w-full bg-white border border-[#EFECE6] px-3 py-1.5 rounded-lg text-xs font-semibold focus:outline-none" />
                      </div>
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div><label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-2">Ad Soyad</label><input type="text" value={teacherEditForm.name} onChange={(e) => setTeacherEditForm({ ...teacherEditForm, name: e.target.value })} required className="w-full bg-[#FAF8F5] border border-[#EFECE6] px-4 py-2.5 rounded-xl text-sm font-bold focus:outline-none" /></div>
                    <div><label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-2">Telefon</label><input type="text" value={teacherEditForm.phone} onChange={(e) => setTeacherEditForm({ ...teacherEditForm, phone: e.target.value })} required className="w-full bg-[#FAF8F5] border border-[#EFECE6] px-4 py-2.5 rounded-xl text-sm font-bold focus:outline-none" /></div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div><label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-2">Branş</label><input type="text" value={teacherEditForm.branch} onChange={(e) => setTeacherEditForm({ ...teacherEditForm, branch: e.target.value })} required className="w-full bg-[#FAF8F5] border border-[#EFECE6] px-4 py-2.5 rounded-xl text-sm font-bold focus:outline-none" /></div>
                    <div><label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-2">Eğitim / Mezuniyet</label><input type="text" value={teacherEditForm.egitim} onChange={(e) => setTeacherEditForm({ ...teacherEditForm, egitim: e.target.value })} placeholder="Örn: Boğaziçi Üniversitesi Matematik" className="w-full bg-[#FAF8F5] border border-[#EFECE6] px-4 py-2.5 rounded-xl text-sm font-bold focus:outline-none" /></div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div><label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-2">LinkedIn Profil Linki</label><input type="url" value={teacherEditForm.linkedin} onChange={(e) => setTeacherEditForm({ ...teacherEditForm, linkedin: e.target.value })} placeholder="https://linkedin.com/in/adiniz" className="w-full bg-[#FAF8F5] border border-[#EFECE6] px-4 py-2.5 rounded-xl text-sm font-bold focus:outline-none" /></div>
                    <div><label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-2">YouTube Tanıtım Videosu</label><input type="url" value={teacherEditForm.youtube} onChange={(e) => setTeacherEditForm({ ...teacherEditForm, youtube: e.target.value })} placeholder="https://youtube.com/watch?v=..." className="w-full bg-[#FAF8F5] border border-[#EFECE6] px-4 py-2.5 rounded-xl text-sm font-bold focus:outline-none" /></div>
                  </div>
                  <div><label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-2">Öğretmen Hakkında</label><textarea rows={5} value={teacherEditForm.ozgecmis} onChange={(e) => setTeacherEditForm({ ...teacherEditForm, ozgecmis: e.target.value })} placeholder="Kendinizden, ders anlatım tarzınızdan bahsedin..." className="w-full bg-[#FAF8F5] border border-[#EFECE6] px-4 py-2.5 rounded-xl text-sm font-semibold focus:outline-none" /></div>
                  <div className="flex gap-4">
                    <button type="submit" disabled={loading} className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white font-black px-8 py-3.5 rounded-xl text-xs transition shadow-xs">Kaydet</button>
                    <button type="button" onClick={() => setDashboardTab("panel")} className="bg-white hover:bg-gray-50 text-gray-700 border border-[#EFECE6] font-black px-8 py-3.5 rounded-xl text-xs transition">Vazgeç</button>
                  </div>
                </form>
              </div>
            )}

            {dashboardTab === "dersler" && (
              <div className="bg-white rounded-3xl border border-[#EFECE6] p-6 sm:p-8 shadow-sm">
                <div className="flex justify-between items-center mb-6 pb-2 border-b border-[#FAF8F5]">
                  <div><h3 className="text-lg font-black text-[#1E3A8A]">Özel Ders İlanlarım</h3><p className="text-xs text-gray-500 font-semibold mt-0.5">Sitede yayınlanacak özel ders tekliflerinizi yönetin.</p></div>
                  <button onClick={() => setAddingLesson(!addingLesson)} className="text-xs bg-[#B45309] hover:bg-[#92400E] text-white font-black px-4 py-2 rounded-xl transition">{addingLesson ? "Vazgeç" : "➕ Yeni İlan Aç"}</button>
                </div>
                {addingLesson ? (
                  <form onSubmit={handleAddLesson} className="space-y-4 max-w-lg">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div><label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-2">Ders Başlığı</label><input type="text" required placeholder="Örn: 10. Sınıf Fizik Özel Ders" value={lessonForm.title} onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })} className="w-full bg-[#FAF8F5] border border-[#EFECE6] px-4 py-2.5 rounded-xl text-sm font-bold focus:outline-none" /></div>
                      <div><label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-2">Saatlik Ücret (TL)</label><input type="number" required placeholder="Örn: 400" value={lessonForm.price} onChange={(e) => setLessonForm({ ...lessonForm, price: e.target.value })} className="w-full bg-[#FAF8F5] border border-[#EFECE6] px-4 py-2.5 rounded-xl text-sm font-bold focus:outline-none" /></div>
                    </div>
                    <div><label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-2">Ders Formatı</label><select value={lessonForm.format} onChange={(e) => setLessonForm({ ...lessonForm, format: e.target.value })} className="w-full bg-[#FAF8F5] border border-[#EFECE6] px-4 py-2.5 rounded-xl text-sm font-bold focus:outline-none"><option value="online">Online Ders</option><option value="yuz-yuze">Yüz Yüze Ders</option><option value="her-ikisi">Online & Yüz Yüze</option></select></div>
                    <div><label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-2">Açıklama (Opsiyonel)</label><textarea rows={3} placeholder="Ders süreci, seviye ve detaylar hakkında bilgi verin..." value={lessonForm.description} onChange={(e) => setLessonForm({ ...lessonForm, description: e.target.value })} className="w-full bg-[#FAF8F5] border border-[#EFECE6] px-4 py-2.5 rounded-xl text-sm font-bold focus:outline-none" /></div>
                    <button type="submit" disabled={loading} className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white font-black px-6 py-3 rounded-xl text-xs transition">İlanı Yayınla</button>
                  </form>
                ) : teacherLessons.length === 0 ? (<p className="text-sm text-gray-500 font-semibold">Henüz açtığınız bir ders ilanı bulunmuyor.</p>) : (
                  <div className="grid sm:grid-cols-2 gap-4">
                    {teacherLessons.map((l) => (
                      <div key={l.id} className="p-4 bg-[#FAF8F5] border border-[#EFECE6] rounded-2xl flex flex-col justify-between shadow-xs">
                        <div><h4 className="font-black text-sm text-[#1E3A8A] mb-1">{l.title}</h4><p className="text-xs text-[#B45309] font-black">{l.price} TL / Saat</p><span className="inline-block text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-bold border border-blue-100 mt-2">{l.format === "online" ? "💻 Online" : l.format === "yuz-yuze" ? "🏫 Yüz Yüze" : "🔄 Her İkisi"}</span>{l.description && <p className="text-gray-500 text-xs font-semibold mt-3 line-clamp-2">{l.description}</p>}</div>
                        <div className="text-right mt-4 pt-3 border-t border-[#EFECE6]/50"><button onClick={() => handleDeleteLesson(l.id)} className="text-xs text-rose-600 hover:text-rose-800 font-black">🗑️ İlanı Kaldır</button></div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {dashboardTab === "bloglar" && (
              <div className="bg-white rounded-3xl border border-[#EFECE6] p-6 sm:p-8 shadow-sm">
                <div className="flex justify-between items-center mb-6 pb-2 border-b border-[#FAF8F5]">
                  <div><h3 className="text-lg font-black text-[#1E3A8A]">Blog Yazılarım</h3><p className="text-xs text-gray-500 font-semibold mt-0.5">YKS rehber veya ders içeriklerinizi yazın.</p></div>
                  <button onClick={() => setWritingBlog(!writingBlog)} className="text-xs bg-[#B45309] hover:bg-[#92400E] text-white font-black px-4 py-2 rounded-xl transition">{writingBlog ? "Vazgeç" : "✍️ Yeni Yazı Paylaş"}</button>
                </div>
                {writingBlog ? (
                  <form onSubmit={handleAddBlog} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div><label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-2">Başlık</label><input type="text" required placeholder="Örn: TYT Matematik Net Arttırma Yöntemleri" value={blogForm.title} onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })} className="w-full bg-[#FAF8F5] border border-[#EFECE6] px-4 py-2.5 rounded-xl text-sm font-bold focus:outline-none" /></div>
                      <div><label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-2">Kategori</label><select value={blogForm.category} onChange={(e) => setBlogForm({ ...blogForm, category: e.target.value })} className="w-full bg-[#FAF8F5] border border-[#EFECE6] px-4 py-2.5 rounded-xl text-sm font-bold focus:outline-none"><option value="YKS Bilgi">YKS Bilgi</option><option value="Ders Rehberleri">Ders Rehberleri</option><option value="Çalışma Teknikleri">Çalışma Teknikleri</option><option value="Genel Rehberlik">Genel Rehberlik</option></select></div>
                    </div>
                    <div><label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-2">İçerik</label><textarea rows={8} required placeholder="Yazınızı buraya yazın..." value={blogForm.content} onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })} className="w-full bg-[#FAF8F5] border border-[#EFECE6] px-4 py-2.5 rounded-xl text-sm font-semibold focus:outline-none" /></div>
                    <button type="submit" disabled={loading} className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white font-black px-6 py-3 rounded-xl text-xs transition">Yazıyı Yayınla</button>
                  </form>
                ) : teacherBlogs.length === 0 ? (<p className="text-sm text-gray-500 font-semibold">Henüz paylaştığınız bir blog yazısı bulunmuyor.</p>) : (
                  <div className="space-y-3">
                    {teacherBlogs.map((b) => (
                      <div key={b.id} className="p-4 bg-[#FAF8F5] border border-[#EFECE6] rounded-2xl flex items-center justify-between shadow-xs">
                        <div><h4 className="font-black text-sm text-[#1E3A8A]">{b.title}</h4><div className="flex gap-3 text-[10px] text-gray-400 mt-1 font-bold"><span>📂 {b.category}</span><span>📅 {new Date(b.createdAt).toLocaleDateString("tr-TR")}</span><a href={`/blog/${b.slug}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">🔗 Sitede Gör</a></div></div>
                        <button onClick={() => handleDeleteBlog(b.id)} className="text-xs text-rose-600 hover:text-rose-800 font-black px-2.5 py-1 rounded-lg hover:bg-rose-50">Sil</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {dashboardTab === "faq" && (
              <div className="bg-white rounded-3xl border border-[#EFECE6] p-6 sm:p-8 shadow-sm">
                <div className="flex justify-between items-center mb-6 pb-2 border-b border-[#FAF8F5]">
                  <div><h3 className="text-lg font-black text-[#1E3A8A]">Sıkça Sorulan Sorular</h3><p className="text-xs text-gray-500 font-semibold mt-0.5">Profilinizde görünecek SSS listesini yönetin.</p></div>
                  <button onClick={() => setAddingFaq(!addingFaq)} className="text-xs bg-[#B45309] hover:bg-[#92400E] text-white font-black px-4 py-2 rounded-xl transition">{addingFaq ? "Vazgeç" : "➕ Yeni Soru Ekle"}</button>
                </div>
                {addingFaq ? (
                  <form onSubmit={handleAddFaq} className="space-y-4">
                    <div><label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-2">Soru</label><input type="text" required placeholder="Örn: Dersleri nerede yapıyorsunuz?" value={faqForm.question} onChange={(e) => setFaqForm({ ...faqForm, question: e.target.value })} className="w-full bg-[#FAF8F5] border border-[#EFECE6] px-4 py-2.5 rounded-xl text-sm font-bold focus:outline-none" /></div>
                    <div><label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-2">Cevap</label><textarea rows={3} required placeholder="Örn: Online olarak Zoom üzerinden yapıyorum." value={faqForm.answer} onChange={(e) => setFaqForm({ ...faqForm, answer: e.target.value })} className="w-full bg-[#FAF8F5] border border-[#EFECE6] px-4 py-2.5 rounded-xl text-sm font-semibold focus:outline-none" /></div>
                    <button type="submit" disabled={loading} className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white font-black px-6 py-3 rounded-xl text-xs transition">Soruyu Kaydet</button>
                  </form>
                ) : teacherFaqs.length === 0 ? (<p className="text-sm text-gray-500 font-semibold">Henüz eklediğiniz bir soru bulunmuyor.</p>) : (
                  <div className="space-y-3">
                    {teacherFaqs.map((faq) => (
                      <div key={faq.id} className="p-4 bg-[#FAF8F5] border border-[#EFECE6] rounded-2xl flex items-start justify-between gap-4">
                        <div className="flex-1"><h4 className="font-black text-sm text-[#1E3A8A]">{faq.question}</h4><p className="text-xs text-gray-600 mt-2 font-semibold leading-relaxed">{faq.answer}</p></div>
                        <button onClick={() => handleDeleteFaq(faq.id)} className="text-xs text-rose-600 hover:text-rose-800 font-black px-2.5 py-1 rounded-lg hover:bg-rose-50 flex-shrink-0">Sil</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {dashboardTab === "mesajlar" && (
              <div className="bg-white rounded-3xl border border-[#EFECE6] shadow-sm overflow-hidden min-h-[500px] flex flex-col md:flex-row">
                <div className="w-full md:w-72 border-r border-[#EFECE6] flex flex-col bg-[#FAF8F5]/30">
                  <div className="p-4 border-b border-[#EFECE6] bg-[#FAF8F5]/50 flex items-center justify-between">
                    <h4 className="font-black text-xs uppercase tracking-wider text-gray-500">Sohbetler</h4>
                    <button onClick={fetchChatRooms} className="text-[10px] bg-white border border-[#EFECE6] text-gray-600 px-2 py-1 rounded-lg font-bold hover:bg-gray-50">🔄 Yenile</button>
                  </div>
                  <div className="flex-1 overflow-y-auto max-h-[480px]">
                    {chatRooms.length === 0 ? (
                      <p className="p-4 text-xs text-gray-500 font-semibold text-center mt-8 leading-relaxed">Henüz aktif bir sohbetiniz bulunmuyor.<br />{role === "student" ? "Öğretmen profillerinden mesaj başlatabilirsiniz." : "Öğrencilerin mesaj göndermesi bekleniyor."}</p>
                    ) : chatRooms.map((room) => {
                      const nameToShow = role === "student" ? room.teacherName : room.studentName;
                      return (
                        <button key={room.id} onClick={() => setActiveRoomId(room.id)} className={`w-full text-left p-4 border-b border-[#EFECE6] flex items-center gap-3 transition-colors ${ activeRoomId === room.id ? "bg-white border-l-4 border-l-[#1E3A8A]" : "hover:bg-[#FAF8F5]" }`}>
                          <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(nameToShow)}&eyebrows=default&mouth=smile`} alt="" className="w-10 h-10 rounded-full bg-gray-100 flex-shrink-0" />
                          <div className="truncate flex-1"><h5 className="font-black text-sm text-[#1E3A8A] truncate">{nameToShow}</h5><p className="text-[10px] text-gray-400 font-bold mt-0.5">Sohbeti Görüntüle →</p></div>
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div className="flex-1 flex flex-col bg-white min-h-[500px]">
                  {activeRoomId ? (
                    <>
                      <div className="p-4 border-b border-[#EFECE6] flex items-center gap-3 bg-[#FAF8F5]/40">
                        {(() => { const activeRoom = chatRooms.find((r) => r.id === activeRoomId); const name = activeRoom ? (role === "student" ? activeRoom.teacherName : activeRoom.studentName) : ""; return (<><img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}&eyebrows=default&mouth=smile`} alt="" className="w-8 h-8 rounded-full bg-gray-100" /><h4 className="font-black text-sm text-[#1E3A8A]">{name}</h4></>); })()}
                      </div>
                      <div className="flex-1 p-6 overflow-y-auto max-h-[350px] min-h-[300px] space-y-4">
                        {activeRoomMessages.length === 0 ? <p className="text-center text-xs text-gray-400 py-10 font-bold">İlk mesajı siz yazın!</p> : activeRoomMessages.map((msg) => {
                          const isMe = msg.senderRole === role;
                          return (
                            <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                              <div className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm font-semibold shadow-xs ${ isMe ? "bg-[#1E3A8A] text-white rounded-tr-none" : "bg-white border border-[#EFECE6] text-gray-700 rounded-tl-none" }`}>
                                <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                                <span className={`text-[8px] block text-right mt-1.5 ${isMe ? "text-blue-100" : "text-gray-400"}`}>{new Date(msg.createdAt).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <form onSubmit={handleSendMessage} className="p-4 border-t border-[#EFECE6] flex gap-3 bg-[#FAF8F5]/30 mt-auto">
                        <input type="text" required value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Mesajınızı buraya yazın..." className="flex-1 bg-white border border-[#EFECE6] px-4 py-2.5 rounded-xl text-sm font-bold focus:outline-none focus:border-[#1E3A8A]" />
                        <button type="submit" className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white font-black px-6 py-2.5 rounded-xl text-xs transition shadow-sm">Gönder 🚀</button>
                      </form>
                    </>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-8 mt-12">
                      <span className="text-5xl mb-4">💬</span>
                      <h4 className="font-black text-sm text-[#1E3A8A]">Sohbet Seçilmedi</h4>
                      <p className="text-xs text-gray-500 font-semibold mt-1">Sol taraftaki listeden bir sohbet seçin.</p>
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

  // ─── STUDENT DASHBOARD (SincApp-style dark sidebar layout) ───────────────────
  return (
    <div className="flex min-h-screen bg-[#0A1628] font-sans">
      {/* Mobile overlay */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/60 z-30 md:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Left Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-[220px] bg-[#0D1B35] border-r border-white/5 flex flex-col z-40 transform transition-transform duration-300 ${ sidebarOpen ? "translate-x-0" : "-translate-x-full" } md:translate-x-0 md:static md:flex`}>
        {/* Logo */}
        <div className="px-5 py-5 border-b border-white/5">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-black text-xs">DX</span>
            </div>
            <span className="text-white font-black text-sm">Derslinex</span>
          </Link>
        </div>

        {/* User info */}
        <div className="px-4 py-4 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black text-sm flex-shrink-0 overflow-hidden">
              {studentProfile?.avatar ? <img src={studentProfile.avatar} alt="" className="w-full h-full object-cover" /> : studentProfile?.name.charAt(0)}
            </div>
            <div className="min-w-0">
              <p className="text-white font-black text-xs truncate">{studentProfile?.name}</p>
              <p className="text-indigo-400 text-[10px] font-bold truncate">
                <span className={`inline-block w-2 h-2 rounded-full mr-1 ${ studentProfile?.status === "İletişime Geçildi" ? "bg-green-400" : "bg-amber-400" }`}></span>
                {studentProfile?.status === "İletişime Geçildi" ? "Aktif" : "Beklemede"}
              </p>
            </div>
          </div>
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {STUDENT_NAV.map((item) => (
            <button
              key={item.id}
              onClick={() => { setDashboardTab(item.id as any); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all text-sm font-bold ${
                dashboardTab === item.id
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/50"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <span className="text-base">{item.icon}</span>
              <span className="text-xs">{item.label}</span>
              {item.id === "mesajlar" && chatRooms.length > 0 && (
                <span className="ml-auto bg-indigo-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full">{chatRooms.length}</span>
              )}
              {item.id === "canli" && upcomingSessions.length > 0 && (
                <span className="ml-auto bg-red-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full">{upcomingSessions.length}</span>
              )}
            </button>
          ))}

          <div className="border-t border-white/5 pt-3 mt-3">
            <Link href="/ogretmenler" className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-slate-400 hover:text-white hover:bg-white/5 transition-all">
              <span className="text-base">📚</span>
              <span className="text-xs font-bold">Ders Kataloğu</span>
            </Link>
            <Link href="/blog" className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-slate-400 hover:text-white hover:bg-white/5 transition-all">
              <span className="text-base">📰</span>
              <span className="text-xs font-bold">Blog</span>
            </Link>
          </div>
        </nav>

        {/* Logout */}
        <div className="px-3 pb-4">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all text-xs font-bold">
            <span className="text-base">🚪</span> Çıkış Yap
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="bg-[#0D1B35]/80 backdrop-blur border-b border-white/5 px-4 md:px-6 py-3 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button className="md:hidden text-slate-400 hover:text-white p-1" onClick={() => setSidebarOpen(true)}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
            <h1 className="text-white font-black text-sm">
              {STUDENT_NAV.find(n => n.id === dashboardTab)?.icon} {STUDENT_NAV.find(n => n.id === dashboardTab)?.label || "Genel Görünüm"}
            </h1>
          </div>
          {message && (
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold ${ message.type === "success" ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-red-500/20 text-red-400 border border-red-500/30" }`}>
              {message.text}
              <button onClick={() => setMessage(null)} className="opacity-60 hover:opacity-100">✕</button>
            </div>
          )}
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">

          {/* ─── GENEL GÖRÜNÜM ─── */}
          {dashboardTab === "panel" && (
            <div className="flex flex-col xl:flex-row gap-6">
              {/* Left: Main Dashboard */}
              <div className="flex-1 space-y-6">
                {/* Greeting */}
                <div>
                  <h2 className="text-2xl font-black text-white">Merhaba, {studentProfile?.name.split(" ")[0]}! 👋</h2>
                  <p className="text-slate-400 text-sm mt-1">
                    {new Date().toLocaleDateString("tr-TR", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                    {" • "}
                    <span className={`font-bold ${ studentProfile?.status === "İletişime Geçildi" ? "text-green-400" : "text-amber-400" }`}>
                      {studentProfile?.status === "İletişime Geçildi" ? "✅ Aktif Hesap" : "⏳ Hesap Onay Bekliyor"}
                    </span>
                  </p>
                </div>

                {/* Stat Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-2xl p-4 shadow-lg shadow-indigo-900/40">
                    <p className="text-indigo-200 text-[10px] font-black uppercase tracking-wider">Toplam Dersim</p>
                    <p className="text-white font-black text-3xl mt-1">{studentSessions.length}</p>
                    <p className="text-indigo-300 text-[10px] mt-1 font-bold">Tüm zamanlar</p>
                  </div>
                  <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-2xl p-4 shadow-lg shadow-emerald-900/40">
                    <p className="text-emerald-200 text-[10px] font-black uppercase tracking-wider">Tamamlanan</p>
                    <p className="text-white font-black text-3xl mt-1">{pastSessions.length}</p>
                    <p className="text-emerald-300 text-[10px] mt-1 font-bold">Biten dersler</p>
                  </div>
                  <div className="bg-gradient-to-br from-amber-600 to-amber-800 rounded-2xl p-4 shadow-lg shadow-amber-900/40">
                    <p className="text-amber-200 text-[10px] font-black uppercase tracking-wider">Ort. Rating</p>
                    <p className="text-white font-black text-3xl mt-1">{avgRating ? `${avgRating}★` : "—"}</p>
                    <p className="text-amber-300 text-[10px] mt-1 font-bold">Öğretmen notu</p>
                  </div>
                  <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-4 shadow-lg shadow-blue-900/40">
                    <p className="text-blue-200 text-[10px] font-black uppercase tracking-wider">Mesajlarım</p>
                    <p className="text-white font-black text-3xl mt-1">{chatRooms.length}</p>
                    <p className="text-blue-300 text-[10px] mt-1 font-bold">Aktif sohbet</p>
                  </div>
                </div>

                {/* Özet */}
                <div className="bg-[#1E293B] rounded-2xl p-5 border border-white/5">
                  <h3 className="text-white font-black text-sm mb-4 flex items-center gap-2">📊 Özet</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${ upcomingSessions.length > 0 ? "bg-green-400" : "bg-slate-600" }`}></span>
                      <span className="text-slate-300 text-sm font-semibold">
                        {upcomingSessions.length > 0 ? `${upcomingSessions.length} yaklaşan canlı dersiniz var` : "Yaklaşan canlı dersiniz bulunmuyor"}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${ chatRooms.length > 0 ? "bg-blue-400" : "bg-slate-600" }`}></span>
                      <span className="text-slate-300 text-sm font-semibold">
                        {chatRooms.length > 0 ? `${chatRooms.length} aktif sohbet odanız var` : "Aktif sohbet odanız bulunmuyor"}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${ studentFeedbacks.length > 0 ? "bg-amber-400" : "bg-slate-600" }`}></span>
                      <span className="text-slate-300 text-sm font-semibold">
                        {studentFeedbacks.length > 0 ? `${studentFeedbacks.length} değerlendirme gönderildi` : "Henüz değerlendirme göndermediniz"}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${ pastSessions.some(s => s.myFeedback?.homeworkGiven) ? "bg-purple-400" : "bg-slate-600" }`}></span>
                      <span className="text-slate-300 text-sm font-semibold">
                        {pastSessions.filter(s => s.myFeedback?.homeworkGiven).length > 0 ? `${pastSessions.filter(s => s.myFeedback?.homeworkGiven).length} bekleyen ödeviniz var` : "Bekleyen ödeviniz yok"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quick Action Cards */}
                <div>
                  <h3 className="text-white font-black text-sm mb-3">⚡ Hızlı Erişim</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {[
                      { icon: "🎥", label: "Canlı Derslerim", sub: `${upcomingSessions.length} yaklaşan`, tab: "canli", color: "from-red-600/20 to-red-900/20 border-red-500/20 hover:border-red-500/40" },
                      { icon: "💬", label: "Öğretmenimle Konuş", sub: `${chatRooms.length} sohbet`, tab: "mesajlar", color: "from-blue-600/20 to-blue-900/20 border-blue-500/20 hover:border-blue-500/40" },
                      { icon: "⭐", label: "Değerlendirme Yap", sub: "Görüş gönder", tab: "degerlendirme", color: "from-amber-600/20 to-amber-900/20 border-amber-500/20 hover:border-amber-500/40" },
                      { icon: "⚙️", label: "Profilimi Düzenle", sub: "Bilgileri güncelle", tab: "duzenle", color: "from-slate-600/20 to-slate-900/20 border-slate-500/20 hover:border-slate-500/40" },
                    ].map((card) => (
                      <button
                        key={card.tab}
                        onClick={() => setDashboardTab(card.tab as any)}
                        className={`bg-gradient-to-br ${card.color} border rounded-2xl p-4 text-left transition-all hover:scale-105 group`}
                      >
                        <span className="text-2xl block mb-2">{card.icon}</span>
                        <p className="text-white font-black text-xs">{card.label}</p>
                        <p className="text-slate-400 text-[10px] font-bold mt-0.5">{card.sub}</p>
                      </button>
                    ))}
                    <Link href="/ogretmenler" className={`bg-gradient-to-br from-purple-600/20 to-purple-900/20 border border-purple-500/20 hover:border-purple-500/40 rounded-2xl p-4 text-left transition-all hover:scale-105`}>
                      <span className="text-2xl block mb-2">📚</span>
                      <p className="text-white font-black text-xs">Ders Bul</p>
                      <p className="text-slate-400 text-[10px] font-bold mt-0.5">Öğretmenleri gör</p>
                    </Link>
                    <Link href="/blog" className={`bg-gradient-to-br from-emerald-600/20 to-emerald-900/20 border border-emerald-500/20 hover:border-emerald-500/40 rounded-2xl p-4 text-left transition-all hover:scale-105`}>
                      <span className="text-2xl block mb-2">📰</span>
                      <p className="text-white font-black text-xs">Blog Oku</p>
                      <p className="text-slate-400 text-[10px] font-bold mt-0.5">Bilgi kazan</p>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Right: Upcoming Sessions Panel */}
              <div className="xl:w-72 space-y-4">
                <div className="bg-[#1E293B] rounded-2xl border border-white/5 overflow-hidden">
                  <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between">
                    <h3 className="text-white font-black text-xs uppercase tracking-wider">📅 Bugünkü & Yaklaşan Dersler</h3>
                    <button onClick={() => setDashboardTab("canli")} className="text-[10px] text-indigo-400 hover:text-indigo-300 font-black">Tümü →</button>
                  </div>
                  <div className="p-3 space-y-2">
                    {upcomingSessions.length === 0 ? (
                      <div className="py-6 text-center">
                        <span className="text-3xl block mb-2">📭</span>
                        <p className="text-slate-500 text-xs font-bold">Yaklaşan dersiniz yok</p>
                      </div>
                    ) : upcomingSessions.slice(0, 4).map((s) => (
                      <SessionCardDark key={s.id} session={s} role="student" />
                    ))}
                  </div>
                </div>

                {/* Profil Bilgi Kutusu */}
                <div className="bg-[#1E293B] rounded-2xl border border-white/5 p-4">
                  <h3 className="text-white font-black text-xs uppercase tracking-wider mb-3">👤 Hesap Bilgileri</h3>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between"><span className="text-slate-500 font-bold">E-posta</span><span className="text-slate-300 font-bold truncate ml-2 max-w-[130px]">{studentProfile?.email}</span></div>
                    <div className="flex justify-between"><span className="text-slate-500 font-bold">Telefon</span><span className="text-slate-300 font-bold">{studentProfile?.phone}</span></div>
                    <div className="flex justify-between"><span className="text-slate-500 font-bold">Durum</span><span className={`font-bold ${ studentProfile?.status === "İletişime Geçildi" ? "text-green-400" : "text-amber-400" }`}>{studentProfile?.status}</span></div>
                  </div>
                  <button onClick={() => setDashboardTab("duzenle")} className="w-full mt-4 bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/30 text-indigo-300 font-black text-xs px-4 py-2 rounded-xl transition">
                    ✏️ Düzenle
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ─── CANLİ DERSLER ─── */}
          {dashboardTab === "canli" && studentProfile && (
            <div className="max-w-3xl">
              <StudentSessionsTab userId={studentProfile.id} />
            </div>
          )}

          {/* ─── MESAJLAR ─── */}
          {dashboardTab === "mesajlar" && (
            <div className="bg-[#1E293B] rounded-2xl border border-white/5 shadow-sm overflow-hidden min-h-[500px] flex flex-col md:flex-row">
              <div className="w-full md:w-64 border-r border-white/5 flex flex-col">
                <div className="p-4 border-b border-white/5 flex items-center justify-between">
                  <h4 className="font-black text-xs uppercase tracking-wider text-slate-400">Sohbetler</h4>
                  <button onClick={fetchChatRooms} className="text-[10px] text-slate-500 hover:text-white font-black">🔄</button>
                </div>
                <div className="flex-1 overflow-y-auto">
                  {chatRooms.length === 0 ? (
                    <p className="p-4 text-xs text-slate-500 font-semibold text-center mt-8 leading-relaxed">Henüz aktif sohbetiniz yok.<br />Öğretmen profillerinden mesaj başlatabilirsiniz.</p>
                  ) : chatRooms.map((room) => {
                    const nameToShow = room.teacherName;
                    return (
                      <button key={room.id} onClick={() => setActiveRoomId(room.id)} className={`w-full text-left p-4 border-b border-white/5 flex items-center gap-3 transition-colors ${ activeRoomId === room.id ? "bg-indigo-600/20 border-l-4 border-l-indigo-500" : "hover:bg-white/5" }`}>
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(nameToShow)}&eyebrows=default&mouth=smile`} alt="" className="w-9 h-9 rounded-full bg-slate-700 flex-shrink-0" />
                        <div className="truncate flex-1"><h5 className="font-black text-xs text-white truncate">{nameToShow}</h5><p className="text-[10px] text-slate-500 font-bold mt-0.5">Sohbeti Görüntüle →</p></div>
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="flex-1 flex flex-col">
                {activeRoomId ? (
                  <>
                    <div className="p-4 border-b border-white/5 flex items-center gap-3">
                      {(() => { const activeRoom = chatRooms.find((r) => r.id === activeRoomId); const name = activeRoom?.teacherName || ""; return (<><img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}&eyebrows=default&mouth=smile`} alt="" className="w-8 h-8 rounded-full bg-slate-700" /><h4 className="font-black text-sm text-white">{name}</h4></>); })()}
                    </div>
                    <div className="flex-1 p-4 overflow-y-auto max-h-[380px] min-h-[300px] space-y-3">
                      {activeRoomMessages.length === 0 ? <p className="text-center text-xs text-slate-600 py-10 font-bold">İlk mesajı siz yazın!</p> : activeRoomMessages.map((msg) => {
                        const isMe = msg.senderRole === "student";
                        return (
                          <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                            <div className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm font-semibold ${ isMe ? "bg-indigo-600 text-white rounded-tr-none" : "bg-[#0D1B35] border border-white/10 text-slate-200 rounded-tl-none" }`}>
                              <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                              <span className={`text-[8px] block text-right mt-1.5 ${isMe ? "text-indigo-200" : "text-slate-500"}`}>{new Date(msg.createdAt).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <form onSubmit={handleSendMessage} className="p-4 border-t border-white/5 flex gap-3 mt-auto">
                      <input type="text" required value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Mesajınızı yazın..." className="flex-1 bg-[#0D1B35] border border-white/10 text-white px-4 py-2.5 rounded-xl text-sm font-bold focus:outline-none focus:border-indigo-500 placeholder:text-slate-600" />
                      <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white font-black px-5 py-2.5 rounded-xl text-xs transition">Gönder 🚀</button>
                    </form>
                  </>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                    <span className="text-5xl mb-4">💬</span>
                    <h4 className="font-black text-sm text-white">Sohbet Seçilmedi</h4>
                    <p className="text-xs text-slate-500 font-semibold mt-1">Sol taraftaki listeden bir sohbet seçin.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ─── DEĞERLENDİRMELER ─── */}
          {dashboardTab === "degerlendirme" && (
            <div className="max-w-3xl grid md:grid-cols-2 gap-6">
              <div className="bg-[#1E293B] rounded-2xl border border-white/5 p-5">
                <h3 className="text-white font-black text-base mb-4">Görüş / Randevu Talebi Gönder</h3>
                <form onSubmit={handleSendFeedback} className="space-y-4">
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">Öğretmen Seçin</label>
                    <select value={selectedTeacherId} onChange={(e) => setSelectedTeacherId(e.target.value)} required className="w-full bg-[#0D1B35] border border-white/10 text-white px-4 py-3 rounded-xl text-sm font-bold focus:outline-none focus:border-indigo-500">
                      <option value="">Lütfen listeden seçin...</option>
                      <optgroup label="Sistem Öğretmenleri">
                        {hocalar.map((h) => <option key={`static-${h.id}`} value={`static-${h.id}`}>{h.isim} ({h.dersler.join(", ")})</option>)}
                      </optgroup>
                      {dbTeachers.length > 0 && <optgroup label="Kayıtlı Öğretmenler">{dbTeachers.map((h) => <option key={h.id} value={h.id}>{h.name} ({h.branch})</option>)}</optgroup>}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">Puanınız (1-5)</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((num) => (
                        <button key={num} type="button" onClick={() => setFeedbackRating(num)} className={`w-10 h-10 rounded-xl font-black text-sm transition-all border ${ feedbackRating === num ? "bg-amber-500 text-white border-amber-500" : "bg-[#0D1B35] text-slate-400 border-white/10" }`}>{num} ★</button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">Görüş ve Randevu Mesajınız</label>
                    <textarea rows={4} value={feedbackContent} onChange={(e) => setFeedbackContent(e.target.value)} required placeholder="Ders almak istediğiniz günleri ve hedeflerinizi yazın..." className="w-full bg-[#0D1B35] border border-white/10 text-white px-4 py-3 rounded-xl text-sm font-bold focus:outline-none focus:border-indigo-500 placeholder:text-slate-600" />
                  </div>
                  <button type="submit" disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-3.5 rounded-xl text-sm transition-all">Görüşü / Randevu Talebini İlet</button>
                </form>
              </div>
              <div className="bg-[#1E293B] rounded-2xl border border-white/5 p-5">
                <h3 className="text-white font-black text-base mb-4">Taleplerim & Görüşlerim ({studentFeedbacks.length})</h3>
                {studentFeedbacks.length === 0 ? (
                  <p className="text-xs text-slate-500 font-bold">Henüz bir görüş veya ders talebi iletmemişsiniz.</p>
                ) : (
                  <div className="space-y-3 max-h-[450px] overflow-y-auto pr-1">
                    {studentFeedbacks.map((f) => (
                      <div key={f.id} className="p-3 bg-[#0D1B35] border border-white/5 rounded-xl">
                        <div className="flex justify-between items-center mb-1.5"><span className="font-black text-xs text-white">{f.teacherName}</span><span className="text-amber-400 font-bold text-xs">{f.rating} ★</span></div>
                        <p className="text-slate-300 text-xs font-semibold leading-relaxed">{f.content}</p>
                        <span className="text-[9px] text-slate-600 block text-right mt-2">{new Date(f.createdAt).toLocaleDateString("tr-TR")}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ─── PROFİL DÜZENLE ─── */}
          {dashboardTab === "duzenle" && (
            <div className="max-w-xl">
              <div className="bg-[#1E293B] rounded-2xl border border-white/5 p-6">
                <h3 className="text-white font-black text-base mb-5">⚙️ Profil Bilgilerimi Düzenle</h3>
                <div className="mb-5">
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">Profil Fotoğrafı</label>
                  <div className="flex flex-col sm:flex-row items-center gap-4 bg-[#0D1B35] p-4 rounded-2xl border border-white/10">
                    <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0">
                      {studentEditForm.avatar ? <img src={studentEditForm.avatar} alt="" className="w-full h-full object-cover" /> : <span className="text-2xl font-black text-white">{studentEditForm.name.charAt(0) || "?"}</span>}
                    </div>
                    <div className="flex-1 w-full space-y-2">
                      <div className="flex items-center gap-2">
                        <label className="cursor-pointer bg-[#1E293B] hover:bg-white/10 border border-white/10 px-3 py-1.5 rounded-xl text-xs font-black text-slate-300 transition">
                          <span>📁 Fotoğraf Seç</span>
                          <input type="file" accept="image/*" className="hidden" onChange={(e) => { const file = e.target.files?.[0]; if (file) { const reader = new FileReader(); reader.onloadend = () => setStudentEditForm({ ...studentEditForm, avatar: reader.result as string }); reader.readAsDataURL(file); }}} />
                        </label>
                        {studentEditForm.avatar && <button type="button" onClick={() => setStudentEditForm({ ...studentEditForm, avatar: "" })} className="text-xs text-red-400 hover:text-red-300 font-bold">Kaldır</button>}
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {["👨🎓", "👩🎓", "🎓", "🧑💻", "👩💻", "⚡", "📚", "🎯"].map((emoji) => (
                          <button key={emoji} type="button" onClick={() => { const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="#1E3A8A"/><text x="50" y="65" font-size="50" text-anchor="middle">${emoji}</text></svg>`; setStudentEditForm({ ...studentEditForm, avatar: `data:image/svg+xml;utf8,${encodeURIComponent(svg)}` }); }} className="w-7 h-7 rounded-lg bg-[#1E293B] border border-white/10 flex items-center justify-center hover:bg-white/10 transition text-sm">{emoji}</button>
                        ))}
                      </div>
                      <input type="url" placeholder="Resim URL (https://...)" value={studentEditForm.avatar.startsWith("data:") ? "" : studentEditForm.avatar} onChange={(e) => setStudentEditForm({ ...studentEditForm, avatar: e.target.value })} className="w-full bg-[#1E293B] border border-white/10 text-white px-3 py-1.5 rounded-lg text-xs font-semibold focus:outline-none placeholder:text-slate-600" />
                    </div>
                  </div>
                </div>
                <form onSubmit={handleStudentUpdate} className="space-y-4">
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">Ad Soyad</label>
                    <input type="text" value={studentEditForm.name} onChange={(e) => setStudentEditForm({ ...studentEditForm, name: e.target.value })} required className="w-full bg-[#0D1B35] border border-white/10 text-white px-4 py-2.5 rounded-xl text-sm font-bold focus:outline-none focus:border-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">Telefon</label>
                    <input type="text" value={studentEditForm.phone} onChange={(e) => setStudentEditForm({ ...studentEditForm, phone: e.target.value })} required className="w-full bg-[#0D1B35] border border-white/10 text-white px-4 py-2.5 rounded-xl text-sm font-bold focus:outline-none focus:border-indigo-500" />
                  </div>
                  <div className="flex gap-3">
                    <button type="submit" disabled={loading} className="bg-indigo-600 hover:bg-indigo-500 text-white font-black px-8 py-3 rounded-xl text-xs transition">{loading ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}</button>
                    <button type="button" onClick={() => setDashboardTab("panel")} className="bg-white/5 hover:bg-white/10 text-slate-300 font-black px-6 py-3 rounded-xl text-xs transition border border-white/10">Vazgeç</button>
                  </div>
                </form>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
