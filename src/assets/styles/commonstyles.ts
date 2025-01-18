import { StyleSheet } from 'react-native';
import { colors } from './colors';
import { dimensions } from '../styles/dimension';

export const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    height: 50,
    backgroundColor: colors.white,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    color: colors.gray[800],
    borderWidth: 1,
    borderColor: colors.gray[300],
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.gray[700],
    marginBottom: 8,
  },
  button: {
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
 
    fontSize: 14,
    marginTop: 8,
  },
  shadow: {
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  
});

