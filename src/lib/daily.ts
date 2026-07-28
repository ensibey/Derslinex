/**
 * Kesintisiz Canlı Ders Video Odası Yardımcısı
 * Sıfır Giriş, Sıfır Kredi Kartı, Sıfır Moderatör Kilidi.
 * Öğretmen ve Öğrenci Doğrudan Kamerası Açık Derse Girer.
 */

export async function createDailyRoom(
  _expirySeconds?: number,
  _record = false
): Promise<{ name: string; url: string }> {
  const roomName = `Derslinex-Session-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  // meet.element.io / 8x8 üzerinde moderatör girişi veya Google şifresi istenmez
  const roomUrl  = `https://meet.element.io/${roomName}`;
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
  // Odalar katılımcılar çıkınca otomatik sonlanır
}
