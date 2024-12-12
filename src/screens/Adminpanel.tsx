
import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { AppImages } from '../assets';

interface GridItem {
  id: string;
  image: any; // Using 'any' type for image source
  text: string;
}

const gridData: GridItem[] = [
  { id: '1', image: AppImages.Frame, text: 'Manage Company' },
  { id: '2', image: AppImages.Goal, text: 'Manage Goals' },
  { id: '3', image: AppImages.Program, text: 'Manage Programs' },
  { id: '4', image: AppImages.ManageP, text: 'Manage Departments' },
  { id: '5', image: AppImages.USers, text: 'Manage Users' },
  { id: '6', image: AppImages.RoleM, text: 'Role Master' },
  { id: '7', image: AppImages.Imtegration, text: 'Manage Integration' },
  { id: '8', image: AppImages.Field, text: 'Edit Field Labels' },
  { id: '9', image: AppImages.license, text: 'License details' },
  { id: '10', image: AppImages.Module, text: 'Modules' },
];

const Adminpanel: React.FC = () => {
  const renderGridRow = (startIndex: number, endIndex: number) => {
    return (
      <View style={styles.gridRow}>
        {gridData.slice(startIndex, endIndex).map((item) => (
          <TouchableOpacity key={item.id} style={styles.card}>
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
      <View style={styles.grid}>
        {renderGridRow(0, 4)}
        {renderGridRow(4, 8)}
        {renderGridRow(8, 10)}
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
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  card: {
    width: 200, // Adjust this value to control card width and spacing
    aspectRatio: 1.25, // This will make the height 80% of the width
    margin: '1.5%', // This adds space between cards
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
