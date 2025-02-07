import { Link } from "expo-router";
import { useMemo, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Image, StyleSheet, ScrollView } from "react-native";

import { t } from "lib/i18n";

import { useTheme } from "context/ThemeContext";
import { useFirebase } from "context/FirebaseContext";
import { useNotificationContext } from "context/NotificationContext";

import Assets from "constants/assets";
import defaultStyles from "constants/defaultStyles";

import Text from "components/Text";
import Button from "components/Button";
import TextButton from "components/TextButton";

import { validateEmail } from "utils/formInputValidation";

import FormTextInput from "components/FormTextInput";
import SectionSeparator from "components/Authentication/SectionSeperator";

const PasswordReset = () => {
  const firebase = useFirebase();
  const { colors } = useTheme();
  const { displayNotification } = useNotificationContext();

  const [emailValue, setEmailValue] = useState<string>();

  const [pendingState, setPendingState] = useState(false);

  const [authError, setAuthError] = useState<string>();
  const [emailError, setEmailError] = useState<string>();

  const error = useMemo(() => authError || emailError, [emailError, authError]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.surface.secondary,
    },
    formContainer: {
      alignItems: "center",
      justifyContent: "center",
      borderColor: colors.border.primary,
      backgroundColor: colors.surface.primary,
      margin: defaultStyles.margin.initial * 2,
      padding: defaultStyles.padding.initial * 2,
      borderWidth: defaultStyles.borderWidth.initial,
      borderRadius: defaultStyles.borderRadius.initial,
    },
    providerSignInButtonContainer: {
      marginVertical: defaultStyles.margin.small,
    },
    logo: { width: 100, height: 50, resizeMode: "contain" },
  });

  function _handleChangeEmail(text: string) {
    setEmailError("");
    setEmailValue(text.trim());
  }

  async function _handleSubmit() {
    if (!emailValue?.length) {
      return setEmailError(t("auth.common.error.input.email.empty"));
    }

    if (!validateEmail(emailValue)) {
      return setEmailError(t("auth.common.error.input.email.badFormatMessage"));
    }

    setPendingState(true);

    return firebase
      .resetPassword(emailValue)
      .then(() =>
        displayNotification(
          "success",
          t("auth.resetPassword.toaster.success.resetPasswordSent")
        )
      )
      .catch((error) => {
        switch (error.code) {
          case "auth/invalid-email":
            setEmailError(t("auth.common.error.input.email.badFormatMessage"));
            break;
          case "auth/user-disabled":
            setEmailError(
              t("auth.common.error.input.email.accountDisabledMessage")
            );
            break;
          case "auth/user-not-found":
            setEmailError(t("auth.login.error.input.email.notFoundMessage"));
            break;
          case "auth/operation-not-allowed":
          default:
            console.error(error);
            setAuthError(t("common.error.internal"));
            break;
        }
      })
      .finally(() => setPendingState(false));
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.formContainer}>
        <Image source={Assets.logo} style={styles.logo} />
        <View style={{ marginVertical: defaultStyles.margin.initial }}>
          <Text>{t("auth.resetPassword.title")}</Text>
        </View>
        {error ? (
          <View style={{ marginVertical: defaultStyles.margin.initial }}>
            <Text style={{ color: colors.text.error }}>{error}</Text>
          </View>
        ) : null}
        <SectionSeparator />
        <View
          style={{ marginVertical: defaultStyles.margin.middle, width: "100%" }}
        >
          <FormTextInput
            mandatory
            type={"email"}
            title={t("auth.common.input.email")}
            onChangeText={_handleChangeEmail}
          />
        </View>
        <View
          style={{
            width: "100%",
            marginVertical: defaultStyles.margin.initial * 2,
          }}
        >
          <Button
            active
            pending={pendingState}
            title={t("auth.resetPassword.button.continue")}
            onPress={_handleSubmit}
          />
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <Text style={{ fontSize: defaultStyles.fontSize.small }}>
            {t("auth.resetPassword.rememberCredentials")}
          </Text>
          <Link replace asChild href={"/login"}>
            <TextButton
              title={t("auth.resetPassword.link.signin")}
              textStyle={{
                marginLeft: 5,
                fontSize: defaultStyles.fontSize.small,
              }}
            />
          </Link>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PasswordReset;
