import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute } from '@react-navigation/native';

interface Section {
  sectionName: string;
  submittedFlag: boolean;
  updatedBy: number | null;  
  createdBy: null;          
  regSectionUrl: string;
  sectionId: number;
  updatedOn: string;
  createdOn: string;
  activeFlag: boolean;
}

const Resumelist: React.FC = () => {
  const route = useRoute();
  const { data } = route.params;

  // Initialize the state with 'forward' to select "Forward to NHB" by default
  const [selectedOption, setSelectedOption] = useState<string>('forward');

  console.log("=======================================================", data);

  return (
    <SafeAreaView style={styles.container}>
      {/* Scrollable List */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {data.map((section) => (
          <TouchableOpacity
            key={section.sectionId}
            style={[
              styles.sectionItem,
              { borderLeftWidth: 4, borderLeftColor: section.submittedFlag ? '#4CAF50' : 'red' } 
            ]}
          >
            <View style={styles.sectionContent}>
              <Text style={styles.sectionName}>{section.sectionName}</Text>
            </View>
          </TouchableOpacity>
        ))}


        <View style={styles.radioContainer}>
          <TouchableOpacity
            style={styles.radioButton}
            onPress={() => setSelectedOption('forward')}
          >
            <View style={styles.radioButtonCircle}>
              {selectedOption === 'forward' && <View style={styles.radioButtonInnerCircle} />}
            </View>
            <Text style={styles.radioButtonLabel}>Forward to NHB</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.radioButton}
            onPress={() => setSelectedOption('sendBack')}
          >
            <View style={styles.radioButtonCircle}>
              {selectedOption === 'sendBack' && <View style={styles.radioButtonInnerCircle} />}
            </View>
            <Text style={styles.radioButtonLabel}>Send Back to Applicant for Clarification</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    padding: 16,
  },
  sectionItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionContent: {
    flex: 1,
  },
  sectionName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  radioContainer: {
    marginTop: 16,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    // backgroundColor: '#fff',
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  radioButtonCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#333',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButtonInnerCircle: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: '#333',
  },
  radioButtonLabel: {
    marginLeft: 8,
    fontSize: 16,
    color: '#333',
  },
});

export default Resumelist;