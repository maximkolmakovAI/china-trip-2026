"use client";

import { useState, useMemo, useRef, useCallback, useEffect } from "react";
import { ProgramDay, CITY_COLORS, ProgramItem } from "@/lib/types";
import { useUser } from "@/lib/useUser";
import aiData from "@/data/aiSuggestions.json";
import { useVotes } from "@/lib/useVotes";
import { useDetailModal } from "@/lib/useDetailModal";
import RouteOptimizer from "./RouteOptimizer";
import HighlightLocations from "./HighlightLocations";

interface DayCardProps {
  day: ProgramDay;
  index: number;
}

const statusConfig = {
  planned: { label: "СПЛАНИРОВАНО" },
  todo: { label: "НУЖНО ДОПЛАНИРОВАТЬ" },
  maybe: { label: "ПОД ВОПРОСОМ" },
};

const CITY_KEY: Record<string, string> = {
  "Шанхай": "shanghai", "Нинбо": "ningbo",
  "Ханчжоу": "hangzhou", "Хуаншань": "huangshan", "Пекин": "beijing",
};

function itemOrderKey(userId: string, day: number) { return `china_trip_items_order_${userId}_d${day}`; }
function locksKey(userId: string) { return `china_trip_locks_${userId}`; }

function loadItemOrder(userId: string, day: number): number[] | null {
  if (typeof window === "undefined") return null;
  try { const r = localStorage.getItem(itemOrderKey(userId, day)); return r ? JSON.parse(r) : null; } catch { return null; }
}

function saveItemOrder(userId: string, day: number, order: number[]) {
  localStorage.setItem(itemOrderKey(userId, day), JSON.stringify(order));
}

function loadLocks(userId: string): string[] {
  try { const r = localStorage.getItem(locksKey(userId)); return r ? JSON.parse(r) : []; } catch { return []; }
}

function saveLocks(userId: string, locks: string[]) {
  localStorage.setItem(locksKey(userId), JSON.stringify(locks));
}

