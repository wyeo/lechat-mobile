import { View, Pressable, StyleSheet, ActivityIndicator } from "react-native";
import React from "react";

import { useTheme } from "context/ThemeContext";

import defaultStyles from "constants/defaultStyles";

import Text from "components/Text";

type ButtonType = {
  title: string;
  active: boolean;
  pending?: boolean;
  onPress: () => void;
};

const Button = ({ title, active, pending, onPress }: ButtonType) => {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    button: {
      height: 50,
      justifyContent: "center",
      backgroundColor: colors.button.initial,
      borderRadius: defaultStyles.borderRadius.middle,
    },
  });

  return (
    <View
      style={[
        styles.button,
        {
          backgroundColor: active ? colors.button.initial : colors.button.focus,
        },
      ]}
    >
      {pending ? (
        <View style={{ flex: 1, justifyContent: "center" }}>
          <ActivityIndicator color={colors.activityIndicator.initial} />
        </View>
      ) : (
        <Pressable
          disabled={!active}
          style={[
            styles.button,
            {
              width: "100%",
              alignItems: "center",
              opacity: active ? 1 : 0.5,
            },
          ]}
          onPress={onPress}
        >
          <Text style={{ color: colors.buttonText.active, fontWeight: "bold" }}>
            {title}
          </Text>
        </Pressable>
      )}
    </View>
  );
};

export default Button;
