export interface OwmWeatherCondition {
  main: string;
  description: string;
}

export interface OwmWind {
  speed: number;
  deg: number;
}

export interface OwmMain {
  temp: number;
  humidity: number;
}

export interface OwmCurrentResponse {
  name: string;
  sys: { country: string };
  main: OwmMain;
  weather: OwmWeatherCondition[];
  wind: OwmWind;
}

export interface OwmForecastListItem {
  dt: number;
  dt_txt: string;
  main: OwmMain;
  weather: OwmWeatherCondition[];
  wind: OwmWind;
}

export interface OwmForecastResponse {
  city: { name: string; country: string };
  list: OwmForecastListItem[];
}

export interface OwmErrorBody {
  cod: string | number;
  message: string;
}
