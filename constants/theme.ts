export const colors = {
  // Primary neutral colors
  primary: '#FFFFFF', // Pure white for primary elements
  secondary: '#F5F5F5', // Light grey for secondary elements
  tertiary: '#E0E0E0', // Medium light grey
  
  // Background colors
  background: '#000000', // Pure black background
  backgroundSecondary: '#111111', // Dark grey for cards/containers
  backgroundTertiary: '#1A1A1A', // Slightly lighter dark grey
  
  // Text colors
  text: '#FFFFFF', // Pure white text
  textSecondary: '#CCCCCC', // Light grey text
  textTertiary: '#999999', // Medium grey text
  textMuted: '#666666', // Dark grey text
  
  // Border and divider colors
  border: '#333333', // Dark grey borders
  borderLight: '#444444', // Lighter grey borders
  divider: '#2A2A2A', // Divider lines
  
  // Glass effect colors
  glassBackground: 'rgba(255, 255, 255, 0.05)', // Very subtle white overlay
  glassBorder: 'rgba(255, 255, 255, 0.1)', // Subtle white border
  glassShadow: 'rgba(0, 0, 0, 0.3)', // Black shadow for depth
  
  // Status colors (minimal, neutral)
  success: '#FFFFFF', // White for success states
  error: '#CCCCCC', // Light grey for error states
  warning: '#999999', // Medium grey for warning states
  
  // Interactive states
  pressed: 'rgba(255, 255, 255, 0.1)', // White overlay when pressed
  hover: 'rgba(255, 255, 255, 0.05)', // Subtle white overlay on hover
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const typography = {
  h1: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  h2: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  h3: {
    fontSize: 20,
    fontWeight: '600',
  },
  body: {
    fontSize: 16,
  },
  caption: {
    fontSize: 14,
    color: colors.textSecondary,
  },
};

export const shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 8,
  },
  glass: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
}; 