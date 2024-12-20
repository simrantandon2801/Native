// import React, { useState } from 'react';
// import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
// import { useDepartmentContext } from './DepartmentContext'; 

// type Department = {
//   department_id: number;
//   department_name: string;
//   children?: Department[];
// };

// type DepartmentDropdownProps = {
//   data: Department[];
//   level?: number;
//   onSelect: (departmentId: number, departmentPath: string) => void;
//   parentPath?: string;
// };

// const DepartmentDropdown: React.FC<DepartmentDropdownProps> = ({
//   data,
//   level = 0,
//   onSelect,
//   parentPath = '',
// }) => 
//   const [expanded, setExpanded] = useState(false);

//   return (
//     <View style={{ marginLeft: level * 15 }}>
//       {data.map((dept) => {
//         const currentPath = parentPath
//           ? `${parentPath} > ${dept.department_name}`
//           : dept.department_name;

//         return (
//           <View key={dept.department_id}>
//             <TouchableOpacity
//               style={styles.dropdownItem}
//               onPress={() => {
//                 onSelect(dept.department_id, currentPath);
//                 setExpanded(!expanded);
//               }}
//             >
//               <Text style={styles.text}>{dept.department_name}</Text>
//             </TouchableOpacity>

//             {expanded && dept.children && dept.children.length > 0 && (
//               <DepartmentDropdown
//                 data={dept.children}
//                 level={level + 1}
//                 onSelect={onSelect}
//                 parentPath={currentPath}
//               />
//             )}
//           </View>
//         );
//       })}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   dropdownItem: {
//     padding: 10,
//     fontSize: 16,
//     backgroundColor: 'white',
//   },
//   text: {
//     fontSize: 16,
//     color: '#333',
//   },
// });

// export default DepartmentDropdown;
