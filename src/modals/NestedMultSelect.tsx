import React, {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
  ScrollView,
} from 'react-native';
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
            <TouchableOpacity
              onPress={() => toggleExpanded(item.department_id)}
              style={styles.textContainer}>
              <Text style={styles.itemText}>{item.department_name}</Text>
            </TouchableOpacity>
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

const NestedMultiselectDropdown = forwardRef(
  ({onSelectionChange, editGoal}, ref) => {
    const [dept, setDept] = useState<[]>([]);
    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    const [expandedParents, setExpandedParents] = useState<number[]>([]);
    const [hoveredItem, setHoveredItem] = useState<number | null>(null);
    const [dropdownVisible, setDropdownVisible] = useState(false);

    const FetchDept = async () => {
      try {
        const response = await GetNestedDepartments('');
        const parsedRes =
          typeof response === 'string' ? JSON.parse(response) : response;
        if (Array.isArray(parsedRes)) {
          setDept(parsedRes);
        } else {
          console.error(
            'Failed to fetch departments: Unexpected response structure',
            parsedRes,
          );
        }
      } catch (err) {
        console.error('Error Fetching Departments:', err);
      }
    };

    useEffect(() => {
      FetchDept();
    }, []);

    useEffect(() => {
      if (editGoal && editGoal.stakeholders) {
        const parsedStakeholders = editGoal.stakeholders
          .split(',')
          .map(id => parseInt(id.trim(), 10));
        setSelectedItems(parsedStakeholders);
      }
    }, [editGoal]);

    const toggleSelect = item => {
      setSelectedItems(prevSelected => {
        const updatedSelected = prevSelected.includes(item.department_id)
          ? prevSelected.filter(id => id !== item.department_id)
          : [...prevSelected, item.department_id];

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
      const flatDepartments = flattenDepartments(dept);
      return selectedItems
        .map(id => {
          const department = flatDepartments.find(d => d.department_id === id);
          return department ? department.department_name : null;
        })
        .filter(name => name !== null)
        .join(', ');
    };

    const getAlreadySelectedNames = () => {
      if (editGoal && editGoal.stakeholders) {
        const selectedIDs = editGoal.stakeholders
          .split(',')
          .map(id => parseInt(id, 10));
        const flatDepartments = flattenDepartments(dept);

        return selectedIDs
          .map(id => {
            const department = flatDepartments.find(
              d => d.department_id === id,
            );
            return department ? department.department_name : null;
          })
          .filter(name => name !== null)
          .join(', ');
      }
    };

    useImperativeHandle(ref, () => ({
      dismissDropdown: () => {
        setDropdownVisible(false);
      },
    }));

    return (
      <TouchableWithoutFeedback
        onPress={() => setDropdownVisible(false)}
        accessible={false}>
        <View style={styles.container}>
          <TouchableOpacity
            style={styles.selectItemField}
            onPress={() => setDropdownVisible(!dropdownVisible)}>
            <Text style={styles.input}>
              {selectedItems.length ? getSelectedNames() : 'Select Department'}
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
                items={dept}
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
  },
);

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
    flexgrow: 1,
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