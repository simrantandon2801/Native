import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  SafeAreaView,
  TouchableOpacity,
  Switch,
  Modal,
  ActivityIndicator,
  Alert
} from 'react-native';
import { DataTable, Text, Menu, Provider } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { fetchProjectSizes, updateProjectSize, addProjectSize, ProjectSize } from '../../database/Masters';
import { ScrollView } from 'react-native-gesture-handler';

interface NewProjectSize {
  id: number;
  value: string;
  is_active: boolean;
}

export default function ProjectSizeComponent() {
  const [projectSizes, setProjectSizes] = useState<ProjectSize[]>([]);
  const [menuVisible, setMenuVisible] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProjectSize, setSelectedProjectSize] = useState<ProjectSize | null>(null);
  const [newProjectSize, setNewProjectSize] = useState<NewProjectSize>({
    id: 0,
    value: '',
    is_active: true
  });

  const fetchProjectSizesData = async () => {
    try {
      setLoading(true);
      const response = await fetchProjectSizes();
      setProjectSizes(response);
    } catch (error) {
      console.error('Error fetching project sizes:', error);
      Alert.alert('Error', 'Failed to fetch project sizes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectSizesData();
  }, []);

  const handleAddProjectSize = async () => {
    if (!newProjectSize.value.trim()) {
      Alert.alert('Error', 'Project size name cannot be empty');
      return;
    }

    try {
      setLoading(true);
      await addProjectSize(newProjectSize);
      await fetchProjectSizesData();
      setIsAddModalOpen(false);
      setNewProjectSize({ id: 0, value: '', is_active: true });
      Alert.alert('Success', 'Project size added successfully');
    } catch (error) {
      console.error('Error adding project size:', error);
      Alert.alert('Error', 'Failed to add project size. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditProjectSize = async () => {
    if (!selectedProjectSize) return;
    if (!selectedProjectSize.value.trim()) {
      Alert.alert('Error', 'Project size name cannot be empty');
      return;
    }

    try {
      setLoading(true);
      await updateProjectSize(selectedProjectSize);
      await fetchProjectSizesData();
      setIsEditModalOpen(false);
      setSelectedProjectSize(null);
      Alert.alert('Success', 'Project size updated successfully');
    } catch (error) {
      console.error('Error editing project size:', error);
      Alert.alert('Error', 'Failed to update project size. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusToggle = async (projectSize: ProjectSize) => {
    try {
      setLoading(true);
      await updateProjectSize({
        ...projectSize,
        is_active: !projectSize.is_active
      });
      await fetchProjectSizesData();
    } catch (error) {
      console.error('Error toggling status:', error);
      Alert.alert('Error', 'Failed to update status. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const openMenu = (id: number) => setMenuVisible(id);
  const closeMenu = () => setMenuVisible(null);

  return (
    <Provider>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerContainer}>
            <Text style={styles.title}>Project Size</Text>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setIsAddModalOpen(true)}
            >
              <View style={styles.buttonContent}>
                <Icon name="plus" size={16} color="#044086" />
                <Text style={styles.buttonText}>Add Project Size</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
          <DataTable>
            <DataTable.Header style={styles.tableHeader}>
              <DataTable.Title style={styles.column}>S.No</DataTable.Title>
              <DataTable.Title style={styles.column}>Project Size</DataTable.Title>
              <DataTable.Title style={styles.column}>Status</DataTable.Title>
              <DataTable.Title style={styles.column}>Action</DataTable.Title>
            </DataTable.Header>

            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
              </View>
            ) : projectSizes.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No Project Sizes found</Text>
              </View>
            ) : (
              projectSizes.map((item, index) => (
                <DataTable.Row key={item.id} style={styles.row}>
                  <DataTable.Cell style={styles.column}>{index + 1}</DataTable.Cell>
                  <DataTable.Cell style={styles.column}>{item.value}</DataTable.Cell>
                  <DataTable.Cell style={styles.column}>
                    <TouchableOpacity
                      style={[
                        styles.statusBadge,
                        item.is_active ? styles.activeBadge : styles.inactiveBadge
                      ]}
                      onPress={() => handleStatusToggle(item)}
                      disabled={loading}
                    >
                      <Text style={[
                        styles.statusText,
                        item.is_active ? styles.activeText : styles.inactiveText
                      ]}>
                        {item.is_active ? 'Active' : 'Inactive'}
                      </Text>
                    </TouchableOpacity>
                  </DataTable.Cell>
                  <DataTable.Cell style={styles.column}>
                    <Menu
                      visible={menuVisible === item.id}
                      onDismiss={closeMenu}
                      anchor={
                        <TouchableOpacity onPress={() => openMenu(item.id)}>
                          <Icon name="dots-vertical" size={16} color="#666" />
                        </TouchableOpacity>
                      }
                    >
                      <Menu.Item
                        onPress={() => {
                          setSelectedProjectSize(item);
                          setIsEditModalOpen(true);
                          closeMenu();
                        }}
                        title="Edit"
                      />
                    </Menu>
                  </DataTable.Cell>
                </DataTable.Row>
              ))
            )}
          </DataTable>
        </ScrollView>

        {/* Add Project Size Modal */}
        <Modal
          visible={isAddModalOpen}
          transparent={true}
          animationType="fade"
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Add Project Size</Text>
              <View style={styles.modalBody}>
                <Text style={styles.label}>Project Size</Text>
                <TextInput
                  style={styles.input}
                  value={newProjectSize.value}
                  onChangeText={(text) => setNewProjectSize({ ...newProjectSize, value: text })}
                  placeholder="Enter project size"
                  editable={!loading}
                />
                <View style={styles.switchContainer}>
                  <Text style={styles.label}>Status</Text>
                  <Switch
                    value={newProjectSize.is_active}
                    onValueChange={(value) => setNewProjectSize({ ...newProjectSize, is_active: value })}
                    disabled={loading}
                  />
                </View>
              </View>
              <View style={styles.modalFooter}>
                <TouchableOpacity
                  onPress={() => setIsAddModalOpen(false)}
                  disabled={loading}
                  style={[
                    styles.button,
                    styles.cancelButton,
                    loading && styles.disabledButton
                  ]}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleAddProjectSize}
                  disabled={loading || !newProjectSize.value.trim()}
                  style={[
                    styles.button,
                    styles.saveButton,
                    (loading || !newProjectSize.value.trim()) && styles.disabledButton
                  ]}
                >
                  <Text style={[styles.buttonText, { color: 'white' }]}>
                    {loading ? 'Adding...' : 'Add Project Size'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Edit Project Size Modal */}
        <Modal
          visible={isEditModalOpen}
          transparent={true}
          animationType="fade"
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Edit Project Size</Text>
              <View style={styles.modalBody}>
                <Text style={styles.label}>Project Size Name</Text>
                <TextInput
                  style={styles.input}
                  value={selectedProjectSize?.value || ''}
                  onChangeText={(text) => setSelectedProjectSize(prev => prev ? { ...prev, value: text } : null)}
                  placeholder="Enter project size name"
                  editable={!loading}
                />
                <View style={styles.switchContainer}>
                  <Text style={styles.label}>Status</Text>
                  <Switch
                    value={selectedProjectSize?.is_active || false}
                    onValueChange={(value) => setSelectedProjectSize(prev => prev ? { ...prev, is_active: value } : null)}
                    disabled={loading}
                  />
                </View>
              </View>
              <View style={styles.modalFooter}>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={() => setIsEditModalOpen(false)}
                  disabled={loading}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.button,
                    styles.saveButton,
                    (loading || !selectedProjectSize?.value.trim()) && styles.disabledButton
                  ]}
                  onPress={handleEditProjectSize}
                  disabled={loading || !selectedProjectSize?.value.trim()}
                >
                  <Text style={[styles.buttonText, { color: '#fff' }]}>
                    {loading ? 'Saving...' : 'Save Changes'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e1e1',
    backgroundColor: '#f5f5f5',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    fontFamily:'Outfit'
  },
  addButton: {
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    color: '#044086',
    fontSize: 16,
    marginLeft: 8,
  },
  tableHeader: {
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 8,
  },
  column: {
    justifyContent: 'center',
  },
  row: {
    borderBottomWidth: 1,
    borderBottomColor: '#e1e1e1',
    minHeight: 48,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignItems: 'center',
  },
  activeBadge: {
   
  },
  inactiveBadge: {
   
  },
  statusText: {
    fontSize: 14,
    textTransform: 'capitalize',
  },
  activeText: {
    color: '#000',
  },
  inactiveText: {
    color: '#000',
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    color: '#666',
    fontSize: 16,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    width: '90%',
    maxWidth: 500,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  modalBody: {
    marginBottom: 16,
  },
  modalText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
    marginRight: 12,
  },
  modalSubText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginRight: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e1e1e1',
    borderRadius: 8,
    padding: 8,
    marginBottom: 16,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 16,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 16,
  },
  headerContainer: {
    alignItems: 'center',
  },
  buttonContainer: {
    marginTop: 10,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#ddd',
    marginRight: 12,
  },
  saveButton: {
    backgroundColor: '#044086',
  },
  disabledButton: {
    opacity: 0.5,
  },
});

