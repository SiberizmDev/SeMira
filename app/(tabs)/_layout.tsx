import React from 'react';
import { Tabs } from 'expo-router';
import { usePeriodContext } from '@/context/PeriodContext';
import { useTheme } from '@/context/ThemeContext';
import { router } from 'expo-router';
import { FONT_FAMILY, SHADOWS } from '@/constants/theme';
import { Chrome as Home, Calendar, ChartBar as BarChart3, Settings } from 'lucide-react-native';
import { Platform } from 'react-native';

export default function TabLayout() {
  const { isFirstTime } = usePeriodContext();
  const { colors } = useTheme();
  
  // Redirect to onboarding if it's the first time
  React.useEffect(() => {
    if (isFirstTime) {
      router.replace('/onboarding');
    }
  }, [isFirstTime]);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary.main,
        tabBarInactiveTintColor: colors.neutral.gray,
        tabBarStyle: {
          marginRight: 30,
          marginLeft: 30,
          backgroundColor: colors.background,
          borderTopWidth: 0,
          marginHorizontal: 20,
          marginBottom: Platform.OS === 'ios' ? 20 : 10,
          borderRadius: 100,
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 10,
          height: 60,
          paddingBottom: 10,
          ...Platform.select({
            ios: {
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.15,
              shadowRadius: 8,
            },
            android: {
              elevation: 8,
            },
          }),
        },
        tabBarLabelStyle: {
          fontFamily: FONT_FAMILY.medium,
          fontSize: 12,
        },
        headerStyle: {
          backgroundColor: colors.primary.main,
          ...Platform.select({
            ios: {
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.15,
              shadowRadius: 8,
            },
            android: {
              elevation: 4,
            },
          }),
        },
        headerTitleStyle: {
          fontFamily: FONT_FAMILY.bold,
          fontSize: 26,
          marginBottom: 10,
        },
        headerTitleAlign: 'left',
        headerTintColor: colors.neutral.white,
        headerShadowVisible: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Ev',
          tabBarIcon: ({ color, size }) => (
            <Home size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: 'Takvim',
          tabBarIcon: ({ color, size }) => (
            <Calendar size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'İstatistik',
          tabBarIcon: ({ color, size }) => (
            <BarChart3 size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Ayarlar',
          tabBarIcon: ({ color, size }) => (
            <Settings size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}