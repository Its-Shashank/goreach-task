import { useQueries } from "@tanstack/react-query";
import { mapCurrentWeatherToRowUI } from "../mappers/weatherUIMappers";
import { currentWeatherQueryOptions } from "./weatherQueryOptions";

export function useSavedCitiesWeather(cities: string[]) {
  return useQueries({
    queries: cities.map((city) => ({
      ...currentWeatherQueryOptions(city),
      select: mapCurrentWeatherToRowUI,
      enabled: cities.length > 0,
      retry: false,
    })),
  });
}
