import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import { usePeriodContext } from '@/context/PeriodContext';
import { PeriodStatusCard } from '@/components/PeriodStatusCard';
import { TipCard } from '@/components/TipCard';
import { FONT_FAMILY, FONT_SIZE, SPACING } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';
import { differenceInDays, parseISO, format } from 'date-fns';
import { Bell } from 'lucide-react-native';
import { tr } from 'date-fns/locale';

export default function HomeScreen() {
  const { currentPeriod, periods, userPreferences } = usePeriodContext();
  const { colors } = useTheme();
  
  const handleStartPeriod = () => {
    router.push('/period-actions/start');
  };
  
  const handleEndPeriod = () => {
    router.push('/period-actions/end');
  };
  
  const handleDailyCheckIn = () => {
    if (currentPeriod) {
      router.push('/period-actions/daily-check');
    }
  };
  
  // Check if a daily check-in is needed
  useEffect(() => {
    if (currentPeriod) {
      const today = format(new Date(), 'yyyy-MM-dd');
      const hasTodayLog = currentPeriod.dailyLogs.some(log => log.date === today);
      
      if (!hasTodayLog) {
        // We might want to remind the user for daily check-in
        // This could be implemented as a notification or just a visual cue
      }
    }
  }, [currentPeriod]);
  
  // Calculate next period (if applicable)
  const calculateNextPeriod = () => {
    if (!userPreferences || periods.length === 0) return null;
    
    const lastPeriod = periods[periods.length - 1];
    if (!lastPeriod.endDate) return null;
    
    const lastEndDate = parseISO(lastPeriod.endDate);
    const cycleLength = userPreferences.cycleLength || 28;
    
    const expectedNextStart = new Date(lastEndDate);
    expectedNextStart.setDate(expectedNextStart.getDate() + (cycleLength - (userPreferences.typicalDuration || 5)));
    
    return expectedNextStart;
  };
  
  const nextPeriod = calculateNextPeriod();
  
  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Adet Takipçisi</Text>
        {currentPeriod && (
          <TouchableOpacity 
            style={[styles.checkInButton, { backgroundColor: colors.primary.main }]}
            onPress={handleDailyCheckIn}
          >
            <Bell size={16} color={colors.neutral.white} />
            <Text style={[styles.checkInText, { color: colors.neutral.white }]}>Kontrol</Text>
          </TouchableOpacity>
        )}
      </View>
      
      <PeriodStatusCard 
        onStartPress={handleStartPeriod} 
        onEndPress={handleEndPeriod} 
      />
      
      {currentPeriod && <TipCard />}
      
      {!currentPeriod && nextPeriod && (
        <View style={[styles.nextPeriodCard, { backgroundColor: colors.secondary.light }]}>
          <Text style={[styles.nextPeriodTitle, { color: colors.secondary.dark }]}>Sonraki Adet</Text>
          <Text style={[styles.nextPeriodDate, { color: colors.text }]}>
            Tahmini: {format(nextPeriod, 'dd MMMM yyyy', { locale: tr })}
          </Text>
          <Text style={[styles.nextPeriodInfo, { color: colors.neutral.darkGray }]}>
            Tipik {userPreferences?.cycleLength || 28} günlük döngüye göre
          </Text>
        </View>
      )}
      
      {periods.length > 0 && (
        <View style={styles.statsSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>İstatistiklerin</Text>
          
          <View style={styles.statsContainer}>
            <View style={[styles.statItem, { backgroundColor: colors.neutral.light }]}>
              <Text style={[styles.statValue, { color: colors.primary.main }]}>{periods.length}</Text>
              <Text style={[styles.statLabel, { color: colors.neutral.darkGray }]}>Takip Edilen Adet</Text>
            </View>
            
            <View style={[styles.statItem, { backgroundColor: colors.neutral.light }]}>
              <Text style={[styles.statValue, { color: colors.primary.main }]}>
                {userPreferences?.typicalDuration || '?'}
              </Text>
              <Text style={[styles.statLabel, { color: colors.neutral.darkGray }]}>Ort. Süre</Text>
            </View>
            
            <View style={[styles.statItem, { backgroundColor: colors.neutral.light }]}>
              <Text style={[styles.statValue, { color: colors.primary.main }]}>
                {userPreferences?.cycleLength || '?'}
              </Text>
              <Text style={[styles.statLabel, { color: colors.neutral.darkGray }]}>Döngü Uzunluğu</Text>
            </View>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SPACING.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: SPACING.md,
  },
  title: {
    fontFamily: FONT_FAMILY.bold,
    fontSize: FONT_SIZE.xxl,
  },
  checkInButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 20,
  },
  checkInText: {
    fontFamily: FONT_FAMILY.medium,
    marginLeft: SPACING.xs,
  },
  nextPeriodCard: {
    padding: SPACING.lg,
    borderRadius: 12,
    marginVertical: SPACING.md,
  },
  nextPeriodTitle: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: FONT_SIZE.lg,
    marginBottom: SPACING.xs,
  },
  nextPeriodDate: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.md,
    marginBottom: SPACING.xs,
  },
  nextPeriodInfo: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.sm,
  },
  statsSection: {
    marginTop: SPACING.xl,
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: FONT_SIZE.lg,
    marginBottom: SPACING.md,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    padding: SPACING.md,
    borderRadius: 12,
    marginHorizontal: SPACING.xs,
  },
  statValue: {
    fontFamily: FONT_FAMILY.bold,
    fontSize: FONT_SIZE.xxl,
  },
  statLabel: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.sm,
    textAlign: 'center',
    marginTop: SPACING.xs,
  },
});