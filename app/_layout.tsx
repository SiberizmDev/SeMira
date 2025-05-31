import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { useFonts } from '@/hooks/useFonts';
import { PeriodProvider } from '@/context/PeriodContext';
import { View, Text } from 'react-native';
import { COLORS } from '@/constants/theme';

export default function RootLayout() {
  useFrameworkReady();
  const { fontsLoaded, fontError } = useFonts();
  
  // Return null to keep splash screen visible while fonts load
  if (!fontsLoaded && !fontError) {
    return null;
  }
  
  // Show error if fonts fail to load
  if (fontError) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Error loading fonts</Text>
      </View>
    );
  }
  
  return (
    <PeriodProvider>
      <Stack screenOptions={{ 
        headerStyle: { backgroundColor: COLORS.primary.main },
        headerTintColor: COLORS.neutral.white,
        headerTitleStyle: { fontFamily: 'Poppins-Medium' },
        contentStyle: { backgroundColor: COLORS.background },
      }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        <Stack.Screen name="period-actions/start" options={{ title: 'Start Period' }} />
        <Stack.Screen name="period-actions/end" options={{ title: 'End Period' }} />
        <Stack.Screen name="period-actions/daily-check" options={{ title: 'Daily Check-in' }} />
        <Stack.Screen name="period-actions/details" options={{ title: 'Period Details' }} />
      </Stack>
      <StatusBar style="auto" />
    </PeriodProvider>
  );
}