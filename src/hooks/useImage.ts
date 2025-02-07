import * as Linking from "expo-linking";
import * as FileSystem from "expo-file-system";
import { Alert, Platform } from "react-native";
import * as ImagePicker from "expo-image-picker";

import { t } from "lib/i18n";

import type UserUploadMediaType from "types/UserUploadMediaType";

export default function useImage() {
  async function _requestMediaLibraryPermission() {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        t("chat.common.authorization.image.title"),
        t("chat.common.authorization.image.message"),
        [
          {
            text: "Annuler",
            style: "destructive",
          },
          {
            text: "Oui",
            style: "default",
            onPress: () =>
              Platform.OS === "ios"
                ? Linking.openURL("app-settings:")
                : Linking.openSettings(),
          },
        ]
      );
    }
  }

  async function _requestCameraPermission() {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        t("chat.common.authorization.camera.title"),
        t("chat.common.authorization.camera.message"),
        [
          {
            text: "Annuler",
            style: "destructive",
          },
          {
            text: "Oui",
            style: "default",
            onPress: () =>
              Platform.OS === "ios"
                ? Linking.openURL("app-settings:")
                : Linking.openSettings(),
          },
        ]
      );
    }
  }

  async function launchCamera(): Promise<UserUploadMediaType[]> {
    await _requestCameraPermission();

    const result = await ImagePicker.launchCameraAsync({ quality: 1 });

    if (result.canceled) return [];

    return Promise.all(
      result.assets.map(async ({ uri, base64, mimeType, fileName }) => {
        const base64Encoding = base64
          ? base64
          : await FileSystem.readAsStringAsync(uri, {
              encoding: FileSystem.EncodingType.Base64,
            });

        return {
          uri,
          base64: base64Encoding,
          name: fileName || null,
          mimeType: mimeType || null,
        };
      })
    );
  }

  async function launchMediaLibrary(): Promise<UserUploadMediaType[]> {
    await _requestMediaLibraryPermission();

    const result = await ImagePicker.launchImageLibraryAsync({ quality: 1 });

    if (result.canceled) return [];

    return Promise.all(
      result.assets.map(async ({ uri, base64, mimeType, fileName }) => {
        const base64Encoding = base64
          ? base64
          : await FileSystem.readAsStringAsync(uri, {
              encoding: FileSystem.EncodingType.Base64,
            });

        return {
          uri,
          base64: base64Encoding,
          name: fileName || null,
          mimeType: mimeType || null,
        };
      })
    );
  }

  return { launchCamera, launchMediaLibrary };
}
