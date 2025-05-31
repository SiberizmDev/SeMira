import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import { PeriodRecord } from '@/types/period';
import { format, parseISO, eachDayOfInterval } from 'date-fns';
import { COLORS, FONT_FAMILY, SPACING, FONT_SIZE, BORDER_RADIUS } from '@/constants/theme';

interface PeriodCalendarProps {
  periods: PeriodRecord[];
  onDayPress?: (date: DateData) => void;
}

export const PeriodCalendar: React.FC<PeriodCalendarProps> = ({ periods, onDayPress }) => {
  // Generate marked dates for calendar
  const getMarkedDates = () => {
    const markedDates: Record<string, any> = {};
    
    periods.forEach(period => {
      if (!period.startDate) return;
      
      const startDate = parseISO(period.startDate);
      let endDate;
      
      if (period.endDate) {
        endDate = parseISO(period.endDate);
      } else if (period.isActive) {
        // If period is active and has no end date, use today as end date
        endDate = new Date();
      } else {
        // If no end date and not active, just mark the start date
        const dateString = format(startDate, 'yyyy-MM-dd');
        markedDates[dateString] = {
          selected: true,
          selectedColor: COLORS.primary.main,
        };
        return;
      }
      
      // Mark all days in the period
      const periodDays = eachDayOfInterval({ start: startDate, end: endDate });
      
      periodDays.forEach((day, index) => {
        const dateString = format(day, 'yyyy-MM-dd');
        const isStart = index === 0;
        const isEnd = index === periodDays.length - 1;
        
        if (isStart && isEnd) {
          // Single day period
          markedDates[dateString] = {
            selected: true,
            selectedColor: COLORS.primary.main,
          };
        } else if (isStart) {
          // First day of period
          markedDates[dateString] = {
            startingDay: true,
            color: COLORS.primary.main,
            textColor: COLORS.neutral.white,
          };
        } else if (isEnd) {
          // Last day of period
          markedDates[dateString] = {
            endingDay: true,
            color: COLORS.primary.main,
            textColor: COLORS.neutral.white,
          };
        } else {
          // Middle day of period
          markedDates[dateString] = {
            color: COLORS.primary.light,
            textColor: COLORS.primary.dark,
          };
        }
      });
    });
    
    return markedDates;
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Period Calendar</Text>
      <Calendar
        style={styles.calendar}
        theme={{
          backgroundColor: COLORS.background,
          calendarBackground: COLORS.background,
          textSectionTitleColor: COLORS.neutral.darkGray,
          selectedDayBackgroundColor: COLORS.primary.main,
          selectedDayTextColor: COLORS.neutral.white,
          todayTextColor: COLORS.primary.main,
          dayTextColor: COLORS.text,
          textDisabledColor: COLORS.neutral.gray,
          dotColor: COLORS.primary.main,
          selectedDotColor: COLORS.neutral.white,
          arrowColor: COLORS.primary.main,
          monthTextColor: COLORS.primary.dark,
          indicatorColor: COLORS.primary.main,
          textDayFontFamily: FONT_FAMILY.regular,
          textMonthFontFamily: FONT_FAMILY.semiBold,
          textDayHeaderFontFamily: FONT_FAMILY.medium,
          textDayFontSize: 16,
          textMonthFontSize: 18,
          textDayHeaderFontSize: 14,
        }}
        markingType="period"
        markedDates={getMarkedDates()}
        onDayPress={onDayPress}
        enableSwipeMonths={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: SPACING.md,
  },
  title: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: FONT_SIZE.lg,
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  calendar: {
    borderRadius: BORDER_RADIUS.md,
    overflow: 'hidden',
  },
});