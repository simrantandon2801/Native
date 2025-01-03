import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import DatePicker from 'react-native-ui-datepicker';

const NewProjectIntake: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    goal: '',
    program: '',
    businessOwner: '',
    businessOwnerDept: '',
    projectOwner: '',
    projectOwnerDept: '',
    projectManager: '',
    classification: '',
    priority: '',
    budget: '',
    projectSize: '',
    actualBudget: '',
    roi: '',
    startDate: '',
    endDate: '',
    goLiveDate: '',
  });

  const handleInputChange = (key: string, value: string) => {
    setFormData({ ...formData, [key]: value });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>New Project Intake</Text>
      <View style={styles.formSection}>
        {/* Form Fields */}
        <View style={styles.row}>
          <TextInput
            label="Name/Title"
            mode="outlined"
            value={formData.name}
            onChangeText={(value) => handleInputChange('name', value)}
            style={styles.input}
          />
          <TextInput
            label="Goal"
            mode="outlined"
            value={formData.goal}
            onChangeText={(value) => handleInputChange('goal', value)}
            style={styles.input}
          />
          <TextInput
            label="Program"
            mode="outlined"
            value={formData.program}
            onChangeText={(value) => handleInputChange('program', value)}
            style={styles.input}
          />
        </View>

        <View style={styles.row}>
          <TextInput
            label="Business Owner"
            mode="outlined"
            value={formData.businessOwner}
            onChangeText={(value) => handleInputChange('businessOwner', value)}
            style={styles.input}
          />
          <TextInput
            label="Business Owner Department"
            mode="outlined"
            value={formData.businessOwnerDept}
            onChangeText={(value) => handleInputChange('businessOwnerDept', value)}
            style={styles.input}
          />
          <TextInput
            label="Project Owner"
            mode="outlined"
            value={formData.projectOwner}
            onChangeText={(value) => handleInputChange('projectOwner', value)}
            style={styles.input}
          />
        </View>

        <View style={styles.row}>
          <TextInput
            label="Project Owner Department"
            mode="outlined"
            value={formData.projectOwnerDept}
            onChangeText={(value) => handleInputChange('projectOwnerDept', value)}
            style={styles.input}
          />
          <TextInput
            label="Project Manager"
            mode="outlined"
            value={formData.projectManager}
            onChangeText={(value) => handleInputChange('projectManager', value)}
            style={styles.input}
          />
          <TextInput
            label="Classification"
            mode="outlined"
            value={formData.classification}
            onChangeText={(value) => handleInputChange('classification', value)}
            style={styles.input}
          />
        </View>

        {/* Date Pickers */}
        <View style={styles.row}>
          <View style={styles.input}>
            <Text style={styles.dateLabel}>Proposed Start Date</Text>
            <DatePicker
              value={formData.startDate}
              onChange={(date) => handleInputChange('startDate', date.toISOString().split('T')[0])}
              style={styles.datePicker}
              mode="date"
              format="YYYY-MM-DD"
            />
          </View>

          <View style={styles.input}>
            <Text style={styles.dateLabel}>Proposed End Date</Text>
            <DatePicker
              value={formData.endDate}
              onChange={(date) => handleInputChange('endDate', date.toISOString().split('T')[0])}
              style={styles.datePicker}
              mode="date"
              format="YYYY-MM-DD"
            />
          </View>

          <View style={styles.input}>
            <Text style={styles.dateLabel}>Go-Live Date</Text>
            <DatePicker
              value={formData.goLiveDate}
              onChange={(date) => handleInputChange('goLiveDate', date.toISOString().split('T')[0])}
              style={styles.datePicker}
              mode="date"
              format="YYYY-MM-DD"
            />
          </View>
        </View>
      </View>

      <Button mode="contained" onPress={() => console.log(formData)} style={styles.submitButton}>
        Submit
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  formSection: {
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  input: {
    flex: 1,
    marginHorizontal: 8,
  },
  dateLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  datePicker: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    width: '100%',
  },
  submitButton: {
    marginTop: 16,
  },
});

export default NewProjectIntake;
