import * as Haptics from "expo-haptics";
import { Snackbar } from "react-native-paper";
import { View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { ReactNode, useContext, useState } from "react";

import Text from "components/Text";
import Icon from "components/Icon";

import ellipsis from "utils/ellipsis";

import { useTheme } from "context/ThemeContext";

import icons from "constants/icons";
import defaultStyles from "constants/defaultStyles";
import { TEXT_ELLIPSIS_LIMIT, TOASTER_DURATION } from "constants/layout";

export type NotificationType = "info" | "success" | "error";

type NotificationContextType = {
  // eslint-disable-next-line no-unused-vars
  displayNotification: (type: NotificationType, content: string) => void;
};

const NotificationContext = React.createContext<NotificationContextType>(null!);

export function useNotificationContext() {
  return useContext(NotificationContext);
}

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<string | null>(null);
  const [type, setType] = useState<NotificationType | null>(null);
  const [notificationState, setNotificationState] = useState(false);

  const { colors } = useTheme();

  const styles = StyleSheet.create({
    container: {
      width: "100%",
      position: "absolute",
    },
    snackBarContainer: {
      borderColor: colors.border.primary,
      backgroundColor: colors.surface.primary,
      borderWidth: defaultStyles.borderWidth.initial,
    },
    content: {
      flexDirection: "row",
      alignItems: "center",
    },
  });

  function displayNotification(type: NotificationType, content: string) {
    setType(type);
    setContent(content);
    setNotificationState(true);

    switch (type) {
      case "error":
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        break;
      case "info":
      case "success":
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        break;
      default:
        break;
    }
  }

  function closeModal() {
    setContent(null);
    setNotificationState(false);
  }

  function _getNotificationTypeIcon() {
    switch (type) {
      case "info":
        return (
          <Icon
            name="Info"
            size={icons.size.big}
            color={colors.toasterIcon.info}
          />
        );
      case "error":
        return (
          <Icon
            name="CircleX"
            size={icons.size.big}
            color={colors.toasterIcon.error}
          />
        );
      case "success":
        return (
          <Icon
            name="CircleCheck"
            size={icons.size.big}
            color={colors.toasterIcon.success}
          />
        );
      default:
        return null;
    }
  }

  return (
    <NotificationContext.Provider value={{ displayNotification }}>
      {children}
      <SafeAreaView style={[styles.container, { bottom: 0 }]}>
        <Snackbar
          duration={TOASTER_DURATION}
          visible={notificationState}
          style={styles.snackBarContainer}
          onDismiss={closeModal}
        >
          <View style={styles.content}>
            <View style={{ marginRight: defaultStyles.margin.middle }}>
              {_getNotificationTypeIcon()}
            </View>
            <View style={{ flexDirection: "row", flexShrink: 1 }}>
              <Text style={{ fontSize: defaultStyles.fontSize.small }}>
                {ellipsis(content || "", TEXT_ELLIPSIS_LIMIT)}
              </Text>
            </View>
          </View>
        </Snackbar>
      </SafeAreaView>
    </NotificationContext.Provider>
  );
}

export default NotificationProvider;
