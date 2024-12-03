const { plugins } = require('./webpack.config');

module.exports = {
  presets: [
    'module:metro-react-native-babel-preset',
    '@babel/preset-flow',
  ],
  plugins: [
    '@babel/plugin-transform-runtime',
    'react-native-reanimated/plugin',
    // Ensure plugins related to class properties, private methods, and private properties
    ['@babel/plugin-transform-class-properties', { loose: true }],
    ['@babel/plugin-transform-private-methods', { loose: true }],
    ['@babel/plugin-transform-private-property-in-object', { loose: true }],
  ],
  env: {
    production: {
      plugins: ['react-native-paper/babel'],
    },
  },
};
