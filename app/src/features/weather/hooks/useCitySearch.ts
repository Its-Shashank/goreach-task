import { useQuery } from "@tanstack/react-query";
import { WeatherApiError } from "../services/weatherApi";
import type { CurrentWeatherUIModel, ForecastItemUIModel } from "../types/weather";
import {
  currentWeatherQueryOptions,
  forecastWeatherQueryOptions,
} from "./weatherQueryOptions";

export interface CitySearchResult {
  current: CurrentWeatherUIModel;
  forecastItems: ForecastItemUIModel[];
}

function getErrorMessage(error: unknown): string | null {
  if (!error) return null;
  if (error instanceof WeatherApiError) {
    return error.status === 404
      ? "City not found. Check the spelling and try again."
      : error.message;
  }
  return "Something went wrong. Please try again.";
}

export function useCitySearch(city: string | null) {
  const trimmedCity = city?.trim() ?? "";
  const enabled = trimmedCity.length > 0;

  const currentQuery = useQuery({
    ...currentWeatherQueryOptions(trimmedCity),
    enabled,
    retry: false,
  });

  const currentReady =
    currentQuery.isSuccess || Boolean(currentQuery.data);

  const forecastQuery = useQuery({
    ...forecastWeatherQueryOptions(trimmedCity),
    enabled: enabled && currentReady,
    retry: false,
  });

  const error = currentQuery.error ?? forecastQuery.error;

  const isLoadingCurrent = currentQuery.isPending;
  const isLoadingForecast =
    currentReady && forecastQuery.isPending && !forecastQuery.data;

  const isLoading = isLoadingCurrent || isLoadingForecast;

  const isFetching = currentQuery.isFetching || forecastQuery.isFetching;

  const refetch = async () => {
    await Promise.all([currentQuery.refetch(), forecastQuery.refetch()]);
  };

  return {
    current: currentQuery.data,
    forecastItems: forecastQuery.data,
    isLoading,
    isLoadingCurrent,
    isLoadingForecast,
    isFetching,
    errorMessage: getErrorMessage(error),
    isNotFound: error instanceof WeatherApiError && error.status === 404,
    refetch,
  };
}
