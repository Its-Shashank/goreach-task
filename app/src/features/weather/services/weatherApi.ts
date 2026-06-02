import { API_BASE_URL } from "../../../constants/api";
import type {
  ApiErrorBody,
  CurrentWeather,
  ForecastWeather,
} from "../types/weather";

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

export function fetchForecastWeather(city: string): Promise<ForecastWeather> {
  return fetchWeather<ForecastWeather>("/api/weather/forecast", { city });
}
