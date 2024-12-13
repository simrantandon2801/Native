import React from 'react';
import { View, Image, StyleSheet, ScrollView } from 'react-native';
import { AppImages } from '../assets'; // Is path ko verify karein

const RoadMap: React.FC = () => {
  return (
    <View style={styles.container}>
     
        <Image
          source={AppImages.RoadMap}
          style={styles.image}
          resizeMode="contain"
        />
     
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
   
  },
  image: {
    width: '100%',
    height: '100%',
    aspectRatio: 1,
  },
});

export default RoadMap;