import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Header from '../header/header';
import ManageUsers from './ManageUsers';
import FooterForge from './FooterForge';
const WelcomeScreen = () => {
  return (
    <View>
      <Header/>
      <ManageUsers/>
      <FooterForge/>
    </View>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0', // Optional background color
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
});
