import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView } from 'react-native';
import { usePeriodContext } from '@/context/PeriodContext';
import { PeriodCalendar } from '@/components/PeriodCalendar';
import { COLORS, FONT_FAMILY, FONT_SIZE, SPACING, BORDER_RADIUS } from '@/constants/theme';
import { DateData } from 'react-native-calendars';
import { format, parseISO } from 'date-fns';
import { Info } from 'lucide-react-native';

export default function CalendarScreen() {
  const { periods, currentPeriod } = usePeriodContext();
  const [selectedDate, setSelectedDate] = React.useState<string | null>(null);
  
  const handleDayPress = (date: DateData) => {
    setSelectedDate(date.dateString);
  };
  
  // Find log for the selected date if it exists
  const getLogForSelectedDate = () => {
    if (!selectedDate) return null;
    
    // Check all periods for logs on the selected date
    for (const period of periods) {
      const log = period.dailyLogs.find(l => l.date === selectedDate);
      if (log) {
        return {
          ...log,
          isActive: period.isActive,
          periodStartDate: period.startDate,
        };
      }
    }
    
    return null;
  };
  
  const selectedLog = getLogForSelectedDate();
  
  const renderSymptomsList = (symptoms: string[]) => {
    if (symptoms.length === 0 || (symptoms.length === 1 && symptoms[0] === 'none')) {
      return <Text style={styles.noDataText}>No symptoms recorded</Text>;
    }
    
    return symptoms.map((symptom, index) => {
      if (symptom === 'none') return null;
      
      return (
        <View key={index} style={styles.symptomTag}>
          <Text style={styles.symptomText}>{symptom}</Text>
        </View>
      );
    });
  };
  
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Your Cycle Calendar</Text>
      
      <PeriodCalendar periods={periods} onDayPress={handleDayPress} />
      
      {selectedDate && (
        <View style={styles.dateInfoCard}>
          <Text style={styles.dateTitle}>
            {format(parseISO(selectedDate), 'MMMM d, yyyy')}
          </Text>
          
          {selectedLog ? (
            <View style={styles.logDetails}>
              {selectedLog.isActive && (
                <View style={styles.activeBadge}>
                  <Text style={styles.activeBadgeText}>Active Period</Text>
                </View>
              )}
              
              {selectedLog.flow && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Flow:</Text>
                  <Text style={[
                    styles.detailValue,
                    styles[`flow${selectedLog.flow.charAt(0).toUpperCase() + selectedLog.flow.slice(1)}`]
                  ]}>
                    {selectedLog.flow.charAt(0).toUpperCase() + selectedLog.flow.slice(1)}
                  </Text>
                </View>
              )}
              
              {selectedLog.mood && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Mood:</Text>
                  <Text style={styles.detailValue}>
                    {selectedLog.mood.charAt(0).toUpperCase() + selectedLog.mood.slice(1)}
                  </Text>
                </View>
              )}
              
              <View style={styles.symptomsContainer}>
                <Text style={styles.detailLabel}>Symptoms:</Text>
                <View style={styles.symptomsWrapper}>
                  {renderSymptomsList(selectedLog.symptoms)}
                </View>
              </View>
              
              {selectedLog.notes && (
                <View style={styles.notesContainer}>
                  <Text style={styles.detailLabel}>Notes:</Text>
                  <Text style={styles.notesText}>{selectedLog.notes}</Text>
                </View>
              )}
            </View>
          ) : (
            <View style={styles.noDataContainer}>
              <Info size={24} color={COLORS.neutral.gray} />
              <Text style={styles.noDataText}>No data recorded for this date</Text>
            </View>
          )}
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
  dateInfoCard: {
    backgroundColor: COLORS.neutral.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginTop: SPACING.md,
    marginBottom: SPACING.lg,
    shadowColor: COLORS.neutral.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  dateTitle: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: FONT_SIZE.lg,
    color: COLORS.primary.dark,
    marginBottom: SPACING.md,
  },
  logDetails: {
    marginTop: SPACING.xs,
  },
  activeBadge: {
    backgroundColor: COLORS.primary.light,
    borderRadius: BORDER_RADIUS.round,
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.md,
    alignSelf: 'flex-start',
    marginBottom: SPACING.md,
  },
  activeBadgeText: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.sm,
    color: COLORS.primary.dark,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  detailLabel: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.md,
    color: COLORS.neutral.darkGray,
    marginRight: SPACING.sm,
    width: 80,
  },
  detailValue: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.md,
    color: COLORS.text,
  },
  flowLight: {
    color: COLORS.primary.light,
    fontFamily: FONT_FAMILY.medium,
  },
  flowMedium: {
    color: COLORS.primary.main,
    fontFamily: FONT_FAMILY.medium,
  },
  flowHeavy: {
    color: COLORS.primary.dark,
    fontFamily: FONT_FAMILY.semiBold,
  },
  symptomsContainer: {
    marginBottom: SPACING.sm,
  },
  symptomsWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: SPACING.xs,
  },
  symptomTag: {
    backgroundColor: COLORS.secondary.light,
    borderRadius: BORDER_RADIUS.round,
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    marginRight: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  symptomText: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.sm,
    color: COLORS.secondary.dark,
  },
  notesContainer: {
    marginTop: SPACING.sm,
  },
  notesText: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.md,
    color: COLORS.text,
    marginTop: SPACING.xs,
    fontStyle: 'italic',
  },
  noDataContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xl,
  },
  noDataText: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.md,
    color: COLORS.neutral.gray,
    marginTop: SPACING.sm,
    textAlign: 'center',
  },
});