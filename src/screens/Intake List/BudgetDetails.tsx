import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  Platform,
  Alert,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { GetBudgetCategories, GetBudgetSubCategories, GetBudgetDetails, InsertBudgetDetails, DeleteBudgetDetail} from '../../database/Intake';
import { navigate } from '../../navigations/RootNavigation';
import Icon from 'react-native-vector-icons/Ionicons';
import NestedDeptDropdown from '../../modals/NestedDeptDropdown';

interface BudgetRow {
  budget_detail_id: number;
  project_id:number;
  category_id: number;
  sub_category_id: number;
  category_name: string;
  sub_category_name: string;
  qty: number;
  value: number;
  unit: string;
  total: number;
  department_id: number;
  department_name: string;
  description:string;
}

interface BudgetAppProps {
  projectId: number;
  visible: boolean;
  onClose: (total:string) => void;
}


const BudgetDetails: React.FC<BudgetAppProps> = ({ 
  projectId, 
  projectName, 
  visible,
  onClose, 
}) => {
  const [rows, setRows] = useState<BudgetRow[]>([]);
  const [newRow, setNewRow] = useState<BudgetRow>({
    budget_detail_id:0,
    project_id:projectId,
    category_id: 0,
    sub_category_id: 0,
    category_name: '',
    sub_category_name: '',
    qty: 0,
    value: 0,
    total: 0,
    unit:'',
    department_id:0,
    department_name: '',
    description:''
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [categories, setCategories] = useState([]);
  const [categoryDetails, setCategoryDetails] = useState([]);
  const [categorySelected, setCategorySelected] = useState('');
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedDeptID, setSelectedDeptID] = useState<number>(-1);

  // Simulated API call to fetch categories and category details
  const fetchCategoriesAndDetails = async () => {
    try {
      setLoading(true);
      // Simulated API calls to fetch categories and category details
    //   const fetchedCategories = await new Promise<{ category: string }[]>(resolve =>
    //     setTimeout(() => resolve([{ category: 'Manpower' }, { category: 'Procurement' }, { category: 'Infrastructure' }]), 1000)
    //   );
        const response = await GetBudgetCategories('');
        const result = JSON.parse(response);
       // const fetchedCategories = JSON.parse(response);
        
    //   const fetchedCategoryDetails = await new Promise<{ category: string; details: string }[]>(resolve =>
    //     setTimeout(
    //       () =>
    //         resolve([
    //           { category: 'Manpower', details: 'DetailA' },
    //           { category: 'Manpower', details: 'DetailB' },
    //           { category: 'Procurement', details: 'DetailC' },
    //           { category: 'Procurement', details: 'DetailD' },
    //           { category: 'Infrastructure', details: 'DetailE' },
    //         ]),
    //       1000
    //     )
    //   );

      setCategories(result.data?.category);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategoriesAndDetails();
  }, []);


  // Simulated API call to fetch budget data based on projectId
//   const fetchBudgetData = async (projectId: string): Promise<BudgetRow[]> => {
//     return new Promise((resolve) => {
//       setTimeout(() => {
//         resolve([
//           {
//             category: 'Manpower',
//             categoryDetail: 'DetailA',
//             quantity: 10,
//             value: 500,
//             total: 5000,
//           },
//           {
//             category: 'Procurement',
//             categoryDetail: 'DetailC',
//             quantity: 5,
//             value: 200,
//             total: 1000,
//           },
//         ]);
//       }, 1000); // Simulated delay
//     });
//   };
//const fetchBudgetData = await GetBudgetDetails('');
const loadBudgetData = async (project_id) => {
    try {
      const resp = await GetBudgetDetails(project_id);

      const result = JSON.parse(resp);
      if (result?.data?.budget && Array.isArray(result.data.budget)) {
      setRows(result.data.budget);
      } 
      else {
              console.error('Invalid budget data');
              Alert.alert('Error', 'Invalid budget data received');
            }
    } catch (error) {
      console.error('Error fetching budget data:', error);
    }
  };
  useEffect(() => {


    loadBudgetData(projectId);
  }, [projectId]);

  const validateFields = () => {
    const validationErrors: { [key: string]: string } = {};
    if (!newRow.category_id) validationErrors.category = 'Category is required.';
    if (!newRow.sub_category_id) validationErrors.categoryDetail = 'Details are required.';
    if (!newRow.qty || newRow.qty <= 0)
      validationErrors.quantity = 'Quantity must be a positive number.';
    if (!newRow.value || newRow.value <= 0)
      validationErrors.value = 'Value must be a positive number.';

    setErrors(validationErrors);

    return Object.keys(validationErrors).length === 0;
  };

  const handleAddRow = async () => {
    if (!validateFields()) {
      Alert.alert('Validation Error', 'Please fix the errors before adding.');
      return;
    }
          const response = await InsertBudgetDetails(newRow);
          const parsedResponse = JSON.parse(response);
        console.log(parsedResponse)
          if (parsedResponse.status === 'success') {
            Alert.alert('Draft saved successfully');
            //const projectId = parsedResponse.data.project_id;
          //console.log('Project ID:', projectId);

    //const total = newRow.qty * newRow.value;
    //setRows([...rows, { ...newRow, total }]);
    loadBudgetData(projectId);
    setNewRow({ 
        budget_detail_id:0,
        project_id:projectId,
        category_id: 0,
        sub_category_id: 0,
        category_name: '',
        sub_category_name: '',
        qty: 0,
        value: 0,
        unit:'',
        department_id:0,
        department_name: '',
        description:'',
        total: 0});
    setErrors({});
          }
  };

  const handleDelete = async (budget_detail_id) => {
    console.log(budget_detail_id)
      const data = {
        budget_detail_id: budget_detail_id,
      };
      try {
        const response = await DeleteBudgetDetail(data);
        const result = await JSON.parse(response);
        loadBudgetData(projectId);
      } catch (error) {
        console.error('Error Deleting Goals:', error);
      }
    };

  const calculateTotals = () => {
    return rows.reduce(
      (acc, row) => {
        acc.totalQuantity += row.qty;
        acc.totalValue += row.value;
        acc.totalBudget += row.qty * row.value;
        return acc;
      },
      { totalQuantity: 0, totalValue: 0, totalBudget: 0 }
    );
  };

  const totals = calculateTotals();

  const handleCategoryChange = async (categoryId) =>{
    //console.log(category)
    const response = await GetBudgetSubCategories(categoryId);
    const result = JSON.parse(response);
    //const fetchedSubCategories = JSON.parse(response1);
    setCategoryDetails(result.data?.subcategory);
    setNewRow({ ...newRow, category_id: categoryId, sub_category_id: 0 });
  }
  const handleSubCategoryChange = async (categoryId) =>{
    console.log(categoryId)
   // console.log(categoryName)
    //const response = await GetBudgetSubCategories(categoryId);
    //const result = JSON.parse(response);
    //const fetchedSubCategories = JSON.parse(response1);
    //setCategoryDetails(result.data?.subcategory);
    setNewRow({ ...newRow, sub_category_id: categoryId});
  }
  const handleDeptSelect = (deptID: number) => {
    setSelectedDeptID(deptID); // Update the parent state with the selected department ID
    console.log(`Selected Department ID: ${deptID}`);
    // setFieldValue("selectedDeptID", deptID);
  };
  const availableDetails = newRow.category_id
  ? categoryDetails
      .filter((item) => item.category_id === newRow.category_id)
      //.map((item) => item.details)
  : [];
  return (
    <Modal
         animationType="fade"
         transparent={true}
         visible={visible}
         onRequestClose={()=>onClose(totals.totalBudget.toString())}>
         <View style={styles.centeredView}>
           <View style={styles.modalView}>
             <Text style={styles.modalTitle}>Budget Calculations</Text>
             <View style={styles.modalContent}>
    {/* <View style={styles.header}>
    <TouchableOpacity
      style={styles.backButton}
      onPress={() => navigate('NewIntake')}>
      <Icon name="arrow-back" size={24} color="black" />
    </TouchableOpacity>
    <Text style={styles.projectName}></Text>
  </View> */}
    <View style={styles.container}>
      <Text style={styles.heading}>Project Name: {projectName}</Text>

      {loading && <Text>Loading categories and details...</Text>}

      {/* Table Header */}
      <View style={styles.tableRow}>
        <Text style={[styles.tableCell, styles.headerCell]}>Category</Text>
        <Text style={[styles.tableCell, styles.headerCell]}>Sub-Category</Text>
        <Text style={[styles.tableCell, styles.headerCell]}>Function</Text>
        <Text style={[styles.tableCell, styles.headerCell]}>Description</Text>
        <Text style={[styles.tableCell, styles.headerCell]}>Quantity</Text>
        <Text style={[styles.tableCell, styles.headerCell]}>UoM</Text>
        <Text style={[styles.tableCell, styles.headerCell]}>Rate($)</Text>
        <Text style={[styles.tableCell, styles.headerCell]}>Total</Text>
      </View>

      {/* Input Form */}
      <View style={styles.tableRow}>
        <Picker
          selectedValue={newRow.category_id}
          onValueChange={(value) => {
            //let name = categories[index].category_name;
           // setNewRow({ ...newRow, category_id: value, sub_category_id: 0, sub_category_name:'' });
            handleCategoryChange(value);
          }}
          style={[styles.picker, styles.tableCell]}
        >
          <Picker.Item label="Select Category" value="" />
          {categories && categories.length > 0 ? (
  categories.map((cat, index) => (
    <Picker.Item key={index} label={cat.category_name} value={cat.category_id} />
  ))
) : (
  <Picker.Item label="No categories available" value="" />
)}
        </Picker>
        {errors.category && <Text style={styles.errorText}>{errors.category}</Text>}


        <Picker
          selectedValue={newRow.sub_category_id}
          onValueChange={(value) => {
            //let name = categoryDetails[index].sub_category_name;
            //setNewRow({ ...newRow, sub_category_id: value })
            handleSubCategoryChange(value);
          }
        }
          style={[styles.picker, styles.tableCell]}
          enabled={!!newRow.category_id}
        >
          <Picker.Item label="Select Details" value="" />
          {categoryDetails.map((detail, index) => (
            <Picker.Item key={index} label={detail.sub_category_name} value={detail.sub_category_id} />
          ))}
        </Picker>
        {errors.categoryDetail && <Text style={styles.errorText}>{errors.categoryDetail}</Text>}
        <NestedDeptDropdown
                        onSelect={handleDeptSelect}
                        selectedValue={selectedDeptID.toString()} // Pass current value from Formik
                        placeholder={'Select a department'}
                      />
                       {errors.selectedDeptID && (
                                              <Text style={styles.errorText}>
                                                {errors.selectedDeptID}
                                              </Text> // Show error if touched and invalid
                                            )}
           <TextInput
          style={[styles.input, styles.tableCell]}
          placeholder="Desription"
          value={newRow.description.toString()}
          onChangeText={(text) =>
            setNewRow({ ...newRow, description: parseFloat(text) || 0 })
          }
        />
        <TextInput
          style={[styles.input, styles.tableCell]}
          keyboardType="numeric"
          placeholder="Qty"
          value={newRow.qty.toString()}
          onChangeText={(text) =>
            setNewRow({ ...newRow, qty: parseFloat(text) || 0 })
          }
        />
        {/* {errors.quantity && <Text style={styles.errorText}>{errors.quantity}</Text>} */}

        <TextInput
          style={[styles.input, styles.tableCell]}
          keyboardType="numeric"
          placeholder="Value"
          value={newRow.value.toString()}
          onChangeText={(text) =>
            setNewRow({ ...newRow, value: parseFloat(text) || 0 })
          }
        />
        {/* {errors.value && <Text style={styles.errorText}>{errors.value}</Text>} */}
        <TextInput
        // <Text style={styles.tableCell}>
        style={[styles.input, styles.tableCell]}
          keyboardType="numeric"
          placeholder="Total"
          value={newRow.total.toString()}
          onChangeText={(text) =>
            setNewRow({ ...newRow, total: parseFloat(text) || 0 })
          }
         />
      </View>

      <Button title="Add Row" onPress={handleAddRow} />

      {/* Added Rows */}
      <FlatList
        data={rows}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>{item.category_name}</Text>
            <Text style={styles.tableCell}>{item.sub_category_name}</Text>
            <Text style={styles.tableCell}>{item.department_name}</Text>
            <Text style={styles.tableCell}>{item.description}</Text>
            <Text style={styles.tableCell}>{item.qty}</Text>
            <Text style={styles.tableCell}>{item.unit}</Text>
            <Text style={styles.tableCell}>{item.value}</Text>
            <Text style={styles.tableCell}>{item.qty * item.value}</Text>
            {/* <Button mode="contained" onPress={()=>handleDelete(item.budget_detail_id)}>
    Delete
  </Button> */}
  <TouchableOpacity
                      style={[styles.button]}
                      onPress={()=>handleDelete(item.budget_detail_id)}>
                      <Text style={styles.errorText}>Delete</Text>
                    </TouchableOpacity>
          </View>
        )}
      />

      {/* Totals Row */}
      <View style={styles.tableRow}>
        <Text style={styles.tableCell}></Text>
        <Text style={styles.footerCell}>Totals:</Text>
        <Text style={styles.footerCell}>{totals.totalQuantity}</Text>
        <Text style={styles.footerCell}>{totals.totalValue}</Text>
        <Text style={styles.footerCell}>{totals.totalBudget}</Text>
      </View>
        <View style={{alignItems: 'center'}}>
                  <View
                    style={[
                      styles.buttonContainer,
                      {flexDirection: 'row', justifyContent: 'space-between'},
                    ]}>
                    <TouchableOpacity
                      style={[styles.button, styles.cancelButton]}
                      onPress={()=>onClose(totals.totalBudget.toString())}>
                      <Text style={styles.buttonText2}>Close</Text>
                    </TouchableOpacity>
                    {/* <TouchableOpacity
                      style={[styles.button, styles.submitButton]}
                      onPress={handleSubmit}>
                      <Text style={styles.buttonText1}>Submit</Text>
                    </TouchableOpacity> */}
                  </View>
                </View>
    </View>
    </View>
    </View>
    </View></Modal>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, width:1000 },
  heading: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#ddd',
    paddingVertical: 5,
  },
  tableCell: {
    flex: 1,
    textAlign: 'center',
    padding: 5,
  },
  footerCell: {
    flex: 1,
    textAlign: 'center',
    padding: 5,
    fontWeight:'bold',
  },
  headerCell: { fontWeight: 'bold', backgroundColor: '#f0f0f0' },
  picker: {
    borderWidth: Platform.OS === 'web' ? 1 : 0,
    padding: Platform.OS === 'web' ? 5 : 0,
    backgroundColor: '#fff',
  },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 5 },
  errorText: { color: 'red', fontSize: 12, textAlign: 'center', marginTop: 2 },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '100%',
    maxWidth: 1000,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalContent: {
    marginBottom: 20,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    marginHorizontal: 5,
    borderRadius: 4,
  },
  buttonText: {
    color: '#044086',
    fontSize: 14,
  },
  cancelButton: {
    backgroundColor: '#ddd',
    marginRight: 10,
  },
  submitButton: {
    backgroundColor: '#044086',
  },
  });
  
  export default BudgetDetails;
