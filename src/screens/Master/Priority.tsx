import React, { useState, useEffect, useMemo } from 'react'
import {
  View,
  StyleSheet,
  TextInput,
  SafeAreaView,
  TouchableOpacity,
  Button,
  Switch,
  Modal 
} from 'react-native'
import { DataTable, Text, Menu, Provider } from 'react-native-paper'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { fetchPriorities, updatePriority, addPriority, deletePriority, Priority, NewPriority, SortOrder } from '../../database/Master'

export default function PriorityScreen() {
  const [priorities, setPriorities] = useState<Priority[]>([]);
  const [searchQuery, setSearchQuery] = useState('')
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc')
  const [menuVisible, setMenuVisible] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedPriority, setSelectedPriority] = useState<Priority | null>(null)
  const [NewPriority, setNewPriority] = useState<NewPriority>({
    id: 0,
    value: '',
    is_active: true
  })
  interface NewPriority {
    id: number;
    value: string;
    is_active: boolean;
  }
  const fetchPrioritiesData = async () => {
    try {
      setLoading(true);
      const data = await fetchPriorities(); 
      setPriorities(data);
    } catch (error) {
      console.error('Error fetching priorities:', error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchPrioritiesData();
  }, []);

  const handleAddPriority = async () => {
    try {
      setLoading(true);
      await addPriority(NewPriority);
      await fetchPrioritiesData();
      setIsAddModalOpen(false);
      setNewPriority({ id: 0, value: '', is_active: true });
    } catch (error) {
      console.error('Error adding priority:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditPriority = async () => {
    if (!selectedPriority) return

    try {
      setLoading(true)
      await updatePriority(selectedPriority)
      await fetchPrioritiesData()
      setIsEditModalOpen(false)
      setSelectedPriority(null)
    } catch (error) {
      console.error('Error editing priority:', error)
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
    } finally {
      setLoading(false)
    }
  }

  const sortedAndFilteredData = useMemo(() => {
    let result = [...priorities]
    
    if (searchQuery) {
      result = result.filter(item => 
        item.value.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    
    result.sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.value.localeCompare(b.value)
      }
      return b.value.localeCompare(a.value)
    })
    
    return result
  }, [priorities, searchQuery, sortOrder])

  const openMenu = (id: number) => setMenuVisible(id)
  const closeMenu = () => setMenuVisible(null)

  return (
    <Provider>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Priority Management</Text>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => setIsAddModalOpen(true)}
          >
            <View style={styles.buttonContent}>
              <Icon name="plus" size={16} color="#fff" />
              <Text style={styles.buttonText}>Add Priority</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search priorities..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#666"
          />
        </View>

        <DataTable>
          <DataTable.Header style={styles.tableHeader}>
            <DataTable.Title style={styles.column}>S.No</DataTable.Title>
            <DataTable.Title style={styles.column}>Priority</DataTable.Title>
            <DataTable.Title style={styles.column}>Status</DataTable.Title>
            <DataTable.Title style={styles.column}>Action</DataTable.Title>
          </DataTable.Header>

          {sortedAndFilteredData.map((item, index) => (
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
                  <Menu.Item 
                    onPress={() => {
                      setSelectedPriority(item)
                      setIsDeleteModalOpen(true)
                      closeMenu()
                    }} 
                    title="Delete" 
                  />
                </Menu>
              </DataTable.Cell>
            </DataTable.Row>
          ))}
        </DataTable>

        {/* Add Priority Modal */}
        <Modal
          visible={isAddModalOpen}
          transparent={true}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Add Priority</Text>
              <View style={styles.modalBody}>
                <Text style={styles.label}>Priority Name</Text>
                <TextInput
                  style={styles.input}
                  value={NewPriority.value}
                  onChangeText={(text) => setNewPriority({ ...NewPriority, value: text })}
                  placeholder="Enter priority name"
                />
                <View style={styles.switchContainer}>
                  <Text style={styles.label}>Status</Text>
                  <Switch
                    value={NewPriority.is_active}
                    onValueChange={(value) => setNewPriority({ ...NewPriority, is_active: value })}
                  />
                </View>
              </View>
              <View style={styles.modalFooter}>
                <Button
                  title="Cancel"
                  onPress={() => setIsAddModalOpen(false)}
                  color="#666"
                />
                <Button
                  title={loading ? 'Adding...' : 'Add Priority'}
                  onPress={handleAddPriority}
                  disabled={loading}
                />
              </View>
            </View>
          </View>
        </Modal>

        {/* Edit Priority Modal */}
        <Modal
          visible={isEditModalOpen}
          transparent={true}
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
                />
                <View style={styles.switchContainer}>
                  <Text style={styles.label}>Status</Text>
                  <Switch
                    value={selectedPriority?.is_active || false}
                    onValueChange={(value) => setSelectedPriority(prev => prev ? { ...prev, is_active: value } : null)}
                  />
                </View>
              </View>
              <View style={styles.modalFooter}>
                <Button
                  title="Cancel"
                  onPress={() => setIsEditModalOpen(false)}
                  color="#666"
                />
                <Button
                  title={loading ? 'Saving...' : 'Save Changes'}
                  onPress={handleEditPriority}
                  disabled={loading}
                />
              </View>
            </View>
          </View>
        </Modal>

        {/* Delete Priority Modal */}
        <Modal
          visible={isDeleteModalOpen}
          transparent={true}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Delete Priority</Text>
              <View style={styles.modalBody}>
                <Text style={styles.modalText}>Are you sure you want to delete this priority?</Text>
              </View>
              <View style={styles.modalFooter}>
                <Button
                  title="Cancel"
                  onPress={() => setIsDeleteModalOpen(false)}
                  color="#666"
                />
                <Button
                  title={loading ? 'Deleting...' : 'Delete'}
                  onPress={async () => {
                    if (selectedPriority) {
                      try {
                        setLoading(true)
                        await deletePriority(selectedPriority)
                        await fetchPrioritiesData()
                        setIsDeleteModalOpen(false)
                        setSelectedPriority(null)
                      } catch (error) {
                        console.error('Error deleting priority:', error)
                      } finally {
                        setLoading(false)
                      }
                    }
                  }}
                  disabled={loading}
                  color="red"
                />
              </View>
            </View>
          </View>
        </Modal>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
  },
  addButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 8,
  },
  searchContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e1e1',
    backgroundColor: '#fff',
  },
  searchInput: {
    padding: 8,
    fontSize: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 12,
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
    backgroundColor: '#e6f4ea',
  },
  inactiveBadge: {
    backgroundColor: '#f1f3f4',
  },
  statusText: {
    fontSize: 12,
    textTransform: 'capitalize',
  },
  activeText: {
    color: '#137333',
  },
  inactiveText: {
    color: '#5f6368',
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
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
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
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#e1e1e1',
    paddingTop: 16,
  },
})

