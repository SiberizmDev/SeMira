import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { differenceInDays, format, parseISO } from 'date-fns';
import { usePeriodContext } from '@/context/PeriodContext';
import { COLORS, FONT_FAMILY, FONT_SIZE, SPACING, BORDER_RADIUS, SHADOWS } from '@/constants/theme';
import { Calendar, Bell } from 'lucide-react-native';

export const PeriodStatusCard = ({ onStartPress, onEndPress }: { 
  onStartPress: () => void; 
  onEndPress: () => void;
}) => {
  const { currentPeriod, periods, userPreferences } = usePeriodContext();
  
  if (currentPeriod) {
    // Active period
    const startDate = parseISO(currentPeriod.startDate);
    const today = new Date();
    const dayCount = differenceInDays(today, startDate) + 1;
    
    return (
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title}>Period Active</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Day {dayCount}</Text>
          </View>
        </View>
        <Text style={styles.subtitle}>
          Started on {format(startDate, 'MMM d, yyyy')}
        </Text>
        <TouchableOpacity style={styles.button} onPress={onEndPress}>
          <Text style={styles.buttonText}>End Period</Text>
        </TouchableOpacity>
      </View>
    );
  } else {
    // No active period
    let statusMessage = "Track your period";
    
    if (periods.length > 0 && userPreferences) {
      // Calculate next period prediction if we have history
      const lastPeriod = periods[periods.length - 1];
      if (lastPeriod.endDate) {
        const lastEndDate = parseISO(lastPeriod.endDate);
        const cycleLength = userPreferences.cycleLength || 28; // Default to 28 if not set
        const expectedNextStart = new Date(lastEndDate);
        expectedNextStart.setDate(expectedNextStart.getDate() + cycleLength - (userPreferences.typicalDuration || 5));
        
        const today = new Date();
        const daysUntil = differenceInDays(expectedNextStart, today);
        
        if (daysUntil > 0) {
          statusMessage = `Next period in ~${daysUntil} days`;
        } else if (daysUntil === 0) {
          statusMessage = "Your period may start today";
        } else {
          statusMessage = "Your period may be late";
        }
      }
    }
    
    return (
      <View style={styles.card}>
        <View style={styles.header}>
          <Calendar color={COLORS.primary.main} size={24} />
          <Text style={styles.title}>Period Tracker</Text>
        </View>
        <Text style={styles.subtitle}>{statusMessage}</Text>
        <TouchableOpacity style={styles.button} onPress={onStartPress}>
          <Text style={styles.buttonText}>Start Period</Text>
        </TouchableOpacity>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginVertical: SPACING.md,
    ...SHADOWS.medium,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  title: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: FONT_SIZE.xl,
    color: COLORS.text,
  },
  badge: {
    backgroundColor: COLORS.primary.main,
    borderRadius: BORDER_RADIUS.round,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
  },
  badgeText: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.sm,
    color: COLORS.neutral.white,
  },
  subtitle: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.md,
    color: COLORS.neutral.darkGray,
    marginBottom: SPACING.md,
  },
  button: {
    backgroundColor: COLORS.primary.main,
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    marginTop: SPACING.md,
  },
  buttonText: {
    fontFamily: FONT_FAMILY.medium,
    color: COLORS.neutral.white,
    fontSize: FONT_SIZE.md,
  },
});