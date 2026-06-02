import { fetchCurrentWeather, fetchForecastWeatherPage } from "../services/weatherApi";
import { mapCurrentWeatherToUI } from "../mappers/weatherUIMappers";

export const FORECAST_PAGE_SIZE = 8;

export function currentWeatherQueryOptions(city: string) {
  return {
    queryKey: ["weather", "current", city] as const,
    queryFn: () => fetchCurrentWeather(city),
    select: mapCurrentWeatherToUI,
  };
}

export function forecastInfiniteQueryOptions(city: string) {
  return {
    queryKey: ["weather", "forecast", "infinite", city] as const,
    queryFn: ({ pageParam }: { pageParam: number }) =>
      fetchForecastWeatherPage(city, pageParam, FORECAST_PAGE_SIZE),
    initialPageParam: 1,
    getNextPageParam: (
      lastPage: Awaited<ReturnType<typeof fetchForecastWeatherPage>>,
    ) => {
      const pagination = lastPage?.pagination;
      if (!pagination?.hasMore) {
        return undefined;
      }
      return pagination.page + 1;
    },
  };
}
