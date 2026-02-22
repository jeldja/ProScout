import { createContext, useContext, useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "proscout-saved-players";

interface SavedPlayersContextType {
  savedIds: string[];
  isSaved: (id: string) => boolean;
  toggleSaved: (id: string) => void;
}

const SavedPlayersContext = createContext<SavedPlayersContextType | null>(null);

export function SavedPlayersProvider({ children }: { children: React.ReactNode }) {
  const [savedIds, setSavedIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedIds));
    } catch {
      // ignore
    }
  }, [savedIds]);

  const isSaved = useCallback((id: string) => savedIds.includes(id), [savedIds]);

  const toggleSaved = useCallback((id: string) => {
    setSavedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }, []);

  return (
    <SavedPlayersContext.Provider value={{ savedIds, isSaved, toggleSaved }}>
      {children}
    </SavedPlayersContext.Provider>
  );
}

export function useSavedPlayersContext() {
  const ctx = useContext(SavedPlayersContext);
  if (!ctx) throw new Error("useSavedPlayersContext must be used within SavedPlayersProvider");
  return ctx;
}
