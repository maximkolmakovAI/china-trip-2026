"use client";

import { useState } from "react";
import { Hotel, TAG_LABELS, HotelTag } from "@/lib/types";
import tripData from "@/data/data.json";

const allHotels: Hotel[] = [
  ...(tripData as { hotels: { shanghai: Hotel[]; beijing: Hotel[] } }).hotels.shanghai,
  ...(tripData as { hotels: { shanghai: Hotel[]; beijing: Hotel[] } }).hotels.beijing,
];

const cityOrder = ["shanghai", "beijing"];

export default function HotelComparison() {
  const [selected, setSelected] = useState<string[]>([allHotels[0]?.id || "", allHotels[3]?.id || ""]);

  const toggle = (id: string) => {
    if (selected.includes(id)) {
      if (selected.length <= 2) return;
      setSelected(selected.filter((s) => s !== id));
    } else {
      if (selected.length >= 3) return;
      setSelected([...selected, id]);
    }
  };

  const compareHotels = selected.map((id) => allHotels.find((h) => h.id === id)).filter(Boolean) as Hotel[];

  return (
    <section className="pt-16 -mt-4">
      <div className="flex items-center gap-4 mb-2">
        <h2 className="font-display text-4xl md:text-5xl text-accent-black tracking-tight">
          СРАВНЕНИЕ
        </h2>
        <span className="font-mono text-xs text-accent-pink font-bold border-2 border-accent-pink px-2 py-0.5">
          ОТЕЛЕЙ
        </span>
      </div>
      <p className="font-mono text-sm text-text-secondary mb-6">
        Выберите 2-3 отеля для сравнения. Нажмите на отель в списке, чтобы добавить/убрать.
      </p>

      {/* Hotel picker */}
      <div className="flex flex-wrap gap-2 mb-6">
        {allHotels.map((hotel) => {
          const isSelected = selected.includes(hotel.id);
          return (
            <button
              key={hotel.id}
              onClick={() => toggle(hotel.id)}
              className={`font-mono text-xs font-bold tracking-wider px-3 py-2 border-2 transition-all ${
                isSelected
                  ? "bg-accent-pink text-white border-accent-black"
                  : "border-accent-black hover:bg-accent-black hover:text-bg-base"
              }`}
            >
              {hotel.name}
            </button>
          );
        })}
      </div>

      {compareHotels.length >= 2 && (
        <div className="brutal-card overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b-3 border-accent-black bg-bg-secondary">
                <th className="p-3 font-mono text-xs tracking-wider w-32">ПАРАМЕТР</th>
                {compareHotels.map((h) => (
                  <th key={h.id} className="p-3 font-mono text-xs font-bold">{h.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-accent-black/20">
                <td className="p-3 font-mono text-xs text-text-muted">ЛОКАЦИЯ</td>
                {compareHotels.map((h) => (
                  <td key={h.id} className="p-3 font-mono text-sm">{h.district}</td>
                ))}
              </tr>
              <tr className="border-b border-accent-black/20 bg-bg-secondary/50">
                <td className="p-3 font-mono text-xs text-text-muted">ЦЕНА</td>
                {compareHotels.map((h) => (
                  <td key={h.id} className={`p-3 font-display text-lg ${h.price === Math.min(...compareHotels.map((x) => x.price || 999999)) ? "text-accent-pink" : ""}`}>
                    {h.price ? `${h.price.toLocaleString()} ₽` : "—"}
                  </td>
                ))}
              </tr>
              <tr className="border-b border-accent-black/20">
                <td className="p-3 font-mono text-xs text-text-muted">ТЕГИ</td>
                {compareHotels.map((h) => (
                  <td key={h.id} className="p-3">
                    <div className="flex flex-wrap gap-1">
                      {h.tags.map((tag) => (
                        <span key={tag} className="brutal-tag text-[9px]">{TAG_LABELS[tag as HotelTag]}</span>
                      ))}
                    </div>
                  </td>
                ))}
              </tr>
              <tr className="border-b border-accent-black/20 bg-bg-secondary/50">
                <td className="p-3 font-mono text-xs text-text-muted">КОНЦЕПЦИЯ</td>
                {compareHotels.map((h) => (
                  <td key={h.id} className="p-3 font-mono text-xs text-text-secondary leading-relaxed">{h.concept}</td>
                ))}
              </tr>
              <tr className="border-b border-accent-black/20">
                <td className="p-3 font-mono text-xs text-text-muted">ПЛЮСЫ</td>
                {compareHotels.map((h) => (
                  <td key={h.id} className="p-3">
                    <div className="space-y-0.5">
                      {h.pros.map((p, i) => (
                        <div key={i} className="flex items-start gap-1">
                          <span className="text-accent-pink font-bold text-xs">+</span>
                          <span className="font-mono text-[11px] text-text-secondary">{p}</span>
                        </div>
                      ))}
                    </div>
                  </td>
                ))}
              </tr>
              <tr className="bg-bg-secondary/50">
                <td className="p-3 font-mono text-xs text-text-muted">ССЫЛКА</td>
                {compareHotels.map((h) => (
                  <td key={h.id} className="p-3">
                    <a href={h.link} target="_blank" rel="noopener noreferrer"
                      className="font-mono text-xs font-bold border-2 border-accent-black px-2 py-1 hover:bg-accent-black hover:text-bg-base transition-colors inline-block">
                      TRIP.COM →
                    </a>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {compareHotels.length < 2 && (
        <div className="text-center py-12 border-3 border-accent-black">
          <p className="font-mono text-sm text-text-muted">Выберите хотя бы 2 отеля для сравнения</p>
        </div>
      )}
    </section>
  );
}
