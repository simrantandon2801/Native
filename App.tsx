import React from 'react';
import { SafeAreaView, StatusBar, useColorScheme, StyleSheet, View, Text } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import 'react-native-get-random-values';

import LoginScreen from './src/screens/Loginscreen';  // Import your LoginScreen
import DashboardScreen from './src/screens/Dashboardscreen';  // Import your DashboardScreen

import { Colors } from 'react-native/Libraries/NewAppScreen';

// Import the RootStackParamList type
import { RootStackParamList } from '../WEBReact-APP/src/navigations/types';
import MainDrawer from './src/drawer/Maindrawer';

// Define the stack navigator type
// type RootStackParamList = {
//   Login: undefined;
//   Dashboard: { username: string };
// };

// Create the stack navigator
const Stack = createStackNavigator<RootStackParamList>();

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    // Wrap your app with NavigationContainer
    <NavigationContainer>
      <SafeAreaView style={[styles.safeArea, backgroundStyle]}>
        {/* StatusBar for proper status bar styling */}
        <StatusBar
          barStyle={isDarkMode ? 'light-content' : 'dark-content'}
          backgroundColor={backgroundStyle.backgroundColor}
        />

        {/* Set up the Stack Navigator with screens */}
        <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Dashboard" component={DashboardScreen} />
          <Stack.Screen
            name="MainDrawer"
        component={MainDrawer}
            options={{ headerShown: false }} // Hide header for drawer
          />
        </Stack.Navigator>
      </SafeAreaView>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  // Add any custom styles you want
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
