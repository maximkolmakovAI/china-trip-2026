"use client";

import { useState } from "react";

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

export default function WeatherWidget() {
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
      <p className="font-mono text-sm text-text-secondary mb-6">
        Типичная погода в Китае в сентябре. Данные многолетних наблюдений.
      </p>

      <div className="flex flex-wrap gap-2 mb-5">
        {CITIES.map((c) => (
          <button
            key={c}
            onClick={() => setActive(c)}
            className={`font-mono text-xs font-bold tracking-wider px-4 py-2 border-2 transition-all duration-150 ${
              active === c
                ? "bg-accent-black text-bg-base border-accent-black"
                : "bg-transparent text-accent-black border-accent-black hover:bg-accent-black hover:text-bg-base"
            }`}
          >
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
    </section>
  );
}
