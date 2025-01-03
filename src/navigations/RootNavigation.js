import * as React from 'react';

// Create a reference for navigation
export const navigationRef = React.createRef();

// The navigate function
export function navigate(name, params) {
  navigationRef.current?.navigate(name, params);
}

// // The goBack function
// export function goBack() {
//   navigationRef.current?.goBack();
// }