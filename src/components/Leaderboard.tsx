"use client";

import { Hotel } from "@/lib/types";
import { useVotes } from "@/lib/useVotes";

interface LeaderboardProps {
  hotels: Hotel[];
}

export default function Leaderboard({ hotels }: LeaderboardProps) {
  const { votes } = useVotes();

  const sorted = [...hotels]
    .map((h) => ({ ...h, voteCount: votes[h.id] || 0 }))
    .sort((a, b) => b.voteCount - a.voteCount)
    .slice(0, 3);

  if (sorted.every((h) => h.voteCount === 0)) return null;

  const places = ["1st", "2nd", "3rd"];

  return (
    <div className="brutal-card p-5 mb-10">
      <div className="flex items-center gap-3 mb-5">
        <span className="font-display text-2xl text-accent-pink">★</span>
        <h3 className="font-display text-xl text-accent-black tracking-tight">
          ЛИДЕРЫ ГОЛОСОВАНИЯ
        </h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {sorted.map((hotel, i) => (
          <div
            key={hotel.id}
            className={`border-2 p-3 animate-slide-up ${
              i === 0
                ? "bg-accent-black text-bg-base border-accent-black"
                : "bg-surface text-accent-black border-accent-black"
            }`}
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <span className="font-mono text-xs font-bold tracking-wider">
              {places[i]}
            </span>
            <p className={`font-display text-base leading-tight mt-1 ${i === 0 ? "text-bg-base" : "text-accent-black"}`}>
              {hotel.name}
            </p>
            <p className={`font-mono text-xs mt-1 ${i === 0 ? "text-accent-pink" : "text-text-muted"}`}>
              {hotel.voteCount} голос{hotel.voteCount !== 1 ? "ов" : ""}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
