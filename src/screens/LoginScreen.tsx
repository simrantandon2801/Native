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
import ReCaptchaV3 from 'react-native-recaptcha-v3';
import { navigate } from '../navigations/RootNavigation';
import SignupScreen from './SignupScreen';
export type HomeStackNavigatorParamList = {
    LoginScreen: {};
    WelcomeScreen: {};
    Main:undefined;
    SignupScreen:{}
  };

  type NavigationProp = NativeStackNavigationProp<HomeStackNavigatorParamList, 'LoginScreen'>;

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState<string>('customeradmin@forgeportfolioxpert.com');
  const [password, setPassword] = useState<string>('lsipl');
  const navigation = useNavigation<NavigationProp>();
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);  //captcha
  /*  const handleLogin = () => {
     Handle login logic here
      console.log('Email:', email);
      console.log('Password:', password);
    }; */


    const recaptchaSiteKey = '6LdZ3ZQqAAAAAO4wf3jkq1Q_PXV49IwSwYb4ziq4'; 
    const handleLogin = async () => {
  /*     if (!isCaptchaVerified) {
        Alert.alert('Please complete the CAPTCHA');
        return;
      }else{ */
        //console.log('Email:', email);
        //console.log('Password:', password);
        const uri = 'https://underbuiltapi.aadhidigital.com/auth/login';
        const payload = JSON.stringify({
          email: email,
          password: password,
        });
      
        try {
          const jsonResult = await PostAsync(uri, payload);
        
      
          if (jsonResult.status === 'success') {
            const { accessToken, user } = jsonResult.data;
            const { userId, userrole } = user;
      
            //setIsLoggedIn(true);
            await AsyncStorage.setItem('UserEmail', encodeBase64(email?.toLowerCase() || ''));
            await AsyncStorage.setItem('ID', encodeBase64(userId?.toString() || ''));
            await AsyncStorage.setItem('Token', 'Bearer ' + accessToken);
            //await AsyncStorage.setItem('ID', encodeBase64(userId));
            await AsyncStorage.setItem('UserType', encodeBase64(userrole.toString()));
      
           
            const UserType = decodeBase64((await AsyncStorage.getItem('UserType')) ?? '');
            
            console.log('Decoded UserType:', UserType); 
      
           
            if (UserType === '3' || userrole === 3) {
              console.log('Decoded UserType:', UserType);
              console.log('Navigating to Main screen');
              navigation.replace('Main');
            } 
            if (UserType === '1' || userrole === 1) {
              console.log('Decoded UserType:', UserType);
              console.log('Navigating to Main screen');
              navigation.replace('Main');
            } 
            if (UserType === '2' || userrole === 2) {
              console.log('Decoded UserType:', UserType); 
              console.log('Navigating to Main screen');
              navigation.replace('Main');
            } else {
              Alert.alert('Access denied', 'You do not have the required permissions.');
            }
          } else {
            Alert.alert('Incorrect, User Name/ Password');
          }
        } catch (error) {
          console.error('Error logging in:', error);
          Alert.alert('An error occurred. Please try again later.');
        }/* } */
      };
 /*  const handleLogin = () => {
    if (username === 'forgeppm' && password === 'lsipl') {
      //navigation.navigate('WelcomeScreen', {}); 
      navigation.replace('Main');
    } else {
      Alert.alert('Invalid Credentials', 'Please check your username and password.');
    }
  }; */

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
            <Text style={styles.heading}>Log in to ForgePortfolioXpert</Text>

            {/* Email Input */}
            <TextInput
              style={styles.input}
              placeholder="Email Address or Username"
              placeholderTextColor="#666"
              value={email}
              onChangeText={setEmail}
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
         {/*    <ReCaptchaV3 style={styles.captchaContainer}
        siteKey={recaptchaSiteKey}
        baseUrl="https://yourwebsite.com"
        onVerify={(token:string) => {
          console.log('reCAPTCHA Verified, Token:', token);
          setIsCaptchaVerified(true); 
        }}
        onError={(error:string) => {
          console.log('reCAPTCHA Error:', error);
        }}
      /> */}

            {/* CAPTCHA Placeholder */}
            {/* <View style={styles.captchaContainer}>
              <Text>☑️ I'm not a robot</Text>
              <Image
                source={{ uri: 'https://via.placeholder.com/150x50.png?text=CAPTCHA' }} 
                style={styles.captchaImage}
              />
            </View> */}

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
