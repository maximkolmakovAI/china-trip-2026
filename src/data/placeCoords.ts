export interface PlaceCoord {
  name: string;
  lat: number;
  lng: number;
}

const SHANGHAI: PlaceCoord[] = [
  { name: "Бунд (Вайтан)", lat: 31.2400, lng: 121.4900 },
  { name: "Нанкин Роуд", lat: 31.2350, lng: 121.4750 },
  { name: "Хуанпу", lat: 31.2300, lng: 121.4900 },
  { name: "Пудун", lat: 31.2350, lng: 121.5100 },
  { name: "Диснейленд", lat: 31.1450, lng: 121.6600 },
  { name: "Старый город (Чэнхуанмяо)", lat: 31.2250, lng: 121.4850 },
  { name: "Tianzifang", lat: 31.2150, lng: 121.4750 },
  { name: "Французская концессия", lat: 31.2050, lng: 121.4550 },
  { name: "Музей науки", lat: 31.2200, lng: 121.5400 },
  { name: "Восточная жемчужина", lat: 31.2400, lng: 121.5000 },
  { name: "Шанхайский музей", lat: 31.2300, lng: 121.4700 },
  { name: "Народная площадь", lat: 31.2280, lng: 121.4750 },
  { name: "Юй Юань", lat: 31.2270, lng: 121.4870 },
  { name: "M50", lat: 31.2500, lng: 121.4450 },
  { name: "1933", lat: 31.2550, lng: 121.4850 },
  { name: "Планетарий", lat: 31.2250, lng: 121.5450 },
  { name: "Аэропорт Шанхай (PVG)", lat: 31.1450, lng: 121.8050 },
  { name: "Hongqiao Station", lat: 31.1950, lng: 121.3250 },
];

const BEIJING: PlaceCoord[] = [
  { name: "Запретный город", lat: 39.9150, lng: 116.3970 },
  { name: "Тяньаньмэнь", lat: 39.9050, lng: 116.3970 },
  { name: "Великая стена (Бадалин)", lat: 40.3550, lng: 116.0050 },
  { name: "Великая стена (Симатай)", lat: 40.4300, lng: 116.7800 },
  { name: "Летний дворец", lat: 39.9990, lng: 116.2750 },
  { name: "Храм Неба", lat: 39.8820, lng: 116.4070 },
  { name: "Храм Ламы", lat: 39.9480, lng: 116.4180 },
  { name: "Хутун (Наньлогосян)", lat: 39.9380, lng: 116.4040 },
  { name: "Площадь Тяньаньмэнь", lat: 39.9050, lng: 116.3970 },
  { name: "Олимпийский парк", lat: 39.9900, lng: 116.3900 },
  { name: "Национальный стадион", lat: 39.9900, lng: 116.3900 },
  { name: "Аэропорт Пекин (PEK)", lat: 40.0800, lng: 116.5850 },
  { name: "Beijing South Station", lat: 39.8650, lng: 116.3800 },
  { name: "Ночной рынок Ванфуцзин", lat: 39.9130, lng: 116.4100 },
  { name: "Гулоу (Барабанная башня)", lat: 39.9400, lng: 116.4050 },
  { name: "Парк Бэйхай", lat: 39.9250, lng: 116.3850 },
  { name: "Куньминху (озеро)", lat: 39.9950, lng: 116.2750 },
  { name: "798 Art Zone", lat: 39.9850, lng: 116.4950 },
  { name: "Врата Небесного Спокойствия", lat: 39.9050, lng: 116.3970 },
];

const OTHER: PlaceCoord[] = [
  { name: "Нинбо", lat: 29.8680, lng: 121.5440 },
  { name: "Ханчжоу", lat: 30.2740, lng: 120.1550 },
  { name: "Хуаншань", lat: 30.1330, lng: 118.1750 },
  { name: "Вест-Лейк (Ханчжоу)", lat: 30.2600, lng: 120.1500 },
  { name: "Линъинь Сы (Ханчжоу)", lat: 30.2450, lng: 120.1000 },
  { name: "Шанхай", lat: 31.2300, lng: 121.4700 },
  { name: "Пекин", lat: 39.9050, lng: 116.3970 },
  { name: "Тяньи-гэ (Нинбо)", lat: 29.8750, lng: 121.5500 },
  { name: "Храм Баого (Нинбо)", lat: 29.9300, lng: 121.5200 },
  { name: "Озеро Сиху", lat: 30.2600, lng: 120.1500 },
  { name: "Горячие источники Хуаншань", lat: 30.1000, lng: 118.1600 },
  { name: "Западный мост (Ханчжоу)", lat: 30.2550, lng: 120.1450 },
];

export const ALL_COORDS = [...SHANGHAI, ...BEIJING, ...OTHER];

export function findCoord(name: string): PlaceCoord | undefined {
  const lower = name.toLowerCase();
  return ALL_COORDS.find((c) => lower.includes(c.name.toLowerCase()));
}

export function distance(a: PlaceCoord, b: PlaceCoord): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const sinDLat = Math.sin(dLat / 2);
  const sinDLng = Math.sin(dLng / 2);
  const aVal =
    sinDLat * sinDLat +
    Math.cos((a.lat * Math.PI) / 180) *
      Math.cos((b.lat * Math.PI) / 180) *
      sinDLng * sinDLng;
  return R * 2 * Math.atan2(Math.sqrt(aVal), Math.sqrt(1 - aVal));
}

export function optimizeRoute(names: string[]): string[] {
  const coords = names.map((n) => findCoord(n)).filter(Boolean) as PlaceCoord[];
  const nameToCoord = new Map<string, PlaceCoord>();
  const validNames = names.filter((n) => {
    const c = findCoord(n);
    if (c) nameToCoord.set(n, c);
    return !!c;
  });
  if (validNames.length <= 2) return validNames;

  const remaining = new Set(validNames);
  const result: string[] = [];
  let current = validNames[0];
  result.push(current);
  remaining.delete(current);

  while (remaining.size > 0) {
    let nearest: string | null = null;
    let minDist = Infinity;
    const curCoord = nameToCoord.get(current)!;
    for (const name of remaining) {
      const d = distance(curCoord, nameToCoord.get(name)!);
      if (d < minDist) {
        minDist = d;
        nearest = name;
      }
    }
    if (nearest) {
      result.push(nearest);
      remaining.delete(nearest);
      current = nearest;
    }
  }
  return result;
}
