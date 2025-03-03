import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity,  } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getBackendToken } from '../database/Splashapi';
import DeviceInfo from 'react-native-device-info';

const SplashScreen = () => {
  const [buildNumber, setBuildNumber] = useState('');
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(true);  
  const [error, setError] = useState(''); 

  useEffect(() => {
    const fetchBuildNumber = async () => {
      const number = await DeviceInfo.getBuildNumber(); 
      setBuildNumber(number);
      console.log("Build Number: ", number);
    };

    fetchBuildNumber();
  }, []);
  const fetchTokenAndNavigate = async () => {
    try {
      setIsLoading(true);
      setError('');
  
    
      const backendToken = await getBackendToken();
      console.log("Backend token received:", backendToken);
  
      setIsLoading(false);
      console.log("Success:", backendToken);
  
      navigation.navigate('Login' as never);
    } catch (err) {
      console.error("Error fetching backend token:", err);
      setError("Failed to connect to server");
      setIsLoading(false);
    }
  };
  

  useEffect(() => {
    fetchTokenAndNavigate();
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.appName}>Bharatgap</Text>
      
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={fetchTokenAndNavigate}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
            <Text>Build Number: {buildNumber}</Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  appName: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 20,
  },
  loader: {
    marginTop: 20,
  },
  errorContainer: {
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: 'red',
    marginBottom: 15,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#0066cc',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: 'bold',
  }
});

export default SplashScreen;
