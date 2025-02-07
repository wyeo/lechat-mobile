import {
  View,
  TextInput,
  StyleSheet,
  TextInputProps,
  TouchableOpacity,
} from "react-native";
import { useMemo, useState } from "react";

import { useTheme } from "context/ThemeContext";

import icons from "constants/icons";
import defaultStyles from "constants/defaultStyles";

import Text from "components/Text";
import Icon from "components/Icon";

type FormTextInputType = {
  title: string;
  mandatory?: boolean;
  type: "email" | "password" | "text";
} & TextInputProps;

function FormTextInput({
  type,
  title,
  mandatory,
  ...props
}: FormTextInputType) {
  const { colors } = useTheme();
  const [state, setState] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const style = useMemo(
    () =>
      StyleSheet.create({
        textInput: {
          paddingLeft: 24,
          paddingRight: 10,
          paddingVertical: 12,
          borderWidth: defaultStyles.borderWidth.initial,
          borderRadius: defaultStyles.borderRadius.middle,
          borderColor: state ? colors.input.focus : colors.input.initial,
        },
      }),
    [state]
  );

  function _toggleShowPasswordState() {
    setShowPassword((state) => !state);
  }

  const TextInputChild = useMemo(() => {
    switch (type) {
      case "email":
        return (
          <TextInput
            {...props}
            style={style.textInput}
            clearButtonMode={"always"}
            onFocus={toggleState}
            onBlur={toggleState}
          />
        );
      case "password":
        return (
          <View style={{ flexDirection: "row", ...style.textInput }}>
            <TextInput
              {...props}
              autoComplete="off"
              style={{ flex: 1, marginRight: 5 }}
              clearButtonMode={"never"}
              secureTextEntry={!showPassword}
              onFocus={toggleState}
              onBlur={toggleState}
            />
            <TouchableOpacity onPress={_toggleShowPasswordState}>
              <Icon
                name={showPassword ? "Eye" : "EyeOff"}
                size={icons.size.big}
                color={colors.inputIcon.initial}
              />
            </TouchableOpacity>
          </View>
        );
      default:
        return (
          <TextInput
            {...props}
            style={style.textInput}
            onFocus={toggleState}
            onBlur={toggleState}
          />
        );
    }
  }, [type, props, state, showPassword]);

  function toggleState() {
    setState((state) => !state);
  }

  return (
    <View style={{ marginVertical: 10, width: "100%" }}>
      <View style={{ flexDirection: "row" }}>
        <Text style={{ marginBottom: 10 }}>{title}</Text>
        {mandatory ? (
          <Text style={{ color: colors.text.active }}>&nbsp;*</Text>
        ) : null}
      </View>
      {TextInputChild}
    </View>
  );
}

export default FormTextInput;
