export interface Hotel {
  id: string;
  name: string;
  district: string;
  concept: string;
  pros: string[];
  cons: string[];
  insight: string;
  link: string;
  tags: string[];
  price: number | null;
}

export interface ProgramDay {
  day: number;
  date: string;
  weekday: string;
  city: string;
  status: "planned" | "todo" | "maybe";
  items: ProgramItem[];
  notes: string;
}

export interface ProgramItem {
  text: string;
  done: boolean;
  new: boolean;
}

export interface VisitedPlace {
  name: string;
  note: string;
}

export interface IdeaItem {
  id: string;
  text: string;
  note?: string;
  description?: string;
  pros?: string[];
  cons?: string[];
  insight?: string;
  link?: string;
}

export interface IdeaCategories {
  shanghai: IdeaItem[];
  beijing: IdeaItem[];
  ningbo: IdeaItem[];
  hangzhou: IdeaItem[];
  huangshan: IdeaItem[];
  other: IdeaItem[];
  food: IdeaItem[];
  shopping: IdeaItem[];
}

export interface TripData {
  meta: {
    title: string;
    subtitle: string;
    dates: string;
    group: string;
  };
  hotels: {
    shanghai: Hotel[];
    beijing: Hotel[];
  };
  program: ProgramDay[];
  visited: VisitedPlace[];
  ideas: IdeaCategories;
}

export type City = "shanghai" | "beijing";

export type HotelTag = "budget" | "wow" | "unique" | "tech" | "practical";

export const TAG_LABELS: Record<HotelTag, string> = {
  budget: "Бюджет",
  wow: "Вау-эффект",
  unique: "Уникальность",
  tech: "Технологии",
  practical: "Практичность",
};

export const CITY_COLORS: Record<string, string> = {
  Шанхай: "#00B894",
  Ханчжоу: "#D4AF37",
  Хуаншань: "#F97316",
  Нинбо: "#8B5CF6",
  Пекин: "#E50071",
};
