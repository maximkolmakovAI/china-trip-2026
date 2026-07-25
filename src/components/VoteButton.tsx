"use client";

import { useState } from "react";
import { useVotes } from "@/lib/useVotes";

export default function VoteButton({ itemId }: { itemId: string }) {
  const { votes, userVotes, toggleVote } = useVotes();
  const [animating, setAnimating] = useState(false);

  const hasVoted = !!userVotes[itemId];
  const count = votes[itemId] || 0;

  const handleClick = async () => {
    setAnimating(true);
    await toggleVote(itemId);
    setTimeout(() => setAnimating(false), 400);
  };

  return (
    <button
      onClick={handleClick}
      className={`flex items-center gap-1.5 px-3 py-1.5 border-2 font-mono text-xs font-bold transition-all duration-150 ${
        hasVoted
          ? "bg-accent-pink text-white border-accent-black"
          : "bg-surface text-accent-black border-accent-black hover:bg-accent-black hover:text-bg-base"
      } ${animating ? "animate-heart-pop" : ""}`}
    >
      <span className={`transition-transform duration-200 ${hasVoted ? "scale-110" : ""}`}>
        ♥
      </span>
      <span className="tabular-nums min-w-[1.5ch] text-center">{count}</span>
    </button>
  );
}
