import { Stack } from 'expo-router';
import React from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import Toolbar from './components/Toolbar';
import { Colors } from './constants/Colors';

export default function RootLayout() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.surface} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: Colors.background },
        }}
      />
      <Toolbar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
});