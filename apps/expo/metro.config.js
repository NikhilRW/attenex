const { getDefaultConfig } = require("expo/metro-config");
const { getBundleModeMetroConfig } = require("react-native-worklets/bundleMode");

const config = getDefaultConfig(__dirname);

config.resolver.sourceExts = ["js", "jsx", "json", "ts", "tsx", "cjs", "mjs", "css"];

config.resolver.assetExts = [...config.resolver.assetExts, "glb", "gltf", "obj", "mtl"];

// Unistyles 3.4.0 exports extensionless native component paths. Use its
// legacy component entry points so Metro can resolve extensions and platforms.
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName.startsWith("react-native-unistyles/components/native/")) {
    return context.resolveRequest(
      { ...context, unstable_enablePackageExports: false },
      moduleName,
      platform,
    );
  }

  return context.resolveRequest(context, moduleName, platform);
};

// Performance optimizations
config.transformer = {
  ...config.transformer,
  minifierConfig: {
    keep_classnames: true, // Required for Reanimated
    keep_fnames: true, // Required for Reanimated
    mangle: {
      keep_classnames: true,
      keep_fnames: true,
    },
  },
};

// Enable inline requires for faster startup
config.transformer.getTransformOptions = async () => ({
  transform: {
    experimentalImportSupport: false,
    inlineRequires: true, // Critical for TTI optimization
  },
});

module.exports = getBundleModeMetroConfig(config);
