"use client";

import { useState } from "react";
import { Hotel, TAG_LABELS, HotelTag } from "@/lib/types";
import { useDetailModal } from "@/lib/useDetailModal";
import { img } from "@/lib/img";
import VoteButton from "./VoteButton";

interface HotelCardProps {
  hotel: Hotel;
  index: number;
  city: string;
}

export default function HotelCard({ hotel, index, city }: HotelCardProps) {
  const { open } = useDetailModal();
  const [imgIndex, setImgIndex] = useState(0);

  // Gallery: primary photo always. Additional _2/_3 only if they exist in /public.
  const allImages = [
    img(`/images/hotels/${city}/${hotel.id}.jpg`),
    img(`/images/hotels/${city}/${hotel.id}_2.jpg`),
    img(`/images/hotels/${city}/${hotel.id}_3.jpg`),
  ];

  // Track which images failed to load (runtime detection)
  const [failedImgs, setFailedImgs] = useState<Set<number>>(new Set());
  const images = allImages.filter((_, i) => !failedImgs.has(i));
  const effectiveIndex = Math.min(imgIndex, images.length - 1);

  const handleImgError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const el = e.currentTarget;
    const failedIdx = allImages.indexOf(el.src.replace(window.location.origin, ""));
    if (!el.dataset.fallback) {
      // First failure: try SVG fallback
      el.dataset.fallback = "1";
      if (failedIdx >= 0) {
        setFailedImgs((prev) => new Set(prev).add(failedIdx));
      }
      el.src = img(`/images/hotels/${city}/${hotel.id}.svg`);
    } else {
      // SVG also failed: hide dots for this index
      if (failedIdx >= 0) {
        setFailedImgs((prev) => new Set(prev).add(failedIdx));
      }
    }
  };

  const openDetail = () => {
    open({
      type: "hotel",
      title: hotel.name,
      subtitle: hotel.district,
      description: hotel.concept,
      pros: hotel.pros,
      cons: hotel.cons,
      insight: hotel.insight,
      wow: hotel.pros.find((p) => p.includes("Вид") || p.includes("атмосфер")) || undefined,
      link: hotel.link,
      price: hotel.price ? `${hotel.price.toLocaleString()} ₽` : undefined,
      tags: hotel.tags,
      city: city === "shanghai" ? "Шанхай" : "Пекин",
      images: [],
    });
  };

  return (
    <div
      className="brutal-card animate-slide-up cursor-pointer hover:border-accent-pink transition-colors"
      style={{ animationDelay: `${index * 80}ms` }}
      onClick={openDetail}
    >
      {/* Image area with gallery */}
      <div className="relative h-48 border-b-3 border-accent-black overflow-hidden bg-accent-black">
        <img
          src={images[effectiveIndex]}
          alt={hotel.name}
          onError={handleImgError}
          className="w-full h-full object-cover transition-opacity duration-300"
        />
        {images.length > 1 && (
        <div className="absolute bottom-2 right-2 flex gap-1" onClick={(e) => e.stopPropagation()}>
          {images.map((_, i) => (
            <button key={i}
              onClick={(e) => { e.stopPropagation(); setImgIndex(i); }}
              className={`w-2.5 h-2.5 border-2 transition-all ${
                effectiveIndex === i
                  ? "bg-accent-pink border-accent-black scale-125"
                  : "bg-white border-accent-black/50 hover:bg-accent-pink"
              }`}
            />
          ))}
        </div>
        )}
        <div className="absolute top-2 right-2" onClick={(e) => e.stopPropagation()}>
          <VoteButton itemId={hotel.id} />
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-display text-xl text-accent-black leading-tight mb-1">
              {hotel.name}
            </h3>
            <p className="font-mono text-xs text-text-muted">{hotel.district}</p>
          </div>
        </div>

        <p className="text-sm text-text-secondary leading-relaxed mb-4">
          {hotel.concept}
        </p>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {hotel.tags.map((tag) => (
            <span key={tag} className="brutal-tag">
              {TAG_LABELS[tag as HotelTag]}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <span className="font-display text-lg text-accent-black">
            {hotel.price ? `${hotel.price.toLocaleString()} ₽` : "ЦЕНА УТОЧНЯЕТСЯ"}
          </span>
          <span className="font-mono text-[10px] text-text-muted underline">
            подробнее →
          </span>
        </div>
      </div>
    </div>
  );
}
