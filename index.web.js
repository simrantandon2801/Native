import {AppRegistry} from 'react-native';
import {name as appName} from './app.json';
import App from './App';
if (module.hot) {
  module.hot.accept();
}
AppRegistry.registerComponent(appName, () => App);
AppRegistry.runApplication(appName, {
  initialProps: {},
  rootTag: document.getElementById('app-root'),
});
// Generate required css
import iconFont from 'react-native-vector-icons/Fonts/FontAwesome.ttf';
import MaterialCommunityIconsiconFont from 'react-native-vector-icons/Fonts/MaterialCommunityIcons.ttf';
import AntDesigniconFont from 'react-native-vector-icons/Fonts/AntDesign.ttf';
import IoniconsiconFont from 'react-native-vector-icons/Fonts/Ionicons.ttf';
import MaterialIconsiconFont from 'react-native-vector-icons/Fonts/MaterialIcons.ttf';

const iconFontStyles = `@font-face {
  src: url(${MaterialCommunityIconsiconFont});
  font-family: MaterialCommunityIcons;
},
#app-root{width:40%;}


`;
const iconFontStylesFontHero = `@font-face {
  src: url(${iconFont});
  font-family: FontAwesome;
},
#app-root{width:40%;}


`;
const iconAntDesigniconFont = `@font-face {
  src: url(${AntDesigniconFont});
  font-family: AntDesign;
},
#app-root{width:40%;}


`;
const IoniconsiconFontIcon = `@font-face {
  src: url(${IoniconsiconFont});
  font-family: Ionicons;
},
#app-root{width:40%;}


`;
// Create stylesheet
const style = document.createElement('style');
style.type = 'text/css';
if (style.styleSheet) {
  style.styleSheet.cssText = iconFontStyles;
} else {
  style.appendChild(document.createTextNode(iconFontStyles));
  style.appendChild(document.createTextNode(iconFontStylesFontHero));
  style.appendChild(document.createTextNode(iconAntDesigniconFont));
  style.appendChild(document.createTextNode(IoniconsiconFontIcon));
}

// Inject stylesheet
document.head.appendChild(style);
//document.head.appendChild(styles);
