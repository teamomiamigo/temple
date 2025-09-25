import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
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
    backgroundColor: '#000',
    padding: 20,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  errorText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginBottom: 16,
  },
  errorDetails: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
}); 