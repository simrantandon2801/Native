import type React from "react"
import { View, Text, StyleSheet } from "react-native"
import { createDrawerNavigator } from "@react-navigation/drawer"

// Import your screens
import DashboardScreen from "../screens/Dashboardscreen"
import Acknowledgelist from "../screens/Acknowledgelist"
import AcceptedList from "../screens/Acceptedlist"
import Ongoinglist from "../screens/Ongoinglist"
import Rejectedlist from "../screens/Rejectedlist"

// Define the types for the drawer navigation
type DrawerParamList = {
  Dashboard: undefined
  Acknowledgelist: undefined
  Acceptedlist: undefined
  Ongoinglist: undefined
  Rejectedlist: undefined
}

// Create the Drawer Navigator
const Drawer = createDrawerNavigator<DrawerParamList>()

// Main Drawer Component
const MainDrawer: React.FC = () => {
  return (
    <Drawer.Navigator initialRouteName="Dashboard">
      <Drawer.Screen name="Dashboard" component={DashboardScreen} />
      <Drawer.Screen name="Acknowledgelist" component={Acknowledgelist} />
      <Drawer.Screen name="Acceptedlist" component={AcceptedList} />
      <Drawer.Screen name="Ongoinglist" component={Ongoinglist} />
      <Drawer.Screen name="Rejectedlist" component={Rejectedlist} />
    </Drawer.Navigator>
  )
}

export default MainDrawer

