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
import { useTheme } from '@/context/ThemeContext';

export default function StartPeriodScreen() {
  const { startPeriod } = usePeriodContext();
  const { colors } = useTheme();
  const [mood, setMood] = useState<MoodType | undefined>(undefined);
  const [flow, setFlow] = useState<FlowLevel | undefined>(undefined);
  const [symptoms, setSymptoms] = useState<SymptomType[]>([]);
  const [notes, setNotes] = useState('');
  
  const handleSymptomSelect = (symptom: SymptomType) => {
    if (symptoms.includes(symptom)) {
      setSymptoms(symptoms.filter(s => s !== symptom));
    } else {
      setSymptoms([...symptoms, symptom]);
    }
  };
  
  const handleStartPeriod = async () => {
    if (!flow) {
      Alert.alert('Eksik Bilgi', 'Lütfen akış seviyeni seç');
      return;
    }
    
    try {
      await startPeriod({
        flow,
        mood,
        symptoms,
        notes: notes.trim() || undefined
      });
      
      router.replace('/');
    } catch (error) {
      console.error('Error starting period:', error);
      Alert.alert('Hata', 'Adet takibi başlatılırken bir hata oluştu');
    }
  };
  
  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>Adet Takibini Başlat</Text>
        <Text style={[styles.subtitle, { color: colors.neutral.darkGray }]}>
          Adetinin ilk gününde nasıl hissettiğini kaydedelim
        </Text>
        
        <FlowSelector selectedFlow={flow} onSelectFlow={setFlow} />
        
        <MoodSelector selectedMood={mood} onSelectMood={setMood} />
        
        <SymptomsSelector 
          selectedSymptoms={symptoms} 
          onSelectSymptom={handleSymptomSelect} 
        />
        
        <NotesInput 
          value={notes} 
          onChangeText={setNotes} 
          placeholder="Bugün nasıl hissediyorsun? Ekstra bir belirti var mı?"
        />
        
        <TouchableOpacity 
          style={[styles.startButton, { backgroundColor: colors.primary.main }]} 
          onPress={handleStartPeriod}
        >
          <Text style={[styles.startButtonText, { color: colors.neutral.white }]}>
            Adeti Başlat
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
  startButton: {
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    marginTop: SPACING.xl,
  },
  startButtonText: {
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