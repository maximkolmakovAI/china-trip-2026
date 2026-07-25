"use client";

import { useMemo } from "react";
import { ALL_COORDS } from "@/data/placeCoords";
import { useDetailModal } from "@/lib/useDetailModal";

const LOCATION_NAMES = ALL_COORDS.map((c) => c.name).sort((a, b) => b.length - a.length);

function escapeRegex(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export default function HighlightLocations({ text, city }: { text: string; city?: string }) {
  const { open } = useDetailModal();

  const parts = useMemo(() => {
    const result: { type: "text" | "loc"; value: string }[] = [];
    let remaining = text;
    while (remaining.length > 0) {
      let found: { name: string; idx: number } | null = null;
      for (const name of LOCATION_NAMES) {
        const idx = remaining.indexOf(name);
        if (idx >= 0 && (found === null || idx < found.idx)) {
          found = { name, idx };
        }
      }
      if (found) {
        if (found.idx > 0) result.push({ type: "text", value: remaining.slice(0, found.idx) });
        result.push({ type: "loc", value: found.name });
        remaining = remaining.slice(found.idx + found.name.length);
      } else {
        result.push({ type: "text", value: remaining });
        remaining = "";
      }
    }
    return result;
  }, [text]);

  return (
    <>
      {parts.map((p, i) =>
        p.type === "loc" ? (
          <button key={i} onClick={() => open({ type: "program", title: p.value, subtitle: city || "" })}
            className="underline decoration-accent-pink/50 hover:decoration-accent-pink decoration-2 underline-offset-2 hover:text-accent-pink transition-colors font-medium">
            {p.value}
          </button>
        ) : (
          <span key={i}>{p.value}</span>
        )
      )}
    </>
  );
}
