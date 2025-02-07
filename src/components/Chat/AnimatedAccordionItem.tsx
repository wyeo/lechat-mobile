import {
  View,
  StyleProp,
  ViewStyle,
  StyleSheet,
  LayoutChangeEvent,
} from "react-native";
import React from "react";
import Animated, {
  withTiming,
  SharedValue,
  AnimatedStyle,
  useSharedValue,
  useDerivedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import { DEFAULT_ANIMATION_DURATION } from "constants/layout";

export type AnimedtedAccordionPropsType = {
  viewKey: string;
  duration?: number;
  children: React.ReactNode;
  isExpanded: SharedValue<boolean>;
  style?: AnimatedStyle<StyleProp<ViewStyle>>;
};

function AnimedtedAccordionItem({
  style,
  viewKey,
  children,
  isExpanded,
  duration = DEFAULT_ANIMATION_DURATION,
}: AnimedtedAccordionPropsType) {
  const height = useSharedValue(0);

  const derivedHeight = useDerivedValue(() =>
    withTiming(height.value * Number(isExpanded.value), { duration })
  );

  const bodyStyle = useAnimatedStyle(() => ({ height: derivedHeight.value }));

  const styles = StyleSheet.create({
    container: { width: "100%", overflow: "hidden" },
    wrapper: {
      width: "100%",
      display: "flex",
      position: "absolute",
    },
  });

  function _onLayout(e: LayoutChangeEvent) {
    height.value = e.nativeEvent.layout.height;
  }

  return (
    <Animated.View
      key={`accordionItem_${viewKey}`}
      style={[styles.container, bodyStyle, style]}
    >
      <View onLayout={_onLayout} style={styles.wrapper}>
        {children}
      </View>
    </Animated.View>
  );
}

export default AnimedtedAccordionItem;
