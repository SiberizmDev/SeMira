import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import { usePeriodContext } from '@/context/PeriodContext';
import { PeriodStatusCard } from '@/components/PeriodStatusCard';
import { TipCard } from '@/components/TipCard';
import { COLORS, FONT_FAMILY, FONT_SIZE, SPACING } from '@/constants/theme';
import { differenceInDays, parseISO, format } from 'date-fns';
import { Bell } from 'lucide-react-native';

export default function HomeScreen() {
  const { currentPeriod, periods, userPreferences } = usePeriodContext();
  
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
    expectedNextStart.setDate(expectedNextStart.getDate() + (cycleLength - userPreferences.typicalDuration));
    
    return expectedNextStart;
  };
  
  const nextPeriod = calculateNextPeriod();
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Period Tracker</Text>
        {currentPeriod && (
          <TouchableOpacity 
            style={styles.checkInButton}
            onPress={handleDailyCheckIn}
          >
            <Bell size={16} color={COLORS.neutral.white} />
            <Text style={styles.checkInText}>Check-in</Text>
          </TouchableOpacity>
        )}
      </View>
      
      <PeriodStatusCard 
        onStartPress={handleStartPeriod} 
        onEndPress={handleEndPeriod} 
      />
      
      {currentPeriod && <TipCard />}
      
      {!currentPeriod && nextPeriod && (
        <View style={styles.nextPeriodCard}>
          <Text style={styles.nextPeriodTitle}>Next Period</Text>
          <Text style={styles.nextPeriodDate}>
            Expected around {format(nextPeriod, 'MMM d, yyyy')}
          </Text>
          <Text style={styles.nextPeriodInfo}>
            Based on your typical {userPreferences?.cycleLength || 28}-day cycle
          </Text>
        </View>
      )}
      
      {periods.length > 0 && (
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Your Stats</Text>
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{periods.length}</Text>
              <Text style={styles.statLabel}>Periods Tracked</Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {userPreferences?.typicalDuration || '?'}
              </Text>
              <Text style={styles.statLabel}>Avg. Duration</Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {userPreferences?.cycleLength || '?'}
              </Text>
              <Text style={styles.statLabel}>Cycle Length</Text>
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
    backgroundColor: COLORS.background,
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
    color: COLORS.text,
  },
  checkInButton: {
    backgroundColor: COLORS.primary.main,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 20,
  },
  checkInText: {
    fontFamily: FONT_FAMILY.medium,
    color: COLORS.neutral.white,
    marginLeft: SPACING.xs,
  },
  nextPeriodCard: {
    backgroundColor: COLORS.secondary.light,
    padding: SPACING.lg,
    borderRadius: 12,
    marginVertical: SPACING.md,
  },
  nextPeriodTitle: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: FONT_SIZE.lg,
    color: COLORS.secondary.dark,
    marginBottom: SPACING.xs,
  },
  nextPeriodDate: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.md,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  nextPeriodInfo: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.sm,
    color: COLORS.neutral.darkGray,
  },
  statsSection: {
    marginTop: SPACING.xl,
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: FONT_SIZE.lg,
    color: COLORS.text,
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
    backgroundColor: COLORS.neutral.light,
    borderRadius: 12,
    marginHorizontal: SPACING.xs,
  },
  statValue: {
    fontFamily: FONT_FAMILY.bold,
    fontSize: FONT_SIZE.xxl,
    color: COLORS.primary.main,
  },
  statLabel: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.sm,
    color: COLORS.neutral.darkGray,
    textAlign: 'center',
    marginTop: SPACING.xs,
  },
});