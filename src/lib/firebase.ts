import { initializeApp, getApps, FirebaseApp } from "firebase/app";

// Firebase config — hardcoded for static export (env vars don't work at runtime)
const firebaseConfig = {
  apiKey: "AIzaSyCcN6vBLjX1t0-tAHKWZlM9c-e4fF5l0bg",
  authDomain: "china-trip-2026-6231f.firebaseapp.com",
  projectId: "china-trip-2026-6231f",
  storageBucket: "china-trip-2026-6231f.firebasestorage.app",
  messagingSenderId: "45178443713",
  appId: "1:45178443713:web:c18965c3f258fc5a8f8140",
};

let app: FirebaseApp | null = null;
let firebaseAvailable = false;

try {
  if (firebaseConfig.apiKey && firebaseConfig.projectId) {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    firebaseAvailable = true;
  }
} catch {
  firebaseAvailable = false;
}

export { firebaseAvailable };

// REST API base — more reliable than SDK for static export
const PROJECT_ID = firebaseConfig.projectId;
const REST_BASE = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

// ==================== VOTES (SDK + onSnapshot for realtime) ====================

export interface VoteData {
  count: number;
  voters: string[];
}

export function subscribeVotes(
  itemId: string,
  onChange: (count: number) => void
): () => void {
  let active = true;

  const fetchVote = async () => {
    try {
      const resp = await fetch(`${REST_BASE}/votes/${encodeURIComponent(itemId)}`);
      if (!resp.ok || !active) return;
      const data = await resp.json();
      if (data.fields) {
        onChange(parseInt(data.fields.count?.integerValue || "0"));
      } else {
        onChange(0);
      }
    } catch {
      // Silent fail — vote data is non-critical
    }
  };

  fetchVote();
  const interval = setInterval(fetchVote, 5000);

  return () => {
    active = false;
    clearInterval(interval);
  };
}

export async function toggleVoteFirebase(
  itemId: string,
  voterId: string
): Promise<number> {
  try {
    // Read current
    const readResp = await fetch(`${REST_BASE}/votes/${itemId}`);
    let voters: string[] = [];
    let count = 0;

    if (readResp.ok) {
      const data = await readResp.json();
      if (data.fields) {
        count = parseInt(data.fields.count?.integerValue || "0");
        voters = (data.fields.voters?.arrayValue?.values || []).map(
          (v: { stringValue: string }) => v.stringValue
        );
      }
    }

    if (voters.includes(voterId)) {
      // Remove vote
      count = Math.max(0, count - 1);
      voters = voters.filter((v) => v !== voterId);
    } else {
      // Add vote
      count += 1;
      voters.push(voterId);
    }

    // Write
    await fetch(`${REST_BASE}/votes/${itemId}?fieldMask.count=true&fieldMask.voters=true`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fields: {
          count: { integerValue: String(count) },
          voters: {
            arrayValue: { values: voters.map((v) => ({ stringValue: v })) },
          },
        },
      }),
    });

    return count;
  } catch (err) {
    console.error("[Firebase] toggleVote error:", err);
    return 0;
  }
}

// ==================== USERS (REST API) ====================

export interface UserRecord {
  name: string;
  characterIndex: number;
  createdAt: number;
}

/**
 * Register user in Firestore via REST. Returns false if name already taken.
 */
export async function registerUserFirebase(
  name: string,
  characterIndex: number
): Promise<boolean> {
  try {
    // Check if exists
    const readResp = await fetch(`${REST_BASE}/users/${encodeURIComponent(name)}`);
    if (readResp.ok) {
      const data = await readResp.json();
      if (data.fields) {
        console.warn("[Firebase] register: name already exists:", name);
        return false;
      }
    }

    // Create
    const writeResp = await fetch(`${REST_BASE}/users/${encodeURIComponent(name)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fields: {
          name: { stringValue: name },
          characterIndex: { integerValue: String(characterIndex) },
          createdAt: { integerValue: String(Date.now()) },
        },
      }),
    });

    if (!writeResp.ok) {
      console.error("[Firebase] register: write failed:", writeResp.status);
      return false;
    }

    console.log("[Firebase] register: SUCCESS for", name);
    return true;
  } catch (err) {
    console.error("[Firebase] register ERROR:", err);
    return false;
  }
}

/**
 * Login user from Firestore via REST. Returns userData or null.
 */
export async function loginUserFirebase(
  name: string,
  characterIndex: number
): Promise<UserRecord | null> {
  try {
    const resp = await fetch(`${REST_BASE}/users/${encodeURIComponent(name)}`);
    if (!resp.ok) return null;
    const data = await resp.json();
    if (!data.fields) return null;

    const storedCharIdx = parseInt(data.fields.characterIndex?.integerValue || "-1");
    if (storedCharIdx !== characterIndex) {
      console.warn("[Firebase] login: character mismatch");
      return null;
    }

    return {
      name: data.fields.name?.stringValue || name,
      characterIndex: storedCharIdx,
      createdAt: parseInt(data.fields.createdAt?.integerValue || "0"),
    };
  } catch (err) {
    console.error("[Firebase] login ERROR:", err);
    return null;
  }
}

/**
 * Subscribe to all users for the users list.
 * Uses REST polling (every 5s) since onSnapshot can be unreliable in some browsers.
 */
export function subscribeUsers(
  onChange: (users: UserRecord[]) => void
): () => void {
  let active = true;

  const fetchUsers = async () => {
    try {
      const resp = await fetch(`${REST_BASE}/users`);
      if (!resp.ok || !active) return;
      const data = await resp.json();
      const users: UserRecord[] = [];
      for (const doc of data.documents || []) {
        if (doc.fields) {
          users.push({
            name: doc.fields.name?.stringValue || "",
            characterIndex: parseInt(doc.fields.characterIndex?.integerValue || "0"),
            createdAt: parseInt(doc.fields.createdAt?.integerValue || "0"),
          });
        }
      }
      if (active) onChange(users);
    } catch (err) {
      console.error("[Firebase] subscribeUsers error:", err);
    }
  };

  // Initial fetch
  fetchUsers();
  // Poll every 5 seconds
  const interval = setInterval(fetchUsers, 5000);

  return () => {
    active = false;
    clearInterval(interval);
  };
}
