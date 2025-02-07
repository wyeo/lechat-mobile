import { useColorScheme } from "react-native";
import { useFonts } from "@expo-google-fonts/inter";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

import LocalStorage from "lib/LocalStorage";

import STORAGE_KEYS from "config/MMKV/storageKeys";

import { useFirebase } from "context/FirebaseContext";

import fonts from "constants/fonts";
import { baseColors, darkColors } from "constants/colors";

import type ThemeModeType from "types/ThemeModeType";
import type { ThemeColors } from "constants/colors";

export const ThemeContext = createContext<{
  colors: ThemeColors;
  fontsLoaded: boolean;
  isThemeReady: boolean;
  themeMode: ThemeModeType;
  selectedTheme: "light" | "dark";
  setThemeMode: (mode: ThemeModeType) => void;
}>({
  fontsLoaded: false,
  isThemeReady: false,
  themeMode: "system",
  selectedTheme: "light",
  colors: {} as ThemeColors,
  setThemeMode: () => {},
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const firebase = useFirebase();
  const systemTheme = useColorScheme();
  const [isThemeReady, setIsThemeReady] = useState(false);
  const [themeMode, setThemeMode] = useState<ThemeModeType>(
    () =>
      (LocalStorage.getString(
        STORAGE_KEYS.USER.PREFERENCES.THEME
      ) as ThemeModeType) || "system"
  );

  useEffect(() => {
    const loadTheme = async () => {
      const savedTheme = LocalStorage.getString(
        STORAGE_KEYS.USER.PREFERENCES.THEME
      );

      if (savedTheme) {
        setThemeMode(savedTheme as ThemeModeType);
      }

      setIsThemeReady(true);
    };

    loadTheme();
  }, []);

  const selectedTheme = useMemo(
    () =>
      !firebase.currentUser
        ? "light"
        : themeMode === "system"
        ? systemTheme === "light"
          ? "light"
          : "dark"
        : themeMode,
    [themeMode, systemTheme, firebase.currentUser]
  );

  const colors = useMemo(
    () =>
      ({
        ...baseColors,
        ...(selectedTheme === "dark" ? darkColors : baseColors),
      } as ThemeColors),
    [selectedTheme]
  );

  let [fontsLoaded] = useFonts(fonts);

  const handleThemeChange = (mode: ThemeModeType) => {
    if (!["light", "dark", "system"].includes(mode)) {
      console.error("Invalid theme mode:", mode);
      return;
    }

    setThemeMode(mode);
    LocalStorage.set(STORAGE_KEYS.USER.PREFERENCES.THEME, mode);
  };

  return (
    <ThemeContext.Provider
      value={{
        colors,
        themeMode,
        fontsLoaded,
        isThemeReady,
        selectedTheme,
        setThemeMode: handleThemeChange,
      }}
    >
      {isThemeReady ? children : null}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
