import { useQueries, useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";
import { mapCurrentWeatherToRowUI } from "../mappers/weatherUIMappers";
import { currentWeatherQueryOptions } from "./weatherQueryOptions";

export function useSavedCitiesWeather(cities: string[], enabled = true) {
  const queryClient = useQueryClient();

  const queries = useQueries({
    queries: cities.map((city) => ({
      ...currentWeatherQueryOptions(city),
      select: mapCurrentWeatherToRowUI,
      enabled: enabled && cities.length > 0,
      retry: false,
    })),
  });

  const isRefetching = useMemo(
    () => queries.some((query) => query.isRefetching),
    [queries],
  );

  const refetch = useCallback(async () => {
    if (cities.length === 0) {
      return;
    }
    await queryClient.refetchQueries({
      queryKey: ["weather", "current"],
    });
  }, [cities.length, queryClient]);

  return {
    queries,
    isRefetching,
    refetch,
  };
}
