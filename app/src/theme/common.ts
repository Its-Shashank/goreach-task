import { StyleSheet } from "react-native";

export const colors = {
  background: "#f8f9fa",
  surface: "#ffffff",
  text: "#1a1a1a",
  textSecondary: "#5c5c5c",
  border: "#e0e0e0",
  primary: "#2563eb",
  error: "#b91c1c",
  errorBackground: "#fef2f2",
};

export const commonStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 10,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.text,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  body: {
    fontSize: 15,
    color: colors.text,
    lineHeight: 22,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
