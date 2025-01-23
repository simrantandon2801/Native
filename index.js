/**
 * @format
 */

// import 'react-native-get-random-values';
// import { Buffer } from 'buffer';
// global.Buffer = global.Buffer || Buffer;
// import crypto from 'react-native-crypto';
// global.crypto = crypto;


import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

// Polyfill require if not defined
if (typeof require === 'undefined') {
    global.require = require;
  }

AppRegistry.registerComponent(appName, () => App);

