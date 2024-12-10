declare module "*.svg" {
    import React from 'react';
    const content: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
    export default content;
  }

  declare module 'react-native-recaptcha-v3' {
   
    const ReCaptchaV3: any;
    export default ReCaptchaV3;
  }