import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  Alert,
  TouchableWithoutFeedback,
  ActivityIndicator,
  Dimensions,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import {
  IconButton,
  Menu,
  DataTable,
  Switch,
} from 'react-native-paper';
import { AddAndEditClassification,deleteClassification, GetClasssifcation } from '../../database/Classification';

const { height } = Dimensions.get('window');

interface Classification {
  classification_id: number;
  classification_name: string;
  is_active: boolean;
}

const Classification: React.FC = () => {
  const [isMenuVisible, setMenuVisible] = useState(false);
  const [selectedClassification, setSelectedClassification] = useState<Classification | null>(null);
  const [loading, setLoading] = useState(false);
  const [classifications, setClassifications] = useState<Classification[]>([]);
  const [isClassificationModalVisible, setClassificationModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [classificationName, setClassificationName] = useState('');
  const [isClassificationActive, setIsClassificationActive] = useState(true);
  const [classification_name, setClassificationInput] = useState('');
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  const closeModal = () => {
    setClassificationInput('');
    setClassificationModalVisible(false);
  };


  const handleAddClassification = async () => {
    if (!classification_name.trim()) {
      console.log('Error', 'Classification name cannot be empty');
      return;
    }
    setLoading(true);
    const newClassification = {
      classification_id: 0,
      classification_name: classification_name.trim(),
      is_active: true,
    };
    console.log(newClassification, 'Adding new classification');
    console.log("dsoidh")
    const res = await AddAndEditClassification(newClassification);
    console.log(res);
    setLoading(false);
    setClassificationModalVisible(false);
    setClassificationInput('');
    
    fetchClassification();
  };

  const handleEditClassification = async () => {
    setLoading(true);

    const payload = {
      classification_id: selectedClassification ? selectedClassification.classification_id : 0,
      classification_name: classificationName,
      is_active: isClassificationActive,
    };

    console.log('Classification payload: ', payload);
    
    try {
      const res = await AddAndEditClassification(payload);
      console.log('API response:', res);
      setIsEditModalVisible(false);
      fetchClassification();
    } catch (error) {
      console.error('Error editing classification:', error);
    } finally {
      setLoading(false);
    }
  };
 
  const fetchClassification = async () => {
    try {
      const response = await GetClasssifcation('');
      console.log('Raw Response:', response);
  
      // Ensure response is parsed correctly
      const result = typeof response === 'string' ? JSON.parse(response) : response;
  
      console.log('Parsed API Response:', result);
  
      // Validate the classification data
      if (result?.data?.classifications && Array.isArray(result.data.classifications)) {
        setClassifications(result.data.classifications); 
      } else {
        console.error('Invalid classification data:', result);
        Alert.alert('Error', 'Invalid classification data received');
      }
    } catch (error) {
      console.error('Error fetching classification:', error);
      Alert.alert('Error', 'Failed to fetch classification');
    }
  };
  
  useEffect(() => {
    fetchClassification();
  }, []);

  const handleStatusToggle = async (classification: Classification) => {
    setSelectedClassification(classification);
    try {
      setLoading(true);
      const updatedClassification = { ...classification, is_active: !classification.is_active };
      const res = await AddAndEditClassification(updatedClassification);
      const response = JSON.parse(res);
      if (response.status === 'success') {
        setClassifications(prevClassifications =>
          prevClassifications.map(c => (c.classification_id === classification.classification_id ? updatedClassification : c)),
        );
        fetchClassification();
      } else {
        throw new Error(response.message || 'Failed to update status');
      }
    } catch (error) {
      console.error('Error toggling status:', error);
      Alert.alert('Error', 'Failed to update status. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (classificationId: number) => {
    const classificationToDelete = classifications.find(c => c.classification_id === classificationId);
    if (classificationToDelete) {
      setSelectedClassification(classificationToDelete);
      setIsDeleteModalVisible(true);
    }
    setMenuVisible(false);
    fetchClassification();
  };

  const confirmDelete = async () => {
    if (selectedClassification) {
      setLoading(true);
      try {
        console.log('Attempting to delete classification with ID:', selectedClassification.classification_id);
        const res = await deleteClassification(selectedClassification.classification_id);
        console.log('Delete API Responsehga:', res);
        const parsedRes = JSON.parse(res);
        if (parsedRes.status === 'success') {
          fetchClassification();
          setClassifications(prevClassifications =>
            prevClassifications.filter(c => c.classification_id !== selectedClassification.classification_id)
          );
          Alert.alert('Success', 'Classification deleted successfully');
          fetchClassification();
        } else {
          throw new Error(parsedRes.message || 'Unknown error occurred');
          fetchClassification();
        }
      } catch (error) {
        console.error('Error in confirmDelete:', error);
        Alert.alert('Error', 'Failed to delete classification. Please try again.');
        fetchClassification();
      } finally {
        setLoading(false);
        setIsDeleteModalVisible(false);
        fetchClassification();
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.manageUsersContainer}>
        <Text style={styles.heading}>Manage Classification</Text>
      </View>
      <View style={styles.actions}>
        <View style={{flexDirection: 'row', justifyContent: 'center', flex: 1}}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              setClassificationInput('');
              setClassificationModalVisible(true);
            }}>
          <Icon
                             name="plus"
                             size={14}
                             color="#044086"
                             style={styles.buttonIcon}
                           />

            <Text style={[styles.actionText, {color: '#044086'}]}>
              Add Classification
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <DataTable style={styles.tableHeaderCell}>
        <DataTable.Header>
          <DataTable.Title style={styles.columnHeader}>S. No.</DataTable.Title>
          <DataTable.Title style={styles.columnHeader}>Classification</DataTable.Title>
          <DataTable.Title style={styles.columnHeader}>Status</DataTable.Title>
          <DataTable.Title style={styles.columnHeader}>Action</DataTable.Title>
        </DataTable.Header>

        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{maxHeight: height * 0.5}}>
          {classifications.map((classification, index) => (
            <DataTable.Row style={[styles.table, styles.tableRow]} key={classification.classification_id}>
              <DataTable.Cell style={styles.columnHeader}>{index + 1}</DataTable.Cell>
              <DataTable.Cell style={styles.columnHeader}>{classification.classification_name}</DataTable.Cell>
              <DataTable.Cell style={styles.columnHeader}>
                {loading && selectedClassification?.classification_id === classification.classification_id ? (
                  <ActivityIndicator size="small" color="#044086" />
                ) : (
                  <TouchableOpacity onPress={() => handleStatusToggle(classification)}>
                    <Text
                      style={[
                        styles.statusText,
                        {color: classification.is_active ? 'green' : 'red'},
                      ]}>
                      {classification.is_active ? 'Active' : 'Inactive'}
                    </Text>
                  </TouchableOpacity>
                )}
              </DataTable.Cell>
              <DataTable.Cell style={styles.columnHeader}>
                <Menu
                  visible={isMenuVisible && selectedClassification?.classification_id === classification.classification_id}
                  onDismiss={() => setMenuVisible(false)}
                  anchor={
                    <TouchableOpacity
                      onPress={() => {
                        setSelectedClassification(classification);
                        setMenuVisible(true);
                      }}>
                      <IconButton icon="dots-vertical" size={20} />
                    </TouchableOpacity>
                  }>
                  <Menu.Item
                    onPress={() => {
                      setSelectedClassification(classification);
                      setClassificationName(classification.classification_name);
                      setIsClassificationActive(classification.is_active);
                      setIsEditModalVisible(true);
                      setMenuVisible(false);
                    }}
                    title="Edit"
                  />
                  <Menu.Item
                    onPress={() => {
                      handleDelete(classification.classification_id);
                    }}
                    title="Delete"
                  />
                </Menu>
              </DataTable.Cell>
            </DataTable.Row>
          ))}
        </ScrollView>
      </DataTable>
      
      <Modal transparent visible={isEditModalVisible}>
        <TouchableWithoutFeedback onPress={() => setIsEditModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <View style={{
                backgroundColor: 'white',
                borderRadius: 10,
                padding: 20,
                width: '30%',
                maxWidth: 600,
              }}>
                <Text style={{
                  fontSize: 18,
                  fontWeight: 'bold',
                  textAlign: 'center',
                  marginBottom: 20,
                }}>
                  Edit Classification
                </Text>
                <Text style={{
                  fontSize: 14,
                  fontWeight: 'bold',
                  marginBottom: 5,
                  color: '#044086',
                }}>
                  Classification <Text style={{ color: 'red' }}>*</Text>
                </Text>
                <TextInput
                  value={classificationName}
                  onChangeText={setClassificationName}
                  placeholder="Classification Name"
                  style={{
                    borderRadius: 5,
                    padding: 10,
                    fontSize: 16,
                    backgroundColor: 'white',
                    color: '#000',
                    borderBottomWidth: 1.5,
                    borderBottomColor: '#044086',
                    borderWidth: 0,
                    outlineStyle: 'none',
                    width: '100%',
                  }}
                />
                <View style={styles.switchContainer}>
                  <Text style={styles.switchLabel}>Active/Inactive</Text>
                  <Switch
                    value={isClassificationActive}
                    onValueChange={setIsClassificationActive}
                    color="#044086"
                  />
                </View>
                <View style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  marginTop: 20,
                }}>
                  <TouchableOpacity
                    style={{
                      backgroundColor: '#ddd',
                      paddingVertical: 10,
                      paddingHorizontal: 20,
                      borderRadius: 5,
                      marginRight: 10,
                    }}
                    onPress={() => setIsEditModalVisible(false)}>
                    <Text style={{ color: 'black' }}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      backgroundColor: '#044086',
                      paddingVertical: 10,
                      paddingHorizontal: 20,
                      borderRadius: 5,
                    }}
                    onPress={handleEditClassification}>
                    <Text style={{ color: 'white' }}>Save</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <Modal
        visible={isClassificationModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => {
          setClassificationModalVisible(false);
          setClassificationInput('');
        }}>
        <View style={styles.modalOverlay}>
          <View style={{
            backgroundColor: 'white',
            borderRadius: 10,
            padding: 20,
            width: '30%',
            maxWidth: 600,
          }}>
            <Text style={{
              fontSize: 18,
              fontWeight: 'bold',
              textAlign: 'center',
              marginBottom: 20,
            }}>
              Add Classification
            </Text>
            <Text style={{
              fontSize: 14,
              fontWeight: 'bold',
              marginBottom: 5,
              color: '#044086',
            }}>
              Classification <Text style={{ color: 'red' }}>*</Text>
            </Text>
            <TextInput
              value={classification_name}
              onChangeText={setClassificationInput}
              placeholder="Enter Classification"
              style={{
                borderRadius: 5,
                padding: 10,
                fontSize: 16,
                backgroundColor: 'white',
                color: '#000',
                borderBottomWidth: 1.5,
                borderBottomColor: '#044086',
                borderWidth: 0,
                outlineStyle: 'none',
                width: '100%',
              }}
            />
            <View style={{
              flexDirection: 'row',
              justifyContent: 'center',
              marginTop: 20,
              
            }}>
              <TouchableOpacity
                style={{
                  backgroundColor: '#ddd',
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                  borderRadius: 5,
                  marginRight: 10,
                }}
                onPress={closeModal}>
                <Text style={{ color: 'black' }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  backgroundColor: '#044086',
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                  borderRadius: 5,
                }}
                onPress={handleAddClassification}>
                <Text style={{ color: 'white' }}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/*Delete Role Modal */}
      <Modal
        visible={isDeleteModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsDeleteModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirm Delete</Text>
            <Text style={styles.modalText}>
              Are you sure you want to delete this classification?
            </Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setIsDeleteModalVisible(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.deleteButton]}
                onPress={confirmDelete}>
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    backgroundColor: 'white',
  },
  manageUsersContainer: {
    alignItems: 'center',
    paddingVertical: 10,
 backgroundColor:'#F5F5F5'
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
    fontFamily:'Inter',
    fontWeight:400
  },
  leftAction: {
    marginLeft: 0,
  },
  middleActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    flex: 1,
  },
  rightAction: {
    marginRight: 0,
  },
  tableHeaderCell: {
    marginTop: 15,
    marginHorizontal: 5,
    fontFamily:'Inter',
    fontSize:14,
    color:'#757575',
    fontWeight:600,
    lineHeight:22

  },
  table: {
    marginRight: 20,
  },
  modalButton1: {
    padding: 20,
    marginTop: -10,
    width: 30,
  },
  modalScrollContainer: {
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    flex: 1,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  saveButton: {
    backgroundColor: '#044086',
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 10,
                      paddingHorizontal: 20,
                      borderRadius: 5,
                      marginRight: 10,
  },
  modalContainer: {
    backgroundColor: 'white',
    marginHorizontal: 15,
    padding: 20,
    borderRadius: 10,
    width: '30%',
    alignSelf: 'center',
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
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 12,
    borderRadius: 4,
    backgroundColor: '#ffffff',
    padding: 10,
    width: '100%',
    fontSize: 14,
    height: 40,
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
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
    fontFamily:'Outfit',
    marginTop:20,
    
  },
  inputWrapper: {
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  modal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    minWidth: 60,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },

  buttonTextSave: {
    color: 'white',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    width: '80%',
    maxWidth: 300,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 12,
    gap: 8,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 12,
    marginTop:12
  },
  switchLabel: {
    fontSize: 14,
    color: '#333',
    marginRight:12
  },
  cancelButtonText: {
    color: '#333',
    fontWeight: 'bold',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  modalContent1: {
    width: '30%',
    padding: 20,
    backgroundColor: '#fff',
    margin: 70,
    borderRadius: 10,
    alignItems: 'center',
    maxHeight: 250,
  },
  moduleItem: {
    marginBottom: 10,
  },
  expandButton: {
    marginRight: 10,
  },
  expandButtonText: {
    fontSize: 18,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    padding: 10,
    borderRadius: 5,
    width: '40%',
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#ff3b30',
    paddingVertical: 10,
                      paddingHorizontal: 20,
                      borderRadius: 5,
                      marginRight: 10,
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  statusCell: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusText: {
    fontWeight: 'bold',
  },
  permissionContainer: {
    borderWidth: 1,
    borderColor: '#044086',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  permissionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  submitButton: {
    backgroundColor: '#044086',
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  columnHeader: {
    justifyContent: 'flex-start',
    paddingHorizontal: 1,
    fontFamily:'Inter',
    borderWidth:0,
    fontSize:50,
    fontWeight:600,
    color:'red',
    lineHeight:22
  },
  tableRow: {
    paddingHorizontal: 1,
    fontFamily:'Inter',
    justifyContent: 'flex-start',
    borderWidth:0 ,
    fontSize:14,
    fontWeight:600,
    color:'#757575',
    lineHeight:22
 

    
  },
  buttonIcon: {
    marginRight: 5,
    color:'#044086'
  },
});

export default Classification;

