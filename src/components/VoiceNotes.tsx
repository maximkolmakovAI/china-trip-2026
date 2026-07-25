"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useUser } from "@/lib/useUser";

interface VoiceNote {
  id: string;
  name: string;
  audioBase64: string;
  transcript: string;
  duration: number;
  createdAt: string;
}

const MAX_RECORDING_MS = 30000;

function storageKey(userId: string) { return `china_trip_voice_${userId}`; }

function loadNotes(userId: string): VoiceNote[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(storageKey(userId)) || "[]"); } catch { return []; }
}

function saveNotes(userId: string, notes: VoiceNote[]) {
  localStorage.setItem(storageKey(userId), JSON.stringify(notes));
}

// Newton API — token provided, stored in localStorage on first load
const NEWTON_API_URL = "https://api.newton.ag/v1/audio/transcriptions";
const NEWTON_DEFAULT_TOKEN = "NU4gdYvAZbDCQHfMDmsjo4WoAzg8Pv2wDUlE0Suxgtg";

async function transcribeWithNewton(audioBlob: Blob, apiKey: string): Promise<string> {
  const formData = new FormData();
  formData.append("file", audioBlob, "recording.webm");
  formData.append("model", "whisper-1");

  const res = await fetch(NEWTON_API_URL, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}` },
    body: formData,
  });

  if (!res.ok) throw new Error(`Newton API error: ${res.status}`);
  const data = await res.json();
  return data.text || "";
}

export default function VoiceNotes() {
  const { user } = useUser();
  const userId = user?.name || "anonymous";
  const [notes, setNotes] = useState<VoiceNote[]>([]);
  const [recording, setRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const [transcribing, setTranscribing] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState("");
  const [showKeyInput, setShowKeyInput] = useState(false);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);
  const timer = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  useEffect(() => {
    setNotes(loadNotes(userId));
  }, [userId]);

  useEffect(() => {
    const saved = localStorage.getItem("china_trip_newton_key");
    if (saved) {
      setApiKey(saved);
    } else if (NEWTON_DEFAULT_TOKEN) {
      // Auto-seed the default token on first load
      localStorage.setItem("china_trip_newton_key", NEWTON_DEFAULT_TOKEN);
      setApiKey(NEWTON_DEFAULT_TOKEN);
    }
  }, []);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream, { mimeType: "audio/webm" });
      mediaRecorder.current = mr;
      chunks.current = [];

      mr.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.current.push(e.data);
      };

      mr.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        clearInterval(timer.current);
        setRecording(false);

        const blob = new Blob(chunks.current, { type: "audio/webm" });
        if (blob.size < 1000) return;

        const reader = new FileReader();
        reader.onload = () => {
          const base64 = reader.result as string;
          const newNote: VoiceNote = {
            id: Date.now().toString(36),
            name: `Запись ${new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })}`,
            audioBase64: base64,
            transcript: "",
            duration: duration,
            createdAt: new Date().toLocaleDateString("ru-RU"),
          };
          const all = [newNote, ...notes];
          setNotes(all);
          saveNotes(userId, all);
          setDuration(0);
        };
        reader.readAsDataURL(blob);
      };

      mr.start(100);
      setRecording(true);
      let sec = 0;
      timer.current = setInterval(() => {
        sec++;
        setDuration(sec);
        if (sec >= MAX_RECORDING_MS / 1000) {
          mr.stop();
        }
      }, 1000);
    } catch (err) {
      console.error("Microphone error:", err);
    }
  }, [notes, userId, duration]);

  const stopRecording = useCallback(() => {
    if (mediaRecorder.current && mediaRecorder.current.state !== "inactive") {
      mediaRecorder.current.stop();
    }
  }, []);

  const deleteNote = (id: string) => {
    const all = notes.filter((n) => n.id !== id);
    setNotes(all);
    saveNotes(userId, all);
  };

  const transcribe = async (note: VoiceNote) => {
    if (!apiKey) { setShowKeyInput(true); return; }
    setTranscribing(note.id);
    try {
      const base64Response = await fetch(note.audioBase64);
      const blob = await base64Response.blob();
      const text = await transcribeWithNewton(blob, apiKey);
      const all = notes.map((n) => (n.id === note.id ? { ...n, transcript: text } : n));
      setNotes(all);
      saveNotes(userId, all);
    } catch (err) {
      console.error("Transcription error:", err);
    }
    setTranscribing(null);
  };

  const saveApiKey = () => {
    localStorage.setItem("china_trip_newton_key", apiKey);
    setShowKeyInput(false);
  };

  const formatDuration = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  return (
    <section id="voicenotes" className="pt-28 -mt-16">
      <div className="flex items-center gap-4 mb-2">
        <h2 className="font-display text-4xl md:text-5xl text-accent-black tracking-tight">
          ГОЛОС
        </h2>
        <span className="font-mono text-xs text-accent-pink font-bold border-2 border-accent-pink px-2 py-0.5">
          ЗАМЕТКИ
        </span>
      </div>
      <p className="font-mono text-sm text-text-secondary mb-6">
        Запишите идею голосом. Транскрибация через Newton AI (нужен API-ключ).
      </p>

      {/* API Key input */}
      {showKeyInput && (
        <div className="brutal-card p-3 mb-4 flex items-center gap-2">
          <input type="password" placeholder="Newton API Key" value={apiKey} onChange={e => setApiKey(e.target.value)}
            className="flex-1 border-2 border-accent-black p-2 font-mono text-sm bg-surface" />
          <button onClick={saveApiKey}
            className="font-mono text-xs font-bold border-2 border-accent-black px-3 py-2 hover:bg-accent-black hover:text-bg-base transition-colors">
            СОХРАНИТЬ
          </button>
        </div>
      )}

      {/* Record button */}
      <div className="brutal-card p-4 mb-6">
        <div className="flex items-center gap-4">
          {!recording ? (
            <button onClick={startRecording}
              className="font-mono text-sm font-bold tracking-wider px-6 py-3 border-2 border-accent-black bg-accent-pink text-white hover:bg-accent-black transition-colors">
              🎤 ЗАПИСАТЬ
            </button>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                <span className="font-mono text-sm font-bold text-red-500">{formatDuration(duration)}</span>
              </div>
              <button onClick={stopRecording}
                className="font-mono text-sm font-bold tracking-wider px-6 py-3 border-2 border-accent-black bg-accent-black text-white hover:bg-bg-base hover:text-accent-black transition-colors">
                ⏹ СТОП
              </button>
            </>
          )}
          {recording && (
            <span className="font-mono text-[10px] text-text-muted">Говорите до 30 секунд</span>
          )}
        </div>
      </div>

      {/* Notes list */}
      {notes.length === 0 && (
        <p className="font-mono text-xs text-text-muted italic">Нет голосовых заметок</p>
      )}

      <div className="space-y-3">
        {notes.map((note) => (
          <div key={note.id} className="brutal-card p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="font-display text-base text-accent-black">{note.name}</span>
                <span className="font-mono text-[10px] text-text-muted">{note.createdAt}</span>
                <span className="font-mono text-[10px] text-text-muted">· {formatDuration(note.duration)}</span>
              </div>
              <div className="flex gap-2">
                {note.audioBase64 && (
                  <audio controls src={note.audioBase64} className="h-8 w-32" />
                )}
                {!note.transcript && (
                  <button onClick={() => transcribe(note)} disabled={transcribing === note.id}
                    className="font-mono text-[10px] font-bold border-2 border-accent-black px-2 py-1 hover:bg-accent-black hover:text-bg-base transition-colors disabled:opacity-40">
                    {transcribing === note.id ? "..." : "AI → ТЕКСТ"}
                  </button>
                )}
                <button onClick={() => deleteNote(note.id)}
                  className="font-mono text-[10px] font-bold border-2 border-accent-pink text-accent-pink px-2 py-1 hover:bg-accent-pink hover:text-white transition-colors">
                  ✕
                </button>
              </div>
            </div>
            {note.transcript && (
              <pre className="mt-2 font-mono text-xs text-text-secondary bg-bg-secondary p-3 whitespace-pre-wrap border-2 border-accent-black/20">
                {note.transcript}
              </pre>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
