import { forwardRef } from "react";
import {
  ButtonProps,
  Pressable,
  View,
  ViewProps,
  ViewStyle,
} from "react-native";

import { useTheme } from "context/ThemeContext";

import icons from "constants/icons";
import defaultStyles from "constants/defaultStyles";

import type { IconProps } from "components/Icon";
import type { CustomTextStyleType } from "components/Text";

import Text from "components/Text";
import Icon from "components/Icon";

type TextButtonProps = ButtonProps & {
  title: string;
  containerStyle?: ViewStyle;
  iconName?: IconProps["name"];
  textStyle?: CustomTextStyleType;
  iconStyle?: Pick<IconProps, "color" | "size">;
};

const TextButton = forwardRef<View, TextButtonProps>(
  (
    {
      title,
      textStyle,
      iconName,
      iconStyle,
      containerStyle,
      onPress,
      ...props
    },
    ref
  ) => {
    const { colors } = useTheme();

    return (
      <Pressable
        ref={ref}
        onPress={onPress}
        style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
        {...props}
      >
        <View style={{ flexDirection: "row", ...containerStyle }}>
          {iconName ? (
            <Icon
              name={iconName}
              size={iconStyle?.size || icons.size.initial}
              color={iconStyle?.color || colors.buttonIcon.initial}
            />
          ) : null}
          <Text
            style={{
              fontSize: defaultStyles.fontSize.initial,
              color: colors.button.initial,
              fontWeight: "regular",
              ...textStyle,
            }}
          >
            {title}
          </Text>
        </View>
      </Pressable>
    );
  }
);

export default TextButton;
