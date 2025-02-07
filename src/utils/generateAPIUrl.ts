import Constants from "expo-constants";
import { Platform } from "react-native";

const generateAPIUrl = (relativePath: string) => {
  const path = relativePath.startsWith("/") ? relativePath : `/${relativePath}`;

  if (process.env.NODE_ENV === "development") {
    if (!Constants.experienceUrl) {
      return Platform.select({
        ios: `http://localhost:3000${path}`,
        android: `http://192.168.1.25:3000${path}`,
      });
    }
    return Constants.experienceUrl.replace("exp://", "http://").concat(path);
  }

  if (!process.env.EXPO_PUBLIC_API_BASE_URL) {
    throw new Error(
      "EXPO_PUBLIC_API_BASE_URL environment variable is not defined"
    );
  }

  return process.env.EXPO_PUBLIC_API_BASE_URL.concat(path);
};

export default generateAPIUrl;