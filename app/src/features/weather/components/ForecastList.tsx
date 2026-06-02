import { FlatList, StyleSheet, Text, View } from "react-native";
import { colors, commonStyles } from "../../../theme/common";
import type { ForecastItemUIModel } from "../types/weather";

export interface ForecastListProps {
  items: ForecastItemUIModel[];
}

export function ForecastList({ items }: ForecastListProps) {
  return (
    <View style={styles.container}>
      <Text style={commonStyles.title}>Forecast</Text>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <View style={styles.datetimeColumn}>
              <Text style={styles.dayOfWeek}>{item.dayOfWeek}</Text>
              <Text style={styles.datetime}>{item.datetimeLabel}</Text>
            </View>
            <Text style={styles.conditions}>{item.conditions}</Text>
            <Text style={styles.temp}>{item.temperature}</Text>
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
  datetimeColumn: {
    flex: 1.4,
  },
  dayOfWeek: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.text,
  },
  datetime: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
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
