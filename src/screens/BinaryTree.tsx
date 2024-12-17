import React, { useState } from 'react';

const Node = ({ value, left, right, level, offsetX, offsetY }) => {
  const nodeWidth = 100; // Width of the node (box)
  const nodeHeight = 40; // Height of the node (box)
  const spacing = 80; // Spacing between parent and child nodes (vertical space)
  const horizontalSpacing = 150; // Horizontal space between sibling nodes

  const renderLine = (fromX, fromY, toX, toY) => {
    return (
      <line
        x1={fromX}
        y1={fromY}
        x2={toX}
        y2={toY}
        stroke="black"
        strokeWidth="2"
      />
    );
  };

  const renderChildren = () => {
    const children = [];
    const newOffsetY = offsetY + nodeHeight + spacing;

    if (left) {
      // Left child line (vertical line)
      children.push(renderLine(offsetX + nodeWidth / 2, offsetY + nodeHeight, offsetX + nodeWidth / 2 - horizontalSpacing / 2, newOffsetY));
      children.push(
        <Node
          key={left.value}
          value={left.value}
          left={left.left}
          right={left.right}
          level={level + 1}
          offsetX={offsetX - horizontalSpacing / 2}
          offsetY={newOffsetY}
        />
      );
    }

    if (right) {
      // Right child line (vertical line)
      children.push(renderLine(offsetX + nodeWidth / 2, offsetY + nodeHeight, offsetX + nodeWidth / 2 + horizontalSpacing / 2, newOffsetY));
      children.push(
        <Node
          key={right.value}
          value={right.value}
          left={right.left}
          right={right.right}
          level={level + 1}
          offsetX={offsetX + horizontalSpacing / 2}
          offsetY={newOffsetY}
        />
      );
    }

    return children;
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
      <text x={offsetX + nodeWidth / 2} y={offsetY + nodeHeight / 2} fill="black" fontSize="12" textAnchor="middle" dy=".3em">
        {value}
      </text>
      {renderChildren()}
    </>
  );
};

const BinaryTree = () => {
  const [tree] = useState({
    value: 'forgeppm',
    left: {
      value: 'Finance',
      left: { value: 'CAO Office' },
    
    },
    right: {
      value: 'Technology',
      left: { value: 'IT infra' },
      right: { value: 'Software services' },
    },
  });

  return (
    <svg width="100%" height="500" style={{ border: '1px solid #000' }}>
      {tree ? (
        <Node value={tree.value} left={tree.left} right={tree.right} level={0} offsetX={250} offsetY={50} />
      ) : (
        'No tree available'
      )}
    </svg>
  );
};

export default BinaryTree;