import type {
  OwmCurrentResponse,
  OwmForecastListItem,
  OwmForecastResponse,
} from "../types/openWeather.js";
import type {
  CurrentWeather,
  ForecastPeriod,
  ForecastWeather,
  Wind,
} from "../types/weather.js";

function mapWind(wind: { speed: number; deg: number }): Wind {
  return {
    speed: wind.speed,
    direction: wind.deg,
  };
}

export function mapCurrentWeather(raw: OwmCurrentResponse): CurrentWeather {
  const condition = raw.weather[0];

  return {
    city: raw.name,
    country: raw.sys.country,
    temperature: raw.main.temp,
    conditions: condition?.main ?? "Unknown",
    description: condition?.description ?? "",
    humidity: raw.main.humidity,
    wind: mapWind(raw.wind),
  };
}

function mapForecastPeriod(item: OwmForecastListItem): ForecastPeriod {
  const condition = item.weather[0];

  return {
    datetime: item.dt_txt,
    temperature: item.main.temp,
    conditions: condition?.main ?? "Unknown",
    description: condition?.description ?? "",
    humidity: item.main.humidity,
    wind: mapWind(item.wind),
  };
}

export function mapForecastWeather(raw: OwmForecastResponse): ForecastWeather {
  return {
    city: raw.city.name,
    country: raw.city.country,
    periods: raw.list.map(mapForecastPeriod),
  };
}
