import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Linking, ImageBackground } from 'react-native';
import LinearGradient from 'react-native-linear-gradient'; // Install this package: npm install react-native-linear-gradient
import { useNavigation } from '@react-navigation/native';
import { getBackendToken } from '../database/Splashapi';
import DeviceInfo from 'react-native-device-info';

const SplashScreen = () => {
  const [buildNumber, setBuildNumber] = useState('');
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(true);  
  const [error, setError] = useState(''); 

  const fetchTokenAndNavigate = async () => {
    try {
      setIsLoading(true);
      setError('');

      const backendToken = await getBackendToken();
      console.log("Backend token received:", backendToken);

      setIsLoading(false);
      navigation.navigate('Login' as never);
    } catch (err) {
      console.error("Error fetching backend token:", err);
      setError("Failed to connect to server");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const initialize = async () => {
      try {
        const number = await DeviceInfo.getBuildNumber(); 
        setBuildNumber(number);
        console.log("Build Number: ", number);

        await fetchTokenAndNavigate();
      } catch (error) {
        console.error("Initialization error:", error);
        setError("Failed to initialize app");
        setIsLoading(false);
      }
    };

    initialize();
  }, []);

  return (
    // Option 1: Gradient Background (Uncomment this block if you want a gradient)
    // <LinearGradient
    //   colors={['#FFD700', '#32CD32']} // Yellow to Green gradient
    //   style={styles.container}
    //   start={{ x: 0, y: 0 }}
    //   end={{ x: 1, y: 1 }}
    // >
    //   <Text style={styles.appName}>BharatGap</Text>
      
    //   {isLoading ? (
    //     <ActivityIndicator size="large" color="#fff" style={styles.loader} />
    //   ) : error ? (
    //     <View style={styles.errorContainer}>
    //       <Text style={styles.errorText}>{error}</Text>
    //       <TouchableOpacity 
    //         style={styles.retryButton}
    //         onPress={fetchTokenAndNavigate}
    //       >
    //         <Text style={styles.retryButtonText}>Retry</Text>
    //       </TouchableOpacity>
    //       <Text style={styles.buildText}>Build Number: {buildNumber}</Text>
    //     </View>
    //   ) : null}
    // </LinearGradient>

   
    <ImageBackground
      source={require('../assets/img/Bharatgapsplash.png')} // Add your image path here
      style={styles.container}
      resizeMode="cover"
    >
      <Text style={styles.appName}>BharatGap</Text>
      
      {isLoading ? (
        <ActivityIndicator size="large" color="#fff" style={styles.loader} />
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={fetchTokenAndNavigate}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
          <Text style={styles.buildText}>Build Number: {buildNumber}</Text>
        </View>
      ) : null}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  appName: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  loader: {
    marginTop: 20,
  },
  errorContainer: {
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#fff',
    marginBottom: 15,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  retryButtonText: {
    color: '#32CD32',
    fontWeight: 'bold',
  },
  buildText: {
    fontSize: 12,
    color: '#fff',
    marginTop: 5,
  },
});

export default SplashScreen;