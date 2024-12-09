import React, { ReactNode, useState,useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {StyleSheet,View,Text,TouchableOpacity,Modal,ScrollView,Pressable,Dimensions} from 'react-native';

import { IconButton, Menu, DataTable, Button, TextInput } from 'react-native-paper';
import PropTypes from 'prop-types';
import { AddAndEditRole } from '../database/RoleMaster';

const { height } = Dimensions.get('window');
const adjustedHeight = height * 0.9;

const RoleMaster = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [actionsVisible, setActionsVisible] = useState(false);

  const [selectedUser, setSelectedUser] = useState(null); 
  const [isActionModalVisible, setIsActionModalVisible] = useState(false);

  const [editRoleIndex, setEditRoleIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const[users,setUsers]=useState([])
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);   
  const[role,setRole]=useState([])
  const [role_name, setRoleInput] = useState('');

  const toggleMenu = () => setActionsVisible(!actionsVisible);
  
  const closeModal = () => {
    setRoleInput('');
    setEditRoleIndex(null);
    setIsModalVisible(false);
  };
 
  interface Role {
    is_active: any;
    role_level: ReactNode;
    role_name: ReactNode;
    role: string;
 
  }
  
  const handleAddOrEditRole = async () => {
    setLoading(true);
    const newRole = { 
      role_id: 0,  
      role_name:role_name,
      role_level: 0,  
      is_active: true, 
      // auditInfo: auditInfo,  
      // resourceCost: resourceCost  
  };
  console.log(newRole,"value1")
  const res = await AddAndEditRole(newRole);
  console.log(res)

  };


  const handleEditRole = async () => {
    setLoading(true);
    
    const payload = { 
      role_id: selectedUser ? selectedUser.role_id : 0,
      role_name:role_name,
      role_level: 0,  
      // is_active: true, 
      // auditInfo: auditInfo,  
      // resourceCost: resourceCost  
  };
  console.log("value2: ",payload)
  const res = await AddAndEditRole(payload);
  console.log(res)
  
  
  };
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Retrieve the token from AsyncStorage
        const token = await AsyncStorage.getItem('Token');
        const uri = 'https://underbuiltapi.aadhidigital.com/master/get_roles';

        console.log('Fetching data from:', uri);

      
        const response = await fetch(uri, {
          method: 'GET',  
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
         
          throw new Error('Network response was not ok');
        }
       
        const result = await response.json();
        console.log(result.data.roles)
        setUsers(result.data.roles)

       
        console.log('API response:', response.status);
        

      
      } catch (err) {
        console.error('Error fetching data:', err);
      
      } finally {
        setLoading(false); 
      }
    };

    fetchData(); 

  }, []);  




 

// const handleDelete = async () => { setLoading(true); 
//   try { const token = await AsyncStorage.getItem('Token'); 
//   const response = await fetch( `https://underbuiltapi.aadhidigital.com/master/delete_roles/${selectedUser._id}`, 
//     { method: 'DELETE', headers: { Authorization: `Bearer ${token}`, }, } );
//      if (!response.ok) throw new Error('Failed to delete role'); 
//      setUsers(users.filter((user) => user._id !== selectedUser._id)); 
// console.log('Role deleted:', selectedUser._id); } 
// catch (err) { console.error('Error:', err); } 
// finally { setLoading(false); setIsActionModalVisible(false); } };






const handleAssign = () => { console.log('Assign action for user:', selectedUser); 
  setIsActionModalVisible(false); };  
  

  return (
    <>
    
      <View style={styles.manageUsersContainer}>
        <Text style={styles.heading}>Manage Role</Text>
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
              Add Role
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <IconButton
              icon="table-column-plus-after"
              size={16}
            
            />
            <Text style={[styles.actionText, { color: '#044086' }]}>
              Set Columns
            </Text>
          
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
          <DataTable.Title>Role</DataTable.Title>
          <DataTable.Title>Assign module</DataTable.Title>
          <DataTable.Title>Action</DataTable.Title>
        </DataTable.Header>

        
        <ScrollView showsVerticalScrollIndicator={false}  style={{  maxHeight:'100%'}} >
        {users.map((user, index) => (
          <DataTable.Row style={styles.table} key={user.role_id}>
           
            <DataTable.Cell>{index + 1}</DataTable.Cell>
            <DataTable.Cell>{user.role_name}</DataTable.Cell>
            <DataTable.Cell>
            <TouchableOpacity onPress={() => setIsModalVisible(true)} style={styles.viewModulesContainer}>
                  <IconButton  size={20} color="'#044086'" />
                  <Text style={styles.viewModulesText}>View Modules</Text>
                </TouchableOpacity>
                </DataTable.Cell>
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
      <TouchableOpacity style={styles.modalButton} onPress={handleAssign}>
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
                        <View style={styles.modalOverlay}> 
                          <View style={styles.modalContent1}> 
                            <Text style={styles.modalTitle}>Edit Role</Text> 
                            <TextInput style={styles.input} value={role_name} 
                              onChangeText={setRoleInput} 
                             placeholder="Role Name" /> 
                             <View style={styles.buttonContainer}>
                            <Pressable style={styles.modalButton} onPress={handleEditRole}> 
                              
                              <Text style={styles.buttonText1}>Save</Text> </Pressable> 

                              <Pressable style={[styles.modalButton1, ]} 
                              onPress={() => setIsEditModalVisible(false)} >
                                 <Text style={styles.buttonText1}>Cancel</Text>
                                  </Pressable>
                                  </View>
                                   </View> 
                                   </View>
                                    </Modal>


      
      <View style={styles.container}>
     
    


    
     



   
      <Modal visible={isModalVisible} transparent animationType="none">
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


    </>
  );
};



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

export default RoleMaster;