import type React from "react"
import { SafeAreaView, StatusBar, useColorScheme, StyleSheet } from "react-native"
import { createStackNavigator } from "@react-navigation/stack"
import { NavigationContainer } from "@react-navigation/native"
import { Colors } from "react-native/Libraries/NewAppScreen"

import MainDrawer from "./src/drawer/Maindrawer"
import Acknowledge from "./src/screens/Acknowledge"
import Acknowledgelist from "./src/screens/Acknowledgelist"
import Accepted from "./src/screens/Accepted"
import LoginScreen from "./src/screens/LoginScreen"

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

import AllocatedInspetion from "./src/screens/Allocated"
import Resumelist from "./src/screens/Resumelist"
import SplashScreen from "./src/screens/Splashscrren"
import ParameterResultsScreen from "./src/screens/UpdateInspectionChecklist"
import InspectionAcknowledgment from "./src/screens/Acknowledgelist"
import InspectionAccepted from "./src/screens/Acceptedlist"
import InspectionRejected from "./src/screens/Rejectedlist"
import OngoingInspection from "./src/screens/OngoingInspection"
import InspectionOngoing from "./src/screens/Ongoinglist"
import Ongoing from "./src/screens/OngoingInspection"
import UpdateInspectionChecklist from "./src/screens/UpdateInspectionChecklist"
import UploadDocuments from "./src/screens/UploadDocumentsPhotos"
import UploadDocumentsPhotos from "./src/screens/UploadDocumentsPhotos"
import Preview from "./src/screens/Preview"
import ApplicantSignature from "./src/screens/ApplicantSignature"
import OfficerSignature from "./src/screens/OfficerSignature"
import SearchClick from "./src/screens/SearchClick"



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
       
        <Stack.Navigator initialRouteName="Splash">
        <Stack.Screen
          name="Splash"
          component={SplashScreen}
          options={{ headerShown: false }}
        />
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="MainTabs" component={BottomTabNavigator} options={{ headerShown: false }} />
          <Stack.Screen name="MainDrawer" component={MainDrawer} options={{ headerShown: false }} />
          <Stack.Screen name="Acknowledge" component={Acknowledge} />
          <Stack.Screen name="InspectionAcknowledgement" component={InspectionAcknowledgment} />
          <Stack.Screen name="Accepted" component={Accepted} />
          <Stack.Screen name="InspectionAccepted" component={InspectionAccepted} />
          <Stack.Screen name="Rejected" component={Rejected} />
          <Stack.Screen name="InspectionRejected" component={InspectionRejected} />
          <Stack.Screen name="Ongoing" component={Ongoing} />
          <Stack.Screen name="Ongoinglist" component={Ongoinglist}  options={{ title: 'Ongoing Inspections' }} />
          <Stack.Screen name="Allocate Inspection" component={AllocateInspection} />
          <Stack.Screen name="Allocated Inspection" component={AllocatedInspetion} />
          <Stack.Screen name="Resumelist" component={Resumelist} options={{ title: 'Ongoing Inspections' }}  />
          <Stack.Screen name="Update Inspection Checklist" component={UpdateInspectionChecklist} />
          <Stack.Screen name="Preview" component={Preview} />
         
  <Stack.Screen name="Upload Documents/Photos" component={UploadDocumentsPhotos} />
  <Stack.Screen name="Applicant Signature" component={ApplicantSignature} />
  <Stack.Screen name="Officer Signature" component={OfficerSignature} />
  <Stack.Screen name="SearchClick" component={SearchClick}  options={{ title: 'Search Inspection Report' }} />


          
          
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

