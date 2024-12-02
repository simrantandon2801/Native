/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {Suspense} from 'react';
import {View, Image, Text, StyleSheet, useColorScheme} from 'react-native';
import {PaperProvider} from 'react-native-paper';
import {NavigationContainer} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeStackNavigatorParamList } from './type';
import { darkThemeColors, lightThemeColors } from './src/core/Colors';
import { navigationRef } from './src/navigations/RootNavigation';
import LoginScreen from './src/screens/LoginScreen';
import WelcomeScreen from './src/screens/WelcomeScreen';

const App = () => {
  const scheme = useColorScheme();
  const Stack = createNativeStackNavigator<HomeStackNavigatorParamList>();

  return (
    <Suspense fallback={<div>Loading...</div>}>
    <PaperProvider
      theme={scheme === 'dark' ? darkThemeColors : lightThemeColors}>
      <NavigationContainer ref={navigationRef}>
      <Stack.Navigator initialRouteName="LoginScreen">
          <Stack.Screen
            name="LoginScreen"
            component={LoginScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="WelcomeScreen"
            component={WelcomeScreen}
            options={{headerShown: false}}
          />
           </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
    </Suspense>
  );
};

const styles = StyleSheet.create({
  loaderContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    zIndex: 1,
  },
  iconImage: {
    width: 100,
    height: 100,
    zIndex: 2,
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 16,
  },
});

export default App;