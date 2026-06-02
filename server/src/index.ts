import "dotenv/config";
import express from "express";
import { requestLogger } from "./middleware/requestLogger.js";
import weatherRouter from "./routes/weather.js";

const app = express();
const port = Number(process.env.PORT) || 5001;

app.use(express.json());
app.use((_req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (_req.method === "OPTIONS") {
    res.sendStatus(204);
    return;
  }
  next();
});

app.use(requestLogger);

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/weather", weatherRouter);

app.listen(port, "0.0.0.0", () => {
  console.log(`Server listening on http://localhost:${port}`);
  console.log(`LAN access: use your machine IP, e.g. http://192.168.x.x:${port}`);
});
