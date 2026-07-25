"use client";

import { useState, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import { ProgramDay, Hotel } from "@/lib/types";
import { findCoord, distance } from "@/data/placeCoords";
import { useDetailModal } from "@/lib/useDetailModal";
import tripData from "@/data/data.json";
import "leaflet/dist/leaflet.css";

interface PinMapProps {
  program: ProgramDay[];
}

const allHotels: { hotel: Hotel; city: string }[] = [
  ...(tripData as { hotels: { shanghai: Hotel[]; beijing: Hotel[] } }).hotels.shanghai.map((h) => ({ hotel: h, city: "shanghai" })),
  ...(tripData as { hotels: { shanghai: Hotel[]; beijing: Hotel[] } }).hotels.beijing.map((h) => ({ hotel: h, city: "beijing" })),
];

const CITY_MAP: Record<string, string> = {
  "Шанхай": "shanghai", "Нинбо": "ningbo", "Ханчжоу": "hangzhou",
  "Хуаншань": "huangshan", "Пекин": "beijing",
};

const CITY_COORDS: Record<string, [number, number]> = {
  shanghai: [31.2304, 121.4737], ningbo: [29.8683, 121.5440],
  hangzhou: [30.2741, 120.1551], huangshan: [30.1330, 118.1750],
  beijing: [39.9042, 116.4074],
};

function createIcon(color: string, label: string) {
  return L.divIcon({
    className: "",
    html: `<div style="background:${color};color:white;font-size:11px;font-weight:900;padding:3px 8px;border:3px solid #1A1A1A;white-space:nowrap;font-family:Impact,Arial Black,sans-serif;letter-spacing:0.5px;box-shadow:3px 3px 0 rgba(0,0,0,0.2)">${label}</div>`,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  });
}

function FlyToCenter({ center }: { center: [number, number] }) {
  useMap().flyTo(center, 12, { duration: 0.6 });
  return null;
}

export default function PinMap({ program }: PinMapProps) {
  const { open } = useDetailModal();
  const [filter, setFilter] = useState<string>("all");
  const [showRoutes, setShowRoutes] = useState(true);
  const [center, setCenter] = useState<[number, number]>([32.5, 119.0]);

  // Collect all route segments by day
  const DAY_COLORS = ["#E50071", "#1A1A1A", "#FF6600", "#0066FF", "#00AA55", "#AA00FF", "#FFAA00", "#00CCCC"];

  const routeData = useMemo(() => {
    const dayRoutes: { day: number; color: string; coords: [number, number][] }[] = [];
    const cityTransitions: { from: string; to: string; coords: [number, number][] }[] = [];
    const allPlaces: { name: string; type: string; coord: [number, number]; day?: number; city: string }[] = [];

    // Hotels
    for (const { hotel, city } of allHotels) {
      const coord = findCoord(hotel.district) || findCoord(city === "shanghai" ? "Шанхай" : "Пекин");
      if (coord) allPlaces.push({ name: hotel.name, type: "hotel", coord: [coord.lat, coord.lng], city });
    }

    // Program day routes
    let prevCityCoord: [number, number] | null = null;
    let prevCityKey = "";

    for (const day of program) {
      const cityKey = CITY_MAP[day.city] || "shanghai";
      const cityCoord = CITY_COORDS[cityKey];

      // City transition line
      if (prevCityCoord && prevCityKey !== cityKey) {
        cityTransitions.push({
          from: prevCityKey,
          to: cityKey,
          coords: [prevCityCoord, cityCoord],
        });
      }
      prevCityCoord = cityCoord;
      prevCityKey = cityKey;

      // Day item locations
      const dayCoords: [number, number][] = [];
      for (const item of day.items) {
        const coord = findCoord(item.text);
        if (coord) {
          const c: [number, number] = [coord.lat, coord.lng];
          dayCoords.push(c);
          allPlaces.push({ name: item.text, type: "visit", coord: c, day: day.day, city: day.city });
        }
      }
      if (dayCoords.length >= 2) {
        dayRoutes.push({ day: day.day, color: DAY_COLORS[day.day % DAY_COLORS.length], coords: dayCoords });
      }
    }

    return { dayRoutes, cityTransitions, allPlaces };
  }, [program]);

  // Filter places
  const filteredPlaces = filter === "all" ? routeData.allPlaces : routeData.allPlaces.filter((p) => p.type === filter);

  return (
    <section id="map" className="pt-28 -mt-16">
      <div className="flex items-center gap-4 mb-2">
        <h2 className="font-display text-4xl md:text-5xl text-accent-black tracking-tight">
          КАРТА
        </h2>
        <span className="font-mono text-xs text-accent-pink font-bold border-2 border-accent-pink px-2 py-0.5">
          МАРШРУТЫ
        </span>
      </div>
      <p className="font-mono text-sm text-text-secondary mb-4">
        Реальные маршруты между городами и локациями. Кликните на метку для подробностей.
      </p>

      {/* Controls */}
      <div className="flex flex-wrap gap-2 mb-4">
        {["all", "hotel", "visit"].map((t) => (
          <button key={t} onClick={() => setFilter(t)}
            className={`font-mono text-xs font-bold tracking-wider px-3 py-1.5 border-2 transition-all ${
              filter === t
                ? "bg-accent-black text-bg-base border-accent-black"
                : "border-accent-black hover:bg-accent-black hover:text-bg-base"
            }`}>
            {t === "all" ? "ВСЁ" : t === "hotel" ? "ОТЕЛИ" : "МЕСТА"}
          </button>
        ))}
        <button onClick={() => setShowRoutes(!showRoutes)}
          className={`font-mono text-xs font-bold tracking-wider px-3 py-1.5 border-2 transition-all ml-auto ${
            showRoutes
              ? "bg-accent-pink text-white border-accent-pink"
              : "border-accent-black hover:bg-accent-black hover:text-bg-base"
          }`}>
          {showRoutes ? "МАРШРУТЫ ON" : "МАРШРУТЫ OFF"}
        </button>
      </div>

      {/* Map */}
      <div className="border-4 border-accent-black h-[500px] w-full overflow-hidden">
        <MapContainer center={[32.5, 119.0]} zoom={7} scrollWheelZoom={true} style={{ height: "100%", width: "100%" }}>
          <TileLayer
            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          />
          <FlyToCenter center={center} />

          {/* City transition lines */}
          {showRoutes && routeData.cityTransitions.map((tr, i) => (
            <Polyline key={`city-${i}`} positions={tr.coords}
              pathOptions={{ color: "#1A1A1A", weight: 3, opacity: 0.5, dashArray: "8 6" }} />
          ))}

          {/* Day routes */}
          {showRoutes && routeData.dayRoutes.map((dr) => (
            <Polyline key={`day-${dr.day}`} positions={dr.coords}
              pathOptions={{ color: dr.color, weight: 4, opacity: 0.8 }} />
          ))}

          {/* City labels */}
          {Object.entries(CITY_COORDS).map(([key, coord]) => {
            const cityName = { shanghai: "ШАНХАЙ", ningbo: "НИНБО", hangzhou: "ХАНЧЖОУ", huangshan: "ХУАНШАНЬ", beijing: "ПЕКИН" }[key] || key;
            return (
              <Marker key={key} position={coord} icon={L.divIcon({
                className: "",
                html: `<div style="background:#1A1A1A;color:#F5F0EB;font-size:12px;font-weight:900;padding:4px 12px;border:2px solid #E50071;font-family:Impact,Arial Black,sans-serif;letter-spacing:1px">${cityName}</div>`,
                iconSize: [0, 0],
                iconAnchor: [0, 0],
              })} />
            );
          })}

          {/* Place markers */}
          {filteredPlaces.map((p, i) =>
            p.coord ? (
              <Marker key={`${p.name}-${i}`} position={p.coord}
                icon={createIcon(p.type === "hotel" ? "#E50071" : "#1A1A1A", p.type === "hotel" ? "H" : p.day ? `D${p.day}` : "•")}
                eventHandlers={{ click: () => open({
                  type: p.type === "hotel" ? "hotel" : "program",
                  title: p.name,
                  subtitle: p.city,
                  city: p.city,
                  day: p.day,
                })}}>
                <Popup>
                  <div className="font-mono text-xs min-w-[120px]">
                    <strong>{p.name}</strong>
                    {p.city && <p className="text-text-muted mt-1">{p.city}</p>}
                    {p.day && <p className="text-accent-pink mt-1">День {p.day}</p>}
                    <button onClick={() => open({
                      type: p.type === "hotel" ? "hotel" : "program",
                      title: p.name,
                      subtitle: p.city,
                      city: p.city,
                      day: p.day,
                    })}
                      className="mt-2 font-mono text-[10px] font-bold border-2 border-accent-black px-2 py-0.5 hover:bg-accent-black hover:text-bg-base transition-colors w-full">
                    ПОДРОБНЕЕ
                    </button>
                  </div>
                </Popup>
              </Marker>
            ) : null
          )}
        </MapContainer>
      </div>
    </section>
  );
}
