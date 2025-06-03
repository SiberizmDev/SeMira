import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { differenceInDays, format, parseISO } from 'date-fns';
import { usePeriodContext } from '@/context/PeriodContext';
import { FONT_FAMILY, FONT_SIZE, SPACING, BORDER_RADIUS, SHADOWS } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';
import { Calendar, Bell } from 'lucide-react-native';
import { tr } from 'date-fns/locale';

interface PeriodStatusCardProps {
  onStartPress: () => void;
  onEndPress: () => void;
}

export const PeriodStatusCard: React.FC<PeriodStatusCardProps> = ({
  onStartPress,
  onEndPress
}) => {
  const { currentPeriod, periods, userPreferences } = usePeriodContext();
  const { colors } = useTheme();
  
  if (!currentPeriod) {
    return (
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Adet Takibi</Text>
        </View>
        <Text style={[styles.subtitle, { color: colors.neutral.darkGray }]}>
          Henüz aktif bir adet takibi yok
        </Text>
        <TouchableOpacity 
          style={[styles.button, { backgroundColor: colors.primary.main }]} 
          onPress={onStartPress}
        >
          <Text style={[styles.buttonText, { color: colors.neutral.white }]}>
            Adet Takibini Başlat
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  const startDate = parseISO(currentPeriod.startDate);
  const dayCount = differenceInDays(new Date(), startDate) + 1;
  
  return (
    <View style={[styles.card, { backgroundColor: colors.card }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Aktif Adet</Text>
        <View style={[styles.badge, { backgroundColor: colors.primary.main }]}>
          <Text style={[styles.badgeText, { color: colors.neutral.white }]}>
            {dayCount}. Gün
          </Text>
        </View>
      </View>
      <Text style={[styles.subtitle, { color: colors.neutral.darkGray }]}>
        Başlangıç: {format(startDate, 'd MMMM', { locale: tr })}
      </Text>
      <TouchableOpacity 
        style={[styles.button, { backgroundColor: colors.primary.main }]} 
        onPress={onEndPress}
      >
        <Text style={[styles.buttonText, { color: colors.neutral.white }]}>
          Adeti Bitir
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
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
  },
  badge: {
    borderRadius: BORDER_RADIUS.round,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
  },
  badgeText: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.sm,
  },
  subtitle: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.md,
    marginBottom: SPACING.md,
  },
  button: {
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    marginTop: SPACING.md,
  },
  buttonText: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.md,
  },
});