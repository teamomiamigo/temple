import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from './constants/theme';
import { AppNavigator } from './navigation/AppNavigator';

export default function App() {
  try {
    return <AppNavigator />;
  } catch (error) {
    console.error('App render error:', error);
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>Temple App</Text>
        <Text style={styles.errorText}>Error loading app. Check console for details.</Text>
        <Text style={styles.errorDetails}>{error?.toString()}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    padding: 20,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 16,
  },
  errorDetails: {
    fontSize: 12,
    color: colors.textMuted,
    textAlign: 'center',
  },
}); 