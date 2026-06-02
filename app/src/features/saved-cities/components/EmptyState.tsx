import { StyleSheet, Text, View } from "react-native";
import { colors, commonStyles } from "../../../theme/common";

export interface EmptyStateProps {
  title: string;
  message: string;
}

export function EmptyState({ title, message }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <Text style={commonStyles.title}>{title}</Text>
      <Text style={[commonStyles.subtitle, styles.message]}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  message: {
    textAlign: "center",
    marginTop: 8,
    color: colors.textSecondary,
  },
});
