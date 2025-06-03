import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { usePeriodContext } from '@/context/PeriodContext';
import { HistoryCard } from '@/components/HistoryCard';
import { COLORS, FONT_FAMILY, FONT_SIZE, SPACING, BORDER_RADIUS } from '@/constants/theme';
import { CalendarRange, FileText } from 'lucide-react-native';
import { router } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { format, parseISO, differenceInDays } from 'date-fns';
import { tr } from 'date-fns/locale';

export default function HistoryScreen() {
  const { periods } = usePeriodContext();
  const { colors } = useTheme();
  
  const handleViewPeriodDetails = (periodId: string) => {
    router.push({
      pathname: '/period-actions/details',
      params: { id: periodId }
    });
  };
  
  const calculateAverageDuration = () => {
    if (periods.length === 0) return 0;
    
    const completedPeriods = periods.filter(p => p.endDate);
    if (completedPeriods.length === 0) return 0;
    
    const totalDuration = completedPeriods.reduce((sum, period) => {
      const start = parseISO(period.startDate);
      const end = parseISO(period.endDate!);
      return sum + differenceInDays(end, start) + 1;
    }, 0);
    
    return Math.round(totalDuration / completedPeriods.length);
  };
  
  const calculateAverageCycle = () => {
    if (periods.length < 2) return 0;
    
    let totalDays = 0;
    let cycleCount = 0;
    
    for (let i = 1; i < periods.length; i++) {
      const currentStart = parseISO(periods[i].startDate);
      const prevStart = parseISO(periods[i - 1].startDate);
      totalDays += differenceInDays(currentStart, prevStart);
      cycleCount++;
    }
    
    return cycleCount > 0 ? Math.round(totalDays / cycleCount) : 0;
  };
  
  if (periods.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.title, { color: colors.text }]}>Geçmiş</Text>
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: colors.neutral.darkGray }]}>
            Henüz hiç adet kaydınız yok.{'\n'}
            Adet takibine başlayarak istatistiklerinizi görüntüleyebilirsiniz.
          </Text>
          <TouchableOpacity 
            style={[styles.startButton, { backgroundColor: colors.primary.main }]}
            onPress={() => router.push('/period-actions/start')}
          >
            <Text style={[styles.startButtonText, { color: colors.neutral.white }]}>
              Adet Takibine Başla
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
  
  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Geçmiş</Text>
      
      <View style={styles.statsContainer}>
        <View style={[styles.statCard, { 
          backgroundColor: colors.card,
          shadowColor: colors.neutral.black
        }]}>
          <Text style={[styles.statValue, { color: colors.primary.main }]}>
            {periods.length}
          </Text>
          <Text style={[styles.statLabel, { color: colors.neutral.darkGray }]}>
            Toplam Adet
          </Text>
        </View>
        
        <View style={[styles.statCard, { 
          backgroundColor: colors.card,
          shadowColor: colors.neutral.black
        }]}>
          <Text style={[styles.statValue, { color: colors.primary.main }]}>
            {calculateAverageDuration()}
          </Text>
          <Text style={[styles.statLabel, { color: colors.neutral.darkGray }]}>
            Ort. Süre
          </Text>
        </View>
        
        <View style={[styles.statCard, { 
          backgroundColor: colors.card,
          shadowColor: colors.neutral.black
        }]}>
          <Text style={[styles.statValue, { color: colors.primary.main }]}>
            {calculateAverageCycle()}
          </Text>
          <Text style={[styles.statLabel, { color: colors.neutral.darkGray }]}>
            Ort. Döngü
          </Text>
        </View>
      </View>
      
      <View style={styles.historyContainer}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Geçmiş Adetler
        </Text>
        
        {periods.map((period) => {
          const startDate = parseISO(period.startDate);
          const duration = period.endDate 
            ? differenceInDays(parseISO(period.endDate), startDate) + 1
            : differenceInDays(new Date(), startDate) + 1;
          
          return (
            <TouchableOpacity
              key={period.id}
              style={[styles.periodCard, { backgroundColor: colors.card }]}
              onPress={() => router.push(`/period-actions/details?id=${period.id}`)}
            >
              <View style={styles.periodHeader}>
                <Text style={[styles.periodDate, { color: colors.text }]}>
                  {format(startDate, 'MMMM d, yyyy', { locale: tr })}
                </Text>
                <Text style={[styles.periodDuration, { color: colors.primary.main }]}>
                  {duration} gün
                </Text>
              </View>
              
              {period.isActive && (
                <View style={[styles.activeTag, { backgroundColor: colors.success }]}>
                  <Text style={[styles.activeTagText, { color: colors.neutral.white }]}>
                    Aktif
                  </Text>
                </View>
              )}
              
              <View style={styles.periodStats}>
                <Text style={[styles.periodStat, { color: colors.neutral.darkGray }]}>
                  {period.dailyLogs.length} kayıt
                </Text>
                {period.endDate && (
                  <Text style={[styles.periodStat, { color: colors.neutral.darkGray }]}>
                    {format(parseISO(period.endDate), 'MMMM d', { locale: tr })}
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SPACING.md,
  },
  title: {
    fontFamily: FONT_FAMILY.bold,
    fontSize: FONT_SIZE.xl,
    marginBottom: SPACING.md,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.lg,
  },
  statCard: {
    flex: 1,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    alignItems: 'center',
    marginHorizontal: SPACING.xs,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statValue: {
    fontFamily: FONT_FAMILY.bold,
    fontSize: FONT_SIZE.xxl,
    marginVertical: SPACING.xs,
  },
  statLabel: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.sm,
  },
  historyContainer: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: FONT_SIZE.lg,
    marginBottom: SPACING.md,
  },
  periodCard: {
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  periodHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  periodDate: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: FONT_SIZE.md,
  },
  periodDuration: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.md,
  },
  activeTag: {
    position: 'absolute',
    top: SPACING.md,
    right: SPACING.md,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.round,
  },
  activeTagText: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.xs,
  },
  periodStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.xs,
  },
  periodStat: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.sm,
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
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  startButton: {
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
  },
  startButtonText: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.md,
  },
});