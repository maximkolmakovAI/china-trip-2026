"use client";

import { useState, useEffect } from "react";
import { useUser } from "@/lib/useUser";

export default function AuthModal() {
  const { user, isLoggedIn, allUsers, register, login, logout, characters } = useUser();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [selectedChar, setSelectedChar] = useState<number>(-1);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);

  // Switch to register if no saved users, but only after mount (when allUsers is real)
  useEffect(() => {
    if (!ready) return;
    if (allUsers.length === 0 && mode !== "register") {
      setMode("register");
    }
  }, [allUsers, ready]);

  useEffect(() => {
    setReady(true);
  }, []);

  const handleSubmit = async () => {
    setError("");
    if (!name.trim()) { setError("Введите имя"); return; }
    if (selectedChar < 0) { setError("Выберите персонажа"); return; }

    setLoading(true);
    try {
      if (mode === "register") {
        const ok = await register(name.trim(), selectedChar);
        if (!ok) setError("Пользователь с таким именем уже есть");
      } else {
        const ok = await login(name.trim(), selectedChar);
        if (!ok) setError("Неверный персонаж. Попробуйте другого или зарегистрируйтесь");
      }
    } catch {
      setError("Ошибка сети. Попробуйте ещё раз");
    }
    setLoading(false);
  };

  if (isLoggedIn) {
    const char = characters[user!.characterIndex];
    return (
      <div className="flex items-center gap-2">
        <img
          src={char.portrait}
          alt={char.name}
          className="w-8 h-8 rounded-full object-cover border border-bg-base/30"
        />
        <span className="font-mono text-xs text-bg-base/70">
          {user!.name}
        </span>
        <button onClick={logout}
          className="font-mono text-[10px] font-bold border border-bg-base/30 px-2 py-1 text-bg-base/50 hover:text-bg-base hover:border-bg-base/70 transition-colors">
          ВЫЙТИ
        </button>
      </div>
    );
  }

  return (
    <div className="bg-accent-black/80 backdrop-blur fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="bg-bg-base border-4 border-accent-black w-full max-w-md p-6">
        <div className="flex items-center gap-3 mb-6">
          <h2 className="font-display text-3xl text-accent-black tracking-tight">
            {mode === "register" ? "РЕГИСТРАЦИЯ" : "ВХОД"}
          </h2>
          <span className="font-mono text-[10px] text-text-muted">Genshin Auth</span>
        </div>

        <p className="font-mono text-xs text-text-secondary mb-5">
          {mode === "register"
            ? "Придумайте имя и выберите персонажа Genshin Impact в качестве пароля."
            : "Выберите своё имя и укажите того же персонажа, что при регистрации."}
        </p>

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={mode === "register" ? "Ваше имя" : "Или выберите из списка"}
          className="w-full border-2 border-accent-black p-3 font-mono text-sm bg-surface mb-4"
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        />

        {mode === "login" && (
          allUsers.length > 0 ? (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {allUsers.map((u) => (
                <button
                  key={u.name}
                  onClick={() => setName(u.name)}
                  className={`flex items-center gap-1.5 font-mono text-xs border-2 px-2 py-1 transition-colors ${
                    name === u.name
                      ? "bg-accent-black text-bg-base border-accent-black"
                      : "border-accent-black hover:bg-accent-black hover:text-bg-base"
                  }`}
                >
                  <img
                    src={characters[u.characterIndex].portrait}
                    alt={characters[u.characterIndex].name}
                    className="w-5 h-5 rounded-full object-cover"
                  />
                  {u.name}
                </button>
              ))}
            </div>
          ) : (
            <p className="font-mono text-xs text-text-muted mb-4 italic">
              Нет пользователей. Зарегистрируйтесь первым!
            </p>
          )
        )}

        <div className="mb-5">
          <p className="font-mono text-[10px] text-text-muted tracking-wider mb-2">ВАШ ПЕРСОНАЖ (ПАРОЛЬ):</p>
          <div className="grid grid-cols-4 gap-1.5 max-h-64 overflow-y-auto">
            {characters.map((ch, i) => (
              <button
                key={i}
                onClick={() => setSelectedChar(i)}
                className={`text-center p-1 border-2 text-xs transition-all overflow-hidden ${
                  selectedChar === i
                    ? "bg-accent-pink text-white border-accent-black scale-105"
                    : "border-accent-black hover:bg-accent-black hover:text-bg-base"
                }`}
                title={ch.name}
              >
                <img
                  src={ch.portrait}
                  alt={ch.name}
                  className="w-full aspect-square object-cover mb-1"
                  loading="lazy"
                />
                <div className="font-mono text-[9px] truncate">{ch.name.split(" ")[0]}</div>
              </button>
            ))}
          </div>
        </div>

        {error && <p className="font-mono text-xs text-accent-pink mb-3">{error}</p>}

        <button onClick={handleSubmit}
          disabled={loading}
          className="w-full font-mono text-sm font-bold tracking-wider py-3 border-2 border-accent-black bg-accent-pink text-white hover:bg-accent-black transition-colors mb-3 disabled:opacity-50">
          {loading ? "..." : mode === "register" ? "ЗАРЕГИСТРИРОВАТЬСЯ" : "ВОЙТИ"}
        </button>

        <button onClick={() => { setMode(mode === "register" ? "login" : "register"); setError(""); }}
          className="w-full font-mono text-xs text-text-muted underline hover:text-accent-black transition-colors">
          {mode === "register" ? "Уже есть аккаунт? Войти" : "Нет аккаунта? Зарегистрироваться"}
        </button>
      </div>
    </div>
  );
}
