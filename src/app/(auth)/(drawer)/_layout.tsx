import {
  View,
  Alert,
  Platform,
  StyleSheet,
  NativeSyntheticEvent,
} from "react-native";
import { useMemo } from "react";
import {
  DrawerContentScrollView,
  DrawerContentComponentProps,
} from "@react-navigation/drawer";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Link, router } from "expo-router";
import { Drawer } from "expo-router/drawer";
import { useQuery } from "@tanstack/react-query";
import ContextMenu from "react-native-context-menu-view";

import type { ContextMenuOnPressNativeEvent } from "react-native-context-menu-view";

import { t } from "lib/i18n";

import { useTheme } from "context/ThemeContext";
import { useFirebase } from "context/FirebaseContext";
import { ChatContextProvider } from "context/ChatContext";

import icons from "constants/icons";
import defaultStyles from "constants/defaultStyles";

import Text from "components/Text";
import Icon from "components/Icon";
import TextButton from "components/TextButton";
import PendingView from "components/PendingView";
import AnimatedChatsHistoryList from "components/Chat/AnimatedChatHistoryList";

import getUserAvatarTextPlaceholder from "utils/getUserAvatarTextPlaceholder";

function CustomDrawerContent(props: DrawerContentComponentProps) {
  const { colors, selectedTheme, setThemeMode } = useTheme();
  const { currentUser, logout, getUserChats } = useFirebase();
  const { top: SAFE_TOP, bottom: SAFE_BOTTOM } = useSafeAreaInsets();

  const { data: chats } = useQuery({
    queryKey: ["getUserChats"],
    queryFn: () => getUserChats(),
  });

  const menuActions = useMemo(
    () => [
      {
        systemIcon: _getThemeModeIcon(),
        title: t("drawer.contextMenu.toggleTheme"),
        actions: [
          { title: t("drawer.contextMenu.light"), systemIcon: "sun.min" },
          { title: t("drawer.contextMenu.dark"), systemIcon: "moon" },
          { title: t("drawer.contextMenu.system"), systemIcon: "tv" },
        ],
      },
      { title: t("drawer.contextMenu.settings"), systemIcon: "gear" },
      {
        title: t("drawer.contextMenu.switchWorkspace"),
        systemIcon: "arrow.left.arrow.right",
      },
      {
        title: t("drawer.contextMenu.logout"),
        systemIcon: "rectangle.portrait.and.arrow.right",
      },
    ],
    [selectedTheme]
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingBottom: SAFE_BOTTOM * 1.5,
      backgroundColor: colors.surface.tertiary,
      paddingHorizontal: defaultStyles.margin.initial,
      paddingTop: Platform.select({
        ios: SAFE_TOP,
        android: defaultStyles.padding.initial,
      }),
    },
    contextContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      borderRadius: defaultStyles.borderRadius.middle,
    },
    contextUserAvatarContainer: {
      width: 35,
      height: 35,
      alignItems: "center",
      justifyContent: "center",
      marginRight: defaultStyles.margin.middle,
      backgroundColor: colors.surface.quaternary,
      borderRadius: defaultStyles.borderRadius.middle,
    },
    contextTextContent: {
      color: colors.text.initial,
      fontSize: defaultStyles.fontSize.small,
    },
    contextTextContentDisabled: {
      color: colors.text.disabled,
      fontSize: defaultStyles.fontSize["x-small"],
    },
    textButtonContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: defaultStyles.margin.small,
      paddingVertical: defaultStyles.padding.small,
    },
    textButtonText: {
      fontWeight: "regular",
      color: colors.buttonText.initial,
      marginLeft: defaultStyles.margin.middle,
    },
    contentScrollViewContainer: {
      flex: 1,
      paddingTop: 0,
      paddingStart: 0,
      paddingBottom: 0,
    },
    scrollViewBottomContainer: {
      backgroundColor: colors.surface.tertiary,
    },
  });

  function _handleChatSelection(chatId: string) {
    router.replace({ pathname: "/[chatId]", params: { chatId } });
  }

  function _getThemeModeIcon() {
    switch (selectedTheme) {
      case "dark":
        return "moon";
      case "light":
      default:
        return "sun.min";
    }
  }

  function _handleContextMenuItemPress(
    e: NativeSyntheticEvent<ContextMenuOnPressNativeEvent>
  ) {
    if (e.nativeEvent.indexPath?.length === 2) {
      const [, selectedItemIndex] = e.nativeEvent.indexPath;

      switch (selectedItemIndex) {
        case 0:
          setThemeMode("light");
          break;
        case 1:
          setThemeMode("dark");
          break;
        case 2:
          setThemeMode("system");
          break;
        default:
          break;
      }
    } else if (Number.isFinite(e.nativeEvent.index)) {
      switch (e.nativeEvent.index) {
        case 1:
          Alert.alert("TODO: Handle account settings");
          break;
        case 2:
          Alert.alert("TODO: Handle workspaces");
          break;
        case 3:
          return logout();
        default:
          break;
      }
    }
  }

  if (!currentUser) {
    return <PendingView />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ContextMenu
        dropdownMenuMode
        actions={menuActions}
        style={{ marginBottom: defaultStyles.margin.initial * 2 }}
        onPress={_handleContextMenuItemPress}
      >
        <View style={styles.contextContainer}>
          <View style={styles.contextUserAvatarContainer}>
            <Text style={styles.contextTextContent}>
              {getUserAvatarTextPlaceholder(currentUser.displayName || "")}
            </Text>
          </View>
          <View style={{ flex: 1, justifyContent: "space-between" }}>
            <Text style={styles.contextTextContent}>
              {currentUser?.displayName}
            </Text>
            <Text style={styles.contextTextContentDisabled}>
              {currentUser?.email}
            </Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Icon
              name="ChevronDown"
              size={icons.size.initial}
              color={colors.inputIcon.initial}
            />
          </View>
        </View>
      </ContextMenu>

      <View style={{ marginBottom: defaultStyles.margin.initial * 2 }}>
        <Link asChild href={"/new"}>
          <TextButton
            title={t("drawer.link.newChat")}
            iconName="MessageSquarePlus"
            containerStyle={styles.textButtonContainer}
            iconStyle={{
              size: icons.size.initial,
              color: colors.buttonText.initial,
            }}
            textStyle={styles.textButtonText}
          />
        </Link>
        <TextButton
          title={t("drawer.link.search")}
          iconName="Search"
          containerStyle={styles.textButtonContainer}
          iconStyle={{
            size: icons.size.initial,
            color: colors.buttonText.initial,
          }}
          textStyle={styles.textButtonText}
          onPress={() => Alert.alert("TODO: Handle chats search modal")}
        />
      </View>

      <DrawerContentScrollView
        {...props}
        contentContainerStyle={styles.contentScrollViewContainer}
        style={{ marginBottom: defaultStyles.margin.initial }}
      >
        {chats?.todayChats.length ? (
          <AnimatedChatsHistoryList
            title={t("drawer.animatedChatHistoryList.today")}
            values={chats.todayChats}
            containerStyle={{ marginBottom: defaultStyles.margin.middle }}
            onPress={_handleChatSelection}
          />
        ) : null}
        {chats?.yesterdayChats.length ? (
          <AnimatedChatsHistoryList
            title={t("drawer.animatedChatHistoryList.yesterday")}
            values={chats.yesterdayChats}
            containerStyle={{ marginBottom: defaultStyles.margin.middle }}
            onPress={_handleChatSelection}
          />
        ) : null}
        {chats?.sevenDaysChats.length ? (
          <AnimatedChatsHistoryList
            title={t("drawer.animatedChatHistoryList.previous7Days")}
            values={chats.sevenDaysChats}
            containerStyle={{ marginBottom: defaultStyles.margin.middle }}
            onPress={_handleChatSelection}
          />
        ) : null}
        {chats?.thirtyDaysChats.length ? (
          <AnimatedChatsHistoryList
            title={t("drawer.animatedChatHistoryList.previous30Days")}
            values={chats.thirtyDaysChats}
            containerStyle={{ marginBottom: defaultStyles.margin.middle }}
            onPress={_handleChatSelection}
          />
        ) : null}
        {chats?.olderDaysChats.length ? (
          <AnimatedChatsHistoryList
            title={t("drawer.animatedChatHistoryList.older")}
            values={chats.olderDaysChats}
            containerStyle={{ marginBottom: defaultStyles.margin.middle }}
            onPress={_handleChatSelection}
          />
        ) : null}
      </DrawerContentScrollView>

      <View style={styles.scrollViewBottomContainer}>
        <TextButton
          title={t("drawer.link.archivedChats")}
          iconName="Archive"
          containerStyle={styles.textButtonContainer}
          iconStyle={{
            size: icons.size.initial,
            color: colors.buttonText.initial,
          }}
          textStyle={styles.textButtonText}
          onPress={() => Alert.alert("TODO: Handle archived chats")}
        />
        <TextButton
          title={t("drawer.link.sharedChats")}
          iconName="Share2"
          containerStyle={styles.textButtonContainer}
          iconStyle={{
            size: icons.size.initial,
            color: colors.buttonText.initial,
          }}
          textStyle={styles.textButtonText}
          onPress={() => Alert.alert("TODO: Handle archived chats")}
        />
      </View>
    </SafeAreaView>
  );
}

export default function DrawerLayout() {
  return (
    <ChatContextProvider>
      <Drawer
        screenOptions={{ headerShown: false }}
        drawerContent={CustomDrawerContent}
      />
    </ChatContextProvider>
  );
}
