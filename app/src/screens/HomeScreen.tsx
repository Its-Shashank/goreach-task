import { useIsFocused } from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type Swipeable from "react-native-gesture-handler/Swipeable";
import { useCallback, useLayoutEffect, useRef } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Loading } from "../components/Loading";
import {
  EmptyState,
  SwipeableCityRow,
  useSavedCities,
} from "../features/saved-cities";
import { useSavedCitiesWeather, WeatherApiError } from "../features/weather";
import type { RootStackParamList } from "../types/navigation";
import { colors, commonStyles } from "../theme/common";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

export function HomeScreen({ navigation }: Props) {
  const isFocused = useIsFocused();
  const { cities, isLoading: citiesLoading, removeCity } = useSavedCities();
  const { queries: weatherQueries, isRefetching, refetch } =
    useSavedCitiesWeather(cities, isFocused);
  const openSwipeableRef = useRef<Swipeable | null>(null);

  const handleSwipeBegin = useCallback((active: Swipeable) => {
    if (openSwipeableRef.current && openSwipeableRef.current !== active) {
      openSwipeableRef.current.close();
    }
    openSwipeableRef.current = active;
  }, []);

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
        style={styles.list}
        data={cities}
        keyExtractor={(item) => item}
        contentContainerStyle={styles.listContent}
        refreshing={isRefetching}
        onRefresh={refetch}
        renderItem={({ item, index }) => {
          const query = weatherQueries[index];
          const errorMessage =
            query?.error instanceof WeatherApiError
              ? query.error.message
              : query?.error
                ? "Failed to load"
                : undefined;

          return (
            <SwipeableCityRow
              cityName={item}
              weather={query?.data}
              isLoading={query?.isLoading || query?.isFetching}
              errorMessage={errorMessage}
              onPress={() =>
                navigation.navigate("Search", { cityName: item })
              }
              onDelete={removeCity}
              onSwipeBegin={handleSwipeBegin}
            />
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
  listContent: {
    flexGrow: 1,
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
