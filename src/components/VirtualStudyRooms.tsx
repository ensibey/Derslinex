"use client";

import React, { useState } from "react";

interface StudyRoom {
  id: string;
  name: string;
  category: string;
  icon: string;
  activeStudents: number;
  description: string;
  tags: string[];
  gradient: string;
}

const STUDY_ROOMS: StudyRoom[] = [
  {
    id: "silent_library",
    name: "Sessiz Kütüphane (Kamera Odaklı)",
    category: "Genel Odaklanma",
    icon: "📚",
    activeStudents: 28,
    description: "Sadece kamera veya çalışma sayacının açık olduğu, sıfır ses ve yüksek disiplin odası.",
    tags: ["Sessiz", "Pomodoro", "Kamera İsteğe Bağlı"],
    gradient: "from-blue-600/20 via-indigo-900/40 to-[#0D1B35] border-blue-500/30",
  },
  {
    id: "yks_sayisal",
    name: "YKS Sayısal Kamp Odası",
    category: "YKS 2026",
    icon: "📐",
    activeStudents: 21,
    description: "Matematik, Fizik, Kimya ve Biyoloji soru çözümü yapan öğrencilerin odaklanma salonu.",
    tags: ["YKS", "Sayısal", "Soru Çözümü"],
    gradient: "from-purple-600/20 via-purple-900/40 to-[#0D1B35] border-purple-500/30",
  },
  {
    id: "lgs_champs",
    name: "LGS Şampiyonlar Odası",
    category: "LGS 2026",
    icon: "🎒",
    activeStudents: 15,
    description: "8. Sınıf LGS hazırlık öğrencilerinin birlikte deneme çözüp odaklandığı kütüphane.",
    tags: ["LGS", "8. Sınıf", "Soru Takibi"],
    gradient: "from-emerald-600/20 via-teal-900/40 to-[#0D1B35] border-emerald-500/30",
  },
  {
    id: "night_owls",
    name: "Gece Kuşları Odası (22:00 — 05:00)",
    category: "Gece Çalışması",
    icon: "🦉",
    activeStudents: 34,
    description: "Gece ders çalışan ve uykusuzluğa meydan okuyan öğrencilerin canlı çalışma salonu.",
    tags: ["Gece", "Maraton", "Motivation"],
    gradient: "from-amber-600/20 via-amber-900/40 to-[#0D1B35] border-amber-500/30",
  },
];

const MOCK_PARTICIPANTS = [
  { id: 1, name: "Ahmet Y.", avatar: "👨‍🎓", status: "Çalışıyor (42 dk)", camOn: true },
  { id: 2, name: "Zeynep K.", avatar: "👩‍🎓", status: "Pomodoro (18 dk)", camOn: true },
  { id: 3, name: "Can S.", avatar: "🧑‍💻", status: "Çalışıyor (15 dk)", camOn: false },
  { id: 4, name: "Elif B.", avatar: "👩‍🔬", status: "Molada (3 dk)", camOn: true },
  { id: 5, name: "Mehmet T.", avatar: "👨‍🏫", status: "Çalışıyor (55 dk)", camOn: false },
  { id: 6, name: "Selin R.", avatar: "👩‍🎨", status: "Pomodoro (22 dk)", camOn: true },
  { id: 7, name: "Oğuz A.", avatar: "🧑‍🎓", status: "Çalışıyor (30 dk)", camOn: true },
  { id: 8, name: "Deniz M.", avatar: "👩‍💻", status: "Çalışıyor (10 dk)", camOn: false },
];

