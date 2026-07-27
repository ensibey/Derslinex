"use client";

import React, { useState, useEffect, useCallback } from "react";
import { hocalar } from "@/data/hocalar";

interface Student {
  id: number;
  name: string;
  phone: string;
  email: string;
  status: string;
  avatar?: string | null;
}

interface Teacher {
  id: number;
  name: string;
  phone: string;
  email: string;
  branch: string;
  status: string;
  egitim?: string | null;
  ozgecmis?: string | null;
  linkedin?: string | null;
  youtube?: string | null;
  avatar?: string | null;
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
  const [rememberMe, setRememberMe] = useState(false);
  
  // Student Auth & Profile States
  const [studentForm, setStudentForm] = useState({ name: "", phone: "", email: "", password: "" });
  const [studentProfile, setStudentProfile] = useState<Student | null>(null);
  const [editingStudent, setEditingStudent] = useState(false);
  const [studentEditForm, setStudentEditForm] = useState({ name: "", phone: "", avatar: "" });

  // Teacher Auth Form States
  const [teacherForm, setTeacherForm] = useState({ name: "", phone: "", email: "", password: "", branch: "" });
  const [teacherProfile, setTeacherProfile] = useState<Teacher | null>(null);
  const [editingTeacher, setEditingTeacher] = useState(false);
  const [teacherEditForm, setTeacherEditForm] = useState({ name: "", phone: "", branch: "", egitim: "", ozgecmis: "", linkedin: "", youtube: "", avatar: "" });
  
  // Teacher Lesson and Blog States
  const [teacherLessons, setTeacherLessons] = useState<any[]>([]);
  const [teacherBlogs, setTeacherBlogs] = useState<any[]>([]);
  const [teacherFaqs, setTeacherFaqs] = useState<any[]>([]);
  const [addingLesson, setAddingLesson] = useState(false);
  const [writingBlog, setWritingBlog] = useState(false);
  const [addingFaq, setAddingFaq] = useState(false);
  const [lessonForm, setLessonForm] = useState({ title: "", price: "", format: "online", description: "" });
  const [blogForm, setBlogForm] = useState({ title: "", category: "YKS Bilgi", content: "" });
  const [faqForm, setFaqForm] = useState({ question: "", answer: "" });

