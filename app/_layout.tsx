import { Stack } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";
import Toolbar from "./components/Toolbar";

export default function RootLayout() {
  return (
    <View style={styles.container}>
      <Stack screenOptions={{ headerShown: false }} />
      <Toolbar/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
