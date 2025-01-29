import type React from "react"
import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { useEffect, useState } from "react"
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  type DrawerContentComponentProps,
} from "@react-navigation/drawer"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useNavigation } from "@react-navigation/native"
import { LogOut } from "lucide-react-native"

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

// Custom Drawer Content Component
const CustomDrawerContent = (props: DrawerContentComponentProps) => {
  const navigation = useNavigation()

  const handleLogout = () => {
    console.log("Logout pressed");
    navigation.navigate('Login' as never); 
  };

  return (
    <View style={styles.drawerContainer}>
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <LogOut size={24} color="#FF4136" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  )
}

// Main Drawer Component
const MainDrawer: React.FC = () => {
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [nomi, setNomi] = useState<string | null>(null);


  useEffect(() => {

   
    const fetchMenuItems = async () => {
      try {
        const sim = await AsyncStorage.getItem("menufromresponse");
        const nomiValue = await AsyncStorage.getItem("Nameresponse####");
        if (nomiValue) {
          setNomi(nomiValue);
        }
        if (sim) {
          const mainMenu:any[]=[];
          const parsedMenu = JSON.parse(sim);
          console.log("Fetched menu items:", parsedMenu);

          parsedMenu.forEach((element:any) => {
            let componentName=null;
            if(element.subModuleName == "Inspection Acknowledgement"){
              componentName = Acknowledgelist
            }

            if(element.subModuleName == "Inspection Accepted"){
              componentName = AcceptedList
            }

            if(element.subModuleName == "Ongoing Inspections"){
              componentName = Ongoinglist
            }

            if(element.subModuleName == "Inspection Rejected"){
              componentName = Rejectedlist
            }

            if(element.subModuleName == "Inspection Rejected"){
              componentName = Rejectedlist
            }

            if(element.subModuleName == "Inspection Rejected"){
              componentName = Rejectedlist
            }

            if(element.subModuleName == "Clarifications sought from Applicant"){
              componentName = Rejectedlist
            }

            if(element.subModuleName == "Search Inspection Report"){
              componentName = Rejectedlist
            }

            if(element.subModuleName == "Completed Inspection Reports"){
              componentName = Rejectedlist
            }

            mainMenu.push(Object.assign(element,{"component": componentName}));
          });
          setMenuItems(mainMenu);
        }
      } catch (error) {
        console.error("Error fetching menu items:", error);
      }
    };

    fetchMenuItems();
  }, []);

  return (
    <Drawer.Navigator
      initialRouteName="Dashboard"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen name="Dashboard" component={DashboardScreen} />
      {menuItems.map((item, index) => (
        <Drawer.Screen
          key={index}
          name={item.subModuleName}
          //children={() => <Datalist url={item.subModuleUrl} />}
          component={item.component} 
        />
      ))} 
    

       {/* <Drawer.Screen name="Dashboard" component={DashboardScreen} /> */}
      {/* <Drawer.Screen name="Acknowledgelist" component={Acknowledgelist} />
      <Drawer.Screen name="Acceptedlist" component={AcceptedList} />
      <Drawer.Screen name="Ongoinglist" component={Ongoinglist} />
      <Drawer.Screen name="Rejectedlist" component={Rejectedlist} /> */}

    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
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

export default MainDrawer

