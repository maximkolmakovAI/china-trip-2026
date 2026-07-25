"use client";

import { useState, useEffect } from "react";
import { useUser } from "@/lib/useUser";

interface DocEntry {
  id: string;
  name: string;
  content: string;
  passwordHash: string;
  createdAt: string;
}

function storageKey(userId: string) { return `china_trip_docs_${userId}`; }

function loadDocs(userId: string): DocEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(storageKey(userId));
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveDocs(userId: string, docs: DocEntry[]) {
  localStorage.setItem(storageKey(userId), JSON.stringify(docs));
}

function simpleHash(s: string): string {
  let hash = 0;
  for (let i = 0; i < s.length; i++) {
    const char = s.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return "h" + Math.abs(hash).toString(36);
}

export default function DocumentVault() {
  const { user } = useUser();
  const userId = user?.name || "anonymous";
  const [docs, setDocs] = useState<DocEntry[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [password, setPassword] = useState("");
  const [unlockId, setUnlockId] = useState<string | null>(null);
  const [unlockPw, setUnlockPw] = useState("");
  const [unlockError, setUnlockError] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    setDocs(loadDocs(userId));
  }, [userId]);

  const addDoc = () => {
    if (!name.trim() || !content.trim() || !password.trim()) {
      setMsg("Заполните все поля"); setTimeout(() => setMsg(""), 2000);
      return;
    }
    const newDoc: DocEntry = {
      id: Date.now().toString(36),
      name: name.trim(),
      content: content.trim(),
      passwordHash: simpleHash(password),
      createdAt: new Date().toLocaleDateString("ru-RU"),
    };
    const all = [...docs, newDoc];
    setDocs(all);
    saveDocs(userId, all);
    setName(""); setContent(""); setPassword("");
    setShowAdd(false);
    setMsg("Документ добавлен"); setTimeout(() => setMsg(""), 2000);
  };

  const deleteDoc = (id: string) => {
    const all = docs.filter((d) => d.id !== id);
    setDocs(all);
    saveDocs(userId, all);
    if (unlockId === id) { setUnlockId(null); setUnlockPw(""); }
  };

  const tryUnlock = () => {
    const doc = docs.find((d) => d.id === unlockId);
    if (doc && doc.passwordHash === simpleHash(unlockPw)) {
      setUnlockError("");
    } else {
      setUnlockError("Неверный пароль");
    }
  };

  return (
    <section id="documents" className="pt-28 -mt-16">
      <div className="flex items-center gap-4 mb-2">
        <h2 className="font-display text-4xl md:text-5xl text-accent-black tracking-tight">
          СЕЙФ
        </h2>
        <span className="font-mono text-xs text-accent-pink font-bold border-2 border-accent-pink px-2 py-0.5">
          ДОКУМЕНТЫ
        </span>
      </div>
      <p className="font-mono text-sm text-text-secondary mb-6">
        Храните паспорта, билеты, страховку. Каждый документ защищён своим паролем. Видите только свои документы.
      </p>

      {msg && <p className="font-mono text-sm text-accent-pink mb-3">{msg}</p>}

      <button onClick={() => setShowAdd(!showAdd)}
        className="font-mono text-sm font-bold tracking-wider px-4 py-2 border-2 border-accent-black mb-5 hover:bg-accent-black hover:text-bg-base transition-colors">
        {showAdd ? "ОТМЕНА" : "+ ДОБАВИТЬ ДОКУМЕНТ"}
      </button>

      {showAdd && (
        <div className="brutal-card p-4 mb-5 space-y-3">
          <input placeholder="Название (напр. Паспорт Иванова)" value={name} onChange={e => setName(e.target.value)}
            className="w-full border-2 border-accent-black p-2 font-mono text-sm bg-surface" />
          <textarea placeholder="Содержание / данные" value={content} onChange={e => setContent(e.target.value)}
            className="w-full border-2 border-accent-black p-2 font-mono text-sm bg-surface" rows={3} />
          <input placeholder="Пароль на этот документ" type="password" value={password} onChange={e => setPassword(e.target.value)}
            className="w-full border-2 border-accent-black p-2 font-mono text-sm bg-surface" />
          <button onClick={addDoc}
            className="font-mono text-sm font-bold tracking-wider px-4 py-2 border-2 border-accent-black bg-accent-pink text-white hover:bg-accent-black transition-colors w-full">
            СОХРАНИТЬ
          </button>
        </div>
      )}

      {docs.length === 0 && (
        <p className="font-mono text-xs text-text-muted italic">Нет сохранённых документов</p>
      )}

      <div className="space-y-3">
        {docs.map((doc) => {
          const isUnlocked = unlockId === doc.id && doc.passwordHash === simpleHash(unlockPw);
          return (
            <div key={doc.id} className="brutal-card p-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <span className="font-display text-lg text-accent-black">{doc.name}</span>
                  <span className="font-mono text-[10px] text-text-muted ml-2">{doc.createdAt}</span>
                </div>
                <div className="flex gap-2">
                  {!isUnlocked && (
                    <button onClick={() => { setUnlockId(doc.id); setUnlockPw(""); setUnlockError(""); }}
                      className="font-mono text-[10px] font-bold border-2 border-accent-black px-2 py-1 hover:bg-accent-black hover:text-bg-base transition-colors">
                      ОТКРЫТЬ
                    </button>
                  )}
                  <button onClick={() => deleteDoc(doc.id)}
                    className="font-mono text-[10px] font-bold border-2 border-accent-pink text-accent-pink px-2 py-1 hover:bg-accent-pink hover:text-white transition-colors">
                    УДАЛИТЬ
                  </button>
                </div>
              </div>

              {!isUnlocked && unlockId === doc.id && (
                <div className="flex items-center gap-2 mt-2">
                  <input type="password" placeholder="Введите пароль" value={unlockPw} onChange={e => setUnlockPw(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && tryUnlock()}
                    className="flex-1 border-2 border-accent-black p-2 font-mono text-sm bg-surface" />
                  <button onClick={tryUnlock}
                    className="font-mono text-xs font-bold border-2 border-accent-black px-3 py-2 hover:bg-accent-black hover:text-bg-base transition-colors">
                    OK
                  </button>
                  {unlockError && <span className="font-mono text-xs text-accent-pink">{unlockError}</span>}
                </div>
              )}

              {isUnlocked && (
                <pre className="mt-2 font-mono text-xs text-text-secondary bg-bg-secondary p-3 whitespace-pre-wrap border-2 border-accent-black/20">
                  {doc.content}
                </pre>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
