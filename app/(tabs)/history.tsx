import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { usePeriodContext } from '@/context/PeriodContext';
import { HistoryCard } from '@/components/HistoryCard';
import { COLORS, FONT_FAMILY, FONT_SIZE, SPACING, BORDER_RADIUS } from '@/constants/theme';
import { CalendarRange, FileText } from 'lucide-react-native';
import { router } from 'expo-router';

export default function HistoryScreen() {
  const { periods } = usePeriodContext();
  
  const handleViewPeriodDetails = (periodId: string) => {
    router.push({
      pathname: '/period-actions/details',
      params: { id: periodId }
    });
  };
  
  // Calculate average period length
  const calculateAverageDuration = () => {
    const completedPeriods = periods.filter(p => p.endDate && !p.isActive);
    
    if (completedPeriods.length === 0) return 'N/A';
    
    const totalDays = completedPeriods.reduce((total, period) => {
      const startDate = new Date(period.startDate);
      const endDate = new Date(period.endDate!);
      const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      return total + diffDays;
    }, 0);
    
    return (totalDays / completedPeriods.length).toFixed(1);
  };
  
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Your Period History</Text>
      
      {periods.length > 0 ? (
        <>
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <CalendarRange size={20} color={COLORS.primary.main} />
              <Text style={styles.statValue}>{periods.length}</Text>
              <Text style={styles.statLabel}>Total Periods</Text>
            </View>
            <View style={styles.statCard}>
              <FileText size={20} color={COLORS.primary.main} />
              <Text style={styles.statValue}>{calculateAverageDuration()}</Text>
              <Text style={styles.statLabel}>Avg. Duration</Text>
            </View>
          </View>
          
          <View style={styles.historyContainer}>
            <Text style={styles.sectionTitle}>Period Records</Text>
            
            {periods.slice().reverse().map((period) => (
              <HistoryCard
                key={period.id}
                period={period}
                onPress={() => handleViewPeriodDetails(period.id)}
              />
            ))}
          </View>
        </>
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            You haven't tracked any periods yet.
          </Text>
          <TouchableOpacity
            style={styles.startButton}
            onPress={() => router.push('/period-actions/start')}
          >
            <Text style={styles.startButtonText}>Start Tracking</Text>
          </TouchableOpacity>
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
  title: {
    fontFamily: FONT_FAMILY.bold,
    fontSize: FONT_SIZE.xl,
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.lg,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.neutral.white,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    alignItems: 'center',
    marginHorizontal: SPACING.xs,
    shadowColor: COLORS.neutral.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statValue: {
    fontFamily: FONT_FAMILY.bold,
    fontSize: FONT_SIZE.xxl,
    color: COLORS.primary.main,
    marginVertical: SPACING.xs,
  },
  statLabel: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.sm,
    color: COLORS.neutral.darkGray,
  },
  historyContainer: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: FONT_SIZE.lg,
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
    marginTop: SPACING.xl,
  },
  emptyText: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.md,
    color: COLORS.neutral.darkGray,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  startButton: {
    backgroundColor: COLORS.primary.main,
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
  },
  startButtonText: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.md,
    color: COLORS.neutral.white,
  },
});