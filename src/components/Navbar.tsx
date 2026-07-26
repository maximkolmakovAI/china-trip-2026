"use client";

import { useState, useEffect } from "react";
import { useUser } from "@/lib/useUser";
import AuthModal from "./AuthModal";

const sections = [
  { id: "hotels", label: "Отели" },
  { id: "ideas", label: "Идеи" },
  { id: "program", label: "Программа" },
  { id: "weather", label: "Погода" },
  { id: "checklist", label: "Чеклист" },
  { id: "budget", label: "Бюджет" },
  { id: "comparison", label: "Сравнение" },
  { id: "documents", label: "Сейф" },
  { id: "voicenotes", label: "Голос" },
  { id: "export", label: "PDF" },
  { id: "timeline", label: "Таймлайн" },
  { id: "map", label: "Карта" },
  { id: "assistant", label: "Помощник" },
];

export default function Navbar() {
  const { user, characters, logout } = useUser();
  const [active, setActive] = useState("hotels");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      for (const section of [...sections].reverse()) {
        const el = document.getElementById(section.id);
        if (el && el.getBoundingClientRect().top <= 120) {
          setActive(section.id);
          break;
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClick = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 border-b-3 ${
        scrolled ? "bg-bg-base" : "bg-bg-base/90"
      } border-accent-black`}
    >
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex items-center gap-2"
        >
          <span className="font-display text-lg tracking-wider text-accent-black">
            CHINA TRIP
          </span>
          <span className="w-2 h-2 bg-accent-pink" />
        </button>

        <div className="flex items-center gap-1">
          {user && (
            <span className="font-mono text-[10px] text-text-muted mr-2 border-r-2 border-accent-black/20 pr-2 flex items-center gap-1.5">
              {characters[user.characterIndex].img} {user.name}
              <button
                onClick={logout}
                className="font-mono text-[9px] font-bold border border-accent-black/30 px-1.5 py-0.5 text-bg-base/50 hover:text-accent-pink hover:border-accent-pink transition-colors"
              >
                ВЫЙТИ
              </button>
            </span>
          )}
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => handleClick(s.id)}
              className={`px-3 py-1.5 font-mono text-xs font-bold tracking-wider transition-all duration-150 ${
                active === s.id
                  ? "bg-accent-pink text-white"
                  : "text-accent-black hover:bg-accent-black hover:text-bg-base"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
