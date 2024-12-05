
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, Keyboard, Image, LogBox } from 'react-native';
import { createDrawerNavigator, DrawerNavigationProp } from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/Ionicons';
import LoginScreen from '../screens/LoginScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import ManageList from '../screens/ManageList';
import ManageAss from '../screens/ManageAss';
import { AppImages } from '../assets';

const Drawer = createDrawerNavigator();
LogBox.ignoreLogs([
  "export 'FooterComponent' (imported as 'FooterComponent') was not found in './ScreenFooter'"
]);

type DrawerProp = DrawerNavigationProp<any>;

const AccountSection: React.FC<{ 
  navigation: DrawerProp; 
  isDrawerOpen: boolean; 
  handleItemPress: (screen: string) => void;
}> = ({ navigation, isDrawerOpen, handleItemPress }) => {
  return (
    <View style={styles.drawerSection}>
     {/* Image with onPress to open drawer */}
     <TouchableOpacity onPress={() => handleItemPress('Account')} style={styles.drawerItem}>
        <Image 
          source={AppImages.forge11} 
          style={styles.drawerImage}
        />
      </TouchableOpacity>
    {/* Account Heading with Icon */}
    <TouchableOpacity onPress={() => handleItemPress('Account')} style={styles.drawerItem}>
      <Icon name="person-outline" size={24} color="black" />
      {isDrawerOpen && <Text style={styles.drawerSectionTitle}>Account</Text>} 
    </TouchableOpacity>
    
    {/* Submenu Items under Account */}
    {isDrawerOpen && (
      <>
        <TouchableOpacity style={styles.drawerItem} onPress={() => handleItemPress('LoginScreen')}>
          <Text style={styles.drawerItemText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.drawerItem} onPress={() => handleItemPress('SignUp')}>
          <Text style={styles.drawerItemText}>Sign Up</Text>
        </TouchableOpacity>
      </>
    )}

    {/* Manage List Heading with Icon */}

    <TouchableOpacity onPress={() => handleItemPress('Account')} style={styles.drawerItem}>
      <Icon name="list-outline" size={24} color="black" />
      {isDrawerOpen && <Text style={styles.drawerSectionTitle}>Manage Modules</Text>} 
    </TouchableOpacity>
   

    {/* Submenu Items under Manage List */}
    {isDrawerOpen && (
      <>
       <TouchableOpacity style={styles.drawerItem} onPress={() => handleItemPress('ManageList')}>
       <Text style={styles.drawerItemText}>Manage List</Text>
     </TouchableOpacity>
      
      <TouchableOpacity style={styles.drawerItem} onPress={() => handleItemPress('ManageAss')}>
        <Text style={styles.drawerItemText}>Module Assignment</Text>
      </TouchableOpacity>
      </>
    )}

<TouchableOpacity onPress={() => handleItemPress('Account')} style={styles.drawerItem}>
      <Icon name="person-outline" size={24} color="black" />
      {isDrawerOpen && <Text style={styles.drawerSectionTitle}>Users</Text>} 
    </TouchableOpacity>
    {isDrawerOpen && (
      <>
        <TouchableOpacity style={styles.drawerItem} onPress={() => handleItemPress('WelcomeScreen')}>
          <Text style={styles.drawerItemText}>Manage Users</Text>
        </TouchableOpacity>

       
      </>
    )}
  </View>
);
};

const MainDrawer: React.FC = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const handleItemPress = (screen: string, navigation: DrawerProp) => {
    if (!isDrawerOpen) {
      setIsDrawerOpen(true); 
      setTimeout(() => {
        navigation.navigate(screen);
      }, 200); 
    } else {
      navigation.navigate(screen); 
    }
  };

  const handleOutsidePress = () => {
    if (isDrawerOpen) {
      setIsDrawerOpen(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={handleOutsidePress}>
      <View style={styles.container}>
        <Drawer.Navigator
          drawerContent={(props) => (
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
              <View style={styles.drawerContent}>
                <AccountSection
                  navigation={props.navigation as DrawerProp}
                  isDrawerOpen={isDrawerOpen}
                  handleItemPress={(screen) => handleItemPress(screen, props.navigation as DrawerProp)}
                />
              </View>
            </TouchableWithoutFeedback>
          )}
          screenOptions={{
            drawerType: 'permanent',
            drawerStyle: {
              width: isDrawerOpen ? 250 : 70, 
            },
            headerShown: false,
          }}
        >
          <Drawer.Screen name="WelcomeScreen" component={WelcomeScreen} />
          <Drawer.Screen name="LoginScreen" component={LoginScreen} />
          <Drawer.Screen name="ManageList" component={ManageList} />
          <Drawer.Screen name="ManageAss" component={ManageAss} />
        </Drawer.Navigator>
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
    marginBottom: 15,
    
  },
  drawerItem: {
    flexDirection: 'row',
    padding: 20,
    alignItems: 'center',
  },
  drawerItemText: {
    marginLeft: 10,
    fontSize: 16,
  },
  drawerSectionTitle: {
    marginLeft: 10,
    fontSize: 18,
    fontWeight: 'bold',
  },
  drawerImage: {
    width: 30,   
    height: 30, 
    marginRight: 10, 
 
  },
});

export default MainDrawer;
