"use client";

import { HotelTag, TAG_LABELS } from "@/lib/types";

interface FilterBarProps {
  active: HotelTag | null;
  onChange: (tag: HotelTag | null) => void;
}

const tags: HotelTag[] = ["budget", "wow", "unique", "tech", "practical"];

export default function FilterBar({ active, onChange }: FilterBarProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onChange(null)}
        className={`font-mono text-xs font-bold tracking-wider px-3 py-1.5 border-2 transition-all duration-150 ${
          active === null
            ? "bg-accent-black text-bg-base border-accent-black"
            : "bg-transparent text-accent-black border-accent-black hover:bg-accent-black hover:text-bg-base"
        }`}
      >
        ВСЕ
      </button>
      {tags.map((tag) => (
        <button
          key={tag}
          onClick={() => onChange(active === tag ? null : tag)}
          className={`font-mono text-xs font-bold tracking-wider px-3 py-1.5 border-2 transition-all duration-150 ${
            active === tag
              ? "bg-accent-pink text-white border-accent-black"
              : "bg-transparent text-accent-black border-accent-black hover:bg-accent-black hover:text-bg-base"
          }`}
        >
          {TAG_LABELS[tag].toUpperCase()}
        </button>
      ))}
    </div>
  );
}
