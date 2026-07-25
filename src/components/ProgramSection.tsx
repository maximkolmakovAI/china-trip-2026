"use client";

import { ProgramDay } from "@/lib/types";
import DayCard from "./DayCard";

interface ProgramSectionProps {
  program: ProgramDay[];
}

export default function ProgramSection({ program }: ProgramSectionProps) {
  return (
    <section id="program" className="pt-28 -mt-16">
      <div className="flex items-center gap-4 mb-2">
        <h2 className="font-display text-4xl md:text-5xl text-accent-black tracking-tight">
          ПРОГРАММА
        </h2>
        <span className="font-mono text-xs text-accent-pink font-bold border-2 border-accent-pink px-2 py-0.5">
          16 ДНЕЙ
        </span>
      </div>
      <p className="font-mono text-sm text-text-secondary mb-10">
        <span className="font-bold text-accent-pink">NEW</span> — новые идеи для этой поездки.
      </p>

      <div>
        {program.map((day, i) => (
          <DayCard key={day.day} day={day} index={i} />
        ))}
      </div>
    </section>
  );
}
