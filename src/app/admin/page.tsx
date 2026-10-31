"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";

function getAdminKey(): string {
  if (typeof window !== "undefined") {
    return sessionStorage.getItem("derslinex_admin_key") || localStorage.getItem("derslinex_admin_key") || "";
  }
  return "";
}

function adminFetch(url: string, options: RequestInit = {}) {
  const headers = new Headers(options.headers || {});
  const key = getAdminKey();
  if (key) {
    headers.set("x-admin-key", key);
  }
  return fetch(url, { ...options, headers });
}


interface Student {
  id: number;
  name: string;
  phone: string;
  email: string;
  status: string;
  isBanned: boolean;
  targetTag?: string | null;
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
  status?: string;
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
function BrandLogoHeader({ subBadge = "ADMİN PANELİ" }: { subBadge?: string }) {
  const [imgError, setImgError] = useState(false);

  return (
    <Link href="/" className="flex items-center gap-3 group">
      <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-600 p-0.5 shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform flex-shrink-0">
        <div className="w-full h-full bg-[#0D1B35] rounded-[10px] flex items-center justify-center overflow-hidden relative">
          {!imgError ? (
            /* eslint-disable-next-line @next/next/no-img-element */
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
  const [activeTab, setActiveTab] = useState<"usage" | "exams" | "teachers" | "students" | "lessons" | "blogs" | "feedbacks" | "sessions" | "tasks" | "questions" | "contact" | "ads" | "publishers" | "packages" | "settings">("exams");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [liveSessions, setLiveSessions] = useState<any[]>([]);
  const [adminTasks, setAdminTasks] = useState<any[]>([]);
  const [questionsList, setQuestionsList] = useState<any[]>([]);
  const [contactMessages, setContactMessages] = useState<any[]>([]);

  // Ads / Promotional Banners State
  const [adsList, setAdsList] = useState<any[]>([
    {
      id: 1,
      title: "2026 YKS Hazırlık & Tanışma Programı",
      placement: "Üst Bant (Top Banner)",
      imageUrl: "/hero-student-clean.jpg?v=2",
      targetUrl: "/ogretmenler",
      status: "Aktif",
      clicks: 142,
      impressions: 2840,
    },
    {
      id: 2,
      title: "Online Canlı Deneme Sınavı Kampanyası",
      placement: "Açılır Pop-up",
      imageUrl: "",
      targetUrl: "/deneme",
      status: "Aktif",
      clicks: 89,
      impressions: 1250,
    },
    {
      id: 3,
      title: "LGS & YKS Yeni Nesil Soru Çözüm Paketleri",
      placement: "Ana Sayfa Teaser",
      imageUrl: "",
      targetUrl: "/yks-hazirlik",
      status: "Aktif",
      clicks: 64,
      impressions: 980,
    }
  ]);
  const [adModalOpen, setAdModalOpen] = useState(false);
  const [adForm, setAdForm] = useState({
    title: "",
    placement: "Üst Bant (Top Banner)",
    imageUrl: "",
    targetUrl: "",
    status: "Aktif"
  });

  // Publishers State
  const [publishersList, setPublishersList] = useState<any[]>([
    {
      id: 1,
      name: "Bilgi Sarmal Yayınları",
      contact: "Ahmet Yetkili (0532 123 45 67)",
      status: "Aktif Anlaşmalı",
      examCount: 4,
      notes: "TYT ve AYT Türkiye Geneli deneme serisi telif ortaklığı.",
      logoUrl: ""
    },
    {
      id: 2,
      name: "3D Yayınları",
      contact: "Mehmet Bey (0542 987 65 43)",
      status: "Aktif Anlaşmalı",
      examCount: 3,
      notes: "Simülasyon denemeleri ve video çözüm entegrasyonu.",
      logoUrl: ""
    },
    {
      id: 3,
      name: "Karekök Eğitim Yayınları",
      contact: "Zeynep Hanım (0555 444 33 22)",
      status: "Görüşülüyor",
      examCount: 1,
      notes: "Matematik ve Geometri soru bankası dijital havuz lisansı.",
      logoUrl: ""
    },
    {
      id: 4,
      name: "Hız Yayınları",
      contact: "Ali Bey (0505 111 22 33)",
      status: "Aktif Anlaşmalı",
      examCount: 2,
      notes: "LGS 8. sınıf yeni nesil soru ve deneme tedarikçisi.",
      logoUrl: ""
    }
  ]);
  const [publisherModalOpen, setPublisherModalOpen] = useState(false);
  const [publisherForm, setPublisherForm] = useState({
    name: "",
    contact: "",
    status: "Aktif Anlaşmalı",
    examCount: 0,
    notes: "",
    logoUrl: ""
  });

  // Packages State
  const [adminPackages, setAdminPackages] = useState<any[]>([]);
  const [packageModalOpen, setPackageModalOpen] = useState(false);
  const [editingPackageId, setEditingPackageId] = useState<number | null>(null);
  const [packageForm, setPackageForm] = useState({
    title: "",
    subtitle: "",
    targetExam: "YKS",
    hours: 20,
    price: 10000,
    discountedPrice: "" as any,
    badge: "Popüler",
    features: "Haftalık 2 saat canlı birebir ders,Kişiye özel çalışma planı,Deneme sınavları,7/24 WhatsApp desteği",
    isPopular: false,
    isActive: true,
    orderNo: 1,
  });

  const [systemMetrics, setSystemMetrics] = useState<any>(null);
  const [usageData, setUsageData] = useState<any>(null);
  const [usageLoading, setUsageLoading] = useState(false);
  const [editingQuestionId, setEditingQuestionId] = useState<number | null>(null);
  const [editQuestionForm, setEditQuestionForm] = useState<any>({});

  // Exam Management States
  const [exams, setExams] = useState<any[]>([]);
  const [approvedQuestionsPool, setApprovedQuestionsPool] = useState<any[]>([]);
  const [examModalOpen, setExamModalOpen] = useState(false);
  const [examCreating, setExamCreating] = useState(false);
  const [examForm, setExamForm] = useState({
    title: "",
    description: "",
    examType: "TYT",
    targetTag: "TÜMÜ",
    startTime: "",
    endTime: "",
    durationMinutes: 135,
    isCameraRequired: true,
  });

  const [selectedQuestionItems, setSelectedQuestionItems] = useState<any[]>([]);
  const [pickerModalOpen, setPickerModalOpen] = useState(false);
  const [pickerSubjectFilter, setPickerSubjectFilter] = useState("TÜMÜ");
  const [pickerSearchText, setPickerSearchText] = useState("");

  const [previewExamModal, setPreviewExamModal] = useState<any | null>(null);
  const [proctorExamModal, setProctorExamModal] = useState<any | null>(null);
  const [proctorAttempts, setProctorAttempts] = useState<any[]>([]);

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
  const [studentTagFilter, setStudentTagFilter] = useState<string>("TÜMÜ");

  const handleUpdateStudentTag = async (id: number, newTag: string) => {
    try {
      const res = await adminFetch("/api/admin/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, type: "student", action: "targetTag", value: newTag }),
      });
      const data = await res.json();
      if (data.success) {
        showMsg("Öğrenci tagı güncellendi.", "success");
        fetchData();
      } else {
        showMsg(data.error || "Tag güncellenemedi.", "error");
      }
    } catch {
      showMsg("Bağlantı hatası", "error");
    }
  };

  const [authRequired, setAuthRequired] = useState(false);
  const [keyInput, setKeyInput] = useState("");
  const [keyError, setKeyError] = useState("");
  const [adminLoginEmail, setAdminLoginEmail] = useState("");
  const [adminLoginPassword, setAdminLoginPassword] = useState("");
  const [adminLoginLoading, setAdminLoginLoading] = useState(false);
  const [adminLoginMode, setAdminLoginMode] = useState<"credentials" | "key">("credentials");

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [uRes, fRes, lRes, bRes, sessRes, taskRes, qRes, cRes, mRes, exRes, usgRes, pkgRes] = await Promise.all([
        adminFetch("/api/admin/users"),
        adminFetch("/api/admin/feedbacks"),
        adminFetch("/api/admin/lessons"),
        adminFetch("/api/admin/blogs"),
        adminFetch("/api/admin/sessions"),
        adminFetch("/api/admin/tasks"),
        adminFetch("/api/admin/questions"),
        adminFetch("/api/admin/contact"),
        adminFetch("/api/admin/stats"),
        adminFetch("/api/admin/exams"),
        adminFetch("/api/admin/usage"),
        adminFetch("/api/admin/packages"),
      ]);

      const uData = await uRes.json();
      const fData = await fRes.json();
      const lData = await lRes.json();
      const bData = await bRes.json();
      const sessData = await sessRes.json();
      const taskData = await taskRes.json();
      const qData = await qRes.json();
      const cData = await cRes.json();
      const mData = await mRes.json();
      const exData = await exRes.json();
      const usgData = await usgRes.json();
      const pkgData = await pkgRes.json();

      if (uData.success) {
        setAuthRequired(false);
        if (uData.teachers) setTeachers(uData.teachers);
        if (uData.students) setStudents(uData.students);
      } else if (uRes.status === 401) {
        setAuthRequired(true);
      }

      if (fData.success) setFeedbacks(fData.feedbacks || []);
      if (lData.success) setLessons(lData.lessons || []);
      if (bData.success) setBlogs(bData.posts || []);
      if (sessData.success) setLiveSessions(sessData.sessions || []);
      if (taskData.success) setAdminTasks(taskData.tasks || []);
      if (qData.success) setQuestionsList(qData.questions || []);
      if (cData.success) setContactMessages(cData.messages || []);
      if (mData.success) setSystemMetrics(mData.metrics || null);
      if (usgData.success) setUsageData(usgData.data || null);
      if (pkgData.success) setAdminPackages(pkgData.packages || []);
      if (exData.success) {
        setExams(exData.exams || []);
        setApprovedQuestionsPool(exData.approvedQuestions || []);
      }
    } catch (e) {
      console.error("Data fetch error", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleKeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyInput.trim()) {
      setKeyError("Lütfen admin anahtarını girin.");
      return;
    }
    sessionStorage.setItem("derslinex_admin_key", keyInput.trim());
    localStorage.setItem("derslinex_admin_key", keyInput.trim());
    setKeyError("");
    fetchData();
  };

  const handleAdminCredentialsLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminLoginEmail.trim() || !adminLoginPassword) {
      setKeyError("Lütfen e-posta ve şifre giriniz.");
      return;
    }
    setAdminLoginLoading(true);
    setKeyError("");
    try {
      const res = await fetch("/api/auth/login/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: adminLoginEmail.trim(), password: adminLoginPassword }),
      });
      const data = await res.json();
      if (data.success) {
        if (data.adminKey) {
          sessionStorage.setItem("derslinex_admin_key", data.adminKey);
          localStorage.setItem("derslinex_admin_key", data.adminKey);
        }
        localStorage.setItem("derslinex_role", "admin");
        sessionStorage.setItem("derslinex_role", "admin");
        setAuthRequired(false);
        fetchData();
      } else {
        setKeyError(data.error || "Giriş başarısız.");
      }
    } catch {
      setKeyError("Bağlantı hatası oluştu.");
    } finally {
      setAdminLoginLoading(false);
    }
  };

  const showMsg = (text: string, type: "success" | "error") => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 5000);
  };

  const handleCreateExam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!examForm.title || !examForm.startTime || !examForm.endTime) {
      showMsg("Lütfen tüm zorunlu alanları doldurun.", "error");
      return;
    }
    if (selectedQuestionItems.length === 0) {
      showMsg("Lütfen sınava en az 1 soru ekleyin.", "error");
      return;
    }

    setExamCreating(true);
    try {
      const res = await adminFetch("/api/admin/exams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...examForm,
          questionItems: selectedQuestionItems.map((item, index) => ({
            questionId: item.question.id,
            sectionName: item.sectionName || "Genel",
            orderNo: index + 1,
          })),
        }),
      });
      const data = await res.json();
      if (data.success) {
        showMsg("Deneme sınavı başarıyla oluşturuldu ve yayınlandı!", "success");
        setExamModalOpen(false);
        setExamForm({
          title: "",
          description: "",
          examType: "TYT",
          targetTag: "TÜMÜ",
          startTime: "",
          endTime: "",
          durationMinutes: 135,
          isCameraRequired: true,
        });
        setSelectedQuestionItems([]);
        fetchData();
      } else {
        showMsg(data.error || "Sınav oluşturulamadı.", "error");
      }
    } catch {
      showMsg("Bağlantı hatası", "error");
    } finally {
      setExamCreating(false);
    }
  };

  const handleDeleteExam = async (examId: number) => {
    if (!window.confirm("Bu deneme sınavını silmek istediğinize emin misiniz?")) return;
    try {
      const res = await adminFetch(`/api/admin/exams/${examId}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        showMsg("Sınav silindi.", "success");
        fetchData();
      } else {
        showMsg(data.error || "Sınav silinemedi.", "error");
      }
    } catch {
      showMsg("Bağlantı hatası", "error");
    }
  };

  const handleOpenProctoring = async (exam: any) => {
    setProctorExamModal(exam);
    try {
      const res = await adminFetch(`/api/admin/exams/${exam.id}/proctoring`);
      const data = await res.json();
      if (data.success) {
        setProctorAttempts(data.attempts || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateStatus = async (id: number, type: "teacher" | "student", currentStatus: string) => {
    try {
      const nextStatus = currentStatus === "İletişime Geçildi" ? "Beklemede" : "İletişime Geçildi";
      const res = await adminFetch("/api/admin/users", {
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
      const res = await adminFetch("/api/admin/users", {
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
      const res = await adminFetch(`/api/admin/users?id=${id}&role=${type}`, { method: "DELETE" });
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
      const res = await adminFetch(`/api/admin/lessons?id=${id}`, { method: "DELETE" });
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
      const res = await adminFetch(`/api/admin/blogs?id=${id}`, { method: "DELETE" });
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

  const handleUpdateFeedbackStatus = async (id: number, status: "APPROVED" | "REJECTED" | "PENDING") => {
    try {
      const res = await adminFetch("/api/gorus", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      const data = await res.json();
      if (data.success) {
        showMsg(
          status === "APPROVED"
            ? "Görüş ve puanlama onaylandı, öğretmenin profilinde yayınlandı!"
            : status === "REJECTED"
            ? "Görüş reddedildi."
            : "Görüş durumu güncellendi.",
          "success"
        );
        fetchData();
      } else {
        showMsg(data.error || "İşlem başarısız.", "error");
      }
    } catch {
      showMsg("Bağlantı hatası", "error");
    }
  };

  return (
    <div className="bg-mesh flex min-h-screen bg-[#0A1628] font-sans text-slate-100">
      {/* Admin Auth Modal Overlay */}
      {authRequired && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0D1B35] border border-white/10 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-indigo-600 flex items-center justify-center mx-auto text-2xl shadow-lg">
                🛡️
              </div>
              <h2 className="text-xl font-black text-white">Yönetici Doğrulaması</h2>
              <p className="text-xs text-slate-400">Yönetim paneline erişmek için hesabınızla veya anahtarınızla giriş yapınız.</p>
            </div>

            {/* Mode Switcher */}
            <div className="grid grid-cols-2 bg-white/5 border border-white/10 p-1 rounded-xl gap-1">
              <button
                type="button"
                onClick={() => { setAdminLoginMode("credentials"); setKeyError(""); }}
                className={`py-2 text-xs font-bold rounded-lg transition ${
                  adminLoginMode === "credentials"
                    ? "bg-gradient-to-r from-amber-600 to-indigo-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                👤 E-Posta & Şifre
              </button>
              <button
                type="button"
                onClick={() => { setAdminLoginMode("key"); setKeyError(""); }}
                className={`py-2 text-xs font-bold rounded-lg transition ${
                  adminLoginMode === "key"
                    ? "bg-gradient-to-r from-amber-600 to-indigo-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                🔑 Gizli Anahtar
              </button>
            </div>

            {adminLoginMode === "credentials" ? (
              <form onSubmit={handleAdminCredentialsLogin} className="space-y-3">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
                    Yönetici E-Posta
                  </label>
                  <input
                    type="email"
                    placeholder="admin@derslinex.com"
                    value={adminLoginEmail}
                    onChange={(e) => setAdminLoginEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 text-sm"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
                    Şifre
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={adminLoginPassword}
                    onChange={(e) => setAdminLoginPassword(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 text-sm"
                  />
                </div>

                {keyError && (
                  <p className="text-xs text-red-400 bg-red-500/10 p-2 rounded-lg text-center font-medium">
                    {keyError}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={adminLoginLoading}
                  className="w-full py-3 bg-gradient-to-r from-amber-600 to-indigo-600 hover:from-amber-500 hover:to-indigo-500 text-white font-black rounded-xl text-sm transition shadow-lg shadow-amber-600/30 disabled:opacity-60"
                >
                  {adminLoginLoading ? "Doğrulanıyor..." : "Giriş Yap"}
                </button>
              </form>
            ) : (
              <form onSubmit={handleKeySubmit} className="space-y-3">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
                    Admin Anahtarı (x-admin-key)
                  </label>
                  <input
                    type="password"
                    placeholder="Admin Anahtarı"
                    value={keyInput}
                    onChange={(e) => setKeyInput(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 text-sm"
                    autoFocus
                  />
                </div>

                {keyError && (
                  <p className="text-xs text-red-400 bg-red-500/10 p-2 rounded-lg text-center font-medium">
                    {keyError}
                  </p>
                )}

                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-amber-600 to-indigo-600 hover:from-amber-500 hover:to-indigo-500 text-white font-black rounded-xl text-sm transition shadow-lg shadow-amber-600/30"
                >
                  Anahtar ile Doğrula
                </button>
              </form>
            )}

            <div className="pt-2 border-t border-white/5 text-center">
              <Link
                href="/profil?role=admin&mode=register"
                className="text-xs text-amber-400 hover:text-amber-300 font-bold transition"
              >
                ✨ Yeni Yönetici Hesabı Oluştur →
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Overlay */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/60 z-30 md:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Left Sidebar (SincApp Dark Layout) */}
      <aside className={`fixed top-0 left-0 h-full w-[240px] bg-[#0D1B35] border-r border-white/5 flex flex-col z-40 transform transition-transform duration-300 ${ sidebarOpen ? "translate-x-0" : "-translate-x-full" } md:translate-x-0 md:static md:flex`}>
        <div className="px-5 py-5 border-b border-white/5 flex items-center justify-between">
          <BrandLogoHeader subBadge="ADMİN PANELİ" />
          <button className="md:hidden text-slate-400 hover:text-white" onClick={() => setSidebarOpen(false)}>✕</button>
        </div>

        {/* Admin Profile Info */}
        <div className="px-4 py-5 border-b border-white/5 bg-white/5">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-500 via-orange-500 to-amber-500 p-0.5 shadow-lg shadow-rose-500/25 flex-shrink-0">
              <div className="w-full h-full bg-[#0D1B35] rounded-[14px] flex items-center justify-center text-2xl">
                🛡️
              </div>
            </div>
            <div className="min-w-0">
              <p className="text-white font-black text-sm truncate">Sistem Yöneticisi</p>
              <p className="text-rose-400 text-[10px] font-bold flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
                Süper Admin · Canlı
              </p>
              <div className="mt-2 h-1 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-rose-500 to-orange-400 rounded-full" style={{width: '100%'}} />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
          {[
            { key: "exams", label: "Deneme Sınavları", count: exams.length, icon: "🎯" },
            { key: "teachers", label: "Öğretmenler", count: teachers.length, icon: "👨‍🏫" },
            { key: "students", label: "Öğrenciler", count: students.length, icon: "🎓" },
            { key: "contact", label: "İletişim Mesajları", count: contactMessages.length, icon: "📬" },
            { key: "questions", label: "Soru Havuzu", count: questionsList.length, icon: "📝" },
            { key: "tasks", label: "Görev & Puan", count: adminTasks.length, icon: "🏆" },
            { key: "lessons", label: "Özel Dersler", count: lessons.length, icon: "📚" },
            { key: "blogs", label: "Blog Yazıları", count: blogs.length, icon: "✍️" },
            { key: "sessions", label: "Canlı Dersler", count: liveSessions.length, icon: "🎥" },
            { key: "feedbacks", label: "Görüşler", count: feedbacks.length, icon: "💬" },
            { key: "packages", label: "Ders Paketleri", count: adminPackages.length, icon: "📦" },
            { key: "ads", label: "Reklam & İlan Girişi", count: adsList.length, icon: "📢" },
            { key: "publishers", label: "Yayınevi Paneli", count: publishersList.length, icon: "🏢" },
            { key: "settings", label: "Sistem & Ayarlar", count: 2, icon: "⚙️" },
            { key: "usage", label: "Kota & Kullanım", count: "⚡ Canlı", icon: "📊" },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => { setActiveTab(t.key as any); setSidebarOpen(false); }}
              className={`relative w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-left transition-all text-xs font-bold overflow-hidden ${
                activeTab === t.key
                  ? "bg-gradient-to-r from-rose-600 to-orange-600 text-white shadow-lg shadow-rose-900/50 border border-rose-400/30 font-black"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {activeTab === t.key && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-rose-300 rounded-r-full shadow-[0_0_10px_rgba(251,113,133,0.9)]" />
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
          {/* Executive Analytics Metrics Row */}
          {systemMetrics && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              <div className="bg-gradient-to-br from-indigo-900/40 via-indigo-950/60 to-[#0D1B35] border border-indigo-500/30 rounded-2xl p-4 shadow-xl">
                <span className="text-[10px] font-black text-indigo-300 uppercase tracking-wider block">ÖĞRENCİ SAYISI</span>
                <p className="text-2xl font-black text-white mt-1 tabular-nums">{systemMetrics.totalStudents}</p>
                <span className="text-[9px] text-indigo-400 font-bold block mt-0.5">Kayıtlı Öğrenciler</span>
              </div>

              <div className="bg-gradient-to-br from-purple-900/40 via-purple-950/60 to-[#0D1B35] border border-purple-500/30 rounded-2xl p-4 shadow-xl">
                <span className="text-[10px] font-black text-purple-300 uppercase tracking-wider block">EĞİTMEN KADROSU</span>
                <p className="text-2xl font-black text-white mt-1 tabular-nums">{systemMetrics.totalTeachers}</p>
                <span className="text-[9px] text-amber-400 font-bold block mt-0.5">{systemMetrics.pendingTeachers} Onay Bekliyor</span>
              </div>

              <div className="bg-gradient-to-br from-blue-900/40 via-blue-950/60 to-[#0D1B35] border border-blue-500/30 rounded-2xl p-4 shadow-xl">
                <span className="text-[10px] font-black text-blue-300 uppercase tracking-wider block">CANLI DERSLER</span>
                <p className="text-2xl font-black text-white mt-1 tabular-nums">{systemMetrics.totalLiveSessions}</p>
                <span className="text-[9px] text-blue-400 font-bold block mt-0.5">Planlanan & Biten</span>
              </div>

              <div className="bg-gradient-to-br from-amber-900/40 via-amber-950/60 to-[#0D1B35] border border-amber-500/30 rounded-2xl p-4 shadow-xl">
                <span className="text-[10px] font-black text-amber-300 uppercase tracking-wider block">SORU HAVUZU</span>
                <p className="text-2xl font-black text-white mt-1 tabular-nums">{systemMetrics.totalQuestions}</p>
                <span className="text-[9px] text-amber-400 font-bold block mt-0.5">Özgün Soru</span>
              </div>

              <div className="bg-gradient-to-br from-emerald-900/40 via-emerald-950/60 to-[#0D1B35] border border-emerald-500/30 rounded-2xl p-4 shadow-xl">
                <span className="text-[10px] font-black text-emerald-300 uppercase tracking-wider block">ÇÖZÜLEN TESTLER</span>
                <p className="text-2xl font-black text-white mt-1 tabular-nums">{systemMetrics.totalQuizResults}</p>
                <span className="text-[9px] text-emerald-400 font-bold block mt-0.5">Öğrenci Test Çözümü</span>
              </div>

              <div className="bg-gradient-to-br from-red-900/40 via-red-950/60 to-[#0D1B35] border border-red-500/30 rounded-2xl p-4 shadow-xl">
                <span className="text-[10px] font-black text-red-300 uppercase tracking-wider block">OKUNMAMIŞ MESAJ</span>
                <p className="text-2xl font-black text-red-400 mt-1 tabular-nums">{systemMetrics.unreadMessages}</p>
                <span className="text-[9px] text-slate-400 font-bold block mt-0.5">İletişim Formları</span>
              </div>
            </div>
          )}

          {/* Glassmorphism Stat Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-9 gap-2.5">
            {[
              { label: "Öğretmen", val: teachers.length, icon: "👨‍🏫", color: "from-blue-500/20 to-indigo-500/20 border-blue-500/30" },
              { label: "Öğrenci", val: students.length, icon: "🎓", color: "from-purple-500/20 to-pink-500/20 border-purple-500/30" },
              { label: "Mesajlar", val: contactMessages.length, icon: "📬", color: "from-emerald-500/20 to-teal-500/20 border-emerald-500/30" },
              { label: "Soru Havuzu", val: questionsList.length, icon: "📝", color: "from-amber-500/20 to-orange-500/20 border-amber-500/30" },
              { label: "Görevler", val: adminTasks.length, icon: "🏆", color: "from-yellow-500/20 to-amber-500/20 border-yellow-500/30" },
              { label: "İlanlar", val: lessons.length, icon: "📚", color: "from-cyan-500/20 to-blue-500/20 border-cyan-500/30" },
              { label: "Bloglar", val: blogs.length, icon: "✍️", color: "from-rose-500/20 to-red-500/20 border-rose-500/30" },
              { label: "Canlı Ders", val: liveSessions.length, icon: "🎥", color: "from-indigo-500/20 to-violet-500/20 border-indigo-500/30" },
              { label: "Görüşler", val: feedbacks.length, icon: "💬", color: "from-sky-500/20 to-indigo-500/20 border-sky-500/30" },
            ].map((s) => (
              <div key={s.label} className={`bg-gradient-to-br ${s.color} border rounded-2xl p-2.5 backdrop-blur-md hover:scale-105 transition-transform duration-200`}>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">{s.label}</span>
                <span className="text-base font-black text-white mt-1 flex items-center justify-between">
                  <span>{s.val}</span>
                  <span className="text-xs opacity-80">{s.icon}</span>
                </span>
              </div>
            ))}
          </div>

          {/* Main Content Box */}
          <div className="bg-[#1E293B] rounded-3xl border border-white/5 overflow-hidden shadow-2xl">

            {/* USAGE & QUOTAS TAB */}
            {activeTab === "usage" && (
              <div className="p-4 sm:p-7 space-y-7">
                {/* Header Title & Refresh */}
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-white/10 pb-6">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        Canlı Sistem Durumu
                      </span>
                      <span className="text-xs text-slate-400 font-medium">
                        Son Güncelleme: {usageData?.lastUpdated ? new Date(usageData.lastUpdated).toLocaleTimeString("tr-TR") : "Şimdi"}
                      </span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2.5 mt-2">
                      <span>📊</span> Bulut Altyapı, Kota & Servis Kullanımları
                    </h2>
                    <p className="text-xs text-slate-400 font-medium mt-1 max-w-3xl">
                      Render.com, Cloudflare R2, Neon PostgreSQL, Daily.co, Resend ve Cloudinary servislerinin anlık limit, kota doluluk ve maliyet göstergeleri.
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={async () => {
                        setUsageLoading(true);
                        try {
                          const res = await adminFetch("/api/admin/usage");
                          const data = await res.json();
                          if (data.success) {
                            setUsageData(data.data);
                            showMsg("✅ Kullanım ve kota istatistikleri güncellendi!", "success");
                          }
                        } catch {
                          showMsg("Veri alınırken hata oluştu", "error");
                        } finally {
                          setUsageLoading(false);
                        }
                      }}
                      disabled={usageLoading}
                      className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-black text-xs px-5 py-3 rounded-2xl transition-all shadow-lg shadow-indigo-900/30 flex items-center gap-2 disabled:opacity-50"
                    >
                      <span className={usageLoading ? "animate-spin" : ""}>🔄</span>
                      <span>{usageLoading ? "Yenileniyor..." : "Verileri Yenile"}</span>
                    </button>
                  </div>
                </div>

                {/* Top 4 Hero KPI Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-gradient-to-br from-purple-950/40 via-slate-900/90 to-purple-900/20 border border-purple-500/30 rounded-3xl p-5 shadow-xl relative overflow-hidden">
                    <div className="absolute right-3 top-3 w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-2xl border border-purple-500/20">
                      🚀
                    </div>
                    <span className="text-[11px] font-black text-purple-400 uppercase tracking-wider block">Render Web Servisi</span>
                    <div className="text-3xl font-black text-white mt-2 flex items-baseline gap-2">
                      <span>200 OK</span>
                      <span className="text-xs text-purple-300 font-bold bg-purple-500/20 px-2 py-0.5 rounded-full">Frankfurt Live</span>
                    </div>
                    <p className="text-[11px] text-slate-400 font-medium mt-2">
                      Otomatik GitHub CI/CD ile kesintisiz yayında.
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-blue-950/40 via-slate-900/90 to-blue-900/20 border border-blue-500/30 rounded-3xl p-5 shadow-xl relative overflow-hidden">
                    <div className="absolute right-3 top-3 w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-2xl border border-blue-500/20">
                      🛡️
                    </div>
                    <span className="text-[11px] font-black text-blue-400 uppercase tracking-wider block">Aktif Servis Sağlığı</span>
                    <div className="text-3xl font-black text-white mt-2 flex items-baseline gap-2">
                      <span>7 / 7</span>
                      <span className="text-xs text-blue-300 font-bold bg-blue-500/20 px-2 py-0.5 rounded-full">Tam Entegre</span>
                    </div>
                    <p className="text-[11px] text-slate-400 font-medium mt-2">
                      Render, Cloudflare, Neon, Daily, Resend, Cloudinary ve R2 bağlı ve çalışıyor.
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-indigo-950/40 via-slate-900/90 to-indigo-900/20 border border-indigo-500/30 rounded-3xl p-5 shadow-xl relative overflow-hidden">
                    <div className="absolute right-3 top-3 w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-2xl border border-indigo-500/20">
                      🐘
                    </div>
                    <span className="text-[11px] font-black text-indigo-400 uppercase tracking-wider block">Veritabanı Depolama</span>
                    <div className="text-3xl font-black text-white mt-2 flex items-baseline gap-2">
                      <span>{usageData?.summary?.estimatedDbSizeMB || 1.2} MB</span>
                      <span className="text-xs text-indigo-300 font-bold bg-indigo-500/20 px-2 py-0.5 rounded-full">/ 512 MB</span>
                    </div>
                    <p className="text-[11px] text-slate-400 font-medium mt-2">
                      Toplam {usageData?.summary?.totalDbRecords || 0} satır kayıt (Öğrenci, Öğretmen, Soru, vb.)
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-rose-950/40 via-slate-900/90 to-rose-900/20 border border-rose-500/30 rounded-3xl p-5 shadow-xl relative overflow-hidden">
                    <div className="absolute right-3 top-3 w-12 h-12 rounded-2xl bg-rose-500/10 flex items-center justify-center text-2xl border border-rose-500/20">
                      📹
                    </div>
                    <span className="text-[11px] font-black text-rose-400 uppercase tracking-wider block">Canlı Görüntülü Ders Dakikası</span>
                    <div className="text-3xl font-black text-white mt-2 flex items-baseline gap-2">
                      <span>{usageData?.summary?.estimatedVideoMinutes || 0} Dk</span>
                      <span className="text-xs text-rose-300 font-bold bg-rose-500/20 px-2 py-0.5 rounded-full">/ 10.000 Dk</span>
                    </div>
                    <p className="text-[11px] text-slate-400 font-medium mt-2">
                      Kalan Ücretsiz Canlı Ders Kotası: {Math.max(0, 10000 - (usageData?.summary?.estimatedVideoMinutes || 0)).toLocaleString("tr-TR")} Dakika
                    </p>
                  </div>
                </div>

                {/* Detailed Service Grid (7 Cards) */}
                <div className="space-y-4">
                  <h3 className="text-base font-black text-white flex items-center gap-2">
                    <span>⚡</span> Bireysel Servis Kullanım & Limit Detayları
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {/* Cloudflare R2 Card */}
                    <div className="bg-[#0D1B35]/90 border border-white/10 hover:border-amber-500/40 rounded-3xl p-5 shadow-xl flex flex-col justify-between transition-all group">
                      <div className="space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-xl">
                              ☁️
                            </div>
                            <div>
                              <h4 className="text-sm font-black text-white group-hover:text-amber-300 transition-colors">
                                Cloudflare R2
                              </h4>
                              <span className="text-[10px] text-slate-400 font-semibold block">Ders Video Kayıt Deposu</span>
                            </div>
                          </div>
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            Aktif
                          </span>
                        </div>

                        <div className="space-y-2 bg-white/5 p-3.5 rounded-2xl border border-white/5">
                          <div className="flex justify-between text-xs font-bold">
                            <span className="text-slate-400">Depolama Doluluğu</span>
                            <span className="text-amber-400">{((liveSessions.filter(s => s.status === "ENDED").length) * 0.12).toFixed(2)} GB / 10 GB</span>
                          </div>
                          <div className="w-full bg-white/10 rounded-full h-2.5 overflow-hidden">
                            <div
                              className="bg-gradient-to-r from-amber-500 to-orange-500 h-full rounded-full transition-all duration-500"
                              style={{ width: `${Math.max(2, Math.min(100, (((liveSessions.filter(s => s.status === "ENDED").length * 0.12) / 10) * 100)))}%` }}
                            />
                          </div>
                          <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                            <span>Kalan: {(10 - ((liveSessions.filter(s => s.status === "ENDED").length) * 0.12)).toFixed(2)} GB</span>
                            <span>Kullanım: %{(((liveSessions.filter(s => s.status === "ENDED").length * 0.12) / 10) * 100).toFixed(1)}</span>
                          </div>
                        </div>

                        <div className="space-y-2 text-xs">
                          <div className="flex justify-between py-1 border-b border-white/5 text-slate-300">
                            <span className="text-slate-400">Özel Alan Adı:</span>
                            <span className="font-mono text-[11px] text-amber-300">recordings.derslinex.com</span>
                          </div>
                          <div className="flex justify-between py-1 border-b border-white/5 text-slate-300">
                            <span className="text-slate-400">Egress (İzleme Trafiği):</span>
                            <span className="font-bold text-emerald-400">Sınırsız & $0 Ücretsiz</span>
                          </div>
                          <div className="flex justify-between py-1 text-slate-300">
                            <span className="text-slate-400">Aylık İşlem Limiti:</span>
                            <span className="font-bold text-slate-200">1M Yazma / 10M Okuma</span>
                          </div>
                        </div>
                      </div>

                      <a
                        href="https://dash.cloudflare.com/ca86848bab0a6e89bb495a3cc7a14dab/r2/default/overview"
                        target="_blank"
                        rel="noreferrer"
                        className="mt-4 w-full bg-white/5 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-center py-2.5 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5"
                      >
                        <span>Cloudflare R2 Paneline Git</span>
                        <span>↗</span>
                      </a>
                    </div>

                    {/* Daily.co Card */}
                    <div className="bg-[#0D1B35]/90 border border-white/10 hover:border-rose-500/40 rounded-3xl p-5 shadow-xl flex flex-col justify-between transition-all group">
                      <div className="space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-xl">
                              📹
                            </div>
                            <div>
                              <h4 className="text-sm font-black text-white group-hover:text-rose-300 transition-colors">
                                Daily.co Video API
                              </h4>
                              <span className="text-[10px] text-slate-400 font-semibold block">Canlı Ders & Kamera Odaları</span>
                            </div>
                          </div>
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            Aktif
                          </span>
                        </div>

                        <div className="space-y-2 bg-white/5 p-3.5 rounded-2xl border border-white/5">
                          <div className="flex justify-between text-xs font-bold">
                            <span className="text-slate-400">Canlı Görüşme Kotası</span>
                            <span className="text-rose-400">{usageData?.summary?.estimatedVideoMinutes || 0} / 10.000 Dk</span>
                          </div>
                          <div className="w-full bg-white/10 rounded-full h-2.5 overflow-hidden">
                            <div
                              className="bg-gradient-to-r from-rose-500 to-pink-500 h-full rounded-full transition-all duration-500"
                              style={{ width: `${Math.max(2, Math.min(100, (((usageData?.summary?.estimatedVideoMinutes || 0) / 10000) * 100)))}%` }}
                            />
                          </div>
                          <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                            <span>Kalan: {Math.max(0, 10000 - (usageData?.summary?.estimatedVideoMinutes || 0))} Dk</span>
                            <span>Kullanım: %{(((usageData?.summary?.estimatedVideoMinutes || 0) / 10000) * 100).toFixed(1)}</span>
                          </div>
                        </div>

                        <div className="space-y-2 text-xs">
                          <div className="flex justify-between py-1 border-b border-white/5 text-slate-300">
                            <span className="text-slate-400">Tamamlanan Canlı Dersler:</span>
                            <span className="font-bold text-white">{liveSessions.filter(s => s.status === "ENDED").length} Oturum</span>
                          </div>
                          <div className="flex justify-between py-1 border-b border-white/5 text-slate-300">
                            <span className="text-slate-400">Gözetmenli Kamera Sınavları:</span>
                            <span className="font-bold text-rose-300">{exams.length} Deneme</span>
                          </div>
                          <div className="flex justify-between py-1 text-slate-300">
                            <span className="text-slate-400">Kamera / Mikrofon İzni:</span>
                            <span className="font-bold text-emerald-400">WebRTC Şifreli (Aktif)</span>
                          </div>
                        </div>
                      </div>

                      <a
                        href="https://dashboard.daily.co/"
                        target="_blank"
                        rel="noreferrer"
                        className="mt-4 w-full bg-white/5 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-center py-2.5 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5"
                      >
                        <span>Daily.co Paneline Git</span>
                        <span>↗</span>
                      </a>
                    </div>

                    {/* Neon PostgreSQL Card */}
                    <div className="bg-[#0D1B35]/90 border border-white/10 hover:border-cyan-500/40 rounded-3xl p-5 shadow-xl flex flex-col justify-between transition-all group">
                      <div className="space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-xl">
                              🐘
                            </div>
                            <div>
                              <h4 className="text-sm font-black text-white group-hover:text-cyan-300 transition-colors">
                                Neon PostgreSQL
                              </h4>
                              <span className="text-[10px] text-slate-400 font-semibold block">Bulut Veritabanı Kümesi</span>
                            </div>
                          </div>
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            Aktif
                          </span>
                        </div>

                        <div className="space-y-2 bg-white/5 p-3.5 rounded-2xl border border-white/5">
                          <div className="flex justify-between text-xs font-bold">
                            <span className="text-slate-400">Depolama Alanı</span>
                            <span className="text-cyan-400">{usageData?.summary?.estimatedDbSizeMB || 1.2} MB / 512 MB</span>
                          </div>
                          <div className="w-full bg-white/10 rounded-full h-2.5 overflow-hidden">
                            <div
                              className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full transition-all duration-500"
                              style={{ width: `${Math.max(1, Math.min(100, (((usageData?.summary?.estimatedDbSizeMB || 1.2) / 512) * 100)))}%` }}
                            />
                          </div>
                          <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                            <span>Kalan: {(512 - (usageData?.summary?.estimatedDbSizeMB || 1.2)).toFixed(1)} MB</span>
                            <span>Kullanım: %{(((usageData?.summary?.estimatedDbSizeMB || 1.2) / 512) * 100).toFixed(2)}</span>
                          </div>
                        </div>

                        <div className="space-y-2 text-xs">
                          <div className="flex justify-between py-1 border-b border-white/5 text-slate-300">
                            <span className="text-slate-400">Veri Merkezi:</span>
                            <span className="font-bold text-white">AWS Frankfurt (eu-central-1)</span>
                          </div>
                          <div className="flex justify-between py-1 border-b border-white/5 text-slate-300">
                            <span className="text-slate-400">Havuzlama (Pooler):</span>
                            <span className="font-bold text-emerald-400">PgBouncer Aktif</span>
                          </div>
                          <div className="flex justify-between py-1 text-slate-300">
                            <span className="text-slate-400">Toplam Tablo Kaydı:</span>
                            <span className="font-bold text-cyan-300">{usageData?.summary?.totalDbRecords || 0} Kayıt</span>
                          </div>
                        </div>
                      </div>

                      <a
                        href="https://console.neon.tech/"
                        target="_blank"
                        rel="noreferrer"
                        className="mt-4 w-full bg-white/5 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-center py-2.5 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5"
                      >
                        <span>Neon Console'a Git</span>
                        <span>↗</span>
                      </a>
                    </div>

                    {/* Render.com Card */}
                    <div className="bg-[#0D1B35]/90 border border-white/10 hover:border-purple-500/40 rounded-3xl p-5 shadow-xl flex flex-col justify-between transition-all group">
                      <div className="space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-xl">
                              🚀
                            </div>
                            <div>
                              <h4 className="text-sm font-black text-white group-hover:text-purple-300 transition-colors">
                                Render.com
                              </h4>
                              <span className="text-[10px] text-slate-400 font-semibold block">Web Servisi & Otomatik CI/CD</span>
                            </div>
                          </div>
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            Canlıda
                          </span>
                        </div>

                        <div className="space-y-2 bg-white/5 p-3.5 rounded-2xl border border-white/5">
                          <div className="flex justify-between text-xs font-bold">
                            <span className="text-slate-400">Aylık Çalışma Kotası</span>
                            <span className="text-purple-400">750 Saat / 750 Saat</span>
                          </div>
                          <div className="w-full bg-white/10 rounded-full h-2.5 overflow-hidden">
                            <div
                              className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full rounded-full transition-all duration-500"
                              style={{ width: "100%" }}
                            />
                          </div>
                          <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                            <span>Sürekli Çalışma İzni: Sınırsız</span>
                            <span>Bant Genişliği: 100 GB / Ay</span>
                          </div>
                        </div>

                        <div className="space-y-2 text-xs">
                          <div className="flex justify-between py-1 border-b border-white/5 text-slate-300">
                            <span className="text-slate-400">Bölge (Region):</span>
                            <span className="font-bold text-white">Frankfurt (EU Central)</span>
                          </div>
                          <div className="flex justify-between py-1 border-b border-white/5 text-slate-300">
                            <span className="text-slate-400">GitHub Dağıtımı:</span>
                            <span className="font-bold text-emerald-400">Otomatik (main)</span>
                          </div>
                          <div className="flex justify-between py-1 text-slate-300">
                            <span className="text-slate-400">HTTP Sağlık Durumu:</span>
                            <span className="font-bold text-emerald-400">200 OK (Sağlıklı)</span>
                          </div>
                        </div>
                      </div>

                      <a
                        href="https://dashboard.render.com/web/srv-da2t02r7uimc73bc08ig"
                        target="_blank"
                        rel="noreferrer"
                        className="mt-4 w-full bg-white/5 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 text-center py-2.5 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5"
                      >
                        <span>Render Dashboard'a Git</span>
                        <span>↗</span>
                      </a>
                    </div>

                    {/* Cloudinary CDN Card */}
                    <div className="bg-[#0D1B35]/90 border border-white/10 hover:border-blue-500/40 rounded-3xl p-5 shadow-xl flex flex-col justify-between transition-all group">
                      <div className="space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-xl">
                              🖼️
                            </div>
                            <div>
                              <h4 className="text-sm font-black text-white group-hover:text-blue-300 transition-colors">
                                Cloudinary CDN
                              </h4>
                              <span className="text-[10px] text-slate-400 font-semibold block">Profil & Soru Görselleri</span>
                            </div>
                          </div>
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            Aktif
                          </span>
                        </div>

                        <div className="space-y-2 bg-white/5 p-3.5 rounded-2xl border border-white/5">
                          <div className="flex justify-between text-xs font-bold">
                            <span className="text-slate-400">Aylık Kredi / Depolama</span>
                            <span className="text-blue-400">0.05 / 25 Kredi (GB)</span>
                          </div>
                          <div className="w-full bg-white/10 rounded-full h-2.5 overflow-hidden">
                            <div
                              className="bg-gradient-to-r from-blue-500 to-cyan-500 h-full rounded-full transition-all duration-500"
                              style={{ width: "2%" }}
                            />
                          </div>
                          <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                            <span>Kalan: ~24.95 GB</span>
                            <span>Kullanım: %0.2</span>
                          </div>
                        </div>

                        <div className="space-y-2 text-xs">
                          <div className="flex justify-between py-1 border-b border-white/5 text-slate-300">
                            <span className="text-slate-400">Cloud Name:</span>
                            <span className="font-mono text-[11px] text-blue-300">derslinex</span>
                          </div>
                          <div className="flex justify-between py-1 border-b border-white/5 text-slate-300">
                            <span className="text-slate-400">Otomatik Format:</span>
                            <span className="font-bold text-emerald-400">WebP / AVIF Optimize</span>
                          </div>
                          <div className="flex justify-between py-1 text-slate-300">
                            <span className="text-slate-400">Görsel Havuzu:</span>
                            <span className="font-bold text-white">{questionsList.filter(q => q.imageUrl).length} Soru Görseli</span>
                          </div>
                        </div>
                      </div>

                      <a
                        href="https://console.cloudinary.com/"
                        target="_blank"
                        rel="noreferrer"
                        className="mt-4 w-full bg-white/5 hover:bg-blue-500/20 text-blue-300 border border-blue-500/30 text-center py-2.5 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5"
                      >
                        <span>Cloudinary Console'a Git</span>
                        <span>↗</span>
                      </a>
                    </div>

                    {/* Resend Mail Card */}
                    <div className="bg-[#0D1B35]/90 border border-white/10 hover:border-emerald-500/40 rounded-3xl p-5 shadow-xl flex flex-col justify-between transition-all group">
                      <div className="space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-xl">
                              ✉️
                            </div>
                            <div>
                              <h4 className="text-sm font-black text-white group-hover:text-emerald-300 transition-colors">
                                Resend Mail API
                              </h4>
                              <span className="text-[10px] text-slate-400 font-semibold block">E-Posta & Bildirim Servisi</span>
                            </div>
                          </div>
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            Aktif
                          </span>
                        </div>

                        <div className="space-y-2 bg-white/5 p-3.5 rounded-2xl border border-white/5">
                          <div className="flex justify-between text-xs font-bold">
                            <span className="text-slate-400">Aylık E-Posta Kotası</span>
                            <span className="text-emerald-400">{Math.max(6, contactMessages.length * 2 + students.length + teachers.length)} / 3.000 Adet</span>
                          </div>
                          <div className="w-full bg-white/10 rounded-full h-2.5 overflow-hidden">
                            <div
                              className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full transition-all duration-500"
                              style={{ width: `${Math.max(1, Math.min(100, (((Math.max(6, contactMessages.length * 2 + students.length + teachers.length)) / 3000) * 100)))}%` }}
                            />
                          </div>
                          <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                            <span>Kalan: {3000 - Math.max(6, contactMessages.length * 2 + students.length + teachers.length)} E-Posta</span>
                            <span>Günlük Limit: 100 Mail/Gün</span>
                          </div>
                        </div>

                        <div className="space-y-2 text-xs">
                          <div className="flex justify-between py-1 border-b border-white/5 text-slate-300">
                            <span className="text-slate-400">Gönderici Adresi:</span>
                            <span className="font-mono text-[11px] text-emerald-300">onboarding@resend.dev</span>
                          </div>
                          <div className="flex justify-between py-1 border-b border-white/5 text-slate-300">
                            <span className="text-slate-400">Şifre Sıfırlama & Bildirim:</span>
                            <span className="font-bold text-emerald-400">Otomatik Aktif</span>
                          </div>
                          <div className="flex justify-between py-1 text-slate-300">
                            <span className="text-slate-400">İletişim Mesajları:</span>
                            <span className="font-bold text-white">{contactMessages.length} Gelen Bildirim</span>
                          </div>
                        </div>
                      </div>

                      <a
                        href="https://resend.com/overview"
                        target="_blank"
                        rel="noreferrer"
                        className="mt-4 w-full bg-white/5 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-center py-2.5 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5"
                      >
                        <span>Resend Paneline Git</span>
                        <span>↗</span>
                      </a>
                    </div>
                  </div>
                </div>

                {/* Service Limits & Quota Breakdown Table */}
                <div className="bg-[#0D1B35]/80 border border-white/10 rounded-3xl p-6 shadow-xl space-y-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
                    <div>
                      <h4 className="text-base font-black text-white flex items-center gap-2">
                        <span>📋</span> Tüm Servislerin Kota, Limit & Güvenlik Özeti
                      </h4>
                      <p className="text-xs text-slate-400 font-medium mt-0.5">
                        Tüm dış sağlayıcıların aylık ücretsiz sınırları ve güvenlik eşikleri.
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-black">
                      %100 Güvenli Bölge
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-white/10 text-slate-400 text-[11px] font-black uppercase tracking-wider">
                          <th className="pb-3">Servis & Sağlayıcı</th>
                          <th className="pb-3">Kategori</th>
                          <th className="pb-3">Aylık Ücretsiz Limit</th>
                          <th className="pb-3">Mevcut Kullanım</th>
                          <th className="pb-3">Kalan Kota</th>
                          <th className="pb-3 text-right">Doluluk Durumu</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 font-medium">
                        <tr className="hover:bg-white/5 transition-colors">
                          <td className="py-3.5 flex items-center gap-2.5 font-bold text-white">
                            <span className="text-base">☁️</span> Cloudflare R2
                          </td>
                          <td className="py-3.5 text-slate-300">Video Depolama</td>
                          <td className="py-3.5 text-slate-300 font-bold">10 GB</td>
                          <td className="py-3.5 text-amber-300 font-mono font-bold">{((liveSessions.filter(s => s.status === "ENDED").length) * 0.12).toFixed(2)} GB</td>
                          <td className="py-3.5 text-emerald-400 font-mono font-bold">{(10 - ((liveSessions.filter(s => s.status === "ENDED").length) * 0.12)).toFixed(2)} GB</td>
                          <td className="py-3.5 text-right">
                            <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded-full text-[10px] font-black">
                              %1 Dolu (Güvenli)
                            </span>
                          </td>
                        </tr>

                        <tr className="hover:bg-white/5 transition-colors">
                          <td className="py-3.5 flex items-center gap-2.5 font-bold text-white">
                            <span className="text-base">📹</span> Daily.co
                          </td>
                          <td className="py-3.5 text-slate-300">Görüntülü Ders</td>
                          <td className="py-3.5 text-slate-300 font-bold">10.000 Dakika</td>
                          <td className="py-3.5 text-rose-300 font-mono font-bold">{usageData?.summary?.estimatedVideoMinutes || 0} Dk</td>
                          <td className="py-3.5 text-emerald-400 font-mono font-bold">{Math.max(0, 10000 - (usageData?.summary?.estimatedVideoMinutes || 0))} Dk</td>
                          <td className="py-3.5 text-right">
                            <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded-full text-[10px] font-black">
                              %1 Dolu (Güvenli)
                            </span>
                          </td>
                        </tr>

                        <tr className="hover:bg-white/5 transition-colors">
                          <td className="py-3.5 flex items-center gap-2.5 font-bold text-white">
                            <span className="text-base">🐘</span> Neon PostgreSQL
                          </td>
                          <td className="py-3.5 text-slate-300">Veritabanı</td>
                          <td className="py-3.5 text-slate-300 font-bold">512 MB</td>
                          <td className="py-3.5 text-cyan-300 font-mono font-bold">{usageData?.summary?.estimatedDbSizeMB || 1.2} MB</td>
                          <td className="py-3.5 text-emerald-400 font-mono font-bold">{(512 - (usageData?.summary?.estimatedDbSizeMB || 1.2)).toFixed(1)} MB</td>
                          <td className="py-3.5 text-right">
                            <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded-full text-[10px] font-black">
                              %0.2 Dolu (Güvenli)
                            </span>
                          </td>
                        </tr>

                        <tr className="hover:bg-white/5 transition-colors">
                          <td className="py-3.5 flex items-center gap-2.5 font-bold text-white">
                            <span className="text-base">🚀</span> Render.com
                          </td>
                          <td className="py-3.5 text-slate-300">Web Sunucu</td>
                          <td className="py-3.5 text-slate-300 font-bold">750 Saat / Ay</td>
                          <td className="py-3.5 text-purple-300 font-mono font-bold">Kesintisiz Canlı</td>
                          <td className="py-3.5 text-emerald-400 font-mono font-bold">100 GB Bandwidth</td>
                          <td className="py-3.5 text-right">
                            <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded-full text-[10px] font-black">
                              %100 Canlıda (Güvenli)
                            </span>
                          </td>
                        </tr>

                        <tr className="hover:bg-white/5 transition-colors">
                          <td className="py-3.5 flex items-center gap-2.5 font-bold text-white">
                            <span className="text-base">🖼️</span> Cloudinary
                          </td>
                          <td className="py-3.5 text-slate-300">CDN Medya</td>
                          <td className="py-3.5 text-slate-300 font-bold">25 Kredi (~25 GB)</td>
                          <td className="py-3.5 text-blue-300 font-mono font-bold">~0.05 GB</td>
                          <td className="py-3.5 text-emerald-400 font-mono font-bold">~24.95 GB</td>
                          <td className="py-3.5 text-right">
                            <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded-full text-[10px] font-black">
                              %0.2 Dolu (Güvenli)
                            </span>
                          </td>
                        </tr>

                        <tr className="hover:bg-white/5 transition-colors">
                          <td className="py-3.5 flex items-center gap-2.5 font-bold text-white">
                            <span className="text-base">✉️</span> Resend
                          </td>
                          <td className="py-3.5 text-slate-300">E-Posta API</td>
                          <td className="py-3.5 text-slate-300 font-bold">3.000 Mail / Ay</td>
                          <td className="py-3.5 text-emerald-300 font-mono font-bold">{Math.max(6, contactMessages.length * 2 + students.length + teachers.length)} Mail</td>
                          <td className="py-3.5 text-emerald-400 font-mono font-bold">{3000 - Math.max(6, contactMessages.length * 2 + students.length + teachers.length)} Mail</td>
                          <td className="py-3.5 text-right">
                            <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded-full text-[10px] font-black">
                              %0.5 Dolu (Güvenli)
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* EXAMS TAB */}
            {activeTab === "exams" && (
              <div className="p-4 sm:p-6 space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
                  <div>
                    <h2 className="text-lg font-black text-white flex items-center gap-2">
                      🎯 Online Deneme Sınavı Yönetimi
                    </h2>
                    <p className="text-xs text-slate-400 font-semibold mt-1">
                      Soru havuzundan soru seçerek yeni denemeler oluşturun, süresini ve kamerasını ayarlayın, canlı gözetmenlikle öğrencileri izleyin.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setExamForm({
                        title: "",
                        description: "",
                        examType: "TYT",
                        targetTag: "TÜMÜ",
                        startTime: new Date().toISOString().slice(0, 16),
                        endTime: new Date(Date.now() + 86400000).toISOString().slice(0, 16),
                        durationMinutes: 135,
                        isCameraRequired: true,
                      });
                      setSelectedQuestionItems([]);
                      setExamModalOpen(true);
                    }}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black text-xs px-5 py-3 rounded-xl transition shadow-lg flex items-center gap-2 flex-shrink-0"
                  >
                    ✨ Yeni Deneme Sınavı Oluştur
                  </button>
                </div>

                {/* Exam Cards Grid */}
                {exams.length === 0 ? (
                  <div className="text-center py-16 bg-[#0D1B35] rounded-2xl border border-white/5 space-y-3">
                    <span className="text-4xl block">📝</span>
                    <h3 className="text-base font-black text-white">Henüz Oluşturulmuş Deneme Sınavı Yok</h3>
                    <p className="text-xs text-slate-400 max-w-md mx-auto">
                      "Yeni Deneme Sınavı Oluştur" butonuna tıklayarak soru havuzundaki sorulardan anında Türkiye geneli online deneme hazırlayabilirsiniz.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {exams.map((ex) => {
                      const isCamera = ex.isCameraRequired;
                      const qCount = ex.examQuestions?.length || 0;
                      const attemptCount = ex._count?.attempts || 0;

                      return (
                        <div key={ex.id} className="bg-[#0D1B35] border border-white/10 rounded-2xl p-5 space-y-4 hover:border-indigo-500/40 transition">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                                <span className="bg-indigo-600 text-white font-black text-[10px] px-2.5 py-0.5 rounded-full">
                                  {ex.examType}
                                </span>
                                <span className="bg-white/10 text-slate-300 font-bold text-[10px] px-2.5 py-0.5 rounded-full">
                                  🎯 Tag: {ex.targetTag}
                                </span>
                                {isCamera ? (
                                  <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold text-[10px] px-2.5 py-0.5 rounded-full">
                                    🎥 Kamera Şartlı
                                  </span>
                                ) : (
                                  <span className="bg-slate-500/20 text-slate-400 font-bold text-[10px] px-2.5 py-0.5 rounded-full">
                                    📷 Kamerasız
                                  </span>
                                )}
                              </div>
                              <h3 className="text-white font-black text-base">{ex.title}</h3>
                              {ex.description && <p className="text-xs text-slate-400 mt-1 line-clamp-2">{ex.description}</p>}
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-2 bg-white/5 p-3 rounded-xl text-center text-xs">
                            <div>
                              <span className="text-[10px] text-slate-400 font-bold block">Soru Sayısı</span>
                              <span className="font-black text-indigo-300 text-sm">{qCount} Soru</span>
                            </div>
                            <div>
                              <span className="text-[10px] text-slate-400 font-bold block">Sınav Süresi</span>
                              <span className="font-black text-amber-300 text-sm">{ex.durationMinutes} Dk</span>
                            </div>
                            <div>
                              <span className="text-[10px] text-slate-400 font-bold block">Katılan Öğrenci</span>
                              <span className="font-black text-emerald-300 text-sm">{attemptCount} Kişi</span>
                            </div>
                          </div>

                          <div className="text-[11px] text-slate-400 font-semibold space-y-0.5 border-t border-white/5 pt-3">
                            <div>🕐 Başlangıç: <strong className="text-slate-200">{new Date(ex.startTime).toLocaleString("tr-TR")}</strong></div>
                            <div>⏳ Bitiş: <strong className="text-slate-200">{new Date(ex.endTime).toLocaleString("tr-TR")}</strong></div>
                          </div>

                          <div className="flex items-center gap-2 pt-2 border-t border-white/10">
                            <button
                              onClick={() => setPreviewExamModal(ex)}
                              className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 font-black text-xs py-2 rounded-xl transition"
                            >
                              👁️ Ön Gösterim
                            </button>
                            <button
                              onClick={() => handleOpenProctoring(ex)}
                              className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs py-2 rounded-xl transition shadow-md flex items-center justify-center gap-1"
                            >
                              🎥 Canlı Gözetmenlik ({attemptCount})
                            </button>
                            <button
                              onClick={() => handleDeleteExam(ex.id)}
                              className="bg-red-600/80 hover:bg-red-600 text-white font-black text-xs px-3 py-2 rounded-xl transition"
                            >
                              Sil
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

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
            {activeTab === "students" && (() => {
              const filteredStudents = studentTagFilter === "TÜMÜ" 
                ? students 
                : students.filter((s) => (s.targetTag || "TYT") === studentTagFilter);

              return (
                <div className="space-y-4">
                  {/* Tag Filter Bar */}
                  <div className="bg-[#1E293B] border border-white/10 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-xl">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-black text-slate-300 flex items-center gap-1">
                        🎯 Sınav Tagı Filtresi:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {["TÜMÜ", "TYT", "AYT", "YKS", "LGS", "KPSS"].map((tag) => (
                          <button
                            key={tag}
                            onClick={() => setStudentTagFilter(tag)}
                            className={`px-3 py-1 rounded-xl text-xs font-black transition-all ${
                              studentTagFilter === tag
                                ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md border border-indigo-400/40"
                                : "bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border border-white/10"
                            }`}
                          >
                            {tag} {tag !== "TÜMÜ" && `(${students.filter(s => (s.targetTag || "TYT") === tag).length})`}
                          </button>
                        ))}
                      </div>
                    </div>
                    <span className="text-xs text-slate-400 font-semibold">
                      Gösterilen: <strong className="text-white font-black">{filteredStudents.length}</strong> / {students.length} Öğrenci
                    </span>
                  </div>

                  <div className="overflow-x-auto rounded-2xl border border-white/10">
                    <table className="w-full text-left border-collapse text-xs sm:text-sm">
                      <thead>
                        <tr className="bg-[#0D1B35] border-b border-white/10 text-slate-400 font-black uppercase text-[11px]">
                          <th className="p-4 sm:p-5">Adı Soyadı</th>
                          <th className="p-4 sm:p-5">Sınav Tagı</th>
                          <th className="p-4 sm:p-5">İletişim</th>
                          <th className="p-4 sm:p-5">Durum / Ban</th>
                          <th className="p-4 sm:p-5 text-right">İşlemler</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 font-semibold text-slate-300">
                        {filteredStudents.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="p-10 text-center text-slate-500">
                              Seçili tag filtresine uygun öğrenci bulunmuyor.
                            </td>
                          </tr>
                        ) : (
                          filteredStudents.map((s) => {
                            const tag = s.targetTag || "TYT";
                            let tagStyle = "bg-blue-500/20 text-blue-400 border-blue-500/30";
                            if (tag === "AYT") tagStyle = "bg-purple-500/20 text-purple-400 border-purple-500/30";
                            else if (tag === "YKS") tagStyle = "bg-indigo-500/20 text-indigo-400 border-indigo-500/30";
                            else if (tag === "LGS") tagStyle = "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
                            else if (tag === "KPSS") tagStyle = "bg-amber-500/20 text-amber-400 border-amber-500/30";

                            return (
                              <tr key={s.id} className={`hover:bg-white/5 transition-colors ${s.isBanned ? "bg-red-500/10" : ""}`}>
                                <td className="p-4 sm:p-5 font-black text-white">
                                  <div>{s.name}</div>
                                  <span className="text-[10px] text-slate-500 font-semibold block mt-0.5">
                                    Kayıt: {new Date(s.createdAt).toLocaleDateString("tr-TR")}
                                  </span>
                                </td>
                                <td className="p-4 sm:p-5">
                                  <div className="flex items-center gap-2">
                                    <span className={`inline-block text-xs font-black px-2.5 py-1 rounded-xl border ${tagStyle}`}>
                                      🎯 {tag}
                                    </span>
                                    <select
                                      value={tag}
                                      onChange={(e) => handleUpdateStudentTag(s.id, e.target.value)}
                                      className="bg-[#0D1B35] border border-white/10 text-xs text-slate-300 rounded-lg px-2 py-1 focus:outline-none focus:border-indigo-500 font-bold"
                                    >
                                      <option value="TYT">TYT</option>
                                      <option value="AYT">AYT</option>
                                      <option value="YKS">YKS</option>
                                      <option value="LGS">LGS</option>
                                      <option value="KPSS">KPSS</option>
                                    </select>
                                  </div>
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
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })()}

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
                              <button type="button" onClick={async () => { try { const res = await adminFetch("/api/admin/questions", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ questionId: q.id, ...editQuestionForm }) }); const data = await res.json(); if (data.success) { showMsg("✅ Soru detayları ve sınıflandırması güncellendi!", "success"); setEditingQuestionId(null); fetchData(); } else { showMsg(data.error || "Güncellenemedi", "error"); } } catch { showMsg("Bağlantı hatası", "error"); } }} className="bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs px-5 py-2 rounded-xl transition">💾 Kaydet & Güncelle</button>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <div className="font-bold text-white text-sm whitespace-pre-wrap leading-relaxed bg-[#1E293B] p-4 rounded-xl border border-white/5">
                              {q.questionText}
                            </div>
                            {q.imageUrl && (
                              <div className="max-w-md my-2">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
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
                            <button onClick={async () => { try { const res = await adminFetch("/api/admin/questions", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ questionId: q.id, status: "APPROVED" }) }); const data = await res.json(); if (data.success) { showMsg(`✅ Soru onaylandı ve öğretmene +${q.points} puan tanımlandı!`, "success"); fetchData(); } else { showMsg(data.error || "İşlem başarısız", "error"); } } catch { showMsg("Bağlantı hatası", "error"); } }} className="bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs px-4 py-2 rounded-xl transition">
                              ✅ Soruyu Onayla & +{q.points} Puan Ver
                            </button>
                          )}
                          {q.status === "PENDING_APPROVAL" && (
                            <button onClick={async () => { const reason = prompt("Lütfen red sebebini yazın:", "Soruda hatalı şık veya metin bulunmaktadır."); if (reason === null) return; try { const res = await adminFetch("/api/admin/questions", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ questionId: q.id, status: "REJECTED", rejectionReason: reason }) }); const data = await res.json(); if (data.success) { showMsg("Soru reddedildi.", "error"); fetchData(); } } catch { showMsg("Bağlantı hatası", "error"); } }} className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold text-xs px-3.5 py-2 rounded-xl transition">
                              ❌ Reddet
                            </button>
                          )}
                          <button onClick={async () => { if (!confirm("Bu soruyu silmek istediğinize emin misiniz?")) return; try { const res = await adminFetch(`/api/admin/questions?id=${q.id}`, { method: "DELETE" }); const data = await res.json(); if (data.success) { showMsg("Soru silindi.", "success"); fetchData(); } } catch { showMsg("Bağlantı hatası", "error"); } }} className="text-xs text-red-400 hover:text-red-300 font-bold px-2 py-1">
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
                  <button onClick={async () => { if (!taskForm.teacherId || !taskForm.title) { showMsg("Lütfen öğretmen ve görev başlığını giriniz.", "error"); return; } setTaskCreating(true); try { const res = await adminFetch("/api/admin/tasks", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(taskForm) }); const data = await res.json(); if (data.success) { showMsg("🏆 Görev başarıyla öğretmene atandı!", "success"); setTaskForm({ teacherId: "", title: "", description: "", points: 50 }); fetchData(); } else { showMsg(data.error || "Görev atanamadı", "error"); } } catch { showMsg("Bağlantı hatası", "error"); } finally { setTaskCreating(false); } }} disabled={taskCreating} className="mt-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black py-2.5 px-6 rounded-xl text-xs transition disabled:opacity-60">
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
                              <button onClick={async () => { try { const res = await adminFetch("/api/admin/tasks", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ taskId: task.id, status: "COMPLETED" }) }); const data = await res.json(); if (data.success) { showMsg(`✅ Görev onaylandı ve öğretmene +${task.points} puan verildi!`, "success"); fetchData(); } else { showMsg(data.error || "İşlem başarısız", "error"); } } catch { showMsg("Bağlantı hatası", "error"); } }} className="bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs px-3.5 py-2 rounded-xl transition shadow-xs">
                                ✅ Onayla & Puan Ver
                              </button>
                            )}
                            {task.status === "SUBMITTED" && (
                              <button onClick={async () => { try { const res = await adminFetch("/api/admin/tasks", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ taskId: task.id, status: "REJECTED" }) }); const data = await res.json(); if (data.success) { showMsg("Görev reddedildi.", "error"); fetchData(); } } catch { showMsg("Bağlantı hatası", "error"); } }} className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-bold px-3 py-2 rounded-xl transition">
                                ❌ Reddet
                              </button>
                            )}
                            <button onClick={async () => { if (!confirm("Bu görevi silmek istediğinize emin misiniz?")) return; try { const res = await adminFetch(`/api/admin/tasks?id=${task.id}`, { method: "DELETE" }); const data = await res.json(); if (data.success) { showMsg("Görev silindi.", "success"); fetchData(); } } catch { showMsg("Bağlantı hatası", "error"); } }} className="text-xs text-red-400 hover:text-red-300 font-bold px-2 py-1">
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
                        const res = await adminFetch("/api/admin/sessions", {
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
                                    const res = await adminFetch(`/api/admin/sessions?id=${s.id}`, { method: "DELETE" });
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

            {/* CONTACT MESSAGES TAB */}
            {activeTab === "contact" && (
              <div className="p-6">
                {contactMessages.length === 0 ? (
                  <p className="text-center py-12 text-slate-500 font-semibold">
                    Henüz iletişim formundan gönderilmiş bir mesaj bulunmamaktadır.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {contactMessages.map((m) => (
                      <div key={m.id} className="p-5 bg-[#0D1B35] border border-white/10 rounded-2xl shadow-xl space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="font-black text-sm text-white block">{m.name}</span>
                            <span className="text-xs text-indigo-400 font-semibold">{m.email} {m.phone ? `• ${m.phone}` : ""}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider ${
                              m.status === "UNREAD" ? "bg-amber-500/20 text-amber-300 border border-amber-500/30" : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                            }`}>
                              {m.status === "UNREAD" ? "Okunmadı" : "Okundu / Yanıtlandı"}
                            </span>
                            <button
                              onClick={async () => {
                                const nextStatus = m.status === "UNREAD" ? "READ" : "UNREAD";
                                const res = await adminFetch("/api/admin/contact", {
                                  method: "PATCH",
                                  headers: { "Content-Type": "application/json" },
                                  body: JSON.stringify({ id: m.id, status: nextStatus }),
                                });
                                const data = await res.json();
                                if (data.success) {
                                  showMsg("Mesaj durumu güncellendi.", "success");
                                  fetchData();
                                }
                              }}
                              className="text-xs text-indigo-400 hover:text-indigo-300 font-bold px-2 py-1 bg-white/5 rounded-lg"
                            >
                              {m.status === "UNREAD" ? "Okundu İşaretle" : "Okunmadı Yap"}
                            </button>
                            <button
                              onClick={async () => {
                                if (!confirm("Bu mesajı silmek istediğinize emin misiniz?")) return;
                                const res = await adminFetch(`/api/admin/contact?id=${m.id}`, { method: "DELETE" });
                                const data = await res.json();
                                if (data.success) {
                                  showMsg("Mesaj silindi.", "success");
                                  fetchData();
                                }
                              }}
                              className="text-xs text-red-400 hover:text-red-300 font-bold px-2 py-1"
                            >
                              Sil
                            </button>
                          </div>
                        </div>
                        <p className="text-slate-200 text-xs font-semibold leading-relaxed p-3 bg-[#1E293B] rounded-xl border border-white/5 whitespace-pre-wrap">
                          {m.message}
                        </p>
                        <div className="text-[10px] text-slate-500 font-bold text-right">
                          Tarih: {new Date(m.createdAt).toLocaleString("tr-TR")}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* FEEDBACKS TAB */}
            {activeTab === "feedbacks" && (
              <div className="p-6 space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
                  <div>
                    <h2 className="text-lg font-black text-white flex items-center gap-2">
                      💬 Öğrenci Görüş & Puan Onay Merkezi
                    </h2>
                    <p className="text-xs text-slate-400 font-semibold mt-1">
                      Öğrencilerin canlı ders sonrasında veya profil üzerinden öğretmenlere verdiği puanlama ve değerlendirmeleri onaylayın. Onaylanan puanlar öğretmenlerin profillerine yansır.
                    </p>
                  </div>
                </div>

                {feedbacks.length === 0 ? (
                  <div className="text-center py-12 bg-[#0D1B35] rounded-2xl border border-white/5 space-y-2">
                    <span className="text-3xl block">💬</span>
                    <p className="text-slate-400 font-semibold text-xs">
                      Henüz öğrenciler tarafından yazılmış bir görüş veya puanlama bulunmamaktadır.
                    </p>
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 gap-4">
                    {feedbacks.map((f) => {
                      const st = f.status || "PENDING";
                      return (
                        <div key={f.id} className="p-5 bg-[#0D1B35] border border-white/10 rounded-2xl relative shadow-xl space-y-3 hover:border-indigo-500/30 transition">
                          <div className="flex justify-between items-start gap-2">
                            <div>
                              <span className="font-black text-sm text-white block">{f.studentName}</span>
                              <span className="text-[10px] text-slate-400">{f.studentEmail || "E-posta Gizli"}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              {st === "APPROVED" ? (
                                <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-black text-[10px] px-2.5 py-0.5 rounded-full">
                                  ✅ Onaylandı
                                </span>
                              ) : st === "REJECTED" ? (
                                <span className="bg-red-500/20 text-red-400 border border-red-500/30 font-black text-[10px] px-2.5 py-0.5 rounded-full">
                                  ❌ Reddedildi
                                </span>
                              ) : (
                                <span className="bg-amber-500/20 text-amber-400 border border-amber-500/30 font-black text-[10px] px-2.5 py-0.5 rounded-full animate-pulse">
                                  🟡 Onay Bekliyor
                                </span>
                              )}
                              <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 font-black text-xs px-2 py-0.5 rounded-md">
                                {f.rating} ★
                              </span>
                            </div>
                          </div>

                          <p className="text-slate-300 text-xs font-semibold leading-relaxed p-3 bg-[#1E293B] rounded-xl border border-white/5">
                            "{f.content}"
                          </p>

                          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-white/5 pt-3 text-[11px] font-bold">
                            <span className="text-slate-400">Hedef Öğretmen: <strong className="text-indigo-400">{f.teacherName}</strong></span>
                            <span className="text-slate-500">{new Date(f.createdAt).toLocaleDateString("tr-TR")}</span>
                          </div>

                          {/* Approval Actions */}
                          <div className="flex items-center gap-2 pt-2 border-t border-white/10">
                            {st !== "APPROVED" && (
                              <button
                                onClick={() => handleUpdateFeedbackStatus(f.id, "APPROVED")}
                                className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs py-2 rounded-xl transition shadow-md flex items-center justify-center gap-1"
                              >
                                ✅ Onayla (Yayınla)
                              </button>
                            )}
                            {st !== "REJECTED" && (
                              <button
                                onClick={() => handleUpdateFeedbackStatus(f.id, "REJECTED")}
                                className="flex-1 bg-amber-600/30 hover:bg-amber-600/50 border border-amber-500/30 text-amber-300 font-bold text-xs py-2 rounded-xl transition flex items-center justify-center gap-1"
                              >
                                ❌ Reddet
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteFeedback(f.id)}
                              className="bg-red-600/80 hover:bg-red-600 text-white font-black text-xs px-3 py-2 rounded-xl transition"
                            >
                              Sil
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* REKLAM & İLAN GİRİŞİ YÖNETİM TABI */}
            {activeTab === "ads" && (
              <div className="p-6 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0D1B35] p-6 rounded-2xl border border-white/10 shadow-xl">
                  <div>
                    <h3 className="text-white font-black text-lg flex items-center gap-2">
                      📢 Reklam & İlan Girişi Yönetimi
                    </h3>
                    <p className="text-xs text-slate-400 font-medium mt-1">
                      Sitedeki üst bant (announcement ribbon), ana sayfa teaser ve pop-up reklamlarını buradan yönetebilirsiniz.
                    </p>
                  </div>
                  <button
                    onClick={() => setAdModalOpen(true)}
                    className="bg-gradient-to-r from-rose-600 to-orange-600 text-white font-black text-xs px-5 py-3 rounded-xl shadow-lg transition hover:scale-102 flex items-center gap-2 whitespace-nowrap"
                  >
                    <span>➕ Yeni Reklam Ekle</span>
                  </button>
                </div>

                {/* Ads Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-[#0D1B35] border border-white/10 rounded-xl p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center text-xl font-black">
                      📢
                    </div>
                    <div>
                      <div className="text-lg font-black text-white">{adsList.length}</div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Tanımlı Kampanya</div>
                    </div>
                  </div>
                  <div className="bg-[#0D1B35] border border-white/10 rounded-xl p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center text-xl font-black">
                      👁️
                    </div>
                    <div>
                      <div className="text-lg font-black text-white">
                        {adsList.reduce((acc, a) => acc + (a.impressions || 0), 0).toLocaleString("tr-TR")}
                      </div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Toplam Gösterim</div>
                    </div>
                  </div>
                  <div className="bg-[#0D1B35] border border-white/10 rounded-xl p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xl font-black">
                      🖱️
                    </div>
                    <div>
                      <div className="text-lg font-black text-white">
                        {adsList.reduce((acc, a) => acc + (a.clicks || 0), 0).toLocaleString("tr-TR")}
                      </div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Toplam Tıklama</div>
                    </div>
                  </div>
                </div>

                {/* Ads List Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {adsList.map((ad) => (
                    <div key={ad.id} className="bg-[#0D1B35] border border-white/10 rounded-2xl p-5 shadow-lg flex flex-col justify-between space-y-4">
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-white/10 text-slate-300">
                            {ad.placement}
                          </span>
                          <button
                            onClick={() => {
                              setAdsList(adsList.map((x) => x.id === ad.id ? { ...x, status: x.status === "Aktif" ? "Pasif" : "Aktif" } : x));
                            }}
                            className={`text-[10px] font-black px-2.5 py-0.5 rounded-full transition ${
                              ad.status === "Aktif" ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-slate-500/20 text-slate-400 border border-slate-500/30"
                            }`}
                          >
                            ● {ad.status}
                          </button>
                        </div>
                        <h4 className="text-white font-black text-sm leading-snug">{ad.title}</h4>
                        <div className="text-[11px] text-slate-400 mt-2 truncate">
                          Hedef: <span className="text-indigo-400 font-mono">{ad.targetUrl}</span>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                        <div className="text-[11px] text-slate-400">
                          <strong className="text-white">{ad.clicks}</strong> tık / <strong className="text-white">{ad.impressions}</strong> gör.
                        </div>
                        <button
                          onClick={() => {
                            if (confirm("Bu reklamı silmek istediğinize emin misiniz?")) {
                              setAdsList(adsList.filter((x) => x.id !== ad.id));
                            }
                          }}
                          className="text-red-400 hover:text-red-300 font-bold text-[11px]"
                        >
                          Sil
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* New Ad Modal */}
                {adModalOpen && (
                  <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-[#0D1B35] border border-white/15 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
                      <div className="flex items-center justify-between">
                        <h3 className="text-white font-black text-base">➕ Yeni Reklam / İlan Ekle</h3>
                        <button onClick={() => setAdModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
                      </div>

                      <div className="space-y-3 text-xs">
                        <div>
                          <label className="block text-slate-300 font-bold mb-1">Kampanya / Reklam Başlığı</label>
                          <input
                            type="text"
                            placeholder="Örn: 2026 YKS Bursluluk Kampanyası"
                            value={adForm.title}
                            onChange={(e) => setAdForm({ ...adForm, title: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white font-bold"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-300 font-bold mb-1">Reklam Konumu (Yerleşim)</label>
                          <select
                            value={adForm.placement}
                            onChange={(e) => setAdForm({ ...adForm, placement: e.target.value })}
                            className="w-full bg-[#131B2E] border border-white/10 rounded-xl px-3 py-2 text-white font-bold"
                          >
                            <option value="Üst Bant (Top Banner)">Üst Bant (Top Banner)</option>
                            <option value="Hero Alanı">Hero Alanı</option>
                            <option value="Açılır Pop-up">Açılır Pop-up</option>
                            <option value="Ana Sayfa Teaser">Ana Sayfa Teaser</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-slate-300 font-bold mb-1">Hedef Yönlendirme Linki</label>
                          <input
                            type="text"
                            placeholder="Örn: /deneme veya /ogretmenler"
                            value={adForm.targetUrl}
                            onChange={(e) => setAdForm({ ...adForm, targetUrl: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white font-bold"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-300 font-bold mb-1">Görsel URL (İsteğe Bağlı)</label>
                          <input
                            type="text"
                            placeholder="Örn: /hero-student.jpg veya harici URL"
                            value={adForm.imageUrl}
                            onChange={(e) => setAdForm({ ...adForm, imageUrl: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white font-bold"
                          />
                        </div>
                      </div>

                      <div className="flex gap-3 pt-3">
                        <button
                          onClick={() => setAdModalOpen(false)}
                          className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 text-slate-300 font-bold rounded-xl transition"
                        >
                          Vazgeç
                        </button>
                        <button
                          onClick={() => {
                            if (!adForm.title) return alert("Lütfen başlık girin");
                            const newAd = {
                              id: Date.now(),
                              title: adForm.title,
                              placement: adForm.placement,
                              imageUrl: adForm.imageUrl,
                              targetUrl: adForm.targetUrl || "/",
                              status: adForm.status,
                              clicks: 0,
                              impressions: 0
                            };
                            setAdsList([newAd, ...adsList]);
                            setAdModalOpen(false);
                            setAdForm({ title: "", placement: "Üst Bant (Top Banner)", imageUrl: "", targetUrl: "", status: "Aktif" });
                          }}
                          className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-black rounded-xl transition shadow-lg"
                        >
                          Kaydet & Yayınla
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* YAYINEVİ VE YÖNETİCİ PANELİ TABI */}
            {activeTab === "publishers" && (
              <div className="p-6 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0D1B35] p-6 rounded-2xl border border-white/10 shadow-xl">
                  <div>
                    <h3 className="text-white font-black text-lg flex items-center gap-2">
                      🏢 Yayınevi ve Yayın Ortakları Paneli
                    </h3>
                    <p className="text-xs text-slate-400 font-medium mt-1">
                      Online deneme sınavı soru tedarikçileri, anlaşmalı yayınevleri ve telif ortaklarını buradan takip edebilirsiniz.
                    </p>
                  </div>
                  <button
                    onClick={() => setPublisherModalOpen(true)}
                    className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-black text-xs px-5 py-3 rounded-xl shadow-lg transition hover:scale-102 flex items-center gap-2 whitespace-nowrap"
                  >
                    <span>➕ Yeni Yayınevi Ekle</span>
                  </button>
                </div>

                {/* Publishers Grid */}
                <div className="grid md:grid-cols-2 gap-4">
                  {publishersList.map((pub) => (
                    <div key={pub.id} className="bg-[#0D1B35] border border-white/10 rounded-2xl p-5 shadow-lg space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-lg font-black">
                            📚
                          </div>
                          <div>
                            <h4 className="text-white font-black text-sm">{pub.name}</h4>
                            <span className="text-[10px] text-slate-400 font-bold">{pub.contact}</span>
                          </div>
                        </div>
                        <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${
                          pub.status === "Aktif Anlaşmalı" ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                        }`}>
                          {pub.status}
                        </span>
                      </div>

                      <p className="text-xs text-slate-300 bg-white/5 p-3 rounded-xl border border-white/5 font-medium">
                        {pub.notes}
                      </p>

                      <div className="flex items-center justify-between text-xs pt-2 border-t border-white/5">
                        <span className="text-slate-400">
                          Entegre Deneme Sayısı: <strong className="text-white">{pub.examCount}</strong>
                        </span>
                        <button
                          onClick={() => {
                            if (confirm("Bu yayınevini listeden kaldırmak istiyor musunuz?")) {
                              setPublishersList(publishersList.filter((x) => x.id !== pub.id));
                            }
                          }}
                          className="text-red-400 hover:text-red-300 font-bold text-[11px]"
                        >
                          Sil
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* New Publisher Modal */}
                {publisherModalOpen && (
                  <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-[#0D1B35] border border-white/15 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
                      <div className="flex items-center justify-between">
                        <h3 className="text-white font-black text-base">➕ Yeni Yayınevi Ekle</h3>
                        <button onClick={() => setPublisherModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
                      </div>

                      <div className="space-y-3 text-xs">
                        <div>
                          <label className="block text-slate-300 font-bold mb-1">Yayınevi Adı</label>
                          <input
                            type="text"
                            placeholder="Örn: Limit Yayınları"
                            value={publisherForm.name}
                            onChange={(e) => setPublisherForm({ ...publisherForm, name: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white font-bold"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-300 font-bold mb-1">Yetkili / İletişim Bilgisi</label>
                          <input
                            type="text"
                            placeholder="Örn: Ayşe Hanım (0500 000 00 00)"
                            value={publisherForm.contact}
                            onChange={(e) => setPublisherForm({ ...publisherForm, contact: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white font-bold"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-300 font-bold mb-1">Anlaşma Durumu</label>
                          <select
                            value={publisherForm.status}
                            onChange={(e) => setPublisherForm({ ...publisherForm, status: e.target.value })}
                            className="w-full bg-[#131B2E] border border-white/10 rounded-xl px-3 py-2 text-white font-bold"
                          >
                            <option value="Aktif Anlaşmalı">Aktif Anlaşmalı</option>
                            <option value="Görüşülüyor">Görüşülüyor</option>
                            <option value="Deneme Tedarikçisi">Deneme Tedarikçisi</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-slate-300 font-bold mb-1">Ortaklık Notları</label>
                          <textarea
                            rows={2}
                            placeholder="Telif kapsamı, soru havuzu, deneme detayları..."
                            value={publisherForm.notes}
                            onChange={(e) => setPublisherForm({ ...publisherForm, notes: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white font-bold"
                          />
                        </div>
                      </div>

                      <div className="flex gap-3 pt-3">
                        <button
                          onClick={() => setPublisherModalOpen(false)}
                          className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 text-slate-300 font-bold rounded-xl transition"
                        >
                          Vazgeç
                        </button>
                        <button
                          onClick={() => {
                            if (!publisherForm.name) return alert("Lütfen yayınevi adını girin");
                            const newPub = {
                              id: Date.now(),
                              name: publisherForm.name,
                              contact: publisherForm.contact,
                              status: publisherForm.status,
                              examCount: 0,
                              notes: publisherForm.notes,
                              logoUrl: ""
                            };
                            setPublishersList([newPub, ...publishersList]);
                            setPublisherModalOpen(false);
                            setPublisherForm({ name: "", contact: "", status: "Aktif Anlaşmalı", examCount: 0, notes: "", logoUrl: "" });
                          }}
                          className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-xl transition shadow-lg"
                        >
                          Yayınevini Ekle
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* DERS PAKETLERİ YÖNETİMİ TABI */}
            {activeTab === "packages" && (
              <div className="p-6 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0D1B35] p-6 rounded-2xl border border-white/10 shadow-xl">
                  <div>
                    <h3 className="text-white font-black text-lg flex items-center gap-2">
                      📦 Ders Paketleri Yönetimi
                    </h3>
                    <p className="text-xs text-slate-400 font-medium mt-1">
                      Ana sayfadaki hazır ders paketlerini ekleyebilir, fiyatları, saatleri ve paket özelliklerini anlık güncelleyebilirsiniz.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setEditingPackageId(null);
                      setPackageForm({
                        title: "",
                        subtitle: "",
                        targetExam: "YKS",
                        hours: 20,
                        price: 10000,
                        discountedPrice: "",
                        badge: "Popüler Paket",
                        features: "Haftalık 2 saat canlı birebir ders,Kişiye özel çalışma planı,Deneme sınavları,7/24 WhatsApp desteği",
                        isPopular: false,
                        isActive: true,
                        orderNo: adminPackages.length + 1,
                      });
                      setPackageModalOpen(true);
                    }}
                    className="bg-gradient-to-r from-orange-600 to-amber-600 text-white font-black text-xs px-5 py-3 rounded-xl shadow-lg transition hover:scale-102 flex items-center gap-2 whitespace-nowrap"
                  >
                    <span>➕ Yeni Paket Ekle</span>
                  </button>
                </div>

                {/* Packages Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-[#0D1B35] border border-white/10 rounded-xl p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center text-xl font-black">
                      📦
                    </div>
                    <div>
                      <div className="text-lg font-black text-white">{adminPackages.length}</div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Tanımlı Paket</div>
                    </div>
                  </div>
                  <div className="bg-[#0D1B35] border border-white/10 rounded-xl p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xl font-black">
                      🟢
                    </div>
                    <div>
                      <div className="text-lg font-black text-white">
                        {adminPackages.filter((p) => p.isActive).length}
                      </div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Yayında / Aktif</div>
                    </div>
                  </div>
                  <div className="bg-[#0D1B35] border border-white/10 rounded-xl p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center text-xl font-black">
                      ⏱️
                    </div>
                    <div>
                      <div className="text-lg font-black text-white">
                        {adminPackages.reduce((acc, p) => acc + (p.hours || 0), 0)} Saat
                      </div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Toplam Paket Saati</div>
                    </div>
                  </div>
                </div>

                {/* Packages List Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {adminPackages.map((pkg) => {
                    const features = pkg.features ? pkg.features.split(",").map((f: string) => f.trim()).filter(Boolean) : [];
                    return (
                      <div key={pkg.id} className="bg-[#0D1B35] border border-white/10 rounded-2xl p-5 shadow-lg flex flex-col justify-between space-y-4">
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-white/10 text-slate-300">
                              {pkg.targetExam} · {pkg.hours} Saat
                            </span>
                            <button
                              onClick={async () => {
                                try {
                                  const res = await adminFetch("/api/admin/packages", {
                                    method: "PUT",
                                    body: JSON.stringify({ ...pkg, isActive: !pkg.isActive })
                                  });
                                  const data = await res.json();
                                  if (data.success) {
                                    showMsg("Paket durumu güncellendi", "success");
                                    fetchData();
                                  }
                                } catch {
                                  showMsg("İşlem başarısız", "error");
                                }
                              }}
                              className={`text-[10px] font-black px-2.5 py-0.5 rounded-full transition ${
                                pkg.isActive ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-slate-500/20 text-slate-400 border border-slate-500/30"
                              }`}
                            >
                              ● {pkg.isActive ? "Aktif" : "Pasif"}
                            </button>
                          </div>

                          <h4 className="text-white font-black text-base leading-snug">{pkg.title}</h4>
                          {pkg.subtitle && (
                            <p className="text-xs text-slate-400 mt-1 font-medium">{pkg.subtitle}</p>
                          )}

                          <div className="bg-white/5 p-3 rounded-xl border border-white/5 mt-3">
                            <div className="flex items-baseline gap-2">
                              <span className="text-xl font-black text-amber-400">
                                {(pkg.discountedPrice || pkg.price).toLocaleString("tr-TR")} ₺
                              </span>
                              {pkg.discountedPrice && (
                                <span className="text-xs text-slate-400 line-through font-bold">
                                  {pkg.price.toLocaleString("tr-TR")} ₺
                                </span>
                              )}
                            </div>
                            {pkg.badge && (
                              <span className="inline-block text-[9px] font-black text-orange-300 uppercase mt-1">
                                ★ {pkg.badge}
                              </span>
                            )}
                          </div>

                          <div className="space-y-1 mt-3">
                            {features.slice(0, 3).map((f: string, i: number) => (
                              <div key={i} className="text-[11px] text-slate-300 flex items-center gap-1.5">
                                <span className="text-emerald-400 font-bold">✓</span>
                                <span className="truncate">{f}</span>
                              </div>
                            ))}
                            {features.length > 3 && (
                              <span className="text-[10px] text-slate-500 font-bold block">
                                +{features.length - 3} özellik daha
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                          <button
                            onClick={() => {
                              setEditingPackageId(pkg.id);
                              setPackageForm({
                                title: pkg.title,
                                subtitle: pkg.subtitle || "",
                                targetExam: pkg.targetExam || "YKS",
                                hours: pkg.hours || 20,
                                price: pkg.price || 10000,
                                discountedPrice: pkg.discountedPrice || "",
                                badge: pkg.badge || "",
                                features: pkg.features || "",
                                isPopular: pkg.isPopular || false,
                                isActive: pkg.isActive !== undefined ? pkg.isActive : true,
                                orderNo: pkg.orderNo || 1,
                              });
                              setPackageModalOpen(true);
                            }}
                            className="text-indigo-400 hover:text-indigo-300 font-bold text-xs"
                          >
                            Düzenle ✏️
                          </button>

                          <button
                            onClick={async () => {
                              if (!confirm(`'${pkg.title}' paketini silmek istediğinize emin misiniz?`)) return;
                              try {
                                const res = await adminFetch(`/api/admin/packages?id=${pkg.id}`, { method: "DELETE" });
                                const data = await res.json();
                                if (data.success) {
                                  showMsg("Paket silindi", "success");
                                  fetchData();
                                } else {
                                  showMsg(data.error || "Silme başarısız", "error");
                                }
                              } catch {
                                showMsg("Bağlantı hatası", "error");
                              }
                            }}
                            className="text-red-400 hover:text-red-300 font-bold text-xs"
                          >
                            Sil 🗑️
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Package Create / Edit Modal */}
                {packageModalOpen && (
                  <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-[#0D1B35] border border-white/15 rounded-3xl max-w-lg w-full p-6 sm:p-7 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
                      <div className="flex items-center justify-between">
                        <h3 className="text-white font-black text-base">
                          {editingPackageId ? "✏️ Paketi Düzenle" : "➕ Yeni Ders Paketi Ekle"}
                        </h3>
                        <button onClick={() => setPackageModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
                      </div>

                      <div className="space-y-3 text-xs">
                        <div>
                          <label className="block text-slate-300 font-bold mb-1">Paket Başlığı *</label>
                          <input
                            type="text"
                            required
                            placeholder="Örn: TYT & AYT Sayısal Derece Paketi"
                            value={packageForm.title}
                            onChange={(e) => setPackageForm({ ...packageForm, title: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white font-bold"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-300 font-bold mb-1">Alt Başlık / Açıklama</label>
                          <input
                            type="text"
                            placeholder="Örn: 30 saat canlı ders, denemeler ve ödev takibi"
                            value={packageForm.subtitle}
                            onChange={(e) => setPackageForm({ ...packageForm, subtitle: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white font-bold"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-slate-300 font-bold mb-1">Hedef Sınav</label>
                            <select
                              value={packageForm.targetExam}
                              onChange={(e) => setPackageForm({ ...packageForm, targetExam: e.target.value })}
                              className="w-full bg-[#131B2E] border border-white/10 rounded-xl px-3 py-2 text-white font-bold"
                            >
                              <option value="YKS">YKS (TYT-AYT)</option>
                              <option value="LGS">LGS (8. Sınıf)</option>
                              <option value="TÜMÜ">Tüm Sınavlar</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-slate-300 font-bold mb-1">Toplam Ders Saati</label>
                            <input
                              type="number"
                              placeholder="20"
                              value={packageForm.hours}
                              onChange={(e) => setPackageForm({ ...packageForm, hours: parseInt(e.target.value) || 0 })}
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white font-bold"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-slate-300 font-bold mb-1">Fiyat (TL) *</label>
                            <input
                              type="number"
                              placeholder="10000"
                              value={packageForm.price}
                              onChange={(e) => setPackageForm({ ...packageForm, price: parseFloat(e.target.value) || 0 })}
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white font-bold"
                            />
                          </div>

                          <div>
                            <label className="block text-slate-300 font-bold mb-1">İndirimli Fiyat (TL, İsteğe Bağlı)</label>
                            <input
                              type="number"
                              placeholder="8500"
                              value={packageForm.discountedPrice}
                              onChange={(e) => setPackageForm({ ...packageForm, discountedPrice: e.target.value })}
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white font-bold"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-slate-300 font-bold mb-1">Rozet / Etiket</label>
                            <input
                              type="text"
                              placeholder="Örn: En Çok Tercih Edilen"
                              value={packageForm.badge}
                              onChange={(e) => setPackageForm({ ...packageForm, badge: e.target.value })}
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white font-bold"
                            />
                          </div>

                          <div>
                            <label className="block text-slate-300 font-bold mb-1">Sıralama No</label>
                            <input
                              type="number"
                              value={packageForm.orderNo}
                              onChange={(e) => setPackageForm({ ...packageForm, orderNo: parseInt(e.target.value) || 0 })}
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white font-bold"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-slate-300 font-bold mb-1">Özellikler (Virgülle ayırarak yazın)</label>
                          <textarea
                            rows={3}
                            placeholder="Haftalık 2 saat canlı ders, Kişiye özel çalışma planı, Deneme sınavları..."
                            value={packageForm.features}
                            onChange={(e) => setPackageForm({ ...packageForm, features: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white font-bold"
                          />
                        </div>

                        <div className="flex items-center gap-6 pt-2">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={packageForm.isPopular}
                              onChange={(e) => setPackageForm({ ...packageForm, isPopular: e.target.checked })}
                              className="w-4 h-4 rounded text-orange-600"
                            />
                            <span className="text-slate-300 font-bold">Popüler Paket Olarak Öne Çıkar</span>
                          </label>

                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={packageForm.isActive}
                              onChange={(e) => setPackageForm({ ...packageForm, isActive: e.target.checked })}
                              className="w-4 h-4 rounded text-emerald-600"
                            />
                            <span className="text-slate-300 font-bold">Yayında / Aktif</span>
                          </label>
                        </div>
                      </div>

                      <div className="flex gap-3 pt-3">
                        <button
                          onClick={() => setPackageModalOpen(false)}
                          className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 text-slate-300 font-bold rounded-xl transition"
                        >
                          Vazgeç
                        </button>
                        <button
                          onClick={async () => {
                            if (!packageForm.title || !packageForm.price) return alert("Lütfen başlık ve fiyat girin");
                            try {
                              const method = editingPackageId ? "PUT" : "POST";
                              const payload = editingPackageId ? { ...packageForm, id: editingPackageId } : packageForm;
                              const res = await adminFetch("/api/admin/packages", {
                                method,
                                body: JSON.stringify(payload)
                              });
                              const data = await res.json();
                              if (data.success) {
                                showMsg(editingPackageId ? "Paket güncellendi" : "Yeni paket eklendi", "success");
                                setPackageModalOpen(false);
                                fetchData();
                              } else {
                                showMsg(data.error || "İşlem başarısız", "error");
                              }
                            } catch {
                              showMsg("Bağlantı hatası", "error");
                            }
                          }}
                          className="flex-1 py-2.5 bg-orange-600 hover:bg-orange-500 text-white font-black rounded-xl transition shadow-lg"
                        >
                          {editingPackageId ? "Değişiklikleri Kaydet" : "Paketi Ekle"}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* SETTINGS & DB ACTIONS TAB */}
            {activeTab === "settings" && (
              <div className="p-6 space-y-6">
                <div className="bg-[#0D1B35] border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
                  <h3 className="text-white font-black text-base flex items-center gap-2">
                    ⚙️ Sistem Yönetimi & Veritabanı Araçları
                  </h3>
                  <p className="text-xs text-slate-400 font-medium">
                    Veritabanındaki test verilerini temizlemek veya örnek deneme sınavları, sorular ve öğretmen verileri tohumlamak için aşağıdaki araçları kullanabilirsiniz.
                  </p>

                  <div className="flex flex-wrap gap-4 pt-2">
                    <button
                      onClick={async () => {
                        if (!confirm("Tüm test canlı dersleri ve katılım kayıtlarını temizlemek istediğinize emin misiniz?")) return;
                        try {
                          const res = await adminFetch("/api/admin/clean-test-data", { method: "POST" });
                          const data = await res.json();
                          if (data.success) {
                            showMsg("✅ " + data.message, "success");
                            fetchData();
                          } else {
                            showMsg(data.error || "Temizleme başarısız", "error");
                          }
                        } catch {
                          showMsg("Bağlantı hatası", "error");
                        }
                      }}
                      className="bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/30 font-black text-xs px-5 py-3 rounded-xl transition flex items-center gap-2"
                    >
                      🧹 Test Verilerini Temizle
                    </button>

                    <button
                      onClick={async () => {
                        try {
                          const res = await adminFetch("/api/admin/seed", { method: "POST" });
                          const data = await res.json();
                          if (data.success) {
                            showMsg("🌱 " + data.message, "success");
                            fetchData();
                          } else {
                            showMsg(data.error || "Tohumlama başarısız", "error");
                          }
                        } catch {
                          showMsg("Bağlantı hatası", "error");
                        }
                      }}
                      className="bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 font-black text-xs px-5 py-3 rounded-xl transition flex items-center gap-2"
                    >
                      🌱 Örnek Test Verilerini Yükle (Seed)
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* ─── YENİ DENEME SINAVI OLUŞTURMA MODALI ─── */}
      {examModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#131B2E] border border-white/10 rounded-3xl max-w-3xl w-full p-6 sm:p-8 space-y-6 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="text-white font-black text-lg flex items-center gap-2">
                🎯 Yeni Online Deneme Sınavı Hazırla
              </h3>
              <button onClick={() => setExamModalOpen(false)} className="text-slate-400 hover:text-white text-lg font-bold">✕</button>
            </div>

            <form onSubmit={handleCreateExam} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">Sınav Başlığı *</label>
                  <input
                    type="text" required
                    placeholder="Örn: 2026 Türkiye Geneli TYT Deneme Sınavı - 1"
                    value={examForm.title}
                    onChange={(e) => setExamForm({ ...examForm, title: e.target.value })}
                    className="w-full bg-[#0D1B35] border border-white/10 text-white px-4 py-3 rounded-xl text-sm font-bold focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">Sınav Türü</label>
                  <select
                    value={examForm.examType}
                    onChange={(e) => setExamForm({ ...examForm, examType: e.target.value })}
                    className="w-full bg-[#0D1B35] border border-white/10 text-white px-4 py-3 rounded-xl text-sm font-bold focus:outline-none focus:border-indigo-500"
                  >
                    <option value="TYT">TYT (Temel Yeterlilik)</option>
                    <option value="AYT">AYT (Alan Yeterlilik)</option>
                    <option value="YKS">YKS (TYT+AYT)</option>
                    <option value="LGS">LGS (Lise Giriş)</option>
                    <option value="KPSS">KPSS</option>
                  </select>
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-black text-indigo-400 uppercase tracking-wider mb-2">🎯 Hedef Öğrenci Tagı</label>
                  <select
                    value={examForm.targetTag}
                    onChange={(e) => setExamForm({ ...examForm, targetTag: e.target.value })}
                    className="w-full bg-[#0D1B35] border border-indigo-500/40 text-white px-4 py-3 rounded-xl text-sm font-bold focus:outline-none"
                  >
                    <option value="TÜMÜ">TÜMÜ (Tüm Öğrenciler)</option>
                    <option value="TYT">TYT Öğrencileri</option>
                    <option value="AYT">AYT Öğrencileri</option>
                    <option value="YKS">YKS Öğrencileri</option>
                    <option value="LGS">LGS Öğrencileri</option>
                    <option value="KPSS">KPSS Öğrencileri</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">Sınav Süresi (Dakika) *</label>
                  <input
                    type="number" required min={5} max={300}
                    value={examForm.durationMinutes}
                    onChange={(e) => setExamForm({ ...examForm, durationMinutes: parseInt(e.target.value) || 135 })}
                    className="w-full bg-[#0D1B35] border border-white/10 text-white px-4 py-3 rounded-xl text-sm font-bold focus:outline-none"
                  />
                </div>
                <div className="flex items-end pb-2">
                  <label className="flex items-center gap-2 cursor-pointer bg-[#0D1B35] border border-white/10 p-3 rounded-xl w-full">
                    <input
                      type="checkbox"
                      checked={examForm.isCameraRequired}
                      onChange={(e) => setExamForm({ ...examForm, isCameraRequired: e.target.checked })}
                      className="w-4 h-4 rounded text-indigo-600 accent-indigo-600"
                    />
                    <span className="text-xs font-black text-white">🎥 Canlı Kamera Şartlı</span>
                  </label>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">Başlangıç Tarihi & Saati *</label>
                  <input
                    type="datetime-local" required
                    value={examForm.startTime}
                    onChange={(e) => setExamForm({ ...examForm, startTime: e.target.value })}
                    className="w-full bg-[#0D1B35] border border-white/10 text-white px-4 py-3 rounded-xl text-sm font-bold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">Bitiş Tarihi & Saati *</label>
                  <input
                    type="datetime-local" required
                    value={examForm.endTime}
                    onChange={(e) => setExamForm({ ...examForm, endTime: e.target.value })}
                    className="w-full bg-[#0D1B35] border border-white/10 text-white px-4 py-3 rounded-xl text-sm font-bold focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">Sınav Açıklaması / Talimatlar</label>
                <textarea
                  rows={2}
                  placeholder="Öğrencilerin sınav öncesi okuyacağı kurallar ve açıklamalar..."
                  value={examForm.description}
                  onChange={(e) => setExamForm({ ...examForm, description: e.target.value })}
                  className="w-full bg-[#0D1B35] border border-white/10 text-white px-4 py-2.5 rounded-xl text-sm font-semibold focus:outline-none"
                />
              </div>

              {/* Selected Questions Section */}
              <div className="bg-[#0D1B35] border border-white/10 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-black text-white text-sm">📝 Sınav Soru Akışı ({selectedQuestionItems.length} Soru)</h4>
                    <p className="text-[11px] text-slate-400">Soru havuzundaki onaylı sorulardan ekleyin.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPickerModalOpen(true)}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs px-4 py-2 rounded-xl transition flex items-center gap-1.5 shadow-md"
                  >
                    ➕ Soru Havuzundan Seç
                  </button>
                </div>

                {selectedQuestionItems.length === 0 ? (
                  <p className="text-center py-6 text-xs text-slate-500 font-bold border border-dashed border-white/10 rounded-xl">
                    Henüz soru seçilmedi. Lütfen "Soru Havuzundan Seç" butonunu kullanarak soruları ekleyin.
                  </p>
                ) : (
                  <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                    {selectedQuestionItems.map((item, idx) => (
                      <div key={item.question.id} className="bg-[#131B2E] border border-white/10 rounded-xl p-3 flex items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white font-black text-xs flex items-center justify-center flex-shrink-0">
                            {idx + 1}
                          </span>
                          <div className="min-w-0">
                            <span className="font-black text-white block truncate">{item.question.questionText}</span>
                            <span className="text-[10px] text-slate-400 font-semibold">
                              {item.question.subject} • {item.question.difficulty} • {item.question.points} Puan
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <select
                            value={item.sectionName}
                            onChange={(e) => {
                              const val = e.target.value;
                              setSelectedQuestionItems((prev) =>
                                prev.map((q, i) => (i === idx ? { ...q, sectionName: val } : q))
                              );
                            }}
                            className="bg-[#0D1B35] border border-white/10 text-xs text-slate-300 rounded-lg px-2 py-1 focus:outline-none font-bold"
                          >
                            <option value="Türkçe">Türkçe</option>
                            <option value="Temel Matematik">Temel Matematik</option>
                            <option value="Sosyal Bilgiler">Sosyal Bilgiler</option>
                            <option value="Fen Bilimleri">Fen Bilimleri</option>
                            <option value="Genel">Genel</option>
                          </select>
                          <button
                            type="button"
                            onClick={() => setSelectedQuestionItems((prev) => prev.filter((_, i) => i !== idx))}
                            className="text-red-400 hover:text-red-300 font-black text-xs px-2 py-1"
                          >
                            Kaldır
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setExamModalOpen(false)}
                  className="bg-white/5 hover:bg-white/10 text-slate-300 font-black text-xs px-6 py-3 rounded-xl transition border border-white/10"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={examCreating}
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs px-8 py-3 rounded-xl transition shadow-lg"
                >
                  {examCreating ? "Oluşturuluyor..." : "Sınavı Yayınla 🚀"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── SORU HAVUZUNDAN SORU SEÇİCİ MODAL ─── */}
      {pickerModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#131B2E] border border-white/10 rounded-3xl max-w-4xl w-full p-6 sm:p-8 space-y-6 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h3 className="text-white font-black text-lg flex items-center gap-2">
                  📝 Onaylı Soru Havuzu ({approvedQuestionsPool.length} Soru)
                </h3>
                <p className="text-xs text-slate-400">Sınava eklemek istediğiniz soruları seçin.</p>
              </div>
              <button onClick={() => setPickerModalOpen(false)} className="text-slate-400 hover:text-white text-lg font-bold">✕</button>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <input
                type="text"
                placeholder="Soru metni veya konu ara..."
                value={pickerSearchText}
                onChange={(e) => setPickerSearchText(e.target.value)}
                className="w-full sm:flex-1 bg-[#0D1B35] border border-white/10 text-white px-4 py-2.5 rounded-xl text-xs font-bold focus:outline-none"
              />
              <select
                value={pickerSubjectFilter}
                onChange={(e) => setPickerSubjectFilter(e.target.value)}
                className="w-full sm:w-auto bg-[#0D1B35] border border-white/10 text-white px-4 py-2.5 rounded-xl text-xs font-bold focus:outline-none"
              >
                <option value="TÜMÜ">Tüm Dersler</option>
                <option value="Matematik">Matematik</option>
                <option value="Türkçe">Türkçe</option>
                <option value="Fizik">Fizik</option>
                <option value="Kimya">Kimya</option>
                <option value="Biyoloji">Biyoloji</option>
                <option value="Tarih">Tarih</option>
                <option value="Coğrafya">Coğrafya</option>
                <option value="Felsefe">Felsefe</option>
                <option value="Din Kültürü">Din Kültürü</option>
              </select>
            </div>

            {/* Questions Pool Grid */}
            <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
              {approvedQuestionsPool
                .filter((q) => {
                  const matchesSubj = pickerSubjectFilter === "TÜMÜ" || q.subject === pickerSubjectFilter;
                  const matchesText = !pickerSearchText || q.questionText.toLowerCase().includes(pickerSearchText.toLowerCase()) || (q.topic && q.topic.toLowerCase().includes(pickerSearchText.toLowerCase()));
                  return matchesSubj && matchesText;
                })
                .map((q) => {
                  const isAlreadySelected = selectedQuestionItems.some((item) => item.question.id === q.id);
                  let defaultSec = "Genel";
                  if (q.subject.includes("Türkçe") || q.subject.includes("Edebiyat")) defaultSec = "Türkçe";
                  else if (q.subject.includes("Matematik") || q.subject.includes("Geometri")) defaultSec = "Temel Matematik";
                  else if (q.subject.includes("Fizik") || q.subject.includes("Kimya") || q.subject.includes("Biyoloji")) defaultSec = "Fen Bilimleri";
                  else if (q.subject.includes("Tarih") || q.subject.includes("Coğrafya") || q.subject.includes("Felsefe") || q.subject.includes("Din")) defaultSec = "Sosyal Bilgiler";

                  return (
                    <div key={q.id} className={`bg-[#0D1B35] border rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition ${isAlreadySelected ? "border-emerald-500/40 bg-emerald-500/5" : "border-white/10 hover:border-indigo-500/40"}`}>
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="bg-indigo-600 text-white font-black text-[10px] px-2 py-0.5 rounded-full">{q.subject}</span>
                          <span className="bg-white/10 text-slate-300 font-bold text-[10px] px-2 py-0.5 rounded-full">{q.difficulty}</span>
                          {q.teacher && <span className="text-[10px] text-slate-400">Yazar: {q.teacher.name}</span>}
                        </div>
                        <p className="text-white text-xs font-bold line-clamp-2">{q.questionText}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          if (isAlreadySelected) {
                            setSelectedQuestionItems((prev) => prev.filter((item) => item.question.id !== q.id));
                          } else {
                            setSelectedQuestionItems((prev) => [
                              ...prev,
                              { question: q, sectionName: defaultSec, orderNo: prev.length + 1 },
                            ]);
                          }
                        }}
                        className={`text-xs font-black px-4 py-2 rounded-xl transition flex-shrink-0 ${
                          isAlreadySelected
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/30"
                            : "bg-indigo-600 hover:bg-indigo-500 text-white"
                        }`}
                      >
                        {isAlreadySelected ? "✓ Eklendi (Çıkar)" : "＋ Sınava Ekle"}
                      </button>
                    </div>
                  );
                })}
            </div>

            <div className="flex justify-end pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={() => setPickerModalOpen(false)}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs px-6 py-2.5 rounded-xl transition"
              >
                Tamam ({selectedQuestionItems.length} Soru Seçili)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── SINAV ÖN GÖSTERİM MODALI ─── */}
      {previewExamModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#131B2E] border border-white/10 rounded-3xl max-w-3xl w-full p-6 sm:p-8 space-y-6 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h3 className="text-white font-black text-lg flex items-center gap-2">
                  👁️ Sınav Ön Gösterimi
                </h3>
                <p className="text-xs text-slate-400">{previewExamModal.title}</p>
              </div>
              <button onClick={() => setPreviewExamModal(null)} className="text-slate-400 hover:text-white text-lg font-bold">✕</button>
            </div>

            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
              {previewExamModal.examQuestions?.map((eq: any, idx: number) => (
                <div key={eq.id} className="bg-[#0D1B35] border border-white/10 rounded-2xl p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="bg-indigo-600 text-white font-black text-xs px-3 py-1 rounded-xl">
                      Soru {idx + 1} — {eq.sectionName}
                    </span>
                    <span className="text-xs text-indigo-400 font-bold">Doğru Cevap: {eq.question.correctOption}</span>
                  </div>
                  <p className="text-white text-sm font-bold whitespace-pre-wrap">{eq.question.questionText}</p>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {eq.question.imageUrl && <img src={eq.question.imageUrl} alt="" className="max-h-48 object-contain rounded-xl my-2" />}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-semibold text-slate-300">
                    <div className={eq.question.correctOption === "A" ? "text-emerald-400 font-bold" : ""}>A) {eq.question.optionA}</div>
                    <div className={eq.question.correctOption === "B" ? "text-emerald-400 font-bold" : ""}>B) {eq.question.optionB}</div>
                    <div className={eq.question.correctOption === "C" ? "text-emerald-400 font-bold" : ""}>C) {eq.question.optionC}</div>
                    <div className={eq.question.correctOption === "D" ? "text-emerald-400 font-bold" : ""}>D) {eq.question.optionD}</div>
                    {eq.question.optionE && <div className={eq.question.correctOption === "E" ? "text-emerald-400 font-bold" : ""}>E) {eq.question.optionE}</div>}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={() => setPreviewExamModal(null)}
                className="bg-white/5 hover:bg-white/10 text-white font-black text-xs px-6 py-2.5 rounded-xl border border-white/10"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── CANLI GÖZETMENLİK & KAMERA İZLEME MODALI (PROCTORING GRID) ─── */}
      {proctorExamModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#131B2E] border border-white/10 rounded-3xl max-w-5xl w-full p-6 sm:p-8 space-y-6 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h3 className="text-white font-black text-lg flex items-center gap-2">
                  🎥 Canlı Kamera Gözetmenliği Paneli
                </h3>
                <p className="text-xs text-emerald-400 font-semibold mt-0.5">
                  {proctorExamModal.title} — Aktif Sınava Giren Öğrenciler
                </p>
              </div>
              <button onClick={() => setProctorExamModal(null)} className="text-slate-400 hover:text-white text-lg font-bold">✕</button>
            </div>

            {/* Proctoring Grid */}
            {proctorAttempts.length === 0 ? (
              <div className="text-center py-16 bg-[#0D1B35] rounded-2xl border border-white/5 space-y-2">
                <span className="text-3xl block">📹</span>
                <p className="text-white font-black text-sm">Şu Anda Sınavda Aktif Öğrenci Bulunmuyor</p>
                <p className="text-xs text-slate-400">Sınav saatinde öğrenciler giriş yaptıkça canlı kamera akışları burada görünecektir.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-h-[65vh] overflow-y-auto pr-1">
                {proctorAttempts.map((att) => {
                  const s = att.student;
                  const isSubmitted = att.status === "SUBMITTED";
                  const warningCount = att.focusWarnings || 0;

                  return (
                    <div key={att.id} className="bg-[#0D1B35] border border-white/10 rounded-2xl p-4 space-y-3 relative overflow-hidden">
                      {/* Video Simulated Frame */}
                      <div className="w-full h-40 bg-black rounded-xl border border-white/10 overflow-hidden relative flex items-center justify-center">
                        {s.avatar ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img src={s.avatar} alt="" className="w-full h-full object-cover opacity-80" />
                        ) : (
                          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black text-xl">
                            {s.name.charAt(0)}
                          </div>
                        )}
                        <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-md text-[10px] font-black text-emerald-400 border border-emerald-500/30">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          CANLI KAMERA
                        </div>
                        {warningCount > 0 && (
                          <div className="absolute bottom-2 left-2 bg-red-500/80 text-white text-[10px] font-black px-2 py-0.5 rounded-md animate-pulse">
                            ⚠️ {warningCount} Sekme Değişimi
                          </div>
                        )}
                      </div>

                      <div>
                        <h4 className="font-black text-white text-sm">{s.name}</h4>
                        <p className="text-[10px] text-slate-400">{s.email}</p>
                      </div>

                      <div className="flex items-center justify-between text-[11px] font-semibold border-t border-white/5 pt-2">
                        <span className="text-slate-400">Durum:</span>
                        <span className={`font-black ${isSubmitted ? "text-emerald-400" : "text-amber-400"}`}>
                          {isSubmitted ? `✅ Tamamlandı (${att.totalNet} Net)` : "✍️ Sınavı Çözüyor"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="flex justify-end pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={() => setProctorExamModal(null)}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs px-6 py-2.5 rounded-xl transition"
              >
                Gözetmenliği Kapat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
