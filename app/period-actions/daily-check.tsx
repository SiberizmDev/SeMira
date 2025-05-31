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

export default function DailyCheckScreen() {
  const { currentPeriod, addDailyLog } = usePeriodContext();
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
      Alert.alert('Missing Information', 'Please select your flow level');
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
      console.error('Error adding daily log:', error);
      Alert.alert('Error', 'There was an error saving your daily check-in');
    }
  };
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Daily Check-in</Text>
        <Text style={styles.subtitle}>
          Day {dayCount} of your period
        </Text>
        
        <View style={styles.dayCard}>
          <Text style={styles.dayCardTitle}>Today, {format(today, 'MMMM d')}</Text>
          <Text style={styles.dayCardText}>
            How are you feeling today? Let's track your symptoms and flow.
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
          placeholder="Any additional notes about how you're feeling today?"
        />
        
        <TouchableOpacity 
          style={styles.saveButton} 
          onPress={handleSaveLog}
        >
          <Text style={styles.saveButtonText}>Save Check-in</Text>
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
  dayCard: {
    backgroundColor: COLORS.primary.light,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
  },
  dayCardTitle: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: FONT_SIZE.md,
    color: COLORS.primary.dark,
    marginBottom: SPACING.xs,
  },
  dayCardText: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.md,
    color: COLORS.text,
  },
  saveButton: {
    backgroundColor: COLORS.primary.main,
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    marginTop: SPACING.xl,
  },
  saveButtonText: {
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