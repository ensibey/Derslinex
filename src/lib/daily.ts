/**
 * Jitsi Meet Video Odası Yardımcısı
 * %100 Ücretsiz, Kredi Kartı veya API Anahtarı Gerektirmez.
 * Sınırsız Süre, Ekran Paylaşımı ve Çoklu Katılımcı Desteği.
 */

export async function createDailyRoom(
  _expirySeconds?: number,
  _record = false
): Promise<{ name: string; url: string }> {
  const roomName = `Derslinex-Session-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const roomUrl  = `https://meet.jit.si/${roomName}`;
  return { name: roomName, url: roomUrl };
}

export async function getDailyMeetingToken(
  _roomName: string,
  _isOwner: boolean,
  _userId: string,
  _userName: string,
  _ejectAt: number
): Promise<string> {
  return "";
}

export async function endDailyRoom(_roomName: string): Promise<void> {
  // Jitsi Meet odaları katılımcılar çıkınca otomatik sonlanır
}
