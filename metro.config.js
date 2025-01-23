const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);

// const { getDefaultConfig } = require("metro-config");

// module.exports = (async () => {
//   const defaultConfig = await getDefaultConfig();
//   const { resolver } = defaultConfig;

//   return {
//     ...defaultConfig,
//     resolver: {
//       ...resolver,
//       extraNodeModules: {
//         crypto: require.resolve("react-native-crypto"),
//       },
//     },
//   };
// })();
