import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { format, differenceInDays, parseISO } from 'date-fns';
import { PeriodRecord } from '@/types/period';
import { COLORS, FONT_FAMILY, FONT_SIZE, SPACING, BORDER_RADIUS, SHADOWS } from '@/constants/theme';
import { CalendarDays } from 'lucide-react-native';

interface HistoryCardProps {
  period: PeriodRecord;
  onPress: () => void;
}

export const HistoryCard: React.FC<HistoryCardProps> = ({ period, onPress }) => {
  const startDate = parseISO(period.startDate);
  let duration = 0;
  
  if (period.endDate) {
    const endDate = parseISO(period.endDate);
    duration = differenceInDays(endDate, startDate) + 1;
  } else if (period.isActive) {
    duration = differenceInDays(new Date(), startDate) + 1;
  }
  
  const getFormattedDate = (date: Date) => {
    return format(date, 'MMM d, yyyy');
  };
  
  // Calculate most common symptoms
  const symptomCounts: Record<string, number> = {};
  period.dailyLogs.forEach(log => {
    log.symptoms.forEach(symptom => {
      if (symptom !== 'none') {
        symptomCounts[symptom] = (symptomCounts[symptom] || 0) + 1;
      }
    });
  });
  
  const topSymptoms = Object.entries(symptomCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)
    .map(([symptom]) => symptom);
  
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.dateContainer}>
          <CalendarDays size={16} color={COLORS.primary.main} style={styles.icon} />
          <Text style={styles.date}>{getFormattedDate(startDate)}</Text>
        </View>
        <View style={styles.durationBadge}>
          <Text style={styles.durationText}>{duration} days</Text>
        </View>
      </View>
      
      <View style={styles.detailsContainer}>
        {topSymptoms.length > 0 ? (
          <Text style={styles.symptomsText}>
            Common symptoms: {topSymptoms.join(', ')}
          </Text>
        ) : (
          <Text style={styles.symptomsText}>No symptoms recorded</Text>
        )}
      </View>
      
      {period.isActive && (
        <View style={styles.activeBadge}>
          <Text style={styles.activeText}>Active</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginVertical: SPACING.sm,
    ...SHADOWS.small,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary.main,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: SPACING.xs,
  },
  date: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: FONT_SIZE.md,
    color: COLORS.text,
  },
  durationBadge: {
    backgroundColor: COLORS.primary.light,
    borderRadius: BORDER_RADIUS.round,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
  },
  durationText: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.xs,
    color: COLORS.primary.dark,
  },
  detailsContainer: {
    marginTop: SPACING.xs,
  },
  symptomsText: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.sm,
    color: COLORS.neutral.darkGray,
  },
  activeBadge: {
    position: 'absolute',
    top: SPACING.sm,
    right: SPACING.sm,
    backgroundColor: COLORS.success,
    borderRadius: BORDER_RADIUS.round,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
  },
  activeText: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.xs,
    color: COLORS.neutral.white,
  },
});