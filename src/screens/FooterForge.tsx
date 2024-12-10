import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const FooterForge: React.FC = () => {
  function handleLinkPress(arg0: string): void {
    throw new Error('Function not implemented.');
  }

  return (

    
    <View style={styles.footerContainer}>
      <Text style={styles.footerText}>
        © 2024. All Rights Reserved |{' '}
        <TouchableOpacity onPress={() => handleLinkPress('https://yourwebsite.com/terms')}>
          <Text style={styles.link}>Terms and Conditions</Text>
        </TouchableOpacity>{' '}
        |{' '}
        <TouchableOpacity onPress={() => handleLinkPress('https://yourwebsite.com/contact')}>
          <Text style={styles.link}>Contact Us</Text>
        </TouchableOpacity>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  footerContainer: {
    marginTop: 30,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    fontFamily: '"Source Sans Pro"',
  },
  link: {
    color: '#0056b3',
    textDecorationLine: 'underline',
    fontFamily: '"Source Sans Pro"',
  },
});

export default FooterForge;