import React, {useEffect, useState,forwardRef, useImperativeHandle } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';

import { ScrollView } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Ionicons';
import {GetNestedDepartments} from '../database/NestedDept';

const RecursiveDropdown = ({
  items,
  selectedItems,
  toggleSelect,
  expandedParents,
  toggleExpanded,
  hoveredItem,
  setHoveredItem,
}) => {
  return (
    <View style={styles.levelContainer}>
      {items.map(item => (
        <View
          key={item.department_id}
          style={[
            styles.dropdownItem,
            hoveredItem === item.department_id && styles.hoverHighlight,
          ]}
          onTouchStart={() => setHoveredItem(item.department_id)}
          onTouchEnd={() => setHoveredItem(null)}>
          <View style={styles.itemHeader}>
            {/* Checkbox for selection */}
            <TouchableOpacity
              onPress={() => toggleSelect(item)}
              style={styles.expandableIcon}>
              <View
                style={[
                  styles.checkbox,
                  selectedItems.includes(item.department_id) &&
                    styles.checkboxSelected,
                ]}
              />
            </TouchableOpacity>

            {/* Text acts as an expand/collapse trigger */}
            <TouchableOpacity
              onPress={() => toggleExpanded(item.department_id)}
              style={styles.textContainer}>
              <Text style={styles.itemText}>{item.department_name}</Text>
            </TouchableOpacity>

            {/* Expandable icon for expand/collapse */}
            {Array.isArray(item.sub_departments) &&
              item.sub_departments.length > 0 && (
                <TouchableOpacity
                  onPress={() => toggleExpanded(item.department_id)}
                  style={styles.expandableIcon}>
                  <Text style={styles.arrow}>
                    {expandedParents.includes(item.department_id) ? '-' : '+'}
                  </Text>
                </TouchableOpacity>
              )}
          </View>

          {/* Recursive rendering for nested items */}
          {Array.isArray(item.sub_departments) &&
            item.sub_departments.length > 0 &&
            expandedParents.includes(item.department_id) && (
              <View style={styles.nestedContainer}>
                <RecursiveDropdown
                  items={item.sub_departments}
                  selectedItems={selectedItems}
                  toggleSelect={toggleSelect}
                  expandedParents={expandedParents}
                  toggleExpanded={toggleExpanded}
                  hoveredItem={hoveredItem}
                  setHoveredItem={setHoveredItem}
                />
              </View>
            )}
        </View>
      ))}
    </View>
  );
};

