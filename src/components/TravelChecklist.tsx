"use client";

import { useState, useEffect } from "react";
import { useUser } from "@/lib/useUser";

interface ChecklistItem {
  id: string;
  text: string;
  done: boolean;
}

interface Category {
  id: string;
  label: string;
  items: ChecklistItem[];
}

const DEFAULT: Category[] = [
  {
    id: "docs", label: "ДОКУМЕНТЫ",
    items: [
      { id: "d1", text: "Загранпаспорт (срок >6 мес)", done: false },
      { id: "d2", text: "Виза в Китай", done: false },
      { id: "d3", text: "Страховка (выездная)", done: false },
      { id: "d4", text: "Авиабилеты (распечатка)", done: false },
      { id: "d5", text: "Брони отелей", done: false },
      { id: "d6", text: "Копия паспорта в облаке", done: false },
    ],
  },
  {
    id: "med", label: "АПТЕЧКА",
    items: [
      { id: "m1", text: "Пластыри / бинт", done: false },
      { id: "m2", text: "Обезболивающее", done: false },
      { id: "m3", text: "Отравление / сорбенты", done: false },
      { id: "m4", text: "Антигистаминное", done: false },
      { id: "m5", text: "Средство от простуды", done: false },
      { id: "m6", text: "Термометр", done: false },
    ],
  },
  {
    id: "tech", label: "ТЕХНИКА",
    items: [
      { id: "t1", text: "Power Bank (2+ шт)", done: false },
      { id: "t2", text: "Кабели USB-C / Lightning", done: false },
      { id: "t3", text: "Адаптер для розетки", done: false },
      { id: "t4", text: "Наушники", done: false },
      { id: "t5", text: "VPN (заранее)", done: false },
    ],
  },
  {
    id: "cloth", label: "ОДЕЖДА",
    items: [
      { id: "c1", text: "Лёгкая одежда (днём)", done: false },
      { id: "c2", text: "Кофта / ветровка (вечер)", done: false },
      { id: "c3", text: "Дождевик / зонт", done: false },
      { id: "c4", text: "Удобная обувь для ходьбы", done: false },
      { id: "c5", text: "Тёплая одежда (Хуаншань)", done: false },
    ],
  },
  {
    id: "other", label: "РАЗНОЕ",
    items: [
      { id: "o1", text: "Сим-карта / eSIM (Китай)", done: false },
      { id: "o2", text: "Приложение DiDi (такси)", done: false },
      { id: "o3", text: "Приложение WeChat / Alipay", done: false },
      { id: "o4", text: "Переводчик (Pleco / Google)", done: false },
      { id: "o5", text: "Наличные юани (CNY)", done: false },
      { id: "o6", text: "Банковская карта (Мир/UnionPay)", done: false },
    ],
  },
];

export default function TravelChecklist() {
  const { user } = useUser();
  const userId = user?.name || "anonymous";
  const [categories, setCategories] = useState<Category[]>(() =>
    DEFAULT.map((cat) => ({ ...cat, items: cat.items.map((it) => ({ ...it })) }))
  );
  const [loaded, setLoaded] = useState(false);

  const storageKey = `china_trip_checklist_${userId}`;

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        setCategories(JSON.parse(raw));
      }
    } catch {}
    setLoaded(true);
  }, [storageKey]);

  useEffect(() => {
    if (loaded) {
      try { localStorage.setItem(storageKey, JSON.stringify(categories)); } catch {}
    }
  }, [categories, loaded, storageKey]);

  const toggle = (catId: string, itemId: string) => {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === catId
          ? { ...cat, items: cat.items.map((it) => (it.id === itemId ? { ...it, done: !it.done } : it)) }
          : cat
      )
    );
  };

  const resetAll = () => {
    setCategories(DEFAULT.map((cat) => ({ ...cat, items: cat.items.map((it) => ({ ...it, done: false })) })));
  };

  if (!loaded) return null;

  const totalItems = categories.reduce((s, c) => s + c.items.length, 0);
  const doneItems = categories.reduce((s, c) => s + c.items.filter((i) => i.done).length, 0);
  const pct = totalItems > 0 ? Math.round((doneItems / totalItems) * 100) : 0;

  return (
    <section id="checklist" className="pt-28 -mt-16">
      <div className="flex items-center gap-4 mb-2">
        <h2 className="font-display text-4xl md:text-5xl text-accent-black tracking-tight">
          ЧЕКЛИСТ
        </h2>
        <span className="font-mono text-xs font-bold border-2 border-accent-black px-2 py-0.5">
          {doneItems}/{totalItems}
        </span>
      </div>
      <p className="font-mono text-sm text-text-secondary mb-6">
        Что взять с собой. Сохраняется в браузере.
      </p>

      {/* Progress */}
      <div className="h-3 border-2 border-accent-black mb-6 bg-bg-secondary">
        <div
          className="h-full bg-accent-pink transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map((cat) => {
          const catDone = cat.items.filter((i) => i.done).length;
          return (
            <div key={cat.id} className="brutal-card p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-display text-lg text-accent-black">{cat.label}</h3>
                <span className="font-mono text-xs text-text-muted">{catDone}/{cat.items.length}</span>
              </div>
              <div className="space-y-1">
                {cat.items.map((item) => (
                  <label
                    key={item.id}
                    className={`flex items-start gap-3 p-1.5 cursor-pointer transition-colors ${
                      item.done ? "opacity-40" : "hover:bg-bg-secondary"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={item.done}
                      onChange={() => toggle(cat.id, item.id)}
                      className="mt-0.5 w-4 h-4 accent-accent-pink"
                    />
                    <span className={`text-sm ${item.done ? "line-through text-text-muted" : "text-accent-black"}`}>
                      {item.text}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-end mt-4">
        <button
          onClick={resetAll}
          className="font-mono text-xs font-bold tracking-wider px-4 py-2 border-2 border-accent-black hover:bg-accent-black hover:text-bg-base transition-colors"
        >
          СБРОСИТЬ ВСЁ
        </button>
      </div>
    </section>
  );
}
