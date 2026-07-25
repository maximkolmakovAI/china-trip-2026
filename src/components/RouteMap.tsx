"use client";

import { useState, useEffect, useRef } from "react";
import { ProgramDay } from "@/lib/types";

interface RouteMapProps {
  program: ProgramDay[];
}

interface City {
  id: string;
  name: string;
  x: number;
  y: number;
  days: number[];
  desc: string;
}

const CITIES: City[] = [
  { id: "shanghai", name: "Шанхай", x: 720, y: 540, days: [1,2,3,4,5,6,7,11], desc: "Прилёт 09.09 · Ночная жизнь · Бунд · Пудун" },
  { id: "ningbo", name: "Нинбо", x: 700, y: 590, days: [8], desc: "16.09 · Паром на заброшенную деревню" },
  { id: "hangzhou", name: "Ханчжоу", x: 670, y: 570, days: [9], desc: "17.09 · Озеро Сиху · Чайная деревня" },
  { id: "huangshan", name: "Хуаншань", x: 580, y: 520, days: [10], desc: "18.09 · Жёлтые горы · ЮНЕСКО" },
  { id: "beijing", name: "Пекин", x: 540, y: 300, days: [12,13,14,15,16], desc: "20-24.09 · Запретный город · Стена · Universal" },
];

const DAYS = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16];
const VISIBLE_CITIES: (string | null)[] = [
  null,null,null,null,null,null,null,
  "shanghai","shanghai","shanghai",
  "ningbo","hangzhou","huangshan",
  "shanghai",
  "beijing","beijing","beijing","beijing","beijing",
];

function cityAtDay(day: number): string {
  const idx = day - 1;
  if (idx >= 0 && idx < VISIBLE_CITIES.length && VISIBLE_CITIES[idx]) {
    return VISIBLE_CITIES[idx]!;
  }
  return "shanghai";
}

function interpolate(a: City, b: City, t: number) {
  return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
}

const DAY_CITIES = DAYS.map((d) => cityAtDay(d));
const CITY_ORDER = ["shanghai", "ningbo", "hangzhou", "huangshan", "beijing"];
const CITY_INDEX: Record<string, number> = { shanghai: 0, ningbo: 1, hangzhou: 2, huangshan: 3, beijing: 4 };

function segmentPositions(cities: City[]) {
  const segs: { from: City; to: City; fromIdx: number; toIdx: number }[] = [];
  for (let i = 0; i < cities.length - 1; i++) {
    segs.push({ from: cities[i], to: cities[i + 1], fromIdx: i, toIdx: i + 1 });
  }
  return segs;
}

