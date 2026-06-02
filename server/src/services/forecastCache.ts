import { mapForecastWeather } from "../mappers/weather.js";
import type { ForecastWeather } from "../types/weather.js";
import { fetchForecastWeather } from "./openWeather.js";

const CACHE_TTL_MS = 10 * 60 * 1000;

interface CacheEntry {
  data: ForecastWeather;
  expiresAt: number;
}

const cache = new Map<string, CacheEntry>();

function cacheKey(city: string): string {
  return city.trim().toLowerCase();
}

export async function getForecastForCity(city: string): Promise<ForecastWeather> {
  const key = cacheKey(city);
  const now = Date.now();
  const cached = cache.get(key);

  if (cached && cached.expiresAt > now) {
    return cached.data;
  }

  const raw = await fetchForecastWeather(city);
  const data = mapForecastWeather(raw);
  cache.set(key, { data, expiresAt: now + CACHE_TTL_MS });
  return data;
}
