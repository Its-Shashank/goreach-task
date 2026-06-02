import { useQueries, useQueryClient } from "@tanstack/react-query";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useCallback, useLayoutEffect, useState } from "react";
import {
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { fetchCurrentWeather, WeatherApiError } from "../api/weatherApi";
import { CityWeatherRow } from "../components/CityWeatherRow";
import { EmptyState } from "../components/EmptyState";
import { Loading } from "../components/Loading";
import { useSavedCities } from "../hooks/useSavedCities";
import type { RootStackParamList } from "../types/navigation";
import { colors, commonStyles } from "../theme/common";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

export function HomeScreen({ navigation }: Props) {
  const queryClient = useQueryClient();
  const { cities, isLoading: citiesLoading, removeCity, reload } =
    useSavedCities();
  const [refreshing, setRefreshing] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable
          onPress={() => navigation.navigate("Search")}
          style={styles.headerButton}
          accessibilityLabel="Search cities"
        >
          <Text style={styles.headerButtonText}>Search</Text>
        </Pressable>
      ),
    });
  }, [navigation]);

  const weatherQueries = useQueries({
    queries: cities.map((city) => ({
      queryKey: ["weather", "current", city],
      queryFn: () => fetchCurrentWeather(city),
      enabled: cities.length > 0,
      retry: false,
    })),
  });

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await reload();
    await queryClient.refetchQueries({ queryKey: ["weather", "current"] });
    setRefreshing(false);
  }, [reload, queryClient]);

  if (citiesLoading) {
    return (
      <View style={commonStyles.screen}>
        <Loading message="Loading saved cities…" />
      </View>
    );
  }

  if (cities.length === 0) {
    return (
      <View style={commonStyles.screen}>
        <EmptyState
          title="No saved cities"
          message="Search for a city and save it to see weather here."
        />
        <Pressable
          style={[commonStyles.primaryButton, styles.emptyAction]}
          onPress={() => navigation.navigate("Search")}
        >
          <Text style={commonStyles.primaryButtonText}>Search cities</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={commonStyles.screen}>
      <FlatList
        data={cities}
        keyExtractor={(item) => item}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        renderItem={({ item, index }) => {
          const query = weatherQueries[index];
          const errorMessage =
            query?.error instanceof WeatherApiError
              ? query.error.message
              : query?.error
                ? "Failed to load"
                : undefined;

          return (
            <Pressable
              onPress={() =>
                navigation.navigate("Search", { cityName: item })
              }
              accessibilityRole="button"
              accessibilityLabel={`View forecast for ${item}`}
            >
              <CityWeatherRow
                city={item}
                weather={query?.data}
                isLoading={query?.isLoading || query?.isFetching}
                errorMessage={errorMessage}
                onRemove={removeCity}
              />
            </Pressable>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    padding: 16,
  },
  headerButton: {
    marginRight: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  headerButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: "600",
  },
  emptyAction: {
    marginHorizontal: 32,
    marginBottom: 48,
  },
});