export function VirtualStudyRooms() {
  const [activeRoom, setActiveRoom] = useState<StudyRoom | null>(null);
  const [isJoined, setIsJoined] = useState(false);
  const [camOn, setCamOn] = useState(false);
  const [micMuted, setMicMuted] = useState(true);

  const handleJoinRoom = (room: StudyRoom) => {
    setActiveRoom(room);
    setIsJoined(true);
  };

  const handleLeaveRoom = () => {
    setIsJoined(false);
    setActiveRoom(null);
  };

  return (
    <div className="bg-[#1E293B] border border-white/10 rounded-2xl p-6 shadow-xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-xl">
            👥
          </div>
          <div>
            <h3 className="font-black text-white text-base">7/24 Sanal Kütüphane & Çalışma Odaları</h3>
            <p className="text-xs text-slate-400 font-semibold mt-0.5">
              Türkiye'nin dört bir yanından öğrencilerle birlikte canlı, sessiz ve odaklanmış kütüphane deneyimi
            </p>
          </div>
        </div>

        {isJoined && (
          <button
            onClick={handleLeaveRoom}
            className="bg-red-600/80 hover:bg-red-600 text-white font-black text-xs px-4 py-2 rounded-xl transition"
          >
            🚪 Odadan Ayrıl
          </button>
        )}
      </div>

      {!isJoined ? (
        /* Room Selection List */
        <div className="grid md:grid-cols-2 gap-4">
          {STUDY_ROOMS.map((room) => (
            <div
              key={room.id}
              className={`bg-gradient-to-br ${room.gradient} border rounded-2xl p-5 shadow-lg space-y-4 hover:border-indigo-500/50 transition`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{room.icon}</span>
                  <div>
                    <h4 className="font-black text-white text-base">{room.name}</h4>
                    <span className="text-[10px] font-black text-indigo-400 uppercase tracking-wider block mt-0.5">
                      {room.category}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 px-2.5 py-1 rounded-full text-[10px] font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  <span>{room.activeStudents} Öğrenci Aktif</span>
                </div>
              </div>

              <p className="text-xs text-slate-300 font-semibold leading-relaxed">{room.description}</p>

              <div className="flex flex-wrap gap-1.5">
                {room.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[9px] font-bold bg-white/5 border border-white/10 text-slate-400 px-2.5 py-0.5 rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              <button
                onClick={() => handleJoinRoom(room)}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-2.5 rounded-xl text-xs transition shadow flex items-center justify-center gap-2"
              >
                <span>🚀 Çalışma Odasına Katıl</span>
              </button>
            </div>
          ))}
        </div>
      ) : (
        /* Active Joined Study Room View */
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 bg-[#0D1B35] p-4 rounded-2xl border border-indigo-500/30">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{activeRoom?.icon}</span>
              <div>
                <h4 className="font-black text-white text-base">{activeRoom?.name}</h4>
                <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Canlı Sesiz Çalışma Akışı Aktif
                </span>
              </div>
            </div>

            {/* User Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCamOn(!camOn)}
                className={`px-3 py-2 rounded-xl text-xs font-black border transition flex items-center gap-1.5 ${
                  camOn
                    ? "bg-emerald-600 text-white border-emerald-500"
                    : "bg-white/5 text-slate-300 border-white/10 hover:bg-white/10"
                }`}
              >
                <span>{camOn ? "📹 Kamera Açık" : "📷 Kamera Kapalı"}</span>
              </button>

              <button
                onClick={() => setMicMuted(!micMuted)}
                className={`px-3 py-2 rounded-xl text-xs font-black border transition flex items-center gap-1.5 ${
                  micMuted
                    ? "bg-red-500/20 text-red-400 border-red-500/30"
                    : "bg-emerald-600 text-white border-emerald-500"
                }`}
              >
                <span>{micMuted ? "🔇 Mikrofon Sessiz" : "🎙️ Mikrofon Açık"}</span>
              </button>
            </div>
          </div>

          {/* Grid of Participant Cards */}
          <div>
            <h5 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-3">
              Odadaki Odaklanmış Öğrenciler ({MOCK_PARTICIPANTS.length + 1})
            </h5>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {/* Me Card */}
              <div className="bg-gradient-to-br from-indigo-900/40 via-[#0D1B35] to-[#1E293B] border-2 border-indigo-500 rounded-2xl p-4 flex flex-col items-center justify-center relative shadow-lg">
                <span className="absolute top-2 right-2 text-[9px] font-black bg-indigo-500 text-white px-2 py-0.5 rounded-full">
                  SİZ
                </span>
                <div className="w-16 h-16 rounded-full bg-indigo-600/30 border border-indigo-400/40 flex items-center justify-center text-3xl mb-2">
                  {camOn ? "📹" : "🎓"}
                </div>
                <span className="font-black text-white text-xs">Sen (Aktif Odak)</span>
                <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1 mt-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Sessizce Çalışıyor
                </span>
              </div>

              {/* Other Participants */}
              {MOCK_PARTICIPANTS.map((p) => (
                <div
                  key={p.id}
                  className="bg-[#0D1B35] border border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center relative hover:bg-white/5 transition"
                >
                  <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-3xl mb-2">
                    {p.avatar}
                  </div>
                  <span className="font-black text-white text-xs truncate max-w-full">{p.name}</span>
                  <span className="text-[10px] text-indigo-400 font-bold mt-1">{p.status}</span>
                  {p.camOn && (
                    <span className="absolute top-2 left-2 text-[9px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5 rounded-full font-bold">
                      📹 Kamera
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
