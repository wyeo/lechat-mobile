import {
  View,
  Platform,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useState } from "react";
import * as Haptics from "expo-haptics";
import { useActionSheet } from "@expo/react-native-action-sheet";

import { t } from "lib/i18n";

import useImage from "hooks/useImage";
import useDocument from "hooks/useDocument";

import { useTheme } from "context/ThemeContext";
import { useNotificationContext } from "context/NotificationContext";

import {
  TEXT_INPUT_MAX_IMAGES,
  TEXT_INPUT_MAX_DOCUMENTS,
} from "constants/layout";
import icons from "constants/icons";
import defaultStyles from "constants/defaultStyles";

import Icon from "components/Icon";
import ActionButton from "components/Chat/ActionButton";
import ImagesPreview from "components/Chat/ImagePreview";
import DocumentsPreview from "components/Chat/DocumentPreview";

import type UserUploadMediaType from "types/UserUploadMediaType";
import type { ActionButtonType } from "components/Chat/ActionButton";

function ChatTextInputForm({
  value,
  pending,
  disabled,
  autoFocus,
  handleSubmit,
  handleTextChange,
  handleStopRequest,
}: {
  value: string;
  pending: boolean;
  disabled: boolean;
  autoFocus: boolean;
  handleSubmit: (val: {
    selectedActions: ActionButtonType[];
    selectedImages: UserUploadMediaType[];
    selectedDocuments: UserUploadMediaType[];
  }) => Promise<void>;
  handleStopRequest?: () => void;
  handleTextChange: (val: string) => void;
}) {
  const { colors } = useTheme();
  const { getDocuments } = useDocument();
  const { launchCamera, launchMediaLibrary } = useImage();
  const { showActionSheetWithOptions } = useActionSheet();
  const { displayNotification } = useNotificationContext();

  const [selectedImages, setSelectedImages] = useState<UserUploadMediaType[]>(
    []
  );
  const [selectedDocuments, setSelectedDocuments] = useState<
    UserUploadMediaType[]
  >([]);
  const [selectedActions, setSelectedActions] = useState<ActionButtonType[]>(
    []
  );

  const styles = StyleSheet.create({
    container: {
      width: "100%",
      borderColor: colors.border.tertiary,
      padding: defaultStyles.padding.middle,
      backgroundColor: colors.surface.primary,
      borderWidth: defaultStyles.borderWidth.initial / 2,
      ...Platform.select({
        ios: {
          shadowColor: colors.inputText.initial,
          shadowOffset: { width: 0, height: 5 },
          shadowOpacity: 0.15,
          shadowRadius: 5,
        },
        android: {
          elevation: 1,
        },
      }),
    },
    textInput: {
      width: "90%",
      minHeight: 50,
      maxHeight: 200,
      color: colors.text.initial,
      paddingVertical: defaultStyles.padding.middle,
    },
    submitButton: {
      width: 35,
      height: 35,
      alignItems: "center",
      justifyContent: "center",
      opacity: pending || value.length ? 1 : 0.7,
      borderColor: colors.buttonIcon.active,
      backgroundColor: colors.buttonIcon.muted,
      borderWidth: defaultStyles.borderWidth.initial,
    },
  });

  function _updateActions(action: ActionButtonType) {
    Haptics.selectionAsync();

    setSelectedActions((prevActions) => {
      const actionExists = prevActions.includes(action);

      if (actionExists) {
        return prevActions.filter((a) => a !== action);
      }

      return [...prevActions, action];
    });
  }

  function onOpenActionSheet() {
    const options = [
      "Prendre une photo",
      "Choisir une photo",
      "Choisir un document (pdf)",
      "Annuler",
    ];

    const cancelButtonIndex = options.length - 1;

    showActionSheetWithOptions(
      { options, cancelButtonIndex },
      (buttonIndex?: number) => {
        switch (buttonIndex) {
          case 0:
            launchCamera().then(_handleNewImage);
            break;
          case 1:
            launchMediaLibrary().then(_handleNewImage);
            break;
          case 2:
            getDocuments().then(_handleNewDocument);
            break;
          default:
            break;
        }
      }
    );
  }

  function _handleTextValueChange(val: string) {
    handleTextChange(val);
  }

  function _handleNewImage(assets: UserUploadMediaType[]) {
    if (selectedImages.length >= TEXT_INPUT_MAX_IMAGES) {
      displayNotification(
        "error",
        t("chat.common.toaster.error.maxImageLimit")
      );
    } else {
      setSelectedImages([...selectedImages, ...(assets || [])]);
    }
  }

  function _deleteImage(uri: string) {
    setSelectedImages(selectedImages.filter((image) => image.uri !== uri));
  }

  function _handleNewDocument(assets: UserUploadMediaType[]) {
    if (selectedDocuments.length >= TEXT_INPUT_MAX_DOCUMENTS) {
      displayNotification(
        "error",
        t("chat.common.toaster.error.maxDocumentLimit")
      );
    } else {
      setSelectedDocuments([...selectedDocuments, ...(assets || [])]);
    }
  }

  function _deleteDocument(uri: string) {
    setSelectedDocuments(selectedDocuments.filter((doc) => doc.uri !== uri));
  }

  function _resetValues() {
    setSelectedImages([]);
    setSelectedDocuments([]);
  }

  async function onSubmit() {
    await handleSubmit({ selectedActions, selectedImages, selectedDocuments });
    _resetValues();
  }

  return (
    <View style={styles.container}>
      <View>
        {!pending && selectedImages.length ? (
          <ImagesPreview
            selectionMode
            data={selectedImages}
            onDelete={_deleteImage}
          />
        ) : null}
        {!pending && selectedDocuments.length ? (
          <DocumentsPreview
            selectionMode
            data={selectedDocuments}
            onDelete={_deleteDocument}
          />
        ) : null}
        <TextInput
          multiline
          autoFocus={autoFocus}
          style={styles.textInput}
          value={pending ? "" : value}
          placeholder={t("chat.common.input.placeholder")}
          placeholderTextColor={colors.inputTextPlaceholder.secondary}
          onChangeText={_handleTextValueChange}
        />
      </View>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <ActionButton
            type="canvas"
            selected={selectedActions.includes("canvas")}
            disabled={Boolean(
              selectedActions.length && !selectedActions.includes("canvas")
            )}
            onPress={_updateActions}
          />
          <ActionButton
            type="web-search"
            disabled={selectedActions.includes("canvas")}
            selected={selectedActions.includes("web-search")}
            onPress={_updateActions}
          />
          <ActionButton
            type="image-generation"
            disabled={selectedActions.includes("canvas")}
            selected={selectedActions.includes("image-generation")}
            onPress={_updateActions}
          />
        </View>
        <View style={{ position: "relative" }}>
          <View style={{ position: "absolute", top: -25, left: "30%" }}>
            <TouchableOpacity onPress={onOpenActionSheet}>
              <Icon
                name="Paperclip"
                size={icons.size.initial}
                color={colors.buttonIcon.initial}
              />
            </TouchableOpacity>
          </View>
          {pending ? (
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleStopRequest}
            >
              <Icon
                name={"Square"}
                size={icons.size.initial}
                color={colors.buttonIcon.active}
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              disabled={disabled}
              style={styles.submitButton}
              onPress={onSubmit}
            >
              <Icon
                name={"ArrowRight"}
                size={icons.size.initial}
                color={
                  !disabled && value.length
                    ? colors.buttonIcon.active
                    : colors.buttonIcon.inactive
                }
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

export default ChatTextInputForm;
