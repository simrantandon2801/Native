import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';
import { GetNestedDepartments } from "../database/NestedDept";
const data = [
  {
        "department_id": 43,
        "department_name": "accounts",
        "parent_department_id": null,
        "is_active": false,
        "sub_departments": []
    },
    {
        "department_id": 40,
        "department_name": "accounts",
        "parent_department_id": null,
        "is_active": false,
        "sub_departments": []
    },
    {
        "department_id": 39,
        "department_name": "accounts",
        "parent_department_id": null,
        "is_active": false,
        "sub_departments": []
    },
    {
        "department_id": 37,
        "department_name": "Accounts",
        "parent_department_id": null,
        "is_active": false,
        "sub_departments": []
    },
    {
        "department_id": 38,
        "department_name": "Fiction",
        "parent_department_id": null,
        "is_active": false,
        "sub_departments": []
    },
    {
        "department_id": 56,
        "department_name": "Finance",
        "parent_department_id": null,
        "is_active": false,
        "sub_departments": []
    },
    {
        "department_id": 27,
        "department_name": "Finance",
        "parent_department_id": null,
        "is_active": true,
        "sub_departments": [
            {
                "department_id": 29,
                "department_name": "CAO Office",
                "parent_department_id": 27,
                "is_active": true,
                "sub_departments": [
                    {
                        "department_id": 32,
                        "department_name": "AP",
                        "parent_department_id": 29,
                        "is_active": true,
                        "sub_departments": []
                    },
                    {
                        "department_id": 33,
                        "department_name": "AR",
                        "parent_department_id": 29,
                        "is_active": true,
                        "sub_departments": [
                            {
                                "department_id": 35,
                                "department_name": "AC",
                                "parent_department_id": 33,
                                "is_active": true,
                                "sub_departments": []
                            },
                            {
                                "department_id": 34,
                                "department_name": "AC",
                                "parent_department_id": 33,
                                "is_active": false,
                                "sub_departments": []
                            },
                            {
                                "department_id": 36,
                                "department_name": "AM",
                                "parent_department_id": 33,
                                "is_active": true,
                                "sub_departments": []
                            }
                        ]
                    }
                ]
            }
        ]
    },
    {
        "department_id": 59,
        "department_name": "Finance1",
        "parent_department_id": null,
        "is_active": true,
        "sub_departments": [
            {
                "department_id": 60,
                "department_name": "Accounts",
                "parent_department_id": 59,
                "is_active": true,
                "sub_departments": []
            }
        ]
    },
    {
        "department_id": 41,
        "department_name": "HR",
        "parent_department_id": null,
        "is_active": false,
        "sub_departments": []
    },
    {
        "department_id": 45,
        "department_name": "HR",
        "parent_department_id": null,
        "is_active": false,
        "sub_departments": []
    },
    {
        "department_id": 63,
        "department_name": "iit",
        "parent_department_id": null,
        "is_active": true,
        "sub_departments": [
            {
                "department_id": 64,
                "department_name": "iitk",
                "parent_department_id": 63,
                "is_active": true,
                "sub_departments": []
            }
        ]
    },
    {
        "department_id": 65,
        "department_name": "iit2",
        "parent_department_id": null,
        "is_active": true,
        "sub_departments": [
            {
                "department_id": 66,
                "department_name": "iit kanpur",
                "parent_department_id": 65,
                "is_active": true,
                "sub_departments": [
                    {
                        "department_id": 67,
                        "department_name": "iit 3",
                        "parent_department_id": 66,
                        "is_active": true,
                        "sub_departments": []
                    }
                ]
            }
        ]
    },
    {
        "department_id": 46,
        "department_name": "IPO",
        "parent_department_id": null,
        "is_active": false,
        "sub_departments": []
    },
    {
        "department_id": 61,
        "department_name": "it infraaa",
        "parent_department_id": null,
        "is_active": true,
        "sub_departments": []
    },
    {
        "department_id": 44,
        "department_name": "security",
        "parent_department_id": null,
        "is_active": false,
        "sub_departments": []
    },
    {
        "department_id": 42,
        "department_name": "Security",
        "parent_department_id": null,
        "is_active": false,
        "sub_departments": []
    },
    {
        "department_id": 28,
        "department_name": "Technology",
        "parent_department_id": null,
        "is_active": true,
        "sub_departments": [
            {
                "department_id": 30,
                "department_name": "IT Infra",
                "parent_department_id": 28,
                "is_active": true,
                "sub_departments": [
                    {
                        "department_id": 62,
                        "department_name": "",
                        "parent_department_id": 30,
                        "is_active": true,
                        "sub_departments": []
                    }
                ]
            },
            {
                "department_id": 31,
                "department_name": "Software Services",
                "parent_department_id": 28,
                "is_active": true,
                "sub_departments": []
            }
        ]
    }
];

