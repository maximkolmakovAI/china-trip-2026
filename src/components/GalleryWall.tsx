"use client";

import { useState, useEffect, useRef } from "react";
import { useUser } from "@/lib/useUser";

interface Photo {
  id: string;
  data: string; // base64
  caption: string;
  author: string;
  date: string;
}

const STORAGE_KEY = "china_trip_gallery";
const MAX_PHOTOS = 30;
const MAX_DIMENSION = 1280;
const JPEG_QUALITY = 0.75;

function load(): Photo[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function save(photos: Photo[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(photos));
  } catch (e) {
    // localStorage quota exceeded — likely too many big photos
    console.warn("Gallery storage full, removing oldest photos");
    const trimmed = photos.slice(-Math.floor(MAX_PHOTOS / 2));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  }
}

/** Compress image to fit within MAX_DIMENSION and return as JPEG base64 */
function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
          if (width > height) {
            height = Math.round((height * MAX_DIMENSION) / width);
            width = MAX_DIMENSION;
          } else {
            width = Math.round((width * MAX_DIMENSION) / height);
            height = MAX_DIMENSION;
          }
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Canvas not supported"));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", JPEG_QUALITY));
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function GalleryWall() {
  const { user } = useUser();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [lightbox, setLightbox] = useState<Photo | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setPhotos(load());
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) save(photos);
  }, [photos, loaded]);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0 || !user) return;
    setUploading(true);

    const newPhotos: Photo[] = [];
    for (const file of Array.from(files)) {
      if (!file.type.startsWith("image/")) continue;
      try {
        const compressed = await compressImage(file);
        const photo: Photo = {
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          data: compressed,
          caption: "",
          author: user.name,
          date: new Date().toLocaleDateString("ru-RU"),
        };
        newPhotos.push(photo);
      } catch (e) {
        console.error("Failed to process image", e);
      }
    }

    setPhotos((prev) => [...prev, ...newPhotos].slice(-MAX_PHOTOS));
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  };

  const updateCaption = (id: string, caption: string) => {
    setPhotos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, caption } : p))
    );
  };

  const deletePhoto = (id: string) => {
    setPhotos((prev) => prev.filter((p) => p.id !== id));
    if (lightbox?.id === id) setLightbox(null);
  };

  if (!loaded) return null;

  const approxSize = Math.round(
    JSON.stringify(photos).length / 1024
  );

  return (
    <section id="gallery" className="pt-28 -mt-16">
      <div className="flex items-center gap-4 mb-2">
        <h2 className="font-display text-4xl md:text-5xl text-accent-black tracking-tight">
          ГАЛЕРЕЯ
        </h2>
        <span className="font-mono text-xs text-accent-pink font-bold border-2 border-accent-pink px-2 py-0.5">
          ФОТО
        </span>
      </div>
      <p className="font-mono text-sm text-text-secondary mb-6">
        Фото из поездки. Сохраняются локально (до {MAX_PHOTOS} шт., ~{approxSize} КБ).
      </p>

      {/* Upload area */}
      <div
        onClick={() => fileRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          e.currentTarget.classList.add("bg-bg-secondary");
        }}
        onDragLeave={(e) => {
          e.currentTarget.classList.remove("bg-bg-secondary");
        }}
        onDrop={(e) => {
          e.preventDefault();
          e.currentTarget.classList.remove("bg-bg-secondary");
          handleFiles(e.dataTransfer.files);
        }}
        className="brutal-card border-dashed p-8 text-center cursor-pointer mb-4 hover:bg-bg-secondary transition-colors"
      >
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        {uploading ? (
          <p className="font-mono text-sm text-accent-pink font-bold">
            ⏳ ОБРАБОТКА...
          </p>
        ) : (
          <>
            <p className="font-display text-2xl text-accent-black mb-1">
              + ДОБАВИТЬ ФОТО
            </p>
            <p className="font-mono text-xs text-text-muted">
              Клик или drag & drop · авто-сжатие до {MAX_DIMENSION}px
            </p>
          </>
        )}
      </div>

      {/* Photo grid */}
      {photos.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {[...photos].reverse().map((photo) => (
            <div
              key={photo.id}
              className="brutal-card overflow-hidden group relative"
            >
              <button
                onClick={() => setLightbox(photo)}
                className="block w-full aspect-square overflow-hidden bg-accent-black"
              >
                <img
                  src={photo.data}
                  alt={photo.caption || "Фото из поездки"}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </button>
              <div className="p-2">
                <input
                  type="text"
                  value={photo.caption}
                  onChange={(e) => updateCaption(photo.id, e.target.value)}
                  placeholder="Подпись..."
                  className="w-full font-mono text-[10px] text-accent-black bg-transparent border-b border-accent-black/20 focus:border-accent-pink outline-none pb-1"
                />
                <div className="flex items-center justify-between mt-1">
                  <span className="font-mono text-[9px] text-text-muted">
                    {photo.author} · {photo.date}
                  </span>
                  <button
                    onClick={() => deletePhoto(photo.id)}
                    className="font-mono text-[10px] text-accent-pink hover:text-red-600 font-bold"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="brutal-card p-8 text-center">
          <p className="font-mono text-sm text-text-muted">
            Галерея пуста. Добавьте первое фото!
          </p>
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[100] bg-accent-black/90 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <div
            className="relative max-w-5xl max-h-[90vh] w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={lightbox.data}
              alt={lightbox.caption || "Фото"}
              className="w-full h-full object-contain max-h-[80vh] mx-auto"
            />
            {lightbox.caption && (
              <p className="font-mono text-sm text-bg-base text-center mt-3">
                {lightbox.caption}
              </p>
            )}
            <div className="flex items-center justify-between mt-3">
              <span className="font-mono text-xs text-bg-base/60">
                {lightbox.author} · {lightbox.date}
              </span>
              <button
                onClick={() => setLightbox(null)}
                className="font-mono text-xs text-accent-pink border-2 border-accent-pink px-3 py-1 hover:bg-accent-pink hover:text-white transition-colors"
              >
                ЗАКРЫТЬ ✕
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
