import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to the Employee Directory App!</Text>
      <Text style={styles.info}>
        This app helps you manage and view employee information easily.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 16 },
  info: { fontSize: 16, textAlign: "center", marginBottom: 24 },
});
