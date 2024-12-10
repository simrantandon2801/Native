import React, { useState } from 'react';
import { View, StyleSheet, Alert, Text, ScrollView ,Modal, } from 'react-native';

import { TextInput, PaperProvider } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { Dimensions } from 'react-native';
import { Button,ActivityIndicator } from 'react-native-paper';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

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
  const [companyEmail, setCompanyEmail] = useState<string>('');
  const [companyContact, setCompanyContact] = useState<string>('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);

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
    if (!companyContact || !/^\d{10}$/.test(companyContact)) {
      tempErrors.companyContact = 'Valid 10-digit contact is required';
    }

    setErrors(tempErrors);

    
    if (Object.keys(tempErrors).length > 0) return;

    
    const payload = {
      username: "wjesswhdeeeedww",
      first_name: "Jssoeeehnfjwwjdd",
      last_name: "Doesdeeejfjwwdd",
      tech_admin_email: "joewhsdn.doe1@example.com",
      company_name: "TecweewsshCdorpdss",
      contact_email: "tweeeewcsdhd1f@gmail.com",
      contact_phone: "8130233973",
      role_id: 3,
    };
    
    console.log('Payload being sent:', JSON.stringify(payload)); 
    setIsLoading(true);
    
    async function registerUser() {
      try {
        const response = await fetch('https://underbuiltapi.aadhidigital.com/auth/Register', {
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
          console.log('User registered successfully.');
          setModalVisible(true);  
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

  return (
    <PaperProvider>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.heading}>Customer Registration</Text>

        <View style={[styles.paperContainer, { width: deviceWidth > 600 ? '30%' : '90%' }]}>
          <TextInput
            style={styles.input}
            label={<Text style={{ color: '#044086' }}>First Name <Text style={{ color: 'red' }}>*</Text></Text>}
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
              },
            }}
          />

          <TextInput
            style={styles.input}
            label={<Text style={{ color: '#044086' }}>Last Name <Text style={{ color: 'red' }}>*</Text></Text>}
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

          <TextInput
            style={styles.input}
            label={<Text style={{ color: '#044086' }}>Tech Admin Email <Text style={{ color: 'red' }}>*</Text></Text>}
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

          <TextInput
            style={styles.input}
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

          <TextInput
            style={styles.input}
            label={<Text style={{ color: '#044086' }}>Company Email ID <Text style={{ color: 'red' }}>*</Text></Text>}
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

          <TextInput
            style={styles.input}
            label={<Text style={{ color: '#044086' }}>Company Contact Number <Text style={{ color: 'red' }}>*</Text></Text>}
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

<View>


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
    <Text style={{ color: '#fff' }}>
      Register
    </Text>
  )}
</Button>




      
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor:'aliceblue' }}>
          <View style={{ backgroundColor: '#fff', padding: 40, borderRadius: 10 }}>
            <Text>User Registered Successfully!</Text>
            <Button onPress={() => {
  setModalVisible(false);
  navigation.navigate('LoginScreen', {}); 
}}>
  OK
</Button>


          </View>
        </View>
      </Modal>
    </View>

        </View>
      </ScrollView>
    </PaperProvider>
  );
};

export default SignupScreen;

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
});