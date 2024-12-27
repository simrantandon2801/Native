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

// Define interfaces
interface Application {
  application_id: number;
  application_name: string;
  is_active: boolean;
}

const ImpactedApplications = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [applicationName, setApplicationName] = useState<string>('');
  const [isApplicationActive, setIsApplicationActive] = useState<boolean>(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setIsLoading(true);
    try {
      const result = await GetApplications('');
      const parsedResult = JSON.parse(result);

      // Access the nested 'impacted_applications' array
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

  const handleDeleteApplication = async (applicationId: number) => {
    Alert.alert('Confirm Delete', 'Are you sure you want to delete this application?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Delete',
        onPress: async () => {
          try {
            setIsLoading(true);
            await DeleteApplications(applicationId);
            Alert.alert('Success', 'Application deleted successfully');
            fetchApplications();
          } catch (error) {
            console.error('Error deleting application:', error);
            Alert.alert('Error', 'Failed to delete application. Please try again.');
          } finally {
            setIsLoading(false);
          }
        },
      },
    ]);
  };

  const openModal = (application: Application | null = null) => {
    setSelectedApplication(application);
    setApplicationName(application?.application_name || '');
    setIsApplicationActive(application?.is_active || true);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setSelectedApplication(null);
    setApplicationName('');
    setIsApplicationActive(true);
    setIsModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Impacted Applications</Text>

      <View style={styles.actions}>
        <Button icon="plus" mode="contained" onPress={() => openModal()}>
          Add Application
        </Button>
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" color="#044086" style={styles.loader} />
      ) : (
        <ScrollView>
          <DataTable>
            <DataTable.Header>
              <DataTable.Title>S. No.</DataTable.Title>
              <DataTable.Title>Application</DataTable.Title>
              <DataTable.Title>Status</DataTable.Title>
              <DataTable.Title>Actions</DataTable.Title>
            </DataTable.Header>

            {applications.length > 0 ? (
              applications.map((app, index) => (
                <DataTable.Row key={app.application_id}>
                  <DataTable.Cell>{index + 1}</DataTable.Cell>
                  <DataTable.Cell>{app.application_name}</DataTable.Cell>
                  <DataTable.Cell>
                    <Text style={{ color: app.is_active ? 'green' : 'red' }}>
                      {app.is_active ? 'Active' : 'Inactive'}
                    </Text>
                  </DataTable.Cell>
                  <DataTable.Cell>
                    <IconButton
                      icon="pencil"
                      onPress={() => openModal(app)}
                    />
                    <IconButton
                      icon="delete"
                      onPress={() => handleDeleteApplication(app.application_id)}
                    />
                  </DataTable.Cell>
                </DataTable.Row>
              ))
            ) : (
              <Text>No applications found.</Text>
            )}
          </DataTable>
        </ScrollView>
      )}

      <Modal visible={isModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {selectedApplication ? 'Edit Application' : 'Add Application'}
            </Text>

            <TextInput
              label="Application Name"
              value={applicationName}
              onChangeText={setApplicationName}
              mode="outlined"
              style={styles.input}
            />

            <View style={styles.switchContainer}>
              <Text>Active</Text>
              <Switch
                value={isApplicationActive}
                onValueChange={setIsApplicationActive}
              />
            </View>

            <View style={styles.modalActions}>
              <Button onPress={closeModal}>Cancel</Button>
              <Button mode="contained" onPress={handleAddOrEditApplication}>
                Save
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  actions: {
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  loader: {
    marginTop: 20,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    marginBottom: 16,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default ImpactedApplications;
