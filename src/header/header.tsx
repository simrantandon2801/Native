import React from 'react';
import { StyleSheet, View, TextInput } from 'react-native';
import ForgeLogo from '../assets/images/small-logo.svg'; // Assuming this is an SVG
import SearchLogo from '../assets/images/search-logo.svg'; // Assuming this is an SVG
import MoreLinesLogo from '../assets/images/ri-more-line.svg'; // Assuming this is an SVG
import NotificationLogo from '../assets/images/notification.svg'; // Assuming this is an SVG
import ProfileLogo from '../assets/images/Ellipse 34.svg'; // Assuming this is an SVG

const Header = () => {
  return (
    <>
    <View style={styles.headerContainer}>
      <View style={styles.leftContainer}>
        <ForgeLogo width={30} height={30} />
      </View>

      <View style={styles.centerContainer}>
        <View style={styles.searchInputContainer}>
          <SearchLogo />
          <TextInput
            style={styles.searchInput}
            placeholder="Search any Project"
            placeholderTextColor="#757575"
          />
        </View>
      </View>

      <View style={styles.rightContainer}>
        <MoreLinesLogo style={styles.icon} />
        <NotificationLogo style={styles.icon} />
        <ProfileLogo style={styles.icon} />
      </View>
    </View>
    
    </>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
  },
  leftContainer: {
    flex: 1,
  },
  centerContainer: {
    
    alignItems: 'center',
  },
  rightContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '80%',
    paddingHorizontal: 10,
    borderWidth: 1,
    borderRadius: 20,
    borderColor: '#ccc',
    backgroundColor: '#fff',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1, 
    paddingVertical: 5,
    fontSize: 16,
  },
  icon: {
    marginLeft: 15, 
  },

  
});

export default Header;
