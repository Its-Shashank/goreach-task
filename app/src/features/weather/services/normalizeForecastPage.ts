import type {
  ForecastPeriod,
  ForecastWeather,
  PaginatedForecastWeather,
} from "../types/weather";

function isPaginatedForecast(
  body: unknown,
): body is PaginatedForecastWeather {
  if (!body || typeof body !== "object") {
    return false;
  }
  const pagination = (body as PaginatedForecastWeather).pagination;
  return (
    pagination !== null &&
    typeof pagination === "object" &&
    typeof pagination.hasMore === "boolean"
  );
}

function slicePeriods(
  periods: ForecastPeriod[],
  page: number,
  limit: number,
): PaginatedForecastWeather["pagination"] & { periods: ForecastPeriod[] } {
  const total = periods.length;
  const start = (page - 1) * limit;
  const slice = periods.slice(start, start + limit);

  return {
    periods: slice,
    page,
    limit,
    total,
    hasMore: start + slice.length < total,
  };
}

/** Ensures paginated shape even for legacy BFF responses or stale cache entries. */
export function normalizeForecastPage(
  body: unknown,
  page: number,
  limit: number,
): PaginatedForecastWeather {
  if (isPaginatedForecast(body)) {
    return body;
  }

  const legacy = body as ForecastWeather;
  const periods = Array.isArray(legacy?.periods) ? legacy.periods : [];
  const sliced = slicePeriods(periods, page, limit);

  return {
    city: legacy?.city ?? "",
    country: legacy?.country ?? "",
    periods: sliced.periods,
    pagination: {
      page: sliced.page,
      limit: sliced.limit,
      total: sliced.total,
      hasMore: sliced.hasMore,
    },
  };
}
