"use client";

import { useState } from "react";
import { HotelTag, TAG_LABELS } from "@/lib/types";

interface Tip {
  text: string;
  tags: HotelTag[];
}

const tips: Tip[] = [
  {
    text: "Если бюджет позволяет — Amanyangyun (Шанхай) или Aman Summer Palace (Пекин). Это уровень «раз в жизни».",
    tags: ["budget"],
  },
  {
    text: "Для вау-эффекта у стены → Commune by the Great Wall. Вилла на 6 человек дешевле 3 отдельных номеров.",
    tags: ["wow", "unique"],
  },
  {
    text: "Для группы 6 чел → арендуйте виллу или 2 смежных номера, а не отдельные номера в разных концах отеля.",
    tags: ["practical"],
  },
  {
    text: "Пишите в отель ДО бронирования для групповых тарифов и раннего заезда.",
    tags: ["practical"],
  },
  {
    text: "Сентябрь-октябрь = пик сезона. Бронируйте за 2-3 месяца, особенно на 1-7 октября.",
    tags: ["practical"],
  },
  {
    text: "1 октября — национальный праздник КНР. Ждите толп, салюта и парада дронов. Планируйте заранее.",
    tags: ["unique"],
  },
  {
    text: "Берите Power Bank везде с собой — в Китае всё через телефон: оплата, карты, переводчик.",
    tags: ["practical"],
  },
  {
    text: "Поезда Шанхай → Ханчжоу (168 км, ~1 ч, $8-10) — лучший вариант. Ходит до 22:30.",
    tags: ["practical"],
  },
];

const assistantTags: { tag: HotelTag }[] = [
  { tag: "budget" },
  { tag: "wow" },
  { tag: "practical" },
  { tag: "unique" },
];

export default function AssistantSection() {
  const [activeTag, setActiveTag] = useState<HotelTag | null>(null);

  const filtered = activeTag
    ? tips.filter((t) => t.tags.includes(activeTag))
    : tips;

  return (
    <section id="assistant" className="pt-28 -mt-16 pb-20">
      <div className="flex items-center gap-4 mb-2">
        <h2 className="font-display text-4xl md:text-5xl text-accent-black tracking-tight">
          ПОМОЩНИК
        </h2>
        <span className="font-mono text-xs text-accent-pink font-bold border-2 border-accent-pink px-2 py-0.5">
          AI
        </span>
      </div>
      <p className="font-mono text-sm text-text-secondary mb-8">
        Советы для идеальной поездки. Нажмите на фильтр, чтобы увидеть релевантные подсказки.
      </p>

      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setActiveTag(null)}
          className={`font-mono text-xs font-bold tracking-wider px-4 py-2 border-2 transition-all duration-150 ${
            activeTag === null
              ? "bg-accent-black text-bg-base border-accent-black"
              : "bg-transparent text-accent-black border-accent-black hover:bg-accent-black hover:text-bg-base"
          }`}
        >
          ВСЕ СОВЕТЫ
        </button>
        {assistantTags.map(({ tag }) => (
          <button
            key={tag}
            onClick={() => setActiveTag(activeTag === tag ? null : tag)}
            className={`font-mono text-xs font-bold tracking-wider px-4 py-2 border-2 transition-all duration-150 ${
              activeTag === tag
                ? "bg-accent-pink text-white border-accent-black"
                : "bg-transparent text-accent-black border-accent-black hover:bg-accent-black hover:text-bg-base"
            }`}
          >
            {TAG_LABELS[tag].toUpperCase()}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((tip, i) => (
          <div
            key={i}
            className="brutal-card p-5 animate-slide-up"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <p className="text-sm text-accent-black leading-relaxed mb-3">
              {tip.text}
            </p>
            <div className="flex gap-1.5">
              {tip.tags.map((tag) => (
                <span key={tag} className="brutal-tag">
                  {TAG_LABELS[tag].toUpperCase()}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 brutal-card p-6 border-4">
        <p className="font-mono text-sm text-accent-black mb-5">
          Хотите подобрать отель под ваш бюджет и предпочтения?
        </p>
        <div className="flex flex-wrap gap-2">
          {assistantTags.map(({ tag }) => (
            <button
              key={tag}
              onClick={() => {
                setActiveTag(tag);
                document.getElementById("hotels")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="font-mono text-xs font-bold tracking-wider px-4 py-2 border-2 border-accent-black bg-accent-pink text-white hover:bg-accent-black transition-colors"
            >
              ПОКАЗАТЬ {TAG_LABELS[tag].toUpperCase()} ОТЕЛИ
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
