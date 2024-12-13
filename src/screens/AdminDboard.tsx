import React from 'react';
import { View, Image, StyleSheet, ScrollView } from 'react-native';
import { AppImages } from '../assets';  // Is path ko verify karein

const AdminDboard: React.FC = () => {
  return (
    <View style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        <Image
          source={AppImages.Dashboard}
          style={styles.image}
          resizeMode="contain"
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#f5f5f5',
    marginTop:-30
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
   
  },
  image: {
    width: '90%',
    height: '90%',
    aspectRatio: 1,
  },
});

export default AdminDboard;