import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Picker } from '@react-native-picker/picker';
/* import { AddMilestoneModal } from './AddMilestoneModal'; */
import { DataTable } from 'react-native-paper';
import StakeholdersForm from './Stakeholderform';
import ProjectDetailedView from './ProjectDetailedView';
import TeamMembers from './TeamMembers';
import { useRoute } from '@react-navigation/native';
/* import { TeamMemberModal } from './TeamMembersModal';
import Raid from './Raid';
import Financial from './Financial';
import Planning from './Planning'; */

/* import TeamMembers from './TeamMembers';
import Milestone from './Milestone'; */

const tabs = [
  'Project Details',
  'Stakeholders Involved',
  'Team Members',
  'Milestones',
  'Raid',
  'Financial',
  'Planning & Strategy',
  'Custom Fields'
];

const ProjectDetails: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  
 



  const route = useRoute();
  const {project_id} = route.params as {project_id: number};

  return (
    <View style={styles.container}>
      <View style={styles.headingContainer}>
        <Text style={styles.projectName}>Project Name</Text>
      </View>
      <View style={styles.tabScrollContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabContainer}
        >
          {tabs.map((tab, index) => (
            <TouchableOpacity
              key={index}
              style={styles.tab}
              onPress={() => setActiveTab(index)}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === index && styles.activeTabText,
                ]}
              >
                {tab}
              </Text>
              {activeTab === index && <View style={styles.activeTabIndicator} />}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      <View style={styles.content}>
        {activeTab === 0 && <ProjectDetailedView 
  
    projectId={project_id} 
    isEditable={true} 
  />}
        {activeTab === 1 && <StakeholdersForm/>}
        {activeTab === 2 && <TeamMembers/>}
      {/*   {activeTab === 3 && <Milestone/>}
        {activeTab === 4 && <Raid/> }
        {activeTab === 5 && <Financial/> }
        {activeTab === 6 && <Planning/> } */}
      </View>
      <View style={styles.buttonContainer}>
            <View style={styles.approvalButton}>
              <Icon name="check-circle" size={24} color="#ffffff" style={styles.icon} />
              <Text style={styles.buttonText}>Submit for Approval</Text>
            </View>
          </View>
    </View>
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  projectName: {
    color: '#000',
    fontFamily: 'Outfit',
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 28,
    textTransform: 'capitalize',
  },
  tabScrollContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    width:'100%'
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    minWidth: Dimensions.get('window').width,
  },
  tab: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    position: 'relative',
  },
  tabText: {
    color: '#757575',
    textAlign: 'center',
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 22,
    letterSpacing: 0.1,
  },
  activeTabText: {
    color: '#044086',
    fontWeight: '500',
  },
  activeTabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#044086',
    width: '100%',
  },
  content: {
    flex: 1,
    display: 'flex',
 
    justifyContent: 'center',
    alignItems: 'center',
    gap: 40,
  },
  buttonContainer: {
    alignItems: 'flex-end',
    marginTop: 16,
    padding: 20
  },
  approvalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    backgroundColor: '#044086',
    shadowColor: '#101828',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1.92,
    elevation: 2,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  heading: {
    alignItems: 'center', 
    justifyContent: 'center', 
    marginVertical: 16, 
    fontSize:20
  }, icon: {
    marginRight: 4,
  },
  text: {
    color: '#000', 
    fontFamily: 'Outfit', 
    fontSize: 20, 
    fontStyle: 'normal', 
    fontWeight: '500', 
    lineHeight: 22, 
    marginBottom:20,
    textTransform: 'capitalize', 
  },
 
 
});

export default ProjectDetails;

