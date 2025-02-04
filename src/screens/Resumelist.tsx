import React from 'react';
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
  
  console.log("=======================================================", data);

  return (
    <SafeAreaView style={styles.container}>
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
  }
});

export default Resumelist;
