"use client";

import { useEffect } from "react";

/**
 * Registers the service worker for offline cache.
 * Only runs in production (not on localhost to avoid dev cache issues).
 */
export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (
      typeof window === "undefined" ||
      !("serviceWorker" in navigator)
    ) {
      return;
    }

    // Skip on localhost in dev for easier debugging
    const isLocalhost =
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1";

    if (isLocalhost && process.env.NODE_ENV === "development") {
      return;
    }

    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/service-worker.js")
        .catch((err) => {
          console.warn("SW registration failed:", err);
        });
    });
  }, []);

  return null;
}
