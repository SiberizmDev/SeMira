import React from 'react';
import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { useFonts } from '@/hooks/useFonts';
import { PeriodProvider } from '@/context/PeriodContext';
import { ThemeProvider, useTheme } from '@/context/ThemeContext';
import { View, Text, Platform, StyleSheet } from 'react-native';
import { COLORS, FONT_FAMILY, FONT_SIZE, SPACING } from '@/constants/theme';
import * as Notifications from 'expo-notifications';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { ArrowLeft } from 'lucide-react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

interface CustomHeaderProps {
  title: string;
  isDarkMode: boolean;
  colors: any;
  canGoBack?: boolean;
  onBack?: () => void;
}

function CustomHeader({ title, isDarkMode, colors, canGoBack, onBack }: CustomHeaderProps) {
  return (
    <View style={{ backgroundColor: colors.primary.main }}>
      <LinearGradient
        colors={isDarkMode ? 
          [colors.primary.dark, colors.primary.main] : 
          [colors.primary.light, colors.primary.main]
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={headerStyles.headerGradient}
      >
        <BlurView
          intensity={20}
          tint={isDarkMode ? 'dark' : 'light'}
          style={StyleSheet.absoluteFillObject}
        />
        <View style={headerStyles.headerContent}>
          {canGoBack && (
            <TouchableOpacity onPress={onBack} style={headerStyles.backButton}>
              <ArrowLeft size={24} color={colors.neutral.white} />
            </TouchableOpacity>
          )}
          <Text style={[headerStyles.headerTitle, { color: colors.neutral.white }]}>
            {title}
          </Text>
        </View>
      </LinearGradient>
    </View>
  );
}

function AppLayout() {
  const { colors, isDarkMode } = useTheme();
  
  useFrameworkReady();
  const { fontsLoaded, fontError } = useFonts();
  
  useEffect(() => {
    Notifications.requestPermissionsAsync();
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });
  }, []);
  
  // Return null to keep splash screen visible while fonts load
  if (!fontsLoaded && !fontError) {
    return null;
  }
  
  // Show error if fonts fail to load
  if (fontError) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <Text style={{ color: colors.text }}>Error loading fonts</Text>
      </View>
    );
  }
  
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PeriodProvider>
        <Stack screenOptions={{ 
          header: ({ route, options, navigation }) => (
            <CustomHeader 
              title={options.title || route.name} 
              isDarkMode={isDarkMode}
              colors={colors}
              canGoBack={navigation.canGoBack()}
              onBack={() => navigation.goBack()}
            />
          ),
          contentStyle: { 
            backgroundColor: colors.background 
          },
          animation: Platform.select({
            ios: 'simple_push',
            android: 'slide_from_right'
          }),
          animationDuration: 200,
          gestureEnabled: true,
          fullScreenGestureEnabled: true,
        }}>
          <Stack.Screen 
            name="(tabs)" 
            options={{ 
              headerShown: false 
            }} 
          />
          <Stack.Screen 
            name="onboarding" 
            options={{ 
              headerShown: false 
            }} 
          />
          <Stack.Screen 
            name="period-actions/start" 
            options={{ 
              title: 'Adet Başlangıç' 
            }} 
          />
          <Stack.Screen 
            name="period-actions/end" 
            options={{ 
              title: 'Adet Bitiş' 
            }} 
          />
          <Stack.Screen 
            name="period-actions/daily-check" 
            options={{ 
              title: 'Günlük Kontrol' 
            }} 
          />
          <Stack.Screen 
            name="period-actions/details" 
            options={{ 
              title: 'Adet Detayları' 
            }} 
          />
          <Stack.Screen 
            name="cycle-length" 
            options={{ 
              title: 'Döngü Uzunluğu' 
            }} 
          />
          <Stack.Screen 
            name="period-duration" 
            options={{ 
              title: 'Adet Süresi' 
            }} 
          />
          <Stack.Screen 
            name="privacy-policy" 
            options={{ 
              title: 'Gizlilik Politikası' 
            }} 
          />
          <Stack.Screen 
            name="about" 
            options={{ 
              title: 'Hakkında' 
            }} 
          />
        </Stack>
        <StatusBar style={isDarkMode ? "light" : "dark"} />
      </PeriodProvider>
    </GestureHandlerRootView>
  );
}

const headerStyles = StyleSheet.create({
  headerGradient: {
    paddingTop: Platform.OS === 'ios' ? 48 : 16,
    paddingBottom: SPACING.md,
    paddingHorizontal: SPACING.lg,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: SPACING.md,
    padding: SPACING.xs,
  },
  headerTitle: {
    fontFamily: FONT_FAMILY.bold,
    fontSize: FONT_SIZE.xxl,
    textShadowColor: 'rgba(0, 0, 0, 0.15)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
});

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AppLayout />
    </ThemeProvider>
  );
}