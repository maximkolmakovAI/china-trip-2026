"use client";

import { IdeaItem } from "@/lib/types";
import { useDetailModal } from "@/lib/useDetailModal";
import VoteButton from "./VoteButton";
import HighlightLocations from "./HighlightLocations";

interface IdeaCardProps {
  idea: IdeaItem;
  city?: string;
}

export default function IdeaCard({ idea, city }: IdeaCardProps) {
  const { open } = useDetailModal();

  return (
    <div
      className="brutal-border-thin bg-surface p-4 animate-slide-up cursor-pointer hover:bg-bg-secondary transition-colors"
      onClick={() => open({
        type: "idea",
        title: idea.text,
        subtitle: city,
        description: idea.description || idea.note,
        city: city,
        link: idea.link,
        pros: idea.pros,
        cons: idea.cons,
        insight: idea.insight,
      })}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-accent-black">
            <HighlightLocations text={idea.text} city={city} />
          </p>
          {idea.description && (
            <p className="font-mono text-xs text-text-muted mt-1 line-clamp-2">{idea.description}</p>
          )}
          {idea.pros && idea.pros.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {idea.pros.slice(0, 2).map((p, i) => (
                <span key={i} className="font-mono text-[10px] text-success border border-success px-1.5 py-0.5">
                  + {p}
                </span>
              ))}
              {idea.pros.length > 2 && (
                <span className="font-mono text-[10px] text-text-muted">+{idea.pros.length - 2}</span>
              )}
            </div>
          )}
        </div>
        <div onClick={(e) => e.stopPropagation()}>
          <VoteButton itemId={idea.id} />
        </div>
      </div>
    </div>
  );
}
