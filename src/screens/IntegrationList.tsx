import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, Text, ScrollView, Modal, TouchableOpacity, CheckBox, TouchableWithoutFeedback, Dimensions} from 'react-native';
import { TextInput, PaperProvider, Button, ActivityIndicator, IconButton, Menu, DataTable } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {Picker} from '@react-native-picker/picker';
import {addADForCustomer, GetADIntegrationsForCustomer} from '../database/Integration';
import ADIntegration from './ADIntegration';
//import {StyleSheet,View,Text,TouchableOpacity,Modal,ScrollView,Pressable,Dimensions, Alert, TouchableWithoutFeedback} from 'react-native';

export type HomeStackNavigatorParamList = {
  LoginScreen: {};
  WelcomeScreen: {};
  SignupScreen: {};
  Managefunctions: {};
};

type NavigationProp = NativeStackNavigationProp<HomeStackNavigatorParamList, 'LoginScreen'>;

const IntegrationList = () => {
  const deviceWidth = Dimensions.get('window').width;
  const navigation = useNavigation<NavigationProp>();
  const [modalVisible, setModalVisible] = useState(false);

  const [adList, setAdList] = useState([]);
  const [integrationId, setIntegrationId] = useState('');
  const [customerId, setCustomerId] = useState('1');
  const [clientId, setClientId] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [tenantId, setTenantId] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedAD, setSelectedAD] = useState(null);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isMenuVisible, setMenuVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [actionsVisible, setActionsVisible] = useState(false);
  const [isAddRoleModalVisible, setAddRoleModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const OPTIONS = [
    { label: 'Microsoft', value: 'Microsoft' },
    { label: 'Okta', value: 'Okta' },
    { label: 'Other', value: 'Other' },
  ];
  const fetchData = async () => {
    try {
        
      const response = await GetADIntegrationsForCustomer(customerId);
      const parsedRes = JSON.parse(response);
      if (parsedRes.status === 'success') 
        setAdList(parsedRes.data);
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
    fetchData();
  }, []);
//   const handleSave = async () => {
//     // let tempErrors: { [key: string]: string } = {};
//     console.log('hi');

//     const payload = {
//       integration_customer_id: '',
//       integration_id:selectedAD,
//       customer_id: 1,
//       client_id: clientId,
//       client_secret: clientSecret,
//       tenant_id: tenantId,
//       created_by: '8'
//     };
//     try {
//     const response = await addADForCustomer(payload);
//       const parsedRes = JSON.parse(response);
//       if (parsedRes.status === 'success')
//         console.log('AD Added succesfully');
//       else
//         console.error(
//           'Failed',
//           parsedRes.message || 'Unknown error',
//         );
//     } catch (err) {
//       console.log('Error Fetching Users', err);
//     }
//     console.log('Payload being sent:', JSON.stringify(payload));
//     setIsLoading(true);


   
//   };
const closeModal = () => {
    // setRoleInput('');
    // setEditRoleIndex(null);
    setIsModalVisible(false);
  };

  return (
    <>
    
    <View style={styles.manageUsersContainer}>
      <Text style={styles.heading}>Manage Integrations</Text>
    </View>
    <View style={styles.actions}>
      <TouchableOpacity style={[styles.actionButton, styles.leftAction]}>
        <IconButton icon="trash-can-outline" size={16} />
        <Text style={[styles.actionText, { color: '#344054' }]}>Delete</Text>
      </TouchableOpacity>
      <View style={styles.middleActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => setIsModalVisible(true)}>
          <IconButton icon="plus" size={16} />
          <Text style={[styles.actionText, { color: '#044086' }]}>
            Add Intgeration
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <IconButton
            icon="table-column-plus-after"
            size={16}
          
          />
          {/* <Text style={[styles.actionText, { color: '#044086' }]}>
            Set Columns
          </Text> */}
        
        </TouchableOpacity>
       
      </View>
      <TouchableOpacity style={[styles.actionButton, styles.rightAction]}>
        <IconButton icon="filter" size={16}  />
        <Text style={[styles.actionText, { color: '#344054' }]}>Filters</Text>
      </TouchableOpacity>
    </View>
   
    <DataTable style={styles.tableHeaderCell}>
    
      <DataTable.Header>
      
        <DataTable.Title>S. No.</DataTable.Title>
        <DataTable.Title>Provider</DataTable.Title>
       {/*  <DataTable.Title>Assign module</DataTable.Title> */}
        <DataTable.Title>Action</DataTable.Title>
      </DataTable.Header>

      
      <ScrollView showsVerticalScrollIndicator={false}  style={{  maxHeight:'100%'}} >
      {adList.map((item, index) => (
        <DataTable.Row style={styles.table} key={item.integration_customer_id}>
         
          <DataTable.Cell>{index + 1}</DataTable.Cell>
          <DataTable.Cell>{item.integration_name}</DataTable.Cell>
      {/*     <DataTable.Cell>
          <TouchableOpacity onPress={() => setIsModalVisible(true)} style={styles.viewModulesContainer}>
                <IconButton  size={20} color="'#044086'" />
                <Text style={styles.viewModulesText}>View Modules</Text>
              </TouchableOpacity>
              </DataTable.Cell> */}
             <DataTable.Cell>
                <Menu
                  visible={isMenuVisible && selectedUser?.role_id === user.role_id}
                  onDismiss={() => setMenuVisible(false)}
                  anchor={
                    <TouchableOpacity onPress={() => {
                    //   setSelectedUser(user);
                    //   setRoleInput(user.role_name);
                    //   setIsRoleActive(user.is_active);
                    //   setMenuVisible(true);
                    }}>
                      <IconButton icon="dots-vertical" size={20} />
                    </TouchableOpacity>
                  }
                >
                  <Menu.Item onPress={() => {
                   // setIsEditModalVisible(true);
                    //setMenuVisible(false);
                  }} title="Edit" />
                  <Menu.Item 
                   // onPress={() => handleDeleteRole(user.role_id)} 
                    title="Delete" 
                  />
                  <Menu.Item onPress={() => {
                  //  setIsModalVisible(true);
                  //  setMenuVisible(false);
                  }} title="Assign Modules" />
                  <Menu.Item onPress={() => {
                  //  setIsEditPermissionModalVisible(true);
                   // setMenuVisible(false);
                  }} title="Edit Permission" />
                </Menu>
              </DataTable.Cell>
        </DataTable.Row>
      ))}
      </ScrollView>
    </DataTable>
    {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#044086" />
        </View>
      )}

<Modal 
        visible={isModalVisible} 
        transparent 
        animationType="fade"
        onRequestClose={() => {
          setIsModalVisible(false)
        }}
      >
         {/* <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.modalScrollContainer}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}> */}
        {/* <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add AD Integration</Text>
            
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>* Name</Text>
              <TextInput
                value={integration_name}  
                onChangeText={setRoleInput}  
                placeholder="Enter role"
                style={styles.input}
                mode="outlined"
                outlineColor="#ccc"
                activeOutlineColor="#044086"
              />
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                onPress={closeModal}
                style={[styles.modalButton, styles.cancelButton]}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSave}
                style={[styles.modalButton, styles.saveButton]}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View> */}
        <ADIntegration closeModal={closeModal}/>
        {/* </View>
        </View>
        </ScrollView> */}
      </Modal>

    </>


 );
};


