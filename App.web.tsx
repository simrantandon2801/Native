/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {Suspense} from 'react';
import {View, Image, Text, StyleSheet, useColorScheme} from 'react-native';
import {PaperProvider} from 'react-native-paper';
import {NavigationContainer} from '@react-navigation/native';
import Header from './src/header/header.tsx'
import ManageUsers from './src/screens/ManageUsers.tsx';
const App = () => {
  const scheme = useColorScheme();

  return (
    <Suspense
      fallback={
        <View style={styles.loaderContainer}>
          <View style={styles.overlay} />
          <Image
            source={{
              uri: 'https://img.freepik.com/free-vector/colorful-bird-illustration-gradient_343694-1741.jpg',
            }} // Placeholder image
            style={styles.iconImage}
            resizeMode="cover"
          />
        </View>
      }>
      <PaperProvider theme={scheme === 'dark' ? {} : {}}>
        <NavigationContainer>
          <Header/>
          <ManageUsers/>
        </NavigationContainer>
      </PaperProvider>
    </Suspense>
  );
};

const styles = StyleSheet.create({
  loaderContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    zIndex: 1,
  },
  iconImage: {
    width: 100,
    height: 100,
    zIndex: 2,
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 16,
  },
});

export default App;
