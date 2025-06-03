import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView } from 'react-native';
import { usePeriodContext } from '@/context/PeriodContext';
import { useTheme } from '@/context/ThemeContext';
import { PeriodCalendar } from '@/components/PeriodCalendar';
import { FONT_FAMILY, FONT_SIZE, SPACING, BORDER_RADIUS } from '@/constants/theme';
import { DateData } from 'react-native-calendars';
import { format, parseISO } from 'date-fns';
import { Info } from 'lucide-react-native';
import { tr } from 'date-fns/locale';
import { router } from 'expo-router';

export default function CalendarScreen() {
  const { periods, currentPeriod } = usePeriodContext();
  const { colors } = useTheme();
  const [selectedDate, setSelectedDate] = React.useState<string | null>(null);
  
  const handleDayPress = (day: any) => {
    router.push({
      pathname: '/period-actions/details',
      params: { date: day.dateString }
    });
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
      return <Text style={[styles.noDataText, { color: colors.neutral.gray }]}>Belirti kaydı yok</Text>;
    }
    
    return symptoms.map((symptom, index) => {
      if (symptom === 'none') return null;
      
      return (
        <View key={index} style={[styles.symptomTag, { backgroundColor: colors.secondary.light }]}>
          <Text style={[styles.symptomText, { color: colors.secondary.dark }]}>{symptom}</Text>
        </View>
      );
    });
  };
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <PeriodCalendar 
        periods={periods}
        onDayPress={handleDayPress}
      />
      
      {selectedDate && (
        <View style={[styles.dateInfoCard, { 
          backgroundColor: colors.neutral.white,
          shadowColor: colors.neutral.black
        }]}>
          <Text style={[styles.dateTitle, { color: colors.primary.dark }]}>
            {format(parseISO(selectedDate), 'dd MMMM yyyy', { locale: tr })}
          </Text>
          
          {selectedLog ? (
            <View style={styles.logDetails}>
              {selectedLog.isActive && (
                <View style={[styles.activeBadge, { backgroundColor: colors.primary.light }]}>
                  <Text style={[styles.activeBadgeText, { color: colors.primary.dark }]}>Aktif Adet</Text>
                </View>
              )}
              
              {selectedLog.flow && (
                <View style={styles.detailRow}>
                  <Text style={[styles.detailLabel, { color: colors.neutral.darkGray }]}>Akış:</Text>
                  <Text style={[styles.detailValue, { color: colors.text }]}>
                    {selectedLog.flow.charAt(0).toUpperCase() + selectedLog.flow.slice(1)}
                  </Text>
                </View>
              )}
              
              {selectedLog.mood && (
                <View style={styles.detailRow}>
                  <Text style={[styles.detailLabel, { color: colors.neutral.darkGray }]}>Ruh Hali:</Text>
                  <Text style={[styles.detailValue, { color: colors.text }]}>
                    {selectedLog.mood.charAt(0).toUpperCase() + selectedLog.mood.slice(1)}
                  </Text>
                </View>
              )}
              
              <View style={styles.symptomsContainer}>
                <Text style={[styles.detailLabel, { color: colors.neutral.darkGray }]}>Belirtiler:</Text>
                <View style={styles.symptomsWrapper}>
                  {renderSymptomsList(selectedLog.symptoms)}
                </View>
              </View>
              
              {selectedLog.notes && (
                <View style={styles.notesContainer}>
                  <Text style={[styles.detailLabel, { color: colors.neutral.darkGray }]}>Notlar:</Text>
                  <Text style={[styles.notesText, { color: colors.text }]}>{selectedLog.notes}</Text>
                </View>
              )}
            </View>
          ) : (
            <View style={styles.noDataContainer}>
              <Info size={24} color={colors.neutral.gray} />
              <Text style={[styles.noDataText, { color: colors.neutral.gray }]}>Bu tarih için veri yok</Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SPACING.md,
  },
  dateInfoCard: {
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginTop: SPACING.md,
    marginBottom: SPACING.lg,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  dateTitle: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: FONT_SIZE.lg,
    marginBottom: SPACING.md,
  },
  logDetails: {
    marginTop: SPACING.xs,
  },
  activeBadge: {
    borderRadius: BORDER_RADIUS.round,
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.md,
    alignSelf: 'flex-start',
    marginBottom: SPACING.md,
  },
  activeBadgeText: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.sm,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  detailLabel: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.md,
    marginRight: SPACING.sm,
    width: 80,
  },
  detailValue: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.md,
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
    borderRadius: BORDER_RADIUS.round,
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    marginRight: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  symptomText: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.sm,
  },
  notesContainer: {
    marginTop: SPACING.sm,
  },
  notesText: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.md,
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
    marginTop: SPACING.sm,
    textAlign: 'center',
  },
});