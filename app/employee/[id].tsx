import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import QRCodeGenerator from '../components/QRCodeGenerator';
import { Colors } from '../constants/Colors';
import employees from '../data/employee.json';

export default function EmployeeDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const employee = employees.find(emp => emp.id === id);

  if (!employee) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorTitle}>Employee Not Found</Text>
          <Text style={styles.errorText}>
            The requested employee could not be found in the directory.
          </Text>
          <Pressable
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backIcon}>←</Text>
          <Text style={styles.backText}>Back</Text>
        </Pressable>
      </View>

      <View style={styles.profileContainer}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {employee.name.split(' ').map(n => n[0]).join('').toUpperCase()}
          </Text>
        </View>
        <Text style={styles.name}>{employee.name}</Text>
        <Text style={styles.employeeId}>Employee ID: {employee.id}</Text>
      </View>

      <View style={styles.detailsContainer}>
        <View style={styles.detailCard}>
          <Text style={styles.detailLabel}>Contact Information</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailIcon}>✉️</Text>
            <View style={styles.detailContent}>
              <Text style={styles.detailTitle}>Email</Text>
              <Text style={styles.detailValue}>{employee.email}</Text>
            </View>
          </View>
        </View>
      </View>

      <QRCodeGenerator employee={employee} />

      <View style={styles.actionContainer}>
        <Link href="/verify" asChild>
          <Pressable
            style={({ pressed }) => [
              styles.scanButton,
              pressed && styles.scanButtonPressed,
            ]}
          >
            <Text style={styles.scanButtonIcon}>📸</Text>
            <Text style={styles.scanButtonText}>Scan QR Code</Text>
          </Pressable>
        </Link>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  contentContainer: {
    paddingBottom: 40,
  },
  header: {
    padding: 20,
    paddingTop: 40,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  backIcon: {
    fontSize: 18,
    marginRight: 8,
    color: Colors.primary,
  },
  backText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.primary,
  },
  profileContainer: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: Colors.surface,
    marginHorizontal: 20,
    borderRadius: 16,
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.surface,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  employeeId: {
    fontSize: 16,
    color: Colors.textSecondary,
    backgroundColor: Colors.surfaceSecondary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  detailsContainer: {
    padding: 20,
  },
  detailCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  detailLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  detailIcon: {
    fontSize: 20,
    marginRight: 16,
    width: 24,
    textAlign: 'center',
  },
  detailContent: {
    flex: 1,
  },
  detailTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 16,
    color: Colors.text,
    fontWeight: '400',
  },
  actionContainer: {
    padding: 20,
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.secondary,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    shadowColor: Colors.secondary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  scanButtonPressed: {
    backgroundColor: '#059669',
    transform: [{ scale: 0.98 }],
  },
  scanButtonIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  scanButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.surface,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  errorIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
});