import { Link } from "expo-router";
import { useMemo, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Image, StyleSheet, ScrollView } from "react-native";

import { t } from "lib/i18n";

import { useTheme } from "context/ThemeContext";
import { useFirebase } from "context/FirebaseContext";

import Assets from "constants/assets";
import defaultStyles from "constants/defaultStyles";

import Text from "components/Text";
import Button from "components/Button";
import TextButton from "components/TextButton";

import { validateEmail } from "utils/formInputValidation";

import FormTextInput from "components/FormTextInput";
import SectionSeparator from "components/Authentication/SectionSeperator";
import ProviderSignInButton from "components/Authentication/ProviderSignInButton";

const SignUp = () => {
  const { colors } = useTheme();
  const firebase = useFirebase();

  const [emailValue, setEmailValue] = useState<string>();
  const [passwordValue, setPasswordValue] = useState<string>();
  const [firstnameValue, setFirstnameValue] = useState<string>();
  const [lastnameValue, setLastnameValue] = useState<string>();

  const [pendingState, setPendingState] = useState(false);

  const [authError, setAuthError] = useState<string>();
  const [emailError, setEmailError] = useState<string>();
  const [passwordError, setPasswordError] = useState<string>();

  const error = useMemo(
    () => authError || emailError || passwordError,
    [emailError, passwordError, authError]
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.surface.secondary,
    },
    scrollView: { flexGrow: 1 },
    formContainer: {
      flex: 1,
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

  function _handleChangePassword(text: string) {
    setPasswordError("");
    setPasswordValue(text);
  }

  function _handleChangeFirstname(text: string) {
    setFirstnameValue(text);
  }

  function _handleChangeLastName(text: string) {
    setLastnameValue(text);
  }

  async function _handleGoogleSignUpPress() {
    setPendingState(true);

    return firebase
      .loginWithGoogle()
      .then(() => {
        // TODO:ANALYTICS
      })
      .catch((error) => {
        switch (error.code) {
          case "auth/account-exists-with-different-credential":
            setAuthError(
              t(
                "auth.common.error.authentication.account-exists-with-different-credential"
              )
            );
            break;
          default:
            console.error(error);
            setAuthError(t("common.error.internal"));
            break;
        }
      })
      .finally(() => setPendingState(false));
  }

  function _handleMicrosoftSignUpPress() {
    setPendingState(true);

    return firebase
      .loginWithMicrosoft()
      .then(() => {
        // TODO:ANALYTICS
      })
      .catch((error) => {
        switch (error.code) {
          case "auth/account-exists-with-different-credential":
            setAuthError(
              t(
                "auth.common.error.authentication.account-exists-with-different-credential"
              )
            );
            break;
          default:
            console.error(error);
            setAuthError(t("common.error.internal"));
            break;
        }
      })
      .finally(() => setPendingState(false));
  }

  async function _handleSubmit() {
    if (!passwordValue?.length) {
      return setPasswordError(t("auth.common.error.input.password.empty"));
    }

    if (!emailValue?.length) {
      return setEmailError(t("auth.common.error.input.email.empty"));
    }

    if (!validateEmail(emailValue)) {
      return setEmailError(t("auth.common.error.input.email.badFormatMessage"));
    }

    setPendingState(true);

    return firebase
      .createUser({
        email: emailValue,
        password: passwordValue,
        lastname: lastnameValue || "",
        firstname: firstnameValue || "",
      })
      .then(() => {
        // TODO:ANALYTICS
      })
      .catch((err) => {
        switch (err.code) {
          case "auth/email-already-in-use":
            setEmailError(
              t("auth.signUp.error.input.email.alreadyExistMessage")
            );
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
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.formContainer}>
          <Image source={Assets.logo} style={styles.logo} />
          <View style={{ marginVertical: 20 }}>
            <Text>{t("auth.signUp.title")}</Text>
          </View>
          {error ? (
            <View style={{ marginVertical: 20 }}>
              <Text style={{ color: colors.text.error }}>{error}</Text>
            </View>
          ) : null}
          <SectionSeparator />
          <View style={{ marginVertical: 20, width: "100%" }}>
            <View style={styles.providerSignInButtonContainer}>
              <ProviderSignInButton
                provider="google"
                title={t("auth.signUp.button.signUpGoogle")}
                onPress={_handleGoogleSignUpPress}
              />
            </View>
            <View style={styles.providerSignInButtonContainer}>
              <ProviderSignInButton
                provider="microsoft"
                title={t("auth.signUp.button.signUpMicrosoft")}
                onPress={_handleMicrosoftSignUpPress}
              />
            </View>
          </View>
          <SectionSeparator />
          <View style={{ marginVertical: 10, width: "100%" }}>
            <FormTextInput
              mandatory
              type={"email"}
              title={t("auth.common.input.email")}
              onChangeText={_handleChangeEmail}
            />
            <FormTextInput
              mandatory
              type={"password"}
              title={t("auth.common.input.password")}
              onChangeText={_handleChangePassword}
            />
            <FormTextInput
              type={"text"}
              title={t("auth.common.input.firstname")}
              onChangeText={_handleChangeFirstname}
            />
            <FormTextInput
              type={"text"}
              title={t("auth.common.input.lastname")}
              onChangeText={_handleChangeLastName}
            />
          </View>
          <View style={{ width: "100%", marginVertical: 30 }}>
            <Button
              active
              pending={pendingState}
              title={t("auth.signUp.button.signUp")}
              onPress={_handleSubmit}
            />
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={{ fontSize: defaultStyles.fontSize.small }}>
              {t("auth.signUp.existingAccount")}
            </Text>
            <Link replace href={"/login"} asChild>
              <TextButton
                title={t("auth.signUp.link.signin")}
                textStyle={{
                  marginLeft: 5,
                  fontSize: defaultStyles.fontSize.small,
                }}
              />
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUp;
