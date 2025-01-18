import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Image,
  Text,
  ImageBackground,
  SafeAreaView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Eye, EyeOff, Navigation } from 'lucide-react-native';
import { loginStyles } from '../assets/styles/loginstyle';
import { colors } from '../assets/styles/colors';
import { loginUser } from '../database/Loginapi';
import { useNavigation } from '@react-navigation/native';
// import { StackNavigationProp } from '@react-navigation/stack';



export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  // const navigation = useNavigation<StackNavigationProp<any>>();


  const handleLogin = async () => {
    setError('');
    
    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }
  
    setIsLoading(true);
    try {
      await loginUser(username, password);
      console.log('Login successful');
      // navigation.navigate('Dashboard')
   
    } catch (error) {
      console.error('Login error:', error);
      setError('Invalid username or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={loginStyles.container}>
      <ImageBackground
        source={require('../assets/img/bg.png')}
        style={loginStyles.backgroundImage}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={loginStyles.keyboardAvoidingView}
        >
          <View style={loginStyles.overlay}>
            <View style={loginStyles.content}>
              <Image
                source={require('../assets/img/splash.png')}
                style={loginStyles.logo}
              />
              
              <View style={loginStyles.inputContainer}>
                <Text style={loginStyles.inputLabel}>Username</Text>
                <TextInput
                  style={loginStyles.input}
                  placeholder="Enter Username"
                  placeholderTextColor={colors.gray[400]}
                  value={username}
                  onChangeText={setUsername}
                  editable={!isLoading}
                />
              </View>

              <View style={loginStyles.inputContainer}>
                <Text style={loginStyles.inputLabel}>Password</Text>
                <TextInput
                  style={loginStyles.input}
                  placeholder="Enter Password"
                  placeholderTextColor={colors.gray[400]}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  editable={!isLoading}
                />
                <TouchableOpacity
                  style={loginStyles.eyeIcon}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <Eye size={24} color={colors.gray[400]} />
                  ) : (
                    <EyeOff size={24} color={colors.gray[400]} />
                  )}
                </TouchableOpacity>
              </View>

              {error ? <Text style={loginStyles.errorText}>{error}</Text> : null}

              <TouchableOpacity
                style={loginStyles.loginButton}
                onPress={handleLogin}
                disabled={isLoading}
              >
                {isLoading ? (
                  <View style={loginStyles.loadingContainer}>
                    <ActivityIndicator color={colors.white} />
                  </View>
                ) : (
                  <Text style={loginStyles.loginButtonText}>Login</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </ImageBackground>
    </SafeAreaView>
  );
}

