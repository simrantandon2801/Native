import React, { useEffect, useState } from "react";
import { Alert, Dimensions, ScrollView, StyleSheet, View } from "react-native";
import { GetDept } from "../../database/Tree";

const Node = ({
  value,
  children,
  offsetX,
  offsetY,
  nodeWidth,
  nodeHeight,
  spacing,
  horizontalSpacing,
}) => {
  const renderLine = (fromX, fromY, toX, toY) => (
    <line
      x1={fromX}
      y1={fromY}
      x2={toX}
      y2={toY}
      stroke="black"
      strokeWidth="2"
    />
  );

  const renderChildren = () => {
    const newOffsetY = offsetY + nodeHeight + spacing;
    const childrenComponents = [];

    if (children && children.length > 0) {
      const totalWidth = (children.length - 1) * horizontalSpacing;
      let childOffsetX = offsetX - totalWidth / 2;

      children.forEach((child, index) => {
        // Line connecting to the child node
        childrenComponents.push(
          renderLine(
            offsetX + nodeWidth / 2,
            offsetY + nodeHeight,
            childOffsetX + nodeWidth / 2,
            newOffsetY
          )
        );

        // Render the child node
        childrenComponents.push(
          <Node
            key={`${value}-${index}`}
            value={child.department_name} // Fix: Use department_name for rendering
            children={child.children}
            offsetX={childOffsetX}
            offsetY={newOffsetY}
            nodeWidth={nodeWidth}
            nodeHeight={nodeHeight}
            spacing={spacing}
            horizontalSpacing={horizontalSpacing / 1.5} // Reduce spacing as the tree grows
          />
        );

        childOffsetX += horizontalSpacing; // Move to the next sibling position
      });
    }

    return childrenComponents;
  };

  return (
    <>
      <rect
        x={offsetX}
        y={offsetY}
        width={nodeWidth}
        height={nodeHeight}
        fill="lightblue"
        stroke="black"
        strokeWidth="2"
      />
      <text
        x={offsetX + nodeWidth / 2}
        y={offsetY + nodeHeight / 2}
        fill="black"
        fontSize="12"
        textAnchor="middle"
        dy=".3em"
      >
        {value}
      </text>
      {renderChildren()}
    </>
  );
};
interface BinaryTree {
  shouldFetch: boolean;
  setShouldFetch: React.Dispatch<React.SetStateAction<boolean>>;
}
const BinaryTree: React.FC<BinaryTree> = ({ shouldFetch, setShouldFetch }) => {
  const [tree, setTree] = useState<any>(null);
  const [maxWidth, setMaxWidth] = useState(0);
  const screenWidth = Dimensions.get("window").width; // Get screen width dynamically
  const parentWidth = screenWidth / 2; 
 

    const fetchDepartments = async () => {
      try {
        const response = await GetDept('');
        const result = await JSON.parse(response);

        console.log("API Response:", result);

        // Filter active departments
        const activeDepartments = result.data.departments.filter(
          (dept) => dept.is_active === true
        );

        // Create a map of department_id to department object
        const departmentMap = new Map(
          activeDepartments.map((dept) => [
            dept.department_id,
            { ...dept, children: [] }, // Retain department_name and other properties
          ])
        );

        // Map children to their respective parents
        activeDepartments.forEach((dept) => {
          if (dept.parent_department_id) {
            const parent = departmentMap.get(dept.parent_department_id);
            if (parent) {
              parent.children.push(departmentMap.get(dept.department_id));
            }
          }
        });

        // Get the root departments (those without a parent)
        const rootDepartments = activeDepartments
          .filter((dept) => dept.parent_department_id === null)
          .map((dept) => departmentMap.get(dept.department_id));

        // Build the final tree
        const forgeTree = {
          department_name: "Forge",
          children: rootDepartments,
        };

        setTree(forgeTree);
      } catch (error) {
        console.error("Error fetching departments:", error);
        Alert.alert("Error", "Failed to fetch departments");
      }
    };

    useEffect(() => {
      fetchDepartments();
      if (shouldFetch) {
        fetchDepartments();
        setShouldFetch(false); // Reset shouldFetch after fetching
      }
    }, [shouldFetch, setShouldFetch]);

    const calculateMaxWidth = (children) => {
      if (!children || children.length === 0) return 0;
  
      let width = 0;
      children.forEach((child) => {
        const childWidth = calculateMaxWidth(child.children) + 200; 
        if (childWidth > width) {
          width = childWidth;
        }
      });
  
      return width;
    };

    useEffect(() => {
      if (tree) {
        const maxWidth = calculateMaxWidth(tree.children);
        setMaxWidth(maxWidth);
      }
    }, [tree]);
 
  const nodeWidth = 100; 
  const rootOffsetX = parentWidth / 2 - nodeWidth / 2;
  const verticalSpacing = 100;
  const horizontalSpacing = 200;
  return (
    <View style={{ flex: 2,overflow: 'hidden',justifyContent:'center' }}>
       <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{
        width: maxWidth + 350,
        justifyContent: 'center',
        alignItems: 'center', // Align content centrally
      }}
      horizontal
      showsHorizontalScrollIndicator={true}
    >
      <ScrollView
        contentContainerStyle={styles.verticalScrollContent}
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={true}
      >
    <svg
    width={maxWidth + 300}
      height="500"
      style={{ border: "1px solid #000" }}
    >
      {tree ? (
        <Node
          value={tree.department_name} // Adjust the field name to match your API data
          children={tree.children}
          offsetX={rootOffsetX} // Center dynamically based on screen width
          offsetY={50}
          nodeWidth={nodeWidth}
          spacing={verticalSpacing}
          nodeHeight={40}
          
          horizontalSpacing={horizontalSpacing}
        />
      ) : (
        <text x="50%" y="50%" textAnchor="middle" fill="black">
          Loading tree...
        </text>
      )}
    </svg>
    </ScrollView>
    </ScrollView>
    </View>
  );
};

export default BinaryTree;
const styles = StyleSheet.create({
  verticalScrollContent: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    paddingBottom: 20,
   maxHeight:'100%'
  },
});