import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/Ionicons'; 
import LoginScreen from '../screens/LoginScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import { useNavigation } from '@react-navigation/native'; 
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type HomeStackNavigatorParamList = {
  LoginScreen: {};
  WelcomeScreen: {};
  Main: {};
};

type NavigationProp = NativeStackNavigationProp<HomeStackNavigatorParamList>;

const Drawer = createDrawerNavigator();

const AccountSection: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  return (
    <View style={styles.drawerSection}>
      {/* Account Icon and Title */}
      <TouchableOpacity onPress={() => {}} style={styles.drawerItem}>
        <Icon name="person-outline" size={24} color="black" />
        <Text style={styles.drawerItemText}>Account</Text>
      </TouchableOpacity>

      {/* Options for Account */}
      <TouchableOpacity 
        style={styles.drawerItem}
        onPress={() => navigation.navigate('LoginScreen', {})} 
      >
        <Text style={styles.drawerItemText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.drawerItem}>
        <Text style={styles.drawerItemText}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

const MainDrawer: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  
  return (
    <Drawer.Navigator
      drawerContent={(props) => (
        <View style={styles.drawerContent}>
          <AccountSection />
          <View style={styles.drawerSection}>
            <TouchableOpacity style={styles.drawerItem}>
              <Icon name="home-outline" size={24} color="black" />
              <Text style={styles.drawerItemText}>Welcome</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.drawerItem}
              onPress={() => navigation.navigate('WelcomeScreen', {})} 
            >
              <Text style={styles.drawerItemText}>Welcome Screen</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      screenOptions={{
        drawerType: 'slide', 
        overlayColor: 'transparent', 
        drawerPosition: 'left',
        drawerStyle: {
          width: 250, 
        },
      }}
      initialRouteName="WelcomeScreen"
    >
      <Drawer.Screen name="WelcomeScreen" component={WelcomeScreen} />
      <Drawer.Screen name="LoginScreen" component={LoginScreen} />
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
    paddingTop: 20,
  },
  drawerSection: {
    marginBottom: 15,
  },
  drawerItem: {
    flexDirection: 'row',
    padding: 15,
    alignItems: 'center',
  },
  drawerItemText: {
    marginLeft: 10,
    fontSize: 16,
  },
});

export default MainDrawer;