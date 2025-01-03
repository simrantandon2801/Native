/* eslint-disable no-unused-vars, import/no-unresolved */
import React from 'react';
import {StyleSheet, useColorScheme} from 'react-native';
import {PaperProvider} from 'react-native-paper';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LoginScreen from './src/screens/LoginScreen';
import MainDrawer from './src/drawer/MainDrawer';
import {darkThemeColors, lightThemeColors} from './src/core/Colors';
import {navigationRef} from './src/navigations/RootNavigation';
import {HomeStackNavigatorParamList} from './type';
import { LogBox } from 'react-native';
import SignupScreen from './src/screens/SignupScreen';
// import Toast from 'react-native-toast-message';



const Stack = createNativeStackNavigator<HomeStackNavigatorParamList>();
LogBox.ignoreLogs([
  'export \'FooterComponent\' (imported as \'FooterComponent\') was not found in \'./ScreenFooter\'',
]);
const App: React.FC = () => {
  const scheme = useColorScheme();

  return (
    <PaperProvider
      theme={scheme === 'dark' ? darkThemeColors : lightThemeColors}>
     
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator initialRouteName="LoginScreen">
          {/* Login Screen */}
          <Stack.Screen
            name="LoginScreen"
            component={LoginScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="SignupScreen"
            component={SignupScreen}
            options={{headerShown: false}}
          />
          {/* Drawer Content */}
          <Stack.Screen
            name="Main"
            component={MainDrawer}
            options={{headerShown: false}}
          />
        </Stack.Navigator>
      </NavigationContainer>
      {/* <Toast /> */}
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
