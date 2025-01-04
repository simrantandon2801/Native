import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  SafeAreaView,
  Modal,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {GetHistory, GetImpactedApplication, GetProjects, GetSequence, InsertApproval, InsertDraft, InsertReview} from '../../database/Intake';
import {format, parseISO} from 'date-fns';
import {RadioButton} from 'react-native-paper';
import {navigate} from '../../navigations/RootNavigation';
import { useNavigation, useRoute } from '@react-navigation/native';
import { GetGoals } from '../../database/Goals';
import { GetPrograms } from '../../database/ManageProgram';
import { GetDept, GetUsers } from '../../database/Departments';
import { GetApprovedProjects } from '../../database/ApprovedProjects';
import { Picker } from '@react-native-picker/picker';
import NestedDeptDropdownProjects from '../../modals/NestedDropdownProjects';
import NestedMultiselectDropdown from '../../modals/NestedMultSelect';
import { GetClasssifcation } from '../../database/Classification';
import DatePicker from 'react-datepicker';
import NestedMultiselectDropdownView from '../../modals/NestedMultSelectView';

const ProjectDetailedView = ({/*  items, */ projectId, isEditable }) => {
    const navigation = useNavigation();
    const [project, setProject] = useState<Project | null>(null);
    //-------------------------------------------Rushil's Code and States var new INtake------------------------------
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
   /*  const [startDate, setStartDate] = useState(''); */
   const [startDate, setStartDate] = useState<string>('');
   const [endDate, setEndDate] = useState<string>('');
    /* const [endDate, setEndDate] = useState(''); */
    const [goLiveDate, setGoLiveDate] = useState('');
    const [addOtherUser, setAddOtherUser] = useState(false);
    const [businessProblem, setBusinessProblem] = useState('');
    const [scopeDefinition, setScopeDefinition] = useState('');
    const [keyAssumption, setKeyAssumption] = useState('');
    const [benefitsROI, setBenefitsROI] = useState('');
    const [projectDrivers, setProjectDrivers] = useState('');
    const [isChecked, setIsChecked] = useState(false);
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [selectedOption, setSelectedOption] = useState('');
    const [approvalPath, setApprovalPath] = useState('');
    const [approvalPathid, setApprovalPathid] = useState('');
    const [goals, setGoals] = useState([]);
    const [goalSelected, setGoalSelected] = useState('');
    const [programData, setProgramData] = useState([]);
    const [businessData, setBusinessData] = useState([]);
    const [projectData, setProjectData] = useState([]);
    const [projectMgr, setprojectMgr] = useState([]);
    const [roi, setRoi] = useState('');
    const [risk, setRisk] = useState('');
    const [showStartDatePicker, setShowStartDatePicker] = useState(false);
    const [showEndDatePicker, setShowEndDatePicker] = useState(false); 
    const [showNewApprovalForm, setShowNewApprovalForm] = useState(false);
    const [designation, setDesignation] = useState('');
    const [isApprovalButtonVisible, setIsApprovalButtonVisible] = useState(false);
    const [action, setAction] = useState('');
    const [isApprovalPopupVisible, setIsApprovalPopupVisible] = useState(false);
    const [isReviewPopupVisible, setIsReviewPopupVisible] = useState(false);
    const [approvalPathidApp, setApprovalPathidApp] = useState('');
    const [selectedOptionApp, setSelectedOptionApp] = useState('2');
    const [steps, setSteps] = useState([
      {id: 1, forwardTo: '', designation: '', action: '',department_name: ''},
    ]);
    const [classifications, setClassifications] = useState([]);
    const addStep = () => {
      setSteps([...steps, { id: steps.length + 1, forwardTo: '', designation: '', action: '',department_name: '' }]);
    };
    const [sequence, setSequence] = useState([]);
    const [users, setUsers] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [formIsEditable, setFormIsEditable] = useState(isEditable);
    const [actualBudget, setActualBudget] = useState('');
    const [budgetImpact, setBudgetImpact] = useState('');
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const handleapproval = async () => {
      try {
        let currentProjectId = projectId;
    
        if (!currentProjectId) {
          currentProjectId = project_id; 
        }
    
        if (currentProjectId) {
          const payload = {
            //aprvl_seq_id: Number(approvalPathidApp),
            project_id: Number(currentProjectId),
            sent_to: Number(approvalPathidApp),
            type: "approval",
            approval_type: Number(selectedOptionApp),
          };
    console.log(payload) 
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
    const handlereview = async () => {
      try {
          let currentProjectId = projectId;
      
          if (!currentProjectId) {
            currentProjectId = project_id; 
          }
    
        if (currentProjectId) {
          const payload = {
              project_id: Number(currentProjectId),
              approval_type: Number(selectedOption),
              type: 'review',
              sent_to: Number(approvalPathid), // Assuming this is a single user ID for initial approval path
              approval_sequence_details: steps.map((step, index) => ({
                sequence_no: index + 1, // Sequence number (1-based index)
                user_id: Number(step.forwardTo), // User ID from the step
              })),
            };
  
            console.log("Generated Payload:", payload);
    
          const response = await InsertReview(payload); 
          const result = JSON.parse(response);
    
          if (result.status === 'success') {
             /*  setSubmitPopupMessage('Your review has been submitted successfully!'); */
  
            setIsReviewPopupVisible(false); 
          } else {
             /*  setSubmitPopupMessage('Failed to submit. Please try again.'); */
          }
        } else {
         /*  setReviewPopupMessage('Unable to retrieve project ID. Submission aborted.'); */
        }
      } catch (error) {
        console.error('Error submitting:', error);
       /*  setSubmitPopupMessage('An error occurred while submitting. Please try again.'); */
      }
    };
  
    useEffect(() => {
      if (typeof isEditable === 'boolean') {
        // Set formIsEditable based on the passed prop on mount
        setFormIsEditable(isEditable);
      } else {
        // Default to false if the prop is not provided
        setFormIsEditable(false);
      }
  
      // Cleanup function to reset formIsEditable when the component unmounts
      return () => {
        setFormIsEditable(false);
      };
    }, [isEditable]);
    /* 
       const addStep = () => {
         setSteps([...steps, { id: steps.length + 1, forwardTo: '', designation: '', action: '' }]);
       }; */
    console.log('this is form Editable', formIsEditable);
  
    const removeStep = id => {
      if (steps.length > 1) {
        const newSteps = steps
          .filter(step => step.id !== id)
          .map((step, index) => ({
            ...step,
            id: index + 1,
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
            console.error('Invalid goals data');
            Alert.alert('Error', 'Invalid goals data received');
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
          if (
            result?.status === 'success' &&
            Array.isArray(result?.data?.programs)
          ) {
            setProgramData(result.data.programs);
            console.log('Fetched Programs:', result.data.programs);
          } else {
            console.error('Invalid programs data');
            Alert.alert('Error', 'Invalid goals data received');
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
  
          if (
            result?.status === 'success' &&
            Array.isArray(result?.data?.users)
          ) {
            setBusinessData(result.data.users);
            console.log('Fetched Business Owners:', result.data.users);
          } else {
            console.error('Invalid users data structure');
            Alert.alert('Error', 'Invalid business owner data received');
          }
        } catch (error) {
          console.error('Error fetching Business Owners:', error);
          Alert.alert(
            'Error',
            'Failed to fetch business owners. Please try again later.',
          );
        }
      };
  
      const fetchProjectOwner = async () => {
        try {
          const response = await GetUsers('');
          console.log('Raw Response:', response);
          const result = JSON.parse(response);
  
          if (
            result?.status === 'success' &&
            Array.isArray(result?.data?.users)
          ) {
            setProjectData(result.data.users);
            console.log('Fetched Project Owners:', result.data.users);
          } else {
            console.error('Invalid Project data structure');
            Alert.alert('Error', 'Invalid Project owner data received');
          }
        } catch (error) {
          console.error('Error fetching Project Owners:', error);
          Alert.alert(
            'Error',
            'Failed to fetch Project owners. Please try again later.',
          );
        }
      };
      const fetchProjectManager = async () => {
        try {
          const response = await GetUsers('');
          console.log('Raw Response:', response);
          const result = JSON.parse(response);
  
          if (
            result?.status === 'success' &&
            Array.isArray(result?.data?.users)
          ) {
            setprojectMgr(result.data.users);
            console.log('Fetched Project Manager:', result.data.users);
          } else {
            console.error('Invalid users data structure');
            Alert.alert('Error', 'Invalid business owner data received');
          }
        } catch (error) {
          console.error('Error fetching Project Manager:', error);
          Alert.alert(
            'Error',
            'Failed to fetch Project Manager. Please try again later.',
          );
        }
      };
      const fetchImpactedApplications = async () => {
        try {
          console.log('Fetching impacted applications...');
          const response = await GetImpactedApplication(''); // Replace with your API function
          const parsedResponse =
            typeof response === 'string' ? JSON.parse(response) : response;
    
          console.log('API Response:', parsedResponse);
    
          if (
            parsedResponse?.status === 'success' &&
            parsedResponse?.data?.impacted_applications
          ) {
            const applications = parsedResponse.data.impacted_applications;
            setApplications(applications); // Update applications state
            console.log('Impacted Applications:', applications);
          } else {
            throw new Error('Unexpected response structure');
          }
        } catch (err) {
          console.error('Error fetching applications:', err);
          
        } finally {
          setLoading(false);
        }
      };
    
     
      const fetchSequence = async () => {
        try {
          const response = await GetSequence('');
          const result = JSON.parse(response);
  
          // Ensure the response format is correct and contains data
          if (
            result?.status === 'success' &&
            result?.data &&
            Array.isArray(result.data)
          ) {
            setSequence(result.data);
          } else {
            console.error('Invalid goals data');
            Alert.alert('Error', 'Invalid goals data received');
          }
        } catch (error) {
          console.error('Error fetching sequences:', error);
          Alert.alert('Error', 'Error fetching sequences');
        }
      };
      const fetchUsers = async () => {
        try {
          const response = await GetUsers('');
          const result = JSON.parse(response);
          if (
            result?.status === 'success' &&
            Array.isArray(result?.data?.users)
          ) {
            setUsers(result.data.users);
            console.log('fetched user data', result.data.users);
          } else {
            console.error('Invalid Users data');
            Alert.alert('Error', 'Invalid USERS data received');
          }
        } catch (error) {
          console.error('Error fetching goals:', error);
          //setGoals([]);
        }
      };
      const fetchDepartments = async () => {
        try {
          const response = await GetDept('');
          console.log('unparsed Department Response:', response);
          const result = JSON.parse(response);
    
          console.log('API Response:', result);
          if (result?.data?.departments && Array.isArray(result.data.departments)) {
            setDepartments(result.data.departments);
          } else {
            console.error('Invalid departments data');
            Alert.alert('Error', 'Invalid departments data received');
          }
        } catch (error) {
          console.error('Error fetching departments:', error);
          Alert.alert('Error', 'Failed to fetch departments');
        }
      };
      const fetchClassification = async () => {
        try {
          const response = await GetClasssifcation('');
          const result = JSON.parse(response);
          if (result?.data?.classifications && Array.isArray(result.data.classifications)) {
            setClassifications(result.data.classifications);
          } else {
            console.error('Invalid goals data');
            Alert.alert('Error', 'Invalid goals data received');
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
      fetchImpactedApplications();
      fetchDepartments();
      fetchClassification();
    }, []);
    useEffect(() => {

        if (project?.classification) {
            console.log('in classification')
          setClassification(project.classification); // Sync classification with project when the component mounts
        }
      }, [project?.classification]);
    
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
    const mapDeptIdToName = (deptId: number) => {
        const department = departments.find(dept => dept.department_id === deptId);
        return department ? department.department_name : 'No Department Found';
      };
  
    //   const validationSchema = Yup.object().shape({
    //     project_name: Yup.string().required('Project Name is required'),
    //     classification: Yup.string().required('Classification is required'),
    //     goal_id: Yup.string().required('Goal is required'),
    //     program_id: Yup.string().required('Program is required'),
    //     start_date: Yup.string().required('Start Date is required'),
    //     end_date: Yup.string().required('End Date is required'),
    //     golive_date: Yup.string().required('Go Live Date is required'),
    //     business_stakeholder_dept: Yup.number()
    //       .min(0, 'Please select a Business Owner Department')
    //       .required('Business Owner Department is required'),
    //     project_owner_dept: Yup.number()
    //       .min(0, 'Please select a Project Owner Department')
    //       .required('Project Owner Department is required'),
    //   });
    const [selectedImpactedFunction, setSelectedImpactedFunction] = useState<
    number[]
  >([]);
    const handleSelectionChange = (newSelectedStakeholders: number[]) => {
        setSelectedImpactedFunction(newSelectedStakeholders);
        console.log('Updated Selected Items:', newSelectedStakeholders);
      };
    /*   useEffect(() => {
        if (formIsEditable && project?.impacted_function) {
          // Split the string of IDs into an array
          const impactedFunctionArray = project.impacted_function.split(',').map(id => parseInt(id, 10));
          setSelectedImpactedFunction(impactedFunctionArray);
          console.log('Selected Impacted Functions:', impactedFunctionArray); // Log the impacted function IDs
        }
      }, [formIsEditable, project?.impacted_function]); */
    
      const nestedDropdownRef = useRef();
    const route = useRoute();
    const {project_id} = route.params as {project_id: number};
    const {status} = route.params as {status: number};
    const handleSaveAsDraft = async () => {
      try {
        // Validate required fields
        /* if (
          !nameTitle ||
          !classification ||
          !goalSelected ||
          !program ||
          !startDate ||
          !endDate ||
          !goLiveDate
        ) {
          Alert.alert('Please fill in all required fields.');
          return;
        } */
  
        const programDataToSubmit = {
          project_id:project_id,
          project_name: nameTitle||project.project_name,
          department_id: null,
          classification: classification || project.classification,
          goal_id: Number( goalSelected|| project.goalSelected),
          program_id: Number(program|| project.program_id ),
          business_stakeholder_user: Number(businessOwner|| project.business_stakeholder_user),
          business_stakeholder_dept: Number(businessOwnerDept || project.business_stakeholder_dept),
          project_owner_user: Number(projectOwner || project.project_owner_user),
          project_owner_dept: Number(projectOwnerDept|| project.project_owner_dept),
          project_manager_id: Number(projectManager|| project.project_manager_id),
          // impacted_stakeholder_dept: ,
          impacted_function: selectedImpactedFunction.length > 0 
          ? selectedImpactedFunction.join(',') 
          : project.impacted_function,
          impacted_applications: Number(impactedApp|| project.impacted_applications),
          priority: Number(priority || project.priority),
          budget_size: budget|| project.budget_size,
          project_size: projectSize|| project.project_size,
          start_date: startDate || project.start_date,
          end_date: endDate || project.end_date,
          golive_date: goLiveDate || project.golive_date,
          roi: roi || project.roi,
          business_desc: businessProblem || project.business_desc,
          scope_definition: scopeDefinition || project.scope_definition,
          key_assumption: keyAssumption || project.key_assumption,
          benefit_roi: benefitsROI || project.benefit_roi,
          risk: risk || project.risk,
        };
  
        // Log the object for debugging
        console.log(programDataToSubmit);
  
        const response = await InsertDraft(programDataToSubmit);
        const parsedResponse = JSON.parse(response);
  
        if (parsedResponse.status === 'success') {
          Alert.alert('Draft saved successfully');
        } else {
          Alert.alert('Failed to save draft. Please try again.');
        }
      } catch (error) {
      
        Alert.alert('An error occurred. Please try again.');
      }
    };
    const handleSubmit = async () => {
      /* if (isCreatingSequence) {
             // Call the sequence creation API
             try {
               //await createSequence(); // Replace with your actual API call
               console.log('Sequence created successfully');
         
            
               // Continue with submit logic
               //await submitApproval(); // Replace with your submit logic
             } catch (error) {
               console.error('Error creating sequence:', error);
             } finally {
               setIsCreatingSequence(false);
             }
           } else { */
      const payload = {
        //project_id:,
        aprvl_seq_id: approvalPathid, // Sending the selected sequence ID
        // Add any other necessary data here
      };
  
      try {
        const response = await InsertReview(payload);
        const result = JSON.parse(response);
  
        if (result.status === 'success') {
          Alert.alert('Submission successful!');
          setIsPopupVisible(false);
        } else {
          Alert.alert('Failed to submit. Please try again.');
        }
      } catch (error) {
        console.error('Error submitting:', error);
        Alert.alert('An error occurred while submitting. Please try again.');
      }
    };
    useEffect(() => {
      // Fetch the project data when the component mounts or projectId changes
      GetApprovedProjects('') // Assuming the query param is empty for now
        .then(response => {
          const parsedResponse = JSON.parse(response);
          const projects = parsedResponse?.data?.projects || [];
          const matchedProject = projects.find(
            proj => proj.project_id === projectId,
          );
          setProject(matchedProject || null);
        })
        .catch(error => {
          console.error('Error fetching project:', error);
        });
    }, [projectId]);
    useEffect(() => {
        // Update startDate and endDate state when project data is available
        if (project?.start_date) {
          setStartDate(format(parseISO(project.start_date), 'MM/dd/yyyy'));
        }
        if (project?.end_date) {
          setEndDate(format(parseISO(project.end_date), 'MM/dd/yyyy'));
        }
        if (project?.golive_date) {
            setGoLiveDate(format(parseISO(project.golive_date), 'MM/dd/yyyy'));
          }
      }, [project]);
      const [rawEndDate, setRawEndDate] = useState(null);
      const [endDateDisplay, setEndDateDisplay] = useState('');
      const handleEndDateChange = date => {
        setRawEndDate(date);
        setEndDateDisplay(format(date, 'MM-dd-yyyy'));
        setEndDate(format(date, 'yyyy-MM-dd')); // Format date for the input field
        setShowEndDatePicker(false); // Close the picker
      };
      const [rawGoLiveDate, setRawGoLiveDate] = useState(null);
      const [liveDateDisplay, setLiveDateDisplay] = useState('');
      const [showGoLiveDatePicker, setShowGoLiveDatePicker] = useState(false);
      const handleGoLiveDateChange = date => {
        setRawGoLiveDate(date);
        setLiveDateDisplay(format(date, 'MM-dd-yyyy'));
        setGoLiveDate(format(date, 'yyyy-MM-dd')); // Format date for the input field
        setShowGoLiveDatePicker(false); // Close the picker
      };
      const hideDatePicker = () => {
        setShowGoLiveDatePicker(false); 
        setShowStartDatePicker(false);
        setShowEndDatePicker(false);
        Keyboard.dismiss(); 
      };
    return (
      <ScrollView
      showsVerticalScrollIndicator={false}>
        {/* <Text style={styles.historyHeading}>Intake Approval</Text> */}
  
        {project ? (
          //---------------------------Main View Screen----------------------
          <SafeAreaView style={styles.container}>
            {/* <View style={styles.header}>
              <TouchableOpacity style={styles.backButton}>
                <Icon name="arrow-back" size={18} color="#232323" />
                <Text style={styles.backText}>Back</Text>
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Create New Intake</Text>
              <View style={{width: 50}} />
            </View> */}
  
            <ScrollView
              style={styles.scrollView}
              contentContainerStyle={styles.content}
              showsVerticalScrollIndicator={false}>
              <View>
                {/* First Row */}
                <View style={styles.row}>
                <View style={styles.smallInputContainer}>
  <Text style={styles.inputLabel}>
    Name/Title <Text style={styles.asterisk}>*</Text>
  </Text>

  {formIsEditable ? (
    // If the form is editable, show a TextInput field
    <TextInput
      style={styles.largeInput}
      value={nameTitle || project.project_name} // Prefill the value
      onChangeText={(text) => setNameTitle(text)} // Update state on text change
      editable={true} // Make it editable
    />
  ) : (
    // If the form is not editable, show the text as plain text
    <Text >
      {nameTitle || project.project_name} {/* Display the name/title as text */}
    </Text>
  )}
</View>

  
<View style={styles.smallInputContainer}>
  <Text style={styles.inputLabel}>
    Classification <Text style={styles.asterisk}>*</Text>
  </Text>

  {formIsEditable ? (
    // In edit mode, show the Picker
    <Picker
      selectedValue={classification} // Bind to Formik's state or custom state
      onValueChange={(value) => {
        setClassification(value); // Update custom state with selected classification ID
        console.log('selectedvalue', value); // Log the selected value (ID)
      }}
      style={styles.input}
    >
      <Picker.Item label="Select Classification" value="" />
      
      {/* Map over the fetched classifications and display them in the Picker */}
      {classifications.map((item) => (
        <Picker.Item
          key={item.classification_id} // Ensure each item has a unique key
          label={item.classification_name} // Display classification name
          value={item.classification_id} // Send the classification ID as the value
        />
      ))}
    </Picker>
  ) : (
    // In view mode, show the classification name
    <Text >
      {
        classifications.find(
          (item) => item.classification_id === classification
        )?.classification_name || 'No Classification Selected'
      }
    </Text>
  )}


</View>


<View style={styles.smallInputContainer}>
  <Text style={styles.inputLabel}>
    Priority<Text style={styles.asterisk}>*</Text>
  </Text>

  {formIsEditable ? (
    // If form is editable, show the Picker
    <Picker
      selectedValue={priority || project.priority} // Default to project.priority
      onValueChange={value => setPriority(value)} // Update the value when changed
      style={styles.input}
      enabled={formIsEditable} // Disable the Picker if form is not editable
    >
      <Picker.Item label="Select Priority" value="" />
      <Picker.Item label="Critical" value="1" />
      <Picker.Item label="High" value="2" />
      <Picker.Item label="Medium" value="3" />
      <Picker.Item label="Low" value="4" />
    </Picker>
  ) : (
    // If form is not editable, show the selected priority as plain text
    <Text>
      {
        // Map priority ID (number) to its corresponding name
        project.priority === 1
          ? "Critical"
          : project.priority === 2
          ? "High"
          : project.priority === 3
          ? "Medium"
          : project.priority === 4
          ? "Low"
          : project.priority || "No Priority Selected"
      }
    </Text>
  )}
</View>

                  {/* <TouchableOpacity style={styles.approvalButton}>
                    <Icon
                      name="time-outline"
                      size={18}
                      color="#044086"
                      style={styles.approvalIcon}
                    />
                    <Text style={styles.approvalButtonText}>
                      Approval History
                    </Text>
                  </TouchableOpacity> */}
                </View>
  
                {/* Second Row */}
                <View style={styles.row}>
                <View style={styles.smallInputContainer}>
  <Text style={styles.inputLabel}>Goal</Text>

  {formIsEditable ? (
    // If form is editable, show the Picker
    <Picker
      selectedValue={goalSelected || project.goal_id} // Default to project.goal_id
      onValueChange={value => setGoalSelected(value)} // Update the value when changed
      style={styles.input}
      enabled={formIsEditable} // Disable the Picker when not editable
    >
      <Picker.Item label="Select Goal" value="" />
      {goals.map(goalItem => (
        <Picker.Item
          key={goalItem.goal_id} // Use goal_id as key
          label={goalItem.goal_name} // Use goal_name as the label
          value={goalItem.goal_id} // Use goal_id as the value
        />
      ))}
    </Picker>
  ) : (
    // If form is not editable, show the selected goal name as plain text
    <Text>
      {
        // Find and display the goal name based on the goal_id
        goals.find(goal => goal.goal_id === goalSelected || goal.goal_id === project.goal_id)?.goal_name || "No Goal Selected"
      }
    </Text>
  )}
</View>

<View style={styles.smallInputContainer}>
  <Text style={styles.inputLabel}>
    Impacted Functions<Text style={styles.asterisk}>*</Text>
  </Text>

  {formIsEditable ? (
    <>
      {/* Show selected impacted function names as a comma-separated list */}
    {/*   <Text style={styles.selectedLabel}>
        {project.impacted_function_name || selectedImpactedFunction
          .map((id) => {
            const functionName = mapFunctionIdToName(id); // Assuming you have a function to map ID to name
            return functionName;
          })
          .join(', ') || 'No Impacted Functions Selected'}
      </Text> */}

      {/* Multiselect dropdown for selecting impacted functions */}
      <NestedMultiselectDropdownView
       /*  ref={nestedDropdownRef} */
        editGoal={project}  // Pass the selected function IDs here
        onSelectionChange={handleSelectionChange}
      />
    </>
  ) : (
    // If the form is not editable, display the impacted function names as text
    <Text>
      {project.impacted_function_name || 'No Impacted Functions'}
    </Text>
  )}
</View>




<View style={styles.smallInputContainer}>
  <Text style={styles.inputLabel}>
    Budget<Text style={styles.asterisk}>*</Text>
  </Text>

  {formIsEditable ? (
    // If the form is editable, show the Picker
    <Picker
      selectedValue={budget || project.budget_size} // Default to project.budget_size
      onValueChange={value => setBudget(value)} // Update the value when changed
      style={styles.input}
      enabled={formIsEditable} // Disable the Picker when not editable
    >
      <Picker.Item label="Select Budget" value="" />
      <Picker.Item label="High" value="1" />
      <Picker.Item label="Medium" value="2" />
      <Picker.Item label="Low" value="3" />
    </Picker>
  ) : (
    // If the form is not editable, show the selected budget as plain text
    <Text >
      {
        // Map budget value (1, 2, 3) to its corresponding label
        project.budget_size === "1"
          ? "High"
          :  project.budget_size === "2"
          ? "Medium"
          :  project.budget_size === "3"
          ? "Low"
          : project.budget_size || "No Budget Selected"
      }
    </Text>
  )}
</View>

             
                </View>
  
                {/* Business Owner Row */}
                <View style={styles.row}>
                <View style={styles.smallInputContainer}>
  <Text style={styles.inputLabel}>Program</Text>

  {formIsEditable ? (
    // If the form is editable, show the Picker
    <Picker
      selectedValue={program || project.program_id} // Default to project.program_id
      onValueChange={value => setProgram(value)} // Update the value when changed
      style={styles.input}
      enabled={formIsEditable} // Disable the Picker when not editable
    >
      <Picker.Item label="Select Program" value="" />
      {programData.length > 0 ? (
        programData.map(ProgramItem => (
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
  ) : (
    // If the form is not editable, display the program name as plain text
    <Text>
      {
        // Find and display the program name based on the program_id
        programData.find(program => program.program_id === program || program.program_id === project.program_id)?.program_name || "No Program Selected"
      }
    </Text>
  )}
</View>

<View style={styles.smallInputContainer}>
  <Text style={styles.inputLabel}>
    Impacted Applications<Text style={styles.asterisk}>*</Text>
  </Text>

  {loading ? (
    <Text>Loading...</Text>
  ) : error ? (
    <Text style={{color: 'red'}}>{error}</Text>
  ) : (
    formIsEditable ? (
      // If the form is editable, show the Picker
      <Picker
        selectedValue={impactedApp || project.impacted_applications}
        onValueChange={value => setImpactedApp(value)}
        style={styles.input}
        enabled={formIsEditable} // Editable based on formIsEditable
      >
        <Picker.Item label="Select Application" value="" />
        {applications.map(app => (
          <Picker.Item
            key={app.application_id} // Unique key for each item
            label={app.application_name} // Label to display in the Picker
            value={app.application_id} // Value to set in the form
          />
        ))}
      </Picker>
    ) : (
      // If the form is not editable, show the selected application name as plain text
      <Text>
        {
          // Find and display the application name based on impactedApp or project.impacted_applications
          applications.find(
            app => app.application_id === (impactedApp || project.impacted_applications)
          )?.application_name || 'No Application Found'
        }
      </Text>
    )
  )}
</View>


<View style={styles.smallInputContainer}>
  <Text style={styles.inputLabel}>
    Project Size<Text style={styles.asterisk}>*</Text>
  </Text>

  {formIsEditable ? (
    // If the form is editable, show the Picker
    <Picker
      selectedValue={projectSize || project.project_size} // Default to project.project_size
      onValueChange={value => setProjectSize(value)} // Update the value when changed
      style={styles.input}
      enabled={formIsEditable} // Disable the Picker when not editable
    >
      <Picker.Item label="Select Size" value="" />
      <Picker.Item label="Large" value="1" />
      <Picker.Item label="Medium" value="2" />
      <Picker.Item label="Small" value="3" />
    </Picker>
  ) : (
    // If the form is not editable, display the selected project size as plain text
    <Text>
      {
        // Map project size value (1, 2, 3) to its corresponding label
        project.project_size === "1"
          ? "Large"
          : project.project_size === "2"
          ? "Medium"
          : project.project_size === "3"
          ? "Small"
          : project.project_size || "No Size Selected"
      }
    </Text>
  )}
</View>

                  </View>


                  <View style={styles.row}>
                  <View style={styles.smallInputContainer}>
  <Text style={styles.inputLabel}>
    Business Owner<Text style={styles.asterisk}>*</Text>
  </Text>

  {formIsEditable ? (
    // If the form is editable, show the Picker
    <Picker
      selectedValue={businessOwner || project.business_stakeholder_user} // Default to project.business_stakeholder_user
      onValueChange={value => setBusinessOwner(value)} // Update the value when changed
      style={styles.input}
      enabled={formIsEditable} // Disable the Picker when not editable
    >
      <Picker.Item label="Select Business Owner" value="" />
      {businessData.length > 0 ? (
        businessData.map(BusinessItem => (
          <Picker.Item
            key={BusinessItem.user_id} // Unique key for each item
            label={`${BusinessItem.first_name} ${BusinessItem.last_name}`} // Full name of the business owner
            value={BusinessItem.user_id} // Value to set in the form
          />
        ))
      ) : (
        <Picker.Item label="No Business Owner Available" value="" />
      )}
    </Picker>
  ) : (
    // If the form is not editable, display the business owner's name as plain text
    <Text>
      {
        // Find and display the business owner's name based on the user_id
        businessData.find(
          business => business.user_id === (businessOwner || project.business_stakeholder_user)
        )?.first_name || 'No Business Owner Selected'
      }
    </Text>
  )}
</View>

  
<View style={styles.smallInputContainer}>
  <Text style={styles.inputLabel}>
    Business Owner Department
    <Text style={styles.asterisk}>*</Text>
  </Text>

  {formIsEditable ? (
    // If the form is editable, show the NestedDeptDropdownProjects
    <NestedDeptDropdownProjects
      onSelect={handleBusinessOwnerDept}
      placeholder={
        project ? project.business_stakeholder_dept_name : 'No Department Selected'
      }
    />
  ) : (
    // If the form is not editable, display the department name as plain text
    <View style={{ width: '40%' }}>
      <Text>
        {project.business_stakeholder_dept_name || businessOwnerDept || 'No Department Selected'}
      </Text>
    </View>
  )}
</View>
{/* <TouchableWithoutFeedback onPress={hideDatePicker}> */}
<View style={styles.smallInputContainer}>
<Text style={styles.inputLabel}>
        Proposed Start Date<Text style={styles.asterisk}>*</Text>
      </Text>

      {formIsEditable ? (
        // Editable state - show date picker input
        <View style={styles.smallInputContainer}>
          <TextInput
            style={styles.input}
            value={startDate} // Display the formatted date string from state
            onFocus={() => setShowStartDatePicker(true)} // Show date picker when focused
            placeholder="Select Start Date"
            editable={formIsEditable} // Ensure it's editable only in formIsEditable state
          />
          {showStartDatePicker && (
            <TouchableOpacity onPress={hideDatePicker} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>X</Text>
            </TouchableOpacity>
          )}
        </View>
      ) :  (
      // View state - show formatted date text
      <Text>
        {project?.start_date
          ? format(new Date(project.start_date), 'MM/dd/yyyy') // Format the backend date for display
          : 'No Start Date Selected'}
      </Text>
    )}

    {/* Date Picker Modal (only show when in editable state and focused) */}
    {showStartDatePicker && formIsEditable && (
      <DatePicker
        selected={startDate ? new Date(startDate) : new Date()}  // Set the selected date from state or default to current date
        onChange={(date) => {
          setStartDate(date ? format(date, 'MM/dd/yyyy') : ''); // Convert Date to string in MM/dd/yyyy format
          setShowStartDatePicker(false); // Close the date picker after selecting
        }}
        dateFormat="MM-dd-yyyy"
        inline // Optional: Use inline date picker on the web for better UX
      />
    )}

   
  </View>
{/* 
  </TouchableWithoutFeedback> */}



                  </View>
  
                {/* Project Owner Row */}
                <View style={styles.row}>
                <View style={styles.smallInputContainer}>
  <Text style={styles.inputLabel}>
    Project Owner<Text style={styles.asterisk}>*</Text>
  </Text>

  {formIsEditable ? (
    // If the form is editable, show the Picker
    <Picker
      selectedValue={projectOwner || project.project_owner_user} // Default to project.project_owner_user
      onValueChange={value => setProjectOwner(value)} // Update the value when changed
      style={styles.input}
      enabled={formIsEditable} // Disable the Picker when not editable
    >
      <Picker.Item label="Select Project Owner" value="" />
      {projectData.length > 0 ? (
        projectData.map(projectItem => (
          <Picker.Item
            key={projectItem.user_id} // Unique key for each item
            label={`${projectItem.first_name} ${projectItem.last_name}`} // Full name of the project owner
            value={projectItem.user_id} // Value to set in the form
          />
        ))
      ) : (
        <Picker.Item label="No Project Owner Available" value="" />
      )}
    </Picker>
  ) : (
    // If the form is not editable, display the project owner's name as plain text
    <Text>
      {
        // Ensure that we are finding the correct project owner by user_id
        projectData.find(item => item.user_id === (projectOwner || project.project_owner_user))?.first_name
          ? `${projectData.find(item => item.user_id === (projectOwner || project.project_owner_user))?.first_name} ${projectData.find(item => item.user_id === (projectOwner || project.project_owner_user))?.last_name}`
          : 'No Project Owner Selected'
      }
    </Text>
  )}
</View>


  
<View style={styles.smallInputContainer}>
    <Text style={styles.inputLabel}>
      Project Owner Department
      <Text style={styles.asterisk}>*</Text>
    </Text>

    {formIsEditable ? (
      // In edit mode, show the NestedDeptDropdownProjects
      <NestedDeptDropdownProjects
        onSelect={handleProjectOwnerDept}
        placeholder={
          project ? mapDeptIdToName(project.project_owner_dept) : 'Select Department'
        }
      />
    ) : (
      // In view mode, show the department name
      <View style={{ width: '40%' }}>
        <Text>
          {project.project_owner_dept ? 
            mapDeptIdToName(project.project_owner_dept) : 
            'No Department Selected'
          }
        </Text>
      </View>
    )}
  </View>
  <View style={styles.smallInputContainer}>
  <Text style={styles.inputLabel}>
    Proposed End Date<Text style={styles.asterisk}>*</Text>
  </Text>

  {formIsEditable ? (
    // Editable state - show date picker input
    <View style={styles.smallInputContainer}>
      <TextInput
        style={styles.input}
        value={endDate} // Display the formatted end date from state
        onFocus={() => setShowEndDatePicker(true)} // Show date picker when focused
        placeholder="Select End Date"
        editable={formIsEditable} // Ensure it's editable only in formIsEditable state
      />
      {showEndDatePicker && (
        <TouchableOpacity onPress={hideDatePicker} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>X</Text>
        </TouchableOpacity>
      )}
    </View>
  ) : (
          // View state - show the end date as plain text
          <Text>
            {project.end_date
              ? format(new Date(project.end_date), 'MM/dd/yyyy')
              : 'No End Date Selected'}
          </Text>
        )}

        {/* End Date Picker Modal (only show when in editable state and focused) */}
        {showEndDatePicker && formIsEditable && (
          
          <DatePicker
        selected={endDate ? new Date(endDate) : new Date()}  // Set the selected date from state or default to current date
        onChange={(date) => {
          setEndDate(date ? format(date, 'MM/dd/yyyy') : ''); // Convert Date to string in MM/dd/yyyy format
          setShowEndDatePicker(false); // Close the date picker after selecting
        }}
        dateFormat="MM-dd-yyyy"
        inline // Optional: Use inline date picker on the web for better UX
      />
        
        )}
      </View>
    

                </View>
  
                {/* Project Manager Row */}
                <View style={styles.row}>
                <View style={styles.smallInputContainer}>
  <Text style={styles.inputLabel}>
    Project Manager<Text style={styles.asterisk}>*</Text>
  </Text>

  {formIsEditable ? (
    // If the form is editable, show the Picker for selecting a project manager
    <Picker
      selectedValue={projectManager || project.project_manager_id} // Default to project.project_manager_id
      onValueChange={value => setProjectManager(value)} // Update the value when changed
      style={styles.input}
      enabled={formIsEditable} // Disable the Picker when not editable
    >
      <Picker.Item label="Select Project Manager" value="" />
      {projectMgr.length > 0 ? (
        projectMgr.map(projectItem => (
          <Picker.Item
            key={projectItem.user_id} // Unique key for each item
            label={`${projectItem.first_name} ${projectItem.last_name}`} // Full name of the project manager
            value={projectItem.user_id} // Value to set in the form
          />
        ))
      ) : (
        <Picker.Item label="No Project Manager Available" value="" />
      )}
    </Picker>
  ) : (
    // If the form is not editable, display the project manager's name as plain text
    <Text>
      {
        // Find and display the project manager's name based on user_id
        projectMgr.find(
          projectItem => projectItem.user_id === (projectManager || project.project_manager_id)
        )?.first_name
          ? `${projectMgr.find(projectItem => projectItem.user_id === (projectManager || project.project_manager_id))?.first_name} ${projectMgr.find(projectItem => projectItem.user_id === (projectManager || project.project_manager_id))?.last_name}`
          : 'No Project Manager Selected'
      }
    </Text>
  )}
</View>

 
<View style={styles.smallInputContainer}>
<Text style={styles.inputLabel}>
        Actual Budget<Text style={styles.asterisk}>*</Text>
      </Text>

      {formIsEditable ? (
        // If the form is editable, show a TextInput field
        <TextInput
          style={styles.input}
          value={actualBudget}
          onChangeText={(text) => {
            // Allow numeric input only
            const numericValue = text.replace(/[^0-9]/g, ''); // Remove non-numeric characters
            setActualBudget(numericValue); // Update custom state
          }}
          placeholder="Actual Budget"
          keyboardType="numeric" // Ensure the keyboard is for numeric input
        />
      ) : (
        // If the form is not editable, show the text as plain text
        <Text >{project.actualBudget || 'Not Provided'}</Text>
      )}

  {/* Add Budget Details Button */}
  <TouchableOpacity /* onPress={() => setBudgetModalVisible(true)} */>
    <Text style={{ color: 'blue' }}>Add Budget Details</Text>
  </TouchableOpacity>

  {/* Validation Error Display (Uncomment if using Formik validation) */}
  {/* {touched?.budget && errors?.budget && (
    <Text style={{ color: 'red' }}>{errors.budget}</Text>
  )} */}
</View>

<View style={styles.smallInputContainer}>
<Text style={styles.inputLabel}>
    Go Live Date<Text style={styles.asterisk}>*</Text>
  </Text>

  {formIsEditable ? (
    // Editable state - show date picker input
    <View style={styles.smallInputContainer}>
      <TextInput
        style={styles.input}
        value={goLiveDate} // Display the formatted Go Live Date
        onFocus={() => setShowGoLiveDatePicker(true)} // Show date picker on focus
        placeholder="Select Go Live Date"
        editable={false} // Make input non-editable, as the user will select from the picker
      />
      {showGoLiveDatePicker && (
        <TouchableOpacity onPress={hideDatePicker} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>X</Text>
        </TouchableOpacity>
      )}
    </View>
  ) :  (
          // View state - show the Go Live Date as plain text
          <Text>
            {project.golive_date
              ? format(new Date(project.golive_date), 'MM/dd/yyyy')
              : 'No Go Live Date Set'}
          </Text>
        )}

        {/* Go Live Date Picker Modal (only show when in editable state and focused) */}
        {showGoLiveDatePicker && formIsEditable && (
         
            <DatePicker
        selected={goLiveDate ? new Date(goLiveDate) : new Date()}  // Set the selected date from state or default to current date
        onChange={(date) => {
          setGoLiveDate(date ? format(date, 'MM/dd/yyyy') : ''); // Convert Date to string in MM/dd/yyyy format
          setShowGoLiveDatePicker(false); // Close the date picker after selecting
        }}
        dateFormat="MM-dd-yyyy"
        inline // Optional: Use inline date picker on the web for better UX
      />
         
        )}
      </View>

                  
                </View>
  
                {/* Priority Row */}
                <View style={styles.row}>
                
  
                 
  
              
                </View>
  
                {/* Dates Row */}
              
  
                {/* ROI Section */}
                <Text style={styles.roiHeading}>Return on Investment</Text>
  
                <View style={styles.row}>
                <View style={styles.smallInputContainer}>
  <Text style={styles.inputLabel}>
    Enter the approx. ROI <Text style={styles.asterisk}>*</Text>
  </Text>

  {formIsEditable ? (
    // In edit mode, show the TextInput to allow editing of ROI
    <TextInput
      style={styles.input}
      value={roi || project.roi} // Use custom state `roi` or fallback to `project.roi`
      onChangeText={setRoi} // Update the custom state when text is changed
      placeholder="Enter ROI"
    />
  ) : (
    // In view mode, display the ROI as text
    <Text >
      {roi || project.roi || 'No ROI Available'}
    </Text>
  )}
</View>

                  <View style={styles.templateContainer}>
                    <Text style={styles.customTemplateText}>Custom Template</Text>
                    <View style={styles.customTemplateGroup}>
                      <TouchableOpacity style={styles.templateButton}>
                        <Icon
                          name="download-outline"
                          size={18}
                          color="#000"
                          style={styles.icon}
                        />
                        <Text style={styles.templateButtonText}>
                          Download Template
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.templateButton}>
                        <Icon
                          name="cloud-upload-outline"
                          size={18}
                          color="#000"
                          style={styles.icon}
                        />
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
  <Text style={styles.inputLabel}>
    Business Problem/Description
    <Text style={styles.asterisk}>*</Text>
  </Text>

  {formIsEditable ? (
    // In edit mode, show the TextInput to allow editing of Business Problem/Description
    <TextInput
      style={styles.outlinedInput}
      placeholder="Enter Business Problem/Description"
      value={businessProblem || project.business_desc} // Use custom state `businessProblem` or fallback to `project.business_desc`
      onChangeText={setBusinessProblem} // Update the custom state when text is changed
    />
  ) : (
    // In view mode, display the Business Problem/Description as text
    <Text style={styles.outlinedInput}>
      {businessProblem || project.business_desc || 'No Business Problem/Description Available'}
    </Text>
  )}
</View>

<View style={styles.halfInputContainer}>
  <Text style={styles.inputLabel}>
    Scope Definition<Text style={styles.asterisk}>*</Text>
  </Text>

  {formIsEditable ? (
    // In edit mode, show the TextInput to allow editing of Scope Definition
    <TextInput
      style={styles.outlinedInput}
      placeholder="Enter Scope Definition"
      value={scopeDefinition || project.scope_definition} // Use custom state `scopeDefinition` or fallback to `project.scope_definition`
      onChangeText={setScopeDefinition} // Update the custom state when text is changed
    />
  ) : (
    // In view mode, display the Scope Definition as text
    <Text style={styles.outlinedInput}>
      {scopeDefinition || project.scope_definition || 'No Scope Definition Available'}
    </Text>
  )}
</View>

                </View>
  
                {/* Key Assumption and Benefits/ROI Row */}
                <View style={styles.row5}>
                <View style={styles.halfInputContainer}>
  <Text style={styles.inputLabel}>
    Key Assumption<Text style={styles.asterisk}>*</Text>
  </Text>

  {formIsEditable ? (
    // In edit mode, show the TextInput to allow editing of Key Assumption
    <TextInput
      style={styles.outlinedInput}
      placeholder="Enter Key Assumption"
      value={keyAssumption || project.key_assumption} // Use custom state `keyAssumption` or fallback to `project.key_assumption`
      onChangeText={setKeyAssumption} // Update the custom state when text is changed
    />
  ) : (
    // In view mode, display the Key Assumption as text
    <Text style={styles.outlinedInput}>
      {keyAssumption || project.key_assumption || 'No Key Assumption Available'}
    </Text>
  )}
</View>

<View style={styles.halfInputContainer}>
  <Text style={styles.inputLabel}>
    Benefits/ROI<Text style={styles.asterisk}>*</Text>
  </Text>

  {formIsEditable ? (
    // In edit mode, show the TextInput to allow editing of Benefits/ROI
    <TextInput
      style={styles.outlinedInput}
      placeholder="Enter Benefits/ROI"
      value={benefitsROI || project.benefit_roi} // Use custom state `benefitsROI` or fallback to `project.benefit_roi`
      onChangeText={setBenefitsROI} // Update the custom state when text is changed
    />
  ) : (
    // In view mode, display the Benefits/ROI as text
    <Text style={styles.outlinedInput}>
      {benefitsROI || project.benefit_roi || 'No Benefits/ROI Available'}
    </Text>
  )}
</View>

                </View>
  
                {/* Risk Input */}
                <View style={styles.row5}>
                <View style={styles.halfInputContainer}>
  <Text style={styles.inputLabel}>
    Risk<Text style={styles.asterisk}>*</Text>
  </Text>

  {formIsEditable ? (
    // In edit mode, show the TextInput to allow editing of Risk
    <TextInput
      style={styles.outlinedInput}
      placeholder="Enter Risk"
      value={risk || project.risk} // Use custom state `risk` or fallback to `project.risk`
      onChangeText={setRisk} // Update the custom state when text is changed
    />
  ) : (
    // In view mode, display the Risk as text
    <Text style={styles.outlinedInput}>
      {risk || project.risk || 'No Risk Available'}
    </Text>
  )}
</View>

                  <View style={styles.halfInputContainer}>
              <Text style={styles.inputLabel}>Budget Impact<Text style={styles.asterisk}>*</Text></Text>
              <TextInput
  style={styles.outlinedInput}
  placeholder="Enter Budget Impact"
  placeholderTextColor="#757575"
  /* value={budgetImpact} */ // Use Formik's state or fallback to custom state
  onChangeText={(text) => {
   /*  setFieldValue('budgetImpact', text); */ // Update Formik's state
    setBudgetImpact(text); // Update custom state
  }}
  multiline={true} // Allow multi-line input
  numberOfLines={4} // Adjust height
  textAlignVertical="top" // Align text to the top
/>
{/* {touched.budget && errors.budget && (
  <Text style={{ color: 'red', marginTop: 4 }}>{errors.budget}</Text>
)} */}
            </View>
                </View>
  
                {/* Custom Fields Button and Checkbox */}
               {/*  <View style={styles.row}>
                  <View style={styles.customFieldsContainer}>
                    <View style={styles.checkboxContainer}>
                      <TouchableOpacity
                        style={[styles.checkbox, isChecked && styles.checked]}
                        onPress={() => setIsChecked(!isChecked)}>
                        {isChecked && (
                          <Icon name="checkmark" size={18} color="#fff" />
                        )}
                      </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={styles.customFieldsButton}>
                      <Text style={styles.customFieldsButtonText}>
                        Add custom fields
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View> */}
  
                {/* Bottom Buttons */}
                <View style={styles.bottomButtonsContainer}>
                  
  
                  {isEditable ? (
                      <TouchableOpacity
                      style={styles.saveAsDraftButton}
                      onPress={handleSaveAsDraft}>
                      <Icon
                        name="save-outline"
                        size={18}
                        color="#044086"
                        style={styles.saveIcon}
                      />
                      <Text style={styles.saveAsDraftButtonText}>
                        Save as draft
                      </Text>
                    </TouchableOpacity>
                    ) : (
                      <Text style={styles.saveAsDraftButtonText}>
                      
                    </Text>
                     
                    )}
                  {/*Send for review Button */}
                  
                  {(status === 4 || status === 2) && (
    <>
      
      <TouchableOpacity 
        style={styles.newButton}
        onPress={() => { setIsApprovalPopupVisible(true); }}
      >
        <Icon name="checkmark-circle-outline" size={18} color="#044086" style={styles.newButtonIcon} />
        <Text style={styles.newButtonText}>Send for Approval</Text>
      </TouchableOpacity>
    </>
  )}
  
  {(status === 2) && (
    <>
      
      <TouchableOpacity 
        style={styles.newButton}
        onPress={() => { setIsReviewPopupVisible(true); }}
      >
        <Icon name="checkmark-circle-outline" size={18} color="#044086" style={styles.newButtonIcon} />
        <Text style={styles.newButtonText}>Send for Review</Text>
      </TouchableOpacity>
    </>
  )}
                </View>
              </View>
            </ScrollView>
  
            {/* Send for Approval Popup */}
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
                <RadioButton.Group onValueChange={value => setSelectedOptionApp(value)} 
                value={selectedOptionApp || "2"}>
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
                  {!addOtherUser ? (
              <View style={styles.approvalPathInputContainer}>
                <Text style={styles.approvalPathLabel}>
                  Approval user list <Text style={styles.asterisk}>*</Text>
                </Text>
                <View style={styles.approvalPathInput}>
                <Picker
    key={approvalPathidApp}
    selectedValue={approvalPathidApp}
    onValueChange={(itemValue) => {
      console.log("Selected User ID:", itemValue);
      setApprovalPathidApp(itemValue); // Set the selected user's ID
    }}
    style={styles.input}
  >
    <Picker.Item label="Select User" value="" />
    {users.length > 0 ? (
      users.map((user) => (
        <Picker.Item key={user.user_id} label={user.first_name} value={user.user_id} />
      ))
    ) : (
      <Picker.Item label="No Users Available" value="" />
    )}
  </Picker>
  
                </View>
              </View>
            ) : (
              <View style={styles.approvalPathInputContainer}>
                <Text style={styles.approvalPathLabel}>
                  Select Others <Text style={styles.asterisk}>*</Text>
                </Text>
                <View style={styles.approvalPathInput}>
                <Picker
    key={approvalPathidApp}
    selectedValue={approvalPathidApp}
    onValueChange={(itemValue) => {
      console.log("Selected User ID:", itemValue);
      setApprovalPathidApp(itemValue); // Set the selected user's ID
    }}
    style={styles.input}
  >
    <Picker.Item label="Select User" value="" />
    {users.length > 0 ? (
      users.map((user) => (
        <Picker.Item key={user.user_id} label={user.first_name} value={user.user_id} />
      ))
    ) : (
      <Picker.Item label="No Users Available" value="" />
    )}
  </Picker>
  
                </View>
              </View>
            )}
                    
                 
                    <RadioButton.Group
              onValueChange={(value) => setAddOtherUser(value === 'addOtherUser' ? !addOtherUser : addOtherUser)}
              value={addOtherUser ? 'addOtherUser' : 'none'}
            >
              <View style={styles.radioOptionsRow}>
                <View style={styles.radioOption}>
                  <RadioButton.Android value="addOtherUser" color="#044086" />
                  <Text style={styles.radioText}>Add Other User</Text>
                </View>
              </View>
            </RadioButton.Group>
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
          visible={isReviewPopupVisible}
          transparent={true}
          animationType="fade"
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <TouchableOpacity 
                style={styles.closeIcon} 
                onPress={() => setIsReviewPopupVisible(false)}
              >
                <Icon name="close" size={24} color="#000" />
              </TouchableOpacity>
              <Text style={styles.popupHeading}>Send for Review</Text>
              
              <ScrollView 
                style={styles.modalScrollView}
                showsVerticalScrollIndicator={false}
              >
               <RadioButton.Group 
            onValueChange={(value) => {
              setSelectedOption(value);
              if (value === '2') {
                setShowNewApprovalForm(true);
                setIsCreatingSequence(true);
              }
            }} 
            value={selectedOption}
          >
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
                          {/* <TouchableOpacity 
                            style={styles.backButton}
                            onPress={() => {
                              setShowNewApprovalForm(false);
                            }}
                          >
                            <Icon name="arrow-back" size={18} color="#232323" />
                            <Text style={styles.backText}>Back</Text>
                          </TouchableOpacity> */}
                         {/*  <Text style={styles.newApprovalTitle}>Create New Review</Text> */}
                        </View>
  
                      {/*   <TextInput
    style={styles.newApprovalInput}
    placeholder="Enter text"
    value={sequenceName}  
    onChangeText={(text) => setSequenceName(text)}  
  />
   */}
                        <View style={styles.columnsContainer}>
                          <View style={styles.columnsHeader}>
                            <Text style={styles.columnTitle}>S.No</Text>
                            <Text style={styles.columnTitle}>Forwardto</Text>
                            <Text style={styles.columnTitle}>Department</Text>
                           {/*  <Text style={styles.columnTitle}>Their Action</Text> */}
                          </View>
                          {steps.map((step, index) => (
                        <View key={step.id} style={styles.columnContent}>
                          <Text style={styles.stepText}> {step.id}</Text>
                          <View style={styles.searchableDropdown}>
                            <Picker
                              selectedValue={step.forwardTo}
                              onValueChange={(itemValue) => {
                                  const selectedUser = users.find((user) => user.user_id === Number(itemValue));
                                  console.log('Selected User:', selectedUser);
                                const newSteps = [...steps];
                                newSteps[index].forwardTo = itemValue;
                                newSteps[index].department_name = selectedUser?.department_name || 'No Department';
                                setSteps(newSteps);
                              }}
                              style={styles.input}
                            >
                              <Picker.Item label="Select User" value="" />
                              {users.map((user) => (
                                <Picker.Item key={user.user_id} label={user.first_name + ' ' + user.last_name } value={user.user_id} />
                              ))}
                            </Picker>
                            {/* <Icon name="search" size={14} color="#000" style={styles.iconsearch} /> */}
                          </View>
                          <Text style={styles.autoPopulatedText}>
                            {step.department_name || 'No Department'}
                          </Text>
                              <View style={styles.actionContainer}>
                               {/*  <Picker
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
                                </Picker> */}
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
                            <Text style={styles.addStepButtonText}>Add User</Text>
                          </TouchableOpacity>
                          {/* <TouchableOpacity style={styles.sequence} onPress={createSequence}>
                  <Text style={styles.popupSubmitButtonText}>Create Sequence</Text>
                </TouchableOpacity> */}
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
                <TouchableOpacity style={styles.popupCancelButton} onPress={() => setIsReviewPopupVisible(false)}>
                  <Text style={styles.popupCancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
          </SafeAreaView>
        ) : (
          <Text>Loading project details...</Text>
        )}
      </ScrollView>
    );
  };
  

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
       width: '100%',
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
    },
    backButton: {
      marginRight: 16,
    },
    projectName: {
      color: '#000',
      fontFamily: 'Outfit',
      fontSize: 16,
      fontWeight: '500',
      lineHeight: 22,
      textTransform: 'capitalize',
    },
    tabContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      borderBottomWidth: 1,
      borderBottomColor: '#e0e0e0',
    },
    tab: {
      paddingVertical: 12,
      paddingHorizontal: 16,
      marginHorizontal: 8,
    },
    activeTab: {
      borderBottomWidth: 2,
      borderBottomColor: '#044086',
    },
    tabText: {
      color: '#000',
      fontFamily: 'Outfit',
      fontSize: 16,
      fontWeight: '500',
      lineHeight: 22,
      textTransform: 'capitalize',
    },
    historyHeading: {
      color: '#000',
      fontFamily: 'Source Sans Pro',
      fontSize: 14,
      fontWeight: '600',
      lineHeight: 22,
      padding: 16,
      justifyContent: 'center',
    },
    tableHeader: {
      flexDirection: 'row',
      paddingHorizontal: 16,
      paddingVertical: 8,
      backgroundColor: '#f5f5f5',
    },
  
    tableRow: {
      flexDirection: 'row',
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: '#e0e0e0',
    },
  
    commentCell: {
      backgroundColor: '#D3E6FC',
      padding: 8,
      borderRadius: 4,
    },
  
    historyHeader: {
      flexDirection: 'row',
      backgroundColor: '#f5f5f5',
      paddingVertical: 8,
      paddingHorizontal: 16,
    },
    columnHeader: {
      color: '#757575',
      fontFamily: 'Source Sans Pro',
      fontSize: 14,
      fontWeight: '600',
      lineHeight: 22,
    },
    sequenceContainer: {
      flexDirection: 'row',
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: '#e0e0e0',
    },
    cellText: {
      color: '#232323',
      fontFamily: 'Source Sans Pro',
      fontSize: 14,
      fontWeight: '400',
      lineHeight: 22,
    },
    actionButton: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    /*  container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
    },
    //   backButton: {
    //     marginRight: 16,
    //   },
    projectName: {
      color: '#000',
      fontFamily: 'Outfit',
      fontSize: 16,
      fontWeight: '500',
      lineHeight: 22,
      textTransform: 'capitalize',
    },
    tabContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      borderBottomWidth: 1,
      borderBottomColor: '#e0e0e0',
    },
    tab: {
      paddingVertical: 12,
      paddingHorizontal: 16,
      marginHorizontal: 8,
    },
    activeTab: {
      borderBottomWidth: 2,
      borderBottomColor: '#044086',
    },
    tabText: {
      color: '#000',
      fontFamily: 'Outfit',
      fontSize: 16,
      fontWeight: '500',
      lineHeight: 22,
      textTransform: 'capitalize',
    },
    historyHeading: {
      color: '#000',
      fontFamily: 'Source Sans Pro',
      fontSize: 14,
      fontWeight: '600',
      lineHeight: 22,
      padding: 16,
    },
    tableHeader: {
      flexDirection: 'row',
      paddingHorizontal: 16,
      paddingVertical: 8,
      backgroundColor: '#f5f5f5',
    },
    columnHeader: {
      color: '#757575',
      fontFamily: 'Source Sans Pro',
      fontSize: 14,
      fontWeight: '600',
      lineHeight: 22,
    },
    tableRow: {
      flexDirection: 'row',
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: '#e0e0e0',
    }, */
    /*   cellText: {
      color: '#232323',
      fontFamily: 'Source Sans Pro',
      fontSize: 14,
      fontWeight: '400',
      lineHeight: 22,
    }, */
    /*   commentCell: {
      backgroundColor: '#D3E6FC',
      padding: 8,
      borderRadius: 4,
    },
    actionButton: {
      justifyContent: 'center',
      alignItems: 'center',
    }, */
    /*  container: {
      flex: 1,
      backgroundColor: '#FFF',
    }, */
    scrollView: {
      flex: 2,
    },
    content: {
      flex: 1,
      alignItems: 'center',
      paddingVertical: 30,
    },
    /*  header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: '#E5E5E5',
      backgroundColor: '#F5F5F5',
    }, */
    headerTitle: {
      color: '#000',
      fontFamily: 'Outfit',
      fontSize: 20,
      fontWeight: '500',
      lineHeight: 22,
      textTransform: 'capitalize',
    },
    /* backButton: {
      flexDirection: 'row',
      alignItems: 'center',
    }, */
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
      justifyContent: 'center',
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
      marginTop: 33,
      shadowColor: '#101828',
      marginLeft: 120,
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
      marginBottom: 50,
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
      marginLeft: 20,
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
      marginTop: 20,
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
      textAlign: 'center',
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
      alignItems: 'center',
      display: 'flex',
    },
    columnInput: {
      width: '24%',
      height: 40,
      borderWidth: 1,
      borderColor: '#C4C4C4',
      borderRadius: 5,
      paddingHorizontal: 10,
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
    newButton: {
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
      alignItems: 'center',
      display: 'flex',
      textAlign: 'center',
    },
    addStepButton: {
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
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 20,
        padding: 5,
      },
      closeButtonText: {
        fontSize: 18,
        color: 'red',
      },
  });
export default ProjectDetailedView;