export default IntegrationList;
const styles = StyleSheet.create({
    manageUsersContainer: {
      alignItems: 'center',
      paddingVertical: 10,
      backgroundColor: 'white',
      
      
    },
    actions: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 10,
      backgroundColor: '#f4f4f4',
    },
    actionButton: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    
    actionText: {
      marginLeft: 5,
      fontSize: 14,
    },
    leftAction: {
      marginLeft: 0,
    },
    middleActions: {
      flexDirection: 'row',
    },
    rightAction: {
      marginRight: 0,
    },
    tableHeaderCell: {
      marginTop: 15,
    },
    table: {
      marginRight: 20,
     
    },
    modalButton1:{
      padding:20,
      marginTop:'-10px',
      width:'30%'
  
    },
    modalScrollContainer: {
      
      justifyContent: 'center',
      backgroundColor: 'rgba(0,0,0,0.6)',
      flex: 1,
    },modalButtons: {
      flexDirection: 'row',
      
      marginTop: 20,
    },
    saveButton: {
      backgroundColor: '#044086',
      flex: 1, 
      marginRight: 10,
    },
    cancelButton: {
      backgroundColor: '#044086',
     
      flex: 1,
    },
    modalContainer: {
      backgroundColor: 'white',
      marginHorizontal: 15,
      padding: 20,
      borderRadius: 10,
      width:'40%'
     
    },
    modalHeader: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
      color: '#333',
    },
    dropdownContainer: {
      marginBottom: 20,
    },
    dropdownLabel: {
      fontSize: 14,
      fontWeight: '600',
      color: '#333',
    },
    dropdown: {
      backgroundColor: '#f4f4f4',
      padding: 10,
      borderRadius: 5,
    },
    dropdownText: {
      fontSize: 14,
    },
    expandableContainer: {
      marginBottom: 20,
    },
    expandableHeader: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#333',
      marginBottom: 5,
    },
    checkboxRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    subItems: {
      marginLeft: 20,
    },
    subSubItems: {
      marginLeft: 40,
    },
    buttonRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    editButton: {
      backgroundColor: '#044086',
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 5,
    },
    editButtonText: {
      color: 'white',
      fontWeight: 'bold',
    },
    closeButton: {
      backgroundColor: '#ccc',
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 5,
    },
    closeButtonText: {
      color: '#333',
      fontWeight: 'bold',
    },
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    roleItem: {
      padding: 10,
      marginBottom: 10,
      backgroundColor: '#ffffff',
      borderRadius: 5,
      borderWidth: 1,
      borderColor: '#ccc',
    },
    moduleText: {
      marginLeft: 10,
      fontSize: 16,
    },
   
    modalTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 10,
      textAlign: 'center',
    },
    input: {
      borderWidth: 1,
      borderColor: '#ccc',
     
      marginBottom: 20,
      borderRadius: 5,
      backgroundColor: 'transparent',
    },
    
    roleList: {
      // marginTop: 20,
    },
    roleText: {
      fontSize: 16,
      marginVertical: 5,
    },
    heading: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#333',
      marginBottom: 10,
    },
   
    inputWrapper: {
      marginBottom: 16, // Space between this input and the next one
      paddingHorizontal: 16, // Padding inside the wrapper for the inputs
    },
    label: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 8, // Space between label and input field
      color: '#333', // Dark color for the text
    },  
    modal: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
   
   
    modalButton: {
   
      padding: 10,
    backgroundColor:'transparent',
    
  
      borderRadius: 5,
     
      alignItems: 'center',
    },
    buttonText: {
      color: '#000',
      fontSize: 14,
    
    },
   
    buttonText1: {
      color: '#fff',
      fontSize: 14,
      backgroundColor:'#044086',
   padding:15,
   borderRadius:'10px',
   width:'50px',
   alignItems:'center',
   justifyContent:'center',
   display:'flex'
    
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
