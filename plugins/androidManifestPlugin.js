const { withAndroidManifest } = require("@expo/config-plugins");

module.exports = function androiManifestPlugin(config) {
  return withAndroidManifest(config, async (config) => {
    let androidManifest = config.modResults.manifest;
    androidManifest.application[0]["meta-data"].push({
        "$": {
            "android:name": "com.google.firebase.messaging.default_notification_color",
            "tools:replace": "android:resource",
            "android:resource":"@color/notification_icon_color"
        }
    })     
    return config;
  });
};