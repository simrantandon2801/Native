import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, Text, ScrollView, Modal, TouchableOpacity } from 'react-native';
import { TextInput, PaperProvider, Button, ActivityIndicator, IconButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { Dimensions } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Menu } from 'react-native-paper'; // Using Menu from react-native-paper instead of Dropdown
import {Picker} from '@react-native-picker/picker';
import {AddADForCustomer, GetADList} from '../../database/Integration';
//import Toast from 'react-native-toast-message';

export type HomeStackNavigatorParamList = {
  LoginScreen: {};
  WelcomeScreen: {};
  SignupScreen: {};
  Managefunctions: {};
};

type NavigationProp = NativeStackNavigationProp<HomeStackNavigatorParamList, 'LoginScreen'>;

const ADIntegration = ({ onClose }) => {
  const deviceWidth = Dimensions.get('window').width;
  const navigation = useNavigation<NavigationProp>();
  const [modalVisible, setModalVisible] = useState(false);
  const [integrationName, setIntegrationName] = useState('');
  const [ad, setAd] = useState([]);
  const [integrationId, setIntegrationId] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [clientId, setClientId] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [tenantId, setTenantId] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedAD, setSelectedAD] = useState<number | undefined>(
    undefined,
  );

  const handleSave = async () => {

    const payload = {
      integration_customer_id: '',
      integration_id:selectedAD,
      customer_id: '',
      client_id: clientId,
      client_secret: clientSecret,
      tenant_id: tenantId,
      created_by: '',
      description: integrationName
    };
    try {
    const response = await AddADForCustomer(payload);
      const parsedRes = JSON.parse(response);
      if (parsedRes.status === 'success'){
        console.log('AD Added succesfully');
      onClose();
      }
      else
        console.error(
          'Failed',
          parsedRes.message || 'Unknown error',
        );
    } catch (err) {
      console.log('Error Fetching Users', err);
    }
    console.log('Payload being sent:', JSON.stringify(payload));
    setIsLoading(true);
   
  };
  const fetchADList = async () => {
    try {
        console.log('hi')
      const response = await GetADList();
      const parsedRes = JSON.parse(response);
      if (parsedRes.status === 'success') 
        setAd(parsedRes.data);
     // else
        // console.error(
        //   'Failed to fetch AD:',
        //   parsedRes.message || 'Unknown error',
        // );
    } catch (err) {
      console.log('Error Fetching Users', err);
    }
  };
  useEffect(() => {
    fetchADList();
    // Toast.show({
    //   type: 'success',
    //   text1: 'Hello',
    //   text2: 'This is some something 👋'
    // });
  }, []);
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
        {/* <Menu
          visible={!!ad}
          onDismiss={() => setAd('')}
          anchor={<Button onPress={() => setAd(ad === '' ? 'Microsoft' : '')}>{ad || 'Select AD'}</Button>}
        >
          {OPTIONS.map(option => (
            <Menu.Item key={option.value} onPress={() => setAd(option.value)} title={option.label} />
          ))}
        </Menu> */}
          
            <View style={styles.input}>
                    <Text style={styles.label}>*  AD Selection</Text>
                    <Picker
                      selectedValue={selectedAD}
                      onValueChange={itemValue =>
                        setSelectedAD(itemValue)
                        
                      }
                      style={styles.picker}>
                      <Picker.Item label="Select Provider" value="" />
                        {ad.map((item, index) => (
                          <Picker.Item
                            key={index}
                            label={item.integration_name}
                            value={item.integration_id}
                          />
                    ))}
          </Picker>
                  </View>
         <View style={{ display: selectedAD==1 ? 'flex' : 'none' }}>
          <TextInput
            style={styles.input}
            label={<Text style={{ color: '#044086' }}>Integration Name <Text style={{ color: 'red' }}>*</Text></Text>}
            value={integrationName}
            onChangeText={(text) => {
              setIntegrationName(text);
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
</View>

                  <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  gap: 14,
                }}>
                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={() => {
                    // Handle form submission logic here (e.g., save user details)
                    handleSave();
                  }}>
                  <Text style={styles.submitButtonText}>Submit</Text>
                </TouchableOpacity>

                {/* Close Button */}
                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={onClose}>
                  <Text style={styles.submitButtonText}>Close</Text>
                </TouchableOpacity>
              </View>

        </View>
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
  picker: {
    height: 50,
    borderBottomWidth: 1.5,
    borderBottomColor: '#044086',
    backgroundColor: 'transparent',
  },
  submitButton: {
    backgroundColor: '#044086',
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 15,
    marginRight: 10,
    paddingHorizontal: 16,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
  
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
   
  },
  
  modalContent: {
    width: '18%', 
    padding: 20,     
    backgroundColor: '#f4f4f4',
    margin:'70px',
    borderRadius: 10,
    alignItems: 'center',
    maxHeight: 160,  
    
  },
  modalContent1: {
    width: '28%', 
    padding: 20,     
    backgroundColor: '#fff',
    margin:'70px',
    borderRadius: 10,
    alignItems: 'center',
    maxHeight: 250,  
    
  },
  buttonContainer: {
    flexDirection: 'row',  // Align buttons in a row
    justifyContent: 'space-between',  // Space out the buttons evenly
    width: '80%',  // Ensure it takes up full width
  },
  loadingOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(255, 255, 255, 0.7)',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    },

});