export default function RouteMap({ program }: RouteMapProps) {
  const [day, setDay] = useState(1);
  const [playing, setPlaying] = useState(true);
  const [pickedCity, setPickedCity] = useState<City | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (playing) {
      timerRef.current = setInterval(() => {
        setDay((d) => (d >= 16 ? 1 : d + 1));
      }, 1200);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [playing]);

  const currentCityId = DAY_CITIES[day - 1];
  const currentCity = CITIES.find((c) => c.id === currentCityId)!;
  const currentCityIdx = CITY_INDEX[currentCityId];

  const segs = segmentPositions(CITIES);
  const totalSegs = segs.length;
  let posInDay = day;
  let foundSeg = { from: CITIES[0], to: CITIES[0], t: 0 };
  let segmentDay = 1;

  for (let s = 0; s < totalSegs; s++) {
    const segDays = CITIES[s + 1] ? 1 : 1;
    const segStart = s === 0 ? 1 : (() => {
      let cum = 1;
      for (let i = 0; i < s; i++) cum += 1;
      return cum;
    })();
    const segEnd = segStart;
    if (day >= segStart && day <= segEnd + 1) {
      foundSeg = { from: segs[s].from, to: segs[s].to, t: 0 };
      segmentDay = segStart;
      break;
    }
  }

  const progress = Math.min(1, (day - segmentDay) / 1);
  const figure = interpolate(foundSeg.from, foundSeg.to, progress);

  return (
    <section id="routemap" className="pt-28 -mt-16">
      <div className="flex items-center gap-4 mb-2">
        <h2 className="font-display text-4xl md:text-5xl text-accent-black tracking-tight">
          МАРШРУТ
        </h2>
        <span className="font-mono text-xs text-accent-pink font-bold border-2 border-accent-pink px-2 py-0.5">
          5 ГОРОДОВ
        </span>
      </div>
      <p className="font-mono text-sm text-text-secondary mb-6">
        Анимация перемещения группы по дням. Нажмите на город для деталей.
      </p>

      {/* Controls */}
      <div className="flex items-center gap-3 mb-5">
        <button
          onClick={() => setPlaying(!playing)}
          className="font-mono text-xs font-bold tracking-wider px-4 py-2 border-2 border-accent-black bg-accent-black text-bg-base hover:bg-accent-pink hover:border-accent-pink transition-colors"
        >
          {playing ? "❚❚ ПАУЗА" : "▶ ПУСК"}
        </button>
        <input
          type="range"
          min={1}
          max={16}
          value={day}
          onChange={(e) => { setDay(Number(e.target.value)); setPlaying(false); }}
          className="w-48 accent-accent-pink"
        />
        <span className="font-mono text-xs text-text-muted w-16">
          День {day}
        </span>
      </div>

      {/* Map */}
      <div className="brutal-card p-4 relative overflow-hidden">
        <svg viewBox="300 100 600 600" className="w-full h-auto" style={{ maxHeight: "70vh" }}>
          {/* Map background */}
          <rect x="300" y="100" width="600" height="600" fill="#EBE5D9" />

          {/* Simplified China outline */}
          <path
            d="M350,350 Q380,300 420,280 Q460,260 500,270 Q540,250 570,260 Q600,250 620,270 Q640,250 660,260 Q680,280 690,310 Q700,340 710,370 Q720,400 730,430 Q740,460 720,490 Q700,520 680,540 Q660,560 640,570 Q620,580 600,570 Q580,560 560,550 Q540,560 520,550 Q500,540 480,530 Q460,520 440,500 Q420,480 400,450 Q380,420 360,390 Z"
            fill="none"
            stroke="#1A1A1A"
            strokeWidth="2"
            opacity="0.15"
          />

          {/* Connecting lines */}
          {segs.map((seg, i) => {
            const isActive = day >= (seg.fromIdx === 0 ? 1 : seg.fromIdx + 8) && day <= (seg.toIdx + 8);
            return (
              <line
                key={i}
                x1={seg.from.x} y1={seg.from.y}
                x2={seg.to.x} y2={seg.to.y}
                stroke={isActive ? "#E50071" : "#1A1A1A"}
                strokeWidth={isActive ? 3 : 1}
                opacity={isActive ? 1 : 0.2}
              />
            );
          })}

          {/* Dashed route preview */}
          <path
            d="M720,540 L700,590 L670,570 L580,520 L540,300"
            fill="none"
            stroke="#E50071"
            strokeWidth="1"
            strokeDasharray="6,4"
            opacity="0.3"
          />

          {/* City markers */}
          {CITIES.map((city) => {
            const hasActivity = city.days.includes(day);
            const isActive = city.id === currentCityId;
            return (
              <g key={city.id} onClick={() => setPickedCity(pickedCity?.id === city.id ? null : city)}
                style={{ cursor: "pointer" }}>
                <circle
                  cx={city.x} cy={city.y} r={isActive ? 16 : 10}
                  fill={isActive ? "#E50071" : "#1A1A1A"}
                  stroke={hasActivity ? "#E50071" : "#1A1A1A"}
                  strokeWidth={3}
                  opacity={hasActivity ? 1 : 0.5}
                />
                <circle
                  cx={city.x} cy={city.y} r={isActive ? 22 : 14}
                  fill="none"
                  stroke={isActive ? "#E50071" : "none"}
                  strokeWidth={2}
                  opacity={isActive ? 0.4 : 0}
                />
                <text x={city.x} y={city.y - 18} textAnchor="middle"
                  fontFamily="'Courier New', monospace" fontSize="11" fontWeight="bold"
                  fill={isActive ? "#E50071" : "#1A1A1A"}>
                  {city.name}
                </text>
              </g>
            );
          })}

          {/* Animated figure */}
          <g>
            <circle
              cx={currentCity.x} cy={currentCity.y - 30}
              r={8}
              fill="#E50071"
              stroke="#1A1A1A"
              strokeWidth="2"
            >
              <animate attributeName="cy" values={`${currentCity.y - 30};${currentCity.y - 36};${currentCity.y - 30}`}
                dur="0.8s" repeatCount="indefinite" />
            </circle>
            <text x={currentCity.x} y={currentCity.y - 34} textAnchor="middle"
              fontFamily="'Courier New', monospace" fontSize="7" fill="white" fontWeight="bold">
              {day}
            </text>
          </g>

          {/* Compass */}
          <g transform="translate(820, 140)">
            <circle cx="0" cy="0" r="20" fill="none" stroke="#1A1A1A" strokeWidth="1" />
            <text x="0" y="-12" textAnchor="middle" fontFamily="monospace" fontSize="10" fill="#E50071" fontWeight="bold">N</text>
            <line x1="0" y1="5" x2="0" y2="-8" stroke="#E50071" strokeWidth="2" />
            <line x1="0" y1="0" x2="0" y2="8" stroke="#1A1A1A" strokeWidth="1" opacity="0.3" />
            <line x1="-8" y1="0" x2="8" y2="0" stroke="#1A1A1A" strokeWidth="1" opacity="0.3" />
          </g>
        </svg>

        {/* Info panel */}
        {pickedCity && (
          <div className="absolute bottom-4 left-4 right-4 bg-surface border-3 border-accent-black p-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-display text-xl text-accent-black">{pickedCity.name}</h3>
                <p className="font-mono text-xs text-text-muted mt-1">{pickedCity.desc}</p>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {pickedCity.days.map((d) => (
                    <button
                      key={d}
                      onClick={() => { setDay(d); setPlaying(false); }}
                      className={`font-mono text-[10px] font-bold px-2 py-0.5 border-2 ${
                        d === day
                          ? "bg-accent-pink text-white border-accent-black"
                          : "border-accent-black hover:bg-accent-black hover:text-bg-base"
                      }`}
                    >
                      День {d}
                    </button>
                  ))}
                </div>
              </div>
              <button
                onClick={() => setPickedCity(null)}
                className="font-mono text-xs font-bold border-2 border-accent-black px-2 py-1 hover:bg-accent-black hover:text-bg-base"
              >
                ✕
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mt-4 font-mono text-[10px] text-text-muted">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-accent-pink border border-accent-black" /> Текущий город
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-accent-black" /> Остановка
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-6 h-0 border-b border-dashed border-accent-pink" /> Маршрут
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-6 h-0 border-b border-accent-pink" /> Активный сегмент
        </span>
      </div>
    </section>
  );
}
