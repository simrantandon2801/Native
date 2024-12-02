/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {View, StyleSheet, SafeAreaView, Platform, Alert, Image, TouchableOpacity, ScrollView} from 'react-native';
import {TextInput, Button, Text} from 'react-native-paper';
//import NativeHeader from '../shared/NativeHeader';
//import Footer from '../home/Footer';
//import AsyncStorage from '@react-native-async-storage/async-storage';
import { PostAsync } from '../services/rest_api_service';
import { decodeBase64,encodeBase64 } from '../core/securedata';
import {useNavigation} from '@react-navigation/native';
import { AppImages } from '../assets';
import FooterForge from './FooterForge';
import AsyncStorage from '@react-native-async-storage/async-storage';
import WelcomeScreen from './WelcomeScreen';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type HomeStackNavigatorParamList = {
    LoginScreen: {};
    WelcomeScreen: {};
  };

  type NavigationProp = NativeStackNavigationProp<HomeStackNavigatorParamList, 'LoginScreen'>;

const LoginScreen: React.FC = () => {
  const [username, setUsername] = useState<string>('forgeppm');
  const [password, setPassword] = useState<string>('lsipl');
  const navigation = useNavigation<NavigationProp>();
  //   const handleLogin = () => {
  //     // Handle login logic here
  //     console.log('Email:', email);
  //     console.log('Password:', password);
  //   };
  /* const handleLogin = async () => {
    console.log('Email:', email);
    console.log('Password:', password);
    var uri = 'http://underbuiltapi.aadhidigital.com/auth/login';
    var payload = JSON.stringify({
      email: email,
      password: password,
    });

    var jsonResult = await PostAsync(uri, payload);
    console.log(jsonResult);

    if (jsonResult.status === 'success') {
      const status = jsonResult.status;
      const message = jsonResult.message;
      const accessToken = jsonResult.data?.accessToken;
      const userId = jsonResult.data?.user?.userId;
      const firstName = jsonResult.data?.user?.firstName;
      const lastName = jsonResult.data?.user?.lastName;
      const emailAddress = jsonResult.data?.user?.email;
      const phone = jsonResult.data?.user?.phone;
      const userRole = jsonResult.data?.user?.userrole;

      await AsyncStorage.setItem(
        'UserEmail',
        encodeBase64(email.toLowerCase()),
      );
      await AsyncStorage.setItem('Token', 'Bearer ' + accessToken);
      await AsyncStorage.setItem('ID', encodeBase64(userId));
      await AsyncStorage.setItem('UserType', encodeBase64(userRole));

      const UserType = decodeBase64(
        (await AsyncStorage.getItem('UserType')) ?? '',
      ); */
      //debugger;
      /* if (UserType === 'Admin') {
        navigation.navigate('ManageZonalRegulation' as never);
      } */
      //   if (UserType === 'Admin') {
      //     navigation.navigate('AdminActionNew' as never);
      //   }
      //   if (UserType === 'Staff_Admin') {
      //     navigation.navigate('StaffAdminActionNew' as never);
      //   }
      //   if (UserType === 'BE') {
      //     Alert.alert('Please install mobile app');
      //     //Alert.alert('');
      //     //navigation.navigate('AdminDashborad' as never);
      //   }
      //   if (UserType === 'EX') {
      //     //navigation.navigate('AdminDashborad' as never);
      //     Alert.alert('Please install mobile app');
      //   }
   /*  } else {
      Alert.alert('Incorrect, User Name/ Password');
    }
  }; */

  const handleLogin = () => {
    if (username === 'forgeppm' && password === 'lsipl') {
      navigation.navigate('WelcomeScreen', {}); 
    } else {
      Alert.alert('Invalid Credentials', 'Please check your username and password.');
    }
  };

  return (
   
    <View style={styles.screenContainer}>
      {/* Centered Container for Logo and Form */}
      <View style={styles.centeredContainer}>
        {/* Left Side: Logo Section */}
        <View style={styles.logoContainer}>
        <Image
        source={AppImages.forge} 
        style={styles.logo}
        resizeMode="contain"
      />
        </View>

        {/* Right Side: Login Form */}
        <View style={styles.formContainer}>
          <ScrollView contentContainerStyle={styles.formContent}
          showsVerticalScrollIndicator={false}>
            <Text style={styles.heading}>Log in to Forge PPM</Text>

            {/* Email Input */}
            <TextInput
              style={styles.input}
              placeholder="Email Address or Username"
              placeholderTextColor="#666"
              value={username}
              onChangeText={setUsername}
            />

            {/* Password Input */}
            <View style={styles.passwordContainer}>
              <TextInput
                style={[styles.input, styles.passwordInput]}
                placeholder="Password"
                placeholderTextColor="#666"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity style={styles.showPasswordButton}>
                <Text style={styles.showPasswordText}>👁</Text>
              </TouchableOpacity>
            </View>

            {/* CAPTCHA Placeholder */}
            <View style={styles.captchaContainer}>
              <Text>☑️ I'm not a robot</Text>
              <Image
                source={{ uri: 'https://via.placeholder.com/150x50.png?text=CAPTCHA' }} 
                style={styles.captchaImage}
              />
            </View>

            {/* Login Button */}
            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.loginButtonText}>Log in</Text>
              
            </TouchableOpacity>

            {/* Forgot Password */}
            <TouchableOpacity>
              <Text style={styles.forgotPasswordText}>Forgot your password?</Text>
            </TouchableOpacity>

            {/* Social Login Buttons */}
            <TouchableOpacity style={styles.socialButton}>
              <Image
                source={AppImages.google}  
                style={styles.socialIcon}
              />
              <Text style={styles.socialButtonText}>Continue with Google</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <Image
                source={AppImages.micro} 
                style={styles.socialIcon}
              />
              <Text style={styles.socialButtonText}>Continue with Microsoft</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <Image
                source={AppImages.apple} 
                style={styles.socialIcon}
              />
              <Text style={styles.socialButtonText}>Continue with Apple</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <Image
                source={AppImages.okta} 
                style={styles.socialIcon}
              />
              <Text style={styles.socialButtonText}>Continue with Okta</Text>
            </TouchableOpacity>

            {/* Register Link */}
            <Text style={styles.registerText}>
              Don’t have an account?{' '}
              <TouchableOpacity onPress={() => console.log('Navigate to registration')}>
          <Text style={styles.registerLink}>Register with us</Text>
        </TouchableOpacity>
            </Text>

            {/* Footer */}
            {/* <Text style={styles.footerText}>
              © 2024. All Rights Reserved |{' '}
              <Text style={styles.link}>Terms and Conditions</Text> |{' '}
              <Text style={styles.link}>Contact Us</Text>
            </Text> */}
          </ScrollView>
          
       
          
        </View>
      </View>
      <FooterForge />
    </View>
   
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
  },
  centeredContainer: {
    flexDirection: 'row',
    width: '90%', 
    height: '80%', 
    backgroundColor: '#fff',
    //shadowColor: '#000',
    //shadowOffset: { width: 0, height: 5 },
    //shadowOpacity: 0.2,
    //shadowRadius: 10,
    elevation: 5,
    borderRadius: 0,
  },
  logoContainer: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    padding: 20,
  },
  logo: {
    width: '100%',
    height: '80%',
  },
  formContainer: {
    flex: 1,
    padding: 30,
  },
  formContent: {
    alignItems: 'center',
  },
  heading: {
    fontFamily: 'Outfit',
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0330A6',
    marginBottom: 20,
  },
  input: {
    fontFamily: '"Source Sans Pro"',
    width: '100%',
    height: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 20,
    backgroundColor: '#fff', 
    paddingHorizontal: 10,
  },
  passwordContainer: {
    fontFamily: '"Source Sans Pro"',
    position: 'relative',
    width: '100%',
  },
  passwordInput: {
    fontFamily: '"Source Sans Pro"',
    paddingRight: 50,
  },
  showPasswordButton: {
    position: 'absolute',
    right: 10,
    top: 5,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  showPasswordText: {
    fontSize: 16,
    fontFamily: '"Source Sans Pro"',
    color: '#007BFF',
  },
  captchaContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  captchaImage: {
    width: 150,
    height: 50,
  },
  loginButton: {
    width: '100%',
    height: 40,
    backgroundColor: '#044086',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderRadius: 25,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: '"Source Sans Pro"',

    fontWeight: 'bold',
  },
  forgotPasswordText: {
    color: '#0056b3',
    fontFamily: '"Source Sans Pro"',

    marginBottom: 20,
    textDecorationLine: 'underline',
  },
  socialButton: {
    width: '100%',
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    justifyContent: 'center',
    borderRadius: 25,
  },
  socialIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  socialButtonText: {
    fontFamily: '"Source Sans Pro"',

    fontSize: 14,
    alignItems: 'center',
    borderRadius: 25,
    justifyContent: 'center',
  },
  registerText: {
    marginTop: 20,
    textAlign: 'center',
    fontFamily: '"Source Sans Pro"',
  },
  registerLink: {
    fontFamily: '"Source Sans Pro"',

    color: '#0056b3',
    fontWeight: 'bold',
  },
  footerText: {
    marginTop: 30,
    fontSize: 12,
    textAlign: 'center',
    color: '#666',
  },
  link: {
    fontFamily: '"Source Sans Pro"',

    color: '#0056b3',
    textDecorationLine: 'underline',
  },
});
export default LoginScreen;
