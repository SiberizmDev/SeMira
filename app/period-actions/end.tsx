import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import { usePeriodContext } from '@/context/PeriodContext';
import { MoodSelector } from '@/components/MoodSelector';
import { FlowSelector } from '@/components/FlowSelector';
import { SymptomsSelector } from '@/components/SymptomsSelector';
import { NotesInput } from '@/components/NotesInput';
import { COLORS, FONT_FAMILY, FONT_SIZE, SPACING, BORDER_RADIUS } from '@/constants/theme';
import { MoodType, FlowLevel, SymptomType } from '@/types/period';
import { format, parseISO, differenceInDays } from 'date-fns';
import { tr } from 'date-fns/locale';
import { useTheme } from '@/context/ThemeContext';

export default function EndPeriodScreen() {
  const { currentPeriod, endPeriod } = usePeriodContext();
  const { colors } = useTheme();
  const [mood, setMood] = useState<MoodType | undefined>(undefined);
  const [flow, setFlow] = useState<FlowLevel | undefined>('light');
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
  
  const handleEndPeriod = async () => {
    try {
      await endPeriod({
        flow,
        mood,
        symptoms,
        notes: notes.trim() || undefined
      });
      
      router.replace('/');
    } catch (error) {
      console.error('Error ending period:', error);
      Alert.alert('Hata', 'Adet takibi bitirilirken bir hata oluştu');
    }
  };
  
  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>Adet Dönemini Bitir</Text>
        <Text style={[styles.subtitle, { color: colors.neutral.darkGray }]}>
          Adet döneminizi bitirmek istediğinizden emin misiniz?
        </Text>
        
        <View style={[styles.summaryCard, { 
          backgroundColor: colors.neutral.light,
          borderLeftColor: colors.primary.main 
        }]}>
          <Text style={[styles.summaryTitle, { color: colors.text }]}>
            Adet Özeti
          </Text>
          <Text style={[styles.summaryText, { color: colors.neutral.darkGray }]}>
            Başlangıç: {format(startDate, 'd MMMM yyyy', { locale: tr })}
          </Text>
          <Text style={[styles.summaryText, { color: colors.neutral.darkGray }]}>
            Süre: {dayCount} gün
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
          placeholder="Adetin biterken nasıl hissediyorsun?"
        />
        
        <TouchableOpacity 
          style={[styles.endButton, { backgroundColor: colors.primary.main }]} 
          onPress={handleEndPeriod}
        >
          <Text style={[styles.endButtonText, { color: colors.neutral.white }]}>
            Adeti Bitir
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
  summaryCard: {
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
    borderLeftWidth: 4,
  },
  summaryTitle: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: FONT_SIZE.md,
    marginBottom: SPACING.xs,
  },
  summaryText: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.md,
  },
  endButton: {
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    marginTop: SPACING.xl,
  },
  endButtonText: {
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