/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

// Polyfill require if not defined
if (typeof require === 'undefined') {
    global.require = require;
  }

AppRegistry.registerComponent(appName, () => App);
