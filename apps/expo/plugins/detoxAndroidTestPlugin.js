const { withDangerousMod } = require("expo/config-plugins");
const fs = require("fs");
const path = require("path");

module.exports = (config) => {
  return withDangerousMod(config, [
    "android",
    (config) => {
      const androidDir = config.modRequest.platformProjectRoot;

      const testJavaDir = path.join(androidDir, "app/src/androidTest/java/com/attenex/attenex");
      fs.mkdirSync(testJavaDir, { recursive: true });
      fs.writeFileSync(
        path.join(testJavaDir, "DetoxTest.java"),
        [
          "package com.attenex.attenex;",
          "import com.wix.detox.Detox;",
          "import com.wix.detox.config.DetoxConfig;",
          "",
          "import org.junit.Rule;",
          "import org.junit.Test;",
          "import org.junit.runner.RunWith;",
          "",
          "import androidx.test.ext.junit.runners.AndroidJUnit4;",
          "import androidx.test.filters.LargeTest;",
          "import androidx.test.rule.ActivityTestRule;",
          "",
          "@RunWith(AndroidJUnit4.class)",
          "@LargeTest",
          "public class DetoxTest {",
          "    @Rule",
          '    public ActivityTestRule<MainActivity> mActivityRule = new ActivityTestRule<>(MainActivity.class, false, false);',
          "",
          "    @Test",
          "    public void runDetoxTests() {",
          "        DetoxConfig detoxConfig = new DetoxConfig();",
          "        detoxConfig.idlePolicyConfig.masterTimeoutSec = 90;",
          "        detoxConfig.idlePolicyConfig.idleResourceTimeoutSec = 60;",
          "        detoxConfig.rnContextLoadTimeoutSec = (BuildConfig.DEBUG ? 180 : 60);",
          "",
          "        Detox.runTests(mActivityRule, detoxConfig);",
          "    }",
          "}",
          "",
        ].join("\n"),
      );

      const testManifestDir = path.join(androidDir, "app/src/androidTest");
      fs.mkdirSync(testManifestDir, { recursive: true });
      fs.writeFileSync(
        path.join(testManifestDir, "AndroidManifest.xml"),
        [
          '<?xml version="1.0" encoding="utf-8"?>',
          '<manifest xmlns:android="http://schemas.android.com/apk/res/android">',
          '  <uses-sdk android:targetSdkVersion="35" />',
          "  <application>",
          '    <activity android:name="androidx.test.core.app.InstrumentationActivityInvoker$BootstrapActivity" android:exported="true" />',
          '    <activity android:name="androidx.test.core.app.InstrumentationActivityInvoker$EmptyActivity" android:exported="true" />',
          '    <activity android:name="androidx.test.core.app.InstrumentationActivityInvoker$EmptyFloatingActivity" android:exported="true" />',
          "  </application>",
          "</manifest>",
          "",
        ].join("\n"),
      );

      return config;
    },
  ]);
};
