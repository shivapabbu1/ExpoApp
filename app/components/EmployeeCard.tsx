import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Colors } from '../constants/Colors';

interface Employee {
  id: string;
  name: string;
  contact: string;
  email: string;
}

interface EmployeeCardProps {
  employee: Employee;
}

export default function EmployeeCard({ employee }: EmployeeCardProps) {
  const router = useRouter();

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        pressed && styles.cardPressed
      ]}
      onPress={() => router.push(`/employee/${employee.id}`)}
    >
      <View style={styles.header}>
        <Text style={styles.name}>{employee.name}</Text>
        <Text style={styles.id}>#{employee.id}</Text>
      </View>
      <View style={styles.details}>
        <Text style={styles.contact}>{employee.contact}</Text>
        <Text style={styles.email}>{employee.email}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginVertical: 6,
    marginHorizontal: 16,
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardPressed: {
    backgroundColor: Colors.surfaceSecondary,
    transform: [{ scale: 0.98 }],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    flex: 1,
  },
  id: {
    fontSize: 14,
    color: Colors.textSecondary,
    backgroundColor: Colors.surfaceSecondary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  details: {
    gap: 4,
  },
  contact: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  email: {
    fontSize: 14,
    color: Colors.primary,
  },
});
