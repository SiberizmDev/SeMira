import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { usePeriodContext } from '@/context/PeriodContext';
import { COLORS, FONT_FAMILY, FONT_SIZE, SPACING, BORDER_RADIUS, SHADOWS } from '@/constants/theme';
import { format, parseISO, differenceInDays } from 'date-fns';
import { Calendar, Activity, ArrowLeft } from 'lucide-react-native';

interface PeriodDetailsParams {
  id: string;
}

export default function PeriodDetailsScreen() {
  const { id } = useLocalSearchParams<PeriodDetailsParams>();
  const { periods } = usePeriodContext();
  
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
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={COLORS.primary.main} />
        </TouchableOpacity>
        <Text style={styles.title}>Period Details</Text>
      </View>
      
      <View style={styles.card}>
        <View style={styles.dateRow}>
          <Calendar size={20} color={COLORS.primary.main} style={styles.icon} />
          <Text style={styles.dateText}>
            {format(startDate, 'MMMM d, yyyy')}
            {period.endDate && ` - ${format(parseISO(period.endDate), 'MMMM d, yyyy')}`}
          </Text>
        </View>
        
        <View style={styles.durationBadge}>
          <Text style={styles.durationText}>{duration} days</Text>
        </View>
        
        {period.isActive && (
          <View style={styles.activeBadge}>
            <Text style={styles.activeText}>Currently Active</Text>
          </View>
        )}
      </View>
      
      <View style={styles.summarySection}>
        <Text style={styles.sectionTitle}>Summary</Text>
        
        <View style={styles.summaryGrid}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Duration</Text>
            <Text style={styles.summaryValue}>{duration} days</Text>
          </View>
          
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Most Common Flow</Text>
            <Text style={[
              styles.summaryValue,
              flowEntries.length > 0 && styles[`flow${flowEntries[0][0].charAt(0).toUpperCase() + flowEntries[0][0].slice(1)}`]
            ]}>
              {flowEntries.length > 0 
                ? flowEntries[0][0].charAt(0).toUpperCase() + flowEntries[0][0].slice(1)
                : 'N/A'}
            </Text>
          </View>
          
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Most Common Mood</Text>
            <Text style={styles.summaryValue}>
              {moodEntries.length > 0 
                ? moodEntries[0][0].charAt(0).toUpperCase() + moodEntries[0][0].slice(1)
                : 'N/A'}
            </Text>
          </View>
          
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Days Logged</Text>
            <Text style={styles.summaryValue}>{period.dailyLogs.length}</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.symptomsSection}>
        <Text style={styles.sectionTitle}>Common Symptoms</Text>
        
        {symptomEntries.length > 0 ? (
          <View style={styles.symptomsContainer}>
            {symptomEntries.map(([symptom, count]) => (
              <View key={symptom} style={styles.symptomItem}>
                <View style={styles.symptomBar}>
                  <View 
                    style={[
                      styles.symptomBarFill, 
                      { width: `${(count / period.dailyLogs.length) * 100}%` }
                    ]} 
                  />
                </View>
                <View style={styles.symptomLabelContainer}>
                  <Text style={styles.symptomLabel}>
                    {symptom.charAt(0).toUpperCase() + symptom.slice(1)}
                  </Text>
                  <Text style={styles.symptomCount}>
                    {count} {count === 1 ? 'day' : 'days'}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.noDataText}>No symptoms recorded</Text>
        )}
      </View>
      
      <View style={styles.dailyLogsSection}>
        <Text style={styles.sectionTitle}>Daily Logs</Text>
        
        {period.dailyLogs.map((log) => (
          <View key={log.date} style={styles.logItem}>
            <View style={styles.logHeader}>
              <Text style={styles.logDate}>{format(parseISO(log.date), 'MMM d')}</Text>
              {log.flow && (
                <View style={[
                  styles.flowBadge,
                  styles[`flowBadge${log.flow.charAt(0).toUpperCase() + log.flow.slice(1)}`]
                ]}>
                  <Text style={styles.flowBadgeText}>
                    {log.flow.charAt(0).toUpperCase() + log.flow.slice(1)}
                  </Text>
                </View>
              )}
            </View>
            
            <View style={styles.logDetails}>
              {log.mood && (
                <Text style={styles.logDetailText}>
                  Mood: {log.mood.charAt(0).toUpperCase() + log.mood.slice(1)}
                </Text>
              )}
              
              {log.symptoms && log.symptoms.length > 0 && log.symptoms[0] !== 'none' && (
                <Text style={styles.logDetailText}>
                  Symptoms: {log.symptoms.join(', ')}
                </Text>
              )}
              
              {log.notes && (
                <Text style={styles.logNotes}>"{log.notes}"</Text>
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
    backgroundColor: COLORS.background,
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
    color: COLORS.text,
  },
  card: {
    backgroundColor: COLORS.neutral.white,
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
    color: COLORS.text,
  },
  durationBadge: {
    backgroundColor: COLORS.primary.light,
    borderRadius: BORDER_RADIUS.round,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    alignSelf: 'flex-start',
  },
  durationText: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.sm,
    color: COLORS.primary.dark,
  },
  activeBadge: {
    position: 'absolute',
    top: SPACING.md,
    right: SPACING.md,
    backgroundColor: COLORS.success,
    borderRadius: BORDER_RADIUS.round,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
  },
  activeText: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.xs,
    color: COLORS.neutral.white,
  },
  summarySection: {
    margin: SPACING.md,
  },
  sectionTitle: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: FONT_SIZE.lg,
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  summaryItem: {
    width: '48%',
    backgroundColor: COLORS.neutral.white,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOWS.small,
  },
  summaryLabel: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.sm,
    color: COLORS.neutral.darkGray,
    marginBottom: SPACING.xs,
  },
  summaryValue: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: FONT_SIZE.lg,
    color: COLORS.text,
  },
  flowLight: {
    color: COLORS.primary.light,
  },
  flowMedium: {
    color: COLORS.primary.main,
  },
  flowHeavy: {
    color: COLORS.primary.dark,
  },
  symptomsSection: {
    margin: SPACING.md,
  },
  symptomsContainer: {
    backgroundColor: COLORS.neutral.white,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    ...SHADOWS.small,
  },
  symptomItem: {
    marginBottom: SPACING.md,
  },
  symptomBar: {
    height: 10,
    backgroundColor: COLORS.neutral.light,
    borderRadius: BORDER_RADIUS.round,
    overflow: 'hidden',
  },
  symptomBarFill: {
    height: '100%',
    backgroundColor: COLORS.primary.main,
  },
  symptomLabelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.xs,
  },
  symptomLabel: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.sm,
    color: COLORS.text,
  },
  symptomCount: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.sm,
    color: COLORS.neutral.darkGray,
  },
  dailyLogsSection: {
    margin: SPACING.md,
    marginBottom: SPACING.xl,
  },
  logItem: {
    backgroundColor: COLORS.neutral.white,
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
    color: COLORS.text,
  },
  flowBadge: {
    borderRadius: BORDER_RADIUS.round,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
  },
  flowBadgeLight: {
    backgroundColor: COLORS.primary.light,
  },
  flowBadgeMedium: {
    backgroundColor: COLORS.primary.main,
  },
  flowBadgeHeavy: {
    backgroundColor: COLORS.primary.dark,
  },
  flowBadgeText: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.xs,
    color: COLORS.neutral.white,
  },
  logDetails: {
    paddingTop: SPACING.xs,
  },
  logDetailText: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.md,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  logNotes: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.md,
    color: COLORS.neutral.darkGray,
    fontStyle: 'italic',
    marginTop: SPACING.xs,
  },
  noDataText: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.md,
    color: COLORS.neutral.gray,
    textAlign: 'center',
    padding: SPACING.lg,
  },
});