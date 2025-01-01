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
  'react-native-svg',
  'react-native-dropdown-picker', // Added here
].map(moduleName => path.resolve(appDirectory, `node_modules/${moduleName}`));

module.exports = {
  mode: 'production',
  entry: {
    app: path.join(__dirname, 'index.web.js'),
  },
  output: {
    path: path.resolve(appDirectory, 'dist'),
    publicPath: '/',
    filename: 'bundle.js',
  },
  resolve: {
    extensions: ['.web.tsx', '.web.ts', '.tsx', '.ts', '.web.js', '.js'],
    alias: {
      'react-native$': 'react-native-web',
      'react-native-svg': 'react-native-svg-web',
    },
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(js|jsx|ts|tsx)$/,
        include: [
          path.resolve(__dirname, 'index.web.js'),
          path.resolve(__dirname, 'App.web.tsx'),
          path.resolve(__dirname, 'src'),
          path.resolve(__dirname, 'node_modules/react-native-vector-icons'),
          ...compileNodeModules, // Include the extended compileNodeModules list
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
        test: /\.d\.ts$/,
        use: 'ignore-loader',
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: '@svgr/webpack',
            options: {
              svgoConfig: {
                plugins: [
                  {
                    name: 'preset-default',
                    params: { overrides: { removeViewBox: false } },
                  },
                ],
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
            limit: 8192,
            name: 'assets/images/[name].[hash].[ext]',
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
          name: 'assets/fonts/[name].[hash].[ext]',
        },
      },
    ],
  },
  optimization: {
    usedExports: true,
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
