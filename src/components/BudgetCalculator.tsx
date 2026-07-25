"use client";

import { useState, useEffect } from "react";
import { useUser } from "@/lib/useUser";
import { Hotel } from "@/lib/types";
import tripData from "@/data/data.json";

interface Selection {
  hotelId: string;
  nights: number;
  rooms: number;
}

const allHotels: Hotel[] = [
  ...(tripData as { hotels: { shanghai: Hotel[]; beijing: Hotel[] } }).hotels.shanghai,
  ...(tripData as { hotels: { shanghai: Hotel[]; beijing: Hotel[] } }).hotels.beijing,
];

function storageKey(userId: string) { return `china_trip_budget_${userId}`; }

export default function BudgetCalculator() {
  const { user } = useUser();
  const userId = user?.name || "anonymous";
  const [people, setPeople] = useState(6);
  const [selections, setSelections] = useState<Selection[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem(storageKey(userId));
      if (raw) {
        setSelections(JSON.parse(raw));
        setLoaded(true);
        return;
      }
    } catch {}
    const defaults: Selection[] = allHotels.map((h) => ({
      hotelId: h.id,
      nights: 1,
      rooms: 2,
    }));
    setSelections(defaults);
    setLoaded(true);
  }, [userId]);

  useEffect(() => {
    if (loaded) {
      try { localStorage.setItem(storageKey(userId), JSON.stringify(selections)); } catch {}
    }
  }, [selections, loaded, userId]);

  const update = (hotelId: string, field: keyof Selection, value: number) => {
    setSelections((prev) =>
      prev.map((s) => (s.hotelId === hotelId ? { ...s, [field]: value } : s))
    );
  };

  const getHotel = (id: string) => allHotels.find((h) => h.id === id);

  const total = selections.reduce((sum, sel) => {
    const hotel = getHotel(sel.hotelId);
    return sum + (hotel?.price || 0) * sel.nights * sel.rooms;
  }, 0);

  const totalNights = selections.reduce((s, sel) => s + sel.nights, 0);

  if (!loaded) return null;

  return (
    <section id="budget" className="pt-28 -mt-16">
      <div className="flex items-center gap-4 mb-2">
        <h2 className="font-display text-4xl md:text-5xl text-accent-black tracking-tight">
          БЮДЖЕТ
        </h2>
        <span className="font-mono text-xs text-accent-pink font-bold border-2 border-accent-pink px-2 py-0.5">
          КАЛЬКУЛЯТОР
        </span>
      </div>
      <p className="font-mono text-sm text-text-secondary mb-6">
        Рассчитайте стоимость проживания. Настройте количество ночей и комнат.
      </p>

      {/* People selector */}
      <div className="flex items-center gap-3 mb-6">
        <span className="font-mono text-xs text-text-muted tracking-wider">ЧЕЛОВЕК:</span>
        {[5, 6, 7].map((n) => (
          <button
            key={n}
            onClick={() => setPeople(n)}
            className={`font-mono text-sm font-bold px-4 py-2 border-2 transition-all ${
              people === n
                ? "bg-accent-black text-bg-base border-accent-black"
                : "border-accent-black hover:bg-accent-black hover:text-bg-base"
            }`}
          >
            {n}
          </button>
        ))}
      </div>

      {/* Hotels table */}
      <div className="brutal-card overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b-3 border-accent-black bg-bg-secondary">
              <th className="p-3 font-mono text-xs tracking-wider">ОТЕЛЬ</th>
              <th className="p-3 font-mono text-xs tracking-wider">ЦЕНА/НОЧЬ</th>
              <th className="p-3 font-mono text-xs tracking-wider">НОЧЕЙ</th>
              <th className="p-3 font-mono text-xs tracking-wider">КОМНАТ</th>
              <th className="p-3 font-mono text-xs tracking-wider text-right">ИТОГО</th>
            </tr>
          </thead>
          <tbody>
            {selections.map((sel) => {
              const hotel = getHotel(sel.hotelId);
              if (!hotel) return null;
              const subtotal = (hotel.price || 0) * sel.nights * sel.rooms;
              return (
                <tr key={sel.hotelId} className="border-b border-accent-black/20 hover:bg-bg-secondary transition-colors">
                  <td className="p-3">
                    <span className="font-mono text-xs font-bold text-accent-black">{hotel.name}</span>
                    <span className="font-mono text-[10px] text-text-muted block">{hotel.district}</span>
                  </td>
                  <td className="p-3 font-mono text-sm font-bold">{hotel.price?.toLocaleString()} ₽</td>
                  <td className="p-3">
                    <input
                      type="number"
                      min={1}
                      max={10}
                      value={sel.nights}
                      onChange={(e) => update(sel.hotelId, "nights", Math.max(1, Number(e.target.value)))}
                      className="w-16 p-1 border-2 border-accent-black font-mono text-sm text-center bg-surface"
                    />
                  </td>
                  <td className="p-3">
                    <input
                      type="number"
                      min={1}
                      max={6}
                      value={sel.rooms}
                      onChange={(e) => update(sel.hotelId, "rooms", Math.max(1, Number(e.target.value)))}
                      className="w-16 p-1 border-2 border-accent-black font-mono text-sm text-center bg-surface"
                    />
                  </td>
                  <td className="p-3 font-mono text-sm font-bold text-right">{subtotal.toLocaleString()} ₽</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="brutal-card bg-accent-black text-bg-base mt-4 p-5">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <div className="font-mono text-[10px] text-bg-base/50 tracking-wider">ВСЕГО НОЧЕЙ</div>
            <div className="font-display text-2xl">{totalNights}</div>
          </div>
          <div>
            <div className="font-mono text-[10px] text-bg-base/50 tracking-wider">ВСЕГО</div>
            <div className="font-display text-2xl text-accent-pink">{total.toLocaleString()} ₽</div>
          </div>
          <div>
            <div className="font-mono text-[10px] text-bg-base/50 tracking-wider">НА ЧЕЛОВЕКА</div>
            <div className="font-display text-2xl">{(total / people).toLocaleString()} ₽</div>
          </div>
          <div>
            <div className="font-mono text-[10px] text-bg-base/50 tracking-wider">ЗА НОЧЬ НА КОМНАТУ</div>
            <div className="font-display text-2xl">{Math.round(total / totalNights || 0).toLocaleString()} ₽</div>
          </div>
        </div>
      </div>
    </section>
  );
}
