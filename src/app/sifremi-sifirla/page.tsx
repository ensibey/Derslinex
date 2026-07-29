"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    if (!token) {
      setMessage({ text: "Geçersiz veya eksik şifre sıfırlama bağlantısı.", type: "error" });
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    if (newPassword !== confirmPassword) {
      setMessage({ text: "Şifreler eşleşmiyor.", type: "error" });
      return;
    }

    if (newPassword.length < 6) {
      setMessage({ text: "Şifre en az 6 karakter olmalıdır.", type: "error" });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ text: data.message, type: "success" });
        setTimeout(() => {
          router.push("/profil");
        }, 2000);
      } else {
        setMessage({ text: data.error || "Şifre güncellenemedi.", type: "error" });
      }
    } catch {
      setMessage({ text: "Bağlantı hatası oluştu.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-[#0D1B35] border border-white/10 rounded-3xl p-8 shadow-2xl space-y-6">
      <div className="text-center space-y-2">
        <Link href="/" className="inline-flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-600 p-0.5 shadow-lg shadow-indigo-500/30">
            <div className="w-full h-full bg-[#0D1B35] rounded-[10px] flex items-center justify-center font-black text-white text-xs">
              DX
            </div>
          </div>
          <span className="text-white font-black text-xl">Derslinex</span>
        </Link>
        <h1 className="text-2xl font-black text-white tracking-tight">🔒 Yeni Şifre Belirle</h1>
        <p className="text-slate-400 text-xs font-semibold">
          Lütfen hesabınız için yeni şifrenizi girin.
        </p>
      </div>

      {message && (
        <div className={`p-4 rounded-xl text-xs font-bold border ${ message.type === "success" ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" : "bg-red-500/20 text-red-300 border-red-500/30" }`}>
          {message.text}
        </div>
      )}

      {token && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">Yeni Şifre</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full bg-[#1E293B] border border-white/10 text-white px-4 py-3 rounded-xl text-sm font-semibold focus:outline-none placeholder:text-slate-500"
            />
          </div>

          <div>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">Yeni Şifre (Tekrar)</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-[#1E293B] border border-white/10 text-white px-4 py-3 rounded-xl text-sm font-semibold focus:outline-none placeholder:text-slate-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-3.5 rounded-xl text-sm transition shadow-lg shadow-emerald-900/50 disabled:opacity-60"
          >
            {loading ? "Güncelleniyor..." : "💾 Yeni Şifreyi Kaydet"}
          </button>
        </form>
      )}

      <div className="text-center pt-2">
        <Link href="/profil" className="text-xs text-indigo-400 hover:text-indigo-300 font-bold">
          ← Giriş Sayfasına Dön
        </Link>
      </div>
    </div>
  );
}

export default function SifremiSifirlaPage() {
  return (
    <div className="min-h-screen bg-[#0A1628] flex items-center justify-center p-4 font-sans text-slate-100">
      <Suspense fallback={<div className="text-white font-bold">Yükleniyor...</div>}>
        <ResetPasswordContent />
      </Suspense>
    </div>
  );
}
