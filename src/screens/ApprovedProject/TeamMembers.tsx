import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { DataTable } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

 import { TeamMemberModal } from './TeamMembersModal';
import { GetTeamMembers } from '../../database/ApprovedProjects';
import { useFocusEffect } from '@react-navigation/native';
// TeamMemberModal component (placeholder)


const TeamMembers= ({/*  items, */ projectId /* isEditable */ }) => {
    const [isTeamMembersModalVisible, setIsTeamMemberModalVisible] = useState(false);
    const [teamMembers, setTeamMembers] = useState<any[]>([]);
console.log(projectId)

const fetchProjects = async (projectId) => {
  try {
    const response = await GetTeamMembers(projectId); // Pass projectId here
    const parsedRes = JSON.parse(response);
    console.log('Get Projects Response:', response);

    if (parsedRes?.status === 'success' && Array.isArray(parsedRes.data)) {
      setTeamMembers(parsedRes.data);  // Update the state with the fetched data
    } else {
      console.error('Invalid or empty data');
      Alert.alert('Error', 'Invalid or empty data');
    }
  } catch (error) {
    console.error('Error fetching projects:', error);
    Alert.alert('Error', 'Failed to fetch projects');
  }
};
    
    useFocusEffect(
      React.useCallback(() => {
        // Fetch data or refresh the screen every time it gains focus
        fetchProjects(projectId);
      }, [])
    );    
    return (
      <View style={styles.teamMembersContainer}>
        <Text style={styles.teamMembersHeading}>Team Members</Text>
        {/* <ScrollView horizontal> */}
          <DataTable style={styles.dataTable}>
              <View style={styles.buttonRow}>
                          <View style={styles.rightButtons}>
                            <TouchableOpacity style={styles.deleteButton}>
                              <Icon name="delete" size={16} color="#C4C4C4" />
                              <Text style={styles.deleteButtonText}>Delete</Text>
                            </TouchableOpacity>
            
                            <TouchableOpacity style={styles.addMemberButton}
                            onPress={()=>setIsTeamMemberModalVisible(true)}
                            >
                              <Icon name="plus" size={16} color="#044086" />
                              <Text style={styles.addMemberButtonText}>Add Member</Text>
                           
                            <TeamMemberModal 
        visible={isTeamMembersModalVisible}
        onClose={() => setIsTeamMemberModalVisible(false)}
        projectId={projectId}
      /> </TouchableOpacity>
                          </View>
                        </View>
            <DataTable.Header style={styles.dataTableHeader}>
              <DataTable.Title style={styles.dataTableCell}>S.No.</DataTable.Title>
              <DataTable.Title style={styles.dataTableCell}>Member Name</DataTable.Title>
              <DataTable.Title style={styles.dataTableCell}>Role</DataTable.Title>
              <DataTable.Title style={styles.dataTableCell}>Avg. Cost/hr</DataTable.Title>
              <DataTable.Title style={styles.dataTableCell}>Actual Cost/hr</DataTable.Title>
              <DataTable.Title style={styles.dataTableCell}>Proposed Start Date</DataTable.Title>
              <DataTable.Title style={styles.dataTableCell}>Proposed End Date</DataTable.Title>
              <DataTable.Title style={styles.dataTableCell}>Active/Inactive</DataTable.Title>
              <DataTable.Title style={styles.dataTableCell}>Actions</DataTable.Title>
            </DataTable.Header>
            {teamMembers.map((member, index) => (
  <DataTable.Row key={member.project_resources_id}>
    <DataTable.Cell style={styles.dataTableCell}>{index + 1}</DataTable.Cell>  {/* Serial number */}
    <DataTable.Cell style={styles.dataTableCell}>{member.resource_name}</DataTable.Cell>  {/* Member name */}
    <DataTable.Cell style={styles.dataTableCell}>{member.role_name}</DataTable.Cell>  {/* Role */}
    <DataTable.Cell style={styles.dataTableCell}>${member.average_cost}</DataTable.Cell>  {/* Avg. Cost */}
    <DataTable.Cell style={styles.dataTableCell}>${member.actual_cost}</DataTable.Cell>  {/* Actual Cost */}
    <DataTable.Cell style={styles.dataTableCell}>
      {new Date(member.start_date).toLocaleDateString()}
    </DataTable.Cell>  {/* Start date */}
    <DataTable.Cell style={styles.dataTableCell}>
      {new Date(member.end_date).toLocaleDateString()}
    </DataTable.Cell>  {/* End date */}
    <DataTable.Cell style={styles.dataTableCell}>
      {member.is_active ? 'Active' : 'Inactive'}
    </DataTable.Cell>  {/* Active/Inactive */}
    <DataTable.Cell style={styles.dataTableCell}>
      <TouchableOpacity>
        <Icon name="dots-vertical" size={20} color="#667085" />
      </TouchableOpacity>
    </DataTable.Cell>  {/* Actions */}
  </DataTable.Row>
))}
          </DataTable>
        {/* </ScrollView> */}
      </View>
    );
  };

const styles = StyleSheet.create({
    teamMembersContainer: {
        flex: 1,
        width: '100%',
      },
      teamMembersHeading: {
        color: '#000',
        fontFamily: 'Outfit',
        fontSize: 20,
        fontStyle: 'normal',
        fontWeight: '500',
        lineHeight: 22,
        textTransform: 'capitalize',
        textAlign: 'center',
        marginBottom: 20,
        marginTop:40
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
        minWidth: 120,
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
      addMemberButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
      },
    
      addMemberButtonText: {
        color: '#044086',
        fontSize: 14,
        fontWeight: '600',
        fontFamily: 'Inter'
      },
});

export default TeamMembers;

