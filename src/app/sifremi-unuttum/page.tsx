"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function SifremiUnuttumPage() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"student" | "teacher">("student");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, role }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ text: data.message, type: "success" });
      } else {
        setMessage({ text: data.error || "İşlem başarısız", type: "error" });
      }
    } catch {
      setMessage({ text: "Bağlantı hatası oluştu.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A1628] flex items-center justify-center p-4 font-sans text-slate-100">
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
          <h1 className="text-2xl font-black text-white tracking-tight">🔑 Şifremi Unuttum</h1>
          <p className="text-slate-400 text-xs font-semibold">
            Hesabınıza ait e-posta adresinizi girin, size şifre sıfırlama bağlantısı gönderelim.
          </p>
        </div>

        {message && (
          <div className={`p-4 rounded-xl text-xs font-bold border ${ message.type === "success" ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" : "bg-red-500/20 text-red-300 border-red-500/30" }`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">Hesap Türünüz</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRole("student")}
                className={`py-2.5 rounded-xl font-black text-xs transition border ${ role === "student" ? "bg-indigo-600 border-indigo-400 text-white shadow-lg shadow-indigo-900/50" : "bg-[#1E293B] border-white/10 text-slate-400 hover:text-white" }`}
              >
                🎓 Öğrenci
              </button>
              <button
                type="button"
                onClick={() => setRole("teacher")}
                className={`py-2.5 rounded-xl font-black text-xs transition border ${ role === "teacher" ? "bg-indigo-600 border-indigo-400 text-white shadow-lg shadow-indigo-900/50" : "bg-[#1E293B] border-white/10 text-slate-400 hover:text-white" }`}
              >
                👨‍🏫 Öğretmen
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">E-posta Adresiniz</label>
            <input
              type="email"
              required
              placeholder="ornek@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#1E293B] border border-white/10 text-white px-4 py-3 rounded-xl text-sm font-semibold focus:outline-none placeholder:text-slate-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-3.5 rounded-xl text-sm transition shadow-lg shadow-indigo-900/50 disabled:opacity-60"
          >
            {loading ? "Gönderiliyor..." : "🚀 Sıfırlama Bağlantısı Gönder"}
          </button>
        </form>

        <div className="text-center pt-2">
          <Link href="/profil" className="text-xs text-indigo-400 hover:text-indigo-300 font-bold">
            ← Giriş Sayfasına Dön
          </Link>
        </div>
      </div>
    </div>
  );
}
