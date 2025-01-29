import type React from "react"
import { SafeAreaView, StatusBar, useColorScheme, StyleSheet } from "react-native"
import { createStackNavigator } from "@react-navigation/stack"
import { NavigationContainer } from "@react-navigation/native"
import { Colors } from "react-native/Libraries/NewAppScreen"

// Import screens and navigators
import LoginScreen from "./src/screens/Loginscreen"
import MainDrawer from "./src/drawer/Maindrawer"
import Acknowledge from "./src/screens/Acknowledge"
import Acknowledgelist from "./src/screens/Acknowledgelist"
import Accepted from "./src/screens/Accepted"

import Rejected from "./src/screens/Rejected"
import RejectedList from "./src/screens/Rejectedlist"
import Ongoinglist from "./src/screens/Ongoinglist"
import Acceptedlist from "./src/screens/Acceptedlist"

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
       
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />

       
          <Stack.Screen name="MainDrawer" component={MainDrawer} options={{ headerShown: false }} />
          <Stack.Screen name="Acknowledge" component={Acknowledge} />
          <Stack.Screen name="Acknowledgelist" component={Acknowledgelist} />
          <Stack.Screen name="Accepted" component={Accepted} />
          <Stack.Screen name="Acceptedlist" component={Acceptedlist} />
          <Stack.Screen name="Rejected" component={Rejected} />
          <Stack.Screen name="Rejectedlist" component={RejectedList} />
          <Stack.Screen name="Ongoing" component={Ongoinglist} />
          <Stack.Screen name="Ongoinglist" component={Ongoinglist} />
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

