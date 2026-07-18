"use client";
import { useState } from "react";
import { waLink } from "@/lib/utils";

export default function DersSihirbaziPage() {
  const [wizardStep, setWizardStep] = useState<"category" | "subject">("category");
  const [selectedCategory, setSelectedCategory] = useState<"YKS" | "LGS" | "">("");
  const [selectedSubject, setSelectedSubject] = useState("");

  return (
    <div className="bg-[#FAF8F5] min-h-screen text-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto text-center">
        <span className="text-[#D97706] text-xs font-black uppercase tracking-widest">HIZLI DERS YÖNLENDİRME</span>
        <h1 className="text-3xl sm:text-4xl font-black text-[#1E3A8A] mt-2 mb-4">3 Saniyede Özel Ders Sihirbazı</h1>
        <p className="text-gray-550 text-sm font-semibold mb-10 leading-relaxed">
          Hedeflediğiniz sınav alanına ve ihtiyacınız olan derse uygun olarak saniyeler içinde WhatsApp özel ders talebi oluşturun.
        </p>

        {/* Wizard Container */}
        <div className="bg-white border border-[#EFECE6] rounded-3xl p-6 sm:p-8 shadow-md text-left flex flex-col space-y-6">
          <div className="flex justify-between items-center pb-4 border-b border-[#FAF8F5]">
            <span className="text-xs font-black text-[#D97706] uppercase tracking-wider flex items-center gap-1.5">
              ⚡ ADIM ADIM DERS TALEBİ
            </span>
            {wizardStep === "subject" && (
              <button 
                onClick={() => {
                  setWizardStep("category");
                  setSelectedCategory("");
                  setSelectedSubject("");
                }}
                className="text-xs font-black text-gray-400 hover:text-gray-600 transition-colors uppercase tracking-wider"
              >
                ◀ Geri Dön
              </button>
            )}
          </div>

          {wizardStep === "category" ? (
            <div className="space-y-4">
              <p className="text-sm font-bold text-gray-650 leading-relaxed">Ders almak istediğiniz sınav alanını seçin:</p>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => {
                    setSelectedCategory("YKS");
                    setWizardStep("subject");
                  }}
                  className="bg-[#FAF8F5] hover:bg-[#FAF0E3] hover:border-[#F5D0A9] border border-[#EFECE6] rounded-2xl py-5 px-3 text-center text-sm font-black text-[#1E3A8A] transition-all flex flex-col items-center justify-center gap-2 active:scale-95 shadow-sm"
                >
                  <span className="text-3xl">🎓</span>
                  <span>YKS Hazırlık</span>
                </button>
                <button
                  onClick={() => {
                    setSelectedCategory("LGS");
                    setWizardStep("subject");
                  }}
                  className="bg-[#FAF8F5] hover:bg-[#FAF0E3] hover:border-[#F5D0A9] border border-[#EFECE6] rounded-2xl py-5 px-3 text-center text-sm font-black text-[#1E3A8A] transition-all flex flex-col items-center justify-center gap-2 active:scale-95 shadow-sm"
                >
                  <span className="text-3xl">🏫</span>
                  <span>LGS Hazırlık</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-xs font-bold text-gray-500">
                Seçilen Alan: <span className="text-[#D97706] font-black">{selectedCategory}</span>. İhtiyacınız olan dersi seçin:
              </p>
              <div className="grid grid-cols-2 gap-3">
                {(selectedCategory === "YKS"
                  ? ["Matematik", "Fizik", "Kimya", "Türkçe/Edebiyat", "Geometri"]
                  : ["Matematik", "Fen Bilimleri", "Türkçe", "Tarih/İnkılap"]
                ).map((subject) => (
                  <button
                    key={subject}
                    onClick={() => setSelectedSubject(subject)}
                    className={`border rounded-2xl py-3.5 px-2 text-center text-xs font-black transition-all active:scale-95 ${
                      selectedSubject === subject
                        ? "bg-[#D97706] text-white border-[#D97706] shadow-sm"
                        : "bg-[#FAF8F5] hover:bg-[#FAF0E3] border-[#EFECE6] text-[#1E3A8A]"
                    }`}
                  >
                    {subject}
                  </button>
                ))}
              </div>

              {selectedSubject && (
                <div className="pt-4">
                  <a
                    href={waLink(`Merhaba, ${selectedCategory} sınavı için ${selectedSubject} dersi hakkında birebir özel ders bilgisi almak istiyorum.`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-[#1E3A8A] hover:bg-[#152a60] text-white font-black py-4 rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 text-sm text-center active:scale-95"
                  >
                    ⚡ {selectedSubject} Dersi Bilgisi Al
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
