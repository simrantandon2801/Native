const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const rnCrypto = require('react-native-crypto');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */
const defaultConfig = getDefaultConfig(__dirname);

const customConfig = {
  resolver: {
    extraNodeModules: {
      crypto: require.resolve('react-native-crypto'),
      stream: require.resolve('stream-browserify'),
      buffer: require.resolve('buffer'),
    },
  },
};

module.exports = mergeConfig(defaultConfig, customConfig);
