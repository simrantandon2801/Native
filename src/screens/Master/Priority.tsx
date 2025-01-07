import React, { useState, useEffect } from 'react'
import {
  View,
  StyleSheet,
  TextInput,
  SafeAreaView,
  TouchableOpacity,
  Button,
  Switch,
  Modal,
  ActivityIndicator,
  Alert
} from 'react-native'
import { DataTable, Text, Menu, Provider } from 'react-native-paper'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { fetchPriorities, updatePriority, addPriority,  } from '../../database/Masters'
import { ScrollView } from 'react-native-gesture-handler'

interface Priority {
  id: number;
  value: string;
  is_active: boolean;
}

interface NewPriority {
  id: number;
  value: string;
  is_active: boolean;
}

export default function PriorityScreen() {
  const [priorities, setPriorities] = useState<Priority[]>([])
  const [menuVisible, setMenuVisible] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedPriority, setSelectedPriority] = useState<Priority | null>(null)
  const [newPriority, setNewPriority] = useState<NewPriority>({
    id: 0,
    value: '',
    is_active: true
  })
  const fetchPrioritiesData = async () => {
    try {
      setLoading(true);
      const response = await fetchPriorities();
      console.log('Raw Response:', response);
  
      // If response is already an object, no need to parse it
      const result = response;  // No need for JSON.parse() here
  
      console.log('Parsed API Response:', result);
  
      if (result.length > 0) {
        setPriorities(result);  // result is already an array of priorities
      } else {
        console.error('Invalid priority data:', result);
      }
      
    } catch (error) {
      console.error('Error fetching priorities:', error);
    } finally {
      setLoading(false);
    }
  };
  

  // Fetch priorities on component mount
  useEffect(() => {
    fetchPrioritiesData()
  }, [])



  const handleAddPriority = async () => {
    if (!newPriority.value.trim()) {
      Alert.alert('Error', 'Priority name cannot be empty')
      return
    }

    try {
      setLoading(true)
      await addPriority(newPriority)
      await fetchPrioritiesData()
      setIsAddModalOpen(false)
      setNewPriority({ id: 0, value: '', is_active: true })
      Alert.alert('Success', 'Priority added successfully')
    } catch (error) {
      console.error('Error adding priority:', error)
      Alert.alert('Error', 'Failed to add priority. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleEditPriority = async () => {
    if (!selectedPriority) return
    if (!selectedPriority.value.trim()) {
      Alert.alert('Error', 'Priority name cannot be empty')
      return
    }

    try {
      setLoading(true)
      await updatePriority(selectedPriority)
      await fetchPrioritiesData()
      setIsEditModalOpen(false)
      setSelectedPriority(null)
      Alert.alert('Success', 'Priority updated successfully')
    } catch (error) {
      console.error('Error editing priority:', error)
      Alert.alert('Error', 'Failed to update priority. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusToggle = async (priority: Priority) => {
    try {
      setLoading(true)
      await updatePriority({
        ...priority,
        is_active: !priority.is_active
      })
      await fetchPrioritiesData()
    } catch (error) {
      console.error('Error toggling status:', error)
      Alert.alert('Error', 'Failed to update status. Please try again.')
    } finally {
      setLoading(false)
    }
  }

 

  const openMenu = (id: number) => setMenuVisible(id)
  const closeMenu = () => setMenuVisible(null)

  return (
    <Provider>
      <SafeAreaView style={styles.container}>
      <View style={styles.header}>
  <View style={styles.headerContainer}> 
    <Text style={styles.title}>Priority Management</Text>
  </View>
  <View style={styles.buttonContainer}> 
    <TouchableOpacity 
      style={styles.addButton}
      onPress={() => setIsAddModalOpen(true)}
    >
      <View style={styles.buttonContent}>
        <Icon name="plus" size={16} color="#044086" />
        <Text style={styles.buttonText}>Add Priority</Text>
      </View>
    </TouchableOpacity>
  </View>
</View>
        <ScrollView showsVerticalScrollIndicator={false}>
        <DataTable>
          <DataTable.Header style={styles.tableHeader}>
            <DataTable.Title style={styles.column}>S.No</DataTable.Title>
            <DataTable.Title style={styles.column}>Priority</DataTable.Title>
            <DataTable.Title style={styles.column}>Status</DataTable.Title>
            <DataTable.Title style={styles.column}>Action</DataTable.Title>
          </DataTable.Header>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#007AFF" />
            </View>
          ) : priorities.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No priorities found</Text>
            </View>
          ) : (
            priorities.map((item, index) => (
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
                        setSelectedPriority(item)
                        setIsEditModalOpen(true)
                        closeMenu()
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

        {/* Add Priority Modal */}
        <Modal
          visible={isAddModalOpen}
          transparent={true}
          animationType="fade"
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Add Priority</Text>
              <View style={styles.modalBody}>
                <Text style={styles.label}>Priority Name</Text>
                <TextInput
                  style={styles.input}
                  value={newPriority.value}
                  onChangeText={(text) => setNewPriority({ ...newPriority, value: text })}
                  placeholder="Enter priority name"
                  editable={!loading}
                />
                <View style={styles.switchContainer}>
                  <Text style={styles.label}>Status</Text>
                  <Switch
                    value={newPriority.is_active}
                    onValueChange={(value) => setNewPriority({ ...newPriority, is_active: value })}
                    disabled={loading}
                  />
                </View>
              </View>
              <View style={styles.modalFooter}>
  <TouchableOpacity
    onPress={() => setIsAddModalOpen(false)}
    disabled={loading}
    style={[
      { 
        marginRight: 12, 
        backgroundColor: '#ddd', 
        paddingVertical: 8, 
        paddingHorizontal: 16, 
        borderRadius: 5 
      },
      loading && { backgroundColor: '#ccc' }  // For when loading is true
    ]}
  >
    <Text style={{ color: '#000', textAlign: 'center' }}>Cancel</Text>
  </TouchableOpacity>

  <TouchableOpacity
    onPress={handleAddPriority}
    disabled={loading || !newPriority.value.trim()}
    style={[
      { 
        backgroundColor: '#044086', 
        paddingVertical: 8, 
        paddingHorizontal: 16, 
        borderRadius: 5 
      },
      (loading || !newPriority.value.trim()) && { backgroundColor: '#044086' }  // For when button is disabled
    ]}
  >
    <Text style={{ color: 'white', textAlign: 'center' }}>
      {loading ? 'Adding...' : 'Add Priority'}
    </Text>
  </TouchableOpacity>
</View>

            </View>
          </View>
        </Modal>

        {/* Edit Priority Modal */}
        <Modal
          visible={isEditModalOpen}
          transparent={true}
          animationType="fade"
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Edit Priority</Text>
              <View style={styles.modalBody}>
                <Text style={styles.label}>Priority Name</Text>
                <TextInput
                  style={styles.input}
                  value={selectedPriority?.value || ''}
                  onChangeText={(text) => setSelectedPriority(prev => prev ? { ...prev, value: text } : null)}
                  placeholder="Enter priority name"
                  editable={!loading}
                />
                <View style={styles.switchContainer}>
                  <Text style={styles.label}>Status</Text>
                  <Switch
                    value={selectedPriority?.is_active || false}
                    onValueChange={(value) => setSelectedPriority(prev => prev ? { ...prev, is_active: value } : null)}
                    disabled={loading}
                  />
                </View>
              </View>
              <View style={styles.modalFooter}>
  {/* Cancel Button */}
  <TouchableOpacity 
    style={[styles.button, { backgroundColor: '#ddd',marginRight: 20 }]} 
    onPress={() => setIsEditModalOpen(false)} 
    disabled={loading}
  >
    <Text style={[styles.buttonText, { color: '#000' , }]}>Cancel</Text>
  </TouchableOpacity>

  {/* Save Changes Button */}
  <TouchableOpacity 
    style={[styles.button, { backgroundColor: loading ? '#bbb' : '#044086' }]} 
    onPress={handleEditPriority}
    disabled={loading || !selectedPriority?.value.trim()}
  >
    <Text style={[styles.buttonText, { color: '#fff' }]}>
      {loading ? 'Saving...' : 'Save Changes'}
    </Text>
  </TouchableOpacity>
</View>
            </View>
          </View>
        </Modal>

        {/* Delete Priority Modal */}
    
      </SafeAreaView>
    </Provider>
  )
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
    fontSize: 12,
    textTransform: 'capitalize',
  },
  activeText: {
    color: '#000',
    fontSize:14
  },
  inactiveText: {
    color: '#000',
    fontSize:14
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
    marginRight:12
  },
  modalSubText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  label: {
    fontSize: 16,
    fontWeight: '500',

    marginRight:12
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
    backgroundColor: '#ddd', // Or your desired cancel button color
  },
  saveButton: {
    backgroundColor: '#044086', // Or your desired save button color
  },
})
