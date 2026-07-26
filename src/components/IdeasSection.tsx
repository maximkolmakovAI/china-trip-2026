"use client";

import { useState, useEffect, useMemo } from "react";
import { IdeaCategories, IdeaItem } from "@/lib/types";
import { useUser } from "@/lib/useUser";
import { useDetailModal } from "@/lib/useDetailModal";
import { useVotes } from "@/lib/useVotes";
import IdeaCard from "./IdeaCard";
import { loadCustomIdeas } from "./AddItemPanel";
import aiData from "@/data/aiSuggestions.json";

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

const AI_CATEGORIES = new Set(["shanghai", "beijing", "ningbo", "hangzhou", "huangshan"]);

export default function IdeasSection({ ideas, visited }: IdeasSectionProps) {
  const { user } = useUser();
  const userId = user?.name || "anonymous";
  const [active, setActive] = useState<string>("shanghai");
  const [customIdeas, setCustomIdeas] = useState<{ text: string; note: string; category: string }[]>([]);
  const { open } = useDetailModal();
  const { toggleVote } = useVotes();

  useEffect(() => {
    setCustomIdeas(loadCustomIdeas(userId));
  }, [userId]);

  const mainIdeas = getCategoryIdeas(ideas, active);

  const aiSuggestions = useMemo(() => {
    if (!AI_CATEGORIES.has(active)) return [];
    const data = aiData as Record<string, { id: string; text: string; note: string; tags?: string[] }[]>;
    return data[active] || [];
  }, [active]);

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
        Накидываем все идеи → потом компонуем программу. Голосуйте за лучшие.
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
          const count = getCategoryIdeas(ideas, cat.key).length + customIdeas.filter(c => c.category === cat.key).length;
          const aiCount = AI_CATEGORIES.has(cat.key) ? (aiData as Record<string, unknown[]>)[cat.key]?.length || 0 : 0;
          return (
            <button key={cat.key} onClick={() => setActive(cat.key)}
              className={`font-mono text-xs font-bold tracking-wider px-4 py-2 border-2 transition-all duration-150 ${
                active === cat.key
                  ? "bg-accent-pink text-white border-accent-black"
                  : "bg-transparent text-accent-black border-accent-black hover:bg-accent-black hover:text-bg-base"
              }`}>
              {cat.label} ({count + aiCount})
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Custom ideas */}
        {customIdeas.filter(c => c.category === active || (active === "other" && !["shanghai","beijing","food","shopping"].includes(c.category)))
          .map((idea, i) => (
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
        {mainIdeas.map((idea) => (
          <IdeaCard key={idea.id} idea={idea} city={active} />
        ))}

        {/* AI suggestions */}
        {aiSuggestions.map((s) => (
          <div key={s.id}
            className="brutal-border-thin bg-bg-secondary/50 p-4 animate-slide-up cursor-pointer hover:bg-bg-secondary transition-colors"
            onClick={() => open({ type: "ai", title: s.text, description: s.note, tags: s.tags })}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-[10px] font-bold text-accent-pink border-2 border-accent-pink px-1.5 py-0.5">🤖 ИИ</span>
                </div>
                <p className="text-sm font-bold text-accent-black">{s.text}</p>
                {s.note && <p className="font-mono text-xs text-text-muted mt-1">{s.note}</p>}
              </div>
              <button onClick={(e) => { e.stopPropagation(); toggleVote(s.id); }}
                className="font-mono text-xs font-bold border-2 border-accent-black px-2 py-1 hover:bg-accent-black hover:text-bg-base transition-colors shrink-0">
                +
              </button>
            </div>
          </div>
        ))}
      </div>

      {mainIdeas.length === 0 && aiSuggestions.length === 0 && (
        <div className="text-center py-12 border-3 border-accent-black">
          <p className="font-mono text-sm text-text-muted">В этой категории пока нет идей</p>
        </div>
      )}
    </section>
  );
}
