import "globalPolyfills";

import {
  View,
  Alert,
  Platform,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
} from "react-native";
import { v4 as uuid } from "uuid";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { useChat } from "@ai-sdk/react";
import { fetch as expoFetch } from "expo/fetch";
import { FlashList } from "@shopify/flash-list";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { router, useNavigation, useLocalSearchParams } from "expo-router";

import { t } from "lib/i18n";

import generateAPIUrl from "utils/generateAPIUrl";

import { useTheme } from "context/ThemeContext";
import { useChatContext } from "context/ChatContext";
import { useFirebase } from "context/FirebaseContext";
import { useNotificationContext } from "context/NotificationContext";

import icons from "constants/icons";
import { CHAT_API_ROUTE } from "constants/layout";
import defaultStyles from "constants/defaultStyles";

import Icon from "components/Icon";
import Text from "components/Text";
import ChatMessage from "components/Chat/ChatMessage";
import ChatTextInputForm from "components/Chat/ChatTextInputForm";

import type ChatMessageType from "types/ChatMessageType";
import type UserUploadMediaType from "types/UserUploadMediaType";
import type { DrawerNavigationProp } from "@react-navigation/drawer";
import type { ActionButtonType } from "components/Chat/ActionButton";
import type { ChatMessagePropsType } from "components/Chat/ChatMessage";

const STATIC_KEYBOARD_VERTICAL_OFFSET = 70;

