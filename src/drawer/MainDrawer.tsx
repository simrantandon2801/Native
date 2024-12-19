import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Image,
  LogBox,
  Keyboard,
} from 'react-native';
import {
  createDrawerNavigator,
  DrawerNavigationProp,
} from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/Ionicons';
import LoginScreen from '../screens/LoginScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import ManageList from '../screens/ManageList';
import ManageAss from '../screens/ManageAss';
import {AppImages} from '../assets';
import SignupScreen from '../screens/SignupScreen';
import Header from '../header/header';
import FooterForge from '../screens/FooterForge';
import ManageUsers from '../screens/ManageUsers';
import {navigate} from '../navigations/RootNavigation';
import {useIsFocused} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {decodeBase64} from '../core/securedata';
import Excel from '../screens/Excel';
import DepartmentList from '../screens/DepartmentList';
import RoleMaster from '../screens/RoleMaster';
import ADIntegration from '../screens/ADIntegration';
import IntegrationList from '../screens/IntegrationList';
import Adminpanel from '../screens/Adminpanel';
import AdComponent from '../screens/Adcomponent';
import Adcomponent from '../screens/Adcomponent';

import AdminDboard from '../screens/AdminDboard';
import Roadmap from '../screens/RoadMap';
import RoadmapOverview from '../screens/RoadmapOverview';
import Resources from '../screens/Resources';
import IntakeList from '../screens/IntakeList';
import AdminDashBoard from '../screens/AdminDashboard';
import ManageGoals from '../screens/Goals/ManageGoals';
import ManagePrograms from '../screens/Goals/ManagePrograms';
import { MainDrawerNav } from '../database/MainDrawer';
import BinaryTree from '../screens/Tree/BinaryTree';
const Drawer = createDrawerNavigator();
LogBox.ignoreLogs([
  "export 'FooterComponent' (imported as 'FooterComponent') was not found in './ScreenFooter'",
]);

interface Submodule {
  module_id: string;
  module_name: string;
  is_active: boolean;
  url: string;
}

interface Module {
  module_id: string;
  module_name: string;
  is_active: boolean;
  sub_modules: Submodule[];
  url: string;
}

type DrawerProp = DrawerNavigationProp<any>;
const moduleIcons = {
  'Manage Users': 'people-outline',
  'Role Master': 'shield-checkmark-outline',
  'Excel': 'document-outline',
  'Welcome Screen': 'home-outline',
  "Departments": "business-outline",
  "Integrations": "link-outline",
  "Roles & Permissions": "key-outline",
  "Users": "people-outline",
  "Admin Panel": "settings-outline",
  "RoadMap":"map-outline",
  "Dashboard":"grid-outline",
  "Adcomponent":"sync-outline",
"Intake/Backlog":"hourglass-outline",
"Active Projects":"rocket-outline",
"Raid Tracker":"bug-outline",
"Closed Projects":"checkmark-done-outline",

};

