"use client";

import { useCallback } from "react";
import { ProgramDay, Hotel } from "@/lib/types";
import tripData from "@/data/data.json";

interface ExportPdfProps {
  program: ProgramDay[];
}

export default function ExportPdf({ program }: ExportPdfProps) {
  const handlePrint = useCallback(() => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const allHotels: Hotel[] = [
      ...(tripData as { hotels: { shanghai: Hotel[]; beijing: Hotel[] } }).hotels.shanghai,
      ...(tripData as { hotels: { shanghai: Hotel[]; beijing: Hotel[] } }).hotels.beijing,
    ];

    const hotelRows = allHotels.map((h) => `
      <tr>
        <td style="border:1px solid #000;padding:6px 10px;font-family:monospace;font-size:12px">${h.name}</td>
        <td style="border:1px solid #000;padding:6px 10px;font-family:monospace;font-size:12px">${h.district}</td>
        <td style="border:1px solid #000;padding:6px 10px;font-family:monospace;font-size:12px">${h.price ? "¥" + h.price : "—"}</td>
        <td style="border:1px solid #000;padding:6px 10px;font-family:monospace;font-size:12px">${h.tags.join(", ")}</td>
      </tr>
    `).join("");

    const programDays = program.map((d) => `
      <div style="page-break-inside:avoid;margin-bottom:16px;border:2px solid #000;padding:12px;background:#fff">
        <div style="display:flex;align-items:baseline;gap:12px;margin-bottom:8px">
          <span style="font-size:18px;font-weight:900;text-transform:uppercase">День ${d.day}</span>
          <span style="font-family:monospace;font-size:11px;color:#666">${d.date} · ${d.weekday}</span>
          <span style="font-family:monospace;font-size:10px;padding:2px 6px;border:1px solid #000">${d.city}</span>
        </div>
        <ul style="margin:0;padding-left:20px">
          ${d.items.map((i) => `<li style="font-size:12px;margin-bottom:4px;${i.done ? 'text-decoration:line-through;color:#999' : ''}">${i.text}</li>`).join("")}
        </ul>
        ${d.notes ? `<p style="font-family:monospace;font-size:10px;color:#666;margin-top:8px;padding-top:8px;border-top:1px solid #ddd">⚡ ${d.notes}</p>` : ""}
      </div>
    `).join("");

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>China Trip 2026 — Программа</title>
        <style>
          @page { margin: 15mm; }
          * { box-sizing: border-box; }
          body { background: #F5F0EB; color: #1A1A1A; font-family: system-ui, sans-serif; padding: 20px; }
          h1 { font-size: 28px; font-weight: 900; text-transform: uppercase; letter-spacing: -1px; margin-bottom: 4px; }
          h2 { font-size: 14px; font-weight: 700; text-transform: uppercase; margin: 24px 0 12px; border-bottom: 3px solid #000; padding-bottom: 4px; }
          .meta { font-family: monospace; font-size: 11px; color: #666; margin-bottom: 20px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          th { background: #1A1A1A; color: #F5F0EB; border: 1px solid #000; padding: 6px 10px; font-family: monospace; font-size: 11px; text-align: left; }
          .pink { color: #E50071; }
          @media print {
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <button class="no-print" onclick="window.print()" style="font-family:monospace;font-size:12px;font-weight:bold;padding:8px 16px;border:2px solid #000;background:#E50071;color:#fff;cursor:pointer;margin-bottom:20px">🖨 РАСПЕЧАТАТЬ / PDF</button>
        <button class="no-print" onclick="window.close()" style="font-family:monospace;font-size:12px;padding:8px 16px;border:2px solid #000;background:#fff;cursor:pointer;margin-bottom:20px;margin-left:8px">✕ ЗАКРЫТЬ</button>

        <h1>CHINA TRIP 2026</h1>
        <div class="meta">08 · 09 · 2026 → 24 · 09 · 2026 · 6 человек</div>

        <h2>ОТЕЛИ</h2>
        <table>
          <thead>
            <tr><th>Название</th><th>Район</th><th>Цена</th><th>Теги</th></tr>
          </thead>
          <tbody>${hotelRows}</tbody>
        </table>

        <h2>ПРОГРАММА ПО ДНЯМ</h2>
        ${programDays}

        <div class="meta" style="margin-top:30px;text-align:center">
          Сделано с ❤️ для группы · china-trip.vercel.app
        </div>
      </body>
      </html>
    `);
    printWindow.document.close();
  }, [program]);

  return (
    <section id="export" className="pt-28 -mt-16">
      <div className="flex items-center gap-4 mb-2">
        <h2 className="font-display text-4xl md:text-5xl text-accent-black tracking-tight">
          ЭКСПОРТ
        </h2>
        <span className="font-mono text-xs text-accent-pink font-bold border-2 border-accent-pink px-2 py-0.5">
          PDF
        </span>
      </div>
      <p className="font-mono text-sm text-text-secondary mb-6">
        Скачайте программу поездки как PDF или распечатайте.
      </p>
      <div className="brutal-card p-6">
        <p className="font-mono text-xs text-text-secondary mb-4">
          В PDF войдут: все отели (с ценами и тегами), программа по 16 дням с чек-листами.
        </p>
        <button onClick={handlePrint}
          className="font-mono text-sm font-bold tracking-wider px-6 py-3 border-2 border-accent-black bg-accent-pink text-white hover:bg-accent-black transition-colors">
          📄 ОТКРЫТЬ PDF
        </button>
        <p className="font-mono text-[10px] text-text-muted mt-3">
          Откроется новая вкладка → нажмите Ctrl+P / Cmd+P → Сохранить как PDF
        </p>
      </div>
    </section>
  );
}
