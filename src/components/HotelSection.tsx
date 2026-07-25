"use client";

import { useState } from "react";
import { Hotel, HotelTag } from "@/lib/types";
import HotelCard from "./HotelCard";
import Leaderboard from "./Leaderboard";
import FilterBar from "./FilterBar";

interface HotelSectionProps {
  shanghai: Hotel[];
  beijing: Hotel[];
}

export default function HotelSection({ shanghai, beijing }: HotelSectionProps) {
  const [city, setCity] = useState<"shanghai" | "beijing">("shanghai");
  const [filter, setFilter] = useState<HotelTag | null>(null);

  const hotels = city === "shanghai" ? shanghai : beijing;
  const filtered = filter
    ? hotels.filter((h) => h.tags.includes(filter))
    : hotels;
  const allHotels = [...shanghai, ...beijing];

  return (
    <section id="hotels" className="pt-28 -mt-16">
      <div className="mb-10">
        <div className="flex items-center gap-4 mb-2">
          <h2 className="font-display text-4xl md:text-5xl text-accent-black tracking-tight">
            ОТЕЛИ
          </h2>
          <span className="font-mono text-xs text-accent-pink font-bold border-2 border-accent-pink px-2 py-0.5">
            {city === "shanghai" ? "ШАНХАЙ" : "ПЕКИН"} · {hotels.length}
          </span>
        </div>
        <p className="font-mono text-sm text-text-secondary">
          Выберите отель для каждой локации. Голосуйте за понравившиеся варианты.
        </p>
      </div>

      <Leaderboard hotels={allHotels} />

      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => setCity("shanghai")}
          className={`px-5 py-2 font-mono text-xs font-bold tracking-wider border-2 transition-all duration-150 ${
            city === "shanghai"
              ? "bg-accent-black text-bg-base border-accent-black"
              : "bg-transparent text-accent-black border-accent-black hover:bg-accent-black hover:text-bg-base"
          }`}
        >
          ШАНХАЙ ({shanghai.length})
        </button>
        <button
          onClick={() => setCity("beijing")}
          className={`px-5 py-2 font-mono text-xs font-bold tracking-wider border-2 transition-all duration-150 ${
            city === "beijing"
              ? "bg-accent-black text-bg-base border-accent-black"
              : "bg-transparent text-accent-black border-accent-black hover:bg-accent-black hover:text-bg-base"
          }`}
        >
          ПЕКИН ({beijing.length})
        </button>
      </div>

      <div className="mb-6">
        <FilterBar active={filter} onChange={setFilter} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((hotel, i) => (
          <HotelCard key={hotel.id} hotel={hotel} index={i} city={city} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 border-3 border-accent-black">
          <p className="font-mono text-sm text-text-muted">Нет отелей с таким фильтром</p>
        </div>
      )}
    </section>
  );
}
