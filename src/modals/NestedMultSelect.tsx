import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';

const data = [
  {
    name: "AMERICA",
    code: "AM",
    zones: [
      {
        name: "Item 4",
        code: "I4",
        zones: [
          {
            name: "Option 7",
            code: "O7",
            zones: [
              { name: "SubOption 15", code: "SO15", zones: [] },
              { name: "SubOption 18", code: "SO18", zones: [] },
              { name: "SubOption 20", code: "SO20", zones: [] },
            ],
          },
          { name: "Option 8", code: "O8", zones: [] },
        ],
      },
      { name: "Item 5", code: "I5", zones: [] },
    ],
  },
  {
    name: "ASIA",
    code: "AS",
    zones: [
      { name: "Item 3", code: "I3", zones: [] },
    ],
  },
];

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
      {items.map((item) => (
        <View
          key={item.code}
          style={[styles.dropdownItem, hoveredItem === item.code && styles.hoverHighlight]} // Highlight the hovered item
          onTouchStart={() => setHoveredItem(item.code)} // Simulate hover on touch
          onTouchEnd={() => setHoveredItem(null)} // Remove hover effect after touch ends
        >
          <View style={styles.itemHeader}>
            {/* Checkbox for selection */}
            <TouchableOpacity onPress={() => toggleSelect(item)} style={styles.expandableIcon}>
              <View
                style={[
                  styles.checkbox,
                  selectedItems.includes(item.code) && styles.checkboxSelected,
                ]}
              />
            </TouchableOpacity>

            {/* Text acts as an expand/collapse trigger */}
            <TouchableOpacity
              onPress={() => toggleExpanded(item.code)} // Text toggles expansion
              style={styles.textContainer}
            >
              <Text style={styles.itemText}>{item.name}</Text>
            </TouchableOpacity>

            {/* Expandable icon for expand/collapse */}
            {item.zones.length > 0 && (
              <TouchableOpacity
                onPress={() => toggleExpanded(item.code)} // + / - toggles expansion
                style={styles.expandableIcon}
              >
                <Text style={styles.arrow}>
                  {expandedParents.includes(item.code) ? "-" : "+"}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Recursive rendering for nested items */}
          {item.zones.length > 0 && expandedParents.includes(item.code) && (
            <View style={styles.nestedContainer}>
              <RecursiveDropdown
                items={item.zones}
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

const NestedMultiselectDropdown = () => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [expandedParents, setExpandedParents] = useState<string[]>([]);
  const [hoveredItem, setHoveredItem] = useState(null); // State for hovered item
  const [dropdownVisible, setDropdownVisible] = useState(false); // State to toggle dropdown visibility

  const toggleSelect = (item) => {
    setSelectedItems((prevSelected) =>
      prevSelected.includes(item.code)
        ? prevSelected.filter((code) => code !== item.code)
        : [...prevSelected, item.code]
    );
  };

  const toggleExpanded = (parentCode) => {
    setExpandedParents((prev) =>
      prev.includes(parentCode)
        ? prev.filter((code) => code !== parentCode)
        : [...prev, parentCode]
    );
  };

  return (
    <View style={styles.container}>
      {/* Text field with disabled state and "v" icon */}
      <TouchableOpacity
        style={styles.selectItemField}
        onPress={() => setDropdownVisible(!dropdownVisible)} // Toggle visibility on click
      >
        <Text style={styles.input}>Select Item</Text>
        <Icon name={dropdownVisible ? "chevron-up" : "chevron-down"} size={20} color="#333" />
      </TouchableOpacity>

      {/* Show nested dropdown if dropdownVisible is true */}
      {dropdownVisible && (
        <ScrollView style={styles.scrollContainer}>
          <RecursiveDropdown
            items={data}
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
