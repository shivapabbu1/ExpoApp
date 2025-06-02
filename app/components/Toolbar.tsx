import { usePathname, useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Colors } from '../constants/Colors';

export default function Toolbar() {
  const router = useRouter();
  const pathname = usePathname();

  const tabs = [
    { title: 'Home', route: '/', icon: '🏠' },
    { title: 'Employees', route: '/main', icon: '👥' },
    { title: 'Scan', route: '/verify', icon: '📱' },
  ];

  const isActive = (route: string) => {
    if (route === '/' && pathname === '/') return true;
    if (route !== '/' && pathname.startsWith(route)) return true;
    return false;
  };

  return (
    <View style={styles.toolbar}>
      {tabs.map((tab) => (
        <Pressable
          key={tab.route}
          style={({ pressed }) => [
            styles.tab,
            isActive(tab.route) && styles.tabActive,
            pressed && styles.tabPressed,
          ]}
          onPress={() => router.push(tab.route)}
        >
          <Text style={styles.tabIcon}>{tab.icon}</Text>
          <Text style={[
            styles.tabText,
            isActive(tab.route) && styles.tabTextActive,
          ]}>
            {tab.title}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  toolbar: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  tabActive: {
    backgroundColor: Colors.primary,
  },
  tabPressed: {
    backgroundColor: Colors.surfaceSecondary,
  },
  tabIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  tabTextActive: {
    color: Colors.surface,
    fontWeight: '600',
  },
});