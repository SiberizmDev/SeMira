import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { usePeriodContext } from '@/context/PeriodContext';
import { FONT_FAMILY, FONT_SIZE, SPACING, BORDER_RADIUS } from '@/constants/theme';
import { Minus, Plus } from 'lucide-react-native';
import { router } from 'expo-router';

export default function PeriodDurationScreen() {
  const { colors, isDarkMode } = useTheme();
  const { userPreferences, setUserPreferences } = usePeriodContext();
  const [periodDuration, setPeriodDuration] = useState(userPreferences?.typicalDuration || 5);

  const handleSave = () => {
    if (!userPreferences) return;
    
    setUserPreferences({
      ...userPreferences,
      typicalDuration: periodDuration,
    });
    router.back();
  };

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? colors.background : colors.neutral.light }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>
          Adet Süresi
        </Text>
        <Text style={[styles.description, { color: colors.neutral.darkGray }]}>
          Adetin genellikle kaç gün sürüyor? Bu da değişebilir, ortalama bir değer seç.
        </Text>
        
        <View style={styles.durationSelector}>
          <TouchableOpacity
            style={[styles.durationButton, { backgroundColor: colors.primary.light }]}
            onPress={() => setPeriodDuration(Math.max(3, periodDuration - 1))}
          >
            <Minus size={24} color={colors.primary.dark} />
          </TouchableOpacity>
          
          <View style={styles.durationDisplay}>
            <Text style={[styles.durationValue, { color: colors.primary.main }]}>
              {periodDuration}
            </Text>
            <Text style={[styles.durationLabel, { color: colors.neutral.darkGray }]}>
              gün
            </Text>
          </View>
          
          <TouchableOpacity
            style={[styles.durationButton, { backgroundColor: colors.primary.light }]}
            onPress={() => setPeriodDuration(Math.min(10, periodDuration + 1))}
          >
            <Plus size={24} color={colors.primary.dark} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.cancelButton]}
          onPress={() => router.back()}
        >
          <Text style={[styles.cancelButtonText, { color: colors.neutral.darkGray }]}>
            İptal
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.saveButton, { backgroundColor: colors.primary.main }]}
          onPress={handleSave}
        >
          <Text style={[styles.saveButtonText, { color: colors.neutral.white }]}>
            Kaydet
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: SPACING.lg,
  },
  title: {
    fontFamily: FONT_FAMILY.bold,
    fontSize: FONT_SIZE.xl,
    marginBottom: SPACING.xs,
  },
  description: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.md,
    marginBottom: SPACING.xl,
  },
  durationSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SPACING.xl,
  },
  durationButton: {
    width: 50,
    height: 50,
    borderRadius: BORDER_RADIUS.round,
    alignItems: 'center',
    justifyContent: 'center',
  },
  durationDisplay: {
    alignItems: 'center',
    marginHorizontal: SPACING.lg,
  },
  durationValue: {
    fontFamily: FONT_FAMILY.bold,
    fontSize: FONT_SIZE.xxxl,
  },
  durationLabel: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.md,
  },
  footer: {
    flexDirection: 'row',
    padding: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.md,
  },
  saveButton: {
    flex: 2,
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    marginLeft: SPACING.md,
  },
  saveButtonText: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.md,
  },
}); 