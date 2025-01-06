import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { DataTable } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Avatar } from 'react-native-paper';
import { AppImages } from '../../assets';

const Raid = () => {
  const [isActive, setIsActive] = useState(true); 

  return (
    <View style={styles.raidContainer}>
      <Text style={styles.raidHeading}>RAID details</Text>
      <DataTable style={styles.dataTable}>
        <View style={styles.buttonRow}>
          <View style={styles.rightButtons}>
            <TouchableOpacity style={styles.deleteButton}>
              <Icon name="delete" size={16} color="#C4C4C4" />
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.addRaidButton}>
              <Icon name="plus" size={16} color="#044086" />
              <Text style={styles.addRaidButtonText}>Add Raid</Text>
            </TouchableOpacity>
          </View>
        </View>
        <DataTable.Header style={styles.dataTableHeader}>
                  <DataTable.Title style={styles.dataTableCell}>S.No.</DataTable.Title>
          <DataTable.Title style={styles.dataTableCell}>Raid Name</DataTable.Title>
          <DataTable.Title style={styles.dataTableCell}>Type</DataTable.Title>
          <DataTable.Title style={styles.dataTableCell}>Description</DataTable.Title>
          <DataTable.Title style={styles.dataTableCell}>Mitigation Plan</DataTable.Title>
          <DataTable.Title style={styles.dataTableCell}>Priority</DataTable.Title>
          <DataTable.Title style={styles.dataTableCell}>Owner</DataTable.Title>
          <DataTable.Title style={styles.dataTableCell}>ETA</DataTable.Title>
          <DataTable.Title style={styles.dataTableCell}>Active/Inactive</DataTable.Title>
          <DataTable.Title style={styles.dataTableCell}>Action</DataTable.Title>
        </DataTable.Header>

        <DataTable.Row>
                 <DataTable.Cell style={styles.dataTableCell}>1</DataTable.Cell>
          <DataTable.Cell style={styles.dataTableCell}>Raid 1</DataTable.Cell>
          <DataTable.Cell style={styles.dataTableCell}>Project Manager</DataTable.Cell>
          <DataTable.Cell style={styles.dataTableCell}>Description of Raid 1</DataTable.Cell>
          <DataTable.Cell style={styles.dataTableCell}>Mitigation plan for Raid 1</DataTable.Cell>
          <DataTable.Cell style={styles.dataTableCell}>
            <View style={styles.priorityLow}>
              <Text style={styles.priorityLowText}>Low</Text>
            </View>
          </DataTable.Cell>
          <DataTable.Cell style={styles.dataTableCell}>
            <View style={styles.ownerContainer}>
              {/* <Avatar.Image size={24} source={AppImages.Avator} /> */}
              <Text style={styles.ownerName}>John Doe</Text>
            </View>
          </DataTable.Cell>
          <DataTable.Cell style={styles.dataTableCell}>13/04/2023</DataTable.Cell>
          <DataTable.Cell style={styles.dataTableCell}>
            <View style={styles.badge}>
              <Icon
                name={isActive ? 'circle' : 'circle-outline'}
                size={12}
                color={isActive ? '#027A48' : '#B42318'}
              />
              <Text
                style={[
                  styles.badgeText,
                  isActive ? styles.activeText : styles.inactiveText,
                ]}
              >
                {isActive ? 'Active' : 'Inactive'}
              </Text>
            </View>
          </DataTable.Cell>
          <DataTable.Cell style={styles.dataTableCell}>
            <TouchableOpacity>
              <Icon name="dots-vertical" size={20} color="#667085" />
            </TouchableOpacity>
          </DataTable.Cell>
        </DataTable.Row>
        
        <DataTable.Row>
                 <DataTable.Cell style={styles.dataTableCell}>2</DataTable.Cell>
          <DataTable.Cell style={styles.dataTableCell}>Raid 2</DataTable.Cell>
          <DataTable.Cell style={styles.dataTableCell}>Project Manager 2</DataTable.Cell>
          <DataTable.Cell style={styles.dataTableCell}>Description of Raid 2</DataTable.Cell>
          <DataTable.Cell style={styles.dataTableCell}>Mitigation plan for Raid 2</DataTable.Cell>
          <DataTable.Cell style={styles.dataTableCell}>
            <View style={styles.priorityHigh}>
              <Text style={styles.priorityHighText}>High</Text>
            </View>
          </DataTable.Cell>
          <DataTable.Cell style={styles.dataTableCell}>
            <View style={styles.ownerContainer}>
              {/* <Avatar.Image size={24} source={AppImages.Avator} /> */}
              <Text style={styles.ownerName}>John Doe</Text>
            </View>
          </DataTable.Cell>
          <DataTable.Cell style={styles.dataTableCell}>13/04/2023</DataTable.Cell>
          <DataTable.Cell style={styles.dataTableCell}>
            <View style={styles.badge}>
              <Icon
                name={isActive ? 'circle' : 'circle-outline'}
                size={12}
                color={isActive ? '#B42318' : '#027A48'}
              />
              <Text
                style={[
                  styles.badgeText,
                  isActive ? styles.activeText : styles.inactiveText,
                ]}
              >
                {isActive ? 'Inactive' : 'Active'}
              </Text>
            </View>
          </DataTable.Cell>
          <DataTable.Cell style={styles.dataTableCell}>
            <TouchableOpacity>
              <Icon name="dots-vertical" size={20} color="#667085" />
            </TouchableOpacity>
          </DataTable.Cell>
        </DataTable.Row>
      </DataTable>
    </View>
  );
};

const styles = StyleSheet.create({
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

export default Raid;