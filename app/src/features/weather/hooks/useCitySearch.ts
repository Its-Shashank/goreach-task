import { useQuery } from "@tanstack/react-query";
import { WeatherApiError } from "../services/weatherApi";
import {
  currentWeatherQueryOptions,
  forecastWeatherQueryOptions,
} from "./weatherQueryOptions";

export function useCitySearch(city: string | null) {
  const enabled = Boolean(city && city.trim());
  const cityKey = city ?? "";

  const currentQuery = useQuery({
    ...currentWeatherQueryOptions(cityKey),
    enabled,
    retry: false,
  });

  const forecastQuery = useQuery({
    ...forecastWeatherQueryOptions(cityKey),
    enabled: enabled && currentQuery.isSuccess,
    retry: false,
  });

  const isLoading = currentQuery.isLoading || forecastQuery.isLoading;
  const isFetching = currentQuery.isFetching || forecastQuery.isFetching;
  const error = currentQuery.error ?? forecastQuery.error;

  const errorMessage = error
    ? error instanceof WeatherApiError
      ? error.status === 404
        ? "City not found. Check the spelling and try again."
        : error.message
      : "Something went wrong. Please try again."
    : null;

  return {
    current: currentQuery.data,
    forecastItems: forecastQuery.data,
    isLoading,
    isFetching,
    errorMessage,
    isNotFound: error instanceof WeatherApiError && error.status === 404,
    refetch: async () => {
      await currentQuery.refetch();
      await forecastQuery.refetch();
    },
  };
}
