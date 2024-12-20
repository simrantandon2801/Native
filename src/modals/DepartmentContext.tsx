// import React, { createContext, useState, useContext, ReactNode } from 'react';

// // Define TypeScript types
// type DepartmentContextType = {
//   selectedDeptId: number | null;
//   selectedPath: string;
//   setSelectedDeptId: (id: number | null) => void;
//   setSelectedPath: (path: string) => void;
// };

// // Initialize Context
// const DepartmentContext = createContext<DepartmentContextType | undefined>(
//   undefined
// );

// // Create a Provider component
// export const DepartmentProvider: React.FC<{ children: ReactNode }> = ({
//   children,
// }) => {
//   const [selectedDeptId, setSelectedDeptId] = useState<number | null>(null);
//   const [selectedPath, setSelectedPath] = useState<string>('');

//   return (
//     <DepartmentContext.Provider
//       value={{ selectedDeptId, selectedPath, setSelectedDeptId, setSelectedPath }}
//     >
//       {children}
//     </DepartmentContext.Provider>
//   );
// };

// // Custom hook to use DepartmentContext
// export const useDepartmentContext = () => {
//   const context = useContext(DepartmentContext);
//   if (!context) {
//     throw new Error('useDepartmentContext must be used within a DepartmentProvider');
//   }
//   return context;
// };