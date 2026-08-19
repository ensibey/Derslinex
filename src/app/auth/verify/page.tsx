"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const tokenParam = searchParams.get("token") || "";
  const emailParam = searchParams.get("email") || "";

  const [email, setEmail] = useState(emailParam);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [status, setStatus] = useState<"idle" | "verifying" | "success" | "error">(tokenParam ? "verifying" : "idle");
  const [message, setMessage] = useState("");
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // Auto-verify if token is present in URL query
  useEffect(() => {
    if (tokenParam) {
      handleVerifyWithToken(tokenParam);
    }
  }, [tokenParam]);

  // Resend countdown timer
  useEffect(() => {
    if (countdown > 0 && !canResend) {
      const timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      setCanResend(true);
    }
  }, [countdown, canResend]);

  const handleVerifyWithToken = async (token: string) => {
    setLoading(true);
    setStatus("verifying");
    setMessage("Doğrulama bağlantınız kontrol ediliyor...");
    try {
      const res = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const data = await res.json();
      if (data.success) {
        setStatus("success");
        setMessage(data.message || "E-posta adresiniz başarıyla doğrulandı!");
        // Store user in storage
        if (data.user && data.role) {
          localStorage.setItem("derslinex_role", data.role);
          localStorage.setItem("derslinex_user", JSON.stringify(data.user));
          window.dispatchEvent(new Event("derslinex_auth_change"));
        }
        setTimeout(() => {
          router.push("/profil");
        }, 2000);
      } else {
        setStatus("error");
        setMessage(data.error || "Doğrulama başarısız oldu.");
      }
    } catch {
      setStatus("error");
      setMessage("Sunucuya bağlanırken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyWithCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !code || code.trim().length < 6) {
      setMessage("Lütfen 6 haneli onay kodunu eksiksiz giriniz.");
      setStatus("error");
      return;
    }

    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: code.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setStatus("success");
        setMessage(data.message || "E-posta adresiniz başarıyla doğrulandı!");
        if (data.user && data.role) {
          localStorage.setItem("derslinex_role", data.role);
          localStorage.setItem("derslinex_user", JSON.stringify(data.user));
          window.dispatchEvent(new Event("derslinex_auth_change"));
        }
        setTimeout(() => {
          router.push("/profil");
        }, 1500);
      } else {
        setStatus("error");
        setMessage(data.error || "Geçersiz onay kodu.");
      }
    } catch {
      setStatus("error");
      setMessage("Bağlantı hatası oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!email) {
      setMessage("Lütfen e-posta adresinizi giriniz.");
      setStatus("error");
      return;
    }

    setResending(true);
    try {
      const res = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage(data.message || "Yeni onay kodunuz e-posta adresinize gönderildi!");
        setStatus("idle");
        setCanResend(false);
        setCountdown(60);
      } else {
        setMessage(data.error || "Kod tekrar gönderilemedi.");
        setStatus("error");
      }
    } catch {
      setMessage("Bağlantı hatası oluştu.");
      setStatus("error");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070D1E] text-white flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Glow Effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-rose-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-[#0F172A]/90 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <Link href="/" className="inline-block">
            <span className="text-2xl font-black tracking-wider bg-gradient-to-r from-rose-500 to-orange-400 bg-clip-text text-transparent">
              🎓 DERSLINEX
            </span>
          </Link>
          <h1 className="text-xl font-black text-white mt-3">E-Posta Doğrulama</h1>
          <p className="text-xs text-slate-400 font-medium mt-1">
            Hesabınızı aktifleştirmek için e-postanıza gönderilen 6 haneli kodu giriniz.
          </p>
        </div>

        {/* State Alerts */}
        {status === "verifying" && (
          <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-center space-y-2 mb-6">
            <div className="inline-block w-8 h-8 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-indigo-300 font-bold">{message}</p>
          </div>
        )}

        {status === "success" && (
          <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-2 mb-6">
            <div className="text-4xl">🎉</div>
            <h3 className="text-sm font-black text-emerald-400">Doğrulama Başarılı!</h3>
            <p className="text-xs text-emerald-200">{message}</p>
            <span className="text-[11px] text-slate-400 block pt-1">Panele yönlendiriliyorsunuz...</span>
          </div>
        )}

        {status === "error" && (
          <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-center mb-6">
            <p className="text-xs text-red-400 font-bold">{message}</p>
          </div>
        )}

        {/* Code Input Form */}
        {status !== "success" && (
          <form onSubmit={handleVerifyWithCode} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1">E-Posta Adresiniz</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ornek@domain.com"
                required
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-rose-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1">6 Haneli Onay Kodu</label>
              <input
                type="text"
                maxLength={7}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Örn: 749 216"
                required
                className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-center text-2xl font-mono font-black tracking-widest text-rose-400 placeholder-slate-600 focus:outline-none focus:border-rose-500 transition"
              />
              <span className="text-[10px] text-slate-500 block text-center mt-1">
                E-postanızın gelen kutusunu (veya spam klasörünü) kontrol ediniz.
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-rose-600 to-orange-600 hover:from-rose-500 hover:to-orange-500 text-white font-black text-sm transition shadow-lg shadow-rose-900/30 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Doğrulanıyor...</span>
                </>
              ) : (
                <span>🚀 Hesabı Doğrula & Giriş Yap</span>
              )}
            </button>
          </form>
        )}

        {/* Resend Action */}
        {status !== "success" && (
          <div className="mt-6 pt-5 border-t border-white/10 text-center space-y-2">
            <span className="text-xs text-slate-400">Kod ulaşmadı mı?</span>
            <div>
              <button
                type="button"
                onClick={handleResendCode}
                disabled={!canResend || resending}
                className="text-xs font-bold text-rose-400 hover:text-rose-300 transition disabled:opacity-40 disabled:hover:text-rose-400"
              >
                {resending
                  ? "Gönderiliyor..."
                  : canResend
                  ? "🔄 Kodu Tekrar Gönder"
                  : `⏳ Tekrar göndermek için bekleyin (${countdown}s)`}
              </button>
            </div>
          </div>
        )}

        <div className="mt-6 text-center">
          <Link href="/profil" className="text-xs text-slate-500 hover:text-slate-300 transition">
            ← Giriş Yap sayfasına dön
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#070D1E] flex items-center justify-center text-white text-sm">Yükleniyor...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}
