import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import {
  getFirestore,
  Firestore,
  doc,
  collection as fbCollection,
  getDoc,
  setDoc,
  onSnapshot,
  query as fbQuery,
  increment,
} from "firebase/firestore";

// Firebase config — hardcoded for static export (env vars don't work at runtime)
const firebaseConfig = {
  apiKey: "AIzaSyCcN6qJPPuDeq9OCQ_txvI7NGPLw_4omuU",
  authDomain: "china-trip-2026-6231f.firebaseapp.com",
  projectId: "china-trip-2026-6231f",
  storageBucket: "china-trip-2026-6231f.firebasestorage.app",
  messagingSenderId: "45178443713",
  appId: "1:45178443713:web:c18965c3f258fc5a8f8140",
};

let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let firebaseAvailable = false;

try {
  if (firebaseConfig.apiKey && firebaseConfig.projectId) {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    db = getFirestore(app);
    firebaseAvailable = true;
  }
} catch {
  firebaseAvailable = false;
}

export { firebaseAvailable, db };

// ==================== VOTES ====================

export interface VoteData {
  count: number;
  voters: string[];
}

export async function getVotes(itemId: string): Promise<number> {
  if (!db) return 0;
  try {
    const ref = doc(db, "votes", itemId);
    const snap = await getDoc(ref);
    return snap.exists() ? (snap.data() as VoteData).count || 0 : 0;
  } catch {
    return 0;
  }
}

export async function toggleVoteFirebase(
  itemId: string,
  voterId: string
): Promise<number> {
  if (!db) return 0;
  const ref = doc(db, "votes", itemId);
  try {
    const snap = await getDoc(ref);
    if (snap.exists()) {
      const data = snap.data() as VoteData;
      const voters = data.voters || [];
      if (voters.includes(voterId)) {
        await setDoc(ref, {
          count: Math.max(0, (data.count || 1) - 1),
          voters: voters.filter((v: string) => v !== voterId),
        });
        return Math.max(0, (data.count || 1) - 1);
      } else {
        await setDoc(ref, {
          count: (data.count || 0) + 1,
          voters: [...voters, voterId],
        });
        return (data.count || 0) + 1;
      }
    } else {
      await setDoc(ref, {
        count: 1,
        voters: [voterId],
      });
      return 1;
    }
  } catch {
    return 0;
  }
}

export function subscribeVotes(
  itemId: string,
  onChange: (count: number) => void
): () => void {
  if (!db) return () => {};
  const ref = doc(db, "votes", itemId);
  const unsub = onSnapshot(ref, (snap) => {
    if (snap.exists()) {
      onChange((snap.data() as VoteData).count || 0);
    } else {
      onChange(0);
    }
  });
  return unsub;
}

// ==================== USERS ====================

export interface UserRecord {
  name: string;
  characterIndex: number;
  createdAt: number;
}

/**
 * Register user in Firestore. Returns false if name already taken.
 */
export async function registerUserFirebase(
  name: string,
  characterIndex: number
): Promise<boolean> {
  if (!db) return false;
  try {
    const ref = doc(db, "users", name);
    const snap = await getDoc(ref);
    if (snap.exists()) return false;
    await setDoc(ref, {
      name,
      characterIndex,
      createdAt: Date.now(),
    });
    return true;
  } catch {
    return false;
  }
}

/**
 * Login user from Firestore. Returns userData or null.
 */
export async function loginUserFirebase(
  name: string,
  characterIndex: number
): Promise<UserRecord | null> {
  if (!db) return null;
  try {
    const ref = doc(db, "users", name);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;
    const data = snap.data() as UserRecord;
    if (data.characterIndex !== characterIndex) return null;
    return data;
  } catch {
    return null;
  }
}

/**
 * Subscribe to all users for the users list.
 */
export function subscribeUsers(
  onChange: (users: UserRecord[]) => void
): () => void {
  if (!db) return () => {};
  const q = fbQuery(fbCollection(db, "users"));
  const unsub = onSnapshot(q, (snap) => {
    const users: UserRecord[] = [];
    snap.forEach((doc) => {
      users.push(doc.data() as UserRecord);
    });
    onChange(users);
  });
  return unsub;
}
