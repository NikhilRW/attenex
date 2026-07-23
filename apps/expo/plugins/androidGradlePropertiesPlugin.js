const { withGradleProperties } = require("expo/config-plugins");

module.exports = (config) => {
  return withGradleProperties(config, (config) => {
    const props = config.modResults;
    function setProp(key, value) {
      const existing = props.find((p) => p.key === key);
      if (existing) {
        existing.value = value;
      } else {
        props.push({ type: "property", key, value });
      }
    }

    setProp("org.gradle.jvmargs", "-Xmx4g -XX:MaxMetaspaceSize=512m");
    setProp("org.gradle.parallel", "false");
    setProp("org.gradle.caching", "false");
    setProp("org.gradle.configureondemand", "false");
    setProp("expo.inlineModules.watchedDirectories", "[]");

    return config;
  });
};
