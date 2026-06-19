import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        tabBarInactiveTintColor: Colors[colorScheme ?? 'light'].tabIconDefault,
        tabBarStyle: { backgroundColor: Colors[colorScheme ?? 'light'].card },
        headerStyle: { backgroundColor: Colors[colorScheme ?? 'light'].card },
        headerTintColor: Colors[colorScheme ?? 'light'].text,
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Hoy',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="partly-sunny-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="forecast"
        options={{
          title: 'Pronóstico',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="hourly"
        options={{
          title: 'Por hora',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="time-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="astronomy"
        options={{
          title: 'Astronomía',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="moon-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
