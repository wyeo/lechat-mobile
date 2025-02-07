import Animated, {
  withTiming,
  useSharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import { StyleSheet, View, ViewStyle } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

import Chat from "types/ChatType";

import { useTheme } from "context/ThemeContext";

import Icon from "components/Icon";
import TextButton from "components/TextButton";
import AnimedtedAccordionItem from "components/Chat/AnimatedAccordionItem";

import icons from "constants/icons";
import defaultStyles from "constants/defaultStyles";
import { DEFAULT_ANIMATION_DURATION } from "constants/layout";

function AnimatedChatsHistoryList({
  title,
  values,
  containerStyle,
  onPress,
}: {
  title: string;
  values: Chat[];
  containerStyle?: ViewStyle;
  onPress: (id: string) => void;
}) {
  const { colors } = useTheme();
  const state = useSharedValue(true);

  function _toggleState() {
    state.value = !state.value;
  }

  const iconAnimatedStyle = useAnimatedStyle(
    () => ({
      transform: [
        {
          rotate: withTiming(state.value ? "180deg" : "0deg", {
            duration: DEFAULT_ANIMATION_DURATION,
          }),
        },
      ],
    }),
    [state]
  );

  const styles = StyleSheet.create({
    textButtonStyle: {
      fontWeight: "regular",
      marginBottom: defaultStyles.margin.small,
    },
  });

  return (
    <View style={containerStyle}>
      <TouchableOpacity
        onPress={_toggleState}
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginBottom: defaultStyles.margin.small,
        }}
      >
        <TextButton
          title={title}
          containerStyle={{ marginRight: defaultStyles.margin.small }}
          textStyle={{
            ...styles.textButtonStyle,
            flexDirection: "row",
            alignItems: "center",
            color: colors.text.disabled,
            fontSize: defaultStyles.fontSize.small,
            paddingTop: defaultStyles.padding.small,
          }}
        />
        <Animated.View style={iconAnimatedStyle}>
          <Icon
            name="ChevronDown"
            size={icons.size.initial}
            color={colors.buttonIcon.initial}
          />
        </Animated.View>
      </TouchableOpacity>
      <AnimedtedAccordionItem viewKey="title" isExpanded={state}>
        {values.map(({ id, title }) => (
          <TextButton
            key={id}
            title={title}
            onPress={() => onPress(id)}
            textStyle={{
              ...styles.textButtonStyle,
              color: colors.text.initial,
              marginBottom: defaultStyles.margin.small,
            }}
          />
        ))}
      </AnimedtedAccordionItem>
    </View>
  );
}

export default AnimatedChatsHistoryList;
