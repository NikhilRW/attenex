module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    env: {
      production: {
        plugins: [
          "transform-remove-console",
          [
            "react-native-unistyles/plugin",
            {
              root: "src",
            },
          ],
        ],
      },
    },
    plugins: [
      [
        "react-native-unistyles/plugin",
        {
          root: "src",
        },
      ],
    ],
  };
};
