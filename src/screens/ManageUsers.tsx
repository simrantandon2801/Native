import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput } from 'react-native';
import { IconButton } from 'react-native-paper';

const ManageUsers = () => {
  return (
    <>

      {/* Manage Users Section */}
      <View style={styles.manageUsersContainer}>
        <Text style={styles.heading}>Manage Users</Text>
      </View>

      {/* Action Bar */}
      <View style={styles.actions}>
        <TouchableOpacity style={[styles.actionButton, styles.leftAction]}>
          <IconButton icon="trash-can-outline" size={16} color="#344054" />
          <Text style={[styles.actionText, { color: '#344054' }]}>Delete</Text>
        </TouchableOpacity>
        <View style={styles.middleActions}>
          <TouchableOpacity style={styles.actionButton}>
            <IconButton icon="plus" size={16} color="#044086" />
            <Text style={[styles.actionText, { color: '#044086' }]}>Add User</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <IconButton icon="table-column-plus-after" size={16} color="#044086" />
            <Text style={[styles.actionText, { color: '#044086' }]}>Set Columns</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <IconButton icon="sync" size={16} color="#044086" />
            <Text style={[styles.actionText, { color: '#044086' }]}>Sync AD</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={[styles.actionButton, styles.rightAction]}>
          <IconButton icon="filter" size={16} color="#344054" />
          <Text style={[styles.actionText, { color: '#344054' }]}>Filters</Text>
        </TouchableOpacity>
      </View>

      {/* Table Section */}
      <View style={styles.table}>
        {/* Table Header */}
        <View style={styles.tableRow}>
          <Text style={[styles.tableHeaderCell, styles.center]}>S. No.</Text>
          <Text style={styles.tableHeaderCell}>Name</Text>
          <Text style={styles.tableHeaderCell}>Designation</Text>
          <Text style={styles.tableHeaderCell}>Role</Text>
          <Text style={styles.tableHeaderCell}>Email ID</Text>
          <Text style={styles.tableHeaderCell}>Department</Text>
          <Text style={styles.tableHeaderCell}>Reporting Manager</Text>
          <Text style={[styles.tableHeaderCell, styles.center]}>Projects Active</Text>
          <Text style={[styles.tableHeaderCell, styles.center]}>Approval Limit</Text>
        </View>

        {/* Table Rows */}
        {[
          {
            id: 1,
            name: 'Marcus',
            designation: 'CEO',
            role: 'Project Mgr',
            email: 'xyz@corporate.com',
            department: 'US Projects > Development',
            manager: 'John Doe',
            projects: 1,
            approval: '$100,000',
          },
          {
            id: 2,
            name: 'John Wick',
            designation: 'Director',
            role: 'Project Member',
            email: 'xyz@corporate.com',
            department: 'US Projects > Development',
            manager: 'John Doe',
            projects: 5,
            approval: '$100,000',
          },
          {
            id: 3,
            name: 'Alexander Jonathan',
            designation: 'G.M.',
            role: 'H.R.',
            email: 'xyzmanager@corporate.com',
            department: 'US Projects > Development',
            manager: 'John Doe',
            projects: 7,
            approval: '$100,000',
          },
        ].map((user, index) => (
  <View style={styles.tableRow} key={user.id}>
    <Text style={[styles.tableCell, styles.center]}>{index + 1}</Text>
    <Text style={styles.tableCell}>{user.name}</Text>
    <Text style={styles.tableCell}>{user.designation}</Text>
    <Text style={styles.tableCell}>{user.role}</Text>
    <Text style={styles.emailCell}>{user.email}</Text>
    <Text style={styles.departmentCell}>{user.department}</Text>
    <Text style={styles.tableCell}>{user.manager}</Text>
    <Text style={[styles.tableCell, styles.center]}>{user.projects}</Text>
    <Text style={[styles.tableCell, styles.center]}>{user.approval}</Text>
  </View>
        ))}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  manageUsersContainer: {
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: '#f4f4f4',
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#f4f4f4',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  actionText: {
    fontSize: 14,
  },
  middleActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    flex: 1,
  },
  leftAction: {
    marginRight: 10,
  },
  rightAction: {
    marginLeft: 10,
  },
  table: {
    marginTop: 10,
    paddingHorizontal: 10,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    
  },
  tableHeaderCell: {
    flex: 1,
    fontWeight: 'bold',
    fontSize: 14,
    color: '#757575'
  },
  tableCell: {
    flex: 1,
    fontSize: 14,
  },
  center: {
    textAlign: 'center',
  },
  emailCell: {
    flex: 1,
    fontSize: 14,
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
  },
  departmentCell: {
    flex: 1,
    fontSize: 14,
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
  },
});

export default ManageUsers;
