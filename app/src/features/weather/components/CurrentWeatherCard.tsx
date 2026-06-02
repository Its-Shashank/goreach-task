import { StyleSheet, Text, View } from "react-native";
import { commonStyles } from "../../../theme/common";
import type { CurrentWeatherUIModel } from "../types/weather";

export interface CurrentWeatherCardProps {
  weather: CurrentWeatherUIModel;
}

export function CurrentWeatherCard({ weather }: CurrentWeatherCardProps) {
  return (
    <View style={[commonStyles.card, styles.card]}>
      <Text style={commonStyles.title}>{weather.locationLabel}</Text>
      <Text style={styles.temperature}>{weather.temperature}</Text>
      <Text style={commonStyles.body}>{weather.conditions}</Text>
      <Text style={commonStyles.subtitle}>{weather.description}</Text>
      <View style={styles.details}>
        <Text style={commonStyles.body}>{weather.humidity}</Text>
        <Text style={commonStyles.body}>{weather.wind}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
  },
  temperature: {
    fontSize: 36,
    fontWeight: "700",
    color: "#1a1a1a",
    marginVertical: 8,
  },
  details: {
    marginTop: 12,
    gap: 4,
  },
});
