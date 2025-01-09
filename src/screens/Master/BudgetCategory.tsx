import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Modal ,Alert} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { DataTable, Menu } from 'react-native-paper';
import { insertOrUpdateBudget, BudgetCategoryData, insertForgeBudgetCategory } from '../../database/BudgetCategory';

interface CategoryItem {
  category_id: string;
  category: string;
  subcategories: string[];
  menuVisible: boolean;
}

const BudgetCategory: React.FC = () => {
  const [categoryItems, setCategoryItems] = useState<CategoryItem[]>([]);
  const [newCategory, setNewCategory] = useState<string>('');
  const [newSubcategory, setNewSubcategory] = useState<string>('');
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const addCategory = async () => {
    if (newCategory.trim()) {
      setIsLoading(true);
      try {
        // First insert into Forge API
        const forgeData: BudgetCategoryData = {
          category_id: categoryItems,
          category_name: newCategory.trim(),
          sub_category_id: 0,
          sub_category_name: '',
        };
        const forgeResult = await insertForgeBudgetCategory(forgeData);


        const budgetResult = await insertOrUpdateBudget(forgeData);

        const newCategoryItem: CategoryItem = {
          id: JSON.parse(budgetResult).id?.toString() || Date.now().toString(),
          category: newCategory.trim(),
          subcategories: [],
          menuVisible: false,
        };

        setCategoryItems([...categoryItems, newCategoryItem]);
        setNewCategory('');
      } catch (error) {
        console.error('Error adding category:', error);
        Alert.alert('Error', 'Failed to add category. Please try again.');
      } finally {
        setIsLoading(false);
        setModalVisible(false);
      }
    }
  };

  const addSubcategory = async () => {
    if (!selectedCategory || !newSubcategory.trim()) {
      Alert.alert('Error', 'Please select a category and enter a subcategory name');
      return;
    }

    setIsLoading(true);
    try {
      const category = categoryItems.find(item => item.category === selectedCategory);
      if (!category) return;

      const data: BudgetCategoryData = {
        category_id: parseInt(category.id),
        category_name: selectedCategory,
        sub_category_id: 0, // New subcategory
        sub_category_name: newSubcategory.trim(),
      };

      const result = await insertOrUpdateBudget(data);
      const parsedResult = JSON.parse(result);

      setCategoryItems(items =>
        items.map(item =>
          item.id === category.id
            ? {
                ...item,
                subcategories: [...item.subcategories, newSubcategory.trim()],
              }
            : item
        )
      );

      setNewSubcategory('');
      setSelectedCategory(null);
    } catch (error) {
      console.error('Error adding subcategory:', error);
      Alert.alert('Error', 'Failed to add subcategory. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };


  const toggleMenu = (id: string) => {
    setCategoryItems(items =>
      items.map(item =>
        item.id === id ? { ...item, menuVisible: !item.menuVisible } : item
      )
    );
  };

  const handleEdit = (item: CategoryItem) => {
    // Implement edit functionality
    console.log('Edit', item);
  };

  const handleDelete = (id: string) => {
    setCategoryItems(items => items.filter(item => item.id !== id));
  };

  const renderItem = ({ item, index }: { item: CategoryItem; index: number }) => (
    <DataTable.Row>
      <DataTable.Cell style={styles.cell}>{index + 1}</DataTable.Cell>
      <DataTable.Cell style={styles.cell}>{item.category}</DataTable.Cell>
      <DataTable.Cell style={styles.cell}>{item.subcategories.join(', ')}</DataTable.Cell>
      <DataTable.Cell style={styles.cell}>
        <Menu
          visible={item.menuVisible}
          onDismiss={() => toggleMenu(item.id)}
          anchor={
            <TouchableOpacity onPress={() => toggleMenu(item.id)}>
              <Icon name="dots-vertical" size={20} color="#044086" />
            </TouchableOpacity>
          }
        >
          <Menu.Item onPress={() => handleEdit(item)} title="Edit" />
          <Menu.Item onPress={() => handleDelete(item.id)} title="Delete" />
        </Menu>
      </DataTable.Cell>
    </DataTable.Row>
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
        <TouchableOpacity 
          style={styles.addButton} 
          onPress={selectedCategory ? addSubcategory : () => setModalVisible(true)}
        >
          <View style={styles.iconWithText}>
            <Text style={styles.addText}>Add</Text>
          </View>
        </TouchableOpacity>
      </View>
      <TextInput
        style={styles.subcategoryInput}
        placeholder="Enter Subcategory"
        value={newSubcategory}
        onChangeText={setNewSubcategory}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={addSubcategory}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => setNewSubcategory('')}>
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
      
      <DataTable>
        <DataTable.Header style={styles.tableHeader}>
          <DataTable.Title style={styles.headerCell}>S.No</DataTable.Title>
          <DataTable.Title style={styles.headerCell}>Category</DataTable.Title>
          <DataTable.Title style={styles.headerCell}>Subcategory</DataTable.Title>
          <DataTable.Title style={styles.headerCell}>Action</DataTable.Title>
        </DataTable.Header>
        {categoryItems.map((item, index) => renderItem({ item, index }))}
      </DataTable>

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
              <TouchableOpacity style={styles.modalButton} onPress={() => setModalVisible(false)}>
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
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 10,
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#044086',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  tableHeader: {
    borderRadius: 10,
    marginBottom: 10,
  },
  headerCell: {
    justifyContent: 'center',
  },
  cell: {
    justifyContent: 'center',
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
    borderRadius: 12,
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
    marginHorizontal: 10,
  },
  modalAddButton: {
    backgroundColor: '#044086',
    borderColor: '#044086',
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

