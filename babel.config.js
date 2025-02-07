module.exports = {
  presets: ["babel-preset-expo"],
  plugins: [
    [
      "module-resolver",
      {
        root: ["./src"],
        extensions: [".ios.js", ".android.js", ".ts", ".tsx"],
        alias: {
          components: "./src/components",
          constants: "./src/constants",
          context: "./src/context",
          config: "./src/config",
          hooks: "./src/hooks",
          types: "./src/types",
          utils: "./src/utils",
          lib: "./src/lib",
        },
      },
    ],
    "react-native-reanimated/plugin",
  ],
};
