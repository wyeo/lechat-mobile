import FontAwesome from "@expo/vector-icons/FontAwesome6";
import { View, StyleSheet, TouchableOpacity } from "react-native";

import { useTheme } from "context/ThemeContext";

import icons from "constants/icons";
import defaultStyles from "constants/defaultStyles";

import Text from "components/Text";

export type ProviderSignInButtonType = "google" | "microsoft";

function ProviderSignInButton({
  provider,
  title,
  onPress,
}: {
  title: string;
  provider: ProviderSignInButtonType;
  onPress: (provider: ProviderSignInButtonType) => void;
}) {
  const { colors } = useTheme();

  const style = StyleSheet.create({
    container: {
      borderRadius: 5,
      paddingVertical: 16,
      paddingHorizontal: 12,
      flexDirection: "row",
      borderColor: colors.border.secondary,
      borderWidth: defaultStyles.borderWidth.initial,
    },
    text: {
      paddingLeft: 30,
      fontWeight: "bold",
      color: colors.buttonText.initial,
    },
  });

  function _handlePress() {
    onPress(provider);
  }

  switch (provider) {
    case "google":
      return (
        <TouchableOpacity style={style.container} onPress={_handlePress}>
          <FontAwesome
            name="google"
            size={icons.size.initial}
            color={colors.buttonIcon.initial}
          />
          <Text style={style.text}>{title}</Text>
        </TouchableOpacity>
      );
    case "microsoft":
      return (
        <TouchableOpacity style={style.container} onPress={_handlePress}>
          <FontAwesome
            name="microsoft"
            size={icons.size.initial}
            color={colors.buttonIcon.initial}
          />
          <Text style={style.text}>{title}</Text>
        </TouchableOpacity>
      );
    default:
      return <View />;
  }
}

export default ProviderSignInButton;
