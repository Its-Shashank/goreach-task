import Constants from "expo-constants";
import { Platform } from "react-native";

const API_PORT = 5001;

/** Override with EXPO_PUBLIC_API_URL=http://192.168.x.x:5001 if needed */
const ENV_API_URL = process.env.EXPO_PUBLIC_API_URL;

function getDevMachineHost(): string {
  const debuggerHost =
    Constants.expoGoConfig?.debuggerHost ??
    Constants.expoConfig?.hostUri?.replace(/^https?:\/\//, "").split("/")[0];

  if (debuggerHost) {
    return debuggerHost.split(":")[0];
  }

  return "localhost";
}

function resolveApiBaseUrl(): string {
  if (ENV_API_URL) {
    return ENV_API_URL.replace(/\/$/, "");
  }

  // Android emulator: localhost on the device is not your Mac
  if (Platform.OS === "android" && !Constants.isDevice) {
    return `http://10.0.2.2:${API_PORT}`;
  }

  const host = getDevMachineHost();
  return `http://${host}:${API_PORT}`;
}

export const API_BASE_URL = resolveApiBaseUrl();
