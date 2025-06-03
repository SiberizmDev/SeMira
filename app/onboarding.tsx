import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { usePeriodContext } from '@/context/PeriodContext';
import { router } from 'expo-router';
import { COLORS, FONT_FAMILY, FONT_SIZE, SPACING, BORDER_RADIUS, SHADOWS } from '@/constants/theme';
import { Calendar, Clock, ChevronRight, Minus, Plus } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';

export default function OnboardingScreen() {
  const { completeOnboarding, setUserPreferences } = usePeriodContext();
  const { colors } = useTheme();
  const [step, setStep] = useState(1);
  const [cycleLength, setCycleLength] = useState(28);
  const [periodDuration, setPeriodDuration] = useState(5);
  
  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      setUserPreferences({
        cycleLength,
        typicalDuration: periodDuration,
      });
      completeOnboarding();
      router.replace('/');
    }
  };
  
  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };
  
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <View style={styles.stepContainer}>
            <Text style={[styles.title, { color: colors.text }]}>
              Hoş Geldin!
            </Text>
            <Text style={[styles.description, { color: colors.neutral.darkGray }]}>
              SeMira ile adet döngünü takip etmek çok kolay. Sana daha iyi bir deneyim sunabilmek için birkaç soru sormak istiyoruz.
            </Text>
          </View>
        );
      case 2:
        return (
          <View style={styles.stepContainer}>
            <Text style={[styles.title, { color: colors.text }]}>
              Adet Döngün
            </Text>
            <Text style={[styles.description, { color: colors.neutral.darkGray }]}>
              Tipik bir adet döngün kaç gün sürüyor? Emin değilsen endişelenme, varsayılan değeri kullanabilirsin.
            </Text>
            <View style={styles.durationSelector}>
              <TouchableOpacity
                style={[styles.durationButton, { backgroundColor: colors.primary.light }]}
                onPress={() => setCycleLength(Math.max(21, cycleLength - 1))}
              >
                <Minus size={24} color={colors.primary.dark} />
              </TouchableOpacity>
              <View style={styles.durationDisplay}>
                <Text style={[styles.durationValue, { color: colors.primary.main }]}>
                  {cycleLength}
                </Text>
                <Text style={[styles.durationLabel, { color: colors.neutral.darkGray }]}>
                  gün
                </Text>
              </View>
              <TouchableOpacity
                style={[styles.durationButton, { backgroundColor: colors.primary.light }]}
                onPress={() => setCycleLength(Math.min(35, cycleLength + 1))}
              >
                <Plus size={24} color={colors.primary.dark} />
              </TouchableOpacity>
            </View>
          </View>
        );
      case 3:
        return (
          <View style={styles.stepContainer}>
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
                onPress={() => setPeriodDuration(Math.min(7, periodDuration + 1))}
              >
                <Plus size={24} color={colors.primary.dark} />
              </TouchableOpacity>
            </View>
          </View>
        );
      default:
        return null;
    }
  };
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        {renderStep()}
        
        <View style={styles.footer}>
          {step > 1 && (
            <TouchableOpacity
              style={[styles.backButton]}
              onPress={handleBack}
            >
              <Text style={[styles.backButtonText, { color: colors.neutral.darkGray }]}>
                Geri
              </Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity
            style={[styles.nextButton, { backgroundColor: colors.primary.main }]}
            onPress={handleNext}
          >
            <Text style={[styles.nextButtonText, { color: colors.neutral.white }]}>
              {step === 3 ? 'Başla' : 'Devam'}
            </Text>
          </TouchableOpacity>
        </View>
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
    justifyContent: 'space-between',
    padding: SPACING.lg,
  },
  stepContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontFamily: FONT_FAMILY.bold,
    fontSize: FONT_SIZE.xxl,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  description: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.md,
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
  },
  backButtonText: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.md,
  },
  nextButton: {
    flex: 1,
    marginLeft: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  nextButtonText: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.md,
  },
  durationSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SPACING.md,
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
});