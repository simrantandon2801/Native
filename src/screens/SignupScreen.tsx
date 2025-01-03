import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, Text, ScrollView, Modal, TouchableOpacity } from 'react-native';
import { TextInput, PaperProvider } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { Dimensions } from 'react-native';
import { Button, ActivityIndicator } from 'react-native-paper';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BASE_URL } from '@env';

export type HomeStackNavigatorParamList = {
  LoginScreen: {};
  WelcomeScreen: {};
  SignupScreen: {};
  Managefunctions: {};
};

type NavigationProp = NativeStackNavigationProp<HomeStackNavigatorParamList, 'LoginScreen'>;

const SignupScreen = () => {
  const deviceWidth = Dimensions.get('window').width;
  const navigation = useNavigation<NavigationProp>();
  const [modalVisible, setModalVisible] = useState(false);
  const [FirstName, setFirstName] = useState<string>('');
  const [LastName, setLastName] = useState<string>('');
  const [techAdminEmail, setTechAdminEmail] = useState<string>('');
  const [companyName, setCompanyName] = useState<string>('');
  const [username, setUsername] = useState<string>(''); // New state for username
  const [password, setPassword] = useState<string>(''); 
  const [companyEmail, setCompanyEmail] = useState<string>('');
  const [companyContact, setCompanyContact] = useState<string>('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRegistered, setIsRegistered] = useState<boolean>(false);

  const handleSignup = async () => {
    let tempErrors: { [key: string]: string } = {};

    // Validation checks
    if (!FirstName) tempErrors.FirstName = 'First Name is required';
    if (!LastName) tempErrors.LastName = 'Last Name is required';
    if (!techAdminEmail || !/\S+@\S+\.\S+/.test(techAdminEmail)) {
      tempErrors.techAdminEmail = 'Valid email is required';
    }
    if (!companyName) tempErrors.companyName = 'Company Name is required';
    if (!companyEmail || !/\S+@\S+\.\S+/.test(companyEmail)) {
      tempErrors.companyEmail = 'Valid email is required';
    }
    // Regex for US phone number validation
    const phoneNumberRegex = /^(?:\+1[-.\s]?)?(\(\d{3}\)[-\s.]?|\d{3}[-.\s]?)\d{3}[-.\s]?\d{4}$/;
    if (!phoneNumberRegex.test(companyContact)) {
      tempErrors.companyContact = 'Valid contact number is required';
    }

    setErrors(tempErrors);

    if (Object.keys(tempErrors).length > 0) return;

    const payload = {
      username: techAdminEmail,
      contact_first_name: FirstName,
      contact_last_name: LastName,
      tech_admin_email: techAdminEmail,
      company_name: companyName,
      contact_email: companyEmail,
      contact_phone: companyContact,
      password:password,

      role_id: 3,
    };

    console.log('Payload being sent:', JSON.stringify(payload));
    setIsLoading(true);

    async function registerUser() {
      try {
        const response = await fetch(`${BASE_URL}/auth/Register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('API Response:', data);

        if (data.status === 'success') {
          console.log('Customer has been successfully registered.');
          setIsRegistered(true);
          //setModalVisible(true);
          // Toast.show({
          //   type: 'success',
          //   text1: 'Customer has been successfully registered.',
          // });
        } else {
          console.error('Error in registration:', data.message || 'Unknown error');
        }
      } catch (error) {
        console.error('Error occurred while registering the user:', error);
      } finally {
        setIsLoading(false);
      }
    }

    registerUser();

  };

  useEffect(() => {
    console.log('useeffect')
    }, []);

  return (
    <PaperProvider>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        
        <Text style={styles.heading}>Customer Registration</Text>

        <View style={[styles.paperContainer, { width: deviceWidth > 600 ? '50%' : '90%' }]}>
          <View style={styles.inputRow}>
            <View style={styles.inputWrapper}>
                  <TextInput
              style={[styles.input, { marginLeft: 10 }]}
              label={<Text style={{ color: '#044086' }}>Company Name <Text style={{ color: 'red' }}>*</Text></Text>}
              value={companyName}
              onChangeText={(text) => {
                setCompanyName(text);
                setErrors({ ...errors, companyName: '' });
              }}
              underlineColor="#044086"
              theme={{
                colors: {
                  primary: '#044086',
                  text: '#044086',
                },
              }}
            />
            {errors.companyName && <Text style={styles.errorText}>{errors.companyName}</Text>}
            </View>
            <View style={styles.inputWrapper}>
             <TextInput
              style={[styles.input, { marginRight: 10 }]}
              label={<Text style={{ color: '#044086' }}>Company Email<Text style={{ color: 'red' }}>*</Text></Text>}
              value={companyEmail}
              onChangeText={(text) => {
                setCompanyEmail(text);
                setErrors({ ...errors, companyEmail: '' });
              }}
              keyboardType="email-address"
              underlineColor="#044086"
              theme={{
                colors: {
                  primary: '#044086',
                  text: '#044086',
                },
              }}
            />
            {errors.companyEmail && <Text style={styles.errorText}>{errors.companyEmail}</Text>}

           </View>
          </View>
          <View style={styles.inputRow}>
          <View style={styles.inputWrapper}>
          <TextInput
              style={[styles.input, { marginLeft: 10 }]}
              label={<Text style={{ color: '#044086' }}>Company Contact Number </Text>}
              value={companyContact}
              onChangeText={(text) => {
                setCompanyContact(text);
                setErrors({ ...errors, companyContact: '' });
              }}
              keyboardType="phone-pad"
              underlineColor="#044086"
              theme={{
                colors: {
                  primary: '#044086',
                  text: '#044086',
                },
              }}
            />
             {errors.companyContact && <Text style={styles.errorText}>{errors.companyContact}</Text>}

            </View>
            <View style={styles.inputWrapper}>
            <TextInput
              style={[styles.input, { marginRight: 10 }]}
              label={<Text style={{ color: '#044086' }}>Admin Email <Text style={{ color: 'red' }}>*</Text></Text>}
              value={techAdminEmail}
              onChangeText={(text) => {
                setTechAdminEmail(text);
                setErrors({ ...errors, techAdminEmail: '' });
              }}
              keyboardType="email-address"
              underlineColor="#044086"
              theme={{
                colors: {
                  primary: '#044086',
                  text: '#044086',
                },
              }}
            />
             {errors.techAdminEmail && <Text style={styles.errorText}>{errors.techAdminEmail}</Text>}

           </View>
          </View>


          <View style={styles.inputRow}>
            <View style={styles.inputWrapper}>
          <TextInput
              style={[styles.input, { marginRight: 10 }]}
              label={<Text style={{ color: '#044086' }}>Admin First Name <Text style={{ color: 'red' }}>*</Text></Text>}
              value={FirstName}
              onChangeText={(text) => {
                setFirstName(text);
                setErrors({ ...errors, FirstName: '' });
              }}
              placeholderTextColor="#044086"
              underlineColor="#044086"
              theme={{
                colors: {
                  primary: '#044086',
                  text: '#044086',
                  placeholder: '#044086',
                  fontSize:'14px',
                },
              }}
            />
            {errors.FirstName && <Text style={styles.errorText}>{errors.FirstName}</Text>}

          </View>
          <View style={styles.inputWrapper}>
            <TextInput
              style={[styles.input, { marginLeft: 10 }]}
              label={<Text style={{ color: '#044086' }}>Admin Last Name <Text style={{ color: 'red' }}>*</Text></Text>}
              value={LastName}
              onChangeText={(text) => {
                setLastName(text);
                setErrors({ ...errors, LastName: '' });
              }}
              underlineColor="#044086"
              theme={{
                colors: {
                  primary: '#044086',
                  text: '#044086',
                },
              }}
            />
            {errors.LastName && <Text style={styles.errorText}>{errors.LastName}</Text>}

            </View>
          </View>

          {/* <View style={styles.inputRow}>
            <View style={styles.inputWrapper}>
          <TextInput
              style={[styles.input, { marginRight: 10 }]}
              label={<Text style={{ color: '#044086' }}>Username <Text style={{ color: 'red' }}>*</Text></Text>}
              value={techAdminEmail}
              underlineColor="#044086"
              theme={{
                colors: {
                  primary: '#044086',
                  text: '#044086',
                },
              }}
            />
</View>
<View style={styles.inputWrapper}>
            <TextInput
              style={[styles.input, { marginLeft: 10 }]}
              label={<Text style={{ color: '#044086' }}>Password <Text style={{ color: 'red' }}>*</Text></Text>}
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setErrors({ ...errors, password: '' });
              }}
              secureTextEntry
              underlineColor="#044086"
              theme={{
                colors: {
                  primary: '#044086',
                  text: '#044086',
                },
              }}
            />
          </View>
            
          </View> */}

          <Button
            mode="contained"
            onPress={handleSignup}
            style={[styles.button, { borderRadius: 25, backgroundColor: '#044086' }]}
            icon={isLoading ? undefined : 'arrow-right'}
            contentStyle={[styles.buttonContent, { flexDirection: 'row-reverse', alignItems: 'center' }]}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={{ color: '#fff' }}>Register</Text>
            )}
          </Button>

          {isRegistered && <Text style={styles.success}>Your customer has been successfully registered.</Text>}

          {/* <Modal
            visible={modalVisible}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'aliceblue' }}>
              <View style={{ backgroundColor: '#fff', padding: 40, borderRadius: 10 }}>
                <Text>User Registered Successfully!</Text>
                <Button
                  onPress={() => {
                    setModalVisible(false);
                    navigation.navigate('SignupScreen', {});
                  }}
                >
                  OK
                </Button>
              </View>
            </View>
          </Modal> */}
        </View>
      </ScrollView>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F7F7F7',
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#044086',
  },
  paperContainer: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#C4C4C4',
  },
  input: {
    marginBottom: 15,
    borderRadius: 5,
    backgroundColor: 'transparent',
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  button: {
    width: '46%',
    height: 40,
    marginTop: 20,
    backgroundColor: '#044086',
    alignSelf: 'center',
  },
  buttonContent: {
    flexDirection: 'row-reverse',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    gap: 20,
  },
  inputWrapper: {
    flex: 1,
    alignItems: 'left', // Centers the label above the input
  },
  success:{
    color: 'red',  
    justifyContent: 'center',  
    alignItems: 'center'
  }
  
});

export default SignupScreen;