import { Pressable, StyleSheet, Text, View } from "react-native";
import type { SavedCityRowUIModel } from "../../weather/types/weather";
import { colors, commonStyles } from "../../../theme/common";

export interface CityWeatherRowProps {
  cityName: string;
  weather?: SavedCityRowUIModel;
  isLoading?: boolean;
  errorMessage?: string;
  onRemove?: (cityName: string) => void;
}

export function CityWeatherRow({
  cityName,
  weather,
  isLoading,
  errorMessage,
  onRemove,
}: CityWeatherRowProps) {
  return (
    <View style={[commonStyles.card, styles.row]}>
      <View style={styles.content}>
        <Text style={styles.city}>{weather?.locationLabel ?? cityName}</Text>
        {isLoading ? (
          <Text style={commonStyles.subtitle}>Updating…</Text>
        ) : null}
        {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
        {weather && !isLoading && !errorMessage ? (
          <>
            <Text style={styles.temp}>{weather.temperature}</Text>
            <Text style={commonStyles.subtitle}>
              {weather.conditionsSummary}
            </Text>
          </>
        ) : null}
      </View>
      {onRemove ? (
        <Pressable
          onPress={() => onRemove(cityName)}
          style={styles.removeButton}
          accessibilityLabel={`Remove ${cityName}`}
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
