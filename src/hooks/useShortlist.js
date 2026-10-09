import { useSyncExternalStore } from "react";

const KEY = "wtf-selected";
const listeners = new Set();

function readStoredIds() {
  try {
    if (typeof window === "undefined") {
      return [];
    }

    const raw = window.localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

let cache = readStoredIds();

function write(ids) {
  const nextIds = Array.isArray(ids) ? ids : [];
  cache = nextIds;

  try {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(
        KEY,
        JSON.stringify(nextIds)
      );
    }
  } catch {
    // Ignore storage failures and keep the in-memory state intact.
  }

  listeners.forEach((l) => l());
}

const subscribe = (cb) => {
  listeners.add(cb);
  return () => listeners.delete(cb);
};

export function useShortlist() {
  const ids = useSyncExternalStore(subscribe, () => cache);

  return {
    ids,
    has: (id) => ids.includes(id),
    toggle: (id) =>
      write(
        ids.includes(id)
          ? ids.filter((x) => x !== id)
          : [...ids, id]
      ),
    remove: (id) => write(ids.filter((x) => x !== id)),
    clear: () => write([]),
  };
}