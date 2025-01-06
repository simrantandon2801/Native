import React,{ useState } from 'react'
import { AddMilestoneModal } from './AddMilestoneModal';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { DataTable } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { AddRaidModal } from './AddRaidModal';

const Raid = ({/*  items, */ projectId /* isEditable */ }) => {
const [isRaidstoneModalVisible, setIsRaidtoneModalVisible] = useState(false);
     
    

        return (
          <View style={styles.milestonesContainer}>
            <Text style={styles.milestonesHeading}>Raid</Text>
            <TouchableOpacity 
              style={styles.addMilestoneButton} 
              onPress={() => setIsRaidtoneModalVisible(true)}
            >
              <Icon name="plus" size={20} color="#044086" />
              <Text style={styles.addMilestoneText}>Add Raid</Text>
            </TouchableOpacity>
            
            <AddRaidModal 
                    visible={isRaidstoneModalVisible}
                    onClose={() => setIsRaidtoneModalVisible(false)} projectId={projectId}           />
          </View>
        );
      };
      const styles = StyleSheet.create({
        milestonesContainer: {
            flex: 1,
            alignItems: 'center',
            paddingTop: 20,
          },
          milestonesHeading: {
            color: '#000',
            fontFamily: 'Outfit',
            fontSize: 20,
            fontWeight: '500',
            lineHeight: 22,
            textTransform: 'capitalize',
            marginBottom: 20,
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
          },
          addMilestoneText: {
            color: '#044086',
            fontFamily: 'Inter',
            fontSize: 14,
            fontStyle: 'normal',
            fontWeight: '400',
            lineHeight: 22,
          },
          required: {
            color: 'red',
          },
    });

  


export default Raid