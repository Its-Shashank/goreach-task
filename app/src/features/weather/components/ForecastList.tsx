import type { ReactNode } from "react";
import { useRef } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
  type ListRenderItem,
} from "react-native";
import { colors, commonStyles } from "../../../theme/common";
import type { ForecastItemUIModel } from "../types/weather";

export interface ForecastListProps {
  items: ForecastItemUIModel[];
  header?: ReactNode;
  hasMore?: boolean;
  isLoadingMore?: boolean;
  isLoadingInitial?: boolean;
  onLoadMore?: () => void;
}

function ForecastRow({ item }: { item: ForecastItemUIModel }) {
  return (
    <View style={styles.row}>
      <View style={styles.datetimeColumn}>
        <Text style={styles.dayOfWeek}>{item.dayOfWeek}</Text>
        <Text style={styles.datetime}>{item.datetimeLabel}</Text>
      </View>
      <Text style={styles.conditions}>{item.conditions}</Text>
      <Text style={styles.temp}>{item.temperature}</Text>
    </View>
  );
}

const renderItem: ListRenderItem<ForecastItemUIModel> = ({ item }) => (
  <ForecastRow item={item} />
);

export function ForecastList({
  items,
  header,
  hasMore = false,
  isLoadingMore = false,
  isLoadingInitial = false,
  onLoadMore,
}: ForecastListProps) {
  const endReachedReady = useRef(false);

  const handleEndReached = () => {
    if (!endReachedReady.current) {
      return;
    }
    if (hasMore && !isLoadingMore && !isLoadingInitial && items.length > 0) {
      onLoadMore?.();
    }
  };

  return (
    <FlatList
      style={styles.list}
      data={items}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      onScrollBeginDrag={() => {
        endReachedReady.current = true;
      }}
      ListHeaderComponent={
        <>
          {header}
          <Text style={[commonStyles.title, styles.title]}>Forecast</Text>
        </>
      }
      ListFooterComponent={
        isLoadingMore || isLoadingInitial ? (
          <View style={styles.footer}>
            <ActivityIndicator color={colors.primary} />
          </View>
        ) : null
      }
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      onEndReached={handleEndReached}
      onEndReachedThreshold={0.3}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={styles.content}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    padding: 16,
    paddingBottom: 100,
  },
  title: {
    marginTop: 8,
    marginBottom: 4,
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
  footer: {
    paddingVertical: 16,
    alignItems: "center",
  },
});
