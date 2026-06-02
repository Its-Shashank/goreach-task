import type {
  CurrentWeather,
  CurrentWeatherUIModel,
  ForecastItemUIModel,
  ForecastPeriod,
  SavedCityRowUIModel,
} from "../types/weather";

const FALLBACK_LABEL = "—";
const FALLBACK_CONDITIONS = "Unknown";

function degreesToCompass(degrees: number): string {
  if (!Number.isFinite(degrees)) {
    return "N";
  }
  const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  const index = Math.round(degrees / 45) % directions.length;
  return directions[index] ?? "N";
}

function formatTemperature(celsius: number): string {
  if (!Number.isFinite(celsius)) {
    return FALLBACK_LABEL;
  }
  return `${Math.round(celsius)}°C`;
}

function formatHumidity(humidity: number): string {
  if (!Number.isFinite(humidity)) {
    return FALLBACK_LABEL;
  }
  return `${Math.round(humidity)}%`;
}

function formatWind(speedMetersPerSecond: number, directionDegrees: number): string {
  if (!Number.isFinite(speedMetersPerSecond)) {
    return FALLBACK_LABEL;
  }
  const speedKmh = Math.round(speedMetersPerSecond * 3.6);
  const direction = degreesToCompass(directionDegrees);
  return `${speedKmh} km/h from ${direction}`;
}

function formatLocationLabel(city: string, country: string): string {
  const trimmedCity = city.trim() || FALLBACK_LABEL;
  const trimmedCountry = country.trim();
  return trimmedCountry ? `${trimmedCity}, ${trimmedCountry}` : trimmedCity;
}

function formatConditionsSummary(conditions: string, humidity: number): string {
  const label = conditions.trim() || FALLBACK_CONDITIONS;
  return `${label} · ${formatHumidity(humidity)} humidity`;
}

function parseForecastDate(datetime: string): Date | null {
  const normalized = datetime.trim().replace(" ", "T");
  const date = new Date(normalized);
  return Number.isNaN(date.getTime()) ? null : date;
}

function formatDayOfWeek(datetime: string): string {
  const date = parseForecastDate(datetime);
  if (!date) {
    return FALLBACK_LABEL;
  }
  return date.toLocaleDateString(undefined, { weekday: "long" });
}

function formatForecastDatetimeLabel(datetime: string): string {
  const date = parseForecastDate(datetime);
  if (!date) {
    return datetime.trim() || FALLBACK_LABEL;
  }
  return date.toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function mapForecastPeriodToUI(period: ForecastPeriod): ForecastItemUIModel {
  const datetime = period.datetime?.trim() || FALLBACK_LABEL;

  return {
    id: datetime,
    dayOfWeek: formatDayOfWeek(datetime),
    datetimeLabel: formatForecastDatetimeLabel(datetime),
    temperature: formatTemperature(period.temperature),
    conditions: period.conditions?.trim() || FALLBACK_CONDITIONS,
    description: period.description?.trim() || "",
    humidity: formatHumidity(period.humidity),
    wind: formatWind(period.wind.speed, period.wind.direction),
  };
}

export function mapCurrentWeatherToUI(
  weather: CurrentWeather,
): CurrentWeatherUIModel {
  const cityName = weather.city?.trim() || FALLBACK_LABEL;
  const conditions = weather.conditions?.trim() || FALLBACK_CONDITIONS;
  const description = weather.description?.trim() || "";

  return {
    cityName,
    locationLabel: formatLocationLabel(weather.city, weather.country),
    temperature: formatTemperature(weather.temperature),
    conditions,
    description,
    humidity: `Humidity: ${formatHumidity(weather.humidity)}`,
    wind: `Wind: ${formatWind(weather.wind.speed, weather.wind.direction)}`,
    conditionsSummary: formatConditionsSummary(conditions, weather.humidity),
  };
}

export function mapCurrentWeatherToRowUI(
  weather: CurrentWeather,
): SavedCityRowUIModel {
  const ui = mapCurrentWeatherToUI(weather);
  return {
    cityName: ui.cityName,
    locationLabel: ui.locationLabel,
    temperature: ui.temperature,
    conditionsSummary: ui.conditionsSummary,
  };
}

export function mapForecastPeriodsToUI(
  periods: ForecastPeriod[],
): ForecastItemUIModel[] {
  return periods.map(mapForecastPeriodToUI);
}
