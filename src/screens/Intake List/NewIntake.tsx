import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  ScrollView,
  Modal,
  Alert,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Picker } from '@react-native-picker/picker';
import { RadioButton } from 'react-native-paper';
import { GetGoals } from '../../database/Goals';
import { GetPrograms } from '../../database/ManageProgram';
import { GetDept, GetUsers } from '../../database/Departments';
import NestedDeptDropdownGoals from '../../modals/NestedDropdownGoals';
import { GetSequence, InsertApproval, InsertDraft, InsertReview, InsertSequence } from '../../database/Intake';
import * as Yup from 'yup';
import { Formik } from 'formik';
import DatePicker from 'react-datepicker'; 
import 'react-datepicker/dist/react-datepicker.css';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import NestedDeptDropdownNewProjects from '../../modals/NestedDeptDropDownNewProjects';


const NewIntake = () => {
  // States
  const [nameTitle, setNameTitle] = useState('');
  const [classification, setClassification] = useState('');
  const [goal, setGoal] = useState('');
  const [program, setProgram] = useState('');
  const [businessOwner, setBusinessOwner] = useState('');
  const [businessOwnerDept, setBusinessOwnerDept] = useState<number>(-1);
  const [projectOwner, setProjectOwner] = useState('');
  const [projectOwnerDept, setProjectOwnerDept] = useState<number>(-1);
  const [projectManager, setProjectManager] = useState('');
  const [impactedFunction, setImpactedFunction] = useState('');
  const [impactedApp, setImpactedApp] = useState('');
  const [priority, setPriority] = useState('');
  const [budget, setBudget] = useState('');
  const [projectSize, setProjectSize] = useState('');
  const [startDate, setStartDate] = useState('');
  //const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState('');
  //const [endDate, setEndDate] = useState<Date | null>(null);
  const [goLiveDate, setGoLiveDate] = useState('');
  const [businessProblem, setBusinessProblem] = useState('');
  const [scopeDefinition, setScopeDefinition] = useState('');
  const [keyAssumption, setKeyAssumption] = useState('');
  const [benefitsROI, setBenefitsROI] = useState('');
  const [projectDrivers, setProjectDrivers] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');
  const [selectedOptionApp, setSelectedOptionApp] = useState('');
  const [approvalPath, setApprovalPath] = useState('');
  const [approvalPathidApp, setApprovalPathidApp] = useState('');
  const [approvalPathid, setApprovalPathid] = useState('');
  const [approvalPathOther, setApprovalPathOther] = useState('');
  const [goals, setGoals] = useState([]);
  const [goalSelected, setGoalSelected] = useState('');
  const[programData,setProgramData]= useState([]);
  const[businessData,setBusinessData]= useState([]);
  const[projectData,setProjectData]= useState([]);
  const[projectMgr,setprojectMgr]= useState([]);
  const [roi, setRoi] = useState('');
  const [risk, setRisk] = useState('');
  
  const [showNewApprovalForm, setShowNewApprovalForm] = useState(false);
  const [designation, setDesignation] = useState('');
  const [isApprovalButtonVisible, setIsApprovalButtonVisible] = useState(false);
  const [action, setAction] = useState('');
  const [steps, setSteps] = useState([{ id: 1, forwardTo: '', designation: '', action: '' }]);
  const[sequence,setSequence]= useState([]);
  const [users, setUsers] = useState([]);
  const [sequenceName, setSequenceName] = useState('');
  const [projectId, setProjectId] = useState('');
  const [isApprovalPopupVisible, setIsApprovalPopupVisible] = useState(false);
  
  const [rawStartDate, setRawStartDate] = useState(null);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [rawEndDate, setRawEndDate] = useState(null); 
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [rawGoLiveDate, setRawGoLiveDate] = useState(null);
  const [showGoLiveDatePicker, setShowGoLiveDatePicker] = useState(false);
  const [startDateDisplay, setStartDateDisplay] = useState('');
  const [endDateDisplay, setEndDateDisplay] = useState('');
  const [liveDateDisplay, setLiveDateDisplay] = useState('');
  const addStep = () => {
    setSteps([...steps, { id: steps.length + 1, forwardTo: '', designation: '', action: '' }]);
  };
  const [modalText, setModalText] = useState('Sending for Review');  // Default modal text



    const mapUserIdToDeptId= (id: number) => {
      console.log(id);
      const ChosenUser = users.find(item => item.user_id === id);
      console.log(ChosenUser);
      return ChosenUser ? ChosenUser.department_id : ' ';
    };
  
  // Handlers to change modal text and show the popup
  const handleApprovalClick = () => {
    setModalText('Sending for Approval');
    setIsPopupVisible(true);  
  };

  const handleReviewClick = () => {
    setModalText('Sending for Review');
    setIsPopupVisible(true); 
  };
  const [isNewButtonVisible, setIsNewButtonVisible] = useState(false);
/*   const addStep = () => {
    setSteps((prevSteps) => [
      ...prevSteps,
      { 
        id: prevSteps.length + 1, 
        forwardTo: '', 
        department: '', // Add department field
        designation: '', 
        action: '' 
      },
    ]);
  }; */
  const removeStep = (id) => {
    if (steps.length > 1) {
      const newSteps = steps.filter(step => step.id !== id).map((step, index) => ({
        ...step,
        id: index + 1
      }));
      setSteps(newSteps);
    }
  };
  const [isCreatingSequence, setIsCreatingSequence] = useState(false);
 
  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const response = await GetGoals(''); 
        const result = JSON.parse(response);
        if (result?.data?.goals && Array.isArray(result.data.goals)) {
        setGoals(result.data.goals); 
      } else {
        console.error("Invalid goals data");
        Alert.alert("Error", "Invalid goals data received");
      }
    } catch (error) {
        console.error('Error fetching goals:', error);
        //setGoals([]);
    }
    };
    const fetchPrograms = async () => {
        try {
          const response = await GetPrograms(''); 
          const result = JSON.parse(response);
          if (result?.status === 'success' && Array.isArray(result?.data?.programs)) {
            setProgramData(result.data.programs);
            console.log('Fetched Programs:', result.data.programs);
        }  else {
            console.error("Invalid programs data");
            Alert.alert("Error", "Invalid goals data received");
          }
      } catch (error) {
          console.error('Error fetching Programs:', error);
          //setGoals([]);
      }
      };


      const fetchBusinessOwner = async () => {
        try {
            const response = await GetUsers('');
            console.log('Raw Response:', response); 
            const result = JSON.parse(response);
            
            if (result?.status === 'success' && Array.isArray(result?.data?.users)) {
                setBusinessData(result.data.users);
                console.log('Fetched Business Owners:', result.data.users);
            } else {
                console.error("Invalid users data structure");
                Alert.alert("Error", "Invalid business owner data received");
            }
        } catch (error) {
            console.error('Error fetching Business Owners:', error);
            Alert.alert("Error", "Failed to fetch business owners. Please try again later.");
        }
    };

    const fetchProjectOwner = async () => {
        try {
            const response = await GetUsers('');
            console.log('Raw Response:', response); 
            const result = JSON.parse(response);
            
            if (result?.status === 'success' && Array.isArray(result?.data?.users)) {
                setProjectData(result.data.users);
                console.log('Fetched Project Owners:', result.data.users);
            } else {
                console.error("Invalid Project data structure");
                Alert.alert("Error", "Invalid Project owner data received");
            }
        } catch (error) {
            console.error('Error fetching Project Owners:', error);
            Alert.alert("Error", "Failed to fetch Project owners. Please try again later.");
        }
    };
    const fetchProjectManager = async () => {
        try {
            const response = await GetUsers('');
            console.log('Raw Response:', response); 
            const result = JSON.parse(response);
            
            if (result?.status === 'success' && Array.isArray(result?.data?.users)) {
                setprojectMgr(result.data.users);
                console.log('Fetched Project Manager:', result.data.users);
            } else {
                console.error("Invalid users data structure");
                Alert.alert("Error", "Invalid business owner data received");
            }
        } catch (error) {
            console.error('Error fetching Project Manager:', error);
            Alert.alert("Error", "Failed to fetch Project Manager. Please try again later.");
        }
    };

    const fetchSequence = async () => {
        try {
          const response = await GetSequence('');
          const result = JSON.parse(response);
  
          // Ensure the response format is correct and contains data
          if (result?.status === 'success' && result?.data && Array.isArray(result.data)) {
            setSequence(result.data); 
          } else {
            console.error("Invalid goals data");
            Alert.alert("Error", "Invalid goals data received");
          }
        } catch (error) {
          console.error('Error fetching sequences:', error);
          Alert.alert("Error", "Error fetching sequences");
        }
      };
      const fetchUsers = async () => {
        try {
          const response = await GetUsers(''); 
          const result = JSON.parse(response);
          if (result?.status === 'success' && Array.isArray(result?.data?.users)) {
          setUsers(result.data.users); 
          console.log('fetched user data',result.data.users)
        } else {
          console.error("Invalid Users data");
          Alert.alert("Error", "Invalid USERS data received");
        }
      } catch (error) {
          console.error('Error fetching goals:', error);
          //setGoals([]);
      }
      };
  
      // Call the function to fetch data
      fetchSequence();
    fetchProjectManager();
    fetchGoals();
    fetchPrograms();
    fetchUsers();
    fetchBusinessOwner();
    fetchProjectOwner();
  }, []);
   const fetchSequence = async () => {
        try {
          const response = await GetSequence('');
          const result = JSON.parse(response);
  
          // Ensure the response format is correct and contains data
          if (result?.status === 'success' && result?.data && Array.isArray(result.data)) {
            setSequence(result.data); 
          } else {
            console.error("Invalid goals data");
            Alert.alert("Error", "Invalid goals data received");
          }
        } catch (error) {
          console.error('Error fetching sequences:', error);
          Alert.alert("Error", "Error fetching sequences");
        }
      };
  const handleBusinessOwnerDept = (deptID: number) => {
    setBusinessOwnerDept(deptID); 
    console.log(`Selected Stakeholder: ${deptID}`);
    console.log(`Updated Business Owner Department: ${deptID}`);
  };
  const handleProjectOwnerDept = (deptID: number) => {
    setProjectOwnerDept(deptID); 
    console.log(`Selected Stakeholder: ${deptID}`);
    console.log(`Updated Project Owner Department: ${deptID}`);
  };



  const validationSchema = Yup.object().shape({
    nameTitle: Yup.string().required('Name/Title is required'),
    classification: Yup.string().required('Classification is required'),
    goalSelected: Yup.string().required('Goal is required'),
    program: Yup.string().required('Program is required'),
    businessOwner: Yup.string().required('Business Owner is required'),
    businessOwnerDept: Yup.string().required('Business Owner Department is required'),
    projectOwner: Yup.string().required('Project Owner is required'),
    projectOwnerDept: Yup.string().required('Project Owner Department is required'),
    projectManager: Yup.string().required('Project Manager is required'),
    impactedFunction: Yup.string().required('Impacted Function is required'),
    impactedApp: Yup.string().required('Impacted Application is required'),
    priority: Yup.string().required('Priority is required'),
    budget: Yup.string().required('Budget is required'),
    projectSize: Yup.string().required('Project Size is required'),
    startDate: Yup.date().required('Project Start Date is required'),
    endDate: Yup.date().required('Project End Date is required'),
    goLiveDate: Yup.date().required('Go Live Date is required'),
    roi: Yup.number().required('ROI is required').positive('ROI must be a positive number'),
    businessProblem: Yup.string().required('Business Problem/Description is required'),
    scopeDefinition: Yup.string().required('Scope Definition is required'),
    keyAssumption: Yup.string().required('Key Assumption is required'),
    benefitsROI: Yup.string().required('Benefits/ROI is required'),
    risk: Yup.string().required('Risk is required'),
  });
  

  const handleSaveDraft = async () => {
    try {
      // Validate required fields
      if (!nameTitle || !classification || !goalSelected || !program || !startDate || !endDate || !goLiveDate) {
        Alert.alert('Please fill in all required fields.');
        return;
      }
  
      const programDataToSubmit = {
        project_name: nameTitle,
        department_id:null,
        classification: classification,
        goal_id: Number(goalSelected),
        program_id: Number(program),
        business_stakeholder_user: Number(businessOwner),
        business_stakeholder_dept: mapUserIdToDeptId(parseInt(businessOwner)), // automatically bind the deptid if user id has a dept defined already
        project_owner_user: Number(projectOwner),
        project_owner_dept: mapUserIdToDeptId(parseInt(projectOwner)),
        project_manager_id:Number(projectManager) ,
        // impacted_stakeholder_dept: , 
        impacted_function:Number(impactedFunction),
        impacted_applications:Number(impactedApp),
        priority: Number(priority),
        budget_size: budget,
        project_size: projectSize, 
        start_date: startDate,
        end_date: endDate,
        golive_date: goLiveDate,
        roi:roi,
        business_desc:businessProblem,
        scope_definition:scopeDefinition,
        key_assumption:keyAssumption,
        benefit_roi:benefitsROI,
        risk:risk,
      };
  
      // Log the object for debugging
      console.log(programDataToSubmit);
     
      
  
      const response = await InsertDraft(programDataToSubmit);
      const parsedResponse = JSON.parse(response);
  
      if (parsedResponse.status === 'success') {
        Alert.alert('Draft saved successfully');
        const projectId = parsedResponse.data.project_id;
      console.log('Project ID:', projectId);


      setProjectId(projectId);
      

      setNameTitle('');
      setClassification('');
      setGoalSelected('');
      setProgram('');
      setBusinessOwner('');
      setBusinessOwnerDept(0);
      setProjectOwner('');
      setProjectOwnerDept(0);
      setProjectManager('');
      setImpactedFunction('');
      setImpactedApp('');
      setPriority('');
      setBudget('');
      setProjectSize('');
      setStartDate('');
      setEndDate('');
      setGoLiveDate('');
      setRoi('');
      setBusinessProblem('');
      setScopeDefinition('');
      setKeyAssumption('');
      setBenefitsROI('');
      setRisk('');

      return projectId;
      } else {
        Alert.alert('Failed to save draft. Please try again.');
      }
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        Alert.alert(
          'Validation Error',
          error.errors.join('\n') // Display all validation errors
        );
      } else {
        console.error('Error saving draft:', error);
        Alert.alert('An error occurred. Please try again.');
      }
    }
  };
  /* const handleSubmit = async () => {
    if (isCreatingSequence) {
      // Step 1: Call the sequence creation API when creating a new sequence
      const approvalSequenceDetails = steps.map((step, index) => ({
        sequence_no: index + 1,  
        user_id: step.forwardTo,  
      }));
      const payload1 = {
        aprvl_seq_name: sequenceName,  // Set the sequence name dynamically as needed
        approval_sequence_details: approvalSequenceDetails,  // Array of user IDs and their sequence numbers
      };
      console.log(payload1);
      try {
        await InsertSequence(payload1); 
        console.log('Sequence created successfully');
  
        // Step 2: Proceed with submitting the approval once the sequence is created
        //await submitApproval(); // Replace with your actual logic to submit approval after sequence creation
        console.log('Approval submitted successfully');
        
        Alert.alert('Sequence created and approval submitted successfully!');
        setIsPopupVisible(false); // Close the modal on success
  
      } catch (error) {
        console.error('Error creating sequence or submitting approval:', error);
        Alert.alert('Error occurred. Please try again.');
      } finally {
        setIsCreatingSequence(false); // Reset the flag
      }
    } else {
      
      const payload = {
        aprvl_seq_id: approvalPathid,  // Send the selected approval sequence ID
        // Add any other necessary data to the payload (e.g., project ID)
      };
  
      try {
        const response = await InsertReview(payload);  // Replace with your submit logic
        const result = JSON.parse(response);
  
        if (result.status === 'success') {
          Alert.alert('Submission successful!');
          setIsPopupVisible(false); // Close the modal
        } else {
          Alert.alert('Failed to submit. Please try again.');
        }
      } catch (error) {
        console.error('Error submitting:', error);
        Alert.alert('An error occurred while submitting. Please try again.');
      }
    }
  }; */
  const handlereview = async () => {
    try {
      let currentProjectId = projectId;
  
      if (!currentProjectId) {
        currentProjectId = await handleSaveDraft(); 
      }
  
      if (currentProjectId) {
        const payload = {
          aprvl_seq_id: Number(approvalPathid),
          project_id: Number(currentProjectId),
          type: "review",
          approval_type: Number(selectedOption),
        };
  
        const response = await InsertReview(payload); 
        const result = JSON.parse(response);
  
        if (result.status === 'success') {
          Alert.alert('Submission successful!');
          setIsPopupVisible(false); 
        } else {
          Alert.alert('Failed to submit. Please try again.');
        }
      } else {
        Alert.alert('Unable to retrieve project ID. Submission aborted.');
      }
    } catch (error) {
      console.error('Error submitting:', error);
      Alert.alert('An error occurred while submitting. Please try again.');
    }
  };
  
  const handleapproval = async () => {
    try {
      let currentProjectId = projectId;
  
      if (!currentProjectId) {
        currentProjectId = await handleSaveDraft(); 
      }
  
      if (currentProjectId) {
        const payload = {
          //aprvl_seq_id: Number(approvalPathidApp),
          project_id: Number(currentProjectId),
          sent_to: Number(approvalPathid),
          type: "approval",
          approval_type: Number(selectedOptionApp),
        };
  
        const response = await InsertApproval(payload); 
        const result = JSON.parse(response);
  
        if (result.status === 'success') {
          Alert.alert('Submission successful!');
          setIsPopupVisible(false); 
          setIsApprovalPopupVisible(false)
        } else {
          Alert.alert('Failed to submit. Please try again.');
        }
      } else {
        Alert.alert('Unable to retrieve project ID. Submission aborted.');
      }
    } catch (error) {
      console.error('Error submitting:', error);
      Alert.alert('An error occurred while submitting. Please try again.');
    }
  };
  
  
  const createSequence = async () => {
    const approvalSequenceDetails = steps.map((step, index) => ({
      sequence_no: index + 1,  // Sequence number based on index
      user_id: step.forwardTo,
      is_active: true,  // User ID selected for each step
    }));
  
    const payload1 = {
      aprvl_seq_name: sequenceName,  // Name of the approval sequence (from input)
      approval_sequence_details: approvalSequenceDetails,  // Array of user IDs with sequence numbers
    };
    console.log('Creating sequence with payload:', payload1);
  
    try {
      // Call the API to create the sequence
      await InsertSequence(payload1);  // Replace with your actual API call
      console.log('Sequence created successfully');
      Alert.alert('Sequence created successfully!');
      setShowNewApprovalForm(false);
      fetchSequence()
      return true;  // Return true to indicate sequence creation success
    } catch (error) {
      console.error('Error creating sequence:', error);
      Alert.alert('Error creating sequence. Please try again.');
      return false;  // Return false if there was an error
    }
  };
  const handleDateChange = (date) => {
    setRawStartDate(date);
    setStartDateDisplay(format(date, 'MM-dd-yyyy'));
    setStartDate(format(date, 'yyyy-MM-dd')); // Format date for the input field
    setShowStartDatePicker(false); // Close the picker
  };
  const handleEndDateChange = (date) => {
    setRawEndDate(date);
    setEndDateDisplay(format(date, 'MM-dd-yyyy'));
    setEndDate(format(date, 'yyyy-MM-dd')); // Format date for the input field
    setShowEndDatePicker(false); // Close the picker
  };

  const handleGoLiveDateChange = (date) => {
    setRawGoLiveDate(date);
    setLiveDateDisplay(format(date, 'MM-dd-yyyy'));
    setGoLiveDate(format(date, 'yyyy-MM-dd')); // Format date for the input field
    setShowGoLiveDatePicker(false); // Close the picker
  };
  return (<Formik
    initialValues={{
      nameTitle: '',
      classification: '',
      goalSelected: '',
      program: '',
      businessOwner: '',
      businessOwnerDept: '',
      projectOwner: '',
      projectOwnerDept: '',
      projectManager: '',
      impactedFunction: '',
      impactedApp: '',
      priority: '',
      budget: '',
      projectSize: '',
      startDate: '',
      endDate: '',
      goLiveDate: '',
      roi: '',
      businessProblem: '',
      scopeDefinition: '',
      keyAssumption: '',
      benefitsROI: '',
      risk: '',
    }}
    validationSchema={validationSchema}
    onSubmit={(values) => {
      console.log(values);
    }}
  >
    {({
      handleChange,
      handleBlur,
      handleSubmit,
    
      values,
      errors,
      touched,
    }) => (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Icon name="arrow-back" size={18} color="#232323" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create New Intake</Text>
        <View style={{ width: 50 }} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View>
          {/* First Row */}
          <View style={styles.row}>
            <View style={styles.largeInputContainer1}>
              <Text style={styles.inputLabel}>
                Name/Title <Text style={styles.asterisk}>*</Text>
              </Text>
            
              <TextInput
                style={styles.largeInput}
                value={nameTitle}
                onChangeText={setNameTitle}
              />
               {touched.nameTitle && errors.nameTitle && (<Text style={{color:'red'}} >{errors.nameTitle}</Text>)}
            </View>

            <View style={styles.smallInputContainer}>
              <Text style={styles.inputLabel}>
                Classification <Text style={styles.asterisk}>*</Text>
              </Text>
              <Picker
                selectedValue={classification}
                onValueChange={(value) => setClassification(value)}
                style={styles.input}
              >
                <Picker.Item label="Select Classification" value="" />
                <Picker.Item label="Type 1" value="1" />
                <Picker.Item label="Type 2" value="2" />
              </Picker>
              {touched.classification && errors.classification && (<Text style={{color:'red'}} >{errors.classification}</Text>)}
            </View>

            {/* <TouchableOpacity style={styles.approvalButton}>
              <Icon name="time-outline" size={18} color="#044086" style={styles.approvalIcon} />
              <Text style={styles.approvalButtonText}>Approval History</Text>
            </TouchableOpacity> */}
          </View>

          {/* Second Row */}
          <View style={styles.row}>
            <View style={styles.smallInputContainer}>
            <Text style={styles.inputLabel}>Goal</Text>
      <Picker
        selectedValue={goalSelected}
        onValueChange={(value) => setGoalSelected(value)}
        style={styles.input}
      >
        <Picker.Item label="Select Goal" value="" />
  {goals.map((goalItem) => (
    <Picker.Item 
      key={goalItem.goal_id} // Use goal_id as key
      label={goalItem.goal_name} // Use goal_name as the label
      value={goalItem.goal_id} // Use goal_id as the value
    />
  ))}
      </Picker>
      {/* {touched.goalSelected && errors.goalSelected && (<Text style={{color:'red'}} >{errors.goalSelected}</Text>)} */}
            </View>

            <View style={styles.smallInputContainer}>
              <Text style={styles.inputLabel}>Program</Text>
              <Picker
                selectedValue={program}
                onValueChange={(value) => setProgram(value)}
                style={styles.input}
              >
                 <Picker.Item label="Select Program" value="" />
    {programData.length > 0 ? (
        programData.map((ProgramItem) => (
            <Picker.Item 
                key={ProgramItem.program_id} 
                label={ProgramItem.program_name} 
                value={ProgramItem.program_id} 
            />
        ))
    ) : (
        <Picker.Item label="No Programs Available" value="" />
    )}
              </Picker>
            </View>
          </View>

          {/* Business Owner Row */}
          <View style={styles.row}>
            <View style={styles.smallInputContainer}>
              <Text style={styles.inputLabel}>Business Owner<Text style={styles.asterisk}>*</Text></Text>
              <Picker
                selectedValue={businessOwner}
                onValueChange={(value) => setBusinessOwner(value)}
                style={styles.input}
              >
                <Picker.Item label="Select Business Owner" value="" />
    {businessData.length > 0 ? (
        businessData.map((BusinessItem) => (
            <Picker.Item 
                key={BusinessItem.user_id} 
                label={BusinessItem.first_name} 
                value={BusinessItem.user_id} 
            />
        ))
    ) : (
        <Picker.Item label="No Business Owner Available" value="" />
    )}
              </Picker>
              {touched.businessOwner && errors.businessOwner && (<Text style={{color:'red'}} >{errors.businessOwner}</Text>)}
            </View>

            <View style={styles.largeInputContainer}>
              <Text style={styles.inputLabel}>Business Owner Department<Text style={styles.asterisk}>*</Text></Text>
             
                <NestedDeptDropdownNewProjects onSelect={handleBusinessOwnerDept} buisnessPersonId={parseInt(businessOwner)}/>
                {touched.businessOwnerDept && errors.businessOwnerDept && (<Text style={{color:'red'}} >{errors.businessOwnerDept}</Text>)}
            </View>
          </View>

          {/* Project Owner Row */}
          <View style={styles.row}>
            <View style={styles.smallInputContainer}>
              <Text style={styles.inputLabel}>Project Owner<Text style={styles.asterisk}>*</Text></Text>
              <Picker
                selectedValue={projectOwner}
                onValueChange={(value) => setProjectOwner(value)}
                style={styles.input}
              >
                <Picker.Item label="Select Project Owner" value="" />
    {projectData.length > 0 ? (
        projectData.map((projectItem) => (
            <Picker.Item 
                key={projectItem.user_id} 
                label={projectItem.first_name} 
                value={projectItem.user_id} 
            />
        ))
    ) : (
        <Picker.Item label="No Project Owner Available" value="" />
    )}
              </Picker>
              {touched.projectOwner && errors.projectOwner && (<Text style={{color:'red'}} >{errors.projectOwner}</Text>)}
            </View>

            <View style={styles.largeInputContainer}>
              <Text style={styles.inputLabel}>Project Owner Department<Text style={styles.asterisk}>*</Text></Text>
              <NestedDeptDropdownNewProjects onSelect={handleProjectOwnerDept}  buisnessPersonId={parseInt(projectOwner)}/>

              {touched.projectOwnerDept && errors.projectOwnerDept && (<Text style={{color:'red'}} >{errors.projectOwnerDept}</Text>)}
            </View>
          </View>

          {/* Project Manager Row */}
          <View style={styles.row}>
            <View style={styles.smallInputContainer}>
              <Text style={styles.inputLabel}>Project Manager<Text style={styles.asterisk}>*</Text></Text>
              <Picker
                selectedValue={projectManager}
                onValueChange={(value) => setProjectManager(value)}
                style={styles.input}
              >
                <Picker.Item label="Select Project Owner" value="" />
    {projectMgr.length > 0 ? (
        projectMgr.map((projectItem) => (
            <Picker.Item 
                key={projectItem.user_id} 
                label={projectItem.first_name} 
                value={projectItem.user_id} 
            />
        ))
    ) : (
        <Picker.Item label="No Project Owner Available" value="" />
    )}
              </Picker>
              {touched.projectManager && errors.projectManager && (<Text style={{color:'red'}} >{errors.projectManager}</Text>)}

            </View>

            <View style={styles.smallInputContainer}>
              <Text style={styles.inputLabel}>Impacted Function<Text style={styles.asterisk}>*</Text></Text>
              <Picker
                selectedValue={impactedFunction}
                onValueChange={(value) => setImpactedFunction(value)}
                style={styles.input}
              >
                <Picker.Item label="Select Function" value="" />
                <Picker.Item label="Function 1" value="function1" />
                <Picker.Item label="Function 2" value="function2" />
              </Picker>
              {touched.impactedFunction && errors.impactedFunction && (<Text style={{color:'red'}} >{errors.impactedFunction}</Text>)}

            </View>

            <View style={styles.smallInputContainer}>
              <Text style={styles.inputLabel}>Impacted Application<Text style={styles.asterisk}>*</Text></Text>
              <Picker
                selectedValue={impactedApp}
                onValueChange={(value) => setImpactedApp(value)}
                style={styles.input}
              >
                <Picker.Item label="Select Application" value="" />
                <Picker.Item label="App 1" value="app1" />
                <Picker.Item label="App 2" value="app2" />
              </Picker>
              {touched.impactedApp && errors.impactedApp && (<Text style={{color:'red'}} >{errors.impactedApp}</Text>)}

            </View>
          </View>

          {/* Priority Row */}
          <View style={styles.row}>
            <View style={styles.smallInputContainer}>
              <Text style={styles.inputLabel}>Priority<Text style={styles.asterisk}>*</Text></Text>
              <Picker
                selectedValue={priority}
                onValueChange={(value) => setPriority(value)}
                style={styles.input}
              >
                <Picker.Item label="Select Priority" value="" />
                <Picker.Item label="Critical" value="1" />
                <Picker.Item label="High" value="2" />
                <Picker.Item label="Medium" value="3" />
                <Picker.Item label="Low" value="4" />
              </Picker>
              {touched.priority && errors.priority && (<Text style={{color:'red'}} >{errors.priority}</Text>)}

            </View>

            <View style={styles.smallInputContainer}>
              <Text style={styles.inputLabel}>Budget<Text style={styles.asterisk}>*</Text></Text>
              <Picker
                selectedValue={budget}
                onValueChange={(value) => setBudget(value)}
                style={styles.input}
              >
                <Picker.Item label="Select Budget" value="" />
                <Picker.Item label="High" value="1" />
                <Picker.Item label="Medium" value="2" />
                <Picker.Item label="Low" value="3" />
              </Picker>
              {touched.budget && errors.budget && (<Text style={{color:'red'}} >{errors.budget}</Text>)}

            </View>

            <View style={styles.smallInputContainer}>
              <Text style={styles.inputLabel}>Project Size<Text style={styles.asterisk}>*</Text></Text>
              <Picker
                selectedValue={projectSize}
                onValueChange={(value) => setProjectSize(value)}
                style={styles.input}
              >
                <Picker.Item label="Select Size" value="" />
                <Picker.Item label="Large" value="1" />
               
                <Picker.Item label="Medium" value="2" />
                <Picker.Item label="Small" value="3" />
               
              </Picker>
              {touched.projectSize && errors.projectSize && (<Text style={{color:'red'}} >{errors.projectSize}</Text>)}

            </View>
          </View>

          {/* Dates Row */}
          <View style={styles.row}>
            <View style={styles.smallInputContainer}>
              <Text style={styles.inputLabel}>Project Start Date<Text style={styles.asterisk}>*</Text></Text>
              <TextInput
        style={styles.input}
        value={startDateDisplay}
        onFocus={() => setShowStartDatePicker(true)}
        placeholder="Select Start Date"
        editable={Platform.OS !== 'web'} // Disable manual input on web
      />
      {/* <TouchableOpacity onPress={() => setShowStartDatePicker(true)}>
        <Icon name="calendar-today" size={20} color="#044086" style={styles.icon} />
      </TouchableOpacity> */}
      {touched?.startDate && errors?.startDate && (
        <Text style={{ color: 'red' }}>{errors.startDate}</Text>
      )}

      {Platform.OS === 'web' && showStartDatePicker && (
        <DatePicker
          selected={rawStartDate}
          onChange={handleDateChange}
          dateFormat="MM-dd-yyyy"
          inline // Inline style for better usability
        />
      )}
      </View>
            <View style={styles.smallInputContainer}>
              <Text style={styles.inputLabel}>Project End Date<Text style={styles.asterisk}>*</Text></Text>
              <TextInput
        style={styles.input}
        value={endDateDisplay}
        onFocus={() => setShowEndDatePicker(true)}
        placeholder="Select End Date"
        editable={Platform.OS !== 'web'} // Disable manual input on web
      />
      {/* <TouchableOpacity onPress={() => setShowEndDatePicker(true)}>
        <Icon name="calendar-today" size={20} color="#044086" style={styles.icon} />
      </TouchableOpacity> */}
      {touched?.endDate && errors?.endDate && (
        <Text style={{ color: 'red' }}>{errors.endDate}</Text>
      )}

      {Platform.OS === 'web' && showEndDatePicker && (
        <DatePicker
          selected={rawEndDate}
          onChange={handleEndDateChange}
          dateFormat="MM-dd-yyyy"
          inline // Inline style for better usability
        />
      )}
    </View>
         

            <View style={styles.smallInputContainer}>
              <Text style={styles.inputLabel}>Go Live Date<Text style={styles.asterisk}>*</Text></Text>
              <TextInput
        style={styles.input}
        value={liveDateDisplay}
        onFocus={() => setShowGoLiveDatePicker(true)}
        placeholder="Select Go Live Date"
        editable={Platform.OS !== 'web'} // Disable manual input on web
      />
      {/* <TouchableOpacity onPress={() => setShowGoLiveDatePicker(true)}>
        <Icon name="calendar-today" size={20} color="#044086" style={styles.icon} />
      </TouchableOpacity> */}
      {touched?.goLiveDate && errors?.goLiveDate && (
        <Text style={{ color: 'red' }}>{errors.goLiveDate}</Text>
      )}

      {Platform.OS === 'web' && showGoLiveDatePicker && (
        <DatePicker
          selected={rawGoLiveDate}
          onChange={handleGoLiveDateChange}
          dateFormat="MM-dd-yyyy"
          inline // Inline style for better usability
        />
      )}
    </View>
          </View>

          {/* ROI Section */}
          <Text style={styles.roiHeading}>Return on Investment</Text>

          <View style={styles.row}>
            <View style={styles.smallInputContainer}>
              <Text style={styles.inputLabel}>
                Enter the approx. ROI <Text style={styles.asterisk}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                value={roi}
                onChangeText={setRoi}
                placeholder="Enter ROI"
              />
              {touched.roi && errors.roi && (<Text style={{color:'red'}} >{errors.roi}</Text>)}

            </View>
            <View style={styles.templateContainer}>
              <Text style={styles.customTemplateText}>Custom Template</Text>
              <View style={styles.customTemplateGroup}>
                <TouchableOpacity style={styles.templateButton}>
                  <Icon name="download-outline" size={18} color="#000" style={styles.icon} />
                  <Text style={styles.templateButtonText}>Download Template</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.templateButton}>
                  <Icon name="cloud-upload-outline" size={18} color="#000" style={styles.icon} />
                  <Text style={styles.templateButtonText}>Upload</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={styles.divider} />

          <Text style={styles.projectDriversHeading}>Project Drivers</Text>

          {/* Business Problem/Description and Scope Definition Row */}
          <View style={styles.row5}>
            <View style={styles.halfInputContainer}>
              <Text style={styles.inputLabel}>Business Problem/Description<Text style={styles.asterisk}>*</Text></Text>
              <TextInput
                style={styles.outlinedInput}
                placeholder="Enter Business Problem/Description"
                value={businessProblem}
                onChangeText={setBusinessProblem}
              />
            </View>
            <View style={styles.halfInputContainer}>
              <Text style={styles.inputLabel}>Scope Definition<Text style={styles.asterisk}>*</Text></Text>
              <TextInput
                style={styles.outlinedInput}
                placeholder="Enter Scope Definition"
                value={scopeDefinition}
                onChangeText={setScopeDefinition}
              />
            </View>
          </View>

          {/* Key Assumption and Benefits/ROI Row */}
          <View style={styles.row5}>
            <View style={styles.halfInputContainer}>
              <Text style={styles.inputLabel}>Key Assumption<Text style={styles.asterisk}>*</Text></Text>
              <TextInput
                style={styles.outlinedInput}
                placeholder="Enter Key Assumption"
                value={keyAssumption}
                onChangeText={setKeyAssumption}
              />
            </View>
            <View style={styles.halfInputContainer}>
              <Text style={styles.inputLabel}>Benefits/ROI<Text style={styles.asterisk}>*</Text></Text>
              <TextInput
                style={styles.outlinedInput}
                placeholder="Enter Benefits/ROI"
                value={benefitsROI}
                onChangeText={setBenefitsROI}
              />
            </View>
          </View>

          {/* Risk Input */}
          <View style={styles.row5}>
            <View style={styles.halfInputContainer}>
              <Text style={styles.inputLabel}>Risk<Text style={styles.asterisk}>*</Text></Text>
              <TextInput
                style={styles.outlinedInput}
                placeholder="Enter Risk"
                value={risk}
                onChangeText={setRisk}
              />
            </View>
          </View>

          {/* Custom Fields Button and Checkbox */}
          <View style={styles.row}>
            <View style={styles.customFieldsContainer}>
              <View style={styles.checkboxContainer}>
                <TouchableOpacity
                  style={[styles.checkbox, isChecked && styles.checked]}
                  onPress={() => setIsChecked(!isChecked)}
                >
                  {isChecked && <Icon name="checkmark" size={18} color="#fff" />}
                </TouchableOpacity>
              </View>
              <TouchableOpacity style={styles.customFieldsButton}>
                <Text style={styles.customFieldsButtonText}>Add custom fields</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Bottom Buttons */}
          <View style={styles.bottomButtonsContainer}>
          <View style={styles.leftButtonContainer}>
  <TouchableOpacity style={styles.saveAsDraftButton}  onPress={handleSaveDraft}  >
    <Icon name="save-outline" size={18} color="#044086" style={styles.saveIcon} />
    <Text style={styles.saveAsDraftButtonText}>Save as draft</Text>
  </TouchableOpacity>
  </View>

  <View style={styles.rightButtonsContainer}>
  {/* Approval Button */}
  <TouchableOpacity 
    style={styles.sendForReviewButton}
    onPress={handleReviewClick} 
  >
    <Icon name="paper-plane-outline" size={18} color="#fff" style={styles.newButtonIcon} />
    <Text style={styles.sendForReviewButtonText}>Send for Review</Text>
  </TouchableOpacity>
  <TouchableOpacity 
      style={styles.newButton}
      onPress={() => {setIsApprovalPopupVisible(true)}}
    >
      <Icon name="checkmark-circle-outline" size={18} color="#044086" style={styles.newButtonIcon} />
      <Text style={styles.newButtonText}>Send for Approval</Text>
    </TouchableOpacity>
</View>
</View>

        </View>
      </ScrollView>
{/* Send for Approval Modal */}
<Modal
          visible={isApprovalPopupVisible}
          transparent={true}
          animationType="fade"
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <TouchableOpacity 
                style={styles.closeIcon} 
                onPress={() => setIsApprovalPopupVisible(false)}
              >
                <Icon name="close" size={24} color="#000" />
              </TouchableOpacity>
              <Text style={styles.popupHeading}>Sending for Approval</Text>
              <RadioButton.Group onValueChange={value => setSelectedOptionApp(value)} value={selectedOptionApp}>
                <View style={styles.radioOptionsRow}>
                  <View style={styles.radioOption}>
                    <RadioButton.Android value="1" color="#044086" />
                    <Text style={styles.radioText}>In person meeting</Text>
                  </View>
                  <View style={styles.radioOption}>
                    <RadioButton.Android value="2" color="#044086" />
                    <Text style={styles.radioText}>Authorization process</Text>
                  </View>
                </View>
              </RadioButton.Group>
              <ScrollView 
                style={styles.modalScrollView}
                showsVerticalScrollIndicator={false}
              >
                {/* Content for Send for Approval */}
                <View style={styles.approvalPathContainer}>
                  <View style={styles.approvalPathInputContainer}>
                    <Text style={styles.approvalPathLabel}>
                      Approval user list <Text style={styles.asterisk}>*</Text>
                    </Text>
                    <View style={styles.approvalPathInput}>
                      <Picker
                        key={approvalPathidApp}
                        selectedValue={approvalPathid}
                        onValueChange={(itemValue) => {
                          console.log("Selected Value:", itemValue);
                          setApprovalPathidApp(itemValue);
                        }}
                        style={styles.input}
                      >
                        {sequence.length > 0 ? (
                          sequence.map((projectItem) => (
                            <Picker.Item
                              key={projectItem.aprvl_seq_id}
                              label={projectItem.aprvl_seq_name}
                              value={projectItem.aprvl_seq_id}
                            />
                          ))
                        ) : (
                          <Picker.Item label="No Approval path available" value="" />
                        )}
                      </Picker>
                    </View>
                  </View>
           
    
   
     

                </View>
                <View style={styles.approvalPathContainer}>
                  <View style={styles.approvalPathInputContainer}>
                    <Text style={styles.approvalPathLabel}>
                      Select Others <Text style={styles.asterisk}>*</Text>
                    </Text>
                    <View style={styles.approvalPathInput}>
                      <Picker
                        key={approvalPathOther}
                        selectedValue={approvalPathOther}
                        onValueChange={(itemValue) => {
                          console.log("Selected Value:", itemValue);
                          setApprovalPathOther(itemValue);
                        }}
                        style={styles.input}
                      >
                        {sequence.length > 0 ? (
                          sequence.map((projectItem) => (
                            <Picker.Item
                              key={projectItem.aprvl_seq_id}
                              label={projectItem.aprvl_seq_name}
                              value={projectItem.aprvl_seq_id}
                            />
                          ))
                        ) : (
                          <Picker.Item label="No Approval path available" value="" />
                        )}
                      </Picker>
                    </View>
                  </View>
           
  
                </View>
              </ScrollView>
              <View style={styles.popupButtonContainer}>
                <TouchableOpacity style={styles.popupSubmitButton} onPress={handleapproval}>
                  <Text style={styles.popupSubmitButtonText}>Submit</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.popupCancelButton} onPress={() => setIsApprovalPopupVisible(false)}>
                  <Text style={styles.popupCancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

      {/* Send for Review Popup */}
      <Modal
        visible={isPopupVisible}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity 
              style={styles.closeIcon} 
              onPress={() => setIsPopupVisible(false)}
            >
              <Icon name="close" size={24} color="#000" />
            </TouchableOpacity>
            <Text style={styles.popupHeading}>{modalText}</Text>
            
            <ScrollView 
              style={styles.modalScrollView}
              showsVerticalScrollIndicator={false}
            >
            <RadioButton.Group onValueChange={value => setSelectedOption(value)} value={selectedOption}>
              <View style={styles.radioOptionsRow}>
                <View style={styles.radioOption}>
                  <RadioButton.Android value="1" color="#044086" />
                  <Text style={styles.radioText}>In person meeting</Text>
                </View>
                <View style={styles.radioOption1}>
                  <RadioButton.Android value="2" color="#044086" />
                  <Text style={styles.radioText}>Authorization process</Text>
                </View>
              </View>
              {selectedOption === '2' && (
                <View style={styles.newApprovalContainer}>
                  {showNewApprovalForm ? (
                    <>
                      <View style={styles.newApprovalHeader}>
                        <TouchableOpacity 
                          style={styles.backButton}
                          onPress={() => {
                            setShowNewApprovalForm(false);
                          }}
                        >
                          <Icon name="arrow-back" size={18} color="#232323" />
                          <Text style={styles.backText}>Back</Text>
                        </TouchableOpacity>
                        <Text style={styles.newApprovalTitle}>Create New Review</Text>
                      </View>

                      <TextInput
  style={styles.newApprovalInput}
  placeholder="Enter text"
  value={sequenceName}  
  onChangeText={(text) => setSequenceName(text)}  
/>

                      <View style={styles.columnsContainer}>
                        <View style={styles.columnsHeader}>
                          <Text style={styles.columnTitle}>Steps</Text>
                          <Text style={styles.columnTitle}>Forwardto</Text>
                          <Text style={styles.columnTitle}>Designation</Text>
                          <Text style={styles.columnTitle}>Their Action</Text>
                        </View>
                        {steps.map((step, index) => (
                      <View key={step.id} style={styles.columnContent}>
                        <Text style={styles.stepText}>Step {step.id}</Text>
                        <View style={styles.searchableDropdown}>
                          <Picker
                            selectedValue={step.forwardTo}
                            onValueChange={(itemValue) => {
                              const newSteps = [...steps];
                              newSteps[index].forwardTo = itemValue;
                              setSteps(newSteps);
                            }}
                            style={styles.input}
                          >
                            <Picker.Item label="Select User" value="" />
                            {users.map((user) => (
                              <Picker.Item key={user.user_id} label={user.first_name} value={user.user_id} />
                            ))}
                          </Picker>
                          <Icon name="search" size={14} color="#000" style={styles.iconsearch} />
                        </View>
                            <Text style={styles.autoPopulatedText}>{step.designation || 'Project Manager'}</Text>
                            <View style={styles.actionContainer}>
                              <Picker
                                style={styles.actionPicker}
                                selectedValue={step.action}
                                onValueChange={(itemValue) => {
                                  const newSteps = [...steps];
                                  newSteps[index].action = itemValue;
                                  setSteps(newSteps);
                                }}
                              >
                                <Picker.Item label="Select" value="" />
                                <Picker.Item label="Approval" value="approval" />
                                <Picker.Item label="Review" value="review" />
                              </Picker>
                              {steps.length > 1 && (
                                <TouchableOpacity style={styles.cancelIcon} onPress={() => removeStep(step.id)}>
                                  <Icon name="close" size={18} color="#B40A0A" />
                                </TouchableOpacity>
                              )}
                            </View>
                          </View>
                        ))}
                         <View style={styles.popupButtonContainer}>
                        <TouchableOpacity style={styles.addStepButton} onPress={addStep}>
                          <Icon name="add" size={18} color="#044086" />
                          <Text style={styles.addStepButtonText}>Add Step</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.sequence} onPress={createSequence}>
                <Text style={styles.popupSubmitButtonText}>Create Sequence</Text>
              </TouchableOpacity>
              </View>
                      </View>
                    </>
                  ) : (
                    <>
                      <View style={styles.approvalPathContainer}>
                        <View style={styles.approvalPathInputContainer}>
                          <Text style={styles.approvalPathLabel}>
                            Pick Review Path <Text style={styles.asterisk}>*</Text>
                          </Text>
                          <View style={styles.approvalPathInput}>
                          <Picker
  key={approvalPathid}
  selectedValue={approvalPathid}
  onValueChange={(itemValue) => {
    console.log("Selected Value:", itemValue);
    setApprovalPathid(itemValue);
  }}
  style={styles.input}
>
  {sequence.length > 0 ? (
    sequence.map((projectItem) => (
      <Picker.Item
        key={projectItem.aprvl_seq_id}
        label={projectItem.aprvl_seq_name}
        value={projectItem.aprvl_seq_id}
      />
    ))
  ) : (
    <Picker.Item label="No Approval path available" value="" />
  )}
</Picker>
                          </View>
                        </View>
                        <TouchableOpacity 
                          style={styles.createNewApprovalButton}
                          onPress={() => {
                            setShowNewApprovalForm(true);
                            setIsCreatingSequence(true);
                          }}
                        >
                          <Icon name="add" size={24} color="#FFF" />
                          <Text style={styles.createNewApprovalButtonText}>Create New Approval</Text>
                        </TouchableOpacity>
                      </View>
                    </>
                  )}
                </View>
              )}
            </RadioButton.Group>
            </ScrollView>
            <View style={styles.popupButtonContainer}>
              <TouchableOpacity style={styles.popupSubmitButton} onPress={handlereview}>
                <Text style={styles.popupSubmitButtonText}>Submit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.popupCancelButton} onPress={() => setIsPopupVisible(false)}>
                <Text style={styles.popupCancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
   )}
   </Formik>
 );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#FFF',
    },
    scrollView: {
      flex: 1,
    },
    content: {
      flex: 1,
      alignItems: 'center',
      paddingVertical: 30,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: '#E5E5E5',
      backgroundColor:'#F5F5F5'
    },
    headerTitle: {
      color: '#000',
      fontFamily: 'Outfit',
      fontSize: 20,
      fontWeight: '500',
      lineHeight: 22,
      textTransform: 'capitalize',
    },
    backButton: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    backText: {
      color: '#232323',
      fontFamily: 'Source Sans Pro',
      fontSize: 14,
      fontWeight: '400',
      lineHeight: 22,
      marginLeft: 4,
    },
    row: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      width: '100%',
      maxWidth: 1200,
      marginBottom: 6,
    },
    row5: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      width: '100%',
      maxWidth: 1200,
      marginBottom: 6,
      justifyContent:'center'
    },
    smallInputContainer: {
      width: '40%',
      minWidth: 250,
      maxWidth: 220,
      padding: 8,
    },
    largeInputContainer: {
      width: '60%',
      maxWidth: 500,
      padding: 8,
    },
    largeInputContainer1: {
      width: '60%',
      maxWidth: 350,
      padding: 8,
    },
    customTemplateText: {
      color: '#757575',
      fontFamily: 'Source Sans Pro',
      fontSize: 14,
      fontStyle: 'normal',
      fontWeight: '400',
      lineHeight: 22,
      marginRight: 10,
    },
    halfInputContainer: {
      width: '45%',
      maxWidth: 300,
      marginRight: 20,
    },
    fullWidthInputContainer: {
      width: '100%',
      maxWidth: 606,
    },
    inputLabel: {
      color: '#044086',
      fontSize: 12,
      fontWeight: '400',
      marginBottom: 4,
      alignSelf: 'flex-start',
    },
    asterisk: {
      color: 'red',
    },
    icon: {
      marginRight: 5,
    },
    input: {
      borderRadius: 5,
      padding: 10,
      fontSize: 14,
      backgroundColor: 'white',
      color: '#000',
      borderBottomWidth: 1.5,
      borderBottomColor: '#044086',
      borderWidth: 0,
      width: '100%',
      height: 40,
    },
    largeInput: {
      width: '100%',
      borderRadius: 5,
      padding: 10,
      fontSize: 16,
      backgroundColor: 'white',
      color: '#000',
      borderBottomWidth: 1.5,
      borderBottomColor: '#044086',
      borderWidth: 0,
      height: 40,
    },
    outlinedInput: {
      width: '100%',
      height: 80,
      padding: 10,
      alignItems: 'flex-start',
      borderRadius: 5,
      borderWidth: 1,
      borderColor: '#C4C4C4',
      backgroundColor: '#FFF',
    },
    approvalButton: {
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: 5,
      borderWidth: 1,
      borderColor: '#044086',
      backgroundColor: '#FFF',
      padding: 8,
      height: 40,
      justifyContent: 'center',
      marginTop:33,
      shadowColor: '#101828',
      marginLeft:120,
      shadowOffset: {
        width: 0,
        height: 0.962,
      },
      shadowOpacity: 0.05,
      shadowRadius: 1.923,
      elevation: 2,
    },
    approvalIcon: {
      marginRight: 5,
    },
    approvalButtonText: {
      color: '#044086',
      fontSize: 14,
      fontWeight: '500',
    },
    roiHeading: {
      color: '#044086',
      fontFamily: 'Source Sans Pro',
      fontSize: 14,
      fontStyle: 'normal',
      fontWeight: '600',
      lineHeight: 22,
      marginBottom: 16,
    },
    templateContainer: {
      flexDirection: 'row',
      alignItems: 'center', 
      justifyContent: 'space-between', 
      padding: 10,
    },
    customTemplateGroup: {
      flexDirection: 'row', 
      alignItems: 'center',
      justifyContent: 'space-between', 
    },
    
    templateButton: {
      flexDirection: 'row', 
      alignItems: 'center', 
      paddingHorizontal: 10,
      paddingVertical: 8,
      backgroundColor: '#f0f0f0', 
      borderRadius: 5,
      marginHorizontal: 5, 
    },
    templateButtonText: {
      marginLeft: 5, 
      fontSize: 14,
      fontWeight: '500',
      color: '#000',
    },
    divider: {
      width: 876,
      height: 1,
      backgroundColor: '#E5E5E5',
      marginVertical: 20,
    },
    saveIcon: {
      marginRight: 5,
    },
    projectDriversHeading: {
      color: '#000',
      fontFamily: 'Source Sans Pro',
      fontSize: 16,
      fontWeight: '500',
      lineHeight: 22,
      marginBottom: 16,
      marginTop: 24,
      textAlign: 'center',
    },
    customFieldsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 10,
    },
    customFieldsButton: {
      padding: 10,
      borderRadius: 5,
      marginRight: 10,
    },
    customFieldsButtonText: {
      color: '#000',
      fontSize: 14,
      fontWeight: '500',
    },
    checkboxContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    checkbox: {
      width: 20,
      height: 20,
      borderWidth: 1,
      borderColor: '#C4C4C4',
      borderRadius: 4,
      justifyContent: 'center',
      alignItems: 'center',
    },
    checked: {
      backgroundColor: '#044086',
    },
    bottomButtonsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 50,
      marginBottom:50,
      width: '100%',
      maxWidth: 1200,
      paddingHorizontal: 8,
    },
    saveAsDraftButton: {
      backgroundColor: '#FFF',
      borderWidth: 1,
      borderColor: '#044086',
      padding: 10,
      borderRadius: 5,
      flexDirection: 'row',
      alignItems: 'center',
    },
    saveAsDraftButtonText: {
      color: '#044086',
      fontSize: 14,
      fontWeight: '500',
    },
    sendForReviewButton: {
      backgroundColor: '#044086',
      flexDirection: 'row',
      alignItems: 'center',
      padding: 10,
      borderRadius: 5,
    },
    sendForReviewButtonText: {
      color: '#FFF',
      fontSize: 14,
      fontWeight: '500',
    },
    sendIcon: {
      marginRight: 5,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      backgroundColor: '#FFF',
      borderRadius: 10,
      padding: 20,
      width: '80%',
      maxWidth: 450,
      alignItems: 'center',
    },
    popupHeading: {
      color: '#044086',
      fontFamily: 'Source Sans Pro',
      fontSize: 16,
      fontStyle: 'normal',
      fontWeight: '600',
      lineHeight: 22,
      marginBottom: 20,
      textAlign: 'center',
    },
    radioOptionsRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
      marginBottom: 20,
    },


    radioOption: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    radioOption1: {
      flexDirection: 'row',
      alignItems: 'center',
      marginLeft:20
    },
    radioText: {
      marginLeft: 8,
      fontSize: 14,
    },
    popupButtonContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: 20,
    },
    popupSubmitButton: {
      borderRadius: 5,
      backgroundColor: '#044086',
      paddingVertical: 10,
      paddingHorizontal: 20,
      marginRight: 10,
    },
    popupSubmitButtonText: {
      color: '#FFF',
      fontFamily: 'Source Sans Pro',
      fontSize: 14,
      fontStyle: 'normal',
      fontWeight: '600',
      lineHeight: 22,
    },
    popupCancelButton: {
      borderRadius: 5,
      borderWidth: 1,
      borderColor: '#C4C4C4',
      backgroundColor: '#FFF',
      paddingVertical: 10,
      paddingHorizontal: 20,
    },
    popupCancelButtonText: {
      color: '#232323',
      fontFamily: 'Source Sans Pro',
      fontSize: 14,
      fontStyle: 'normal',
      fontWeight: '400',
      lineHeight: 22,
    },
    closeIcon: {
      position: 'absolute',
      top: 10,
      right: 10,
    },
    approvalPathContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 10,
      width: '100%',
    },
    approvalPathInputContainer: {
      flex: 1,
      marginRight: 10,
    },
    approvalPathLabel: {
      color: '#044086',
      fontSize: 12,
      fontWeight: '400',
      marginBottom: 4,
    },
    approvalPathPicker: {
      height: 40,
    },
    createNewApprovalButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#044086',
      borderRadius: 5,
      borderWidth: 1,
      borderColor: '#FFF',
      padding: 8,
      marginTop:20
    },
    createNewApprovalButtonText: {
      color: '#FFF',
      marginLeft: 5,
      fontSize: 14,
      fontWeight: '500',
    },
    newApprovalTitle: {
      color: '#000',
      fontFamily: 'Outfit',
      fontSize: 16,
      fontStyle: 'normal',
      fontWeight: '500',
      lineHeight: 22,
      textTransform: 'capitalize',
     textAlign:'center'
    },
    newApprovalInput: {
      borderRadius: 5,
      borderBottomWidth: 1,
      borderBottomColor: '#044086',
      backgroundColor: '#FFF',
      padding: 10,
      marginBottom: 20,
      width: '100%',
    },
    columnsContainer: {
      width: '100%',
      padding: 10,
      borderRadius: 10,
      backgroundColor: '#F7F7F7',
    },
    columnsHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
      paddingHorizontal: 10,
      marginBottom: 10,
    },
    columnContent: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
      marginBottom: 10,
    },
    columnTitle: {
      color: '#000',
      fontFamily: 'Source Sans Pro',
      fontSize: 14,
      fontWeight: '600',
      width: '25%',
    },
    stepText: {
      width: '25%',
      color: '#000',
      fontFamily: 'Source Sans Pro',
      fontSize: 11,
      fontWeight: '400',
      alignItems:'center',
      display:'flex'
    },
    columnInput: {
      width: '24%',
      height: 40,
      borderWidth: 1,
      borderColor: '#C4C4C4',
      borderRadius: 5,
      paddingHorizontal: 10,
    },
    rightButtonsContainer: {
        // flex: 1,
        gap: 8,
      },
      leftButtonContainer:{
        alignSelf:'flex-start'
      },  newButton: {
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
        border:'1px solid #044086'
      },
      newButtonText: {
        color: '#044086',
        fontSize: 14,
        fontWeight: '500',
      },
      newButtonIcon: {
        marginRight: 5,
      },
    pickerContainer: {
      width: '25%',
      height: 40,
      backgroundColor: '#F0F0F0',
      borderRadius: 5,
      justifyContent: 'center',
    },
    designationPicker: {
      width: '100%',
      height: 40,
    },
     verticalLine: {
      width: 1,
      height: 20,
      backgroundColor: '#fff',
      marginHorizontal: 8,
    },
    actionPicker: {
      width: '80%',
      height: 40,
    },
    addButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 5,
      borderWidth: 1,
      borderColor: '#044086',
      backgroundColor: '#FFF',
      padding: 7,
      marginTop: 10,
      alignSelf: 'center',
    },
    addButtonText: {
      color: '#044086',
      fontFamily: 'Source Sans Pro',
      fontSize: 14,
      fontWeight: '400',
      marginLeft: 6,
    },
    modalScrollView: {
      maxHeight: 400,
      width: '100%',
    },
    searchableDropdown: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: '#F0F0F0',
      height: 40,
      padding: 7,
      borderRadius: 5,
    },
    searchInput: {
      flex: 1,
      fontSize: 12,
      color: '#000',
    },
    autoPopulatedText: {
      width: '67%',
      color: '#000',
      fontFamily: 'Source Sans Pro',
      fontSize: 12,
      fontWeight: '400',
      alignItems:'center',
      display:'flex',
      textAlign: 'center',
    },
    addStepButton: {
      flexDirection: 'row',
      //alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 5,
      borderWidth: 1,
      borderColor: '#044086',
      backgroundColor: '#FFF',
      padding: 7,
      marginTop: 10,
      alignSelf: 'center',
    },
    sequence: {
        flexDirection: 'row',
        //alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#044086',
        backgroundColor: '#044086',
        padding: 7,
        marginTop: 10,
        alignSelf: 'center',
        
      },
    addStepButtonText: {
      color: '#044086',
      fontFamily: 'Source Sans Pro',
      fontSize: 14,
      fontWeight: '400',
      marginLeft: 6,
    },
    actionContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '25%',
    },
    cancelIcon: {
      padding: 5,
    },
  });
  
  
  
  export default NewIntake;

