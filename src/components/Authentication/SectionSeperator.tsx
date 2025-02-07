import { View } from "react-native";

import { useTheme } from "context/ThemeContext";

function SectionSeparator() {
  const { colors } = useTheme();

  return (
    <View
      style={{
        width: 40,
        borderWidth: 2,
        borderColor: colors.border.primary,
      }}
    />
  );
}

export default SectionSeparator;
