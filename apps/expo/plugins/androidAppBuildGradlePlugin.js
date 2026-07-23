const { withAppBuildGradle } = require("expo/config-plugins");

module.exports = (config) => {
  return withAppBuildGradle(config, (config) => {
    let contents = config.modResults.contents;

    if (!contents.includes("testBuildType")) {
      contents = contents.replace(
        /(defaultConfig\s*\{)/,
        `$1\n        testBuildType System.getProperty('testBuildType', 'debug')\n        testInstrumentationRunner 'androidx.test.runner.AndroidJUnitRunner'`,
      );
    }

    if (!contents.includes("CMAKE_MAKE_PROGRAM")) {
      contents = contents.replace(
        /(buildConfigField.*\n)\s*\}/,
        `$1\n        externalNativeBuild {\n            cmake {\n                arguments "-DCMAKE_MAKE_PROGRAM=G:\\\\ninja\\\\ninja.exe", "-DCMAKE_OBJECT_PATH_MAX=1024"\n            }\n        }\n    }`,
      );
    }

    if (!contents.includes("detoxProguardPath")) {
      contents = contents.replace(
        /(proguardFiles getDefaultProguardFile\("proguard-android.txt"\), "proguard-rules.pro"\n)/,
        `$1            def detoxProguardPath = new File(["node", "--print", "require.resolve('detox/package.json')"].execute(null, rootDir).text.trim()).getParentFile().absolutePath\n            proguardFile "$detoxProguardPath/android/detox/proguard-rules-app.pro"\n`,
      );
    }

    if (!contents.includes("com.wix:detox")) {
      contents = contents.replace(
        /(implementation\("com\.facebook\.react:react-android"\))/,
        `$1\n    androidTestImplementation('com.wix:detox:+')\n    implementation 'androidx.appcompat:appcompat:1.1.0'`,
      );
    }

    if (!contents.includes("coroutines.pro")) {
      contents = contents.replace(
        /^    packagingOptions \{/m,
        "    packaging {",
      );
      contents = contents.replace(
        /(jniLibs \{[^}]*\})\n    \}/,
        `$1\n        resources {\n            excludes += ['META-INF/**/coroutines.pro']\n            pickFirsts += ['META-INF/MANIFEST.MF']\n        }\n    }`,
      );
    }

    config.modResults.contents = contents;
    return config;
  });
};
