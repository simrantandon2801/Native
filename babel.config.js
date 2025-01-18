module.exports = {
  presets: [
    'module:metro-react-native-babel-preset',
    '@babel/preset-flow',
  ],
  plugins: [
    '@babel/plugin-transform-runtime',
    'react-native-reanimated/plugin',
    ['@babel/plugin-transform-class-properties', { loose: true }],
    ['@babel/plugin-transform-private-methods', { loose: true }],
    ['@babel/plugin-transform-private-property-in-object', { loose: true }],
    ['module:react-native-dotenv'],
  ],
  env: {
    production: {
      plugins: [
        'react-native-paper/babel',
      ],
    },
  },
};