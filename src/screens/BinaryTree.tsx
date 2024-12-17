import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Svg, { Line } from 'react-native-svg';

// Node Component
const Node = ({ value, left, right, onToggle, x, y }) => {
  return (
    <View style={[styles.node, { left: x, top: y }]}>
      <Text style={styles.nodeText}>{value}</Text>
      <View style={styles.children}>
        {left && (
          <TouchableOpacity onPress={() => onToggle(left)}>
            <Node {...left} onToggle={onToggle} x={x - 60} y={y + 60} />
          </TouchableOpacity>
        )}
        {right && (
          <TouchableOpacity onPress={() => onToggle(right)}>
            <Node {...right} onToggle={onToggle} x={x + 60} y={y + 60} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

// Binary Tree Component
const BinaryTree = () => {
  const [tree] = useState({
    value: 1,
    left: {
      value: 2,
      left: { value: 4 },
      right: { value: 5 },
    },
    right: {
      value: 3,
      left: { value: 6 },
      right: { value: 7 },
    },
  });

  // Toggle function for node expansion
  const toggleNode = (node) => {
    console.log('Node clicked:', node);
  };

  return (
    <View style={styles.container}>
      <Svg height="300" width="100%">
        {/* Lines between nodes */}
        <Line x1="50%" y1="20%" x2="40%" y2="50%" stroke="black" strokeWidth="2" />
        <Line x1="50%" y1="20%" x2="60%" y2="50%" stroke="black" strokeWidth="2" />
        <Line x1="40%" y1="50%" x2="30%" y2="80%" stroke="black" strokeWidth="2" />
        <Line x1="40%" y1="50%" x2="50%" y2="80%" stroke="black" strokeWidth="2" />
        <Line x1="60%" y1="50%" x2="50%" y2="80%" stroke="black" strokeWidth="2" />
        <Line x1="60%" y1="50%" x2="70%" y2="80%" stroke="black" strokeWidth="2" />
      </Svg>
      <Node value={tree.value} left={tree.left} right={tree.right} onToggle={toggleNode} x="50%" y="20%" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  node: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  nodeText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  children: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
});

export default BinaryTree