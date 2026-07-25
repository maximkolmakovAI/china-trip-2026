"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { useUser } from "@/lib/useUser";
import {
  firebaseAvailable,
  toggleVoteFirebase,
  subscribeVotes,
} from "./firebase";

function loadLocalVotes(userId: string): Record<string, boolean> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(`china_trip_votes_${userId}`) || "{}");
  } catch {
    return {};
  }
}

function saveLocalVotes(userId: string, votes: Record<string, boolean>) {
  localStorage.setItem(`china_trip_votes_${userId}`, JSON.stringify(votes));
}

interface VoteContextType {
  votes: Record<string, number>;
  userVotes: Record<string, boolean>;
  toggleVote: (itemId: string) => Promise<void>;
  loading: boolean;
}

const VoteContext = createContext<VoteContextType>({
  votes: {},
  userVotes: {},
  toggleVote: async () => {},
  loading: true,
});

export function VoteProvider({
  children,
  votableIds,
}: {
  children: ReactNode;
  votableIds: string[];
}) {
  const { user } = useUser();
  const userId = user?.name || "anonymous";
  const [votes, setVotes] = useState<Record<string, number>>({});
  const [userVotes, setUserVotes] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setUserVotes(loadLocalVotes(userId));
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    if (!firebaseAvailable || votableIds.length === 0) return;
    const unsubs = votableIds.map((id) =>
      subscribeVotes(id, (count) => {
        setVotes((prev) => ({ ...prev, [id]: count }));
      })
    );
    return () => unsubs.forEach((u) => u());
  }, [votableIds]);

  const toggleVote = useCallback(
    async (itemId: string) => {
      const newUserVotes = { ...userVotes };
      const hasVoted = !!newUserVotes[itemId];
      newUserVotes[itemId] = !hasVoted;
      setUserVotes(newUserVotes);
      saveLocalVotes(userId, newUserVotes);

      setVotes((prev) => ({
        ...prev,
        [itemId]: Math.max(0, (prev[itemId] || 0) + (hasVoted ? -1 : 1)),
      }));

      if (firebaseAvailable) {
        try {
          await toggleVoteFirebase(itemId, userId);
        } catch {
          // Firebase failed, keeping local state
        }
      }
    },
    [userVotes, userId]
  );

  return (
    <VoteContext.Provider value={{ votes, userVotes, toggleVote, loading }}>
      {children}
    </VoteContext.Provider>
  );
}

export function useVotes() {
  return useContext(VoteContext);
}
