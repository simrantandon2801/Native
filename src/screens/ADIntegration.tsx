import React, { useState } from 'react';
import { View, StyleSheet, Alert, Text, ScrollView, Modal } from 'react-native';
import { TextInput, PaperProvider, Button, ActivityIndicator } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { Dimensions } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Menu } from 'react-native-paper'; // Using Menu from react-native-paper instead of Dropdown

export type HomeStackNavigatorParamList = {
  LoginScreen: {};
  WelcomeScreen: {};
  SignupScreen: {};
  Managefunctions: {};
};

type NavigationProp = NativeStackNavigationProp<HomeStackNavigatorParamList, 'LoginScreen'>;

const ADIntegration = () => {
  const deviceWidth = Dimensions.get('window').width;
  const navigation = useNavigation<NavigationProp>();
  const [modalVisible, setModalVisible] = useState(false);

  const [ad, setAd] = useState('');
  const [name, setName] = useState('');
  const [clientId, setClientId] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [tenantId, setTenantId] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const OPTIONS = [
    { label: 'Microsoft', value: 'Microsoft' },
    { label: 'Okta', value: 'Okta' },
    { label: 'Other', value: 'Other' },
  ];

  const handleSignup = async () => {
    let tempErrors: { [key: string]: string } = {};

    // Validation checks
    if (!ad) tempErrors.ad = 'AD is required';
    if (!name) tempErrors.name = 'Integration Name is required';
    if (!clientId) tempErrors.clientId = 'Client ID is required';
    if (!clientSecret) tempErrors.clientSecret = 'Client Secret is required';
    if (!tenantId) tempErrors.tenantId = 'Tenant ID is required';

    setErrors(tempErrors);

    if (Object.keys(tempErrors).length > 0) return;

    const payload = {
      username: 'wjesswhdeeeedww',
      first_name: 'Jssoeeehnfjwwjdd',
      last_name: 'Doesdeeejfjwwdd',
      tech_admin_email: 'joewhsdn.doe1@example.com',
      company_name: 'TecweewsshCdorpdss',
      contact_email: 'tweeeewcsdhd1f@gmail.com',
      contact_phone: '8130233973',
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
      <ScrollView contentContainerStyle={styles.scrollViewContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.heading}>Configure AD</Text>
        <View style={{ margin: 16 }}>
          {/* Menu for AD selection */}
       {/*    <Menu
          visible={!!ad}
          onDismiss={() => setAd('')}
          anchor={<Button onPress={() => setAd(ad === '' ? 'Microsoft' : '')}>{ad || 'Select AD'}</Button>}
        >
          {OPTIONS.map(option => (
            <Menu.Item key={option.value} onPress={() => setAd(option.value)} title={option.label} />
          ))}
        </Menu> */}
        </View>

        <View style={[styles.paperContainer, { width: deviceWidth > 600 ? '30%' : '90%' }]}>
        <Menu
          visible={!!ad}
          onDismiss={() => setAd('')}
          anchor={<Button onPress={() => setAd(ad === '' ? 'Microsoft' : '')}>{ad || 'Select AD'}</Button>}
        >
          {OPTIONS.map(option => (
            <Menu.Item key={option.value} onPress={() => setAd(option.value)} title={option.label} />
          ))}
        </Menu>
          <TextInput
            style={styles.input}
            label={<Text style={{ color: '#044086' }}>Integration Name <Text style={{ color: 'red' }}>*</Text></Text>}
            value={name}
            onChangeText={(text) => {
              setName(text);
              setErrors({ ...errors, name: '' });
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
            label={<Text style={{ color: '#044086' }}>Client Id <Text style={{ color: 'red' }}>*</Text></Text>}
            value={clientId}
            onChangeText={(text) => {
              setClientId(text);
              setErrors({ ...errors, clientId: '' });
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
            label={<Text style={{ color: '#044086' }}>Client Secret <Text style={{ color: 'red' }}>*</Text></Text>}
            value={clientSecret}
            onChangeText={(text) => {
              setClientSecret(text);
              setErrors({ ...errors, clientSecret: '' });
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
            label={<Text style={{ color: '#044086' }}>Tenant Id <Text style={{ color: 'red' }}>*</Text></Text>}
            value={tenantId}
            onChangeText={(text) => {
              setTenantId(text);
              setErrors({ ...errors, tenantId: '' });
            }}
            underlineColor="#044086"
            theme={{
              colors: {
                primary: '#044086',
                text: '#044086',
              },
            }}
          />

          <Button
            mode="contained"
            onPress={handleSignup}
            style={[styles.button, { borderRadius: 25, backgroundColor: '#044086' }]}
            icon={isLoading ? undefined : 'arrow-right'}
            contentStyle={[styles.buttonContent, { flexDirection: 'row-reverse', alignItems: 'center' }]}
            disabled={isLoading}
          >
            {isLoading ? <ActivityIndicator size="small" color="#fff" /> : <Text style={{ color: '#fff', }}>Submit</Text>}
          </Button>
        </View>

        <Modal visible={modalVisible} transparent={true} animationType="fade" onRequestClose={() => setModalVisible(false)}>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'aliceblue' }}>
            <View style={{ backgroundColor: '#fff', padding: 40, borderRadius: 10 }}>
              <Text>User Registered Successfully!</Text>
              <Button
                onPress={() => {
                  setModalVisible(false);
                  navigation.navigate('LoginScreen', {});
                }}
              >
                OK
              </Button>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </PaperProvider>
  );
};

export default ADIntegration;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F7F7F7',
    padding: 20,
    
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 20,
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
