import React from 'react';
import { Tabs } from 'expo-router';
import { usePeriodContext } from '@/context/PeriodContext';
import { router } from 'expo-router';
import { COLORS, FONT_FAMILY } from '@/constants/theme';
import { Chrome as Home, Calendar, ChartBar as BarChart3, Settings } from 'lucide-react-native';

export default function TabLayout() {
  const { isFirstTime } = usePeriodContext();
  
  // Redirect to onboarding if it's the first time
  React.useEffect(() => {
    if (isFirstTime) {
      router.replace('/onboarding');
    }
  }, [isFirstTime]);
  
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: COLORS.primary.main,
        tabBarInactiveTintColor: COLORS.neutral.gray,
        tabBarStyle: {
          backgroundColor: COLORS.background,
          borderTopColor: COLORS.neutral.medium,
        },
        tabBarLabelStyle: {
          fontFamily: FONT_FAMILY.medium,
          fontSize: 12,
        },
        headerStyle: {
          backgroundColor: COLORS.primary.main,
        },
        headerTintColor: COLORS.neutral.white,
        headerTitleStyle: {
          fontFamily: FONT_FAMILY.semiBold,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Home size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: 'Calendar',
          tabBarIcon: ({ color, size }) => (
            <Calendar size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarIcon: ({ color, size }) => (
            <BarChart3 size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <Settings size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}