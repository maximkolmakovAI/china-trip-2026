"use client";

import { useState } from "react";
import { ProgramDay } from "@/lib/types";

interface CityWeather {
  name: string;
  temps: string;
  cond: string;
  humidity: string;
  rain: string;
  advice: string;
}

const WEATHER: Record<string, CityWeather> = {
  shanghai: {
    name: "ШАНХАЙ",
    temps: "+24°C…+30°C",
    cond: "Ясно / переменная облачность",
    humidity: "70-80%",
    rain: "3-4 дня с дождём",
    advice: "Лёгкая одежда, зонт. Вечером может быть ветрено у реки.",
  },
  beijing: {
    name: "ПЕКИН",
    temps: "+16°C…+26°C",
    cond: "Ясно / сухо",
    humidity: "50-60%",
    rain: "1-2 дня с дождём",
    advice: "Утром/вечером +15°C — нужна кофта. Днём солнечно.",
  },
  ningbo: {
    name: "НИНБО",
    temps: "+22°C…+28°C",
    cond: "Переменная облачность",
    humidity: "75-85%",
    rain: "Возможен тайфун",
    advice: "Следить за прогнозом. Сентябрь — сезон тайфунов.",
  },
  hangzhou: {
    name: "ХАНЧЖОУ",
    temps: "+22°C…+28°C",
    cond: "Облачно / прояснения",
    humidity: "75-85%",
    rain: "2-3 дня с дождём",
    advice: "У озера ветрено. Берите ветровку.",
  },
  huangshan: {
    name: "ХУАНШАНЬ",
    temps: "+12°C…+20°C",
    cond: "Туман / облачно",
    humidity: "80-90%",
    rain: "Высокая вероятность",
    advice: "На горе на 10°C холоднее. Берите тёплую одежду и дождевик.",
  },
};

const CITIES = ["shanghai", "beijing", "ningbo", "hangzhou", "huangshan"];

// Day-by-day weather for the trip period (Sep 8-24)
const DAILY: { date: string; day: number; city: string; temp: string; icon: string; desc: string }[] = [
  { date: "08.09", day: 0, city: "shanghai", temp: "+26°C", icon: "⛅", desc: "Прилёт" },
  { date: "09.09", day: 1, city: "shanghai", temp: "+27°C", icon: "☀️", desc: "Акклиматизация" },
  { date: "10.09", day: 2, city: "shanghai", temp: "+28°C", icon: "☀️", desc: "Пудун" },
  { date: "11.09", day: 3, city: "shanghai", temp: "+26°C", icon: "⛅", desc: "Культура" },
  { date: "12.09", day: 4, city: "shanghai", temp: "+27°C", icon: "☀️", desc: "Диснейленд" },
  { date: "13.09", day: 5, city: "shanghai", temp: "+25°C", icon: "🌧️", desc: "Спа/чай" },
  { date: "14.09", day: 6, city: "shanghai", temp: "+26°C", icon: "⛅", desc: "Чжуцзяцзяо" },
  { date: "15.09", day: 7, city: "shanghai", temp: "+28°C", icon: "☀️", desc: "Музеи" },
  { date: "16.09", day: 8, city: "ningbo", temp: "+26°C", icon: "⛅", desc: "Нинбо" },
  { date: "17.09", day: 9, city: "hangzhou", temp: "+25°C", icon: "🌤️", desc: "Ханчжоу" },
  { date: "18.09", day: 10, city: "huangshan", temp: "+18°C", icon: "🌫️", desc: "Хуаншань" },
  { date: "19.09", day: 11, city: "shanghai", temp: "+26°C", icon: "☀️", desc: "Резерв" },
  { date: "20.09", day: 12, city: "beijing", temp: "+23°C", icon: "☀️", desc: "Перелёт" },
  { date: "21.09", day: 13, city: "beijing", temp: "+22°C", icon: "☀️", desc: "Запретный город" },
  { date: "22.09", day: 14, city: "beijing", temp: "+21°C", icon: "⛅", desc: "Стена" },
  { date: "23.09", day: 15, city: "beijing", temp: "+20°C", icon: "🌤️", desc: "Universal/дворец" },
  { date: "24.09", day: 16, city: "beijing", temp: "+20°C", icon: "☀️", desc: "Вылет" },
];

