import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export const TempleScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Temple</Text>
      <Text style={styles.subtitle}>Meditation & mindfulness</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
}); 