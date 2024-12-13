import React, { useState } from 'react';
import { View, StyleSheet, Alert, Text, ScrollView, Modal, TouchableOpacity, CheckBox, Modal, ScrollView, TouchableWithoutFeedback, Dimensions} from 'react-native';
import { TextInput, PaperProvider, Button, ActivityIndicator, IconButton, Menu, DataTable } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {Picker} from '@react-native-picker/picker';
import {addADForCustomer, GetIntegrations} from '../database/Integration';
//import {StyleSheet,View,Text,TouchableOpacity,Modal,ScrollView,Pressable,Dimensions, Alert, TouchableWithoutFeedback} from 'react-native';

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

  const [adList, setAdList] = useState([]);
  const [integrationId, setIntegrationId] = useState('');
  const [customerId, setCustomerId] = useState('1');
  const [clientId, setClientId] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [tenantId, setTenantId] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedAD, setSelectedAD] = useState(null);

  const OPTIONS = [
    { label: 'Microsoft', value: 'Microsoft' },
    { label: 'Okta', value: 'Okta' },
    { label: 'Other', value: 'Other' },
  ];
  const fetchData = async () => {
    try {
      const response = await GetIntegrations(customerId);
      const parsedRes = JSON.parse(response);
      if (parsedRes.status === 'success') setAdList(parsedRes.data);
      else
        console.error(
          'Failed to fetch AD:',
          parsedRes.message || 'Unknown error',
        );
    } catch (err) {
      console.log('Error Fetching Users', err);
    }
  };
  const handleSave = async () => {
    // let tempErrors: { [key: string]: string } = {};
    console.log('hi');
    // // Validation checks
    // if (!ad) tempErrors.ad = 'AD is required';
    // // if (!name) tempErrors.name = 'Integration Name is required';
    // if (!clientId) tempErrors.clientId = 'Client ID is required';
    // if (!clientSecret) tempErrors.clientSecret = 'Client Secret is required';
    // if (!tenantId) tempErrors.tenantId = 'Tenant ID is required';

    // setErrors(tempErrors);

    // if (Object.keys(tempErrors).length > 0) return;

    const payload = {
      integration_customer_id: '',
      integration_id:selectedAD,
      customer_id: 1,
      client_id: clientId,
      client_secret: clientSecret,
      tenant_id: tenantId,
      created_by: '8'
    };
    try {
    const response = await addADForCustomer(payload);
      const parsedRes = JSON.parse(response);
      if (parsedRes.status === 'success')
        console.log('AD Added succesfully');
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
  useEffect(() => {
    fetchData();
  }, []);
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
          onPress={() => setAddRoleModalVisible(true)}>
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
            <TouchableOpacity onPress={() => { setSelectedUser(user); setRoleInput(user.role_name); setIsActionModalVisible(true); }} >
               <IconButton icon="dots-vertical" size={20} />
           </TouchableOpacity> 
           </DataTable.Cell>
        </DataTable.Row>
      ))}
      </ScrollView>
    </DataTable>
    <View style={styles.actions}>
    <Modal transparent visible={isActionModalVisible} animationType="fade" style={styles.modal}>
<View style={styles.modalOverlay}>
  <View style={styles.modalContent}>
    {/* Edit Button */}
    <TouchableOpacity style={styles.modalButton} onPress={() => setIsEditModalVisible(true)}>
      <Text style={styles.buttonText}>Edit</Text>
    </TouchableOpacity>

    {/* Assign Modules Button */}
    <TouchableOpacity style={styles.modalButton} onPress={() => setIsModalVisible(true)}>
      <Text style={styles.buttonText}>Assign Modules</Text>
    </TouchableOpacity>

    {/* Cancel Button */}
    <TouchableOpacity
      style={[styles.modalButton]}  // Background removed
      onPress={() => setIsActionModalVisible(false)}
    >
      <Text style={styles.buttonText}>Cancel</Text>
    </TouchableOpacity>
  </View>
</View>
</Modal>
</View>

<Modal transparent visible={isEditModalVisible}>
{/* Detect taps outside the modal */}
<TouchableWithoutFeedback onPress={() => setIsEditModalVisible(false)}>
  <View style={styles.modalOverlay}>
    {/* Prevent closing the modal when tapping inside */}
    <TouchableWithoutFeedback onPress={() => {}}>
      <View style={styles.modalContent1}>
        <Text style={styles.modalTitle}>Edit Role</Text>
        <TextInput
          style={styles.input}
          value={role_name}
          onChangeText={setRoleInput}
          placeholder="Role Name"
        />
        <View style={styles.buttonContainer}>
          <Pressable style={styles.modalButton} onPress={handleEditRole}>
            <Text style={styles.buttonText1}>Save</Text>
          </Pressable>
          <Pressable
            style={[styles.modalButton1]}
            onPress={() => setIsEditModalVisible(false)}>
            <Text style={styles.buttonText1}>Cancel</Text>
          </Pressable>
        </View>
      </View>
    </TouchableWithoutFeedback>
  </View>
</TouchableWithoutFeedback>
</Modal>


    
    <View style={styles.container}>
   
  


  
   



 
    <Modal visible={isAddRoleModalVisible} transparent animationType="none">
<View style={styles.modalOverlay}>
  <View style={styles.modalContainer}>
    <Text style={styles.modalHeader}>
      {editRoleIndex !== null ? 'Edit Role' : 'Add Role'}
    </Text>

    
    <View style={styles.inputWrapper}>
<Text style={styles.label}>* Role</Text>
<TextInput
  value={role_name}  
  onChangeText={setRoleInput}  
  placeholder="Enter role"
  style={styles.input}
/>
</View>
    <View style={styles.modalButtons}>
      <Button
        mode="contained"
        onPress={handleAddOrEditRole}
        style={styles.saveButton}
      >
        Save
      </Button>
      <Button
        mode="contained"
        onPress={closeModal}
        style={styles.cancelButton}
      >
        Cancel
      </Button>
    </View>
  </View>
</View>
</Modal>
  </View>
  <Modal
      visible={isModalVisible}
      onRequestClose={() => setIsModalVisible(false)}
      animationType="slide"
      transparent={true}>
      <ScrollView contentContainerStyle={styles.modalScrollContainer}>
        <View style={styles.modalContainer}>
        <Text style={styles.modalHeader}>View Assigned Modules</Text>
        <View style={styles.dropdownContainer}>
            </View>
    <View style={styles.expandableContainer}>
    <Text style={styles.expandableHeader}></Text>
          {loading ? (
            <Text>Loading...</Text>
          ) : (
            <ScrollView>{renderModules(modules)}</ScrollView>
          )}
           <View style={styles.buttonRow}>
<TouchableOpacity style={styles.editButton} onPress={toggleEditMode}>
            <Text style={styles.editButtonText}>
              {isEditable ? 'Done' : 'Edit'}
            </Text>
          </TouchableOpacity>
          {/* Close Button */}
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setIsModalVisible(false)}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
          </View>
        </View>
        </View>
      </ScrollView>
    </Modal>


  </>
  );
};

export default ADIntegration;
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
   
    
   
  });