interface WeatherWidgetProps {
  program?: ProgramDay[];
}

export default function WeatherWidget({ program }: WeatherWidgetProps) {
  const [mode, setMode] = useState<"city" | "daily">("daily");

  // City overview mode
  const [active, setActive] = useState("shanghai");
  const w = WEATHER[active];

  return (
    <section id="weather" className="pt-28 -mt-16">
      <div className="flex items-center gap-4 mb-2">
        <h2 className="font-display text-4xl md:text-5xl text-accent-black tracking-tight">
          ПОГОДА
        </h2>
        <span className="font-mono text-xs text-accent-pink font-bold border-2 border-accent-pink px-2 py-0.5">
          СЕНТЯБРЬ
        </span>
      </div>

      {/* Mode toggle */}
      <div className="flex gap-2 mb-4">
        <button onClick={() => setMode("daily")}
          className={`font-mono text-xs font-bold tracking-wider px-3 py-1.5 border-2 transition-all ${
            mode === "daily" ? "bg-accent-black text-bg-base border-accent-black" : "border-accent-black hover:bg-accent-black hover:text-bg-base"
          }`}>
          📅 ПО ДНЯМ
        </button>
        <button onClick={() => setMode("city")}
          className={`font-mono text-xs font-bold tracking-wider px-3 py-1.5 border-2 transition-all ${
            mode === "city" ? "bg-accent-black text-bg-base border-accent-black" : "border-accent-black hover:bg-accent-black hover:text-bg-base"
          }`}>
          🏙️ ПО ГОРОДАМ
        </button>
      </div>

      {mode === "city" ? (
        <>
          <p className="font-mono text-sm text-text-secondary mb-6">
            Типичная погода в Китае в сентябре. Данные многолетних наблюдений.
          </p>
          <div className="flex flex-wrap gap-2 mb-5">
            {CITIES.map((c) => (
              <button key={c} onClick={() => setActive(c)}
                className={`font-mono text-xs font-bold tracking-wider px-4 py-2 border-2 transition-all duration-150 ${
                  active === c ? "bg-accent-black text-bg-base border-accent-black" : "bg-transparent text-accent-black border-accent-black hover:bg-accent-black hover:text-bg-base"
                }`}>
                {WEATHER[c].name}
              </button>
            ))}
          </div>
          <div className="brutal-card p-6">
            <div className="flex items-start gap-6 mb-5">
              <div className="text-5xl">{active === "huangshan" ? "🌫️" : active === "beijing" ? "☀️" : "⛅"}</div>
              <div>
                <div className="font-display text-3xl text-accent-black">{w.temps}</div>
                <div className="font-mono text-sm text-text-secondary mt-1">{w.cond}</div>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 border-t-2 border-accent-black pt-4">
              <div>
                <div className="font-mono text-[10px] text-text-muted tracking-wider">ВЛАЖНОСТЬ</div>
                <div className="font-mono text-sm font-bold text-accent-black">{w.humidity}</div>
              </div>
              <div>
                <div className="font-mono text-[10px] text-text-muted tracking-wider">ОСАДКИ</div>
                <div className="font-mono text-sm font-bold text-accent-black">{w.rain}</div>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <div className="font-mono text-[10px] text-text-muted tracking-wider">СОВЕТ</div>
                <div className="font-mono text-xs text-text-secondary mt-0.5">{w.advice}</div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <p className="font-mono text-sm text-text-secondary mb-6">
            Прогноз по дням поездки. Исторические средние за сентябрь.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2">
            {DAILY.map((d) => {
              const isTravel = d.day === 0 || d.day === 12;
              return (
                <div key={d.date}
                  className={`brutal-card p-3 ${isTravel ? "border-accent-pink bg-accent-pink/5" : ""}`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-[10px] font-bold text-accent-black">{d.date}</span>
                    <span className="font-mono text-[10px] text-text-muted">{d.day === 0 ? "✈️" : `Д${d.day}`}</span>
                  </div>
                  <div className="text-2xl text-center my-1">{d.icon}</div>
                  <div className="font-display text-lg text-accent-black text-center">{d.temp}</div>
                  <div className="font-mono text-[9px] text-text-muted text-center mt-1 leading-tight">{d.desc}</div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </section>
  );
}
