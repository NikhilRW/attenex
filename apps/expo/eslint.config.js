// https://docs.expo.dev/guides/using-eslint/
const reactNativePlugin = require("@react-native/eslint-plugin");
const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");
const detoxPlugin = require("eslint-plugin-detox");
const pluginJest = require("eslint-plugin-jest");
const promisePlugin = require("eslint-plugin-promise");
const reactCompiler = require("eslint-plugin-react-compiler");
const reactNative = require("eslint-plugin-react-native");
const reactNativeA11y = require("eslint-plugin-react-native-a11y");
const globals = require("globals");

// Jest test file patterns matching Jest's default testMatch
const TEST_PATTERNS = ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[tj]s?(x)"];
const E2E_TEST_PATTERNS = ["**/e2e/**/*.test.js"];

// Rules that use plugins already owned by eslint-config-expo
// (must be merged into expo config objects that have the matching plugin)
const expoOwnedRules = {
  "@typescript-eslint/no-unused-vars": [
    "error",
    {
      args: "all",
      argsIgnorePattern: "^_",
      caughtErrors: "all",
      caughtErrorsIgnorePattern: "^_",
      destructuredArrayIgnorePattern: "^_",
      varsIgnorePattern: "^_",
      ignoreRestSiblings: true,
    },
  ],

  // ── React: Performance & Correctness ──
  "react/no-array-index-key": "warn",
  "react/jsx-key": ["error", { checkFragmentShorthand: true }],
  "react/jsx-no-leaked-render": ["error", { validStrategies: ["ternary"] }],
  "react/jsx-no-useless-fragment": "warn",
  "react/self-closing-comp": "error",
  "react/jsx-curly-brace-presence": ["warn", { props: "never", children: "never" }],

  // ── Import & Module Hygiene ──
  "import/order": [
    "error",
    {
      groups: [["external", "builtin"], "internal", ["sibling", "parent"], "index"],
      pathGroups: [
        {
          pattern: "@(react|react-native)",
          group: "external",
          position: "before",
        },
        {
          pattern: "@attenex/**",
          group: "internal",
        },
      ],
      pathGroupsExcludedImportTypes: ["internal", "react"],
      "newlines-between": "always",
      alphabetize: { order: "asc", caseInsensitive: true },
    },
  ],
  "import/no-extraneous-dependencies": [
    "error",
    {
      devDependencies: [
        ...TEST_PATTERNS,
        "**/*.config.js",
        "**/*.config.ts",
        "eslint.config.js",
        "plugins/**",
      ],
    },
  ],
};

// Rules that use plugins NOT owned by eslint-config-expo
const customPluginRules = {
  // ── React Native: Production Quality ──
  "react-native/no-unused-styles": "error",
  "react-native/no-color-literals": "error",
  "react-native/no-raw-text": ["error", { skip: ["Button", "TextInput"] }],
  "react-native/split-platform-components": "warn",
  "react-native/no-single-element-style-arrays": "error",
  "react-native/no-inline-styles": "error",
  "@react-native/platform-colors": "warn",

  // ── Promise Hygiene ──
  "promise/no-callback-in-promise": "error",
  "promise/no-nesting": "warn",
  "promise/no-promise-in-callback": "error",
  "promise/no-return-in-finally": "warn",
  "promise/prefer-await-to-then": "warn",
  "promise/valid-params": "error",

  // ── React Compiler ──
  "react-compiler/react-compiler": "error",
};

// Relaxed rules for test files (production rules often false-positive in test context)
const testFileRelaxations = {
  "react-native/no-color-literals": "off",
  "react-native/no-inline-styles": "off",
  "react-native/no-raw-text": "off",
  "react-native/split-platform-components": "off",
  "react-native/no-unused-styles": "off",
  "react/no-array-index-key": "off",
};

module.exports = defineConfig([
  // Global ignores — must be a standalone config object with ONLY `ignores`
  {
    ignores: ["dist/*", "babel.config.js", "metro.config.js", ".prettierrc.js", "jest.config.js", "e2e/jest.config.js"],
  },
  ...expoConfig.map((config) => {
    const configPlugins = new Set(Object.keys(config.plugins || {}));
    const compatibleRules = {};

    for (const [rule, value] of Object.entries(expoOwnedRules)) {
      const slashIndex = rule.indexOf("/");
      if (slashIndex === -1 || configPlugins.has(rule.slice(0, slashIndex))) {
        compatibleRules[rule] = value;
      }
    }

    return {
      ...config,
      rules: {
        ...config.rules,
        ...compatibleRules,
      },
    };
  }),
  {
    plugins: {
      "react-native": reactNative,
      "react-native-a11y": reactNativeA11y,
      promise: promisePlugin,
      "@react-native": reactNativePlugin,
      "react-compiler": reactCompiler,
    },
    rules: customPluginRules,
  },

  // ── Test file overrides ──
  {
    files: TEST_PATTERNS,
    plugins: {
      jest: pluginJest,
    },
    languageOptions: {
      globals: globals.jest,
    },
    rules: {
      ...pluginJest.configs["flat/recommended"].rules,
      ...testFileRelaxations,
    },
  },
  {
    files: E2E_TEST_PATTERNS,
    plugins: {
      detox: detoxPlugin,
    },
    languageOptions: {
      globals: detoxPlugin.environments.detox.globals,
    },
    rules: {
      ...pluginJest.configs["flat/recommended"].rules,
      ...testFileRelaxations,
    },
  },
]);
