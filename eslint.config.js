const react = require('eslint-plugin-react');
const reactHooks = require('eslint-plugin-react-hooks');
const importPlugin = require('eslint-import-resolver-webpack');
const tsPlugin = require('typescript-eslint');
const globals = require('globals');

module.exports = [
  react.configs.flat.recommended,
  react.configs.flat['jsx-runtime'],
  reactHooks.configs['recommended-latest'],
  tsPlugin.configs.recommended,
  {
    // extends: [
    //   "plugin:react/recommended",
    //   "plugin:react-hooks/recommended"
    // ],
    files: ['./src/**/*.{js,jsx,mjs,cjs,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        apiBaseUri: true,
        imageServerBaseUri: true,
        gapi: true,
        AVAILABLE_MODULES: true,
      },
    },
    rules: {
      // "import/no-extraneous-dependencies": ["error", {"devDependencies": true}],
      "react/jsx-props-no-spreading": "off",
      "import/prefer-default-export": "off",
      "jsx-a11y/no-autofocus": "off"
    },
    plugins: {
      import: importPlugin,
    },
    settings: {
      "import/resolver": "webpack"
    }
  },
];
