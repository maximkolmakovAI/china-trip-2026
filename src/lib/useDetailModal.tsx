"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { DetailData } from "@/components/DetailModal";

interface DetailModalContextType {
  open: (data: DetailData) => void;
  close: () => void;
  data: DetailData | null;
}

const DetailModalContext = createContext<DetailModalContextType>({
  open: () => {},
  close: () => {},
  data: null,
});

export function DetailModalProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<DetailData | null>(null);

  return (
    <DetailModalContext.Provider value={{ open: setData, close: () => setData(null), data }}>
      {children}
    </DetailModalContext.Provider>
  );
}

export function useDetailModal() {
  return useContext(DetailModalContext);
}
