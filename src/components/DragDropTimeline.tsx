"use client";

import { useState, useEffect, useCallback } from "react";
import { useUser } from "@/lib/useUser";
import { ProgramDay } from "@/lib/types";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";

interface DragDropTimelineProps {
  program: ProgramDay[];
}

function storageKey(userId: string) { return `china_trip_program_order_${userId}`; }

function SortableDay({ day, index }: { day: ProgramDay; index: number }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: day.day,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : 1,
    animationDelay: `${index * 40}ms`,
  };

  return (
    <div ref={setNodeRef} style={style} className="mb-3 animate-slide-up">
      <div className={`brutal-card p-4 ${isDragging ? "border-accent-pink" : ""}`}>
        <div className="flex items-center gap-3 mb-2">
          <button {...attributes} {...listeners}
            className="cursor-grab active:cursor-grabbing font-mono text-sm text-text-muted hover:text-accent-black px-1">
            ⠿
          </button>
          <span className="font-display text-lg text-accent-black">День {day.day}</span>
          <span className="font-mono text-xs text-text-muted">{day.date} · {day.weekday}</span>
          <span className="font-mono text-[10px] font-bold px-2 py-0.5 border-2 border-accent-black">
            {day.city}
          </span>
        </div>

        <div className="ml-8 space-y-1">
          {day.items.map((item, i) => (
            <div key={i} className="flex items-start gap-2">
              <input
                type="checkbox"
                defaultChecked={item.done}
                className="mt-0.5 w-3.5 h-3.5 accent-accent-pink"
              />
              <span className={`text-xs ${item.done ? "line-through text-text-muted" : "text-text-secondary"} ${item.new ? "font-bold text-accent-black" : ""}`}>
                {item.text}
                {item.new && <span className="ml-1.5 font-mono text-[10px] text-accent-pink border border-accent-pink px-1">NEW</span>}
              </span>
            </div>
          ))}
        </div>

        {day.notes && (
          <p className="ml-8 mt-2 font-mono text-[10px] text-text-muted border-t border-accent-black/20 pt-2">
            ⚡ {day.notes}
          </p>
        )}
      </div>
    </div>
  );
}

export default function DragDropTimeline({ program }: DragDropTimelineProps) {
  const { user } = useUser();
  const userId = user?.name || "anonymous";
  const [items, setItems] = useState<number[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const saved = loadOrder(userId);
    if (saved && saved.length === program.length) {
      setItems(saved);
    } else {
      setItems(program.map((d) => d.day));
    }
    setLoaded(true);
  }, [program, userId]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setItems((prev) => {
        const oldIdx = prev.indexOf(Number(active.id));
        const newIdx = prev.indexOf(Number(over.id));
        const next = [...prev];
        next.splice(oldIdx, 1);
        next.splice(newIdx, 0, Number(active.id));
        saveOrder(userId, next);
        return next;
      });
    }
  }, [userId]);

  const resetOrder = () => {
    const original = program.map((d) => d.day);
    setItems(original);
    saveOrder(userId, original);
  };

  if (!loaded) return null;

  const sorted = items
    .map((dayNum) => program.find((d) => d.day === dayNum))
    .filter(Boolean) as ProgramDay[];

  return (
    <section id="timeline" className="pt-28 -mt-16">
      <div className="flex items-center gap-4 mb-2">
        <h2 className="font-display text-4xl md:text-5xl text-accent-black tracking-tight">
          ТАЙМЛАЙН
        </h2>
        <span className="font-mono text-xs text-accent-pink font-bold border-2 border-accent-pink px-2 py-0.5">
          DRAG & DROP
        </span>
      </div>
      <p className="font-mono text-sm text-text-secondary mb-6">
        Перетаскивайте дни, чтобы изменить порядок. Порядок сохраняется в браузере.
      </p>

      <div className="flex justify-end mb-4">
        <button
          onClick={resetOrder}
          className="font-mono text-xs font-bold tracking-wider px-4 py-2 border-2 border-accent-black hover:bg-accent-black hover:text-bg-base transition-colors"
        >
          СБРОСИТЬ ПОРЯДОК
        </button>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd} modifiers={[restrictToVerticalAxis]}>
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          {sorted.map((day, i) => (
            <SortableDay key={day.day} day={day} index={i} />
          ))}
        </SortableContext>
      </DndContext>
    </section>
  );
}

function loadOrder(userId: string): number[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(storageKey(userId));
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveOrder(userId: string, order: number[]) {
  try {
    localStorage.setItem(storageKey(userId), JSON.stringify(order));
  } catch {}
}
