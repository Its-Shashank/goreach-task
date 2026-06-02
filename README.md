# Weather Dashboard (Full-Stack Mobile Assignment)

A lightweight, production-ready React Native application built with **Expo**, backed by a dedicated **Node.js/Express BFF (Backend-for-Frontend) proxy**.

The architecture focuses strictly on type safety, clean separation of concerns, and feature-based scalability rather than visual complexity.

---

## Architectural Highlights & Decisions

### 1. The BFF (Backend-For-Frontend) Pattern

Instead of calling OpenWeatherMap directly from the mobile client, the app routes all requests through a thin Express proxy layer.

- **Security:** The OpenWeatherMap API key remains completely isolated on the server, eliminating any risk of client-side key exposure or reverse-engineering.
- **Data Shaping:** The backend does not simply pass through raw, bloated JSON payloads. It parses and maps the data into a lean, strictly-typed API response tailored precisely to what the mobile UI needs. This minimizes bandwidth over the wire.
- **Resilient Error Mapping:** Third-party provider failures (e.g., city not found, rate limits) are caught by the server and translated into standardized HTTP status codes (`400`, `404`, `500`) with consistent JSON error bodies.
- **REST Endpoints:**
  - `GET /api/weather/current?city=` — current conditions for a city
  - `GET /api/weather/forecast?city=` — forecast periods for a city

### 2. Feature-Based (Vertical Slicing) Architecture

Abandoning traditional technical-bucket folders (e.g., sorting everything into generic `/components` or `/hooks`), the app is structured around **domain features** under `src/features/`.

- **High Cohesion:** Everything required for a specific domain—its sub-components, data-fetching hooks, API services, and types—lives in one dedicated folder (e.g., `features/weather/`). This allows multiple engineers to scale out new features without stepping on each other's code.
- **Thin Presentation Layers:** Files inside `src/screens/` act purely as structural layout wrappers that orchestrate domain features.

### 3. Strict Separation of Concerns (Visual vs. Logical Layers)

To ensure the UI layout stays highly testable and robust, components are explicitly **presentational ("dumb")**.

- **Zero Layout Logic:** Components accept flat, completely formatted UI models via props. There is no inline string concatenation, date calculation, or unit conversion (`Math.round`, `new Date()`) inside the JSX.
- **TanStack Query `select` Memoization:** Data transformation logic is pushed into the hooks layer utilizing React Query’s `select` mapping function. This ensures that data parsing only runs when the cached server response changes, avoiding useless recalculations on layout re-renders.

### 4. Shared Query Cache Across Screens

React Query cache keys are aligned so data fetched on one screen can be reused on another without redundant network calls.

- **Current Weather Deduplication:** Home and Search both use `["weather", "current", city]`. Tapping a saved city on Home opens Search with current weather already in cache—only the forecast needs to be fetched.
- **Focus-Aware Fetching:** Home weather queries are disabled while the Search screen is focused, preventing duplicate in-flight requests when navigating between screens.

---

## Tech Stack & Directory Structure

- **Frontend:** React Native (Expo SDK 54), TypeScript, React Navigation (Native Stack), TanStack Query, AsyncStorage, React Native Gesture Handler.
- **Backend:** Node.js, Express, TypeScript, native `fetch`, Dotenv.

```text
├── server/                  # Express BFF Proxy
│   └── src/
│       ├── middleware/      # Request logging
│       ├── routes/          # /api/weather routes
│       ├── services/        # OpenWeather client
│       ├── mappers/         # Raw OWM → lean API types
│       ├── types/           # API request/response definitions
│       └── index.ts         # App entry point
└── app/                     # React Native Client
    └── src/
        ├── components/      # Atomic, truly global generic UI items
        ├── constants/       # API base URL (device-aware)
        ├── features/        # Feature-sliced business logic
        │   ├── weather/         # API, hooks, mappers, UI models, cards, forecast list
        │   └── saved-cities/    # AsyncStorage persistence, swipe-to-delete rows
        ├── navigation/      # Root Stack Navigator configuration
        ├── screens/         # Layout screens (Home, Search/Details)
        └── theme/           # Style constants & tokens
```

---

## Getting Started

### 1. Environment Configuration

Create a `.env` file inside the `/server` directory:

```env
PORT=5001
OPENWEATHER_API_KEY=your_actual_api_key_here
```

> **Note:** Port `5001` avoids conflicts with macOS AirPlay Receiver on port `5000`.

### 2. Spin up the Server

```bash
cd server
npm install
npm run dev
```

The server will boot up and run on `http://localhost:5001`.

### 3. Spin up the Mobile App

```bash
cd app
npm install
npx expo start
```

On a physical device, the app resolves the BFF URL from Expo’s dev server host automatically (see `app/src/constants/api.ts`).
