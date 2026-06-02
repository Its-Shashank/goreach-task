import { Pressable, StyleSheet, Text, View } from "react-native";
import type { CurrentWeather } from "../types/weather";
import { colors, commonStyles } from "../theme/common";

export interface CityWeatherRowProps {
  city: string;
  weather?: CurrentWeather;
  isLoading?: boolean;
  errorMessage?: string;
  onRemove?: (city: string) => void;
}

export function CityWeatherRow({
  city,
  weather,
  isLoading,
  errorMessage,
  onRemove,
}: CityWeatherRowProps) {
  return (
    <View style={[commonStyles.card, styles.row]}>
      <View style={styles.content}>
        <Text style={styles.city}>{weather?.city ?? city}</Text>
        {isLoading ? (
          <Text style={commonStyles.subtitle}>Updating…</Text>
        ) : errorMessage ? (
          <Text style={styles.error}>{errorMessage}</Text>
        ) : weather ? (
          <>
            <Text style={styles.temp}>{Math.round(weather.temperature)}°C</Text>
            <Text style={commonStyles.subtitle}>
              {weather.conditions} · {weather.humidity}% humidity
            </Text>
          </>
        ) : null}
      </View>
      {onRemove ? (
        <Pressable
          onPress={() => onRemove(city)}
          style={styles.removeButton}
          accessibilityLabel={`Remove ${city}`}
        >
          <Text style={styles.removeText}>Remove</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  content: {
    flex: 1,
  },
  city: {
    fontSize: 17,
    fontWeight: "600",
    color: colors.text,
  },
  temp: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.text,
    marginTop: 4,
  },
  error: {
    fontSize: 13,
    color: colors.error,
    marginTop: 4,
  },
  removeButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  removeText: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: "500",
  },
});
