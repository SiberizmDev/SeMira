import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { useTheme } from '@/context/ThemeContext';
import { FONT_FAMILY } from '@/constants/theme';
import { Period } from '@/types/period';

// Takvim yerelleştirme ayarları
LocaleConfig.locales['tr'] = {
  monthNames: [
    'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
  ],
  monthNamesShort: ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'],
  dayNames: ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'],
  dayNamesShort: ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'],
  today: 'Bugün'
};
LocaleConfig.defaultLocale = 'tr';

interface PeriodCalendarProps {
  periods: Period[];
  onDayPress: (day: any) => void;
}

export const PeriodCalendar: React.FC<PeriodCalendarProps> = ({ periods, onDayPress }) => {
  const { colors, isDarkMode } = useTheme();
  
  const getMarkedDates = () => {
    const markedDates: any = {};
    
    periods.forEach(period => {
      if (period.startDate && period.endDate) {
        const start = new Date(period.startDate);
        const end = new Date(period.endDate);
        const dates = [];
        
        let currentDate = start;
        while (currentDate <= end) {
          dates.push(new Date(currentDate));
          currentDate.setDate(currentDate.getDate() + 1);
        }
        
        dates.forEach((date, index) => {
          const dateString = date.toISOString().split('T')[0];
          
          if (index === 0) {
            markedDates[dateString] = {
              startingDay: true,
              color: colors.primary.main,
              textColor: colors.neutral.white,
            };
          } else if (index === dates.length - 1) {
            markedDates[dateString] = {
              endingDay: true,
              color: colors.primary.main,
              textColor: colors.neutral.white,
            };
          } else {
            markedDates[dateString] = {
              color: colors.primary.main,
              textColor: colors.neutral.white,
            };
          }
        });
      }
    });
    
    return markedDates;
  };
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Calendar
        style={[styles.calendar, { backgroundColor: isDarkMode ? colors.card : colors.neutral.white }]}
        theme={{
          calendarBackground: isDarkMode ? colors.card : colors.neutral.white,
          monthTextColor: colors.text,
          textSectionTitleColor: colors.text,
          selectedDayBackgroundColor: colors.primary.main,
          selectedDayTextColor: colors.neutral.white,
          todayTextColor: colors.primary.main,
          dayTextColor: colors.text,
          textDisabledColor: isDarkMode ? colors.neutral.darkGray : colors.neutral.gray,
          dotColor: colors.primary.main,
          selectedDotColor: colors.neutral.white,
          arrowColor: colors.primary.main,
          indicatorColor: colors.primary.main,
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
        firstDay={1}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    marginHorizontal: 16,
    marginVertical: 8,
  },
  calendar: {
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
});