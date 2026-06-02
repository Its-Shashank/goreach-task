import { FlatList, StyleSheet, Text, View } from "react-native";
import type { ForecastPeriod } from "../types/weather";
import { colors, commonStyles } from "../theme/common";

export interface ForecastListProps {
  periods: ForecastPeriod[];
  maxItems?: number;
}

function formatDatetime(datetime: string): string {
  const date = new Date(datetime.replace(" ", "T"));
  if (Number.isNaN(date.getTime())) {
    return datetime;
  }
  return date.toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function ForecastList({ periods, maxItems = 8 }: ForecastListProps) {
  const items = periods.slice(0, maxItems);

  return (
    <View style={styles.container}>
      <Text style={commonStyles.title}>Forecast</Text>
      <FlatList
        data={items}
        keyExtractor={(item) => item.datetime}
        scrollEnabled={false}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.datetime}>{formatDatetime(item.datetime)}</Text>
            <Text style={styles.conditions}>{item.conditions}</Text>
            <Text style={styles.temp}>{Math.round(item.temperature)}°C</Text>
          </View>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    gap: 8,
  },
  datetime: {
    flex: 1.4,
    fontSize: 13,
    color: colors.textSecondary,
  },
  conditions: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
  },
  temp: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
    minWidth: 44,
    textAlign: "right",
  },
  separator: {
    height: 1,
    backgroundColor: colors.border,
  },
});
