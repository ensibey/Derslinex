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
    <div className="bg-[#FAF8F5] min-h-screen text-gray-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10">
          <span className="text-[#D97706] text-xs font-black uppercase tracking-widest font-sans">BİZE ULAŞIN</span>
          <h1 className="text-4xl sm:text-5xl font-black mb-3 mt-2 text-[#1E3A8A]">İletişim</h1>
          <p className="text-gray-650 text-lg font-medium">Soru, öneri veya ders talebi için bize ulaşın.</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10">
          <div className="bg-white rounded-3xl border border-[#EFECE6] shadow-sm p-8">
            {submitted ? (
              <div className="text-center py-10">
                <div className="text-5xl mb-4">✅</div>
                <h3 className="text-xl font-black text-[#1E3A8A] mb-2">Mesajınız İletildi!</h3>
                <p className="text-gray-500 font-bold">En kısa sürede size döneceğiz.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-black text-[#1E3A8A] mb-1.5">Ad Soyad *</label>
                  <input type="text" required value={form.isim}
                    onChange={e => setForm({...form, isim: e.target.value})}
                    className="w-full bg-[#FAF8F5] border border-[#EFECE6] rounded-xl px-4 py-3 text-sm focus:border-[#D97706] text-gray-900 outline-none font-medium"
                    placeholder="Adınız Soyadınız" />
                </div>
                <div>
                  <label className="block text-sm font-black text-[#1E3A8A] mb-1.5">E-posta *</label>
                  <input type="email" required value={form.email}
                    onChange={e => setForm({...form, email: e.target.value})}
                    className="w-full bg-[#FAF8F5] border border-[#EFECE6] rounded-xl px-4 py-3 text-sm focus:border-[#D97706] text-gray-900 outline-none font-medium"
                    placeholder="ornek@email.com" />
                </div>
                <div>
                  <label className="block text-sm font-black text-[#1E3A8A] mb-1.5">Konu</label>
                  <select value={form.konu} onChange={e => setForm({...form, konu: e.target.value})}
                    className="w-full bg-[#FAF8F5] border border-[#EFECE6] rounded-xl px-4 py-3 text-sm focus:border-[#D97706] text-gray-900 outline-none font-bold">
                    <option value="" className="bg-white">Seçiniz</option>
                    <option className="bg-white">Ders Talebi</option>
                    <option className="bg-white">Hoca Başvurusu</option>
                    <option className="bg-white">Genel Soru</option>
                    <option className="bg-white">Teknik Destek</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-black text-[#1E3A8A] mb-1.5">Mesaj *</label>
                  <textarea required rows={4} value={form.mesaj}
                    onChange={e => setForm({...form, mesaj: e.target.value})}
                    className="w-full bg-[#FAF8F5] border border-[#EFECE6] rounded-xl px-4 py-3 text-sm focus:border-[#D97706] text-gray-900 outline-none resize-none font-medium"
                    placeholder="Mesajınızı yazın..." />
                </div>
                <div className="flex items-start gap-2">
                  <input type="checkbox" id="onay" required checked={form.onay}
                    onChange={e => setForm({...form, onay: e.target.checked})} className="mt-1" />
                  <label htmlFor="onay" className="text-xs text-gray-500 font-bold">
                    <a href="/gizlilik" className="text-[#D97706] underline">Gizlilik Politikası</a>'nı okudum, onay veriyorum.
                  </label>
                </div>
                <button type="submit"
                  className="w-full bg-[#D97706] hover:bg-[#B45309] text-white font-black py-3.5 rounded-xl transition-colors shadow-sm">
                  Mesajı Gönder
                </button>
              </form>
            )}
          </div>

          <div className="space-y-5">
            <a href={waLink()} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-5 bg-emerald-50 border border-emerald-100 rounded-3xl p-6 hover:bg-emerald-100/50 transition-all shadow-sm group">
              <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center text-white text-2xl flex-shrink-0">💬</div>
              <div>
                <p className="font-black text-gray-900">WhatsApp</p>
                <p className="text-emerald-600 font-black">+90 554 383 18 28</p>
                <p className="text-xs text-gray-500 mt-1 font-bold">En hızlı yanıt — genellikle 1 saat içinde</p>
              </div>
            </a>
            <div className="flex items-center gap-5 bg-white border border-[#EFECE6] rounded-3xl p-6 shadow-sm">
              <div className="w-14 h-14 bg-[#FAF0E3] rounded-2xl flex items-center justify-center text-[#B45309] text-2xl flex-shrink-0">✉️</div>
              <div>
                <p className="font-black text-[#1E3A8A]">E-posta</p>
                <p className="text-[#D97706] font-black">info@derslinex.com</p>
                <p className="text-xs text-gray-500 mt-1 font-bold">İş birliği ve hoca başvuruları için</p>
              </div>
            </div>
            <div className="flex items-center gap-5 bg-white border border-[#EFECE6] rounded-3xl p-6 shadow-sm">
              <div className="w-14 h-14 bg-[#FAF0E3] rounded-2xl flex items-center justify-center text-[#B45309] text-2xl flex-shrink-0">📍</div>
              <div>
                <p className="font-black text-[#1E3A8A]">Yüz Yüze Dersler</p>
                <p className="text-gray-700 font-bold">Anlaşmalı Şehirler & Ortak Çalışma Alanları</p>
                <p className="text-xs text-gray-500 mt-1 font-bold">Online dersler Türkiye geneli</p>
              </div>
            </div>
            <div className="bg-white rounded-3xl border border-[#EFECE6] p-6 shadow-sm">
              <h3 className="font-black text-[#1E3A8A] mb-3">Yanıt Süreleri</h3>
              <ul className="space-y-2 text-sm text-gray-700 font-bold">
                <li className="flex items-center gap-2"><span className="text-emerald-500">●</span> WhatsApp: &lt;1 saat (09:00–22:00)</li>
                <li className="flex items-center gap-2"><span className="text-[#D97706]">●</span> E-posta: 1 iş günü</li>
                <li className="flex items-center gap-2"><span className="text-[#1E3A8A]">●</span> Form: 1 iş günü</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
