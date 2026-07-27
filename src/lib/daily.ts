/**
 * Daily.co REST API yardımcısı
 * Ders odası oluşturma, token üretme ve oda silme işlemlerini kapsar.
 */
const DAILY_BASE = process.env.DAILY_API_BASE || "https://api.daily.co/v1";

function getDailyKey(): string {
  const raw = process.env.DAILY_API_KEY || "a8e51bc26699bca3a015727f92d5dbf43ccef195cfacff77d8ce376c18534ee2";
  return raw.trim().split(/\s+/)[0];
}

function dailyHeaders() {
  return {
    Authorization: `Bearer ${getDailyKey()}`,
    "Content-Type": "application/json",
  };
}

/**
 * Daily.co'da yeni bir ders odası oluşturur.
 * @param expirySeconds  Odanın ne kadar süre sonra otomatik kapanacağı (saniye)
 * @param record         Ders kaydedilsin mi?
 */
export async function createDailyRoom(
  expirySeconds: number,
  record = false
): Promise<{ name: string; url: string }> {
  const body = {
    properties: {
      max_participants: 20,
      enable_prejoin_ui: false,
      enable_knocking: false,
      exp: Math.floor(Date.now() / 1000) + expirySeconds,
      enable_recording: record ? "cloud" : "none",
      start_audio_off: false,
      start_video_off: false,
    },
  };

  const res = await fetch(`${DAILY_BASE}/rooms`, {
    method: "POST",
    headers: dailyHeaders(),
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Daily.co createRoom hatası: ${err}`);
  }

  const data = await res.json();
  return { name: data.name as string, url: data.url as string };
}

/**
 * Kullanıcı için Daily.co meeting token üretir.
 * @param roomName  Odanın adı
 * @param isOwner   Öğretmen ise true (odayı bitirebilir)
 * @param userId    Veritabanındaki kullanıcı ID'si (string olarak)
 * @param userName  Ekranda görünecek ad
 * @param ejectAt   Token geçerlilik bitiş zamanı (Unix timestamp saniye)
 */
export async function getDailyMeetingToken(
  roomName: string,
  isOwner: boolean,
  userId: string,
  userName: string,
  ejectAt: number
): Promise<string> {
  const body = {
    properties: {
      room_name: roomName,
      is_owner: isOwner,
      user_name: userName,
      user_id: userId,
      eject_at_room_exp: true,
      exp: ejectAt,
    },
  };

  const res = await fetch(`${DAILY_BASE}/meeting-tokens`, {
    method: "POST",
    headers: dailyHeaders(),
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Daily.co token hatası: ${err}`);
  }

  const data = await res.json();
  return data.token as string;
}

/**
 * Odayı siler / herkesi çıkarır (ders bitişi).
 */
export async function endDailyRoom(roomName: string): Promise<void> {
  await fetch(`${DAILY_BASE}/rooms/${roomName}`, {
    method: "DELETE",
    headers: dailyHeaders(),
  });
}
