import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import EmployeeCard from './components/EmployeeCard';
import { Colors } from './constants/Colors';
import employees from './data/employee.json';

interface Employee {
  id: string;
  name: string;
  contact: string;
  email: string;
}

export default function MainScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>(employees);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredEmployees(employees);
    } else {
      const filtered = employees.filter(employee =>
        employee.name.toLowerCase().includes(query.toLowerCase()) ||
        employee.email.toLowerCase().includes(query.toLowerCase()) ||
        employee.contact.includes(query) ||
        employee.id.includes(query)
      );
      setFilteredEmployees(filtered);
    }
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.title}>Employee Directory</Text>
      <Text style={styles.subtitle}>{filteredEmployees.length} employees</Text>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search employees..."
          placeholderTextColor={Colors.textLight}
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateIcon}>🔍</Text>
      <Text style={styles.emptyStateTitle}>No employees found</Text>
      <Text style={styles.emptyStateText}>
        Try adjusting your search terms
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredEmployees}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <EmployeeCard employee={item} />}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  listContainer: {
    paddingBottom: 20,
  },
  header: {
    padding: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 20,
  },
  searchContainer: {
    marginBottom: 8,
  },
  searchInput: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyStateIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});