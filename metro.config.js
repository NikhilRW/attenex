const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

config.resolver.sourceExts = ["js", "jsx", "json", "ts", "tsx", "cjs", "mjs","css"];

config.resolver.assetExts = [
  ...config.resolver.assetExts,
  "glb",
  "gltf",
  "obj",
  "mtl",
];

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

module.exports = config;
