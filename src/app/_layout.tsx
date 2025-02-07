import "react-native-get-random-values";

import { useEffect } from "react";
import { StatusBar } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import { Slot, SplashScreen, useSegments, useRouter } from "expo-router";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";

import PendingView from "components/PendingView";

import ReactQuery from "lib/ReactQuery";

import { ThemeProvider, useTheme } from "context/ThemeContext";
import { NotificationProvider } from "context/NotificationContext";
import { FirebaseProvider, useFirebase } from "context/FirebaseContext";

SplashScreen.preventAutoHideAsync();

const InitialLayout = () => {
  const router = useRouter();
  const segments = useSegments();
  const { fontsLoaded } = useTheme();
  const { currentUser, initializing } = useFirebase();

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  useEffect(() => {
    if (!fontsLoaded || initializing) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (currentUser && !inAuthGroup) {
      router.replace("/(auth)/(drawer)/(chat)/new");
    } else if (!currentUser) {
      router.replace("/login");
    }
  }, [initializing, fontsLoaded, currentUser]);

  if (!currentUser && initializing) {
    return <PendingView />;
  }

  return <Slot />;
};

export default function RootLayout() {
  return (
    <GestureHandlerRootView>
      <ActionSheetProvider>
        <SafeAreaProvider>
          <FirebaseProvider>
            <ThemeProvider>
              <StatusBar />
              <NotificationProvider>
                <PersistQueryClientProvider
                  client={ReactQuery.queryClient}
                  persistOptions={{ persister: ReactQuery.clientPersister }}
                >
                  <InitialLayout />
                </PersistQueryClientProvider>
              </NotificationProvider>
            </ThemeProvider>
          </FirebaseProvider>
        </SafeAreaProvider>
      </ActionSheetProvider>
    </GestureHandlerRootView>
  );
}
