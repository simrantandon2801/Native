import React,{ useEffect, useState } from 'react'
import { AddMilestoneModal } from './AddMilestoneModal';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { DataTable, IconButton, Menu } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { DeleteMilestone, GetMilestones } from '../../database/ApprovedProjects';
import { useFocusEffect } from '@react-navigation/native';

const Milestone = ({/*  items, */ projectId /* isEditable */ }) => {
const [isMilestoneModalVisible, setIsMilestoneModalVisible] = useState(false);
const [milestones, setMilestones] = useState<any[]>([]);
const [activeMenu, setActiveMenu] = useState(null);
const [selectedMilestone, setSelectedMilestone] = useState(null);
const [isEditing, setIsEditing] = useState(false);
console.log(projectId)

const FetchMilestones = async (projectId) => {
    try {
      const response = await GetMilestones(projectId); // Pass projectId here
      const parsedRes = JSON.parse(response);
      console.log('Get Projects Response:', response);
  
      if (parsedRes?.status === 'success' && Array.isArray(parsedRes.data)) {
        // Filter out milestones where is_active is true
        const activeMilestones = parsedRes.data.filter(milestone => milestone.is_active === true);
  
        // Update the state with only active milestones
        setMilestones(activeMilestones);  
      } else {
        console.error('Invalid or empty data');
        Alert.alert('Error', 'Invalid or empty data');
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      Alert.alert('Error', 'Failed to fetch projects');
    }
  };
  
  const handleMenuPress = (milestone) => {
    console.log('Setting selected milestone:', milestone);  // Debugging console log
    setSelectedMilestone(milestone);  // Set the selected milestone
    setActiveMenu(activeMenu === milestone.id ? null : milestone.id);  // Toggle the menu
  };
  const handleView = () => {
    setIsEditing(false); // Disable editing
    setIsMilestoneModalVisible(true);  // Show modal
    setActiveMenu(null); // Close the menu
    console.log("Selected Milestone for View:", selectedMilestone);  // Log to check if data is correct
  };

  const handleEdit = () => {
    setIsEditing(true); 
    
    setIsMilestoneModalVisible(true);
    setActiveMenu(null); // Close the menu
  };
  useEffect(() => {
    console.log('isEditing updated:', isEditing);
  }, [isEditing]);

  /* const handleDelete = (milestoneId) => {
    Alert.alert('Delete Milestone', 'Are you sure you want to delete this milestone?', [
      { text: 'Cancel', onPress: () => setActiveMenu(null) },
      {
        text: 'Delete',
        onPress: () => {
          
          console.log('Deleted milestone with id:', milestoneId);
          setActiveMenu(null); // Close the menu
        },
      },
    ]);
  }; */
  const handleDelete = async (milestoneId: number) => {
    if (!milestoneId) {
      console.error('Invalid Milestone ID');
      return;
    }
  
    try {
      // Create the payload
      const payload = {
        milestone_id: milestoneId, // send the milestone_id as part of the payload
      };
  
      console.log('Deleting Milestone with Payload:', payload);
  
      // Call the API function to delete the milestone
      const res = await DeleteMilestone(payload);  // Pass the payload to the API
  
      console.log('Delete API Response:', res);
      const parsedRes = JSON.parse(res);
  
      if (parsedRes.status === 'success') {
        // Refresh the milestone list after deletion
        FetchMilestones(projectId);
        Alert.alert('Success', 'Milestone deleted successfully');
      } else {
        throw new Error(parsedRes.message || 'Unknown error occurred');
      }
    } catch (error) {
      console.error('Error in handleDelete:', error);
      Alert.alert('Error', 'Failed to delete milestone. Please try again.');
    } finally {
      setActiveMenu(null);  // Close the menu after the operation
    }
  };
  
  useFocusEffect(
    React.useCallback(() => {
      // Fetch data or refresh the screen every time it gains focus
      FetchMilestones(projectId);
    }, [])
  );    
        return (
          <View style={styles.milestonesContainer}>
            <Text style={styles.milestonesHeading}>Milestones</Text>
            <TouchableOpacity 
              style={styles.addMilestoneButton} 
              onPress={() => {
                console.log("Selected Milestone before opening modal:", selectedMilestone); // Log selected milestone
                setIsMilestoneModalVisible(true);
                setIsEditing(true); 
              }}
              
            >
              <Icon name="plus" size={20} color="#044086" />
              <Text style={styles.addMilestoneText}>Add Milestone</Text>
              
            </TouchableOpacity>
            
            <AddMilestoneModal 
              visible={isMilestoneModalVisible}
              onClose={() => setIsMilestoneModalVisible(false)}
              projectId={projectId}
              milestone={selectedMilestone}
              isEditable={isEditing} 
             
            />
            
             {milestones.length > 0 ? (
        <DataTable style={{ width: '100%', marginBottom: 16 }}>
          <DataTable.Header>
            <DataTable.Title>S.No.</DataTable.Title>
            <DataTable.Title>Milestone Name</DataTable.Title>
            <DataTable.Title>Priority</DataTable.Title>
            <DataTable.Title>Description</DataTable.Title>
            <DataTable.Title>Start Date</DataTable.Title>
            <DataTable.Title>End Date</DataTable.Title>
            <DataTable.Title>Action</DataTable.Title>
          </DataTable.Header>

          {milestones.map((milestone, index) => (
            <DataTable.Row key={milestone.id}>
              <DataTable.Cell>{index + 1}</DataTable.Cell>
              <DataTable.Cell>{milestone.milestone_name}</DataTable.Cell>
              <DataTable.Cell>{milestone.priority}</DataTable.Cell>
              <DataTable.Cell>{milestone.description}</DataTable.Cell>
              <DataTable.Cell>{milestone.start_date}</DataTable.Cell>
              <DataTable.Cell>{milestone.end_date}</DataTable.Cell>
              <DataTable.Cell>
              {/* <TouchableOpacity onPress={() => handleMenuPress(milestone)}>
                  <Icon name="dots-vertical" size={20} color="#667085" />
                </TouchableOpacity> */}
                {/* Menu Options */}
                <Menu
                  visible={activeMenu === milestone.id} // Menu is visible if activeMenu matches the milestone id
                  onDismiss={() => setActiveMenu(null)} // Close the menu
                  anchor={
                    <IconButton
                      icon="dots-vertical"
                      size={20}
                      onPress={() => {
                        setActiveMenu(activeMenu === milestone.id ? null : milestone.id);
                        setSelectedMilestone(milestone);
                      }}
                    />
                  }
                >
                  <Menu.Item  onPress={() => { 
      console.log('View milestone:', milestone); 
      handleView(); 
    }}  title="View" />
                  <Menu.Item onPress={handleEdit} title="Edit" />
                  <Menu.Item onPress={() => handleDelete(milestone.milestone_id)} title="Delete" />
                </Menu>
</DataTable.Cell>
            </DataTable.Row>
          ))}
        </DataTable>
      ) : (
       
        <Text>No milestones available</Text>
      )}
          </View>
        );
      };
      const styles = StyleSheet.create({
        milestonesContainer: {
            flex: 1,
           width:'100%',
           
          },
          milestonesHeading: {
            color: '#000',
            fontFamily: 'Outfit',
            fontSize: 20,
            fontWeight: '500',
            lineHeight: 22,
            textTransform: 'capitalize',
            marginBottom: 20,
             justifyContent:'center'
          },
          addMilestoneButton: {
            flexDirection: 'row',
            paddingRight: 14,
            alignItems: 'center',
            gap: 10,
            borderRadius: 5,
            borderWidth: 1,
            borderColor: '#044086',
            paddingVertical: 8,
            paddingHorizontal: 12,
            width:'20%',
            justifyContent:'center'
          },
          addMilestoneText: {
            color: '#044086',
            fontFamily: 'Inter',
            fontSize: 14,
            fontStyle: 'normal',
            fontWeight: '400',
            lineHeight: 22,
          },
          raidContainer: {
            flex: 1,
            width: '100%',
          },
          raidHeading: {
            color: '#000',
            fontFamily: 'Outfit',
            fontSize: 20,
            fontWeight: '500',
            lineHeight: 22,
            textTransform: 'capitalize',
            textAlign: 'center',
            marginBottom: 20,
            marginTop: 40,
          },
          dataTable: {
            backgroundColor: '#F7F7F7',
            overflow: 'hidden',
          },
          dataTableHeader: {
            // backgroundColor: '#E0E0E0',
          },
          dataTableCell: {
            justifyContent: 'center',
            paddingHorizontal: 16,
            paddingVertical: 12,
          },
          badge: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 5,
          },
          badgeText: {
            fontFamily: 'Inter',
            fontSize: 14,
            fontWeight: '500',
          },
          activeText: {
            // color: '#027A48',
          },
          inactiveText: {
            // color: '#B42318',
          },
          priorityLow: {
            borderRadius: 5,
            backgroundColor: '#E0E0E0',
            paddingHorizontal: 9,
            justifyContent: 'center',
            alignItems: 'center',
          },
          priorityLowText: {
            color: '#232323',
            fontFamily: 'Source Sans Pro',
            fontSize: 14,
          },
          ownerContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
          },
          ownerName: {
            fontFamily: 'Inter',
            fontSize: 14,
          },
          buttonRow: {
            flexDirection: 'row',
            justifyContent: 'flex-end',
            marginVertical: 20,
            marginRight:20
          },
          rightButtons: {
            flexDirection: 'row',
            gap: 10,
          },
          deleteButton: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 5,
          },
          deleteButtonText: {
            color: '#C4C4C4',
            fontFamily: 'Inter',
            fontSize: 14
          },
          addRaidButton: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 5,
          },
        
          addRaidButtonText: {
            color: '#044086',
            fontSize: 14,
            fontWeight: '600',
            fontFamily: 'Inter'
          },
          priorityHigh: {
            borderRadius: 5,
            backgroundColor: '#FFD4D4',
            display: 'flex',
            padding: 0,
            paddingHorizontal: 9,
            justifyContent: 'center',
            alignItems: 'center',
            gap: 6,
          },
          priorityHighText: {
            color: '#B50707',
            fontFamily: 'Source Sans Pro',
            fontSize: 14,
            fontStyle: 'normal',
            fontWeight: '400',
            lineHeight: 22,
          },
    });

  


export default Milestone