const ChatEdit = () => {
  const { colors, selectedTheme } = useTheme();
  const { bottom: SAFE_BOTTOM } = useSafeAreaInsets();
  const [contentHeight, setContentHeight] = useState(0);
  const { displayNotification } = useNotificationContext();
  const navigation = useNavigation<DrawerNavigationProp<{}>>();
  const { chatId } = useLocalSearchParams<{ chatId: string }>();
  const { pendingMessage, resetPendingMessage } = useChatContext();
  const { currentUser, addChatMessage, getChatMessages } = useFirebase();

  const [chatValue, setChatValue] = useState<string>("");

  const flashListRef = useRef<FlashList<ChatMessagePropsType>>(null);

  const { data: storedMessages, isPending: getMessagesRequestIsPending } =
    useQuery({
      enabled: Boolean(chatId),
      queryKey: ["getMessages", chatId],
      queryFn: () => getChatMessages(chatId),
    });

  const addMessageMutation = useMutation({
    mutationFn: (message: ChatMessageType) => addChatMessage(chatId, message),
    onError: (error) => {
      console.error("Error addMessageMutation()", error);
      displayNotification("error", t("common.error.internal"));
    },
  });

  const chat = useChat({
    fetch: expoFetch as unknown as typeof globalThis.fetch,
    api: generateAPIUrl(CHAT_API_ROUTE),
    onError: (error) => {
      console.error("Error useChat()", error);
      displayNotification("error", t("common.error.internal"));
    },
    onFinish: (message, options) => {
      if (options.finishReason === "stop") {
        addMessageMutation.mutate({
          chatId,
          id: message.id,
          role: message.role,
          content: message.content,
          attachments: message.experimental_attachments,
        });
      }
    },
  });

  useEffect(() => {
    if (chat.isLoading) {
      const interval = setInterval(() => {
        const randomDelay = 50 + Math.random() * 100;

        Haptics.impactAsync(
          Math.random() > 0.8
            ? Haptics.ImpactFeedbackStyle.Medium
            : Haptics.ImpactFeedbackStyle.Light
        );

        clearInterval(interval);
        setTimeout(() => interval, randomDelay);
      }, 100);

      return () => clearInterval(interval);
    }
  }, [chat.isLoading]);

  useEffect(() => {
    if (storedMessages && storedMessages.length > 0) {
      chat.setMessages(
        storedMessages.map((message) => ({
          id: message.id || "",
          role: message.role,
          content: message.content,
          experimental_attachments: message.attachments,
        }))
      );
    }
  }, [storedMessages]);

  useEffect(() => {
    if (pendingMessage?.message) {
      const attachments = [
        ...pendingMessage.selectedImages,
        ...pendingMessage.selectedDocuments,
      ].map((media) => ({
        url: media.uri,
        name: media.name || "",
        contentType: media.mimeType || "",
      }));

      const message = {
        id: uuid(),
        role: "user",
        content: pendingMessage.message,
      } as ChatMessageType;

      addMessageMutation.mutate({ ...message, attachments });

      chat
        .append({ ...message, experimental_attachments: attachments })
        .then(() => resetPendingMessage());
    }
  }, [pendingMessage]);

  useEffect(() => {
    const syntheticEvent = {
      target: { value: chatValue },
    } as React.ChangeEvent<HTMLInputElement>;

    chat.handleInputChange(syntheticEvent);
  }, [chatValue]);

  const chatInputDisabledState = useMemo(
    () =>
      Boolean(
        !chatValue.length ||
          pendingMessage?.message ||
          addMessageMutation.isPending
      ),
    [chatValue, pendingMessage?.message, addMessageMutation.isPending]
  );

  const chatInputPendingState = useMemo(
    () => getMessagesRequestIsPending || addMessageMutation.isPending,
    [getMessagesRequestIsPending, addMessageMutation.isPending]
  );

  const chatMessages = useMemo(
    () =>
      chat.messages.map(({ id, role, content, experimental_attachments }) => ({
        id,
        role,
        content,
        attachments: experimental_attachments,
        displayName: currentUser?.displayName || null,
        pending: chat.isLoading || chatInputPendingState,
      })),
    [chat.messages, chat.isLoading, chatInputPendingState, currentUser]
  );

  const handleOnLayout = useCallback(() => {
    if (flashListRef.current && contentHeight > 0) {
      flashListRef.current.scrollToOffset({
        animated: true,
        offset: contentHeight,
      });
    }
  }, [contentHeight]);

  function handleOnContentSizeChange(_: number, height: number) {
    setContentHeight(height);
  }

  function handleChatTextValueChange(val: string) {
    setChatValue(val);
  }

  function handleStopRequest() {
    chat.stop();
  }

  async function handleSubmit(val: {
    selectedActions: ActionButtonType[];
    selectedImages: UserUploadMediaType[];
    selectedDocuments: UserUploadMediaType[];
  }) {
    if (!chatValue.length) return;

    const attachments = [...val.selectedDocuments, ...val.selectedImages].map(
      (media) => ({
        url: media.uri,
        name: media.name || "",
        contentType: media.mimeType || "",
      })
    );

    return addMessageMutation.mutate(
      {
        role: "user",
        attachments,
        content: chatValue,
      },
      {
        onSuccess: () => {
          setChatValue("");
          chat.handleSubmit(undefined, {
            experimental_attachments: attachments,
          });
        },
      }
    );
  }

  function handleNewChatRedirection() {
    router.push("/new");
  }

  function renderMessage({ item }: { item: ChatMessagePropsType }) {
    return <ChatMessage {...item} />;
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingBottom: SAFE_BOTTOM,
      padding: defaultStyles.padding.middle,
      backgroundColor: colors.surface.tertiary,
    },
    content: {
      flex: 1,
      backgroundColor: colors.surface.primary,
      borderRadius: defaultStyles.borderRadius.initial,
    },
    headerContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      margin: defaultStyles.margin.middle,
    },
    listContentContainer: {
      padding: defaultStyles.padding.middle,
      paddingTop: defaultStyles.padding.initial,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.headerContainer}>
          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity
              style={{ marginRight: defaultStyles.margin.initial }}
              onPress={navigation.openDrawer}
            >
              <Icon
                name="PanelLeft"
                size={icons.size.big}
                color={colors.buttonIcon.initial}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleNewChatRedirection}>
              <Icon
                name="Plus"
                size={icons.size.big}
                color={colors.buttonIcon.initial}
              />
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity
              style={{ marginRight: defaultStyles.margin.initial }}
              onPress={() => Alert.alert("TODO: Handle chat share")}
            >
              <Icon
                name="Pin"
                size={icons.size.big}
                color={colors.buttonIcon.initial}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => Alert.alert("TODO: Handle chat share")}
            >
              <Icon
                name="Share"
                size={icons.size.big}
                color={colors.buttonIcon.initial}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ flex: 1 }}>
          <FlashList
            ref={flashListRef}
            data={chatMessages}
            estimatedItemSize={156}
            extraData={chatMessages}
            onLayout={handleOnLayout}
            renderItem={renderMessage}
            onContentSizeChange={handleOnContentSizeChange}
            contentContainerStyle={styles.listContentContainer}
            indicatorStyle={selectedTheme === "light" ? "black" : "white"}
          />
        </View>
        {chatValue.includes("@") ? (
          <Text
            style={{
              paddingVertical: defaultStyles.margin.middle,
              color: colors.text.active,
              textAlign: "center",
            }}
          >
            {t("chat.common.comingSoonMessage.agents")}
          </Text>
        ) : null}
        <KeyboardAvoidingView
          behavior={Platform.select({ ios: "padding", android: "height" })}
          keyboardVerticalOffset={STATIC_KEYBOARD_VERTICAL_OFFSET}
        >
          <ChatTextInputForm
            value={chatValue}
            autoFocus={false}
            pending={chatInputPendingState}
            disabled={chatInputDisabledState}
            handleSubmit={handleSubmit}
            handleStopRequest={handleStopRequest}
            handleTextChange={handleChatTextValueChange}
          />
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
};

export default ChatEdit;
