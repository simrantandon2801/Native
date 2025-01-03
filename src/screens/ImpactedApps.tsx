import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {
  DataTable,
  Menu,
  TextInput,
  IconButton,
  Button,
  Switch,
} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  GetApplications,
  AddAndEditApplications,
  DeleteApplications,
} from '../database/ImpactedApps';

interface Application {
  application_id: number;
  application_name: string;
  is_active: boolean;
}

const ImpactedApplications = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [menuVisibleFor, setMenuVisibleFor] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [applicationName, setApplicationName] = useState<string>('');
  const [isApplicationActive, setIsApplicationActive] = useState<boolean>(true);

  const fetchApplications = async () => {
    setIsLoading(true);
    try {
      const result = await GetApplications('');
      const parsedResult = JSON.parse(result);
      const applicationsArray = parsedResult?.data?.impacted_applications || [];
      setApplications(applicationsArray);
    } catch (error) {
      console.error('Error fetching applications:', error);
      Alert.alert('Error', 'Failed to fetch applications. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddOrEditApplication = async () => {
    if (!applicationName.trim()) {
      Alert.alert('Error', 'Application name cannot be empty');
      return;
    }

    const payload = {
      application_id: selectedApplication ? selectedApplication.application_id : 0,
      application_name: applicationName.trim(),
      is_active: isApplicationActive,
    };

    try {
      setIsLoading(true);
      await AddAndEditApplications(payload);
      Alert.alert('Success', 'Application saved successfully');
      setIsModalVisible(false);
      fetchApplications();
    } catch (error) {
      console.error('Error saving application:', error);
      Alert.alert('Error', 'Failed to save application. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteApplication = (applicationId: number) => {
    const application = applications.find(app => app.application_id === applicationId);
    setSelectedApplication(application || null);  // Set to null if no application is found
    setIsDeleteModalVisible(true);  // Show the delete confirmation modal
    setMenuVisibleFor(null);  // Close the menu
  };
  
  const confirmDeleteApplication = async () => {
    if (selectedApplication && selectedApplication.application_id) {
      setIsLoading(true);
      try {
        console.log('Attempting to delete application with ID:', selectedApplication.application_id);
        const res = await DeleteApplications(selectedApplication.application_id);  // Assuming DeleteApplications is your API call function
        console.log('Delete API Response:', res);
        const parsedRes = JSON.parse(res);
        if (parsedRes.status === 'success') {
          // Remove the application from the state (or the list displayed)
          // setApplications(prevApplications =>
          //   prevApplications.filter(app => app.application_id !== selectedApplication.application_id)
          // );
          fetchApplications();
          Alert.alert('Success', 'Application deleted successfully');
        } else {
          throw new Error(parsedRes.message || 'Unknown error occurred');
        }
      } catch (error) {
        console.error('Error in confirmDeleteApplication:', error);
        Alert.alert('Error', 'Failed to delete application. Please try again.');
      } finally {
        setIsLoading(false);
        setIsDeleteModalVisible(false);  // Close the confirmation modal
      }
    }
  };
  
  

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleMenuToggle = (applicationId: number) => {
    setMenuVisibleFor(prevMenuVisibleFor => (prevMenuVisibleFor === applicationId ? null : applicationId));
  };

  const openModal = (application: Application | null = null) => {
    setSelectedApplication(application);
    setApplicationName(application?.application_name || '');
    setIsApplicationActive(application?.is_active || true);
    setIsModalVisible(true);
    setMenuVisibleFor(null);
  };

  const closeModal = () => {
    setSelectedApplication(null);
    setApplicationName('');
    setIsApplicationActive(true);
    setIsModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.manageUsersContainer}>
              <Text style={styles.heading}>Impacted Applications</Text>
      </View>
      <View style={styles.actions}>
        <View style={styles.middleActions}>          
          <TouchableOpacity
            onPress={() => openModal()}
            style={[styles.actionButton, { padding: 0, backgroundColor: 'transparent' }]}> 
            <IconButton icon="plus" size={16} />
            <Text style={[styles.actionText, { color: '#044086' }]}>Add Applications</Text>
          </TouchableOpacity>
        </View>
        {/* <TouchableOpacity style={[styles.actionButton, styles.rightAction]}>
          <IconButton icon="filter" size={16} />
          <Text style={[styles.actionText, {color: '#344054'}]}>Filters</Text>
        </TouchableOpacity> */}
      </View>
      <DataTable>
        <DataTable.Header>
          <DataTable.Title>S. No.</DataTable.Title>
          <DataTable.Title>Application</DataTable.Title>
          <DataTable.Title>Status</DataTable.Title>
          <DataTable.Title>Actions</DataTable.Title>
        </DataTable.Header>

        <ScrollView>
          {applications.map((application, index) => (
            <DataTable.Row key={application.application_id}>
              <DataTable.Cell>{index + 1}</DataTable.Cell>
              <DataTable.Cell>{application.application_name}</DataTable.Cell>
              <DataTable.Cell>
                <Text
                  style={[
                    styles.statusText,
                    { color: application.is_active ? 'green' : 'red' },
                  ]}>
                  {application.is_active ? 'Active' : 'Inactive'}
                </Text>
              </DataTable.Cell>
              <DataTable.Cell style={styles.statusCell}>
                <Menu
                  visible={menuVisibleFor === application.application_id}
                  onDismiss={() => setMenuVisibleFor(null)}
                  anchor={
                    <TouchableOpacity onPress={() => handleMenuToggle(application.application_id)}>
                      <IconButton icon="dots-vertical" size={20} />
                    </TouchableOpacity>
                  }>
                  <Menu.Item onPress={() => openModal(application)} title="Edit" />
                  {/* <Menu.Item onPress={() => handleDeleteApplication(application.application_id)} title="Delete" /> */}
                </Menu>
              </DataTable.Cell>
            </DataTable.Row>
          ))}
        </ScrollView>
      </DataTable>

      {isLoading && <ActivityIndicator size="large" style={styles.loadingOverlay} />}

      {isLoading && <ActivityIndicator size="large" style={styles.loadingOverlay} />}

      {/* Delete Confirmation Modal */}
      <Modal visible={isDeleteModalVisible} transparent onRequestClose={() => setIsDeleteModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Are you sure you want to delete this application?</Text>
            <View style={styles.buttonContainer}>
              <Button mode="contained" onPress={confirmDeleteApplication} style={styles.submitButton}>
                <Text style={styles.submitButtonText}>Yes</Text>
              </Button>
              <Button mode="text" onPress={() => setIsDeleteModalVisible(false)} style={styles.cancelButton}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Button>
            </View>
          </View>
        </View>
      </Modal>
          
      {/* Add/Edit Application Modal */}
      <Modal visible={isModalVisible} transparent onRequestClose={closeModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {selectedApplication ? 'Edit Application' : 'Add Application'}
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Application Name"
              value={applicationName}
              onChangeText={setApplicationName}
            />
            <View style={styles.switchContainer}>
              <Text style={styles.switchLabel}>Active</Text>
              <Switch
                value={isApplicationActive}
                onValueChange={setIsApplicationActive}
              />
            </View>
            <View style={styles.buttonContainer}>
              <Button
                mode="contained"
                onPress={handleAddOrEditApplication}
                style={styles.submitButton}>
                <Text style={styles.submitButtonText}>Save</Text>
              </Button>
              <Button
                mode="text"
                onPress={closeModal}
                style={styles.cancelButton}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};


const styles = StyleSheet.create({
  actionButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
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
    flex: 1,
    minWidth: 50,
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
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
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
    justifyContent: 'flex-end',
    marginTop: 12,
    gap: 8,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  switchLabel: {
    fontSize: 14,
    color: '#333',
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
});

export default ImpactedApplications;
