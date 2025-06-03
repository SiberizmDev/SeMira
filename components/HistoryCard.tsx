import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { format, differenceInDays, parseISO } from 'date-fns';
import { PeriodRecord } from '@/types/period';
import { COLORS, FONT_FAMILY, FONT_SIZE, SPACING, BORDER_RADIUS, SHADOWS } from '@/constants/theme';
import { CalendarDays } from 'lucide-react-native';
import { tr } from 'date-fns/locale';

interface HistoryCardProps {
  period: PeriodRecord;
  onPress: () => void;
}

const SYMPTOM_LABELS: Record<string, string> = {
  cramps: 'Kramp',
  headache: 'Baş ağrısı',
  backache: 'Bel ağrısı',
  nausea: 'Bulantı',
  fatigue: 'Yorgunluk',
  bloating: 'Şişkinlik',
  'breast tenderness': 'Göğüs hassasiyeti',
  'mood swings': 'Duygu değişimi',
  none: 'Belirti yok',
};

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
    return format(date, 'MMM d, yyyy', { locale: tr });
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
        <View style={styles.badgeRow}>
          <View style={[styles.durationBadge, period.isActive && styles.activeBorder]}>
            <Text style={styles.durationText}>{duration} gün</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.detailsContainer}>
        {topSymptoms.length > 0 ? (
          <Text style={styles.symptomsText}>
            Yaygın belirtiler: {topSymptoms.map(s => SYMPTOM_LABELS[s] || s).join(', ')}
          </Text>
        ) : (
          <Text style={styles.symptomsText}>Belirti kaydı yok</Text>
        )}
      </View>
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
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
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
  activeBorder: {
    borderWidth: 2,
    borderColor: COLORS.success,
  },
});