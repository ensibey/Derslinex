import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "YKS & LGS Çalışma Pomodoro Sayacı — Zaman Yönetimi",
  description: "25+5 dakika Pomodoro tekniğiyle ders çalışırken odaklanmanızı artırın, sınav hazırlığında zamanı verimli yönetin.",
};

export default function PomodoroSayaciLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
