import { StyleSheet, Text, View } from "react-native";
import type { SavedCityRowUIModel } from "../../weather/types/weather";
import { colors, commonStyles } from "../../../theme/common";

export interface CityWeatherRowProps {
  cityName: string;
  weather?: SavedCityRowUIModel;
  isLoading?: boolean;
  errorMessage?: string;
}

export function CityWeatherRow({
  cityName,
  weather,
  isLoading,
  errorMessage,
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
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    backgroundColor: colors.surface,
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
});
