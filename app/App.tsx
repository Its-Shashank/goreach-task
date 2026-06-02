import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { SavedCitiesProvider } from "./src/features/saved-cities";
import { RootNavigator } from "./src/navigation/RootNavigator";

export default function App() {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60_000,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <SavedCitiesProvider>
        <RootNavigator />
        <StatusBar style="dark" />
      </SavedCitiesProvider>
    </QueryClientProvider>
  );
}
