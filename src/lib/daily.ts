/**
 * Kesintisiz Canlı Ders Video Odası Yardımcısı
 * Daily.co REST API Entegrasyonu & Fallback Desteği
 */

const DAILY_API_KEY = process.env.DAILY_API_KEY;
const DAILY_API_BASE = process.env.DAILY_API_BASE || "https://api.daily.co/v1";

export async function createDailyRoom(
  expirySeconds: number = 86400,
  record = false
): Promise<{ name: string; url: string }> {
  const roomName = `Derslinex-Session-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

  if (DAILY_API_KEY) {
    try {
      const exp = Math.floor(Date.now() / 1000) + expirySeconds;
      const res = await fetch(`${DAILY_API_BASE}/rooms`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${DAILY_API_KEY}`,
        },
        body: JSON.stringify({
          name: roomName.toLowerCase(),
          privacy: "private",
          properties: {
            exp,
            enable_chat: true,
            enable_screenshare: true,
            enable_recording: record ? "cloud" : "none",
          },
        }),
      });

      if (res.ok) {
        const data = await res.json();
        return { name: data.name, url: data.url };
      }
    } catch (err) {
      console.warn("Daily.co oda oluşturma hatası, fallback uygulanıyor:", err);
    }
  }

  // Fallback: Public Jitsi/Element web meeting
  const roomUrl = `https://meet.element.io/${roomName}`;
  return { name: roomName, url: roomUrl };
}

export async function getDailyMeetingToken(
  roomName: string,
  isOwner: boolean,
  userId: string,
  userName: string,
  ejectAt: number
): Promise<string> {
  if (DAILY_API_KEY) {
    try {
      const res = await fetch(`${DAILY_API_BASE}/meeting-tokens`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${DAILY_API_KEY}`,
        },
        body: JSON.stringify({
          properties: {
            room_name: roomName.toLowerCase(),
            is_owner: isOwner,
            user_name: userName,
            user_id: userId,
            exp: ejectAt,
          },
        }),
      });

      if (res.ok) {
        const data = await res.json();
        return data.token || "";
      }
    } catch (err) {
      console.warn("Daily.co token alma hatası:", err);
    }
  }

  return "";
}

export async function endDailyRoom(roomName: string): Promise<void> {
  if (DAILY_API_KEY) {
    try {
      await fetch(`${DAILY_API_BASE}/rooms/${roomName.toLowerCase()}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${DAILY_API_KEY}`,
        },
      });
    } catch (err) {
      console.warn("Daily.co oda silme hatası:", err);
    }
  }
}
