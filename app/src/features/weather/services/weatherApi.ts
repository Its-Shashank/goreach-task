import { API_BASE_URL } from "../../../constants/api";
import type {
  ApiErrorBody,
  CurrentWeather,
  PaginatedForecastWeather,
} from "../types/weather";
import { normalizeForecastPage } from "./normalizeForecastPage";

export class WeatherApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "WeatherApiError";
  }
}

async function fetchWeather<T>(
  path: string,
  params: Record<string, string | number>,
): Promise<T> {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    search.set(key, String(value));
  }

  const url = `${API_BASE_URL}${path}?${search.toString()}`;

  let response: Response;
  try {
    response = await fetch(url);
  } catch {
    throw new WeatherApiError(0, "Unable to reach the weather server");
  }

  const body: unknown = await response.json();

  if (!response.ok) {
    const errorBody = body as ApiErrorBody;
    throw new WeatherApiError(
      response.status,
      errorBody.error ?? "Failed to fetch weather",
    );
  }

  return body as T;
}

export function fetchCurrentWeather(city: string): Promise<CurrentWeather> {
  return fetchWeather<CurrentWeather>("/api/weather/current", { city });
}

export async function fetchForecastWeatherPage(
  city: string,
  page: number,
  limit: number,
): Promise<PaginatedForecastWeather> {
  const body = await fetchWeather<unknown>("/api/weather/forecast", {
    city,
    page,
    limit,
  });
  return normalizeForecastPage(body, page, limit);
}
