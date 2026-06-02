import { Router, type Request, type Response } from "express";
import { mapCurrentWeather, mapForecastWeather } from "../mappers/weather.js";
import {
  CityNotFoundError,
  fetchCurrentWeather,
  fetchForecastWeather,
  OpenWeatherServiceError,
} from "../services/openWeather.js";
import type { ErrorResponse } from "../types/weather.js";

const router = Router();

function getCityParam(req: Request): string | null {
  const city = req.query.city;
  if (typeof city !== "string" || city.trim() === "") {
    return null;
  }
  return city.trim();
}

function sendMissingCity(res: Response<ErrorResponse>): void {
  res.status(400).json({ error: "Query parameter 'city' is required" });
}

function sendCityNotFound(res: Response<ErrorResponse>): void {
  res.status(404).json({ error: "City not found" });
}

function sendServerError(res: Response<ErrorResponse>): void {
  res.status(500).json({ error: "Unable to fetch weather data" });
}

async function handleWeatherRequest(
  res: Response,
  fetcher: () => Promise<unknown>,
): Promise<void> {
  try {
    const data = await fetcher();
    res.json(data);
  } catch (error) {
    if (error instanceof CityNotFoundError) {
      sendCityNotFound(res);
      return;
    }
    if (error instanceof OpenWeatherServiceError) {
      console.error(error.message);
      sendServerError(res);
      return;
    }
    console.error("Unexpected error:", error);
    sendServerError(res);
  }
}

router.get("/current", async (req, res) => {
  const city = getCityParam(req);
  if (!city) {
    sendMissingCity(res);
    return;
  }

  await handleWeatherRequest(res, async () => {
    const raw = await fetchCurrentWeather(city);
    return mapCurrentWeather(raw);
  });
});

router.get("/forecast", async (req, res) => {
  const city = getCityParam(req);
  if (!city) {
    sendMissingCity(res);
    return;
  }

  await handleWeatherRequest(res, async () => {
    const raw = await fetchForecastWeather(city);
    return mapForecastWeather(raw);
  });
});

export default router;
