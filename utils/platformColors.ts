import { Platform } from 'react-native';

// Platform color utility that works with react-native-web
export const PlatformColors = {
  // System colors
  systemBackground: Platform.select({
    ios: Platform.OS === 'ios' ? '#ffffff' : undefined,
    android: '#ffffff',
    web: '#ffffff',
    default: '#ffffff',
  }),
  
  systemGroupedBackground: Platform.select({
    ios: Platform.OS === 'ios' ? '#f2f2f7' : undefined,
    android: '#f2f2f7',
    web: '#f2f2f7',
    default: '#f2f2f7',
  }),
  
  systemGray5: Platform.select({
    ios: Platform.OS === 'ios' ? '#e5e5ea' : undefined,
    android: '#e5e5ea',
    web: '#e5e5ea',
    default: '#e5e5ea',
  }),
  
  systemGray6: Platform.select({
    ios: Platform.OS === 'ios' ? '#f2f2f7' : undefined,
    android: '#f2f2f7',
    web: '#f2f2f7',
    default: '#f2f2f7',
  }),
  
  // Text colors
  label: Platform.select({
    ios: Platform.OS === 'ios' ? '#000000' : undefined,
    android: '#000000',
    web: '#000000',
    default: '#000000',
  }),
  
  secondaryLabel: Platform.select({
    ios: Platform.OS === 'ios' ? '#8e8e93' : undefined,
    android: '#8e8e93',
    web: '#8e8e93',
    default: '#8e8e93',
  }),
  
  tertiaryLabel: Platform.select({
    ios: Platform.OS === 'ios' ? '#c7c7cc' : undefined,
    android: '#c7c7cc',
    web: '#c7c7cc',
    default: '#c7c7cc',
  }),
  
  // Accent colors
  systemBlue: Platform.select({
    ios: Platform.OS === 'ios' ? '#007AFF' : undefined,
    android: '#007AFF',
    web: '#007AFF',
    default: '#007AFF',
  }),
};

// Helper function to get platform color safely
export const getPlatformColor = (colorName: keyof typeof PlatformColors): string => {
  return PlatformColors[colorName] || '#000000';
};
