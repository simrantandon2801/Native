
import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { AppImages } from '../assets';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface GridItem {
  id: string;
  image: any; // Using 'any' type for image source
  text: string;
  component:string
}

const gridData: GridItem[] = [
  { id: '1', image: AppImages.Frame, text: 'Manage Company', component: 'intakeform' },
  { id: '2', image: AppImages.ManageP, text: 'Manage Departments', component: 'DepartmentList'  },
  { id: '3', image: AppImages.Imtegration, text: 'Manage AD Integration', component: 'ADIntegrationList'  },
  { id: '4', image: AppImages.Module, text: 'Manage Resources', component: 'Resources'  },
  { id: '5', image: AppImages.USers, text: 'Manage Users', component: 'ManageUsers'  },
  { id: '6', image: AppImages.RoleM, text: 'Role Master', component: 'RoleMaster' },
  { id: '7', image: AppImages.Goal, text: 'Manage Goals', component: 'ManageGoals'  },
  { id: '8', image: AppImages.Program, text: 'Manage Programs', component: 'ManagePrograms'  },
  { id: '10', image: AppImages.Field, text: 'Edit Field Labels', component: 'ManageCompany'  },
  { id: '9', image: AppImages.license, text: 'License details', component: 'BinaryTree'  }, 
  { id: '11', image: AppImages.Imtegration, text: 'Manage PPM Integration', component: 'PPMIntegrationList'  },
  { id: '12', image: AppImages.Applications, text: 'Impacted Applications', component: 'ImpactedApps'  },
  { id: '13', image: AppImages.Classification, text: 'Manage Classification', component: 'Classification'  },
  { id: '14', image: AppImages.Classification, text: 'Manage Designation', component: 'Designation'  },
];

const Adminpanel: React.FC = () => {
    const navigation = useNavigation();
  const renderGridRow = (startIndex: number, endIndex: number) => {
    return (
      <View style={styles.gridRow}>
        {gridData.slice(startIndex, endIndex).map((item) => (
          <TouchableOpacity key={item.id} style={styles.card}
          onPress={() => navigation.navigate(item.component as never)}>
            <View style={styles.cardContent}>
              <Image source={item.image} style={styles.image} />
              <Text style={styles.text}>{item.text}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.heading}>Admin Panel</Text>
      <View style={styles.grid}>
        {renderGridRow(0, 5)}
        {renderGridRow(5, 10)}
        {renderGridRow(10, 15)}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  grid: {
    padding: 10,
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    fontFamily:'outfit',
    marginVertical: 20,
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  card: {
    width: 200, 
    aspectRatio: 1.25, 
    margin: '1.5%', 
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  image: {
    width: 40,
    height: 40,
    marginBottom: 10,
    resizeMode: 'contain',
  },
  text: {
    color: '#044086',
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default Adminpanel;
