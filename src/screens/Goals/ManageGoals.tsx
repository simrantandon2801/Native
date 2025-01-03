import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, FlatList } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface CategoryItem {
  id: string;
  category: string;
  subcategory: string;
}

const BudgetCategory: React.FC = () => {
  const [category, setCategory] = useState<string>('');
  const [subcategory, setSubcategory] = useState<string>('');
  const [categories, setCategories] = useState<string[]>(['Food', 'Transportation', 'Entertainment', 'Utilities', 'Other']);
  const [categoryItems, setCategoryItems] = useState<CategoryItem[]>([]);

  const addCategoryItem = () => {
    if (category && subcategory) {
      const newItem: CategoryItem = {
        id: Date.now().toString(),
        category,
        subcategory,
      };
      setCategoryItems([...categoryItems, newItem]);
      setCategory('');
      setSubcategory('');
    }
  };

  const renderItem = ({ item, index }: { item: CategoryItem; index: number }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{index + 1}</Text>
      <Text style={styles.cell}>{item.category}</Text>
      <Text style={styles.cell}>{item.subcategory}</Text>
      <TouchableOpacity style={styles.actionButton}>
        <Icon name="dots-vertical" size={24} color="#044086" />
      </TouchableOpacity>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Budget Category</Text>

      <View style={styles.inputContainer}>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={category}
            onValueChange={(itemValue) => setCategory(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Select Category" value="" />
            {categories.map((cat, index) => (
              <Picker.Item key={index} label={cat} value={cat} />
            ))}
          </Picker>
        </View>
        <TextInput
          style={styles.input}
          placeholder="Enter Subcategory"
          value={subcategory}
          onChangeText={setSubcategory}
        />
        <TouchableOpacity style={styles.addButton} onPress={addCategoryItem}>
          <Text style={styles.buttonText}>Add</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tableContainer}>
        <View style={styles.tableHeader}>
          <Text style={styles.headerCell}>S.No.</Text>
          <Text style={styles.headerCell}>Categories</Text>
          <Text style={styles.headerCell}>SubCategories</Text>
          <Text style={styles.headerCell}>Action</Text>
        </View>
        <FlatList
          data={categoryItems}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, styles.submitButton]}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.cancelButton]}>
          <Text style={styles.buttonText1}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#f5f5f5',
  },
  heading: {
    fontSize: 24,
    fontFamily: 'Outfit',
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#044086',
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'center',
  },
  pickerContainer: {
    flex: 2,
    height: 50,
    backgroundColor: '#fff',
    marginRight: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    justifyContent: 'center',
  },
  picker: {
    height: 50,
  },
  input: {
    flex: 2,
    height: 50,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    marginRight: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  addButton: {
    backgroundColor: '#044086',
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  tableContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 20,
    elevation: 3,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#044086',
    padding: 10,
  },
  headerCell: {
    flex: 1,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'Outfit',
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    padding: 10,
  },
  cell: {
    flex: 1,
    textAlign: 'center',
    fontFamily: 'Outfit',
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  button: {
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    minWidth: 120,
    marginHorizontal: 10,
  },
  submitButton: {
    backgroundColor: '#044086',
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: '#C4C4C4',
    backgroundColor: 'transparent',
  },
  buttonText: {
    color: '#fff',
    fontFamily: 'Outfit',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonText1: {
    color: '#000',
    fontFamily: 'Outfit',
    fontSize: 16,
  },
});

export default BudgetCategory;

