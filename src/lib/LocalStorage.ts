import Constants from "expo-constants";
import { Platform } from "react-native";
import { MMKV } from "react-native-mmkv";

const LocalStorage = new MMKV({
  id:
    Platform.select({
      android: Constants.expoConfig?.android?.package,
      ios: Constants.expoConfig?.ios?.bundleIdentifier,
    }) || "",
});

export default LocalStorage;
