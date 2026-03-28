module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      // Reanimated plugin must be last
      // [
      //   "react-native-boost/plugin",
      //   {
      //     silent: true,
      //   },
      // ],
      [
        "react-native-unistyles/plugin",
        {
          root: "src",
        },
      ],
      "react-native-reanimated/plugin", // Must be last for Reanimated
    ],
    env: {
      production: {
        plugins: [
          "transform-remove-console", // Remove console logs in production
          [
            "react-native-unistyles/plugin",
            {
              root: "src",
            },
          ],
          "react-native-reanimated/plugin", // Must be last for Reanimated
        ],
      },
    },
  };
};
