"use client";

import { useState, useEffect } from "react";
import { IdeaCategories, IdeaItem } from "@/lib/types";
import { useUser } from "@/lib/useUser";
import IdeaCard from "./IdeaCard";
import { loadCustomIdeas } from "./AddItemPanel";

interface IdeasSectionProps {
  ideas: IdeaCategories;
  visited: { name: string; note: string }[];
}

const categories = [
  { key: "shanghai", label: "ШАНХАЙ" },
  { key: "beijing", label: "ПЕКИН" },
  { key: "ningbo", label: "НИНБО" },
  { key: "hangzhou", label: "ХАНЧЖОУ" },
  { key: "huangshan", label: "ХУАНШАНЬ" },
  { key: "other", label: "ДРУГИЕ" },
  { key: "food", label: "ЕДА" },
  { key: "shopping", label: "ШОПИНГ" },
] as const;

type CategoryKey = keyof IdeaCategories;

function getCategoryIdeas(ideas: IdeaCategories, key: string): IdeaItem[] {
  if (key === "shanghai") return ideas.shanghai;
  if (key === "beijing") return ideas.beijing;
  if (key === "ningbo") return ideas.ningbo;
  if (key === "hangzhou") return ideas.hangzhou;
  if (key === "huangshan") return ideas.huangshan;
  if (key === "food") return ideas.food;
  if (key === "shopping") return ideas.shopping;
  return ideas.other;
}

export default function IdeasSection({ ideas, visited }: IdeasSectionProps) {
  const { user } = useUser();
  const userId = user?.name || "anonymous";
  const [active, setActive] = useState<string>("shanghai");
  const [customIdeas, setCustomIdeas] = useState<{ text: string; note: string; category: string }[]>([]);

  useEffect(() => {
    setCustomIdeas(loadCustomIdeas(userId));
  }, [userId]);

  return (
    <section id="ideas" className="pt-28 -mt-16">
      <div className="flex items-center gap-4 mb-2">
        <h2 className="font-display text-4xl md:text-5xl text-accent-black tracking-tight">
          ИДЕИ
        </h2>
        <span className="font-mono text-xs text-accent-pink font-bold border-2 border-accent-pink px-2 py-0.5">
          {active.toUpperCase()}
        </span>
      </div>
      <p className="font-mono text-sm text-text-secondary mb-6">
        Новые места, которые хотим посетить. Голосуйте за самые интересные варианты.
      </p>

      {visited.length > 0 && (
        <div className="mb-6">
          <h3 className="font-mono text-xs font-bold text-text-muted tracking-wider mb-3">
            ✓ УЖЕ БЫЛИ
          </h3>
          <div className="flex flex-wrap gap-2">
            {visited.map((v, i) => (
              <div key={i} className="font-mono text-xs font-bold border-2 border-accent-black px-3 py-1">{v.name}</div>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((cat) => {
          const mainItems = getCategoryIdeas(ideas, cat.key);
          const customItems = customIdeas.filter(c => c.category === cat.key || (cat.key === "ningbo" && c.category === "ningbo") || (cat.key === "hangzhou" && c.category === "hangzhou") || (cat.key === "huangshan" && c.category === "huangshan"));
          const count = mainItems.length + customItems.length;
          return (
            <button key={cat.key} onClick={() => setActive(cat.key)}
              className={`font-mono text-xs font-bold tracking-wider px-4 py-2 border-2 transition-all duration-150 ${
                active === cat.key
                  ? "bg-accent-pink text-white border-accent-black"
                  : "bg-transparent text-accent-black border-accent-black hover:bg-accent-black hover:text-bg-base"
              }`}>
              {cat.label} ({count})
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Custom ideas (added by users) */}
        {customIdeas.filter(c => {
          const activeKey = active as string;
          if (activeKey === "other") return ["other", "ningbo", "hangzhou", "huangshan"].includes(c.category);
          return c.category === activeKey;
        }).map((idea, i) => (
          <div key={`custom-${i}`} className="brutal-border-thin bg-accent-pink/5 p-4 animate-slide-up">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-accent-black">{idea.text}</p>
                {idea.note && <p className="font-mono text-xs text-text-muted mt-1">{idea.note}</p>}
                <span className="font-mono text-[10px] text-accent-pink tracking-wider mt-1 inline-block">ДОБАВЛЕНО</span>
              </div>
            </div>
          </div>
        ))}
        {/* Main ideas */}
        {getCategoryIdeas(ideas, active).map((idea) => (
          <IdeaCard key={idea.id} idea={idea} city={active} />
        ))}
      </div>

      {!customIdeas.some(c => {
        const activeKey = active as string;
        if (activeKey === "other") return ["other", "ningbo", "hangzhou", "huangshan"].includes(c.category);
        return c.category === activeKey;
      }) && getCategoryIdeas(ideas, active).length === 0 && (
        <div className="text-center py-12 border-3 border-accent-black">
          <p className="font-mono text-sm text-text-muted">В этой категории пока нет идей</p>
        </div>
      )}
    </section>
  );
}
