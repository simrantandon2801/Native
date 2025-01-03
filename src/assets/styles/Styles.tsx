// useStyles.js
import {StyleSheet} from 'react-native';
import {theme} from './theme';
const useStyles = StyleSheet.create({
  container: {
    padding: theme.spacing.medium,
    backgroundColor: theme.colors.background,
    flex: 1,
  },
  label: {
    marginBottom: theme.spacing.small,
    fontSize: 16,
    color: theme.colors.text,
    fontWeight: '600',
  },
  input: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.small,
    paddingHorizontal: theme.spacing.smallx,
    marginBottom: theme.spacing.medium,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.medium,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.small,
    marginRight: theme.spacing.small,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxInner: {
    width: 12,
    height: 12,
    backgroundColor: theme.colors.primary,
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.medium,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.small,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: theme.colors.primary,
  },
  dropdown: {
    height: 48,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.small,
    marginBottom: theme.spacing.medium,
    paddingHorizontal: theme.spacing.small,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.medium,
  },
  button: {
    height: 48,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    // marginVertical: 8,
    backgroundColor: theme.colors.buttoms, //'#6200ee',
    marginBottom: theme.spacing.medium,
  },
  containedButton: {
    backgroundColor: '#6200ee',
  },
  outlinedButton: {
    borderWidth: 1,
    borderColor: '#6200ee',
    backgroundColor: 'transparent',
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  containedButtonText: {
    color: '#ffffff',
  },
  outlinedButtonText: {
    color: '#6200ee',
  },
  disabledButtonText: {
    color: '#d1d1d1',
  },
  errorInput: {
    borderColor: '#B00020',
  },
  errorText: {
    fontSize: 12,
    color: '#B00020',
    marginBottom: 8,
  },
  suggestionsContainer: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
  },
  suggestionItem: {
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  suggestionText: {
    fontSize: 14,
  },
  menuItemsContainer: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 10,
  },
  menuItem: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  menuItemText: {
    fontSize: 16,
    color: 'green',
    letterSpacing: 1,
  },
  menuContainer: {
    padding: 10,
    backgroundColor: '#fff',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    //backgroundColor: '#fff',
    borderRadius: 8,
    padding: 5,
    //elevation: 2, // Shadow for Android
    //shadowColor: '#000', // Shadow for iOS
    //shadowOpacity: 0.1,
    //shadowRadius: 5,
    //shadowOffset: {width: 0, height: 2},
  },
  spaceControls: {
    marginLeft: 10, // Space between shadowed items
    marginRight: 10, // Space between shadowed items
  },
  divider: {
    borderBottomWidth: 10,
    borderBottomColor: 'white', // Light border color between items
  },
});

export default useStyles;
