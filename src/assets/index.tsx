import React from 'react';
import packageJson from '../../package.json'; // Adjust the path as needed

// const logo = React.lazy(() => import('../assets/img/logologin.jpg'));

/*  import logo from './img/logo.png';

import background from './img/background.jpg';
import icon1 from './img/icon1.png';
import icon2 from './img/icon2.png';
import icon3 from './img/icon3.png';          
import icon4 from './img/icon4.png';
import icon5 from './img/icon5.png';
import icon6 from './img/icon6.png';
import map from './img/map.png';
import background1 from './img/background1.png'; */
import forge from './img/forge.png';
import google from './img/google.png';
import okta from './img/okta.png';
import micro from './img/micro.png';
import apple from './img/apple.png';
const AppImages = {
  AppVersion: packageJson.version,
  //background: background,
 /*  logo: logo,
  icon1: icon1,
  icon2: icon2,
  icon3: icon3,

  icon4: icon4,
  icon5: icon5,
  icon6: icon6,
  map: map,
  background1: background1, */
  forge:forge,
  micro:micro,
  okta:okta,
  apple:apple,
  google:google
};

export {AppImages};
