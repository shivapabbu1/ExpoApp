import { useRouter } from "expo-router";
import React from "react";
import { Button, StyleSheet, View } from "react-native";

export default function Toolbar() {
  const router = useRouter();

  return (
    <View style={styles.toolbar}>
      <Button title="Home" onPress={() => router.replace("/")} />
      <Button title="Employee List" onPress={() => router.replace("/main")} />
      <Button title="Verify" onPress={() => router.replace("/verify")} />
    </View>
  );
}

const styles = StyleSheet.create({
  toolbar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 8,
  },
});
