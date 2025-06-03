import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import { usePeriodContext } from '@/context/PeriodContext';
import { MoodSelector } from '@/components/MoodSelector';
import { FlowSelector } from '@/components/FlowSelector';
import { SymptomsSelector } from '@/components/SymptomsSelector';
import { NotesInput } from '@/components/NotesInput';
import { FONT_FAMILY, FONT_SIZE, SPACING, BORDER_RADIUS } from '@/constants/theme';
import { MoodType, FlowLevel, SymptomType } from '@/types/period';
import { format, parseISO, differenceInDays } from 'date-fns';
import { tr } from 'date-fns/locale';
import { useTheme } from '@/context/ThemeContext';

export default function DailyCheckScreen() {
  const { currentPeriod, addDailyLog } = usePeriodContext();
  const { colors } = useTheme();
  const [mood, setMood] = useState<MoodType | undefined>(undefined);
  const [flow, setFlow] = useState<FlowLevel | undefined>(undefined);
  const [symptoms, setSymptoms] = useState<SymptomType[]>([]);
  const [notes, setNotes] = useState('');
  
  if (!currentPeriod) {
    // Redirect if no active period
    router.replace('/');
    return null;
  }
  
  const startDate = parseISO(currentPeriod.startDate);
  const today = new Date();
  const dayCount = differenceInDays(today, startDate) + 1;
  
  const handleSymptomSelect = (symptom: SymptomType) => {
    if (symptoms.includes(symptom)) {
      setSymptoms(symptoms.filter(s => s !== symptom));
    } else {
      setSymptoms([...symptoms, symptom]);
    }
  };
  
  const handleSaveLog = async () => {
    if (!flow) {
      Alert.alert('Eksik Bilgi', 'Lütfen akış seviyenizi seçin');
      return;
    }
    
    try {
      await addDailyLog({
        flow,
        mood,
        symptoms,
        notes: notes.trim() || undefined
      });
      
      router.replace('/');
    } catch (error) {
      console.error('Günlük kayıt eklenirken hata:', error);
      Alert.alert('Hata', 'Günlük kontrolünüz kaydedilirken bir hata oluştu');
    }
  };
  
  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>Günlük Kontrol</Text>
        <Text style={[styles.subtitle, { color: colors.neutral.darkGray }]}>
          {dayCount}. Gününüz
        </Text>
        
        <View style={[styles.dayCard, { backgroundColor: colors.primary.light }]}>
          <Text style={[styles.dayCardTitle, { color: colors.primary.dark }]}>
            Bugün, {format(today, 'MMMM d', { locale: tr })}
          </Text>
          <Text style={[styles.dayCardText, { color: colors.text }]}>
            Bugün nasıl hissettiğinizi takip edelim.
          </Text>
        </View>
        
        <FlowSelector selectedFlow={flow} onSelectFlow={setFlow} />
        
        <MoodSelector selectedMood={mood} onSelectMood={setMood} />
        
        <SymptomsSelector 
          selectedSymptoms={symptoms} 
          onSelectSymptom={handleSymptomSelect} 
        />
        
        <NotesInput 
          value={notes} 
          onChangeText={setNotes} 
          placeholder="Bugün nasıl hissettiğiniz hakkında ek notlarınız varsa buraya yazınız."
        />
        
        <TouchableOpacity 
          style={[styles.saveButton, { backgroundColor: colors.primary.main }]} 
          onPress={handleSaveLog}
        >
          <Text style={[styles.saveButtonText, { color: colors.neutral.white }]}>
            Kaydet
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.cancelButton} 
          onPress={() => router.back()}
        >
          <Text style={[styles.cancelButtonText, { color: colors.neutral.darkGray }]}>
            İptal
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: SPACING.lg,
  },
  title: {
    fontFamily: FONT_FAMILY.bold,
    fontSize: FONT_SIZE.xl,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.md,
    marginBottom: SPACING.lg,
  },
  dayCard: {
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
  },
  dayCardTitle: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: FONT_SIZE.md,
    marginBottom: SPACING.xs,
  },
  dayCardText: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.md,
  },
  saveButton: {
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    marginTop: SPACING.xl,
  },
  saveButtonText: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.lg,
  },
  cancelButton: {
    paddingVertical: SPACING.md,
    alignItems: 'center',
    marginTop: SPACING.md,
  },
  cancelButtonText: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.md,
  },
});