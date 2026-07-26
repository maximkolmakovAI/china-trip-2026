"use client";

import { useState, useEffect } from "react";
import { useUser } from "@/lib/useUser";

interface Feedback {
  id: string;
  text: string;
  type: "idea" | "bug";
  createdAt: string;
  user: string;
}

function storageKey(uid: string) { return `china_trip_feedback_${uid}`; }

export default function FeedbackButton() {
  const { user } = useUser();
  const userId = user?.name || "anonymous";
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<Feedback[]>([]);
  const [text, setText] = useState("");
  const [type, setType] = useState<"idea" | "bug">("idea");

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem(storageKey(userId));
      if (raw) setItems(JSON.parse(raw));
    } catch {}
  }, [userId]);

  const save = (list: Feedback[]) => {
    setItems(list);
    localStorage.setItem(storageKey(userId), JSON.stringify(list));
  };

  const submit = () => {
    if (!text.trim()) return;
    const fb: Feedback = {
      id: Date.now().toString(36),
      text: text.trim(),
      type,
      createdAt: new Date().toLocaleDateString("ru-RU"),
      user: userId,
    };
    save([fb, ...items]);
    setText("");
  };

  const remove = (id: string) => save(items.filter((i) => i.id !== id));

  return (
    <>
      <button onClick={() => setOpen(!open)}
        className="fixed right-4 top-1/2 -translate-y-1/2 z-50 w-12 h-12 border-3 border-accent-black bg-accent-pink text-white font-display text-2xl flex items-center justify-center hover:bg-accent-black hover:border-accent-pink transition-colors shadow-[4px_4px_0_#1A1A1A]">
        💡
      </button>

      {open && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-accent-black/60 backdrop-blur-sm" onClick={() => setOpen(false)}>
          <div className="bg-bg-base border-4 border-accent-black w-full max-w-md max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-bg-base border-b-2 border-accent-black p-4 flex items-center justify-between gap-4 z-10">
              <div>
                <span className="font-mono text-[10px] font-bold text-accent-pink border-2 border-accent-pink px-2 py-0.5">ФИДБЕК</span>
                <h3 className="font-display text-2xl text-accent-black tracking-tight mt-1">ИДЕИ И БАГИ</h3>
              </div>
              <button onClick={() => setOpen(false)}
                className="font-mono text-sm font-bold border-2 border-accent-black px-2 py-1 hover:bg-accent-black hover:text-bg-base transition-colors shrink-0">
                ✕
              </button>
            </div>

            <div className="p-4 space-y-4">
              <div className="brutal-card p-4">
                <p className="font-mono text-xs text-text-secondary mb-3">
                  Напиши идею по улучшению сайта или баг — я их проверяю и дорабатываю.
                </p>
                <div className="flex gap-2 mb-3">
                  <button onClick={() => setType("idea")}
                    className={`font-mono text-xs font-bold px-3 py-1.5 border-2 transition-all ${
                      type === "idea" ? "bg-accent-black text-bg-base border-accent-black" : "border-accent-black hover:bg-accent-black hover:text-bg-base"
                    }`}>
                    💡 ИДЕЯ
                  </button>
                  <button onClick={() => setType("bug")}
                    className={`font-mono text-xs font-bold px-3 py-1.5 border-2 transition-all ${
                      type === "bug" ? "bg-accent-pink text-white border-accent-pink" : "border-accent-pink hover:bg-accent-pink hover:text-white"
                    }`}>
                    🐛 БАГ
                  </button>
                </div>
                <textarea value={text} onChange={(e) => setText(e.target.value)} rows={3}
                  placeholder={type === "idea" ? "Что добавить/улучшить?" : "Что сломалось?"}
                  className="w-full border-2 border-accent-black p-3 font-mono text-sm resize-none bg-surface" />
                <button onClick={submit} disabled={!text.trim()}
                  className="mt-2 font-mono text-xs font-bold tracking-wider px-4 py-2 border-2 border-accent-black bg-accent-black text-bg-base hover:bg-accent-pink hover:border-accent-pink transition-colors disabled:opacity-30">
                  ОТПРАВИТЬ
                </button>
              </div>

              {items.length === 0 && (
                <p className="font-mono text-xs text-text-muted italic text-center py-6">Пока нет фидбека</p>
              )}

              <div className="space-y-2">
                {items.map((fb) => (
                  <div key={fb.id} className="brutal-border-thin p-3 bg-surface">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`font-mono text-[10px] font-bold px-1.5 py-0.5 border-2 ${
                        fb.type === "bug" ? "text-accent-pink border-accent-pink" : "text-accent-black border-accent-black"
                      }`}>
                        {fb.type === "bug" ? "🐛" : "💡"}
                      </span>
                      <span className="font-mono text-[10px] text-text-muted">{fb.createdAt}</span>
                      <span className="font-mono text-[10px] text-text-muted">· {fb.user}</span>
                    </div>
                    <p className="font-mono text-xs text-text-secondary">{fb.text}</p>
                    <button onClick={() => remove(fb.id)}
                      className="mt-1 font-mono text-[10px] text-text-muted hover:text-accent-pink transition-colors">
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
