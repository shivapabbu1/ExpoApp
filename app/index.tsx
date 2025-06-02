import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Colors } from './constants/Colors';

export default function HomeScreen() {
  const router = useRouter();

  const features = [
    {
      title: 'View Employees',
      description: 'Browse through the complete employee directory',
      icon: '👥',
      route: '/main',
      color: Colors.primary,
    },
    {
      title: 'Generate QR Codes',
      description: 'Create secure QR codes for employee verification',
      icon: '📱',
      route: '/main',
      color: Colors.secondary,
    },
    {
      title: 'Scan QR Codes',
      description: 'Scan and verify employee QR codes instantly',
      icon: '📸',
      route: '/verify',
      color: Colors.warning,
    },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>Employee Directory</Text>
        <Text style={styles.subtitle}>Professional employee management system</Text>
      </View>

      <View style={styles.featuresContainer}>
        {features.map((feature, index) => (
          <Pressable
            key={index}
            style={({ pressed }) => [
              styles.featureCard,
              { borderLeftColor: feature.color },
              pressed && styles.featureCardPressed,
            ]}
            onPress={() => router.push(feature.route)}
          >
            <Text style={styles.featureIcon}>{feature.icon}</Text>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>{feature.title}</Text>
              <Text style={styles.featureDescription}>{feature.description}</Text>
            </View>
          </Pressable>
        ))}
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>Quick Start Guide</Text>
        <View style={styles.stepContainer}>
          <Text style={styles.step}>1. Browse employees in the directory</Text>
          <Text style={styles.step}>2. Tap on any employee to view details</Text>
          <Text style={styles.step}>3. Generate QR codes for verification</Text>
          <Text style={styles.step}>4. Use the scanner to verify codes</Text>
        </View>
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
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
    paddingTop: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  featuresContainer: {
    marginBottom: 32,
  },
  featureCard: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderLeftWidth: 4,
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  featureCardPressed: {
    backgroundColor: Colors.surfaceSecondary,
    transform: [{ scale: 0.98 }],
  },
  featureIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  infoContainer: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 20,
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 16,
  },
  stepContainer: {
    gap: 8,
  },
  step: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
});