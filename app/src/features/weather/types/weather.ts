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

export interface ApiErrorBody {
  error: string;
}

export interface CurrentWeatherUIModel {
  cityName: string;
  locationLabel: string;
  temperature: string;
  conditions: string;
  description: string;
  /** e.g. "Humidity: 65%" */
  humidity: string;
  /** e.g. "Wind: 12 km/h from NW" */
  wind: string;
  conditionsSummary: string;
}

export interface ForecastItemUIModel {
  id: string;
  dayOfWeek: string;
  datetimeLabel: string;
  temperature: string;
  conditions: string;
  description: string;
  /** e.g. "Humidity: 65%" */
  humidity: string;
  /** e.g. "Wind: 12 km/h from NW" */
  wind: string;
}

export interface SavedCityRowUIModel {
  cityName: string;
  locationLabel: string;
  temperature: string;
  conditionsSummary: string;
}
