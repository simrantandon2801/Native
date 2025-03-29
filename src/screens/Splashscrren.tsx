import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity , Linking} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getBackendToken } from '../database/Splashapi';
import DeviceInfo from 'react-native-device-info';

const SplashScreen = () => {
  const [buildNumber, setBuildNumber] = useState('');
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(true);  
  const [error, setError] = useState(''); 
  const [updateRequired, setUpdateRequired] = useState(false);
  const [serverVersionName, setServerVersionName] = useState('');

  // const fetchTokenAndNavigate = async () => {
  //   try {
  //     setIsLoading(true);
  //     setError('');
  //     setUpdateRequired(false);
  
  //     const backendToken = await getBackendToken();
  //     console.log("Backend token received:", backendToken);
      
    
  //     if (backendToken && backendToken.fcVersionCode) {
        
  //       const deviceBuildNumber = buildNumber;
        
     
  //       if (parseInt(backendToken.fcVersionCode) > parseInt(deviceBuildNumber)) {
         
  //         setServerVersionName(backendToken.fcVersionName || 'newer version');
  //         setUpdateRequired(true);
  //         setIsLoading(false);
  //         return;
  //       }
        
     
  //       setIsLoading(false);
  //       navigation.navigate('Login' as never);
  //     } else {
       
  //       setError("Invalid response from server");
  //       setIsLoading(false);
  //     }
  //   } catch (err) {
  //     console.error("Error fetching backend token:", err);
  //     setError("Failed to connect to server");
  //     setIsLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   const initialize = async () => {
  //     try {
 
  //       const number = await DeviceInfo.getBuildNumber(); 
  //       setBuildNumber(number);
  //       console.log("Build Number: ", number);
  
  //       await fetchTokenAndNavigate();
  //     } catch (error) {
  //       console.error("Initialization error:", error);
  //       setError("Failed to initialize app");
  //       setIsLoading(false);
  //     }
  //   };

  //   initialize();
  // }, []);
  // const openAppStore = () => {
  //   // Replace with your app's store URL
  //   // For Android:
  //   Linking.openURL('market://details?id=com.yourapppackage');
  //   // For iOS:
  //   // Linking.openURL('itms-apps://itunes.apple.com/app/id123456789');
  // };

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
    <View style={styles.container}>
      <Text style={styles.appName}>BharatGap</Text>
      
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
          </TouchableOpacity>
          <Text style={styles.buildText}>Build Number: {buildNumber}</Text>
        </View>
      ) : null}
    </View>
  //   <View style={styles.container}>
  //   <Text style={styles.appName}>Bharatgap</Text>
    
  //   {isLoading ? (
  //     <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
  //   ) : updateRequired ? (
  //     <View style={styles.errorContainer}>
  //       <Text style={styles.errorText}>
  //         A new version ({serverVersionName}) of the app is available. Please update.
  //       </Text>
  //       {/* <TouchableOpacity 
  //         style={styles.updateButton}
  //         onPress={openAppStore}
  //       >
  //         <Text style={styles.updateButtonText}>Update Now</Text>
  //       </TouchableOpacity> */}
  //       <Text style={styles.buildText}>Current Build: {buildNumber}</Text>
  //     </View>
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
  // </View>
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
    marginBottom: 15,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  buildText: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  updateButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  updateButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },

});

export default SplashScreen;