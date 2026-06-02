export interface Wind {
  speed: number;
  direction: number;
}

export interface CurrentWeather {
  city: string;
  country: string;
  temperature: number;
  conditions: string;
  description: string;
  humidity: number;
  wind: Wind;
}

export interface ForecastPeriod {
  datetime: string;
  temperature: number;
  conditions: string;
  description: string;
  humidity: number;
  wind: Wind;
}

export interface ForecastWeather {
  city: string;
  country: string;
  periods: ForecastPeriod[];
}

export interface ForecastPagination {
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
}

export interface PaginatedForecastWeather {
  city: string;
  country: string;
  periods: ForecastPeriod[];
  pagination: ForecastPagination;
}

export interface ErrorResponse {
  error: string;
}
