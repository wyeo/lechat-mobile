import { useMemo } from "react";
import { v4 as uuid } from "uuid";
import { View, StyleSheet, TouchableOpacity } from "react-native";

import { useTheme } from "context/ThemeContext";

import Text from "components/Text";
import Icon from "components/Icon";

import icons from "constants/icons";
import defaultStyles from "constants/defaultStyles";

import type UserUploadMediaType from "types/UserUploadMediaType";

function DocumentsPreview({
  data,
  selectionMode = true,
  onDelete,
}: {
  selectionMode?: boolean;
  data: UserUploadMediaType[];
  onDelete?: (uri: string) => void;
}) {
  const { colors } = useTheme();

  const documents = useMemo(
    () => data.map((d) => ({ ...d, id: uuid() })),
    [data]
  );

  const styles = StyleSheet.create({
    container: {
      gap: 12,
      marginTop: 15,
      maxWidth: "100%",
      flexWrap: "wrap",
      flexDirection: "row",
    },
    itemContainer: {
      position: "relative",
      flexDirection: "row",
      alignItems: "center",
      padding: defaultStyles.padding.small,
      borderColor: colors.border.tertiary,
      backgroundColor: colors.surface.tertiary,
      borderWidth: defaultStyles.borderWidth.initial,
      borderRadius: defaultStyles.borderRadius.middle,
    },
    iconContainer: {
      position: "absolute",
      height: 20,
      width: 20,
      zIndex: 10,
      borderRadius: defaultStyles.borderRadius.max,
      right: -10,
      top: -10,
      borderColor: colors.border.tertiary,
      backgroundColor: colors.surface.primary,
      borderWidth: defaultStyles.borderWidth.initial,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    },
    pdfText: {
      marginRight: 10,
      fontWeight: "bold",
      color: colors.icon.pdf.text,
      padding: defaultStyles.padding.small,
      fontSize: defaultStyles.fontSize.small,
      backgroundColor: colors.icon.pdf.background,
      borderRadius: defaultStyles.borderRadius.middle,
    },
    docTitle: {
      maxWidth: 250,
      color: colors.text.initial,
      fontSize: defaultStyles.fontSize.small,
      borderRadius: defaultStyles.borderRadius.middle,
    },
  });

  return (
    <View style={styles.container}>
      {documents.map(({ id, name, uri }) => (
        <View key={id} style={styles.itemContainer}>
          {selectionMode && onDelete ? (
            <TouchableOpacity
              style={styles.iconContainer}
              onPress={() => onDelete(uri)}
            >
              <Icon
                name="X"
                size={icons.size.initial}
                color={colors.buttonIcon.disabled}
              />
            </TouchableOpacity>
          ) : null}
          <Text style={styles.pdfText}>PDF</Text>
          <Text style={styles.docTitle}>{name}</Text>
        </View>
      ))}
    </View>
  );
}

export default DocumentsPreview;
