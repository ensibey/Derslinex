"use client";
import { useEffect, useState } from "react";
import Script from "next/script";

const GA_ID = "G-J3JSE0GLD5";
export const CONSENT_KEY = "derslinex-cerez-onayi"; // "kabul" | "red"
export const CONSENT_EVENT = "derslinex-cerez-onayi-degisti";

export default function GoogleAnalytics() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    function tryLoad() {
      const consent = localStorage.getItem(CONSENT_KEY);
      if (consent === "kabul") {
        setLoaded(true);
      }
    }

    tryLoad();
    window.addEventListener(CONSENT_EVENT, tryLoad);
    return () => window.removeEventListener(CONSENT_EVENT, tryLoad);
  }, []);

  useEffect(() => {
    if (!loaded) return;

    (window as any).dataLayer = (window as any).dataLayer || [];
    function gtag(...args: unknown[]) {
      (window as any).dataLayer.push(args);
    }
    (window as any).gtag = gtag;
    gtag("js", new Date());
    gtag("config", GA_ID, { anonymize_ip: true });
  }, [loaded]);

  if (!loaded) return null;

  return (
    <Script
      src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
      strategy="afterInteractive"
    />
  );
}
