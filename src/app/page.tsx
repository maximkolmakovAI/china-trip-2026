import tripData from "@/data/data.json";
import type { TripData } from "@/lib/types";
import PageClient from "./PageClient";

export default function Home() {
  const data = tripData as TripData;

  const allIds: string[] = [
    ...data.hotels.shanghai.map((h) => h.id),
    ...data.hotels.beijing.map((h) => h.id),
    ...Object.values(data.ideas).flatMap((cat: { id: string }[]) => cat.map((i) => i.id)),
  ];

  return <PageClient data={data} votableIds={allIds} />;
}
