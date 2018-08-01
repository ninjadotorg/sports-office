module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    'react-native/react-native': true
  },
  extends: ['airbnb', 'plugin:react-native/all', 'eslint:recommended'],
  parser: 'babel-eslint',
  parserOptions: {
    ecmaFeatures: {
      experimentalObjectRestSpread: true,
      jsx: true
    },
    ecmaVersion: 6,
    sourceType: 'module'
  },
  settings: {
    'import/resolver': {
      'babel-module': {}
    }
  },
  plugins: ['react', 'react-native', 'jsx-a11y', 'import'],
  rules: {
    'no-console': 0,
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
    'react/prefer-stateless-function': [0, { ignorePureComponents: true }],
    'react-native/no-unused-styles': 2,
    'react-native/no-color-literals': 2,
    'react-native/split-platform-components': 2,
    'react/forbid-prop-types': 'off',
    'comma-dangle': ['error', { functions: 'ignore' }],
    'react-native/no-inline-styles': 'off',
    'react-native/no-color-literals': 'off',
    quotes: ['error', 'single'],
    semi: ['error', 'always'],
    'import/no-unresolved': [
      'error',
      {
        ignore: ['src/']
      }
    ]
  }
};
