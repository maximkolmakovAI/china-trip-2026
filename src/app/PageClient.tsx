"use client";

import { TripData } from "@/lib/types";
import { VoteProvider } from "@/lib/useVotes";
import { UserProvider, useUser } from "@/lib/useUser";
import { DetailModalProvider, useDetailModal } from "@/lib/useDetailModal";
import DetailModal from "@/components/DetailModal";
import AuthModal from "@/components/AuthModal";
import Navbar from "@/components/Navbar";
import { img } from "@/lib/img";
import HotelSection from "@/components/HotelSection";
import ProgramSection from "@/components/ProgramSection";
import IdeasSection from "@/components/IdeasSection";
import AssistantSection from "@/components/AssistantSection";
import RouteMap from "@/components/RouteMap";
import dynamic from "next/dynamic";
const PinMap = dynamic(() => import("@/components/PinMap"), { ssr: false });
import WeatherWidget from "@/components/WeatherWidget";
import TravelChecklist from "@/components/TravelChecklist";
import BudgetCalculator from "@/components/BudgetCalculator";
import HotelComparison from "@/components/HotelComparison";
import DragDropTimeline from "@/components/DragDropTimeline";
import AddItemPanel from "@/components/AddItemPanel";
import DocumentVault from "@/components/DocumentVault";
import VoiceNotes from "@/components/VoiceNotes";
import ExportPdf from "@/components/ExportPdf";
import FeedbackButton from "@/components/FeedbackButton";

function AppContent({ data, votableIds }: { data: TripData; votableIds: string[] }) {
  const { isLoggedIn, user, characters } = useUser();
  const { data: modalData, close } = useDetailModal();

  if (!isLoggedIn) {
    return <AuthModal />;
  }

  return (
    <VoteProvider votableIds={votableIds}>
      <DetailModal data={modalData} onClose={close} />
      <Navbar />

      {/* Hero */}
      <header className="relative bg-accent-black text-bg-base border-b-4 border-accent-pink overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <img
            src={img("/images/cities/shanghai.jpg")}
            alt="Shanghai"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-accent-black via-accent-black/80 to-transparent" />
        <div className="relative max-w-6xl mx-auto px-6 py-24 md:py-32">
          <div className="border border-accent-pink inline-block px-4 py-1 mb-6">
            <span className="font-mono text-xs text-accent-pink tracking-widest">08 · 09 · 2026 → 24 · 09 · 2026</span>
          </div>
          <h1 className="font-display text-6xl md:text-8xl leading-none tracking-tight mb-4">
            {data.meta.title}
          </h1>
          <p className="font-mono text-lg md:text-xl text-bg-base/70 mb-6">
            {data.meta.subtitle}
          </p>
          <div className="flex items-center gap-4 font-mono text-xs text-bg-base/50">
            <span>{data.meta.dates}</span>
            <span className="w-6 h-px bg-accent-pink" />
            <span>{data.meta.group}</span>
          </div>
        </div>
        <div className="relative h-2 bg-accent-pink" />
      </header>

      <main className="max-w-6xl mx-auto px-6">
        <HotelSection shanghai={data.hotels.shanghai} beijing={data.hotels.beijing} />
        <IdeasSection ideas={data.ideas} visited={data.visited} />
        <AddItemPanel />
        <ProgramSection program={data.program} />
        <WeatherWidget />
        <TravelChecklist />
        <BudgetCalculator />
        <HotelComparison />
        <DocumentVault />
        <VoiceNotes />
        <ExportPdf program={data.program} />
        <DragDropTimeline program={data.program} />
        <PinMap program={data.program} />
        <RouteMap program={data.program} />
        <AssistantSection />
      </main>

      <FeedbackButton />

      <footer className="bg-accent-black text-bg-base mt-20 border-t-4 border-accent-pink">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="font-display text-lg tracking-wider">CHINA TRIP 2026</span>
          <span className="font-mono text-xs text-bg-base/40">Сделано для группы</span>
        </div>
      </footer>
    </VoteProvider>
  );
}

export default function PageClient({
  data,
  votableIds,
}: {
  data: TripData;
  votableIds: string[];
}) {
  return (
    <UserProvider>
      <DetailModalProvider>
        <AppContent data={data} votableIds={votableIds} />
      </DetailModalProvider>
    </UserProvider>
  );
}
