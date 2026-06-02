import { StyleSheet, Text, View } from "react-native";
import { colors, commonStyles } from "../theme/common";

export interface ErrorProps {
  message: string;
  hint?: string;
}

export function Error({ message, hint }: ErrorProps) {
  return (
    <View style={styles.container} accessibilityRole="alert">
      <Text style={styles.message}>{message}</Text>
      {hint ? <Text style={commonStyles.subtitle}>{hint}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.errorBackground,
    borderRadius: 10,
    padding: 16,
    borderWidth: 1,
    borderColor: "#fecaca",
  },
  message: {
    fontSize: 15,
    color: colors.error,
    fontWeight: "500",
    lineHeight: 22,
  },
});
