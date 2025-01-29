import React from "react"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { Home, User, type LucideIcon } from "lucide-react-native"
import HomeScreen from "../BottomTabs/HomeScreen"
import ProfileScreen from "../BottomTabs/ProfileScreen"

type BottomTabParamList = {
  Home: undefined
  Profile: undefined
}

const Tab = createBottomTabNavigator<BottomTabParamList>()

const BottomTabNavigator: React.FC = () => {
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
export default BottomTabNavigator

