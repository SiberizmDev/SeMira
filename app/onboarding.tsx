import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { usePeriodContext } from '@/context/PeriodContext';
import { router } from 'expo-router';
import { COLORS, FONT_FAMILY, FONT_SIZE, SPACING, BORDER_RADIUS, SHADOWS } from '@/constants/theme';
import { Calendar, Clock, ChevronRight } from 'lucide-react-native';

export default function OnboardingScreen() {
  const { setUserPreferences, completeOnboarding } = usePeriodContext();
  const [step, setStep] = useState(1);
  const [cycleDuration, setCycleDuration] = useState(28);
  const [periodDuration, setPeriodDuration] = useState(5);
  
  const handleComplete = async () => {
    await setUserPreferences({
      typicalDuration: periodDuration,
      cycleLength: cycleDuration,
    });
    
    await completeOnboarding();
    router.replace('/');
  };
  
  const renderStep1 = () => (
    <>
      <View style={styles.header}>
        <Calendar size={48} color={COLORS.primary.main} />
        <Text style={styles.title}>Adet Takipçisine Hoş Geldin</Text>
        <Text style={styles.subtitle}>
          Kişiselleştirilmiş takip için profilini oluşturalım
        </Text>
      </View>
      
      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>Nasıl çalışır?</Text>
        <Text style={styles.infoText}>
          • Günlük kayıtlarla adetini takip et{ '\n' }
          • Faydalı ipuçları ve bilgiler al{ '\n' }
          • Döngü geçmişini ve desenlerini görüntüle{ '\n' }
          • Yaklaşan adetleri tahmin et
        </Text>
      </View>
      
      <TouchableOpacity style={styles.button} onPress={() => setStep(2)}>
        <Text style={styles.buttonText}>Başlayalım</Text>
        <ChevronRight size={20} color={COLORS.neutral.white} />
      </TouchableOpacity>
    </>
  );
  
  const renderStep2 = () => (
    <>
      <View style={styles.header}>
        <Clock size={48} color={COLORS.primary.main} />
        <Text style={styles.title}>Döngün</Text>
        <Text style={styles.subtitle}>
          Tipik döngünü anlamamıza yardımcı ol
        </Text>
      </View>
      
      <View style={styles.settingContainer}>
        <Text style={styles.settingTitle}>Döngün kaç gün sürüyor?</Text>
        <Text style={styles.settingSubtitle}>
          Bir adetin ilk gününden bir sonraki adetin ilk gününe kadar geçen gün sayısı
        </Text>
        
        <View style={styles.durationSelector}>
          <TouchableOpacity
            style={styles.durationButton}
            onPress={() => setCycleDuration(Math.max(21, cycleDuration - 1))}
          >
            <Text style={styles.durationButtonText}>-</Text>
          </TouchableOpacity>
          
          <View style={styles.durationDisplay}>
            <Text style={styles.durationValue}>{cycleDuration}</Text>
            <Text style={styles.durationLabel}>gün</Text>
          </View>
          
          <TouchableOpacity
            style={styles.durationButton}
            onPress={() => setCycleDuration(Math.min(35, cycleDuration + 1))}
          >
            <Text style={styles.durationButtonText}>+</Text>
          </TouchableOpacity>
        </View>
        
        <Text style={[styles.settingTitle, { marginTop: SPACING.xl }]}>Adetin genellikle kaç gün sürüyor?</Text>
        
        <View style={styles.durationSelector}>
          <TouchableOpacity
            style={styles.durationButton}
            onPress={() => setPeriodDuration(Math.max(2, periodDuration - 1))}
          >
            <Text style={styles.durationButtonText}>-</Text>
          </TouchableOpacity>
          
          <View style={styles.durationDisplay}>
            <Text style={styles.durationValue}>{periodDuration}</Text>
            <Text style={styles.durationLabel}>gün</Text>
          </View>
          
          <TouchableOpacity
            style={styles.durationButton}
            onPress={() => setPeriodDuration(Math.min(10, periodDuration + 1))}
          >
            <Text style={styles.durationButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <TouchableOpacity style={styles.button} onPress={handleComplete}>
        <Text style={styles.buttonText}>Kurulumu Tamamla</Text>
        <ChevronRight size={20} color={COLORS.neutral.white} />
      </TouchableOpacity>
    </>
  );
  
  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
    >
      {step === 1 ? renderStep1() : renderStep2()}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: SPACING.lg,
    flexGrow: 1,
  },
  header: {
    alignItems: 'center',
    marginTop: SPACING.xl,
    marginBottom: SPACING.lg,
  },
  title: {
    fontFamily: FONT_FAMILY.bold,
    fontSize: FONT_SIZE.xxxl,
    color: COLORS.text,
    marginTop: SPACING.md,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.md,
    color: COLORS.neutral.darkGray,
    textAlign: 'center',
    marginTop: SPACING.sm,
    marginHorizontal: SPACING.md,
  },
  infoCard: {
    backgroundColor: COLORS.neutral.light,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginVertical: SPACING.lg,
    ...SHADOWS.small,
  },
  infoTitle: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: FONT_SIZE.lg,
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  infoText: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.md,
    color: COLORS.neutral.darkGray,
    lineHeight: 24,
  },
  button: {
    backgroundColor: COLORS.primary.main,
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: SPACING.lg,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buttonText: {
    fontFamily: FONT_FAMILY.medium,
    color: COLORS.neutral.white,
    fontSize: FONT_SIZE.lg,
    marginRight: SPACING.sm,
  },
  settingContainer: {
    marginVertical: SPACING.lg,
  },
  settingTitle: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: FONT_SIZE.lg,
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  settingSubtitle: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.sm,
    color: COLORS.neutral.darkGray,
    marginBottom: SPACING.md,
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
    backgroundColor: COLORS.primary.light,
    alignItems: 'center',
    justifyContent: 'center',
  },
  durationButtonText: {
    fontFamily: FONT_FAMILY.bold,
    fontSize: 24,
    color: COLORS.primary.dark,
  },
  durationDisplay: {
    alignItems: 'center',
    marginHorizontal: SPACING.lg,
  },
  durationValue: {
    fontFamily: FONT_FAMILY.bold,
    fontSize: FONT_SIZE.xxxl,
    color: COLORS.primary.main,
  },
  durationLabel: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.md,
    color: COLORS.neutral.darkGray,
  },
});