/**
 * Daily.co REST API Yardımcısı
 * Ders odası oluşturma, öğretmen/öğrenci token'ı üretme ve oda silme.
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

export async function createDailyRoom(
  expirySeconds = 86400,
  record = false
): Promise<{ name: string; url: string }> {
  const exp = Math.floor(Date.now() / 1000) + (expirySeconds || 86400);

  const res = await fetch(`${DAILY_BASE}/rooms`, {
    method: "POST",
    headers: dailyHeaders(),
    body: JSON.stringify({
      properties: {
        exp,
        ...(record ? { enable_recording: "cloud" } : {}),
      },
    }),
  });

  if (!res.ok) {
    // Plan recording desteklemiyorsa sade oda ile tekrar dene
    const res2 = await fetch(`${DAILY_BASE}/rooms`, {
      method: "POST",
      headers: dailyHeaders(),
      body: JSON.stringify({ properties: { exp } }),
    });
    if (!res2.ok) {
      const err = await res2.text();
      throw new Error(`Daily.co createRoom hatası: ${err}`);
    }
    const data2 = await res2.json();
    return { name: data2.name as string, url: data2.url as string };
  }

  const data = await res.json();
  return { name: data.name as string, url: data.url as string };
}

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
      user_name: userName || (isOwner ? "Öğretmen" : "Öğrenci"),
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
    console.warn(`Daily.co token warning: ${err}`);
    return "";
  }

  const data = await res.json();
  return (data.token as string) || "";
}

export async function endDailyRoom(roomName: string): Promise<void> {
  await fetch(`${DAILY_BASE}/rooms/${roomName}`, {
    method: "DELETE",
    headers: dailyHeaders(),
  }).catch(() => null);
}
