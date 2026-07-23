const { withProjectBuildGradle } = require("expo/config-plugins");

module.exports = (config) => {
  return withProjectBuildGradle(config, (config) => {
    let contents = config.modResults.contents;

    if (!contents.includes("Detox-android")) {
      const detoxDir = `    def detoxDir = new File(["node", "--print", "require.resolve('detox/package.json')"].execute(null, rootDir).text.trim()).getParentFile().absolutePath`;
      const detoxMaven = `    maven { url "\$detoxDir/Detox-android/" }`;
      contents = contents.replace(
        /(maven\s*\{\s*url\s+'https:\/\/www\.jitpack\.io'\s*\})/,
        `$1\n${detoxDir}\n${detoxMaven}`,
      );
    }

    const subprojectsBlock = `
subprojects {
    afterEvaluate { p ->
      if (p.plugins.hasPlugin("com.android.library") || p.plugins.hasPlugin("com.android.application")) {
      p.android {
        packaging {
          resources {
            excludes += ['META-INF/**/coroutines.pro']
            pickFirsts += ['META-INF/MANIFEST.MF']
          }
        }
      }
    }
  }
}
subprojects {
    afterEvaluate { project ->
        if (project.hasProperty('android')) {
            project.android {
                defaultConfig {
                    externalNativeBuild {
                        cmake {
                            arguments "-DCMAKE_OBJECT_PATH_MAX=1024"
                        }
                    }
                }
            }
        }
    }
}
gradle.projectsEvaluated {
    tasks.withType(JavaCompile) {
        options.incremental = false
    }
}
`;

    if (!contents.includes("subprojects {")) {
      contents = contents.replace(
        /(\napply plugin: "expo-root-project")/,
        `${subprojectsBlock}$1`,
      );
    }

    config.modResults.contents = contents;
    return config;
  });
};
