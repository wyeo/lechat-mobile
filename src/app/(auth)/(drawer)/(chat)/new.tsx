import {
  View,
  Platform,
  Keyboard,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
} from "react-native";
import Animated, {
  runOnJS,
  withTiming,
  withSpring,
  useSharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import { Image } from "expo-image";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useState } from "react";
import { router, useFocusEffect, useNavigation } from "expo-router";

import { t } from "lib/i18n";

import { useTheme } from "context/ThemeContext";
import { useChatContext } from "context/ChatContext";
import { useFirebase } from "context/FirebaseContext";
import { useNotificationContext } from "context/NotificationContext";

import icons from "constants/icons";
import Assets from "constants/assets";
import defaultStyles from "constants/defaultStyles";
import { CHAT_MESSAGE_TITLE_LIMIT } from "constants/layout";

import Icon from "components/Icon";
import Text from "components/Text";
import ChatTextInputForm from "components/Chat/ChatTextInputForm";

import type UserUploadMediaType from "types/UserUploadMediaType";
import type { DrawerNavigationProp } from "@react-navigation/drawer";
import type { ActionButtonType } from "components/Chat/ActionButton";

const INITIAL_WIDTH = 95;
const INITIAL_TRANSLATE_Y = 0;
const ANIMATION_DURATION = 500;
const INITIAL_KEYBOARD_OFFSET = 0;

const NewChat = () => {
  const firebase = useFirebase();
  const queryClient = useQueryClient();
  const { colors, selectedTheme } = useTheme();
  const { updatePendingMessage } = useChatContext();
  const { bottom: SAFE_BOTTOM } = useSafeAreaInsets();
  const { displayNotification } = useNotificationContext();
  const navigation = useNavigation<DrawerNavigationProp<{}>>();

  const [chatValue, setChatValue] = useState<string>("");
  const [pendingRequest, setPendingRequest] = useState(false);

  const [inputPosition, setInputPosition] = useState(0);
  const [inputContainerHeight, setInputContainerHeight] = useState(0);

  const widthPercentage = useSharedValue(INITIAL_WIDTH);
  const translateY = useSharedValue(INITIAL_TRANSLATE_Y);
  const padding = useSharedValue(INITIAL_KEYBOARD_OFFSET);

  const layoutAnimationStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: padding.value }],
  }));

  const chatIputAnimationStyle = useAnimatedStyle(
    () => ({
      transform: [{ translateY: translateY.value }],
      width: `${widthPercentage.value}%`,
    }),
    []
  );

  useEffect(() => {
    const keyboardWillShow = Keyboard.addListener(
      "keyboardWillShow",
      (event) => {
        padding.value = withSpring(-event.endCoordinates.height / 2, {
          damping: 20,
          stiffness: 90,
        });
      }
    );

    const keyboardWillHide = Keyboard.addListener("keyboardWillHide", () => {
      padding.value = withSpring(0, { damping: 20, stiffness: 90 });
    });

    return () => {
      keyboardWillShow.remove();
      keyboardWillHide.remove();
    };
  }, []);

  useFocusEffect(
    useCallback(() => {
      setChatValue("");

      widthPercentage.value = INITIAL_WIDTH;
      translateY.value = INITIAL_TRANSLATE_Y;
      padding.value = INITIAL_KEYBOARD_OFFSET;
    }, [])
  );

  const chatLogoAsset = useMemo(
    () =>
      selectedTheme === "light"
        ? Assets.lechatLogoLight
        : Assets.lechatLogoDark,
    [selectedTheme]
  );

  function handleChatTextValueChange(val: string) {
    setChatValue(val);
  }

  function redirectToChatEdit(chatId: string) {
    router.replace({ pathname: "/[chatId]", params: { chatId } });
  }

  async function handleSubmit(val: {
    selectedActions: ActionButtonType[];
    selectedImages: UserUploadMediaType[];
    selectedDocuments: UserUploadMediaType[];
  }) {
    setPendingRequest(true);

    if (val.selectedActions.length) {
      displayNotification("info", t("chat.common.comingSoonMessage.actions"));
    }

    Keyboard.dismiss();

    const chatId = await firebase.createChat(
      chatValue.trim().slice(0, CHAT_MESSAGE_TITLE_LIMIT)
    );

    queryClient.invalidateQueries({ queryKey: ["getUserChats"] });

    updatePendingMessage({
      chatId,
      message: chatValue,
      selectedImages: val.selectedImages,
      selectedActions: val.selectedActions,
      selectedDocuments: val.selectedDocuments,
    });

    translateY.value = withTiming(
      inputContainerHeight -
        inputPosition -
        (SAFE_BOTTOM * 3 || defaultStyles.padding.initial * 5),
      { duration: ANIMATION_DURATION },
      (finished) => {
        if (finished) {
          runOnJS(redirectToChatEdit)(chatId);
        }
      }
    );

    widthPercentage.value = withTiming(100, { duration: ANIMATION_DURATION });

    setChatValue("");
    setPendingRequest(false);
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: defaultStyles.padding.middle,
      backgroundColor: colors.surface.tertiary,
    },
    layout: {
      flex: 1,
      backgroundColor: colors.surface.primary,
      borderRadius: defaultStyles.borderRadius.initial,
    },
    inputContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    logo: {
      width: 600,
      height: 60,
      marginBottom: defaultStyles.margin.initial * 5,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        keyboardVerticalOffset={0}
        behavior={Platform.select({ ios: undefined, android: "height" })}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <Animated.View style={[styles.layout, layoutAnimationStyle]}>
            <TouchableOpacity
              style={{ margin: defaultStyles.margin.middle }}
              onPress={navigation.openDrawer}
            >
              <Icon
                name="PanelLeft"
                size={icons.size.big}
                color={colors.buttonIcon.initial}
              />
            </TouchableOpacity>
            <View
              style={styles.inputContainer}
              onLayout={(event) =>
                setInputContainerHeight(event.nativeEvent.layout.height)
              }
            >
              <Image
                contentFit="contain"
                style={styles.logo}
                source={chatLogoAsset}
              />
              <View style={{ marginTop: 20, height: 20 }}>
                {chatValue.includes("@") ? (
                  <Text style={{ color: colors.text.active }}>
                    {t("chat.common.comingSoonMessage.agents")}
                  </Text>
                ) : null}
              </View>
              <Animated.View
                style={chatIputAnimationStyle}
                onLayout={(event) =>
                  setInputPosition(event.nativeEvent.layout.y)
                }
              >
                <ChatTextInputForm
                  autoFocus={false}
                  value={chatValue}
                  pending={pendingRequest}
                  disabled={pendingRequest || !chatValue.length}
                  handleSubmit={handleSubmit}
                  handleTextChange={handleChatTextValueChange}
                />
              </Animated.View>
            </View>
          </Animated.View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default NewChat;
