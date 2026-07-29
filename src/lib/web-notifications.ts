/**
 * Native Browser Web Push Notification Helper for Derslinex
 */

export function isNotificationSupported(): boolean {
  return typeof window !== "undefined" && "Notification" in window;
}

export function getNotificationPermission(): NotificationPermission | "unsupported" {
  if (!isNotificationSupported()) return "unsupported";
  return Notification.permission;
}

export async function requestNotificationPermission(): Promise<boolean> {
  if (!isNotificationSupported()) return false;

  try {
    const permission = await Notification.requestPermission();
    return permission === "granted";
  } catch (err) {
    console.error("Notification permission error:", err);
    return false;
  }
}

export function showWebNotification(
  title: string,
  options?: {
    body?: string;
    icon?: string;
    tag?: string;
    data?: any;
    onClickUrl?: string;
  }
): void {
  if (!isNotificationSupported() || Notification.permission !== "granted") {
    return;
  }

  try {
    const notification = new Notification(title, {
      body: options?.body || "Derslinex canlı ders bildiriminiz bulunmaktadır.",
      icon: options?.icon || "/logo.png",
      tag: options?.tag,
      data: options?.data,
    });

    notification.onclick = function (e) {
      e.preventDefault();
      window.focus();
      if (options?.onClickUrl) {
        window.location.href = options.onClickUrl;
      }
      notification.close();
    };
  } catch (err) {
    console.error("Web notification show error:", err);
  }
}

// Background session monitor checking live sessions and notifying 15 mins before
const notifiedSessions = new Set<string>();

export function checkAndNotifySessions(sessions: any[]): void {
  if (!isNotificationSupported() || Notification.permission !== "granted") return;
  if (!sessions || sessions.length === 0) return;

  const nowMs = Date.now();

  for (const session of sessions) {
    if (session.status === "ENDED" || session.status === "CANCELLED") continue;

    const startMs = new Date(session.startTime).getTime();
    const diffMs = startMs - nowMs;
    const diffMins = Math.floor(diffMs / 60_000);

    const notifKey15 = `notif_15m_${session.id}`;
    const notifKeyNow = `notif_now_${session.id}`;

    // 15 minutes before reminder
    if (diffMins <= 15 && diffMins > 0 && !notifiedSessions.has(notifKey15) && !sessionStorage.getItem(notifKey15)) {
      notifiedSessions.add(notifKey15);
      sessionStorage.setItem(notifKey15, "true");

      showWebNotification(`⏰ Canlı Ders Hatırlatması: 15 Dk Kaldı!`, {
        body: `"${session.title}" dersiniz ${diffMins} dakika sonra başlayacaktır. Derse katılmak için tıklayın!`,
        icon: "/logo.png",
        onClickUrl: `/ders/${session.id}`,
      });
    }

    // Live NOW notification
    if (diffMins <= 0 && diffMins >= -10 && !notifiedSessions.has(notifKeyNow) && !sessionStorage.getItem(notifKeyNow)) {
      notifiedSessions.add(notifKeyNow);
      sessionStorage.setItem(notifKeyNow, "true");

      showWebNotification(`🔴 CANLI DERS BAŞLADI!`, {
        body: `"${session.title}" dersi şu anda başladı! Katılmak için tıklayın.`,
        icon: "/logo.png",
        onClickUrl: `/ders/${session.id}`,
      });
    }
  }
}
