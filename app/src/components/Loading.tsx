import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { colors, commonStyles } from "../theme/common";

export interface LoadingProps {
  message?: string;
}

export function Loading({ message = "Loading…" }: LoadingProps) {
  return (
    <View style={styles.container} accessibilityRole="progressbar">
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={commonStyles.body}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 32,
    gap: 12,
  },
});
