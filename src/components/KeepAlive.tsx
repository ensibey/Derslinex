"use client";
import { useEffect } from "react";

export default function KeepAlive() {
  useEffect(() => {
    const keepAlivePing = () => {
      const url = window.location.origin;
      fetch(url, { mode: "no-cors", cache: "no-store" })
        .then(() => console.log("Render keep-alive ping successful"))
        .catch((err) => console.warn("Render keep-alive ping failed:", err));
    };

    const initialTimeout = setTimeout(keepAlivePing, 10000);
    const interval = setInterval(keepAlivePing, 14 * 60 * 1000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, []);

  return null;
}
