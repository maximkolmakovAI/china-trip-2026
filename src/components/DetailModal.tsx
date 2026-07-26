"use client";

import { useEffect, useCallback, useState } from "react";
import { Hotel } from "@/lib/types";
import { img } from "@/lib/img";

export type DetailItemType = "hotel" | "program" | "idea" | "ai";

export interface DetailData {
  type: DetailItemType;
  title: string;
  subtitle?: string;
  description?: string;
  pros?: string[];
  cons?: string[];
  insight?: string;
  wow?: string;
  link?: string;
  price?: number | string;
  tags?: string[];
  city?: string;
  day?: number;
  image?: string;
  images?: string[];
}

interface DetailModalProps {
  data: DetailData | null;
  onClose: () => void;
}

export default function DetailModal({ data, onClose }: DetailModalProps) {
  const [galleryIdx, setGalleryIdx] = useState(0);

  const handleKey = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") onClose();
    if (e.key === "ArrowLeft") setGalleryIdx((i) => Math.max(0, i - 1));
    if (e.key === "ArrowRight") setGalleryIdx((i) => Math.min((data?.images?.length || 1) - 1, i + 1));
  }, [onClose, data]);

  useEffect(() => {
    if (data) {
      setGalleryIdx(0);
      document.addEventListener("keydown", handleKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [data, handleKey]);

  if (!data) return null;

  const typeLabel = {
    hotel: "ОТЕЛЬ",
    program: "ПРОГРАММА",
    idea: "ИДЕЯ",
    ai: "ИДЕЯ ОТ ИИ",
  };

  // Collect all images: explicit images array, or single image
  const allImages = data.images && data.images.length > 0
    ? data.images.map(im => img(im))
    : data.image
      ? [img(data.image)]
      : [];

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-accent-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-bg-base border-4 border-accent-black w-full max-w-lg max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="sticky top-0 bg-bg-base border-b-2 border-accent-black p-4 flex items-start justify-between gap-4 z-10">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-[10px] font-bold text-accent-pink border-2 border-accent-pink px-2 py-0.5">
                {typeLabel[data.type]}
              </span>
              {data.city && (
                <span className="font-mono text-[10px] text-text-muted">{data.city}</span>
              )}
              {data.day && (
                <span className="font-mono text-[10px] text-text-muted">День {data.day}</span>
              )}
            </div>
            <h3 className="font-display text-2xl text-accent-black tracking-tight">{data.title}</h3>
            {data.subtitle && (
              <p className="font-mono text-xs text-text-muted mt-1">{data.subtitle}</p>
            )}
          </div>
          <button onClick={onClose}
            className="font-mono text-sm font-bold border-2 border-accent-black px-2 py-1 hover:bg-accent-black hover:text-bg-base transition-colors shrink-0">
            ✕
          </button>
        </div>

        <div className="p-4 space-y-5">
          {/* Gallery — main image + thumbnails */}
          {allImages.length > 0 && (
            <div className="space-y-2">
              {/* Main image */}
              <div className="relative border-2 border-accent-black bg-bg-secondary aspect-video overflow-hidden group">
                <img
                  src={allImages[galleryIdx]}
                  alt={`${data.title} ${galleryIdx + 1}`}
                  className="w-full h-full object-cover"
                />
                {/* Navigation arrows */}
                {allImages.length > 1 && (
                  <>
                    {galleryIdx > 0 && (
                      <button
                        onClick={() => setGalleryIdx((i) => Math.max(0, i - 1))}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-accent-black/70 text-bg-base w-8 h-8 flex items-center justify-center font-mono font-bold hover:bg-accent-pink transition-colors"
                      >
                        ‹
                      </button>
                    )}
                    {galleryIdx < allImages.length - 1 && (
                      <button
                        onClick={() => setGalleryIdx((i) => Math.min(allImages.length - 1, i + 1))}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-accent-black/70 text-bg-base w-8 h-8 flex items-center justify-center font-mono font-bold hover:bg-accent-pink transition-colors"
                      >
                        ›
                      </button>
                    )}
                    {/* Counter */}
                    <div className="absolute bottom-2 right-2 bg-accent-black/70 text-bg-base font-mono text-[10px] px-2 py-0.5">
                      {galleryIdx + 1} / {allImages.length}
                    </div>
                  </>
                )}
              </div>
              {/* Thumbnails */}
              {allImages.length > 1 && (
                <div className="flex gap-1.5 overflow-x-auto">
                  {allImages.map((im, i) => (
                    <button
                      key={i}
                      onClick={() => setGalleryIdx(i)}
                      className={`shrink-0 w-16 h-12 border-2 overflow-hidden transition-all ${
                        i === galleryIdx
                          ? "border-accent-pink scale-105"
                          : "border-accent-black opacity-60 hover:opacity-100"
                      }`}
                    >
                      <img src={im} alt={`thumb ${i + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Description */}
          {data.description && (
            <div>
              <p className="font-mono text-xs text-text-secondary leading-relaxed">{data.description}</p>
            </div>
          )}

          {/* Pros */}
          {data.pros && data.pros.length > 0 && (
            <div>
              <h4 className="font-mono text-xs font-bold text-success tracking-wider mb-2">✓ ПЛЮСЫ</h4>
              <ul className="space-y-1">
                {data.pros.map((p, i) => (
                  <li key={i} className="font-mono text-xs text-text-secondary flex gap-2">
                    <span className="text-success shrink-0">+</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Cons */}
          {data.cons && data.cons.length > 0 && (
            <div>
              <h4 className="font-mono text-xs font-bold text-danger tracking-wider mb-2">✗ МИНУСЫ</h4>
              <ul className="space-y-1">
                {data.cons.map((c, i) => (
                  <li key={i} className="font-mono text-xs text-text-secondary flex gap-2">
                    <span className="text-danger shrink-0">−</span>
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Wow/Insight */}
          {data.wow && (
            <div className="bg-accent-pink/10 border-l-4 border-accent-pink p-3">
              <p className="font-mono text-xs font-bold text-accent-pink">⚡ ВАУ-ЭФФЕКТ</p>
              <p className="font-mono text-xs text-text-secondary mt-1">{data.wow}</p>
            </div>
          )}
          {!data.wow && data.insight && (
            <div className="bg-bg-secondary border-l-4 border-accent-black p-3">
              <p className="font-mono text-xs font-bold text-accent-black">💡 ИНСАЙТ</p>
              <p className="font-mono text-xs text-text-secondary mt-1">{data.insight}</p>
            </div>
          )}

          {/* Tags */}
          {data.tags && data.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {data.tags.map((t, i) => (
                <span key={i} className="font-mono text-[10px] font-bold border-2 border-accent-black px-2 py-0.5">{t}</span>
              ))}
            </div>
          )}

          {/* Price */}
          {data.price && (
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-accent-black">Цена:</span>
              <span className="font-mono text-sm text-accent-pink font-bold">¥{data.price}</span>
            </div>
          )}

          {/* Link */}
          {data.link && (
            <a href={data.link} target="_blank" rel="noopener noreferrer"
              className="block font-mono text-xs font-bold text-center border-2 border-accent-black bg-accent-black text-bg-base px-4 py-3 hover:bg-accent-pink hover:border-accent-pink transition-colors">
              🔗 ОТКРЫТЬ ССЫЛКУ
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
