const { withDangerousMod } = require("expo/config-plugins");
const fs = require("fs");
const path = require("path");

module.exports = (config) => {
  return withDangerousMod(config, [
    "android",
    (config) => {
      const proguardPath = path.join(
        config.modRequest.platformProjectRoot,
        "app/proguard-rules.pro",
      );
      let contents = fs.readFileSync(proguardPath, "utf8");

      if (!contents.includes("expo.modules.taskmanager")) {
        contents = contents.replace(
          /(# Add any project specific keep options here:\n)/,
          `$1\n# Keep React Native specific classes and methods\n-keep class com.facebook.fbreact.** { *; }\n-keep class com.facebook.react.** { *; }\n\n# Keep expo.modules.taskmanager to avoid R8 case-sensitivity issues on Windows\n-keep class expo.modules.taskmanager.** { *; }\n`,
        );
        fs.writeFileSync(proguardPath, contents);
      }

      return config;
    },
  ]);
};
