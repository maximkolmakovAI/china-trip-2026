"use client";

import { useState, useMemo } from "react";
import { optimizeRoute, findCoord, distance } from "@/data/placeCoords";

interface RouteOptimizerProps {
  dayTitle: string;
  locations: string[];
}

export default function RouteOptimizer({ dayTitle, locations }: RouteOptimizerProps) {
  const [optimized, setOptimized] = useState(false);

  const result = useMemo(() => {
    const coords = locations.map((l) => ({ name: l, coord: findCoord(l) }));
    const known = coords.filter((c) => c.coord);
    const optimizedOrder = optimizeRoute(locations);

    let origDist = 0;
    let optDist = 0;
    for (let i = 0; i < known.length - 1; i++) {
      const a = known[i].coord!;
      const b = known[i + 1].coord!;
      origDist += distance(a, b);
    }
    const optCoords = optimizedOrder.map((n) => findCoord(n)).filter(Boolean) as any[];
    for (let i = 0; i < optCoords.length - 1; i++) {
      optDist += distance(optCoords[i], optCoords[i + 1]);
    }

    return { order: optimizedOrder, origDist, optDist, known: known.length, total: locations.length };
  }, [locations]);

  if (result.total < 2 || result.known < 2) return null;

  const display = optimized ? result.order : locations;
  const displayDist = optimized ? result.optDist : result.origDist;

  return (
    <div className="mt-2 border border-accent-black/20 p-2">
      <div className="flex items-center gap-2 mb-1">
        <button
          onClick={() => setOptimized(!optimized)}
          className={`font-mono text-[10px] font-bold tracking-wider px-2 py-1 border-2 transition-all ${
            optimized
              ? "bg-accent-pink text-white border-accent-pink"
              : "border-accent-black hover:bg-accent-black hover:text-bg-base"
          }`}
        >
          {optimized ? "ОПТИМ." : "ИСХОДН."}
        </button>
        <span className="font-mono text-[9px] text-text-muted">
          {Math.round(displayDist)} км
          {result.optDist < result.origDist && (
            <span className="text-green-600 ml-1">
              -{Math.round(result.origDist - result.optDist)} км
            </span>
          )}
        </span>
      </div>
      <div className="flex flex-wrap gap-1">
        {display.map((loc, i) => (
          <span key={i} className="font-mono text-[10px] border border-accent-black/30 px-1.5 py-0.5">
            {i + 1}. {loc}
          </span>
        ))}
      </div>
    </div>
  );
}
