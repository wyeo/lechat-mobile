import { Image } from "expo-image";
import { View, StyleSheet } from "react-native";

import Text from "components/Text";
import ImagesPreview from "components/Chat/ImagePreview";
import DocumentsPreview from "components/Chat/DocumentPreview";

import { useTheme } from "context/ThemeContext";

import ChatMessageType from "types/ChatMessageType";

import getUserAvatarTextPlaceholder from "utils/getUserAvatarTextPlaceholder";

import Assets from "constants/assets";
import defaultStyles from "constants/defaultStyles";

export type ChatMessagePropsType = Pick<
  ChatMessageType,
  "id" | "content" | "role" | "attachments"
> & { pending: boolean; displayName: string | null };

function ChatMessage({
  role,
  content,
  displayName,
  attachments,
}: ChatMessagePropsType) {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flexDirection: "row",
      marginBottom: defaultStyles.margin.initial * 2,
    },
    aiBotAvatarContainer: {
      width: 25,
      height: 25,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      marginRight: defaultStyles.margin.middle,
    },
    avatar: {
      width: 20,
      height: 20,
    },
    userAvatarContainer: {
      width: 25,
      height: 25,
      borderRadius: 100,
      alignItems: "center",
      justifyContent: "center",
      marginRight: defaultStyles.margin.middle,
      backgroundColor: colors.surface.quaternary,
    },
    userAvatarPlaceholder: {
      fontWeight: "bold",
      color: colors.text.disabled,
      fontSize: defaultStyles.fontSize["x-small"],
    },
    contentContainer: {
      flexDirection: "row",
      alignItems: "center",
      flexShrink: 1,
    },
    textContent: {
      color: colors.text.initial,
      fontSize: defaultStyles.fontSize.small,
    },
    imagePreview: {
      width: 120,
      height: 80,
      borderRadius: defaultStyles.borderRadius.middle,
    },
    attachmentsContainer: {
      backgroundColor: colors.surface.tertiary,
      paddingVertical: defaultStyles.padding.middle,
      paddingHorizontal: defaultStyles.padding.initial,
      borderRadius: defaultStyles.borderRadius.initial,
    },
    attachmentsImageContainer: {
      alignSelf: "flex-start",
      borderColor: colors.border.tertiary,
      borderRadius: defaultStyles.borderRadius.middle,
    },
  });

  return (
    <View style={styles.container}>
      {role === "assistant" ? (
        <View style={styles.aiBotAvatarContainer}>
          <Image
            contentFit="contain"
            style={styles.avatar}
            source={Assets.aiBotAvatar}
          />
        </View>
      ) : (
        <View style={styles.userAvatarContainer}>
          <Text style={styles.userAvatarPlaceholder}>
            {getUserAvatarTextPlaceholder(displayName || "")}
          </Text>
        </View>
      )}
      {attachments?.length ? (
        <View style={styles.attachmentsContainer}>
          <View style={styles.attachmentsImageContainer}>
            {attachments[0].contentType?.includes("pdf") ? (
              <DocumentsPreview
                data={[
                  {
                    mimeType: attachments[0].contentType,
                    name: attachments[0].name || "",
                    base64: null,
                    uri: "",
                  },
                ]}
              />
            ) : (
              <ImagesPreview
                data={[
                  {
                    mimeType: attachments[0].contentType || "",
                    name: attachments[0].name || "",
                    uri: attachments[0].url,
                    base64: null,
                  },
                ]}
              />
            )}
          </View>
          <Text
            style={{
              ...styles.textContent,
              marginTop: defaultStyles.margin.middle,
            }}
          >
            {content}
          </Text>
        </View>
      ) : (
        <View style={styles.contentContainer}>
          <Text style={styles.textContent}>{content}</Text>
        </View>
      )}
    </View>
  );
}

export default ChatMessage;
