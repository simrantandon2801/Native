import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const StakeholdersForm = () => {
  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.stakeholdersContainer} 
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heading}>
          <Text style={styles.headingText}>Intake Stakeholders</Text>
        </View>

        {/* Row 1 */}
        <View style={styles.inputRow}>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>
              Project Owner <Text style={styles.required}>*</Text>
            </Text>
            <Picker
              style={styles.input}
              onValueChange={(itemValue) => console.log(itemValue)}
            >
              <Picker.Item label="Select Project Owner" value="" />
              <Picker.Item label="John Doe" value="john" />
              <Picker.Item label="Jane Smith" value="jane" />
              <Picker.Item label="Mike Johnson" value="mike" />
            </Picker>
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>
              Business Owner <Text style={styles.required}>*</Text>
            </Text>
            <Picker
              style={styles.input}
              onValueChange={(itemValue) => console.log(itemValue)}
            >
              <Picker.Item label="Select Business Tower" value="" />
              <Picker.Item label="Option 1" value="option1" />
              <Picker.Item label="Option 2" value="option2" />
              <Picker.Item label="Option 3" value="option3" />
            </Picker>
          </View>
        </View>

        {/* Row 2 */}
        <View style={styles.inputRow}>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>
              Impacted Function <Text style={styles.required}>*</Text>
            </Text>
            <Picker
              style={styles.input}
              onValueChange={(itemValue) => console.log(itemValue)}
            >
              <Picker.Item label="Select Impacted Function" value="" />
              <Picker.Item label="Option 1" value="option1" />
              <Picker.Item label="Option 2" value="option2" />
              <Picker.Item label="Option 3" value="option3" />
            </Picker>
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>
              Impacted Application <Text style={styles.required}>*</Text>
            </Text>
            <Picker
              style={styles.input}
              onValueChange={(itemValue) => console.log(itemValue)}
            >
              <Picker.Item label="Select Impacted Application" value="" />
              <Picker.Item label="Option 1" value="option1" />
              <Picker.Item label="Option 2" value="option2" />
              <Picker.Item label="Option 3" value="option3" />
            </Picker>
          </View>
        </View>

        {/* Row 3 */}
        <View style={styles.inputRow}>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>
              Project Manager <Text style={styles.required}>*</Text>
            </Text>
            <Picker
              style={styles.input}
              onValueChange={(itemValue) => console.log(itemValue)}
            >
              <Picker.Item label="Select Project Manager" value="" />
              <Picker.Item label="John Doe" value="john" />
              <Picker.Item label="Jane Smith" value="jane" />
              <Picker.Item label="Mike Johnson" value="mike" />
            </Picker>
          </View>
        </View>

        {/* Approval Button */}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  stakeholdersContainer: {
    flex: 1,
    width: '100%',
  },
  scrollViewContent: {
    padding: 20,
    paddingLeft: 200,
    paddingRight: 200,
  },
  heading: {
    marginBottom: 20,
  },
  headingText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000',
    textAlign: 'center',
    fontFamily: 'Outfit',
    marginTop: 20,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#C4C4C4',
    width: '100%',
  },
  inputContainer: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    color: '#000',
  },
  required: {
    color: 'red',
  },
  input: {
    display: 'flex',
    width: '100%',
    height: 40,
    paddingLeft: 8,
    paddingRight: 10,
    paddingTop: 10,
    justifyContent: 'center',
    alignItems: 'flex-start',
    borderRadius: 5,
    fontSize: 16,
    backgroundColor: 'white',
    color: '#000',
    borderBottomWidth: 1.5,
    borderBottomColor: '#044086',
    borderWidth: 0,
  },
});

export default StakeholdersForm;

