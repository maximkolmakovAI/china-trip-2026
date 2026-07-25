"use client";

import { useState, useEffect } from "react";
import { useUser } from "@/lib/useUser";

type AddMode = "hotel" | "idea" | null;

interface NewHotel {
  name: string; district: string; concept: string; price: string; link: string; tags: string;
}

interface NewIdea {
  text: string; note: string; category: string;
}

export function loadCustomHotels(userId: string): NewHotel[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(`china_trip_custom_hotels_${userId}`) || "[]"); } catch { return []; }
}

export function loadCustomIdeas(userId: string): NewIdea[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(`china_trip_custom_ideas_${userId}`) || "[]"); } catch { return []; }
}

export default function AddItemPanel() {
  const { user } = useUser();
  const userId = user?.name || "anonymous";
  const [mode, setMode] = useState<AddMode>(null);
  const [msg, setMsg] = useState("");

  // Hotel form
  const [hotel, setHotel] = useState<NewHotel>({ name: "", district: "", concept: "", price: "", link: "", tags: "" });
  // Idea form
  const [idea, setIdea] = useState<NewIdea>({ text: "", note: "", category: "shanghai" });

  const addHotel = () => {
    if (!hotel.name) { setMsg("Введите название отеля"); return; }
    const list = loadCustomHotels(userId);
    list.push(hotel);
    localStorage.setItem(`china_trip_custom_hotels_${userId}`, JSON.stringify(list));
    setHotel({ name: "", district: "", concept: "", price: "", link: "", tags: "" });
    setMsg("Отель добавлен! Обновите страницу.");
    setTimeout(() => setMsg(""), 3000);
  };

  const addIdea = () => {
    if (!idea.text) { setMsg("Введите текст идеи"); return; }
    const list = loadCustomIdeas(userId);
    list.push(idea);
    localStorage.setItem(`china_trip_custom_ideas_${userId}`, JSON.stringify(list));
    setIdea({ text: "", note: "", category: "shanghai" });
    setMsg("Идея добавлена! Обновите страницу.");
    setTimeout(() => setMsg(""), 3000);
  };

  return (
    <div className="brutal-card p-5 mb-10">
      <div className="flex items-center gap-3 mb-4">
        <h3 className="font-display text-2xl text-accent-black tracking-tight">+ ДОБАВИТЬ</h3>
        <span className="font-mono text-[10px] text-text-muted">новый элемент</span>
      </div>

      <div className="flex flex-wrap gap-2 mb-5">
        <button onClick={() => setMode(mode === "hotel" ? null : "hotel")}
          className={`font-mono text-xs font-bold tracking-wider px-4 py-2 border-2 transition-all ${mode === "hotel" ? "bg-accent-black text-bg-base border-accent-black" : "border-accent-black hover:bg-accent-black hover:text-bg-base"}`}>
          + ОТЕЛЬ
        </button>
        <button onClick={() => setMode(mode === "idea" ? null : "idea")}
          className={`font-mono text-xs font-bold tracking-wider px-4 py-2 border-2 transition-all ${mode === "idea" ? "bg-accent-black text-bg-base border-accent-black" : "border-accent-black hover:bg-accent-black hover:text-bg-base"}`}>
          + ИДЕЯ
        </button>
      </div>

      {msg && <p className="font-mono text-sm text-accent-pink mb-3">{msg}</p>}

      {mode === "hotel" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input placeholder="Название" value={hotel.name} onChange={e => setHotel({...hotel, name: e.target.value})}
            className="border-2 border-accent-black p-2 font-mono text-sm bg-surface" />
          <input placeholder="Район" value={hotel.district} onChange={e => setHotel({...hotel, district: e.target.value})}
            className="border-2 border-accent-black p-2 font-mono text-sm bg-surface" />
          <textarea placeholder="Концепция (описание)" value={hotel.concept} onChange={e => setHotel({...hotel, concept: e.target.value})}
            className="border-2 border-accent-black p-2 font-mono text-sm bg-surface col-span-2" rows={2} />
          <input placeholder="Цена за ночь (₽)" value={hotel.price} onChange={e => setHotel({...hotel, price: e.target.value})}
            className="border-2 border-accent-black p-2 font-mono text-sm bg-surface" />
          <input placeholder="Ссылка Trip.com" value={hotel.link} onChange={e => setHotel({...hotel, link: e.target.value})}
            className="border-2 border-accent-black p-2 font-mono text-sm bg-surface" />
          <input placeholder="Теги: budget,wow,unique (через запятую)" value={hotel.tags} onChange={e => setHotel({...hotel, tags: e.target.value})}
            className="border-2 border-accent-black p-2 font-mono text-sm bg-surface col-span-2" />
          <button onClick={addHotel}
            className="col-span-2 font-mono text-sm font-bold tracking-wider px-4 py-3 border-2 border-accent-black bg-accent-pink text-white hover:bg-accent-black transition-colors">
            ДОБАВИТЬ ОТЕЛЬ
          </button>
        </div>
      )}

      {mode === "idea" && (
        <div className="grid grid-cols-1 gap-3">
          <input placeholder="Название места / идеи" value={idea.text} onChange={e => setIdea({...idea, text: e.target.value})}
            className="border-2 border-accent-black p-2 font-mono text-sm bg-surface" />
          <input placeholder="Примечание (необязательно)" value={idea.note} onChange={e => setIdea({...idea, note: e.target.value})}
            className="border-2 border-accent-black p-2 font-mono text-sm bg-surface" />
          <select value={idea.category} onChange={e => setIdea({...idea, category: e.target.value})}
            className="border-2 border-accent-black p-2 font-mono text-sm bg-surface">
            <option value="shanghai">Шанхай</option>
            <option value="beijing">Пекин</option>
            <option value="ningbo">Нинбо</option>
            <option value="hangzhou">Ханчжоу</option>
            <option value="huangshan">Хуаншань</option>
            <option value="food">Еда</option>
            <option value="shopping">Шопинг</option>
            <option value="other">Другое</option>
          </select>
          <button onClick={addIdea}
            className="font-mono text-sm font-bold tracking-wider px-4 py-3 border-2 border-accent-black bg-accent-pink text-white hover:bg-accent-black transition-colors">
            ДОБАВИТЬ ИДЕЮ
          </button>
        </div>
      )}
    </div>
  );
}
