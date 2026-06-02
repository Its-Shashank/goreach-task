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

### 2. Feature-Based (Vertical Slicing) Architecture

Abandoning traditional technical-bucket folders (e.g., sorting everything into generic `/components` or `/hooks`), the app is structured around **domain features** under `src/features/`.

- **High Cohesion:** Everything required for a specific domain—its sub-components, data-fetching hooks, API services, and types—lives in one dedicated folder (e.g., `features/weather/`). This allows multiple engineers to scale out new features without stepping on each other's code.
- **Thin Presentation Layers:** Files inside `src/screens/` act purely as structural layout wrappers that orchestrate domain features.

### 3. Strict Separation of Concerns (Visual vs. Logical Layers)

To ensure the UI layout stays highly testable and robust, components are explicitly **presentational ("dumb")**. 

- **Zero Layout Logic:** Components accept flat, completely formatted UI models via props. There is no inline string concatenation, date calculation, or unit conversion (`Math.round`, `new Date()`) inside the JSX.
- **TanStack Query `select` Memoization:** Data transformation logic is pushed entirely into the custom hooks layer utilizing React Query’s `select` mapping function. This ensures that data parsing only runs when the cached server response changes, avoiding useless recalculations on layout re-renders.

---

## Tech Stack & Directory Structure

- **Frontend:** React Native (Expo), TypeScript, React Navigation (Native Stack), TanStack Query (React Query), AsyncStorage.
- **Backend:** Node.js, Express, TypeScript, Axios, Dotenv.

```text
├── server/               # Express BFF Proxy
│   ├── src/
│   │   ├── middleware/   # Error & Validation handlers
│   │   ├── types/        # API Request/Response definitions
│   │   └── index.ts      # App entry point
└── app/                  # React Native Client
    └── src/
        ├── api/          # Global client axios config
        ├── components/   # Atomic, truly global generic UI items
        ├── features/     # Feature-sliced business logic
        │   ├── weather/      # Components, hooks, services, types for weather data
        │   └── saved-cities/ # Components, hooks, storage for city lists
        ├── navigation/   # Root Stack Navigator configuration
        ├── screens/      # Layout screens (Home, Search/Details)
        └── theme/        # Style constants & tokens

```

## ⚡ Getting Started

### 1. Environment Configuration

Create a `.env` file inside the `/server` directory:

```env
PORT=3000
OPENWEATHER_API_KEY=your_actual_api_key_here
```



### 2. Spin up the Server

```env
cd server
npm install
npm run dev
```

The server will boot up and run on `http://localhost:3000`.



### 3. Spin up the mobile app

```env
cd app
npm install
npx expo start
```

