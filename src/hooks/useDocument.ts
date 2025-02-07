import * as FileSystem from "expo-file-system";
import * as DocumentPicker from "expo-document-picker";

import { TEXT_INPUT_DOCUMENT_TYPES } from "constants/layout";

import type UserUploadMediaType from "types/UserUploadMediaType";

export default function useDocument() {
  async function getDocuments(multiple = true): Promise<UserUploadMediaType[]> {
    const documents = await DocumentPicker.getDocumentAsync({
      type: TEXT_INPUT_DOCUMENT_TYPES,
      multiple,
    });

    if (!documents.assets || documents.canceled) {
      return [];
    }

    return Promise.all(
      documents.assets
        .map(async ({ uri, mimeType, name }) => {
          const base64Encoding = await FileSystem.readAsStringAsync(uri, {
            encoding: FileSystem.EncodingType.Base64,
          });

          return {
            uri,
            name: name || null,
            base64: base64Encoding,
            mimeType: mimeType || null,
          };
        })
        .filter(Boolean)
    );
  }

  return { getDocuments };
}
