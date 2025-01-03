import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput, Modal } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { DataTable } from 'react-native-paper';

interface CategoryItem {
  id: string;
  category: string;
  subcategories: string[];
}

const BudgetCategory: React.FC = () => {
  const [categoryItems, setCategoryItems] = useState<CategoryItem[]>([]);
  const [newCategory, setNewCategory] = useState<string>('');
  const [newSubcategory, setNewSubcategory] = useState<string>('');
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const addCategory = () => {
    if (newCategory.trim()) {
      const newItem: CategoryItem = {
        id: Date.now().toString(),
        category: newCategory.trim(),
        subcategories: [],
      };
      setCategoryItems([...categoryItems, newItem]);
      setNewCategory('');
    }
  };

  const addSubcategory = () => {
    if (selectedCategory && newSubcategory.trim()) {
      setCategoryItems(categoryItems.map(item => 
        item.category === selectedCategory
          ? { ...item, subcategories: [...item.subcategories, newSubcategory.trim()] }
          : item
      ));
      setNewSubcategory('');
    }
  };

  const renderItem = ({ item, index }: { item: CategoryItem; index: number }) => (
    <View style={styles.listItem}>
      <Text style={styles.listItemText}>{index + 1}</Text>
      <Text style={styles.listItemText}>{item.category}</Text>
      <Text style={styles.listItemText}>{item.subcategories.join(', ')}</Text>
      <TouchableOpacity style={styles.actionButton}>
        <Icon name="dots-vertical" size={20} color="#044086" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Budget Categories</Text>
      <View style={styles.inputContainer}>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedCategory}
            style={styles.picker}
            onValueChange={(itemValue) => setSelectedCategory(itemValue)}
          >
            <Picker.Item label="Select Category" value={null} />
            {categoryItems.map((item) => (
              <Picker.Item key={item.id} label={item.category} value={item.category} />
            ))}
          </Picker>
        </View>
        <View style={styles.iconWithText}>
            <Text style={styles.addText}>Add</Text>
          </View>
          </View>
        <TextInput
          style={styles.subcategoryInput}
          placeholder="Enter Subcategory"
          value={newSubcategory}
          onChangeText={setNewSubcategory}
        />
        <button>Submit</button>
        <button>Cancel</button>
        <TouchableOpacity 
          style={styles.addButton} 
          onPress={selectedCategory ? addSubcategory : () => setModalVisible(true)}
        >
       
        </TouchableOpacity>
    
      <DataTable.Header style={styles.tableHeader}>
        <DataTable.Title style={styles.headerText}>S.No</DataTable.Title>
        <DataTable.Title style={styles.headerText}>Category</DataTable.Title>
        <DataTable.Title style={styles.headerText}>Subcategory</DataTable.Title>
        <DataTable.Title style={styles.headerText}>Action</DataTable.Title>
      </DataTable.Header>
      <FlatList
        data={categoryItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
      <Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Category</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Enter category"
              value={newCategory}
              onChangeText={setNewCategory}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalButton2} onPress={() => setModalVisible(false)}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalAddButton]}
                onPress={() => {
                  addCategory();
                  setModalVisible(false);
                }}
              >
                <Text style={styles.modalButtonText2}>Add</Text>
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
    flex: 1,
    backgroundColor: '#f0f0f0',
    paddingRight: 250,
    paddingLeft: 250
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'center',
  },
  pickerContainer: {
    flex: 1,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
  },
  picker: {
    height: 50,
  },
  subcategoryInput: {
    flex: 1,
  
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 15,
    marginLeft: 10,
    marginRight: 10,
  },
  addButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconWithText: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#044086',
  },
  tableHeader: {
   
    borderRadius: 10,
    marginBottom: 10,
  },
  headerText: {
    fontWeight: 'bold',
    color: '#fff',
  },
  listContainer: {
    paddingBottom: 20,
  },
  listItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    marginBottom: 5,
    alignItems: 'center',
  },
  listItemText: {
    flex: 1,
    textAlign: 'center',
  },
  actionButton: {
    padding: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '25%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#044086',
    marginBottom: 15,
  },
  modalInput: {
    width: '100%',
    height: 50,
    backgroundColor: '#f0f0f0',
    borderRadius:12,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#757575',
    marginRight: 20,
  },
  modalButton2: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#757575',
    marginRight: 20,
  },
  modalAddButton: {
    backgroundColor: '#044086',
  },
  modalButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalButtonText2: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default BudgetCategory;