  // Chat States
  const [dashboardTab, setDashboardTab] = useState<"panel" | "duzenle" | "dersler" | "bloglar" | "faq" | "mesajlar">("panel");
  const [chatRooms, setChatRooms] = useState<any[]>([]);
  const [activeRoomId, setActiveRoomId] = useState<number | null>(null);
  const [activeRoomMessages, setActiveRoomMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");

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
    } catch (e) {
      console.error("Dashboard data fetch error:", e);
    }
  }, []);

  useEffect(() => {
    // Check auto-login from both localStorage (persistent) and sessionStorage (temporary)
    const savedRole = localStorage.getItem("derslinex_role") || sessionStorage.getItem("derslinex_role");
    const savedUser = localStorage.getItem("derslinex_user") || sessionStorage.getItem("derslinex_user");
    
    if (savedRole && savedUser) {
      const parsedUser = JSON.parse(savedUser);
      if (savedRole === "student") {
        setStudentProfile(parsedUser);
        setStudentEditForm({ name: parsedUser.name, phone: parsedUser.phone, avatar: parsedUser.avatar || "" });
        setRole("student");
      } else {
        setTeacherProfile(parsedUser);
        setTeacherEditForm({
          name: parsedUser.name,
          phone: parsedUser.phone,
          branch: parsedUser.branch,
          egitim: parsedUser.egitim || "",
          ozgecmis: parsedUser.ozgecmis || "",
          linkedin: parsedUser.linkedin || "",
          youtube: parsedUser.youtube || "",
          avatar: parsedUser.avatar || ""
        });
        setRole("teacher");
        fetchTeacherDashboardData(parsedUser.id);
      }
    }

    fetchDbTeachers();
  }, [fetchTeacherDashboardData]);

  // Load chat rooms when role is active
  const fetchChatRooms = useCallback(async () => {
    let url = "";
    if (role === "student" && studentProfile) {
      url = `/api/chat/rooms?studentId=${studentProfile.id}`;
    } else if (role === "teacher" && teacherProfile) {
      url = `/api/chat/rooms?teacherId=${teacherProfile.id}`;
    } else {
      return;
    }

    try {
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setChatRooms(data.rooms || []);
      }
    } catch (e) {
      console.error("Rooms fetch error:", e);
    }
  }, [role, studentProfile, teacherProfile]);

  // Poll room list every 10 seconds to detect new chat rooms
  useEffect(() => {
    if (!studentProfile && !teacherProfile) return;
    fetchChatRooms();
    const interval = setInterval(fetchChatRooms, 10000);
    return () => clearInterval(interval);
  }, [studentProfile, teacherProfile, fetchChatRooms]);

  // Load and poll messages in active room
  useEffect(() => {
    if (!activeRoomId) return;

    const fetchMessages = async () => {
      try {
        const res = await fetch(`/api/chat/messages?roomId=${activeRoomId}`);
        const data = await res.json();
        if (data.success) {
          setActiveRoomMessages(data.messages || []);
        }
      } catch (e) {
        console.error("Messages fetch error:", e);
      }
    };

    fetchMessages(); // initial load
    const interval = setInterval(fetchMessages, 3000); // poll every 3 seconds

    return () => clearInterval(interval);
  }, [activeRoomId]);

  // Chat initiation via query parameter
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const startChatTeacherId = params.get("startChatWithTeacherId");
    const startChatTeacherName = params.get("teacherName");

    if (startChatTeacherId && startChatTeacherName) {
      // Clear URL params to prevent loop
      window.history.replaceState({}, document.title, window.location.pathname);
      
      const initiateChat = async () => {
        // Find if student is logged in
        const savedRole = localStorage.getItem("derslinex_role") || sessionStorage.getItem("derslinex_role");
        const savedUser = localStorage.getItem("derslinex_user") || sessionStorage.getItem("derslinex_user");
        
        if (savedRole === "student" && savedUser) {
          const parsedUser = JSON.parse(savedUser);
          try {
            // Create chat room
            const res = await fetch("/api/chat/rooms", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                studentId: parsedUser.id,
                studentName: parsedUser.name,
                teacherId: parseInt(startChatTeacherId),
                teacherName: startChatTeacherName
              })
            });
            const data = await res.json();
            if (data.success && data.room) {
              // Open chat room & switch tab
              setActiveRoomId(data.room.id);
              setDashboardTab("mesajlar");
              showMsg(`${startChatTeacherName} ile sohbet başlatıldı!`, "success");
            }
          } catch (e) {
            console.error("Chat initiation error:", e);
          }
        } else {
          showMsg("Lütfen öğretmenle sohbet başlatmak için önce Öğrenci Girişi yapın.", "error");
        }
      };
      
      // Delay slightly to let auto-login finish
      setTimeout(initiateChat, 800);
    }
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
    // Clear both storages to ensure safety
    localStorage.removeItem("derslinex_role");
    localStorage.removeItem("derslinex_user");
    sessionStorage.removeItem("derslinex_role");
    sessionStorage.removeItem("derslinex_user");
    
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
        setStudentEditForm({ name: student.name, phone: student.phone, avatar: student.avatar || "" });
        
        // Conditional storage based on "Remember Me"
        const storage = rememberMe ? localStorage : sessionStorage;
        storage.setItem("derslinex_role", "student");
        storage.setItem("derslinex_user", JSON.stringify(student));
        
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

  // STUDENT PROFILE UPDATE
  const handleStudentUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentProfile) return;
    setLoading(true);
    try {
      const res = await fetch("/api/profil/ogrenci", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: studentProfile.email,
          name: studentEditForm.name,
          phone: studentEditForm.phone,
          avatar: studentEditForm.avatar
        })
      });
      const data = await res.json();
      if (data.success) {
        const updated = data.student;
        setStudentProfile(updated);
        
        // Sync updated profile to active storage
        const storage = localStorage.getItem("derslinex_role") ? localStorage : sessionStorage;
        storage.setItem("derslinex_user", JSON.stringify(updated));
        window.dispatchEvent(new Event("derslinex_auth_change"));
        
        setEditingStudent(false);
        showMsg("Profil bilgileriniz başarıyla güncellendi!", "success");
      } else {
        showMsg(data.error || "Profil güncellenemedi.", "error");
      }
    } catch (err) {
      showMsg("Bağlantı hatası.", "error");
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
        setTeacherEditForm({
          name: teacher.name,
          phone: teacher.phone,
          branch: teacher.branch,
          egitim: teacher.egitim || "",
          ozgecmis: teacher.ozgecmis || "",
          linkedin: teacher.linkedin || "",
          youtube: teacher.youtube || "",
          avatar: teacher.avatar || ""
        });
        
        // Conditional storage based on "Remember Me"
        const storage = rememberMe ? localStorage : sessionStorage;
        storage.setItem("derslinex_role", "teacher");
        storage.setItem("derslinex_user", JSON.stringify(teacher));
        
        showMsg(authMode === "login" ? "Giriş başarılı!" : "Başvurunuz alındı ve kayıt oluşturuldu!", "success");
        fetchDbTeachers(); // Refresh list
        fetchTeacherDashboardData(teacher.id);
      } else {
        showMsg(data.error || "Giriş/Kayıt işlemi başarısız.", "error");
      }
    } catch (err) {
      showMsg("Bağlantı hatası oluştu.", "error");
    } finally {
      setLoading(false);
    }
  };

  // TEACHER PROFILE UPDATE
  const handleTeacherUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teacherProfile) return;
    setLoading(true);
    try {
      const res = await fetch("/api/profil/ogretmen", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: teacherProfile.email,
          name: teacherEditForm.name,
          phone: teacherEditForm.phone,
          branch: teacherEditForm.branch,
          egitim: teacherEditForm.egitim,
          ozgecmis: teacherEditForm.ozgecmis,
          linkedin: teacherEditForm.linkedin,
          youtube: teacherEditForm.youtube,
          avatar: teacherEditForm.avatar
        })
      });
      const data = await res.json();
      if (data.success) {
        const updated = data.teacher;
        setTeacherProfile(updated);
        
        // Sync updated profile to active storage
        const storage = localStorage.getItem("derslinex_role") ? localStorage : sessionStorage;
        storage.setItem("derslinex_user", JSON.stringify(updated));
        window.dispatchEvent(new Event("derslinex_auth_change"));
        
        setEditingTeacher(false);
        showMsg("Profil bilgileriniz başarıyla güncellendi!", "success");
      } else {
        showMsg(data.error || "Profil güncellenemedi.", "error");
      }
    } catch (err) {
      showMsg("Bağlantı hatası.", "error");
    } finally {
      setLoading(false);
    }
  };

  // Create Lesson Offer
  const handleAddLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teacherProfile) return;
    setLoading(true);
    try {
      const res = await fetch("/api/profil/ogretmen/dersler", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teacherId: teacherProfile.id,
          ...lessonForm
        })
      });
      const data = await res.json();
      if (data.success) {
        setLessonForm({ title: "", price: "", format: "online", description: "" });
        setAddingLesson(false);
        showMsg("Ders teklifi başarıyla eklendi!", "success");
        fetchTeacherDashboardData(teacherProfile.id);
      } else {
        showMsg(data.error || "Ders eklenemedi.", "error");
      }
    } catch (err) {
      showMsg("Bağlantı hatası.", "error");
    } finally {
      setLoading(false);
    }
  };

  // Delete Lesson Offer
  const handleDeleteLesson = async (lessonId: number) => {
    if (!teacherProfile) return;
    if (!confirm("Bu ders ilanını silmek istediğinize emin misiniz?")) return;
    try {
      const res = await fetch(`/api/profil/ogretmen/dersler?id=${lessonId}`, {
        method: "DELETE"
      });
      const data = await res.json();
      if (data.success) {
        showMsg("Ders ilanı silindi.", "success");
        fetchTeacherDashboardData(teacherProfile.id);
      } else {
        showMsg(data.error || "İlan silinemedi.", "error");
      }
    } catch (err) {
      showMsg("Bağlantı hatası.", "error");
    }
  };

  // Create Blog Post
  const handleAddBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teacherProfile) return;
    setLoading(true);
    try {
      const res = await fetch("/api/blog/yazar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          authorId: teacherProfile.id,
          authorName: teacherProfile.name,
          ...blogForm
        })
      });
      const data = await res.json();
      if (data.success) {
        setBlogForm({ title: "", category: "YKS Bilgi", content: "" });
        setWritingBlog(false);
        showMsg("Blog yazısı başarıyla yayınlandı!", "success");
        fetchTeacherDashboardData(teacherProfile.id);
      } else {
        showMsg(data.error || "Blog yazısı paylaşılamadı.", "error");
      }
    } catch (err) {
      showMsg("Bağlantı hatası.", "error");
    } finally {
      setLoading(false);
    }
  };

  // Delete Blog Post
  const handleDeleteBlog = async (postId: number) => {
    if (!teacherProfile) return;
    if (!confirm("Bu blog yazısını silmek istediğinize emin misiniz?")) return;
    try {
      const res = await fetch(`/api/blog/yazar?id=${postId}`, {
        method: "DELETE"
      });
      const data = await res.json();
      if (data.success) {
        showMsg("Blog yazısı silindi.", "success");
        fetchTeacherDashboardData(teacherProfile.id);
      } else {
        showMsg(data.error || "Yazı silinemedi.", "error");
      }
    } catch (err) {
      showMsg("Bağlantı hatası.", "error");
    }
  };

  // Create FAQ Item
  const handleAddFaq = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teacherProfile) return;
    setLoading(true);
    try {
      const res = await fetch("/api/profil/ogretmen/faq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teacherId: teacherProfile.id,
          ...faqForm
        })
      });
      const data = await res.json();
      if (data.success) {
        setFaqForm({ question: "", answer: "" });
        setAddingFaq(false);
        showMsg("Sıkça sorulan soru başarıyla eklendi!", "success");
        fetchTeacherDashboardData(teacherProfile.id);
      } else {
        showMsg(data.error || "Soru eklenemedi.", "error");
      }
    } catch (err) {
      showMsg("Bağlantı hatası.", "error");
    } finally {
      setLoading(false);
    }
  };

  // Delete FAQ Item
  const handleDeleteFaq = async (faqId: number) => {
    if (!teacherProfile) return;
    if (!confirm("Bu soruyu silmek istediğinize emin misiniz?")) return;
    try {
      const res = await fetch(`/api/profil/ogretmen/faq?id=${faqId}`, {
        method: "DELETE"
      });
      const data = await res.json();
      if (data.success) {
        showMsg("Soru silindi.", "success");
        fetchTeacherDashboardData(teacherProfile.id);
      } else {
        showMsg(data.error || "Soru silinemedi.", "error");
      }
    } catch (err) {
      showMsg("Bağlantı hatası.", "error");
    }
  };

  // SEND CHAT MESSAGE
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeRoomId || !newMessage.trim()) return;

    let senderId = 0;
    let senderRole = "";
    if (role === "student" && studentProfile) {
      senderId = studentProfile.id;
      senderRole = "student";
    } else if (role === "teacher" && teacherProfile) {
      senderId = teacherProfile.id;
      senderRole = "teacher";
    } else {
      return;
    }

    try {
      const res = await fetch("/api/chat/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomId: activeRoomId,
          senderId,
          senderRole,
          content: newMessage.trim(),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setActiveRoomMessages((prev) => [...prev, data.message]);
        setNewMessage("");
        fetchChatRooms();
      }
    } catch (e) {
      console.error("Send message error:", e);
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

        {/* AUTH FORMS */}
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
                      className="w-full bg-[#FAF8F5] border border-[#EFECE6] px-4 py-3 rounded-xl text-sm font-bold focus:outline-none"
                    />
                  </div>

                  {/* Remember Me Checkbox */}
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="studentRemember"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded border-[#EFECE6] text-[#1E3A8A] focus:ring-[#1E3A8A]"
                    />
                    <label htmlFor="studentRemember" className="text-xs text-gray-500 font-bold select-none cursor-pointer">
                      Beni Hatırla
                    </label>
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
                            className="w-full bg-[#FAF8F5] border border-[#EFECE6] px-4 py-3 rounded-xl text-sm font-bold focus:outline-none"
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
                          className="w-full bg-[#FAF8F5] border border-[#EFECE6] px-4 py-3 rounded-xl text-sm font-bold focus:outline-none"
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
                      className="w-full bg-[#FAF8F5] border border-[#EFECE6] px-4 py-3 rounded-xl text-sm font-bold focus:outline-none"
                    />
                  </div>

                  {/* Remember Me Checkbox */}
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="teacherRemember"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded border-[#EFECE6] text-[#1E3A8A] focus:ring-[#1E3A8A]"
                    />
                    <label htmlFor="teacherRemember" className="text-xs text-gray-500 font-bold select-none cursor-pointer">
                      Beni Hatırla
                    </label>
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
            {/* Top Workspace Header Bar */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center bg-white border border-[#EFECE6] p-5 rounded-3xl gap-4 shadow-sm">
              <div>
                <span className="text-[10px] text-[#B45309] font-black uppercase tracking-widest">DERSLINEX HESABIM</span>
                <h4 className="text-xl font-black text-[#1E3A8A] mt-0.5">
                  Merhaba, {studentProfile ? studentProfile.name : teacherProfile?.name}
                </h4>
                <p className="text-xs text-gray-500 font-bold mt-0.5">
                  Rol: {studentProfile ? "🎓 Öğrenci" : `👨‍🏫 Öğretmen (${teacherProfile?.branch})`}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="self-start sm:self-auto bg-rose-50 hover:bg-rose-100 text-rose-700 font-black text-xs px-5 py-3 rounded-xl transition shadow-xs"
              >
                Oturumu Güvenli Kapat ✕
              </button>
            </div>

            {/* Tab Navigation */}
            <div className="flex gap-1.5 border-b border-[#EFECE6] pb-1 overflow-x-auto scrollbar-none">
              {role === "student" ? (
                <>
                  <button
                    onClick={() => setDashboardTab("panel")}
                    className={`text-xs font-black px-4 py-2.5 rounded-t-xl transition-all whitespace-nowrap ${
                      dashboardTab === "panel"
                        ? "bg-[#1E3A8A] text-white"
                        : "text-gray-500 hover:text-gray-700 bg-white/50 border border-b-0 border-[#EFECE6]"
                    }`}
                  >
                    📊 Kontrol Panelim
                  </button>
                  <button
                    onClick={() => setDashboardTab("mesajlar")}
                    className={`text-xs font-black px-4 py-2.5 rounded-t-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
                      dashboardTab === "mesajlar"
                        ? "bg-[#1E3A8A] text-white"
                        : "text-gray-500 hover:text-gray-700 bg-white/50 border border-b-0 border-[#EFECE6]"
                    }`}
                  >
                    💬 Mesajlarım ({chatRooms.length})
                  </button>
                </>
              ) : (
                <>
                  {[
                    { id: "panel", label: "📊 Panelim" },
                    { id: "duzenle", label: "✏️ Profilimi Düzenle" },
                    { id: "dersler", label: "📚 Özel Derslerim" },
                    { id: "bloglar", label: "✍️ Bloglarım" },
                    { id: "faq", label: "❓ SSS (FAQ)" },
                    { id: "mesajlar", label: "💬 Mesajlarım" }
                  ].map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setDashboardTab(t.id as any)}
                      className={`text-xs font-black px-4 py-2.5 rounded-t-xl transition-all whitespace-nowrap ${
                        dashboardTab === t.id
                          ? "bg-[#1E3A8A] text-white"
                          : "text-gray-500 hover:text-gray-700 bg-white/50 border border-b-0 border-[#EFECE6]"
                      }`}
                    >
                      {t.id === "mesajlar" ? `${t.label} (${chatRooms.length})` : t.label}
                    </button>
                  ))}
                </>
              )}
            </div>

            {dashboardTab === "panel" && studentProfile && (
              <div className="space-y-8">
                    {/* Stats Dashboard */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="bg-white/90 border border-[#EFECE6] p-5 rounded-2xl shadow-xs">
                        <span className="text-[10px] font-black text-gray-450 uppercase tracking-wider block">Görüş ve Taleplerim</span>
                        <span className="text-2xl font-black text-[#1E3A8A] block mt-1.5">{studentFeedbacks.length} Adet</span>
                      </div>
                      <div className="bg-white/90 border border-[#EFECE6] p-5 rounded-2xl shadow-xs">
                        <span className="text-[10px] font-black text-gray-450 uppercase tracking-wider block">Hesap Onay Durumu</span>
                        <span className={`inline-block text-xs px-2.5 py-1 rounded-full font-bold border mt-2 ${
                          studentProfile.status === "İletişime Geçildi"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-amber-50 text-amber-700 border-amber-200"
                        }`}>
                          {studentProfile.status}
                        </span>
                      </div>
                      <div className="bg-white/90 border border-[#EFECE6] p-5 rounded-2xl shadow-xs">
                        <span className="text-[10px] font-black text-gray-450 uppercase tracking-wider block">Son Görüş Zamanı</span>
                        <span className="text-sm font-bold text-gray-700 block mt-3">
                          {studentFeedbacks.length > 0
                            ? new Date(studentFeedbacks[0].createdAt).toLocaleDateString("tr-TR")
                            : "Yok"}
                        </span>
                      </div>
                    </div>

                    {/* Profile Edit & Send Request Sections */}
                    <div className="grid md:grid-cols-12 gap-8">
                      {/* Left Column: Profile edit and Feedback Form */}
                      <div className="md:col-span-7 space-y-8">
                        {/* Student Info Card (Edit details) */}
                        <div className="bg-white rounded-3xl border border-[#EFECE6] p-6 shadow-sm">
                          <div className="flex justify-between items-center mb-4 pb-2 border-b border-[#FAF8F5]">
                            <h3 className="text-base font-black text-[#1E3A8A]">Profil Bilgilerim</h3>
                            {!editingStudent ? (
                              <button
                                onClick={() => setEditingStudent(true)}
                                className="text-xs text-[#B45309] font-black hover:underline"
                              >
                                ✎ Bilgileri Düzenle
                              </button>
                            ) : (
                              <button
                                onClick={() => setEditingStudent(false)}
                                className="text-xs text-gray-500 font-bold hover:underline"
                              >
                                Vazgeç
                              </button>
                            )}
                          </div>

                          {!editingStudent ? (
                            <div className="flex flex-col sm:flex-row items-center gap-4 text-sm font-semibold text-gray-700">
                              <div className="w-16 h-16 rounded-full bg-gradient-to-b from-[#1E3A8A] to-indigo-800 flex items-center justify-center text-white text-2xl font-black overflow-hidden shadow-xs flex-shrink-0">
                                {studentProfile.avatar ? (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <img src={studentProfile.avatar} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                  studentProfile.name.charAt(0)
                                )}
                              </div>
                              <div className="space-y-2 flex-1 w-full text-center sm:text-left">
                                <div><span className="text-gray-400 block text-xs">Ad Soyad</span>{studentProfile.name}</div>
                                <div><span className="text-gray-400 block text-xs">Telefon</span>{studentProfile.phone}</div>
                                <div><span className="text-gray-400 block text-xs">E-posta</span>{studentProfile.email}</div>
                              </div>
                            </div>
                          ) : (
                            <form onSubmit={handleStudentUpdate} className="space-y-4">
                              {/* Avatar Picker widget */}
                              <div className="mb-4">
                                <label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-2">Profil Fotoğrafı Seç / Yükle</label>
                                <div className="flex flex-col sm:flex-row items-center gap-4 bg-[#FAF8F5] p-4 rounded-2xl border border-[#EFECE6]">
                                  <div className="relative w-16 h-16 bg-gradient-to-b from-[#1E3A8A] to-indigo-800 rounded-full overflow-hidden flex items-center justify-center border border-[#EFECE6] shadow-xs flex-shrink-0">
                                    {studentEditForm.avatar ? (
                                      // eslint-disable-next-line @next/next/no-img-element
                                      <img src={studentEditForm.avatar} alt="Avatar Önizleme" className="w-full h-full object-cover" />
                                    ) : (
                                      <span className="text-2xl font-black text-white">{studentEditForm.name.charAt(0) || "?"}</span>
                                    )}
                                  </div>
                                  <div className="flex-1 w-full space-y-2.5">
                                    <div className="flex items-center gap-2">
                                      <label className="cursor-pointer bg-white hover:bg-gray-50 border border-[#EFECE6] px-3.5 py-1.5 rounded-xl text-xs font-black text-gray-700 transition shadow-xs">
                                        <span>📁 Fotoğraf Seç</span>
                                        <input
                                          type="file"
                                          accept="image/*"
                                          className="hidden"
                                          onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                              const reader = new FileReader();
                                              reader.onloadend = () => {
                                                setStudentEditForm({ ...studentEditForm, avatar: reader.result as string });
                                              };
                                              reader.readAsDataURL(file);
                                            }
                                          }}
                                        />
                                      </label>
                                      {studentEditForm.avatar && (
                                        <button
                                          type="button"
                                          onClick={() => setStudentEditForm({ ...studentEditForm, avatar: "" })}
                                          className="text-xs text-rose-600 hover:text-rose-800 font-bold"
                                        >
                                          Kaldır
                                        </button>
                                      )}
                                    </div>
                                    <div className="flex flex-wrap gap-1.5">
                                      {["👨‍🎓", "👩‍🎓", "🎓", "🧑‍💻", "👩‍💻", "⚡", "📚", "🎯"].map((emoji) => (
                                        <button
                                          key={emoji}
                                          type="button"
                                          onClick={() => {
                                            const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="#1E3A8A"/><text x="50" y="65" font-size="50" text-anchor="middle">${emoji}</text></svg>`;
                                            const dataUrl = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
                                            setStudentEditForm({ ...studentEditForm, avatar: dataUrl });
                                          }}
                                          className="w-7 h-7 rounded-lg bg-white border border-[#EFECE6] flex items-center justify-center hover:bg-amber-50 hover:border-[#B45309]/50 transition-all text-sm shadow-xs"
                                        >
                                          {emoji}
                                        </button>
                                      ))}
                                    </div>
                                    <input
                                      type="url"
                                      placeholder="Resim URL yapıştırın (https://...)"
                                      value={studentEditForm.avatar.startsWith("data:") ? "" : studentEditForm.avatar}
                                      onChange={(e) => setStudentEditForm({ ...studentEditForm, avatar: e.target.value })}
                                      className="w-full bg-white border border-[#EFECE6] px-3 py-1.5 rounded-lg text-xs font-semibold focus:outline-none"
                                    />
                                  </div>
                                </div>
                              </div>

                              <div>
                                <label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-2">Ad Soyad</label>
                                <input
                                  type="text"
                                  value={studentEditForm.name}
                                  onChange={(e) => setStudentEditForm({ ...studentEditForm, name: e.target.value })}
                                  required
                                  className="w-full bg-[#FAF8F5] border border-[#EFECE6] px-4 py-2.5 rounded-xl text-sm font-bold focus:outline-none"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-2">Telefon</label>
                                <input
                                  type="text"
                                  value={studentEditForm.phone}
                                  onChange={(e) => setStudentEditForm({ ...studentEditForm, phone: e.target.value })}
                                  required
                                  className="w-full bg-[#FAF8F5] border border-[#EFECE6] px-4 py-2.5 rounded-xl text-sm font-bold focus:outline-none"
                                />
                              </div>
                              <button
                                type="submit"
                                disabled={loading}
                                className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white font-black px-5 py-2.5 rounded-xl text-xs transition"
                              >
                                Değişiklikleri Kaydet
                              </button>
                            </form>
                          )}
                        </div>

                        {/* Send Feedback / Lesson request */}
                        <div className="bg-white rounded-3xl border border-[#EFECE6] p-6 shadow-sm">
                          <h3 className="text-base font-black text-[#1E3A8A] mb-4 pb-2 border-b border-[#FAF8F5]">
                            Görüş / Randevu Talebi Gönder
                          </h3>
                          <form onSubmit={handleSendFeedback} className="space-y-4">
                            <div>
                              <label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-2">Öğretmen Seçin</label>
                              <select
                                value={selectedTeacherId}
                                onChange={(e) => setSelectedTeacherId(e.target.value)}
                                required
                                className="w-full bg-[#FAF8F5] border border-[#EFECE6] px-4 py-3 rounded-xl text-sm font-bold focus:outline-none focus:border-[#FAF0E3]"
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
                                        ? "bg-amber-500 text-white border-amber-500 shadow-xs"
                                        : "bg-[#FAF8F5] text-gray-600 border-[#EFECE6]"
                                    }`}
                                  >
                                    {num} ★
                                  </button>
                                ))}
                              </div>
                            </div>

                            <div>
                              <label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-2">Görüş ve Randevu Mesajınız</label>
                              <textarea
                                rows={4}
                                value={feedbackContent}
                                onChange={(e) => setFeedbackContent(e.target.value)}
                                required
                                placeholder="Ders almak istediğiniz günleri ve hedeflerinizi yazın..."
                                className="w-full bg-[#FAF8F5] border border-[#EFECE6] px-4 py-3 rounded-xl text-sm font-bold focus:outline-none focus:border-[#FAF0E3]"
                              />
                            </div>

                            <button
                              type="submit"
                              disabled={loading}
                              className="w-full bg-[#B45309] hover:bg-[#92400E] text-white font-black py-3.5 rounded-xl text-sm transition-all"
                            >
                              Görüşü / Randevu Talebini İlet
                            </button>
                          </form>
                        </div>
                      </div>

                      {/* Right Column: Premium Message-style Log of Past Feedbacks */}
                      <div className="md:col-span-5 bg-white rounded-3xl border border-[#EFECE6] p-6 shadow-sm">
                        <h3 className="text-base font-black text-[#1E3A8A] mb-4 pb-2 border-b border-[#FAF8F5]">
                          Taleplerim & Görüşlerim
                        </h3>
                        {studentFeedbacks.length === 0 ? (
                          <p className="text-xs text-gray-500 font-bold">Henüz bir görüş veya ders talebi iletmemişsiniz.</p>
                        ) : (
                          <div className="space-y-4 max-h-[480px] overflow-y-auto pr-1 scrollbar-thin">
                            {studentFeedbacks.map((f) => (
                              <div key={f.id} className="p-4 bg-[#FAF8F5]/60 border border-[#EFECE6] rounded-2xl relative shadow-xs hover:bg-[#FAF8F5] transition-all">
                                <div className="flex justify-between items-center mb-2">
                                  <span className="font-black text-xs sm:text-sm text-[#1E3A8A]">{f.teacherName}</span>
                                  <span className="text-amber-500 font-bold text-xs">{f.rating} ★</span>
                                </div>
                                <p className="text-gray-655 text-xs font-semibold leading-relaxed mb-3">
                                  {f.content}
                                </p>
                                <span className="text-[9px] text-gray-400 block text-right">
                                  {new Date(f.createdAt).toLocaleDateString("tr-TR")}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
            )}

                {/* TEACHER VIEW */}
                {teacherProfile && (
                  <div className="space-y-6">
                    {/* Status Alert Banner */}
                    <div className={`p-5 rounded-2xl border flex items-start sm:items-center gap-4 ${
                      teacherProfile.status === "İletişime Geçildi" 
                        ? "bg-emerald-50 border-emerald-200 text-emerald-800" 
                        : "bg-amber-50 border-amber-200 text-amber-800"
                    }`}>
                      <span className="text-2xl mt-0.5 sm:mt-0">{teacherProfile.status === "İletişime Geçildi" ? "✅" : "⏳"}</span>
                      <div>
                        <h4 className="font-black text-sm">
                          Profil Durumu: {teacherProfile.status === "İletişime Geçildi" ? "Onaylandı & Sitede Yayında" : "Başvuru Onay Bekliyor"}
                        </h4>
                        <p className="text-xs opacity-90 font-bold mt-0.5">
                          {teacherProfile.status === "İletişime Geçildi" 
                            ? "Tebrikler! Profiliniz web sitemizde aktif olarak yayındadır. Öğrenciler profilinizden ders alabilir ve size site içi mesaj gönderebilir." 
                            : "Profil bilgileriniz incelenmektedir. Yöneticilerimiz onayladıktan sonra profiliniz otomatik olarak yayına alınacaktır. Bu esnada profilinizi düzenlemeye ve ilan eklemeye devam edebilirsiniz."}
                        </p>
                      </div>
                    </div>

                    {/* Tab 1: Panelim */}
                    {dashboardTab === "panel" && (
                      <div className="grid md:grid-cols-12 gap-8">
                        {/* Left Card: Quick Profile Preview */}
                        <div className="md:col-span-4 space-y-6">
                          <div className="bg-white rounded-3xl border border-[#EFECE6] p-6 shadow-sm">
                            <div className="flex flex-col items-center pb-6 border-b border-[#FAF8F5]">
                              <div className="w-20 h-20 bg-gradient-to-b from-[#1E3A8A] to-indigo-800 rounded-full flex items-center justify-center text-3xl text-white font-black mb-3 shadow-sm overflow-hidden">
                                {teacherProfile.avatar ? (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <img src={teacherProfile.avatar} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                  teacherProfile.name.charAt(0)
                                )}
                              </div>
                              <h3 className="text-lg font-black text-gray-900 text-center">{teacherProfile.name}</h3>
                              <span className="bg-blue-50 text-blue-700 text-xs px-2.5 py-0.5 rounded-full border border-blue-100 font-bold mt-1.5">
                                {teacherProfile.branch}
                              </span>
                            </div>
                            <div className="space-y-4 pt-6 text-sm font-semibold text-gray-700">
                              <div><span className="text-gray-400 block text-[10px] uppercase font-black mb-0.5">Telefon</span>{teacherProfile.phone}</div>
                              <div><span className="text-gray-400 block text-[10px] uppercase font-black mb-0.5">E-posta</span>{teacherProfile.email}</div>
                              <div><span className="text-gray-400 block text-[10px] uppercase font-black mb-0.5">Eğitim</span>{teacherProfile.egitim || "Girilmemiş"}</div>
                              {teacherProfile.linkedin && <div><span className="text-gray-400 block text-[10px] uppercase font-black mb-0.5">LinkedIn</span><a href={teacherProfile.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-650 hover:underline">Bağlantıyı Gör ➔</a></div>}
                              {teacherProfile.youtube && <div><span className="text-gray-400 block text-[10px] uppercase font-black mb-0.5">YouTube</span><a href={teacherProfile.youtube} target="_blank" rel="noopener noreferrer" className="text-red-600 hover:underline">Tanıtım Videosunu Gör ➔</a></div>}
                            </div>
                            <button
                              onClick={() => setDashboardTab("duzenle")}
                              className="w-full mt-6 bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white font-black py-3 rounded-xl text-xs transition text-center shadow-xs"
                            >
                              ✏️ Profili Düzenle
                            </button>
                            {teacherProfile.status === "İletişime Geçildi" && (
                              <a
                                href={`/ogretmenler/${teacherProfile.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full mt-2 block bg-white hover:bg-gray-50 text-[#1E3A8A] border border-[#EFECE6] font-black py-2.5 rounded-xl text-xs transition text-center"
                              >
                                🔍 Yayındaki Profili Gör
                              </a>
                            )}
                          </div>
                        </div>

                        {/* Right Area: Dynamic Stats & Quick Guide */}
                        <div className="md:col-span-8 space-y-6">
                          {/* Live stats */}
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {[
                              { label: "Ders İlanları", val: teacherLessons.length, icon: "📚", tab: "dersler" },
                              { label: "Blog Yazıları", val: teacherBlogs.length, icon: "✍️", tab: "bloglar" },
                              { label: "Sorular (FAQ)", val: teacherFaqs.length, icon: "❓", tab: "faq" },
                              { label: "Öğrenci Görüşleri", val: teacherFeedbacks.length, icon: "💬", tab: "panel" }
                            ].map((s) => (
                              <button
                                key={s.label}
                                onClick={() => setDashboardTab(s.tab as any)}
                                className="bg-white border border-[#EFECE6] p-5 rounded-2xl shadow-xs text-center hover:border-[#1E3A8A]/45 hover:shadow-sm transition-all"
                              >
                                <span className="text-2xl block mb-1.5">{s.icon}</span>
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">{s.label}</span>
                                <span className="text-xl font-black text-[#1E3A8A] block mt-1">{s.val}</span>
                              </button>
                            ))}
                          </div>

                          {/* Quick Guide / Checklist */}
                          <div className="bg-white rounded-3xl border border-[#EFECE6] p-6 sm:p-8 shadow-sm">
                            <h3 className="text-lg font-black text-[#1E3A8A] mb-3">Derslinex Eğitmen Kontrol Paneli 🚀</h3>
                            <p className="text-xs text-gray-655 font-bold leading-relaxed mb-6">
                              Platformumuzda en yüksek randevu alan öğretmenlerin profillerinde eğitim, sosyal bağlantılar, net saatlik ders ücretleri ve sıkça sorulan sorular yer almaktadır.
                            </p>
                            <div className="grid sm:grid-cols-2 gap-4">
                              {[
                                { title: "Profilini Tamamla", desc: "Mezuniyet mezun bilgilerini, LinkedIn profil linkini ve kısa tanıtım yazını düzenle.", tab: "duzenle", action: "Profili Güncelle ➔" },
                                { title: "Özel Ders İlanları Oluştur", desc: "Verdiğin her branş ve seviye için saatlik ücret belirterek yeni ilanlar aç.", tab: "dersler", action: "İlanları Yönet ➔" },
                                { title: "Blog Paylaşımları Yap", desc: "YKS / LGS hazırlık tüyoları paylaşarak öğrencilerin dikkatini çek.", tab: "bloglar", action: "Blog Paylaş ➔" },
                                { title: "Soru ve Cevaplar Ekle", desc: "Zoom dersleri, iptal politikaları veya kaynaklar hakkında en sık sorulan soruları ekle.", tab: "faq", action: "Soru Ekle ➔" }
                              ].map((item) => (
                                <div key={item.title} className="p-4 bg-[#FAF8F5]/50 border border-[#EFECE6]/70 rounded-2xl flex flex-col justify-between hover:bg-[#FAF8F5] transition-all">
                                  <div>
                                    <h4 className="text-sm font-black text-gray-800">{item.title}</h4>
                                    <p className="text-xs text-gray-500 font-semibold mt-1 leading-relaxed">{item.desc}</p>
                                  </div>
                                  <button
                                    onClick={() => setDashboardTab(item.tab as any)}
                                    className="text-xs text-[#B45309] hover:text-[#92400E] font-black mt-4 block text-left"
                                  >
                                    {item.action}
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Student reviews block */}
                          <div className="bg-white rounded-3xl border border-[#EFECE6] p-6 sm:p-8 shadow-sm">
                            <h3 className="text-base font-black text-[#1E3A8A] mb-4">Öğrencilerden Gelen Son Görüşler</h3>
                            {teacherFeedbacks.length === 0 ? (
                              <p className="text-sm text-gray-500 font-semibold">Henüz size iletilen bir öğrenci görüşü veya ders talebi bulunmamaktadır.</p>
                            ) : (
                              <div className="grid sm:grid-cols-2 gap-4">
                                {teacherFeedbacks.map((f) => (
                                  <div key={f.id} className="p-4 bg-[#FAF8F5]/60 border border-[#EFECE6] rounded-2xl relative shadow-xs">
                                    <div className="flex justify-between items-center mb-2">
                                      <span className="font-black text-sm text-[#1E3A8A]">{f.studentName}</span>
                                      <span className="text-amber-500 font-bold text-xs">{f.rating} ★</span>
                                    </div>
                                    <p className="text-gray-655 text-xs font-semibold leading-relaxed mb-3">{f.content}</p>
                                    <div className="flex justify-between items-center text-[10px] text-gray-400 border-t border-[#EFECE6]/40 pt-2">
                                      <span>{f.studentEmail || "E-posta Gizli"}</span>
                                      <span>{new Date(f.createdAt).toLocaleDateString("tr-TR")}</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

{/* Tab 2: Profilimi Düzenle */}
                    {dashboardTab === "duzenle" && (
                      <div className="bg-white rounded-3xl border border-[#EFECE6] p-6 sm:p-8 max-w-3xl shadow-sm">
                        <h3 className="text-lg font-black text-[#1E3A8A] mb-2">Profil Bilgilerimi Düzenle</h3>
                        <p className="text-xs text-gray-500 font-semibold mb-6">Öğrencilerin sizi daha iyi tanıması için tüm bilgilerinizi güncel tutun.</p>
                        
                        <form onSubmit={handleTeacherUpdate} className="space-y-6">
                          {/* Avatar Picker widget */}
                          <div>
                            <label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-2">Profil Fotoğrafı Seç / Yükle</label>
                            <div className="flex flex-col sm:flex-row items-center gap-4 bg-[#FAF8F5] p-4 rounded-2xl border border-[#EFECE6]">
                              <div className="relative w-16 h-16 bg-gradient-to-b from-[#1E3A8A] to-indigo-800 rounded-full overflow-hidden flex items-center justify-center border border-[#EFECE6] shadow-xs flex-shrink-0">
                                {teacherEditForm.avatar ? (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <img src={teacherEditForm.avatar} alt="Avatar Önizleme" className="w-full h-full object-cover" />
                                ) : (
                                  <span className="text-2xl font-black text-white">{teacherEditForm.name.charAt(0) || "?"}</span>
                                )}
                              </div>
                              <div className="flex-1 w-full space-y-2.5">
                                <div className="flex items-center gap-2">
                                  <label className="cursor-pointer bg-white hover:bg-gray-50 border border-[#EFECE6] px-3.5 py-1.5 rounded-xl text-xs font-black text-gray-700 transition shadow-xs">
                                    <span>📁 Fotoğraf Seç</span>
                                    <input
                                      type="file"
                                      accept="image/*"
                                      className="hidden"
                                      onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                          const reader = new FileReader();
                                          reader.onloadend = () => {
                                            setTeacherEditForm({ ...teacherEditForm, avatar: reader.result as string });
                                          };
                                          reader.readAsDataURL(file);
                                        }
                                      }}
                                    />
                                  </label>
                                  {teacherEditForm.avatar && (
                                    <button
                                      type="button"
                                      onClick={() => setTeacherEditForm({ ...teacherEditForm, avatar: "" })}
                                      className="text-xs text-rose-600 hover:text-rose-800 font-bold"
                                    >
                                      Kaldır
                                    </button>
                                  )}
                                </div>
                                <div className="flex flex-wrap gap-1.5">
                                  {["👨‍🏫", "👩‍🏫", "🎓", "🧑‍💻", "👩‍💻", "🧑‍🎓", "👩‍🎓", "🧠", "📐", "🔬"].map((emoji) => (
                                    <button
                                      key={emoji}
                                      type="button"
                                      onClick={() => {
                                        const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="#1E3A8A"/><text x="50" y="65" font-size="50" text-anchor="middle">${emoji}</text></svg>`;
                                        const dataUrl = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
                                        setTeacherEditForm({ ...teacherEditForm, avatar: dataUrl });
                                      }}
                                      className="w-7 h-7 rounded-lg bg-white border border-[#EFECE6] flex items-center justify-center hover:bg-amber-50 hover:border-[#B45309]/50 transition-all text-sm shadow-xs"
                                    >
                                      {emoji}
                                    </button>
                                  ))}
                                </div>
                                <input
                                  type="url"
                                  placeholder="Resim URL yapıştırın (https://...)"
                                  value={teacherEditForm.avatar.startsWith("data:") ? "" : teacherEditForm.avatar}
                                  onChange={(e) => setTeacherEditForm({ ...teacherEditForm, avatar: e.target.value })}
                                  className="w-full bg-white border border-[#EFECE6] px-3 py-1.5 rounded-lg text-xs font-semibold focus:outline-none"
                                />
                              </div>
                            </div>
                          </div>

                          <div className="grid sm:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-2">Ad Soyad</label>
                              <input
                                type="text"
                                value={teacherEditForm.name}
                                onChange={(e) => setTeacherEditForm({ ...teacherEditForm, name: e.target.value })}
                                required
                                className="w-full bg-[#FAF8F5] border border-[#EFECE6] px-4 py-2.5 rounded-xl text-sm font-bold focus:outline-none focus:border-[#1E3A8A]/50"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-2">Telefon</label>
                              <input
                                type="text"
                                value={teacherEditForm.phone}
                                onChange={(e) => setTeacherEditForm({ ...teacherEditForm, phone: e.target.value })}
                                required
                                className="w-full bg-[#FAF8F5] border border-[#EFECE6] px-4 py-2.5 rounded-xl text-sm font-bold focus:outline-none focus:border-[#1E3A8A]/50"
                              />
                            </div>
                          </div>

                          <div className="grid sm:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-2">Branş</label>
                              <input
                                type="text"
                                value={teacherEditForm.branch}
                                onChange={(e) => setTeacherEditForm({ ...teacherEditForm, branch: e.target.value })}
                                required
                                className="w-full bg-[#FAF8F5] border border-[#EFECE6] px-4 py-2.5 rounded-xl text-sm font-bold focus:outline-none focus:border-[#1E3A8A]/50"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-2">Eğitim / Mezuniyet</label>
                              <input
                                type="text"
                                value={teacherEditForm.egitim}
                                onChange={(e) => setTeacherEditForm({ ...teacherEditForm, egitim: e.target.value })}
                                placeholder="Örn: Boğaziçi Üniversitesi Matematik"
                                className="w-full bg-[#FAF8F5] border border-[#EFECE6] px-4 py-2.5 rounded-xl text-sm font-bold focus:outline-none focus:border-[#1E3A8A]/50"
                              />
                            </div>
                          </div>

                          <div className="grid sm:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-2">LinkedIn Profil Linki</label>
                              <input
                                type="url"
                                value={teacherEditForm.linkedin}
                                onChange={(e) => setTeacherEditForm({ ...teacherEditForm, linkedin: e.target.value })}
                                placeholder="Örn: https://linkedin.com/in/adiniz"
                                className="w-full bg-[#FAF8F5] border border-[#EFECE6] px-4 py-2.5 rounded-xl text-sm font-bold focus:outline-none focus:border-[#1E3A8A]/50"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-2">YouTube Tanıtım Videosu Linki</label>
                              <input
                                type="url"
                                value={teacherEditForm.youtube}
                                onChange={(e) => setTeacherEditForm({ ...teacherEditForm, youtube: e.target.value })}
                                placeholder="Örn: https://youtube.com/watch?v=..."
                                className="w-full bg-[#FAF8F5] border border-[#EFECE6] px-4 py-2.5 rounded-xl text-sm font-bold focus:outline-none focus:border-[#1E3A8A]/50"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-2">Öğretmen Hakkında (Tanıtım Yazısı)</label>
                            <textarea
                              rows={5}
                              value={teacherEditForm.ozgecmis}
                              onChange={(e) => setTeacherEditForm({ ...teacherEditForm, ozgecmis: e.target.value })}
                              placeholder="Kendinizden, ders anlatım tarzınızdan ve YKS tecrübelerinizden bahsedin..."
                              className="w-full bg-[#FAF8F5] border border-[#EFECE6] px-4 py-2.5 rounded-xl text-sm font-semibold focus:outline-none focus:border-[#1E3A8A]/50"
                            />
                          </div>

                          <div className="flex gap-4">
                            <button
                              type="submit"
                              disabled={loading}
                              className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white font-black px-8 py-3.5 rounded-xl text-xs transition shadow-xs"
                            >
                              Kaydet
                            </button>
                            <button
                              type="button"
                              onClick={() => setDashboardTab("panel")}
                              className="bg-white hover:bg-gray-50 text-gray-700 border border-[#EFECE6] font-black px-8 py-3.5 rounded-xl text-xs transition"
                            >
                              Vazgeç
                            </button>
                          </div>
                        </form>
                      </div>
                    )}

                    {/* Tab 3: Özel Derslerim */}
                    {dashboardTab === "dersler" && (
                      <div className="bg-white rounded-3xl border border-[#EFECE6] p-6 sm:p-8 shadow-sm">
                        <div className="flex justify-between items-center mb-6 pb-2 border-b border-[#FAF8F5]">
                          <div>
                            <h3 className="text-lg font-black text-[#1E3A8A]">Özel Ders İlanlarım</h3>
                            <p className="text-xs text-gray-500 font-semibold mt-0.5">Sitede yayınlanacak özel ders tekliflerinizi yönetin.</p>
                          </div>
                          <button
                            onClick={() => setAddingLesson(!addingLesson)}
                            className="text-xs bg-[#B45309] hover:bg-[#92400E] text-white font-black px-4 py-2 rounded-xl transition"
                          >
                            {addingLesson ? "Vazgeç" : "➕ Yeni İlan Aç"}
                          </button>
                        </div>

                        {addingLesson ? (
                          <form onSubmit={handleAddLesson} className="space-y-4 max-w-lg">
                            <div className="grid sm:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-2">Ders Başlığı</label>
                                <input
                                  type="text"
                                  required
                                  placeholder="Örn: 10. Sınıf Fizik Özel Ders"
                                  value={lessonForm.title}
                                  onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })}
                                  className="w-full bg-[#FAF8F5] border border-[#EFECE6] px-4 py-2.5 rounded-xl text-sm font-bold focus:outline-none"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-2">Saatlik Ücret (TL)</label>
                                <input
                                  type="number"
                                  required
                                  placeholder="Örn: 400"
                                  value={lessonForm.price}
                                  onChange={(e) => setLessonForm({ ...lessonForm, price: e.target.value })}
                                  className="w-full bg-[#FAF8F5] border border-[#EFECE6] px-4 py-2.5 rounded-xl text-sm font-bold focus:outline-none"
                                />
                              </div>
                            </div>
                            <div>
                              <label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-2">Ders Formatı</label>
                              <select
                                value={lessonForm.format}
                                onChange={(e) => setLessonForm({ ...lessonForm, format: e.target.value })}
                                className="w-full bg-[#FAF8F5] border border-[#EFECE6] px-4 py-2.5 rounded-xl text-sm font-bold focus:outline-none"
                              >
                                <option value="online">Online Ders</option>
                                <option value="yuz-yuze">Yüz Yüze Ders</option>
                                <option value="her-ikisi">Online & Yüz Yüze</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-2">Açıklama (Opsiyonel)</label>
                              <textarea
                                rows={3}
                                placeholder="Ders süreci, seviye ve detaylar hakkında bilgi verin..."
                                value={lessonForm.description}
                                onChange={(e) => setLessonForm({ ...lessonForm, description: e.target.value })}
                                className="w-full bg-[#FAF8F5] border border-[#EFECE6] px-4 py-2.5 rounded-xl text-sm font-bold focus:outline-none"
                              />
                            </div>
                            <button
                              type="submit"
                              disabled={loading}
                              className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white font-black px-6 py-3 rounded-xl text-xs transition"
                            >
                              İlanı Yayınla
                            </button>
                          </form>
                        ) : (
                          teacherLessons.length === 0 ? (
                            <p className="text-sm text-gray-500 font-semibold">Henüz açtığınız bir ders ilanı bulunmuyor. İlan açarak öğrencilerin size ulaşmasını sağlayabilirsiniz.</p>
                          ) : (
                            <div className="grid sm:grid-cols-2 gap-4">
                              {teacherLessons.map((l) => (
                                <div key={l.id} className="p-4 bg-[#FAF8F5] border border-[#EFECE6] rounded-2xl relative shadow-xs flex flex-col justify-between">
                                  <div>
                                    <h4 className="font-black text-sm text-[#1E3A8A] mb-1">{l.title}</h4>
                                    <p className="text-xs text-[#B45309] font-black">{l.price} TL / Saat</p>
                                    <span className="inline-block text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-bold border border-blue-100 mt-2">
                                      {l.format === "online" ? "💻 Online" : l.format === "yuz-yuze" ? "🏫 Yüz Yüze" : "🔄 Her İkisi"}
                                    </span>
                                    {l.description && (
                                      <p className="text-gray-500 text-xs font-semibold mt-3 line-clamp-2">{l.description}</p>
                                    )}
                                  </div>
                                  <div className="text-right mt-4 pt-3 border-t border-[#EFECE6]/50">
                                    <button
                                      onClick={() => handleDeleteLesson(l.id)}
                                      className="text-xs text-rose-600 hover:text-rose-800 font-black"
                                    >
                                      🗑️ İlanı Kaldır
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )
                        )}
                      </div>
                    )}

                    {/* Tab 4: Bloglarım */}
                    {dashboardTab === "bloglar" && (
                      <div className="bg-white rounded-3xl border border-[#EFECE6] p-6 sm:p-8 shadow-sm">
                        <div className="flex justify-between items-center mb-6 pb-2 border-b border-[#FAF8F5]">
                          <div>
                            <h3 className="text-lg font-black text-[#1E3A8A]">Blog Yazılarım</h3>
                            <p className="text-xs text-gray-500 font-semibold mt-0.5">Sitede yayınlanacak YKS rehber veya ders içeriklerinizi yazın.</p>
                          </div>
                          <button
                            onClick={() => setWritingBlog(!writingBlog)}
                            className="text-xs bg-[#B45309] hover:bg-[#92400E] text-white font-black px-4 py-2 rounded-xl transition"
                          >
                            {writingBlog ? "Vazgeç" : "✍️ Yeni Yazı Paylaş"}
                          </button>
                        </div>

                        {writingBlog ? (
                          <form onSubmit={handleAddBlog} className="space-y-4">
                            <div className="grid sm:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-2">Başlık</label>
                                <input
                                  type="text"
                                  required
                                  placeholder="Örn: TYT Matematik Net Arttırma Yöntemleri"
                                  value={blogForm.title}
                                  onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
                                  className="w-full bg-[#FAF8F5] border border-[#EFECE6] px-4 py-2.5 rounded-xl text-sm font-bold focus:outline-none"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-2">Kategori</label>
                                <select
                                  value={blogForm.category}
                                  onChange={(e) => setBlogForm({ ...blogForm, category: e.target.value })}
                                  className="w-full bg-[#FAF8F5] border border-[#EFECE6] px-4 py-2.5 rounded-xl text-sm font-bold focus:outline-none"
                                >
                                  <option value="YKS Bilgi">YKS Bilgi</option>
                                  <option value="Ders Rehberleri">Ders Rehberleri</option>
                                  <option value="Çalışma Teknikleri">Çalışma Teknikleri</option>
                                  <option value="Genel Rehberlik">Genel Rehberlik</option>
                                </select>
                              </div>
                            </div>
                            <div>
                              <label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-2">İçerik</label>
                              <textarea
                                rows={8}
                                required
                                placeholder="Yazınızı buraya yazın..."
                                value={blogForm.content}
                                onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })}
                                className="w-full bg-[#FAF8F5] border border-[#EFECE6] px-4 py-2.5 rounded-xl text-sm font-semibold focus:outline-none"
                              />
                            </div>
                            <button
                              type="submit"
                              disabled={loading}
                              className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white font-black px-6 py-3 rounded-xl text-xs transition"
                            >
                              Yazıyı Yayınla
                            </button>
                          </form>
                        ) : (
                          teacherBlogs.length === 0 ? (
                            <p className="text-sm text-gray-500 font-semibold">Henüz paylaştığınız bir blog yazısı bulunmuyor. Yazı yayınlayarak öğrencilerinizin sizi tanımasını sağlayabilirsiniz.</p>
                          ) : (
                            <div className="space-y-3">
                              {teacherBlogs.map((b) => (
                                <div key={b.id} className="p-4 bg-[#FAF8F5] border border-[#EFECE6] rounded-2xl flex items-center justify-between shadow-xs">
                                  <div>
                                    <h4 className="font-black text-sm text-[#1E3A8A]">{b.title}</h4>
                                    <div className="flex gap-3 text-[10px] text-gray-400 mt-1 font-bold">
                                      <span>📂 {b.category}</span>
                                      <span>📅 {new Date(b.createdAt).toLocaleDateString("tr-TR")}</span>
                                      <a href={`/blog/${b.slug}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                        🔗 Sitede Gör
                                      </a>
                                    </div>
                                  </div>
                                  <button
                                    onClick={() => handleDeleteBlog(b.id)}
                                    className="text-xs text-rose-600 hover:text-rose-800 font-black px-2.5 py-1 rounded-lg hover:bg-rose-50"
                                  >
                                    Sil
                                  </button>
                                </div>
                              ))}
                            </div>
                          )
                        )}
                      </div>
                    )}

                    {/* Tab 5: SSS (FAQ) */}
                    {dashboardTab === "faq" && (
                      <div className="bg-white rounded-3xl border border-[#EFECE6] p-6 sm:p-8 shadow-sm">
                        <div className="flex justify-between items-center mb-6 pb-2 border-b border-[#FAF8F5]">
                          <div>
                            <h3 className="text-lg font-black text-[#1E3A8A]">Sıkça Sorulan Sorular</h3>
                            <p className="text-xs text-gray-500 font-semibold mt-0.5">Profilinizde görünecek SSS listesini yönetin.</p>
                          </div>
                          <button
                            onClick={() => setAddingFaq(!addingFaq)}
                            className="text-xs bg-[#B45309] hover:bg-[#92400E] text-white font-black px-4 py-2 rounded-xl transition"
                          >
                            {addingFaq ? "Vazgeç" : "➕ Yeni Soru Ekle"}
                          </button>
                        </div>

                        {addingFaq ? (
                          <form onSubmit={handleAddFaq} className="space-y-4">
                            <div>
                              <label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-2">Soru</label>
                              <input
                                type="text"
                                required
                                placeholder="Örn: Dersleri nerede yapıyorsunuz?"
                                value={faqForm.question}
                                onChange={(e) => setFaqForm({ ...faqForm, question: e.target.value })}
                                className="w-full bg-[#FAF8F5] border border-[#EFECE6] px-4 py-2.5 rounded-xl text-sm font-bold focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-2">Cevap</label>
                              <textarea
                                rows={3}
                                required
                                placeholder="Örn: Dersleri online olarak Zoom üzerinden ya da Kadıköy civarında yüz yüze yapıyorum."
                                value={faqForm.answer}
                                onChange={(e) => setFaqForm({ ...faqForm, answer: e.target.value })}
                                className="w-full bg-[#FAF8F5] border border-[#EFECE6] px-4 py-2.5 rounded-xl text-sm font-semibold focus:outline-none"
                              />
                            </div>
                            <button
                              type="submit"
                              disabled={loading}
                              className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white font-black px-6 py-3 rounded-xl text-xs transition"
                            >
                              Soruyu Kaydet
                            </button>
                          </form>
                        ) : (
                          teacherFaqs.length === 0 ? (
                            <p className="text-sm text-gray-500 font-semibold">Henüz eklediğiniz bir soru bulunmuyor. SSS ekleyerek öğrencilerin en çok sorduğu soruları peşinen yanıtlayabilirsiniz.</p>
                          ) : (
                            <div className="space-y-3">
                              {teacherFaqs.map((faq) => (
                                <div key={faq.id} className="p-4 bg-[#FAF8F5] border border-[#EFECE6] rounded-2xl flex items-start justify-between shadow-xs gap-4">
                                  <div className="flex-1">
                                    <h4 className="font-black text-sm text-[#1E3A8A]">{faq.question}</h4>
                                    <p className="text-xs text-gray-655 mt-2 font-semibold leading-relaxed">{faq.answer}</p>
                                  </div>
                                  <button
                                    onClick={() => handleDeleteFaq(faq.id)}
                                    className="text-xs text-rose-600 hover:text-rose-800 font-black px-2.5 py-1 rounded-lg hover:bg-rose-50 flex-shrink-0"
                                  >
                                    Sil
                                  </button>
                                </div>
                              ))}
                            </div>
                          )
                        )}
                      </div>
                    )}
                  </div>
                )}

            {/* CHAT WORKSPACE VIEW */}
            {dashboardTab === "mesajlar" && (
              <div className="bg-white rounded-3xl border border-[#EFECE6] shadow-sm overflow-hidden min-h-[500px] flex flex-col md:flex-row">
                {/* Left Sidebar: Conversations list */}
                <div className="w-full md:w-85 border-r border-[#EFECE6] flex flex-col bg-[#FAF8F5]/30">
                  <div className="p-4 border-b border-[#EFECE6] bg-[#FAF8F5]/50 flex items-center justify-between">
                    <h4 className="font-black text-xs uppercase tracking-wider text-gray-500">Sohbetler</h4>
                    <button
                      onClick={fetchChatRooms}
                      className="text-[10px] bg-white border border-[#EFECE6] text-gray-650 px-2 py-1 rounded-lg font-bold hover:bg-gray-50 transition"
                    >
                      🔄 Yenile
                    </button>
                  </div>
                  <div className="flex-1 overflow-y-auto max-h-[480px]">
                    {chatRooms.length === 0 ? (
                      <p className="p-4 text-xs text-gray-500 font-semibold text-center mt-8 leading-relaxed">
                        Henüz aktif bir site içi sohbetiniz bulunmuyor.<br />
                        {role === "student" ? "Öğretmen profillerinden 'Site İçi Mesaj Gönder' diyerek sohbet başlatabilirsiniz." : "Öğrencilerin size mesaj göndermesi bekleniyor."}
                      </p>
                    ) : (
                      chatRooms.map((room) => {
                        const nameToShow = role === "student" ? room.teacherName : room.studentName;
                        const avatarSeed = encodeURIComponent(nameToShow);
                        return (
                          <button
                            key={room.id}
                            onClick={() => setActiveRoomId(room.id)}
                            className={`w-full text-left p-4 border-b border-[#EFECE6] flex items-center gap-3 transition-colors ${
                              activeRoomId === room.id ? "bg-white border-l-4 border-l-[#1E3A8A]" : "hover:bg-[#FAF8F5]"
                            }`}
                          >
                            <img
                              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${avatarSeed}&eyebrows=default&mouth=smile`}
                              alt=""
                              className="w-10 h-10 rounded-full bg-gray-100 flex-shrink-0"
                            />
                            <div className="truncate flex-1">
                              <h5 className="font-black text-sm text-[#1E3A8A] truncate">{nameToShow}</h5>
                              <p className="text-[10px] text-gray-400 font-bold mt-0.5">Sohbeti Görüntüle →</p>
                            </div>
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* Right Chat Area */}
                <div className="flex-1 flex flex-col bg-white min-h-[500px]">
                  {activeRoomId ? (
                    <>
                      {/* Active Header */}
                      <div className="p-4 border-b border-[#EFECE6] flex items-center gap-3 bg-[#FAF8F5]/40">
                        {(() => {
                          const activeRoom = chatRooms.find((r) => r.id === activeRoomId);
                          const name = activeRoom ? (role === "student" ? activeRoom.teacherName : activeRoom.studentName) : "";
                          return (
                            <>
                              <img
                                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}&eyebrows=default&mouth=smile`}
                                alt=""
                                className="w-8 h-8 rounded-full bg-gray-100"
                              />
                              <h4 className="font-black text-sm text-[#1E3A8A]">{name}</h4>
                            </>
                          );
                        })()}
                      </div>

                      {/* Messages scroll list */}
                      <div className="flex-1 p-6 overflow-y-auto max-h-[350px] min-h-[300px] space-y-4 bg-[#FAF8F5]/10">
                        {activeRoomMessages.length === 0 ? (
                          <p className="text-center text-xs text-gray-400 py-10 font-bold">Henüz mesaj gönderilmemiş. İlk mesajı siz yazın!</p>
                        ) : (
                          activeRoomMessages.map((msg) => {
                            const isMe = msg.senderRole === role;
                            return (
                              <div
                                key={msg.id}
                                className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                              >
                                <div
                                  className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm font-semibold shadow-xs ${
                                    isMe
                                      ? "bg-[#1E3A8A] text-white rounded-tr-none"
                                      : "bg-white border border-[#EFECE6] text-gray-700 rounded-tl-none"
                                  }`}
                                >
                                  <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                                  <span className={`text-[8px] block text-right mt-1.5 ${isMe ? "text-blue-100" : "text-gray-400"}`}>
                                    {new Date(msg.createdAt).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}
                                  </span>
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>

                      {/* Message Input box */}
                      <form onSubmit={handleSendMessage} className="p-4 border-t border-[#EFECE6] flex gap-3 bg-[#FAF8F5]/30 mt-auto">
                        <input
                          type="text"
                          required
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          placeholder="Mesajınızı buraya yazın..."
                          className="flex-1 bg-white border border-[#EFECE6] px-4 py-2.5 rounded-xl text-sm font-bold focus:outline-none focus:border-[#1E3A8A]"
                        />
                        <button
                          type="submit"
                          className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white font-black px-6 py-2.5 rounded-xl text-xs transition shadow-sm"
                        >
                          Gönder 🚀
                        </button>
                      </form>
                    </>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-8 mt-12">
                      <span className="text-5xl mb-4">💬</span>
                      <h4 className="font-black text-sm text-[#1E3A8A]">Sohbet Seçilmedi</h4>
                      <p className="text-xs text-gray-500 font-semibold mt-1">Lütfen sol taraftaki listeden bir sohbet seçerek konuşmaya başlayın.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
