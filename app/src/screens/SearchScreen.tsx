import type { RouteProp } from "@react-navigation/native";
import { useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Error } from "../components/Error";
import { Loading } from "../components/Loading";
import { API_BASE_URL } from "../constants/api";
import { useSavedCities } from "../features/saved-cities";
import {
  CurrentWeatherCard,
  ForecastList,
  useCitySearch,
} from "../features/weather";
import type { RootStackParamList } from "../types/navigation";
import { colors, commonStyles } from "../theme/common";

type SearchScreenRouteProp = RouteProp<RootStackParamList, "Search">;

export function SearchScreen() {
  const route = useRoute<SearchScreenRouteProp>();
  const insets = useSafeAreaInsets();
  const [input, setInput] = useState("");
  const [submittedCity, setSubmittedCity] = useState<string | null>(null);
  const { saveCity, isSaved } = useSavedCities();

  const { current, forecastItems, isLoading, errorMessage, isNotFound } =
    useCitySearch(submittedCity);

  useEffect(() => {
    const cityName = route.params?.cityName?.trim();
    if (!cityName) return;

    setInput(cityName);
    setSubmittedCity(cityName);
    Keyboard.dismiss();
  }, [route.params?.cityName]);

  const handleSubmit = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    Keyboard.dismiss();
    setSubmittedCity(trimmed);
  };

  const handleSave = async () => {
    const cityName = current?.cityName ?? submittedCity;
    if (!cityName) return;
    await saveCity(cityName);
  };

  const saved =
    submittedCity !== null &&
    isSaved(current?.cityName ?? submittedCity);

  const showSaveButton = Boolean(
    submittedCity && current && !isLoading && !errorMessage,
  );

  return (
    <KeyboardAvoidingView
      style={commonStyles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.content,
          showSaveButton && styles.contentWithFooter,
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.searchRow}>
          <TextInput
            style={styles.input}
            placeholder="Enter city name"
            placeholderTextColor={colors.textSecondary}
            value={input}
            onChangeText={setInput}
            onSubmitEditing={handleSubmit}
            returnKeyType="search"
            autoCapitalize="words"
            autoCorrect={false}
          />
          <Pressable
            style={[
              commonStyles.primaryButton,
              styles.searchButton,
              !input.trim() && styles.buttonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={!input.trim()}
          >
            <Text style={commonStyles.primaryButtonText}>Go</Text>
          </Pressable>
        </View>

        {!submittedCity ? (
          <Text style={commonStyles.subtitle}>
            Search for a city to view current weather and forecast.
          </Text>
        ) : null}

        {submittedCity && isLoading ? <Loading message="Loading weather…" /> : null}

        {submittedCity && errorMessage && !isLoading ? (
          <Error
            message={errorMessage}
            hint={
              isNotFound
                ? "Try a different spelling or include the country code."
                : `Make sure the server is running (cd server && npm start). API: ${API_BASE_URL}`
            }
          />
        ) : null}

        {showSaveButton ? (
          <>
            <CurrentWeatherCard weather={current!} />
            {forecastItems && forecastItems.length > 0 ? (
              <View style={[commonStyles.card, styles.forecastCard]}>
                <ForecastList items={forecastItems} />
              </View>
            ) : null}
          </>
        ) : null}
      </ScrollView>

      {showSaveButton ? (
        <View
          style={[
            styles.stickyFooter,
            { paddingBottom: Math.max(insets.bottom, 16) },
          ]}
        >
          <Pressable
            style={[
              commonStyles.primaryButton,
              saved && styles.buttonDisabled,
            ]}
            onPress={handleSave}
            disabled={saved}
          >
            <Text style={commonStyles.primaryButtonText}>
              {saved ? "City saved" : "Save city"}
            </Text>
          </Pressable>
        </View>
      ) : null}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  contentWithFooter: {
    paddingBottom: 100,
  },
  stickyFooter: {
    paddingHorizontal: 16,
    paddingTop: 12,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  searchRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: colors.text,
  },
  searchButton: {
    justifyContent: "center",
    minWidth: 56,
  },
  forecastCard: {
    marginBottom: 16,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
});