const NestedMultiselectDropdown = forwardRef(({ onSelectionChange, editGoal }, ref) => {
  const [dept, setDept] = useState<[]>([]);

  const FetchDept = async () => {
    try {
      console.log('Fetching departments...'); // Log start of fetch

      // Fetch data from the API
      const response = await GetNestedDepartments('');
      console.log('Raw response:', response); // Log raw response for inspection

      // Check and parse response
      const parsedRes =
        typeof response === 'string' ? JSON.parse(response) : response;
      console.log('Parsed response:', parsedRes); // Log parsed response to check structure

      // Since response directly contains the department array
      if (Array.isArray(parsedRes)) {
        setDept(parsedRes); // Directly set the response array to dept
        console.log('Departments successfully set:', parsedRes); // Log success
      } else {
        console.error(
          'Failed to fetch departments: Unexpected response structure',
          parsedRes,
        );
      }
    } catch (err) {
      console.error('Error Fetching Departments:', err); // Log error if fetch fails
    }
  };

  useEffect(() => {
    FetchDept();
  }, []);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [expandedParents, setExpandedParents] = useState<number[]>([]);
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const toggleSelect = item => {
    setSelectedItems(prevSelected => {
      const updatedSelected = prevSelected.includes(item.department_id)
        ? prevSelected.filter(id => id !== item.department_id)
        : [...prevSelected, item.department_id];

      // Notify the parent about the updated selection
      onSelectionChange(updatedSelected);

      return updatedSelected;
    });
  };

  const toggleExpanded = parentId => {
    setExpandedParents(prev =>
      prev.includes(parentId)
        ? prev.filter(id => id !== parentId)
        : [...prev, parentId],
    );
  };
  const flattenDepartments = departments => {
    const flatList = [];

    const traverse = nodes => {
      nodes.forEach(node => {
        flatList.push(node);
        if (node.sub_departments && node.sub_departments.length) {
          traverse(node.sub_departments);
        }
      });
    };

    traverse(departments);
    return flatList;
  };

  const getSelectedNames = () => {
    // Flatten the department hierarchy
    const flatDepartments = flattenDepartments(dept);

    return selectedItems
      .map(id => {
        const department = flatDepartments.find(d => d.department_id === id);
        return department ? department.department_name : null;
      })
      .filter(name => name !== null) // Remove null values
      .join(', '); // Join names with a comma
  };

  const getAlreadySelectedNames = () => {
    if (editGoal && editGoal.stakeholder_names) {
      // Use editGoal names if in edit mode
      return editGoal.stakeholder_names;
    }
  };

  const handleDismiss = () => {
    console.log('Dismiss triggered');
    if (dropdownVisible) {
      setDropdownVisible(false);
    }
  };

  useImperativeHandle(ref, () => ({
    dismissDropdown: () => {
      setDropdownVisible(false);
    },
  }));

  return (
    <TouchableWithoutFeedback onPress={handleDismiss} accessible={false}>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.selectItemField}
          onPress={() => setDropdownVisible(!dropdownVisible)}>
          <Text style={styles.input}>
            {editGoal
              ? getAlreadySelectedNames() // Call this if editGoal is not null
              : selectedItems.length
              ? getSelectedNames() // Otherwise, display dynamically selected names
              : 'Select Department'}
          </Text>
          <Icon
            name={dropdownVisible ? 'chevron-up' : 'chevron-down'}
            size={20}
            color="#333"
          />
        </TouchableOpacity>

        {dropdownVisible && (
          <ScrollView style={styles.scrollContainer}>
            <RecursiveDropdown
              items={dept} // Ensure data is an array
              selectedItems={selectedItems}
              toggleSelect={toggleSelect}
              expandedParents={expandedParents}
              toggleExpanded={toggleExpanded}
              hoveredItem={hoveredItem}
              setHoveredItem={setHoveredItem}
            />
          </ScrollView>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  selectItemField: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 5,
  },
  selectItemText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  input: {
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    backgroundColor: 'white',
    color: '#000',
    borderBottomWidth: 1.5,
    borderBottomColor: '#044086',
    borderWidth: 0,
    outlineStyle: 'none',
    width: '100%',
  },
  arrow: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  scrollContainer: {
    position: 'absolute',
    bottom: '100%', // Position dropdown above the input
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    zIndex: 1, // Ensure it is on top of other components
    maxHeight: 100, // Optional: Limit the height of the dropdown
    overflow: 'auto', // Optional: Allow scrolling if content exceeds maxHeight
    flexgrow:1,
  },
  levelContainer: {
    paddingLeft: 16,
  },
  dropdownItem: {
    marginBottom: 8,
    borderRadius: 5,
    overflow: 'hidden',
  },
  hoverHighlight: {
    backgroundColor: '#e0f7fa',
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  expandableIcon: {
    marginRight: 8,
  },
  textContainer: {
    flex: 1,
  },
  itemText: {
    fontSize: 16,
    color: '#333',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 3,
    backgroundColor: '#fff',
  },
  checkboxSelected: {
    backgroundColor: '#333',
  },
  nestedContainer: {
    marginTop: 4,
    paddingLeft: 16,
    borderLeftWidth: 1,
    borderLeftColor: '#ddd',
  },
});

export default NestedMultiselectDropdown;