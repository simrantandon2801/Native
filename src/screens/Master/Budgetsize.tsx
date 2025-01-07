import React, { useState, useEffect } from 'react'
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
} from 'react-native'
import { DataTable, Text, Menu, Provider } from 'react-native-paper'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { fetchBudgetSizes, updateBudgetSize, addBudgetSize, BudgetSize } from '../../database/Masters'
import { ScrollView } from 'react-native-gesture-handler'

interface NewBudgetSize {
  id: number;
  value: string;
  is_active: boolean;
}

export default function BudgetSizeComponent() {
  const [budgetSizes, setBudgetSizes] = useState<BudgetSize[]>([])
  const [menuVisible, setMenuVisible] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedBudgetSize, setSelectedBudgetSize] = useState<BudgetSize | null>(null)
  const [newBudgetSize, setNewBudgetSize] = useState<NewBudgetSize>({
    id: 0,
    value: '',
    is_active: true
  })

  const fetchBudgetSizesData = async () => {
    try {
      setLoading(true);
      const response = await fetchBudgetSizes();
      setBudgetSizes(response);
    } catch (error) {
      console.error('Error fetching budget sizes:', error);
      Alert.alert('Error', 'Failed to fetch budget sizes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgetSizesData()
  }, [])

  const handleAddBudgetSize = async () => {
    if (!newBudgetSize.value.trim()) {
      Alert.alert('Error', 'Budget size cannot be empty')
      return
    }

    try {
      setLoading(true)
      await addBudgetSize(newBudgetSize)
      await fetchBudgetSizesData()
      setIsAddModalOpen(false)
      setNewBudgetSize({ id: 0, value: '', is_active: true })
      Alert.alert('Success', 'Budget size added successfully')
    } catch (error) {
      console.error('Error adding budget size:', error)
      Alert.alert('Error', 'Failed to add budget size. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleEditBudgetSize = async () => {
    if (!selectedBudgetSize) return
    if (!selectedBudgetSize.value.trim()) {
      Alert.alert('Error', 'Budget size cannot be empty')
      return
    }

    try {
      setLoading(true)
      await updateBudgetSize(selectedBudgetSize)
      await fetchBudgetSizesData()
      setIsEditModalOpen(false)
      setSelectedBudgetSize(null)
      Alert.alert('Success', 'Budget size updated successfully')
    } catch (error) {
      console.error('Error editing budget size:', error)
      Alert.alert('Error', 'Failed to update budget size. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusToggle = async (budgetSize: BudgetSize) => {
    if (budgetSize.is_active) return;
    try {
      setLoading(true)
      await updateBudgetSize({
        ...budgetSize,
        is_active: !budgetSize.is_active
      })
      await fetchBudgetSizesData()
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
            <Text style={styles.title}>Budget Size</Text>
          </View>
          <View style={styles.buttonContainer}> 
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => setIsAddModalOpen(true)}
            >
              <View style={styles.buttonContent}>
                <Icon name="plus" size={16} color="#044086" />
                <Text style={styles.buttonText}>Add Budget Size</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
          <DataTable>
            <DataTable.Header style={styles.tableHeader}>
              <DataTable.Title style={styles.column}>S.No</DataTable.Title>
              <DataTable.Title style={styles.column}>Budget Size</DataTable.Title>
              <DataTable.Title style={styles.column}>Status</DataTable.Title>
              <DataTable.Title style={styles.column}>Action</DataTable.Title>
            </DataTable.Header>

            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
              </View>
            ) : budgetSizes.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No Budget Sizes found</Text>
              </View>
            ) : (
              budgetSizes.map((item, index) => (
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
                          setSelectedBudgetSize(item)
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

        {/* Add Budget Size Modal */}
        <Modal
          visible={isAddModalOpen}
          transparent={true}
          animationType="fade"
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Add Budget Size</Text>
              <View style={styles.modalBody}>
                <Text style={styles.label1}>Budget Size</Text>
                <TextInput
                  style={styles.input}
                  value={newBudgetSize.value}
                  onChangeText={(text) => setNewBudgetSize({ ...newBudgetSize, value: text })}
                  placeholder="Enter budget size"
                  editable={!loading}
                />
                <View style={styles.switchContainer}>
                  <Text style={styles.label}>Status</Text>
                  <Switch
                    value={newBudgetSize.is_active}
                    onValueChange={(value) => setNewBudgetSize({ ...newBudgetSize, is_active: value })}
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
                  onPress={handleAddBudgetSize}
                  disabled={loading || !newBudgetSize.value.trim()}
                  style={[
                    styles.button,
                    styles.saveButton,
                    (loading || !newBudgetSize.value.trim()) && styles.disabledButton
                  ]}
                >
                  <Text style={[styles.buttonText, styles.saveButtonText]}>
                    {loading ? 'Adding...' : 'Add Budget Size'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Edit Budget Size Modal */}
        <Modal
          visible={isEditModalOpen}
          transparent={true}
          animationType="fade"
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Edit Budget Size</Text>
              <View style={styles.modalBody}>
                <Text style={styles.label1}>Budget Size</Text>
                <TextInput
                  style={styles.input}
                  value={selectedBudgetSize?.value || ''}
                  onChangeText={(text) => setSelectedBudgetSize(prev => prev ? { ...prev, value: text } : null)}
                  placeholder="Enter budget size"
                  editable={!loading}
                />
                <View style={styles.switchContainer}>
                  <Text style={styles.label}>Status</Text>
                  <Switch
                    value={selectedBudgetSize?.is_active || false}
                    onValueChange={(value) => setSelectedBudgetSize(prev => prev ? { ...prev, is_active: value } : null)}
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
                    (loading || !selectedBudgetSize?.value.trim()) && styles.disabledButton
                  ]} 
                  onPress={handleEditBudgetSize}
                  disabled={loading || !selectedBudgetSize?.value.trim()}
                >
                  <Text style={[styles.buttonText, styles.saveButtonText]}>
                    {loading ? 'Saving...' : 'Save Changes'}
                  </Text>
                </TouchableOpacity>
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
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContainer: {
    alignItems: 'center',
  },
  buttonContainer: {
    marginTop: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
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
    alignItems:'center'
  },
  modalBody: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginHorizontal:12,
    marginBottom:12
  },
  label1: {
    fontSize: 16,
    fontWeight: '500',
    marginHorizontal:12,
    marginBottom:12
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
   
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    minWidth: 80,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f3f4f6',
  },
  saveButton: {
    backgroundColor: '#044086',
  },
  disabledButton: {
    opacity: 0.5,
  },
  saveButtonText: {
    color: '#ffffff',
  },
})

