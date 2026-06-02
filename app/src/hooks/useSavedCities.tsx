import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

const STORAGE_KEY = "@weather/saved_cities";

interface SavedCitiesContextValue {
  cities: string[];
  isLoading: boolean;
  saveCity: (city: string) => Promise<void>;
  removeCity: (city: string) => Promise<void>;
  reload: () => Promise<void>;
  isSaved: (city: string) => boolean;
}

const SavedCitiesContext = createContext<SavedCitiesContextValue | null>(null);

function normalizeCity(city: string): string {
  return city.trim();
}

export function SavedCitiesProvider({ children }: { children: ReactNode }) {
  const [cities, setCities] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const reload = useCallback(async () => {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    if (!stored) {
      setCities([]);
      return;
    }
    try {
      const parsed = JSON.parse(stored) as unknown;
      setCities(Array.isArray(parsed) ? parsed.map(String) : []);
    } catch {
      setCities([]);
    }
  }, []);

  useEffect(() => {
    reload().finally(() => setIsLoading(false));
  }, [reload]);

  const saveCity = useCallback(async (city: string) => {
    const normalized = normalizeCity(city);
    if (!normalized) return;

    setCities((current) => {
      const exists = current.some(
        (c) => c.toLowerCase() === normalized.toLowerCase(),
      );
      if (exists) return current;
      const next = [...current, normalized];
      void AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const removeCity = useCallback(async (city: string) => {
    const normalized = normalizeCity(city);
    setCities((current) => {
      const next = current.filter(
        (c) => c.toLowerCase() !== normalized.toLowerCase(),
      );
      void AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const isSaved = useCallback(
    (city: string) => {
      const normalized = normalizeCity(city).toLowerCase();
      return cities.some((c) => c.toLowerCase() === normalized);
    },
    [cities],
  );

  const value = useMemo(
    () => ({ cities, isLoading, saveCity, removeCity, reload, isSaved }),
    [cities, isLoading, saveCity, removeCity, reload, isSaved],
  );

  return (
    <SavedCitiesContext.Provider value={value}>
      {children}
    </SavedCitiesContext.Provider>
  );
}

export function useSavedCities(): SavedCitiesContextValue {
  const context = useContext(SavedCitiesContext);
  if (!context) {
    throw new Error("useSavedCities must be used within SavedCitiesProvider");
  }
  return context;
}
