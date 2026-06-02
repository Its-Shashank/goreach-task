import type {
  OwmCurrentResponse,
  OwmErrorBody,
  OwmForecastResponse,
} from "../types/openWeather.js";

const API_BASE = "https://api.openweathermap.org/data/2.5";

export class CityNotFoundError extends Error {
  constructor() {
    super("City not found");
    this.name = "CityNotFoundError";
  }
}

export class OpenWeatherServiceError extends Error {
  constructor(message = "Weather service unavailable") {
    super(message);
    this.name = "OpenWeatherServiceError";
  }
}

function getApiKey(): string {
  const key = process.env.OPENWEATHER_API_KEY;
  if (!key) {
    throw new OpenWeatherServiceError("OpenWeather API key is not configured");
  }
  return key;
}

async function fetchFromOpenWeather<T>(
  path: string,
  city: string,
): Promise<T> {
  const url = new URL(`${API_BASE}${path}`);
  url.searchParams.set("q", city);
  url.searchParams.set("appid", getApiKey());
  url.searchParams.set("units", "metric");

  let response: Response;
  try {
    response = await fetch(url);
  } catch {
    throw new OpenWeatherServiceError("Failed to reach weather service");
  }

  let body: unknown;
  try {
    body = await response.json();
  } catch {
    throw new OpenWeatherServiceError("Invalid response from weather service");
  }

  const errorBody = body as OwmErrorBody;
  const cod = Number(errorBody.cod);

  if (response.status === 404 || cod === 404) {
    throw new CityNotFoundError();
  }

  if (!response.ok) {
    throw new OpenWeatherServiceError();
  }

  return body as T;
}

export function fetchCurrentWeather(city: string): Promise<OwmCurrentResponse> {
  return fetchFromOpenWeather<OwmCurrentResponse>("/weather", city);
}

export function fetchForecastWeather(
  city: string,
): Promise<OwmForecastResponse> {
  return fetchFromOpenWeather<OwmForecastResponse>("/forecast", city);
}
