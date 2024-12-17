const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const appDirectory = path.resolve(__dirname);
const compileNodeModules = [
  'react-native-gesture-handler',
  'react-native-swipe-gestures',
  'react-native-reanimated-carousel',
  'react-native-paper-dropdown',
  '@react-native-community/slider',
  'react-native-reanimated',
  'react-native-maps',
  '@types/geojson',
  'react-native-gifted-charts',
  'react-native-linear-gradient',
  'react-native-svg'
  
].map(moduleName => path.resolve(appDirectory, `node_modules/${moduleName}`));

module.exports = {
  
  mode: 'production',
  entry: {
    app: path.join(__dirname, 'index.web.js'),
  },
  output: {
    path: path.resolve(appDirectory, 'dist'),
    publicPath: '/',
    filename: 'bundle.js', // Updated filename
  },
  resolve: {
    extensions: ['.web.tsx', '.web.ts', '.tsx', '.ts', '.web.js', '.js'],
    alias: {
      'react-native$': 'react-native-web',
    },
  },
  module: {
    rules: [
      {
       /*  test: /\.js$|tsx?$/, */
       test: /\.(js|jsx|ts|tsx)$/,
        include: [
          path.resolve(__dirname, 'index.web.js'),
          path.resolve(__dirname, 'App.web.tsx'),
          path.resolve(__dirname, 'src'),
          path.resolve(__dirname, 'node_modules/react-native-vector-icons'),
          ...compileNodeModules,
        ],
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
            presets: [
              ['@babel/preset-env', { useBuiltIns: 'usage', corejs: '3.37.0' }],
              '@babel/preset-react',
              '@babel/preset-typescript',
            ],
            plugins: [
              'react-native-web',
              '@babel/plugin-proposal-class-properties',
              '@babel/plugin-proposal-object-rest-spread',
            ],
          },
        },
      },
      {
        test: /\.d\.ts$/, // Handle type definition files
        use: 'ignore-loader', // Ignore them as they are not needed for runtime
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: '@svgr/webpack',
            options: {
              svgoConfig: {
                plugins: [{ name: 'preset-default', params: { overrides: { removeViewBox: false } } },], // Disable unnecessary viewBox removal
              },
            },
          },
        ],
      },
      {
        test: /\.(gif|jpe?g|png)$/i,
        use: {
          loader: 'url-loader',
          options: {
            limit: 8192, // Inline images below 8 KB as base64
            name: 'assets/images/[name].[hash].[ext]', // Output location
          },
        },
      },
      {
        test: /\.ttf$/,
        loader: 'url-loader',
        include: [
          path.resolve(appDirectory, 'node_modules/react-native-vector-icons'),
        ],
        options: {
          name: 'assets/fonts/[name].[hash].[ext]', // Output location for fonts
        },
      },
    ],
  },
  optimization: {
    usedExports: true, // Tree shaking
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'index.html'),
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
      },
      __DEV__: JSON.stringify(true),
    }),
  ],
  stats: 'errors-warnings',
};