const getIconForModule = (moduleName) => {
  return moduleIcons[moduleName] || 'cube-outline'; 
};
const AccountSection: React.FC<{
  navigation: DrawerProp;
  isDrawerOpen: boolean;
  handleItemPress: (screen: string, url?: string) => void;
  dynamicModules: any[]; // Changed to any[] to accommodate the submodules structure
}> = ({navigation, isDrawerOpen, handleItemPress, dynamicModules}) => {
  return (
    <View style={styles.drawerSection}>
      {/* Static Drawer Items */}
      <TouchableOpacity
        onPress={() => handleItemPress('Account')}
        style={styles.drawerItem}>
        <Image source={AppImages.forge11} style={styles.drawerImage} />
      </TouchableOpacity>

      {/*  <TouchableOpacity onPress={() => handleItemPress('SignupScreen')} style={styles.drawerItem}>
        <Icon name="person-outline" size={15} color="black" />
        {isDrawerOpen && <Text style={styles.drawerSectionTitle}>Customer registration</Text>}
      </TouchableOpacity> */}

      {/* <TouchableOpacity onPress={() => handleItemPress('Account')} style={styles.drawerItem}>
        <Icon name="list-outline" size={15} color="black" />
        {isDrawerOpen && <Text style={styles.drawerSectionTitle}>Manage Modules</Text>}
      </TouchableOpacity>
 */}
      {/* {isDrawerOpen && (
        <>
          <TouchableOpacity style={styles.drawerItem} onPress={() => handleItemPress('ManageList')}>
            <Text style={styles.drawerItemText}>Manage Module</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.drawerItem} onPress={() => handleItemPress('ManageAss')}>
            <Text style={styles.drawerItemText}>Module Assignment</Text>
          </TouchableOpacity>
        </>
      )} */}

      {/* <TouchableOpacity onPress={() => handleItemPress('Account')} style={styles.drawerItem}>
        <Icon name="person-outline" size={15} color="black" />
        {isDrawerOpen && <Text style={styles.drawerSectionTitle}>Users</Text>}
      </TouchableOpacity> */}

      {/* {isDrawerOpen && (
        <TouchableOpacity style={styles.drawerItem} onPress={() => handleItemPress('ManageUsers')}>
          <Text style={styles.drawerItemText}>Manage Users</Text>
        </TouchableOpacity>
      )} */}

      {/* Render Modules and Submodules */}
      {dynamicModules.map((module: Module) => {
        // Check if module or any submodule is active
        const hasActiveSubmodules = module.sub_modules.some(
          submodule => submodule.is_active,
        );

  return (
    <View key={module.module_id}>
      {/* Render the parent module */}
      {(module.is_active || hasActiveSubmodules) && (
        <TouchableOpacity
          /* onPress={() => handleItemPress(module.module_name,module.url)} */
          onPress={() => handleItemPress(module.url)}
          style={styles.drawerItem}
        >
          {/* <Icon name="cube-outline" size={15} color="black" /> */}
          <Icon name={getIconForModule(module.module_name)} size={18} color="black" />
          {isDrawerOpen && <Text style={styles.drawerSectionTitle}>{module.module_name}</Text>}
        </TouchableOpacity>
      )}

      {/* Render submodules */}
      {isDrawerOpen &&
        module.sub_modules.map((submodule: Submodule) =>
          submodule.is_active ? (
            <TouchableOpacity
              key={submodule.module_id}
              /* onPress={() => handleItemPress(submodule.module_name,submodule.url)} */
              onPress={() => handleItemPress(submodule.url)}
              style={styles.drawerItem} // Match the style of other items
            >
               {/* <Icon name={getIconForModule(submodule.module_name)} size={15} color="black" /> */}
              <Text style={styles.drawerItemText}>- {submodule.module_name}</Text>
            </TouchableOpacity>
          ) : null
        )}
    </View>
  );
})}
    </View>
  );
};
const MainDrawer: React.FC = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [dynamicModules, setDynamicModules] = useState<any[]>([]); // Adjusted type to any[]

  const isFocused = useIsFocused();

  const fetchRoleModules = async () => {
    try {
      const encodedRoleId = await AsyncStorage.getItem('UserType');
      const decodedRoleId = decodeBase64(encodedRoleId ?? '');
      console.log('Decoded Role ID:', decodedRoleId);

      const response = await 
        MainDrawerNav (decodedRoleId)
       
        const responseData: Module[] = JSON.parse(response);

      console.log('Fetched Role Data:', JSON.stringify(responseData, null, 2)); // Log the full response

      // Include modules that are active OR have active submodules
      const filteredModules = responseData.filter(
        module =>
          module.is_active ||
          module.sub_modules.some(submodule => submodule.is_active),
      );

      // Ensure that only active submodules are passed along
      const modulesWithActiveSubmodules = filteredModules.map(module => ({
        ...module,
        sub_modules: module.sub_modules.filter(
          submodule => submodule.is_active,
        ),
      }));

      console.log(
        'Filtered Modules with Active Submodules:',
        JSON.stringify(modulesWithActiveSubmodules, null, 2),
      );
      setDynamicModules(modulesWithActiveSubmodules); // Update state with filtered modules
    } catch (error) {
      console.error('Failed to fetch modules:', error);
    }
  };
  useEffect(() => {
    if (isFocused) {
      fetchRoleModules();
    }
  }, [isFocused]);

  const handleItemPress = (screen: string, url: string) => {
    if (!isDrawerOpen) {
      setIsDrawerOpen(true);
      fetchRoleModules();
      setTimeout(() => {
        if (!url) {
          return;
        }
        if (url) {
          navigate(url);
        } else {
          navigate(screen);
        }
      }, 200);
    } else {
      navigate(screen);
    }
  };

  const handleOutsidePress = () => {
    if (isDrawerOpen) {
      setIsDrawerOpen(false);
    }
  };

  const onDrawerOpen = () => {
    setIsDrawerOpen(true);
    fetchRoleModules();
  };

  return (
    <TouchableWithoutFeedback onPress={handleOutsidePress}>
      <View style={styles.container}>
        <Drawer.Navigator
          drawerContent={props => (
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
              <View style={styles.drawerContent}>
                <AccountSection
                  navigation={props.navigation as DrawerProp}
                  isDrawerOpen={isDrawerOpen}
                  handleItemPress={screen => handleItemPress(screen)}
                  dynamicModules={dynamicModules}
                />
              </View>
            </TouchableWithoutFeedback>
          )}
          screenOptions={{
            drawerType: 'permanent',
            drawerStyle: {
              width: isDrawerOpen ? 250 : 70,
            },
            header: () => <Header />,
          }}>
          <Drawer.Screen name="ManageList" component={ManageList} />
          <Drawer.Screen name="ManageAss" component={ManageAss} />
          <Drawer.Screen name="SignupScreen" component={SignupScreen} />
          <Drawer.Screen name="ManageUsers" component={ManageUsers} />
          <Drawer.Screen name="LoginScreen" component={LoginScreen} />
          <Drawer.Screen name="DepartmentList" component={DepartmentList} />
          <Drawer.Screen name="RoleMaster" component={RoleMaster} />
          <Drawer.Screen name="Excel" component={Excel} /> 
          <Drawer.Screen name="WelcomeScreen" component={WelcomeScreen} />
          <Drawer.Screen name="ADIntegration" component={ADIntegration} />
          <Drawer.Screen name="IntegrationList" component={IntegrationList} />
          <Drawer.Screen name="Adminpanel" component={Adminpanel} />
          <Drawer.Screen name="Adcomponent" component={Adcomponent} />
          <Drawer.Screen name="AdminDboard" component={AdminDboard} />
          <Drawer.Screen name="Roadmap" component={Roadmap} />
          <Drawer.Screen name="RoadmapOverview" component={RoadmapOverview} />
          <Drawer.Screen name="Resources" component={Resources} />
          <Drawer.Screen name="IntakeList" component={IntakeList} />
          {/* <Drawer.Screen name="AdminDashboard" component={AdminDashBoard} /> */}
          <Drawer.Screen name="ManageGoals" component={ManageGoals} />
          <Drawer.Screen name="ManagePrograms" component={ManagePrograms} />
          <Drawer.Screen name="BinaryTree" component={BinaryTree} />
        
          {dynamicModules.map((module) => (
            <Drawer.Screen
              key={module.module_id}
              name={module.module_name}
              component={() => (
                <View style={styles.dynamicScreen}>
                  <Text>{module.module_name}</Text>
                </View>
              )}
              options={{
                title: module.module_name,
              }}
            />
          ))}
        </Drawer.Navigator>

        <FooterForge />
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  drawerContent: {
    flex: 1,
    paddingTop: 20,
  },
  drawerSection: {
    marginBottom: 10,
  },
  drawerItem: {
    flexDirection: 'row',
    padding: 20,
    paddingVertical: 5,
    alignItems: 'center',
  },
  drawerSubItem: {
    paddingLeft: 40, // Indent submodule items
    flexDirection: 'row',
    paddingVertical: 5,
    alignItems: 'center',
  },
  drawerItemText: {
    marginLeft: 50,
    fontSize: 13,
  },
  drawerSubItemText: {
    fontSize: 13,
  },
  drawerSectionTitle: {
    paddingTop: -1,
    marginLeft: 10,
    fontSize: 14,
    fontWeight: 'bold',
  },
  drawerImage: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
});

export default MainDrawer;
