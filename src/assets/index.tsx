import React from 'react';
import packageJson from '../../package.json'; // Adjust the path as needed

// const logo = React.lazy(() => import('../assets/img/logologin.jpg'));

import forge from './img/forge.png';
import google from './img/google.png';
import okta from './img/okta.png';
import micro from './img/micro.png';
import apple from './img/apple.png';
import forge11 from './img/forge11.png';
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
  google:google,
  forge11:forge11,
};

export {AppImages};
