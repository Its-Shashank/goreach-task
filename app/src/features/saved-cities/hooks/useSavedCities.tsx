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

function citiesMatch(a: string, b: string): boolean {
  return normalizeCity(a).toLowerCase() === normalizeCity(b).toLowerCase();
}

export function SavedCitiesProvider({ children }: { children: ReactNode }) {
  const [cities, setCities] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const persist = useCallback((next: string[]) => {
    void AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }, []);

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

  const saveCity = useCallback(
    async (city: string) => {
      const normalized = normalizeCity(city);
      if (!normalized) return;

      setCities((current) => {
        if (current.some((c) => citiesMatch(c, normalized))) {
          return current;
        }
        const next = [...current, normalized];
        persist(next);
        return next;
      });
    },
    [persist],
  );

  const removeCity = useCallback(
    async (city: string) => {
      const normalized = normalizeCity(city);
      setCities((current) => {
        const next = current.filter((c) => !citiesMatch(c, normalized));
        persist(next);
        return next;
      });
    },
    [persist],
  );

  const isSaved = useCallback(
    (city: string) => {
      const normalized = normalizeCity(city).toLowerCase();
      return cities.some((c) => c.toLowerCase() === normalized);
    },
    [cities],
  );

  const value = useMemo(
    () => ({
      cities,
      isLoading,
      saveCity,
      removeCity,
      reload,
      isSaved,
    }),
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