export default function DayCard({ day, index }: DayCardProps) {
  const { user } = useUser();
  const userId = user?.name || "anonymous";
  const [showAi, setShowAi] = useState(false);
  const { votes } = useVotes();
  const { open } = useDetailModal();
  const cityColor = CITY_COLORS[day.city] || "#1A1A1A";
  const status = statusConfig[day.status];

  const [itemOrder, setItemOrder] = useState<number[]>([]);
  const [locks, setLocks] = useState<string[]>([]);
  const dragItem = useRef<number>(-1);
  const dragOverItem = useRef<number>(-1);

  useEffect(() => {
    const saved = loadItemOrder(userId, day.day);
    if (saved && saved.length === day.items.length) {
      setItemOrder(saved);
    } else {
      setItemOrder(day.items.map((_, i) => i));
    }
    setLocks(loadLocks(userId));
  }, [userId, day.day, day.items.length]);

  const sortedWithIdx = useMemo(() => {
    return itemOrder.map((origIdx) => ({ item: day.items[origIdx], origIdx })).filter((x) => x.item);
  }, [itemOrder, day.items]);

  const newItems = sortedWithIdx.filter((x) => x.item.new);
  const oldItems = sortedWithIdx.filter((x) => !x.item.new);

  const cityKey = CITY_KEY[day.city] || "";
  const suggestions = useMemo(() => {
    const data = aiData as Record<string, { id: string; text: string; note: string; tags?: string[] }[]>;
    return data[cityKey] || [];
  }, [cityKey]);

  const findSuggestion = (text: string) => {
    const lower = text.toLowerCase();
    return suggestions.find((s) => s.text.toLowerCase().includes(lower) || lower.includes(s.text.toLowerCase()));
  };

  const openItemModal = (text: string, done: boolean) => {
    const sug = findSuggestion(text);
    open({ type: "program", title: text, subtitle: `День ${day.day} · ${day.city}`, description: sug?.note || day.notes || undefined, tags: sug?.tags, city: day.city, day: day.day });
  };

  const handleDragStart = (idx: number) => { dragItem.current = idx; };
  const handleDragOver = (idx: number) => { dragOverItem.current = idx; };
  const handleDragEnd = useCallback(() => {
    if (dragItem.current === dragOverItem.current || dragItem.current < 0 || dragOverItem.current < 0) {
      dragItem.current = -1; dragOverItem.current = -1; return;
    }
    // Check if dragged or target item is locked
    const sorted = sortedWithIdx;
    const dragged = sorted[dragItem.current];
    const target = sorted[dragOverItem.current];
    if (dragged && locks.includes(dragged.item.text)) { dragItem.current = -1; dragOverItem.current = -1; return; }
    setItemOrder((prev) => {
      const next = [...prev];
      const [removed] = next.splice(dragItem.current, 1);
      next.splice(dragOverItem.current, 0, removed);
      saveItemOrder(userId, day.day, next);
      return next;
    });
    dragItem.current = -1; dragOverItem.current = -1;
  }, [userId, day.day, locks, sortedWithIdx]);

  const toggleLock = (text: string) => {
    setLocks((prev) => {
      const next = prev.includes(text) ? prev.filter((l) => l !== text) : [...prev, text];
      saveLocks(userId, next);
      return next;
    });
  };

  const renderItem = (item: ProgramItem, origIdx: number, visualIdx: number, isNew: boolean) => {
    const locked = locks.includes(item.text);
    return (
    <div key={`item-${origIdx}`}
      draggable={!locked}
      onDragStart={() => !locked && handleDragStart(visualIdx)}
      onDragOver={(e) => { if (!locked) { e.preventDefault(); handleDragOver(visualIdx); } }}
      onDragEnd={!locked ? handleDragEnd : undefined}
      className={`flex items-start gap-2 p-2 transition-colors ${item.done ? "opacity-40" : ""} ${locked ? "bg-accent-pink/5" : "hover:bg-bg-secondary"} ${dragItem.current === visualIdx ? "opacity-30 border-2 border-dashed border-accent-pink" : ""} ${!locked ? "cursor-grab active:cursor-grabbing" : "cursor-default"}`}>
      <button onClick={() => toggleLock(item.text)}
        className={`font-mono text-[10px] mt-0.5 shrink-0 transition-colors ${locked ? "text-accent-pink" : "text-text-muted hover:text-accent-black"}`}>
        {locked ? "🔒" : "🔓"}
      </button>
      <span className="font-mono text-[10px] text-text-muted cursor-grab mt-1">⠿</span>
      <input type="checkbox" defaultChecked={item.done} className="mt-0.5 w-4 h-4 accent-accent-pink" />
      <div onClick={() => openItemModal(item.text, item.done)}
        className="flex-1 text-left text-sm leading-relaxed cursor-pointer hover:text-accent-pink transition-colors">
        <span className={isNew ? "font-bold text-accent-black" : "text-text-secondary"}>
          <HighlightLocations text={item.text} city={day.city} />
        </span>
      </div>
      {isNew && <span className="font-mono text-[10px] font-bold text-accent-pink border-2 border-accent-pink px-1.5 py-0.5">NEW</span>}
    </div>
    );
  };

  return (
    <div className="animate-slide-up mb-6" style={{ animationDelay: `${index * 60}ms` }}>
      <div className="brutal-card p-5">
        <div className="flex items-center flex-wrap gap-3 mb-4">
          <span className="font-display text-xl text-accent-black">ДЕНЬ {day.day}</span>
          <span className="font-mono text-xs text-text-muted">{day.date} · {day.weekday}</span>
          <span className="font-mono text-xs font-bold px-2 py-0.5 border-2" style={{ color: cityColor, borderColor: cityColor }}>{day.city}</span>
          <span className={`font-mono text-[10px] font-bold tracking-wider px-2 py-0.5 border-2 ${
            day.status === "planned" ? "text-success border-success" : day.status === "todo" ? "text-warning border-warning" : "text-danger border-danger"
          }`}>{status.label}</span>
        </div>

        <div className="space-y-0.5">
          {oldItems.map((x, i) => renderItem(x.item, x.origIdx, i, false))}
          {newItems.map((x, i) => renderItem(x.item, x.origIdx, oldItems.length + i, true))}
        </div>

        {day.notes && (
          <p className="mt-4 font-mono text-xs text-text-muted border-t-2 border-accent-black pt-3">⚡ {day.notes}</p>
        )}

        <RouteOptimizer dayTitle={`День ${day.day}`} locations={day.items.map((i) => i.text)} />

        {suggestions.length > 0 && (
          <div className="mt-4 border-t-2 border-accent-black pt-3">
            <button onClick={() => setShowAi(!showAi)} className="flex items-center gap-2 mb-2 group">
              <span className="font-mono text-xs font-bold text-accent-pink tracking-wider group-hover:underline">
                {showAi ? "▼" : "▶"} ИДЕИ ОТ ИИ
              </span>
              <span className="font-mono text-[10px] text-text-muted">({suggestions.length})</span>
            </button>
            {showAi && (
              <div className="space-y-1.5 animate-slide-up">
                {suggestions.map((s) => (
                  <AiSuggestionRow key={s.id} suggestion={s} voteCount={votes[s.id] || 0} isAdded={(votes[s.id] || 0) >= 1} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function AiSuggestionRow({ suggestion, voteCount, isAdded }: {
  suggestion: { id: string; text: string; note: string; tags?: string[] };
  voteCount: number; isAdded: boolean;
}) {
  const { toggleVote } = useVotes();
  const { open } = useDetailModal();

  return (
    <div className={`flex items-start gap-2 p-2 border-l-2 ${isAdded ? "border-accent-pink bg-accent-pink/5" : "border-transparent hover:bg-bg-secondary"} transition-colors`}>
      <button onClick={() => toggleVote(suggestion.id)}
        className={`flex items-center gap-1 font-mono text-xs font-bold border-2 px-2 py-0.5 shrink-0 transition-all ${
          isAdded ? "bg-accent-pink text-white border-accent-black" : "border-accent-black hover:bg-accent-black hover:text-bg-base"
        }`}>
        {isAdded ? "✓" : "+"} {voteCount}
      </button>
      <button onClick={() => open({ type: "ai", title: suggestion.text, description: suggestion.note, tags: suggestion.tags })}
        className="flex-1 min-w-0 text-left cursor-pointer hover:text-accent-pink transition-colors">
        <p className={`text-xs ${isAdded ? "font-bold text-accent-black" : "text-text-secondary"}`}>{suggestion.text}</p>
        {suggestion.note && <p className="font-mono text-[10px] text-text-muted mt-0.5">{suggestion.note}</p>}
      </button>
    </div>
  );
}
