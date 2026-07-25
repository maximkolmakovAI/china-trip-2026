"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import {
  firebaseAvailable,
  registerUserFirebase,
  loginUserFirebase,
  subscribeUsers,
  UserRecord,
} from "./firebase";
import { img } from "./img";

const GENSHIN_CHARACTERS = [
  { name: "Люмин (Путешественница)", img: "⭐", portrait: img("/images/characters/lumine.webp") },
  { name: "Итер (Путешественник)", img: "⭐", portrait: img("/images/characters/aether.webp") },
  { name: "Паймон", img: "⭐", portrait: img("/images/characters/paimon.svg") },
  { name: "Эмбер", img: "🔥", portrait: img("/images/characters/amber.webp") },
  { name: "Кэйа", img: "❄️", portrait: img("/images/characters/kaeya.webp") },
  { name: "Лиза", img: "⚡", portrait: img("/images/characters/lisa.webp") },
  { name: "Джинн", img: "🌪️", portrait: img("/images/characters/jean.webp") },
  { name: "Дилюк", img: "🔥", portrait: img("/images/characters/diluc.webp") },
  { name: "Венти", img: "🍃", portrait: img("/images/characters/venti.webp") },
  { name: "Чжун Ли", img: "🪨", portrait: img("/images/characters/zhongli.webp") },
  { name: "Райдэн Сёгун (Эи)", img: "⚡", portrait: img("/images/characters/raiden.webp") },
  { name: "Ху Тао", img: "🔥", portrait: img("/images/characters/hutao.webp") },
  { name: "Гань Юй", img: "❄️", portrait: img("/images/characters/ganyu.webp") },
  { name: "Сяо", img: "🌪️", portrait: img("/images/characters/xiao.webp") },
  { name: "Кадзуха", img: "🍃", portrait: img("/images/characters/kazuha.webp") },
  { name: "Аяка", img: "❄️", portrait: img("/images/characters/ayaka.webp") },
  { name: "Ёимия", img: "🔥", portrait: img("/images/characters/yoimiya.webp") },
  { name: "Итто", img: "🪨", portrait: img("/images/characters/itto.webp") },
  { name: "Нахида", img: "🌿", portrait: img("/images/characters/nahida.webp") },
  { name: "Фурина", img: "💧", portrait: img("/images/characters/furina.webp") },
  { name: "Нёвиллет", img: "💧", portrait: img("/images/characters/neuvillette.webp") },
  { name: "Арлекино", img: "🔥", portrait: img("/images/characters/arlecchino.webp") },
  { name: "Клоринда", img: "⚡", portrait: img("/images/characters/clorinde.webp") },
  { name: "Муалани", img: "💧", portrait: img("/images/characters/mualani.webp") },
];

const STORAGE_USERS = "china_trip_users";
const STORAGE_SESSION = "china_trip_session";

interface UserData {
  name: string;
  characterIndex: number;
}

interface UserContextType {
  user: UserData | null;
  isLoggedIn: boolean;
  allUsers: UserData[];
  register: (name: string, charIndex: number) => Promise<boolean>;
  login: (name: string, charIndex: number) => Promise<boolean>;
  logout: () => void;
  characters: typeof GENSHIN_CHARACTERS;
}

const UserContext = createContext<UserContextType>({
  user: null,
  isLoggedIn: false,
  allUsers: [],
  register: async () => false,
  login: async () => false,
  logout: () => {},
  characters: GENSHIN_CHARACTERS,
});

function loadLocalUsers(): UserData[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_USERS) || "[]");
  } catch {
    return [];
  }
}

function saveLocalUsers(users: UserData[]) {
  localStorage.setItem(STORAGE_USERS, JSON.stringify(users));
}

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null);
  const [allUsers, setAllUsers] = useState<UserData[]>([]);

  useEffect(() => {
    // Load local cache first (instant)
    setAllUsers(loadLocalUsers());

    // Try restore session
    try {
      const session = localStorage.getItem(STORAGE_SESSION);
      if (session) {
        const parsed = JSON.parse(session);
        setUser(parsed);
      }
    } catch {
      localStorage.removeItem(STORAGE_SESSION);
    }

    // Subscribe to Firestore users for real-time sync
    if (firebaseAvailable) {
      const unsub = subscribeUsers((fbUsers: UserRecord[]) => {
        const mapped: UserData[] = fbUsers.map((u) => ({
          name: u.name,
          characterIndex: u.characterIndex,
        }));
        setAllUsers(mapped);
        saveLocalUsers(mapped);
      });
      return () => unsub();
    }
  }, []);

  const register = useCallback(async (name: string, charIndex: number): Promise<boolean> => {
    const newUser = { name, characterIndex: charIndex };

    // Always save locally
    const local = loadLocalUsers();
    if (!local.some((u) => u.name === name)) {
      local.push(newUser);
      saveLocalUsers(local);
    }
    setAllUsers(local);
    setUser(newUser);
    localStorage.setItem(STORAGE_SESSION, JSON.stringify(newUser));

    // Sync to Firestore if available
    if (firebaseAvailable) {
      const ok = await registerUserFirebase(name, charIndex);
      if (!ok) {
        // Name taken in Firestore but not locally — force logout
        setUser(null);
        localStorage.removeItem(STORAGE_SESSION);
        return false;
      }
    }
    return true;
  }, []);

  const login = useCallback(async (name: string, charIndex: number): Promise<boolean> => {
    // Try Firestore first if available
    if (firebaseAvailable) {
      const fbUser = await loginUserFirebase(name, charIndex);
      if (fbUser) {
        const userData = { name: fbUser.name, characterIndex: fbUser.characterIndex };
        setUser(userData);
        localStorage.setItem(STORAGE_SESSION, JSON.stringify(userData));
        return true;
      }
      return false;
    }

    // Fallback: local only
    const local = loadLocalUsers();
    const found = local.find((u) => u.name === name);
    if (!found || found.characterIndex !== charIndex) return false;
    setUser(found);
    localStorage.setItem(STORAGE_SESSION, JSON.stringify(found));
    return true;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(STORAGE_SESSION);
  }, []);

  return (
    <UserContext.Provider
      value={{ user, isLoggedIn: !!user, allUsers, register, login, logout, characters: GENSHIN_CHARACTERS }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}

export { GENSHIN_CHARACTERS };
