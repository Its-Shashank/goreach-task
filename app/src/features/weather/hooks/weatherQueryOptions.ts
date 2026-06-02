import { fetchCurrentWeather, fetchForecastWeather } from "../services/weatherApi";
import {
  mapCurrentWeatherToUI,
  mapForecastWeatherToUI,
} from "../mappers/weatherUIMappers";

export const FORECAST_UI_MAX_ITEMS = 8;

export function currentWeatherQueryOptions(city: string) {
  return {
    queryKey: ["weather", "current", city] as const,
    queryFn: () => fetchCurrentWeather(city),
    select: mapCurrentWeatherToUI,
  };
}

export function forecastWeatherQueryOptions(city: string) {
  return {
    queryKey: ["weather", "forecast", city] as const,
    queryFn: () => fetchForecastWeather(city),
    select: (data: Awaited<ReturnType<typeof fetchForecastWeather>>) =>
      mapForecastWeatherToUI(data, FORECAST_UI_MAX_ITEMS),
  };
}
