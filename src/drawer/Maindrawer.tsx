import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';

// Placeholder components for each screen
const InspectionAccepted = () => (
  <View style={styles.screenContainer}>
    <Text>Inspection Accepted</Text>
  </View>
);

const InspectionRejected = () => (
  <View style={styles.screenContainer}>
    <Text>Inspection Rejected </Text>
  </View>
);

const InspectionAcknowledgment = () => (
  <View style={styles.screenContainer}>
    <Text>Inspection Acknowledgment </Text>
  </View>
);

const Drawer = createDrawerNavigator();

const MainDrawer: React.FC = () => {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        initialRouteName="InspectionAccepted"
        screenOptions={{
          drawerStyle: {
            backgroundColor: '#f0f0f0',
            width: 240,
          },
          drawerLabelStyle: {
            color: '#333',
          },
          headerStyle: {
            backgroundColor: '#4a90e2',
          },
          headerTintColor: '#fff',
        }}
      >
        <Drawer.Screen 
          name="InspectionAccepted" 
          component={InspectionAccepted} 
          options={{ title: 'Inspection Accepted' }}
        />
        <Drawer.Screen 
          name="InspectionRejected" 
          component={InspectionRejected}
          options={{ title: 'Inspection Rejected' }}
        />
        <Drawer.Screen 
          name="InspectionAcknowledgment" 
          component={InspectionAcknowledgment}
          options={{ title: 'Inspection Acknowledgment' }}
        />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MainDrawer;

