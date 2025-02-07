import * as Font from "expo-font";
import { useEffect, useMemo, useState } from "react";
import { Text as DefaultText, TextProps, TextStyle } from "react-native";

import fonts from "constants/fonts";
import { useTheme } from "context/ThemeContext";
import defaultStyles from "constants/defaultStyles";

export type CustomTextStyleType = {
  fontWeight?: "bold" | "medium" | "regular";
} & TextStyle;

function Text({
  children,
  ...props
}: TextProps & {
  children: React.ReactNode;
  style?: CustomTextStyleType;
}) {
  const { colors } = useTheme();

  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    Object.keys(fonts).every(Font.isLoaded)
      ? setFontsLoaded(true)
      : _loadFontsAsync();
  }, []);

  const fontFamily = useMemo(() => {
    switch (props.style?.fontWeight) {
      case "bold":
        return "Inter_700Bold";
      case "regular":
        return "Inter_400Regular";
      case "medium":
      default:
        return "Inter_500Medium";
    }
  }, [fontsLoaded, props.style?.fontWeight]);

  async function _loadFontsAsync() {
    await Font.loadAsync(fonts);
    setFontsLoaded(true);
  }

  if (!fontsLoaded) return null;

  return (
    <DefaultText
      {...{
        ...props,
        style: {
          fontFamily,
          fontSize: props.style?.fontSize || defaultStyles.fontSize.initial,
          color: props.style?.color || colors.inputText.initial,
          ...(props.style as TextStyle),
        },
      }}
    >
      {children}
    </DefaultText>
  );
}

export default Text;
