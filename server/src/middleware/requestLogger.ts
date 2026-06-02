import type { NextFunction, Request, Response } from "express";

export function requestLogger(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  if (req.method === "OPTIONS") {
    next();
    return;
  }

  const startedAt = Date.now();

  res.on("finish", () => {
    const durationMs = Date.now() - startedAt;
    const timestamp = new Date().toISOString();
    const city =
      typeof req.query.city === "string" ? ` city="${req.query.city}"` : "";
    console.log(
      `[${timestamp}] ${req.method} ${req.originalUrl}${city} -> ${res.statusCode} (${durationMs}ms)`,
    );
  });

  next();
}
