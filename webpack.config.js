const path = require('path');

const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {version} = require('os');

const appDirectory = path.resolve(__dirname);
const {presets} = require(`${appDirectory}/babel.config.js`);

const compileNodeModules = [
  // Add every react-native package that needs compiling
  'react-native-gesture-handler',
  //'react-native-vector-icons',
  //'react-native-fs',
  //'react-native-document-picker',
  //'react-native-elements',
  //'react-native-calendars',
  //'react-native-paper',
  //'@react-native-community',
  //'react-native-element-dropdown',
  //'react-native-animatable',
  'react-native-swipe-gestures',
  //'react-native-image-picker',
  // 'formik',
  //'yup',
  //'@react-native-community/checkbox',
  //'@react-native-community/datetimepicker',
  //'react-native-raw-bottom-sheet',
  //'react-native-gifted-charts',
  //'react-native-linear-gradient',
  //'gifted-charts-core',
  //'expo-linear-gradient',
  'react-native-reanimated-carousel',
  'react-native-paper-dropdown',
  '@react-native-community/slider',
  'react-native-reanimated',
  'react-native-maps',
  '@types/geojson',
  'react-native-maps',
  'react-leaflet',
 
].map(moduleName => path.resolve(appDirectory, `node_modules/${moduleName}`));

const babelLoaderConfiguration = {
  test: /\.js$|tsx?$/,
  // Add every directory that needs to be compiled by Babel during the build.
  include: [
    path.resolve(__dirname, 'index.web.js'), // Entry to your application
    path.resolve(__dirname, 'App.web.tsx'), // Change this to your main App file
    path.resolve(__dirname, 'src'),
    path.resolve(__dirname, 'node_modules/react-native-vector-icons'),
    ...compileNodeModules,
  ],
  // use: {
  //   loader: 'babel-loader',
  //   options: {
  //     cacheDirectory: true,
  //     presets,
  //     plugins: ['react-native-web'],
  //   },
  // },
  use: {
    loader: 'babel-loader',
    options: {
      cacheDirectory: true,
      presets: [
        [
          '@babel/preset-env',
         
         
          {
            useBuiltIns: 'usage',
            corejs: '3.37.0', // Or specify the version you need
            // Other options...
          },  
        ],
        '@babel/preset-react',
       /*  '@babel/preset-flow', */
        '@babel/preset-typescript',
      ],
      plugins: [
        'react-native-web',
        '@babel/plugin-proposal-class-properties',
        '@babel/plugin-proposal-object-rest-spread',
        
      ],
    },
  },
};

const svgLoaderConfiguration = {
  test: /\.svg$/,
  use: [
    {
      loader: '@svgr/webpack',
    },
  ],
};
const ttfLoaderConfiguration = {
  test: /\.ttf$/,
  loader: 'url-loader', // or directly file-loader
  include: [
    path.resolve(appDirectory, 'node_modules/react-native-vector-icons'),
  ],
};
const imageLoaderConfiguration = {
  test: /\.(gif|jpe?g|png)$/,
  use: {
    loader: 'url-loader',
    options: {
      name: '[name].[ext]',
    },
  },
};
// const imageLoaderConfiguration = {
//   test: /\.(gif|jpe?g|png)$/,
//   use: {
//     loader: 'url-loader',
//     options: {
//       name: '[name].[ext]',
//     },
//   },
// };
// const ttfLoaderConfiguration = {
//   test: /\.ttf$/,
//   loader: 'url-loader', // or directly file-loader
//   include: [
//     path.resolve(appDirectory, 'node_modules/react-native-vector-icons'),
//   ],
// };
// const ttfLoaderConfiguration = {
//   test: /\.(gif|jpe?g|png|svg)$/,
//   use: {
//     loader: 'url-loader',
//     options: {
//       name: '[name].[ext]',
//       esModule: false,
//     },
//   },
// };
// const imageLoaderConfiguration = {
//   test: /\.(gif|jpe?g|png|svg)$/,
//   use: {
//     loader: 'url-loader',
//     options: {
//       name: '[name].[ext]',
//       esModule: false,
//     },
//   },
// };
// const fileLoaderConfiguration = {
//   test: /\.(jpg|png|woff|woff2|eot|ttf|svg)$/,
//   use: {
//     loader: 'file-loader',
//     options: {
//       name: '[name].[ext]',
//     },
//   },
//   include: [path.join(__dirname, 'src/assets')],
// };

// const fileLoaderConfiguration = {
//   test: /\.(jpe?g|png|gif|svg)$/i,
//   loader: 'file-loader',
//   options: {
//     name: path.resolve(appDirectory, 'src/assets/[name].[ext]'),
//     esModule: false,
//   },
// };
module.exports = {
  mode: 'production',
  // other configurations...
  optimization: {
    usedExports: true,
  },
  entry: {
    app: path.join(__dirname, 'index.web.js'),
  },
  output: {
    path: path.resolve(appDirectory, 'dist'),
    publicPath: '/',
    filename: 'bsmbilalshah.js',
  },
  resolve: {
    extensions: ['.web.tsx', '.web.ts', '.tsx', '.ts', '.web.js', '.js'],
    alias: {
      'react-native$': 'react-native-web',
      
    },
  },
  module: {
    rules: [
      babelLoaderConfiguration,
      imageLoaderConfiguration,
      svgLoaderConfiguration,
      ttfLoaderConfiguration,
    
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'index.html'),
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      // Polyfill for process
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
      },
      __DEV__: JSON.stringify(true),
    }),
  ],
};
