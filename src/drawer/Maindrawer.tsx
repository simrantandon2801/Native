import type React from "react"
import { useEffect, useState, useCallback } from "react"
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from "react-native"
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  type DrawerContentComponentProps,
} from "@react-navigation/drawer"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useNavigation } from "@react-navigation/native"
import { LogOut, ChevronDown, ChevronUp, User } from "lucide-react-native"
import Collapsible from "react-native-collapsible"

// Import your screens
import DashboardScreen from "../screens/Dashboardscreen"
import Acknowledgelist from "../screens/Acknowledgelist"
import AcceptedList from "../screens/Acceptedlist"
import Ongoinglist from "../screens/Ongoinglist"
import Rejectedlist from "../screens/Rejectedlist"
import Clarificationn from "../screens/Clarificationn"
import SearchInspection from "../screens/SearchInspection"
import CompletedInspection from "../screens/CompletedInspection"
import AllocatedInspection from "../screens/AllocateInspection"
import AllocateInspection from "../screens/AllocateInspection"
import AllocatedInspetion from "../screens/Allocated"

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

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
  },
  profileSection: {
    // alignItems: "center",
    // justifyContent: "center",
    padding: 20,
    backgroundColor: "#f0f0f0",
  },
  collapsibleHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#e0e0e0",
  },
  collapsibleHeaderText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  logoutButton: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    flexDirection: "row",
    alignItems: "center",
  },
  logoutText: {
    marginLeft: 10,
    fontSize: 16,
    color: "#FF4136",
  },
})

const COLLAPSIBLE_STATE_KEY = "drawerCollapsibleState"

const CustomDrawerContent = (props: DrawerContentComponentProps) => {
  const navigation = useNavigation()
  const [isCollapsed, setIsCollapsed] = useState(true)
  const [nomi, setNomi] = useState<string | null>("Rxx")

  useEffect(() => {
    const fetchInitialState = async () => {
      try {
        const nomiValue1 = await AsyncStorage.getItem("Nameresponse####");
        const nomiValue=JSON.parse(nomiValue1)
        if (nomiValue) {
          setNomi(nomiValue)
        }

        const savedCollapsibleState = await AsyncStorage.getItem(COLLAPSIBLE_STATE_KEY)
        if (savedCollapsibleState !== null) {
          setIsCollapsed(JSON.parse(savedCollapsibleState))
        }
      } catch (error) {
        console.error("Error fetching initial state:", error)
      }
    }

    fetchInitialState()
  }, [])

  const handleLogout = useCallback(() => {
    console.log("Logout pressed")
    AsyncStorage.clear()
    navigation.navigate("Login" as never)

  }, [navigation])

  const toggleCollapsible = useCallback(() => {
    setIsCollapsed((prevState) => {
      const newState = !prevState
      AsyncStorage.setItem(COLLAPSIBLE_STATE_KEY, JSON.stringify(newState)).catch((error) =>
        console.error("Error saving collapsible state:", error),
      )
      return newState
    })
  }, [])

  return (
    <SafeAreaView style={styles.drawerContainer}>
      <View style={styles.profileSection}>
        <User size={60} color="#000" />
      </View>
      <TouchableOpacity style={styles.collapsibleHeader} onPress={toggleCollapsible}>
        <Text style={styles.collapsibleHeaderText}>{nomi}</Text>
        {isCollapsed ? <ChevronDown size={20} color="#000" /> : <ChevronUp size={20} color="#000" />}
      </TouchableOpacity>
      {!isCollapsed && (
        <DrawerContentScrollView {...props}>
          <DrawerItemList {...props} />
        </DrawerContentScrollView>
      )}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <LogOut size={24} color="#FF4136" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
}

const MainDrawer: React.FC = () => {
  const [menuItems, setMenuItems] = useState<any[]>([])

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const sim = await AsyncStorage.getItem("menufromresponse")
        if (sim) {
          const mainMenu: any[] = []
          const parsedMenu = JSON.parse(sim)
          console.log("Fetched menu items:", parsedMenu)

          parsedMenu.forEach((element: any) => {
            let componentName = null
            if (element.subModuleName == "Inspection Acknowledgement") {
              componentName = Acknowledgelist
            } else if (element.subModuleName == "Inspection Accepted") {
              componentName = AcceptedList
            } else if (element.subModuleName == "Ongoing Inspections") {
              componentName = Ongoinglist
            } else if (element.subModuleName == "Inspection Rejected") {
              componentName = Rejectedlist
            } else if (element.subModuleName == "Clarifications sought from Applicant") {
              componentName = Clarificationn
            } else if (element.subModuleName == "Search Inspection Report") {
              componentName = SearchInspection
            } else if (element.subModuleName == "Completed Inspection Reports") {
              componentName = CompletedInspection
            }
            else if (element.subModuleName == "Document Scrutinization") {
              componentName = CompletedInspection
            }
            else if (element.subModuleName == "Scrutiny Completed") {
              componentName = CompletedInspection
            }
            else if (element.subModuleName == "Generate Registration Certificate") {
              componentName = CompletedInspection
            }
            else if (element.subModuleName == "View Issued Certificates") {
              componentName = CompletedInspection
            }
            else if (element.subModuleName == "List of Application(s) Sent for Editing") {
              componentName = CompletedInspection
            }
            else if (element.subModuleName == "Rejected Application(s)") {
              componentName = CompletedInspection
            }
            else if (element.subModuleName == "Recall Application(s)") {
              componentName = CompletedInspection
            }
            else if (element.subModuleName == "Allocate Inspection") {
              componentName = AllocateInspection
            }
            else if (element.subModuleName == "Allocated Inspection") {
              componentName = AllocatedInspetion
            }
            else if (element.subModuleName == "Allocate Inspection For Expired Certificate") {
              componentName = CompletedInspection
            }
            else if (element.subModuleName == "Scrutinize Inspection Report") {
              componentName = CompletedInspection
            }


            mainMenu.push(Object.assign(element, { component: componentName }))
          })
          setMenuItems(mainMenu)
        }
      } catch (error) {
        console.error("Error fetching menu items:", error)
      }
    }

    fetchMenuItems()
  }, [])

  return (
    
    <Drawer.Navigator
      initialRouteName="Dashboard"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: true,
        headerStyle: {
          // backgroundColor: "#f4511e",
        },
        headerTintColor: "#000",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      <Drawer.Screen name="Dashboard" component={DashboardScreen} />
      {menuItems.map((item, index) => (
        <Drawer.Screen
          key={index}
          name={item.subModuleName}
          component={item.component}
          options={{
            title: item.subModuleName,
          }}
        />
      ))}
    </Drawer.Navigator>
  )
}

export default MainDrawer

