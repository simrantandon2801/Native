import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const BudgetCategory: React.FC = () => {
  
  const [dropdownData, setDropdownData] = useState<string[]>([]);
  const [newDropdownItem, setNewDropdownItem] = useState('');
  const [fieldValues, setFieldValues] = useState({
    fieldName: '',
    dataType: '',
  });

  const handleFieldNameChange = (value) => {
    setFieldValues({ ...fieldValues, fieldName: value });
  };

  const handleDataTypeChange = (value) => {
    setFieldValues({ ...fieldValues, dataType: value });
  };


  const addDropdownItem = () => {
    if (newDropdownItem) {
      setDropdownData([...dropdownData, newDropdownItem]);
      setNewDropdownItem('');
    }
  };

  const removeDropdownItem = (index: number) => {
    const newData = dropdownData.filter((_, i) => i !== index);
    setDropdownData(newData);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Custom / Additional Fields</Text>
      
      <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>
            Name of Field <Text style={styles.asterisk}>*</Text>
          </Text>
          <Picker
            selectedValue={fieldValues.fieldName}
            onValueChange={handleFieldNameChange}
            style={styles.input}
            mode="dropdown"
          >
            <Picker.Item label="Select" value="" />
            <Picker.Item label="Yes" value="yes" />
            <Picker.Item label="No" value="no" />
          </Picker>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>
            Data Type <Text style={styles.asterisk}>*</Text>
          </Text>
          <Picker
            selectedValue={fieldValues.dataType}
            onValueChange={handleDataTypeChange}
            style={styles.input}
            mode="dropdown"
          >
            <Picker.Item label="Select" value="" />
            <Picker.Item label="Yes" value="yes" />
            <Picker.Item label="No" value="no" />
          </Picker>
        </View>
      </View>
      <View style={styles.dropdownDataContainer}>
        <Text style={styles.dropdownDataHeading}>Dropdown Data</Text>
        {dropdownData.map((item, index) => (
          <View key={index} style={styles.dropdownItem}>
            <Text>{item}</Text>
            <TouchableOpacity onPress={() => removeDropdownItem(index)}>
              <Icon name="close-circle" size={24} color="#B40A0A" />
            </TouchableOpacity>
          </View>
        ))}
        <View style={styles.addDropdownContainer}>
          <View style={styles.addDropdownInputContainer}>
            <Picker
              selectedValue={newDropdownItem}
              onValueChange={(itemValue) => setNewDropdownItem(itemValue)}
              style={styles.input}
            >
              <Picker.Item label="Add new item" value="" />
              <Picker.Item label="Option 1" value="Option 1" />
              <Picker.Item label="Option 2" value="Option 2" />
              <Picker.Item label="Option 3" value="Option 3" />
            </Picker>
          </View>
          <TouchableOpacity style={styles.addButton} onPress={addDropdownItem}>
            <Icon name="plus-circle" size={24} color="#044086" />
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>

    
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingLeft:250,
    paddingRight:250,
   
  
  },
  heading: {
    color: '#000',
    fontFamily: 'Outfit',
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 22,
    textTransform: 'capitalize',
    marginBottom: 40,
    textAlign:'center'
  },
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    borderRadius: 5,
    padding: 10,
    fontSize: 16,

    color: '#000',
    borderBottomWidth: 1.5,
    borderBottomColor: '#044086',
    borderWidth: 0,
    width: '100%',
   
    backgroundColor: 'transparent',
  },
  asterisk: {
    color: 'red',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontFamily:'Inter',
    fontWeight:400,
    color:'#044086'

  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    overflow: 'hidden',
  },
  picker: {
    height: 40,
    width: '100%',
  },
  dropdownDataContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    borderStyle: 'dashed',
    padding: 16,
    marginTop:20
  },
  dropdownDataHeading: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 16,
    color:'#044086',
    textAlign:'center'
  },
  row: {
    flexDirection: 'column', 
    justifyContent: 'space-between', 
  },
  dropdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  addDropdownContainer: {
    flexDirection: 'column',
  
  },
  addDropdownInputContainer: {
    flex: 1,
    // borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    marginRight: 8,
    overflow: 'hidden',
  },
  addDropdownPicker: {
    height: 40,
    width: '100%',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
  border:'1px solid #757575',
    padding: 8,
    borderRadius: 4,
    marginTop:20
  },
  addButtonText: {
    color: '#044086',
    marginLeft: 10,
  },
});

export default BudgetCategory;

