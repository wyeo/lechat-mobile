import { useMemo } from "react";
import { v4 as uuid } from "uuid";
import { View, Image, StyleSheet, TouchableOpacity } from "react-native";

import { useTheme } from "context/ThemeContext";

import Icon from "components/Icon";

import icons from "constants/icons";
import defaultStyles from "constants/defaultStyles";

import type UserUploadMediaType from "types/UserUploadMediaType";

function ImagesPreview({
  data,
  selectionMode = true,
  onDelete,
}: {
  selectionMode?: boolean;
  data: UserUploadMediaType[];
  onDelete?: (uri: string) => void;
}) {
  const { colors } = useTheme();

  const images = useMemo(
    () => data.map((uri) => ({ ...uri, id: uuid() })),
    [data]
  );

  const styles = StyleSheet.create({
    container: {
      gap: 12,
      marginTop: 5,
      maxWidth: "100%",
      flexWrap: "wrap",
      flexDirection: "row",
    },
    imageContainer: {
      position: "relative",
      flexDirection: "row",
      alignItems: "center",
      padding: defaultStyles.padding.small,
      borderColor: colors.border.tertiary,
      backgroundColor: colors.surface.tertiary,
      borderWidth: defaultStyles.borderWidth.initial,
      borderRadius: defaultStyles.borderRadius.middle,
    },
    image: { width: 120, height: 80 },
    iconContainer: {
      height: 20,
      width: 20,
      zIndex: 10,
      top: -10,
      right: -10,
      position: "absolute",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      borderColor: colors.border.tertiary,
      backgroundColor: colors.surface.primary,
      borderRadius: defaultStyles.borderRadius.max,
      borderWidth: defaultStyles.borderWidth.initial,
    },
  });

  return (
    <View style={styles.container}>
      {images.map(({ id, uri }) => (
        <View key={id} style={styles.imageContainer}>
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
          <View style={styles.image}>
            <Image source={{ uri, ...styles.image }} />
          </View>
        </View>
      ))}
    </View>
  );
}

export default ImagesPreview;
