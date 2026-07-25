import type { Metadata } from "next";
import "./globals.css";
import "leaflet/dist/leaflet.css";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";

export const metadata: Metadata = {
  title: "CHINA TRIP 2026 | ШАНХАЙ → ПЕКИН",
  description:
    "Планирование поездки в Китай. 8 — 24 сентября 2026. Группа 5-6 человек.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="h-full">
      <body className="min-h-full">
        {children}
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
