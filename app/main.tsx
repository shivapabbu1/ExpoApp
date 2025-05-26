import { useRouter } from "expo-router";
import React from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import employees from "./data/employee.json"; // Adjust the path based on your file structure

export default function MainScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Employee List</Text>
      <View style={styles.tableHeader}>
        <Text style={styles.headerCell}>ID</Text>
        <Text style={styles.headerCell}>Name</Text>
        <Text style={styles.headerCell}>Contact</Text>
        <Text style={styles.headerCell}>Email</Text>
      </View>
      <FlatList
        data={employees}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.tableRow}>
            <Text style={styles.cell}>{item.id}</Text>
            <Pressable
              style={styles.nameCell}
              onPress={() => router.push(`/employee/${item.id}`)}
            >
              <Text style={styles.link}>{item.name}</Text>
            </Pressable>
            <Text style={styles.cell}>{item.contact}</Text>
            <Text style={styles.cell}>{item.email}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 12, alignSelf: "center" },
  tableHeader: { flexDirection: "row", borderBottomWidth: 1, borderColor: "#ccc", paddingBottom: 6 },
  headerCell: { flex: 1, fontWeight: "bold", fontSize: 14 },
  tableRow: { flexDirection: "row", paddingVertical: 8, borderBottomWidth: 1, borderColor: "#f0f0f0" },
  cell: { flex: 1, fontSize: 13 },
  nameCell: { flex: 1 },
  link: { color: "blue", textDecorationLine: "underline", fontSize: 13 },
});
