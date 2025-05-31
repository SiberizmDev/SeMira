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

export default function EndPeriodScreen() {
  const { currentPeriod, endPeriod } = usePeriodContext();
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
      Alert.alert('Error', 'There was an error ending your period tracking');
    }
  };
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>End Period Tracking</Text>
        <Text style={styles.subtitle}>
          Your period has been active for {dayCount} days (started on {format(startDate, 'MMM d')})
        </Text>
        
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Period Summary</Text>
          <Text style={styles.summaryText}>
            You've tracked {currentPeriod.dailyLogs.length} days of this period. Adding final details will help provide better insights.
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
          placeholder="How are you feeling now that your period is ending?"
        />
        
        <TouchableOpacity 
          style={styles.endButton} 
          onPress={handleEndPeriod}
        >
          <Text style={styles.endButtonText}>End Period</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.cancelButton} 
          onPress={() => router.back()}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: SPACING.lg,
  },
  title: {
    fontFamily: FONT_FAMILY.bold,
    fontSize: FONT_SIZE.xl,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.md,
    color: COLORS.neutral.darkGray,
    marginBottom: SPACING.lg,
  },
  summaryCard: {
    backgroundColor: COLORS.neutral.light,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary.main,
  },
  summaryTitle: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: FONT_SIZE.md,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  summaryText: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.md,
    color: COLORS.neutral.darkGray,
  },
  endButton: {
    backgroundColor: COLORS.primary.main,
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    marginTop: SPACING.xl,
  },
  endButtonText: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.lg,
    color: COLORS.neutral.white,
  },
  cancelButton: {
    paddingVertical: SPACING.md,
    alignItems: 'center',
    marginTop: SPACING.md,
  },
  cancelButtonText: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.md,
    color: COLORS.neutral.darkGray,
  },
});