const RecursiveDropdown = ({
  items = [],
  selectedItems,
  toggleSelect,
  expandedParents,
  toggleExpanded,
  hoveredItem,
  setHoveredItem,
}) => {
  return (
    <View style={styles.levelContainer}>
      {items.map((item) => (
        <View
          key={item.department_id}
          style={[
            styles.dropdownItem,
            hoveredItem === item.department_id && styles.hoverHighlight,
          ]}
          onTouchStart={() => setHoveredItem(item.department_id)}
          onTouchEnd={() => setHoveredItem(null)}
        >
          <View style={styles.itemHeader}>
            {/* Checkbox for selection */}
            <TouchableOpacity
              onPress={() => toggleSelect(item)}
              style={styles.expandableIcon}
            >
              <View
                style={[
                  styles.checkbox,
                  selectedItems.includes(item.department_id) && styles.checkboxSelected,
                ]}
              />
            </TouchableOpacity>

            {/* Text acts as an expand/collapse trigger */}
            <TouchableOpacity
              onPress={() => toggleExpanded(item.department_id)}
              style={styles.textContainer}
            >
              <Text style={styles.itemText}>{item.department_name}</Text>
            </TouchableOpacity>

            {/* Expandable icon for expand/collapse */}
            {Array.isArray(item.sub_departments) && item.sub_departments.length > 0 && (
              <TouchableOpacity
                onPress={() => toggleExpanded(item.department_id)}
                style={styles.expandableIcon}
              >
                <Text style={styles.arrow}>
                  {expandedParents.includes(item.department_id) ? "-" : "+"}
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




const NestedMultiselectDropdown = ({ data = [] }) => {
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [expandedParents, setExpandedParents] = useState<number[]>([]);
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const toggleSelect = (item) => {
    setSelectedItems((prevSelected) =>
      prevSelected.includes(item.department_id)
        ? prevSelected.filter((id) => id !== item.department_id)
        : [...prevSelected, item.department_id]
    );
  };

  const toggleExpanded = (parentId) => {
    setExpandedParents((prev) =>
      prev.includes(parentId)
        ? prev.filter((id) => id !== parentId)
        : [...prev, parentId]
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.selectItemField}
        onPress={() => setDropdownVisible(!dropdownVisible)}
      >
        <Text style={styles.input}>
          {selectedItems.length
            ? `Selected: ${selectedItems.join(", ")}`
            : "Select Department"}
        </Text>
        <Icon
          name={dropdownVisible ? "keyboard-arrow-up" : "keyboard-arrow-down"}
          size={20}
          color="#333"
        />
      </TouchableOpacity>

      {dropdownVisible && (
        <ScrollView style={styles.scrollContainer}>
          <RecursiveDropdown
            items={Array.isArray(data) ? data : []} // Ensure data is an array
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
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  selectItemField: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 5,
    marginBottom: 8,
  },
  selectItemText: {
    flex: 1,
    fontSize: 16,
    color: "#333",
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
    width: '100%', // Ensures input takes up the full width of the container
  },
  arrow: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  scrollContainer: {
    marginVertical: 8,
  },
  levelContainer: {
    paddingLeft: 16,
  },
  dropdownItem: {
    marginBottom: 8,
    borderRadius: 5,
    overflow: "hidden",
  },
  hoverHighlight: {
    backgroundColor: "#e0f7fa", // Light blue for hover effect
  },
  itemHeader: {
    flexDirection: "row",
    alignItems: "center",
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
    color: "#333",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 3,
    backgroundColor: "#fff",
  },
  checkboxSelected: {
    backgroundColor: "#333",
  },
  nestedContainer: {
    marginTop: 4,
    paddingLeft: 16,
    borderLeftWidth: 1,
    borderLeftColor: "#ddd",
  },
});

export default NestedMultiselectDropdown;
