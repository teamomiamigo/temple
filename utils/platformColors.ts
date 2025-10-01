import { Platform } from 'react-native';

// Platform color utility that works with react-native-web
export const PlatformColors = {
  // System colors - neutral theme
  systemBackground: Platform.select({
    ios: Platform.OS === 'ios' ? '#000000' : undefined,
    android: '#000000',
    web: '#000000',
    default: '#000000',
  }),
  
  systemGroupedBackground: Platform.select({
    ios: Platform.OS === 'ios' ? '#111111' : undefined,
    android: '#111111',
    web: '#111111',
    default: '#111111',
  }),
  
  systemGray5: Platform.select({
    ios: Platform.OS === 'ios' ? '#333333' : undefined,
    android: '#333333',
    web: '#333333',
    default: '#333333',
  }),
  
  systemGray6: Platform.select({
    ios: Platform.OS === 'ios' ? '#1A1A1A' : undefined,
    android: '#1A1A1A',
    web: '#1A1A1A',
    default: '#1A1A1A',
  }),
  
  // Text colors - neutral theme
  label: Platform.select({
    ios: Platform.OS === 'ios' ? '#FFFFFF' : undefined,
    android: '#FFFFFF',
    web: '#FFFFFF',
    default: '#FFFFFF',
  }),
  
  secondaryLabel: Platform.select({
    ios: Platform.OS === 'ios' ? '#CCCCCC' : undefined,
    android: '#CCCCCC',
    web: '#CCCCCC',
    default: '#CCCCCC',
  }),
  
  tertiaryLabel: Platform.select({
    ios: Platform.OS === 'ios' ? '#999999' : undefined,
    android: '#999999',
    web: '#999999',
    default: '#999999',
  }),
  
  // Accent colors - neutral theme
  systemBlue: Platform.select({
    ios: Platform.OS === 'ios' ? '#FFFFFF' : undefined,
    android: '#FFFFFF',
    web: '#FFFFFF',
    default: '#FFFFFF',
  }),
};

// Helper function to get platform color safely
export const getPlatformColor = (colorName: keyof typeof PlatformColors): string => {
  return PlatformColors[colorName] || '#000000';
};
