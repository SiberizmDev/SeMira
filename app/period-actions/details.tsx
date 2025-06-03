import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { usePeriodContext } from '@/context/PeriodContext';
import { FONT_FAMILY, FONT_SIZE, SPACING, BORDER_RADIUS, SHADOWS } from '@/constants/theme';
import { format, parseISO, differenceInDays } from 'date-fns';
import { Calendar, Activity, ArrowLeft } from 'lucide-react-native';
import { tr } from 'date-fns/locale';
import { useTheme } from '@/context/ThemeContext';

interface PeriodDetailsParams {
  id: string;
}

// Türkçe mappingler
const FLOW_LABELS: Record<string, string> = {
  light: 'Hafif',
  medium: 'Orta',
  heavy: 'Yoğun',
};
const MOOD_LABELS: Record<string, string> = {
  happy: 'Mutlu',
  neutral: 'Nötr',
  sad: 'Üzgün',
  irritable: 'Sinirli',
  anxious: 'Endişeli',
};
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

export default function PeriodDetailsScreen() {
  const { id } = useLocalSearchParams();
  const { periods } = usePeriodContext();
  const { colors } = useTheme();
  
  const period = periods.find(p => p.id === id);
  
  if (!period) {
    Alert.alert('Error', 'Period not found', [
      { text: 'OK', onPress: () => router.back() }
    ]);
    return null;
  }
  
  const startDate = parseISO(period.startDate);
  let duration = 0;
  
  if (period.endDate) {
    const endDate = parseISO(period.endDate);
    duration = differenceInDays(endDate, startDate) + 1;
  } else if (period.isActive) {
    duration = differenceInDays(new Date(), startDate) + 1;
  }
  
  // Analyze symptoms
  const symptomCounts: Record<string, number> = {};
  period.dailyLogs.forEach(log => {
    log.symptoms.forEach(symptom => {
      if (symptom !== 'none') {
        symptomCounts[symptom] = (symptomCounts[symptom] || 0) + 1;
      }
    });
  });
  
  const symptomEntries = Object.entries(symptomCounts)
    .sort((a, b) => b[1] - a[1]);
  
  // Analyze moods
  const moodCounts: Record<string, number> = {};
  period.dailyLogs.forEach(log => {
    if (log.mood) {
      moodCounts[log.mood] = (moodCounts[log.mood] || 0) + 1;
    }
  });
  
  const moodEntries = Object.entries(moodCounts)
    .sort((a, b) => b[1] - a[1]);
  
  // Get most common flow
  const flowCounts: Record<string, number> = {};
  period.dailyLogs.forEach(log => {
    if (log.flow) {
      flowCounts[log.flow] = (flowCounts[log.flow] || 0) + 1;
    }
  });
  
  const flowEntries = Object.entries(flowCounts)
    .sort((a, b) => b[1] - a[1]);
  
  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
     ,
      
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <View style={styles.dateRow}>
          <Calendar size={20} color={colors.primary.main} style={styles.icon} />
          <Text style={[styles.dateText, { color: colors.text }]}>
            {format(startDate, 'MMMM d, yyyy', { locale: tr })}
            {period.endDate && ` - ${format(parseISO(period.endDate), 'MMMM d, yyyy', { locale: tr })}`}
          </Text>
        </View>
        
        <View style={[styles.durationBadge, { backgroundColor: colors.primary.light }]}>
          <Text style={[styles.durationText, { color: colors.primary.dark }]}>{duration} gün</Text>
        </View>
        
        {period.isActive && (
          <View style={[styles.activeBadge, { backgroundColor: colors.success }]}>
            <Text style={[styles.activeText, { color: colors.neutral.white }]}>Şu an Aktif</Text>
          </View>
        )}
      </View>
      
      <View style={styles.summarySection}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Özet</Text>
        
        <View style={styles.summaryGrid}>
          <View style={[styles.summaryItem, { backgroundColor: colors.card }]}>
            <Text style={[styles.summaryLabel, { color: colors.neutral.darkGray }]}>Süre</Text>
            <Text style={[styles.summaryValue, { color: colors.text }]}>{duration} gün</Text>
          </View>
          
          <View style={[styles.summaryItem, { backgroundColor: colors.card }]}>
            <Text style={[styles.summaryLabel, { color: colors.neutral.darkGray }]}>En Sık Akış</Text>
            <Text style={[
              styles.summaryValue,
              { color: flowEntries.length > 0 ? colors.primary[flowEntries[0][0]] : colors.text }
            ]}>
              {flowEntries.length > 0 
                ? FLOW_LABELS[flowEntries[0][0]] || flowEntries[0][0]
                : 'Yok'}
            </Text>
          </View>
          
          <View style={[styles.summaryItem, { backgroundColor: colors.card }]}>
            <Text style={[styles.summaryLabel, { color: colors.neutral.darkGray }]}>En Sık Ruh Hali</Text>
            <Text style={[styles.summaryValue, { color: colors.text }]}>
              {moodEntries.length > 0 
                ? MOOD_LABELS[moodEntries[0][0]] || moodEntries[0][0]
                : 'Yok'}
            </Text>
          </View>
          
          <View style={[styles.summaryItem, { backgroundColor: colors.card }]}>
            <Text style={[styles.summaryLabel, { color: colors.neutral.darkGray }]}>Kayıtlı Gün</Text>
            <Text style={[styles.summaryValue, { color: colors.text }]}>{period.dailyLogs.length}</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.symptomsSection}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Yaygın Belirtiler</Text>
        
        {symptomEntries.length > 0 ? (
          <View style={[styles.symptomsContainer, { backgroundColor: colors.card }]}>
            {symptomEntries.map(([symptom, count]) => (
              <View key={symptom} style={styles.symptomItem}>
                <View style={[styles.symptomBar, { backgroundColor: colors.neutral.light }]}>
                  <View 
                    style={[
                      styles.symptomBarFill, 
                      { 
                        width: `${(count / period.dailyLogs.length) * 100}%`,
                        backgroundColor: colors.primary.main
                      }
                    ]} 
                  />
                </View>
                <View style={styles.symptomLabelContainer}>
                  <Text style={[styles.symptomLabel, { color: colors.text }]}>
                    {SYMPTOM_LABELS[symptom] || symptom}
                  </Text>
                  <Text style={[styles.symptomCount, { color: colors.neutral.darkGray }]}>
                    {count} gün
                  </Text>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <Text style={[styles.noDataText, { color: colors.neutral.gray }]}>Belirti kaydı yok</Text>
        )}
      </View>
      
      <View style={styles.dailyLogsSection}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Günlük Kayıtlar</Text>
        
        {period.dailyLogs.map((log) => (
          <View key={log.date} style={[styles.logItem, { backgroundColor: colors.card }]}>
            <View style={styles.logHeader}>
              <Text style={[styles.logDate, { color: colors.text }]}>{format(parseISO(log.date), 'MMM d', { locale: tr })}</Text>
              {log.flow && (
                <View style={[
                  styles.flowBadge,
                  { backgroundColor: colors.primary[log.flow] }
                ]}>
                  <Text style={[styles.flowBadgeText, { color: colors.neutral.white }]}>
                    {FLOW_LABELS[log.flow] || log.flow}
                  </Text>
                </View>
              )}
            </View>
            
            <View style={styles.logDetails}>
              {log.mood && (
                <Text style={[styles.logDetailText, { color: colors.text }]}>
                  Ruh Hali: {MOOD_LABELS[log.mood] || log.mood}
                </Text>
              )}
              
              {log.symptoms && log.symptoms.length > 0 && log.symptoms[0] !== 'none' && (
                <Text style={[styles.logDetailText, { color: colors.text }]}>
                  Belirtiler: {log.symptoms.map(s => SYMPTOM_LABELS[s] || s).join(', ')}
                </Text>
              )}
              
              {log.notes && (
                <Text style={[styles.logNotes, { color: colors.neutral.darkGray }]}>
                  "{log.notes}"
                </Text>
              )}
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
  },
  backButton: {
    marginRight: SPACING.sm,
  },
  title: {
    fontFamily: FONT_FAMILY.bold,
    fontSize: FONT_SIZE.xl,
  },
  card: {
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    margin: SPACING.md,
    ...SHADOWS.medium,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  icon: {
    marginRight: SPACING.sm,
  },
  dateText: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: FONT_SIZE.lg,
  },
  durationBadge: {
    borderRadius: BORDER_RADIUS.round,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    alignSelf: 'flex-start',
  },
  durationText: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.sm,
  },
  activeBadge: {
    position: 'absolute',
    top: SPACING.md,
    right: SPACING.md,
    borderRadius: BORDER_RADIUS.round,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
  },
  activeText: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.xs,
  },
  summarySection: {
    margin: SPACING.md,
  },
  sectionTitle: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: FONT_SIZE.lg,
    marginBottom: SPACING.md,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  summaryItem: {
    width: '48%',
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOWS.small,
  },
  summaryLabel: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.sm,
    marginBottom: SPACING.xs,
  },
  summaryValue: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: FONT_SIZE.lg,
  },
  symptomsSection: {
    margin: SPACING.md,
  },
  symptomsContainer: {
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    ...SHADOWS.small,
  },
  symptomItem: {
    marginBottom: SPACING.md,
  },
  symptomBar: {
    height: 10,
    borderRadius: BORDER_RADIUS.round,
    overflow: 'hidden',
  },
  symptomBarFill: {
    height: '100%',
  },
  symptomLabelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.xs,
  },
  symptomLabel: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.sm,
  },
  symptomCount: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.sm,
  },
  dailyLogsSection: {
    margin: SPACING.md,
    marginBottom: SPACING.xl,
  },
  logItem: {
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOWS.small,
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  logDate: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: FONT_SIZE.md,
  },
  flowBadge: {
    borderRadius: BORDER_RADIUS.round,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
  },
  flowBadgeText: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.xs,
  },
  logDetails: {
    paddingTop: SPACING.xs,
  },
  logDetailText: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.md,
    marginBottom: SPACING.xs,
  },
  logNotes: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.md,
    fontStyle: 'italic',
    marginTop: SPACING.xs,
  },
  noDataText: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.md,
    textAlign: 'center',
    padding: SPACING.lg,
  },
});