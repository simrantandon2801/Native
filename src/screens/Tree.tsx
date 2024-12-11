import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  Alert,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

// Define types for TreeNode
interface TreeNodeType {
  id: string;
  name: string;
  children: TreeNodeType[];
}

interface TreeNodeProps {
  node: TreeNodeType;
  onEditName: (id: string, newName: string) => void;
  onAddChild: (parentId: string) => void;
  onDeleteNode: (id: string) => void;
}

// TreeNode Component
const TreeNode: React.FC<TreeNodeProps> = ({
  node,
  onEditName,
  onAddChild,
  onDeleteNode,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true); // To toggle children visibility

  return (
    // <View style={[styles.nodeContainer, {backgroundColor: getRandomColor()}]}></View>
    <View style={styles.nodeContainer}>
      <View style={styles.nodeRow}>
        {/* Expand/Collapse Icon */}
        <TouchableOpacity onPress={() => setIsExpanded(!isExpanded)}>
          <Icon
            name={isExpanded ? 'caret-down' : 'caret-right'}
            size={20}
            color="black"
          />
        </TouchableOpacity>

        {/* Node Name */}
        {isEditing ? (
          <TextInput
            style={styles.input}
            value={node.name}
            onChangeText={text => onEditName(node.id, text)}
            onBlur={() => setIsEditing(false)}
            autoFocus
          />
        ) : (
          <Text onPress={() => setIsEditing(true)} style={styles.nodeText}>
            {node.name}
          </Text>
        )}

        <View style={styles.iconContainer}>
          {/* Add Icon */}
          <TouchableOpacity onPress={() => onAddChild(node.id)}>
            <Icon name="plus" size={20} color="green" />
          </TouchableOpacity>

          {/* Edit Icon */}
          <TouchableOpacity onPress={() => setIsEditing(true)}>
            <Icon name="edit" size={20} color="blue" />
          </TouchableOpacity>

          {/* Delete Icon */}
          <TouchableOpacity onPress={() => onDeleteNode(node.id)}>
            <Icon name="trash" size={20} color="red" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Render Children if Expanded */}
      {isExpanded && (
        <View style={styles.childrenContainer}>
          {node.children.map(child => (
            <TreeNode
              key={child.id}
              node={child}
              onEditName={onEditName}
              onAddChild={onAddChild}
              onDeleteNode={onDeleteNode}
            />
          ))}
        </View>
      )}
    </View>
  );
};
interface Props {
  department_id: string;
  department_name: string;
}
// Tree Component
const Tree: React.FC<Props> = ({department_id, department_name}) => {
  const [tree, setTree] = useState<TreeNodeType[]>([
    {
      id: department_id,
      name: department_name,
      children: [],
    },
  ]);

  const handleEditName = (id: string, newName: string) => {
    const updateNode = (nodes: TreeNodeType[]): TreeNodeType[] =>
      nodes.map(node => {
        if (node.id === id) {
          return {...node, name: newName};
        }
        return {...node, children: updateNode(node.children)};
      });

    setTree(updateNode(tree));
  };

  const handleAddChild = (parentId: string) => {
    const updateNode = (nodes: TreeNodeType[]): TreeNodeType[] =>
      nodes.map(node => {
        if (node.id === parentId) {
          const newChild: TreeNodeType = {
            id: `${node.id}-${node.children.length + 1}`,
            name: 'New Node',
            children: [],
          };
          return {...node, children: [...node.children, newChild]};
        }
        return {...node, children: updateNode(node.children)};
      });

    setTree(updateNode(tree));
  };

  const handleDeleteNode = (id: string) => {
    const deleteNode = (nodes: TreeNodeType[]): TreeNodeType[] =>
      nodes
        .filter(node => node.id !== id)
        .map(node => ({
          ...node,
          children: deleteNode(node.children),
        }));

    Alert.alert('Delete Node', 'Are you sure you want to delete this node?', [
      {text: 'Cancel', style: 'cancel'},
      {text: 'Delete', onPress: () => setTree(deleteNode(tree))},
    ]);
  };

  return (
    <FlatList
      data={tree}
      keyExtractor={item => item.id}
      renderItem={({item}) => (
        <TreeNode
          node={item}
          onEditName={handleEditName}
          onAddChild={handleAddChild}
          onDeleteNode={handleDeleteNode}
        />
      )}
      contentContainerStyle={styles.treeContainer}
    />
  );
};
const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};
// Styles
const styles = StyleSheet.create({
  treeContainer: {
    //padding: 10,
  },
  nodeContainer: {
    padding: 10,
    marginLeft: 10,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: 'black',
  },
  nodeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  nodeText: {
    fontSize: 16,
    padding: 5,
  },
  input: {
    fontSize: 16,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    padding: 5,
    width: '60%',
  },
  childrenContainer: {
    marginLeft: 20,
    marginTop: 5,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: 100,
  },
});

export default Tree;