import type React from "react"
import { SafeAreaView, StatusBar, useColorScheme, StyleSheet } from "react-native"
import { createStackNavigator } from "@react-navigation/stack"
import { NavigationContainer } from "@react-navigation/native"
import { Colors } from "react-native/Libraries/NewAppScreen"

// Import screens and navigators
import LoginScreen from "./src/screens/Loginscreen"
import MainDrawer from "./src/drawer/Maindrawer"

// Define the stack navigator
const Stack = createStackNavigator()

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === "dark"

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  }

  return (
    <NavigationContainer>
      <SafeAreaView style={[styles.safeArea, backgroundStyle]}>
        <StatusBar
          barStyle={isDarkMode ? "light-content" : "dark-content"}
          backgroundColor={backgroundStyle.backgroundColor}
        />
        <Stack.Navigator initialRouteName="Login">
          {/* Login Screen */}
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />

          {/* Main Drawer Navigator */}
          <Stack.Screen name="MainDrawer" component={MainDrawer} options={{ headerShown: false }} />
        </Stack.Navigator>
      </SafeAreaView>
    </NavigationContainer>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
})

export default App

