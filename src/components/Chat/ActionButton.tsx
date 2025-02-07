import { View, StyleSheet, TouchableOpacity } from "react-native";

import Icon from "components/Icon";

import { useTheme } from "context/ThemeContext";

import icons from "constants/icons";
import defaultStyles from "constants/defaultStyles";

import type { IconProps } from "components/Icon";

export type ActionButtonType = "canvas" | "web-search" | "image-generation";

function ActionButton({
  type,
  selected,
  disabled,
  onPress,
}: {
  selected: boolean;
  disabled: boolean;
  type: ActionButtonType;
  onPress: (type: ActionButtonType) => void;
}) {
  const { colors } = useTheme();

  function _handlePress() {
    onPress(type);
  }

  const styles = StyleSheet.create({
    container: {
      marginRight: 10,
      padding: defaultStyles.padding.small,
      borderRadius: defaultStyles.borderRadius.middle,
      backgroundColor:
        selected && !disabled ? colors.buttonIcon.muted : undefined,
    },
    content: {
      color: disabled
        ? colors.buttonIcon.disabled
        : selected
        ? colors.buttonIcon.active
        : colors.buttonIcon.initial,
    },
  });

  const iconMap: Record<ActionButtonType, IconProps["name"]> = {
    canvas: "FileText",
    "web-search": "Globe",
    "image-generation": "Image",
  };

  if (!Object.keys(iconMap).includes(type)) {
    return <View />;
  }

  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={_handlePress}
      style={styles.container}
    >
      <Icon
        name={iconMap[type]}
        size={icons.size.initial}
        color={styles.content.color}
      />
    </TouchableOpacity>
  );
}

export default ActionButton;
