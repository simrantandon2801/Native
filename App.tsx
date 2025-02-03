import type React from "react"
import { SafeAreaView, StatusBar, useColorScheme, StyleSheet } from "react-native"
import { createStackNavigator } from "@react-navigation/stack"
import { NavigationContainer } from "@react-navigation/native"
import { Colors } from "react-native/Libraries/NewAppScreen"
import LoginScreen from "./src/screens/Loginscreen"
import MainDrawer from "./src/drawer/Maindrawer"
import Acknowledge from "./src/screens/Acknowledge"
import Acknowledgelist from "./src/screens/Acknowledgelist"
import Accepted from "./src/screens/Accepted"

import Rejected from "./src/screens/Rejected"
import RejectedList from "./src/screens/Rejectedlist"
import Ongoinglist from "./src/screens/Ongoinglist"
import Acceptedlist from "./src/screens/Acceptedlist"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"

import HomeScreen from "./src/BottomTabs/HomeScreen"
import ProfileScreen from "./src/BottomTabs/ProfileScreen"
import { Home, User, type LucideIcon } from "lucide-react-native"
import BottomTabNavigator from "./src/BottomTabs/BottomTabnavi"
import AllocateInspection from "./src/screens/AllocateInspection"
import AllocatedInspection from "./src/screens/AllocateInspection"
import AllocatedInspetion from "./src/screens/Allocated"


const Stack = createStackNavigator()
const Tab = createBottomTabNavigator()


function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let IconComponent: LucideIcon | null = null

          if (route.name === "Home") {
            IconComponent = Home
          } else if (route.name === "Profile") {
            IconComponent = User
          }

          return IconComponent ? <IconComponent size={size} color={color} /> : null
        },
        tabBarActiveTintColor: "orange",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  )
}
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
          <Stack.Screen name="MainTabs" component={BottomTabNavigator} options={{ headerShown: false }} />
          <Stack.Screen name="MainDrawer" component={MainDrawer} options={{ headerShown: false }} />
          <Stack.Screen name="Acknowledge" component={Acknowledge} />
          <Stack.Screen name="Acknowledgelist" component={Acknowledgelist} />
          <Stack.Screen name="Accepted" component={Accepted} />
          <Stack.Screen name="Acceptedlist" component={Acceptedlist} />
          <Stack.Screen name="Rejected" component={Rejected} />
          <Stack.Screen name="Rejectedlist" component={RejectedList} />
          <Stack.Screen name="Ongoing" component={Ongoinglist} />
          <Stack.Screen name="Ongoinglist" component={Ongoinglist} />
          <Stack.Screen name="Allocate Inspection" component={AllocateInspection} />
          <Stack.Screen name="Allocated Inspection" component={AllocatedInspetion} />
          
          
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

