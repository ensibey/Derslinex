"use client";
import { waLink } from "@/lib/utils";
import { useState } from "react";

export default function IletisimPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ isim: "", email: "", konu: "", mesaj: "", onay: false });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="bg-[#090514] min-h-screen text-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10">
          <span className="text-primary-400 text-xs font-bold uppercase tracking-widest font-sans">BİZE ULAŞIN</span>
          <h1 className="text-4xl sm:text-5xl font-black mb-3 mt-2 bg-gradient-to-r from-primary-400 via-violet-400 to-emerald-400 bg-clip-text text-transparent">İletişim</h1>
          <p className="text-gray-400 text-lg">Soru, öneri veya ders talebi için bize ulaşın.</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10">
          <div className="bg-[#120b24]/90 rounded-3xl border border-white/5 shadow-2xl backdrop-blur-md p-8">
            {submitted ? (
              <div className="text-center py-10">
                <div className="text-5xl mb-4">✅</div>
                <h3 className="text-xl font-bold text-white mb-2">Mesajınız İletildi!</h3>
                <p className="text-gray-400">En kısa sürede size döneceğiz.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-1.5">Ad Soyad *</label>
                  <input type="text" required value={form.isim}
                    onChange={e => setForm({...form, isim: e.target.value})}
                    className="w-full bg-[#1a1235]/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-primary-500 text-white outline-none"
                    placeholder="Adınız Soyadınız" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-1.5">E-posta *</label>
                  <input type="email" required value={form.email}
                    onChange={e => setForm({...form, email: e.target.value})}
                    className="w-full bg-[#1a1235]/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-primary-500 text-white outline-none"
                    placeholder="ornek@email.com" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-1.5">Konu</label>
                  <select value={form.konu} onChange={e => setForm({...form, konu: e.target.value})}
                    className="w-full bg-[#1a1235]/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-primary-500 text-white outline-none">
                    <option value="" className="bg-[#120b24]">Seçiniz</option>
                    <option className="bg-[#120b24]">Ders Talebi</option>
                    <option className="bg-[#120b24]">Hoca Başvurusu</option>
                    <option className="bg-[#120b24]">Genel Soru</option>
                    <option className="bg-[#120b24]">Teknik Destek</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-1.5">Mesaj *</label>
                  <textarea required rows={4} value={form.mesaj}
                    onChange={e => setForm({...form, mesaj: e.target.value})}
                    className="w-full bg-[#1a1235]/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-primary-500 text-white outline-none resize-none"
                    placeholder="Mesajınızı yazın..." />
                </div>
                <div className="flex items-start gap-2">
                  <input type="checkbox" id="onay" required checked={form.onay}
                    onChange={e => setForm({...form, onay: e.target.checked})} className="mt-1" />
                  <label htmlFor="onay" className="text-xs text-gray-400">
                    <a href="/gizlilik" className="text-primary-400 underline">Gizlilik Politikası</a>'nı okudum, onay veriyorum.
                  </label>
                </div>
                <button type="submit"
                  className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3.5 rounded-xl transition-colors">
                  Mesajı Gönder
                </button>
              </form>
            )}
          </div>

          <div className="space-y-5">
            <a href={waLink()} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-5 bg-emerald-950/20 border border-emerald-500/20 rounded-3xl p-6 hover:bg-emerald-950/40 transition-all shadow-premium group">
              <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center text-white text-2xl flex-shrink-0">💬</div>
              <div>
                <p className="font-bold text-white">WhatsApp</p>
                <p className="text-emerald-400 font-semibold">+90 555 000 00 00</p>
                <p className="text-xs text-gray-400 mt-1">En hızlı yanıt — genellikle 1 saat içinde</p>
              </div>
            </a>
            <div className="flex items-center gap-5 bg-[#120b24]/90 border border-white/5 rounded-3xl p-6 shadow-premium">
              <div className="w-14 h-14 bg-primary-950 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0">✉️</div>
              <div>
                <p className="font-bold text-white">E-posta</p>
                <p className="text-primary-400 font-semibold">info@derslinex.com</p>
                <p className="text-xs text-gray-400 mt-1">İş birliği ve hoca başvuruları için</p>
              </div>
            </div>
            <div className="flex items-center gap-5 bg-[#120b24]/90 border border-white/5 rounded-3xl p-6 shadow-premium">
              <div className="w-14 h-14 bg-amber-950 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0">📍</div>
              <div>
                <p className="font-bold text-white">Yüz Yüze Dersler</p>
                <p className="text-gray-300">Anlaşmalı Şehirler & Ortak Çalışma Alanları</p>
                <p className="text-xs text-gray-400 mt-1">Online dersler Türkiye geneli</p>
              </div>
            </div>
            <div className="bg-[#120b24]/90 rounded-3xl border border-white/5 p-6">
              <h3 className="font-bold text-white mb-3">Yanıt Süreleri</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-center gap-2"><span className="text-emerald-500">●</span> WhatsApp: &lt;1 saat (09:00–22:00)</li>
                <li className="flex items-center gap-2"><span className="text-amber-500">●</span> E-posta: 1 iş günü</li>
                <li className="flex items-center gap-2"><span className="text-primary-500">●</span> Form: 1 iş günü</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
