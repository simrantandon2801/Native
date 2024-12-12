import React, { useEffect, useState } from 'react';
import { Modal, StyleSheet, View, TextInput, Dimensions, Text, TouchableOpacity, Pressable } from 'react-native';
import ForgeLogo from '../assets/images/small-logo.svg'; // Assuming this is an SVG
import SearchLogo from '../assets/images/search-logo.svg'; // Assuming this is an SVG
import MoreLinesLogo from '../assets/images/ri-more-line.svg'; // Assuming this is an SVG
import NotificationLogo from '../assets/images/notification.svg'; // Assuming this is an SVG
import ProfileLogo from '../assets/images/Ellipse 34.svg'; // Assuming this is an SVG
import { decodeBase64 } from '../core/securedata';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'; 
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeStackNavigatorParamList } from '../../type';
import LoginScreen from '../screens/LoginScreen';
import { navigate } from '../navigations/RootNavigation';
import Ionicons from 'react-native-vector-icons/Ionicons';


export type HeaderNavigationProp = NativeStackScreenProps<HomeStackNavigatorParamList, 'Main'>;

const Header: React.FC<HeaderNavigationProp> = ({ navigation }) => {
  const handleNavigate = () => {
    navigation.navigate('Main');
  };
  const [UserType, setUserType] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false); 
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const getUserId = async () => {
      try {
        const UserTypes = decodeBase64(
          (await AsyncStorage.getItem('UserType')) ?? '',
        );
        if (UserTypes) {
          setUserType(UserTypes);
        }
      } catch (error) {
        console.error('Error retrieving user ID from AsyncStorage', error);
      }
    };

    getUserId();

    const updateLayout = () => {
      const { width } = Dimensions.get('window');
      setIsSmallScreen(width < 800);
    };

    updateLayout();
    const subscription = Dimensions.addEventListener('change', updateLayout);
    return () => {
      subscription.remove();
    };
  }, []);

  const handleProfilePress = () => {
    // Show the modal when profile icon is clicked
    setModalVisible(true);
  };

  const handleLogout = async () => {
    // Logout logic
    await AsyncStorage.clear();
    setUserType(null);
 navigate(LoginScreen)
      //navigation.navigate();
  
    setModalVisible(false);
  };

  return (
    <>
    <View style={styles.headerContainer}>
      <View style={styles.leftContainer}>
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => navigate('Main', { screen: 'Adminpanel' })}
      >
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
        {/* <ForgeLogo width={30} height={30} /> */}
      </View>

      <View style={styles.centerContainer}>
        <View style={styles.searchInputContainer}>
          {/* <SearchLogo /> */}
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
        <TouchableOpacity onPress={handleProfilePress}>
          <ProfileLogo style={styles.icon} />
        </TouchableOpacity>
      </View>

      {/* Modal for profile options */}
      <Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.optionsContainer}>
            <Text style={styles.greetingText}>Hello, {UserType}</Text>

           {/*  <TouchableOpacity
              onPress={() => {
                navigation.navigate('ManageZonalRegulation');
                setModalVisible(false);
              }}
              style={styles.option}
            >
              <MaterialCommunityIcons name="account" size={20} color="#007AFF" />
              <Text style={styles.linkText}>Dashboard</Text>
            </TouchableOpacity> */}

           <TouchableOpacity
              onPress={() => {
                //navigation.navigate('ProfileScreen');
                setModalVisible(false);
              }}
              style={styles.option}
            >
              <MaterialCommunityIcons name="account" size={20} color="#007AFF" />
              <Text style={styles.linkText}>View Profile</Text>
            </TouchableOpacity> 

            <TouchableOpacity
              onPress={() => {
                //navigation.navigate('EditProfileScreen');
                setModalVisible(false);
              }}
              style={styles.option}
            > 
               <MaterialCommunityIcons name="account-edit" size={20} color="#007AFF" />
              <Text style={styles.linkText}>Edit Profile</Text>
            </TouchableOpacity>
 
          {/*   <TouchableOpacity
              onPress={() => {
                navigation.navigate('ChangePasswordScreen');
                setModalVisible(false);
              }}
              style={styles.option}
            >
              <MaterialCommunityIcons name="lock" size={20} color="#007AFF" />
              <Text style={styles.linkText}>Change Password</Text>
            </TouchableOpacity> */}

            <TouchableOpacity onPress={handleLogout} style={styles.option}>
              <MaterialCommunityIcons name="logout" size={20} color="#007AFF" />
              <Text style={styles.linkText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
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
    top: 2,
    alignItems: 'flex-start',  
    justifyContent: 'flex-start', 
    padding: 10, 
  },
  centerContainer: {
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute', 
    left: 10, 
    top: '50%', 
    transform: [{ translateY: -12 }], 
  },
  rightContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
    paddingHorizontal: 10,
    borderWidth: 1,
    //borderRadius: 20,
    borderColor: '#ccc',
    backgroundColor: '#fff',
  },
  searchInput: {
    flex: 1,
    paddingVertical: 5,
    fontSize: 16,
   
    
  },
  icon: {
    marginLeft: 15,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  optionsContainer: {
    position: 'absolute',
    top: 65,
    right: 10,
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    //elevation: 4,
    minWidth: 180,
    zIndex: 10,
  },
  greetingText: {
    fontSize: 16,
    paddingVertical: 10,
    color: 'black',
    textAlign: 'center',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  linkText: {
    fontSize: 16,
    paddingVertical: 5,
    color: 'black',
    textDecorationLine: 'underline',
    marginLeft: 10,
    zIndex: -1,
  },
});

export default Header;
