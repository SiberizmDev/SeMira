import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SymptomType } from '@/types/period';
import { FONT_FAMILY, FONT_SIZE, SPACING, BORDER_RADIUS } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';

interface SymptomsSelectorProps {
  selectedSymptoms: SymptomType[];
  onSelectSymptom: (symptom: SymptomType) => void;
}

const SYMPTOMS: SymptomType[] = [
  'cramps',
  'headache',
  'backache',
  'nausea',
  'fatigue',
  'bloating',
  'breast tenderness',
  'mood swings',
  'none'
];

export const SymptomsSelector: React.FC<SymptomsSelectorProps> = ({
  selectedSymptoms,
  onSelectSymptom
}) => {
  const { colors } = useTheme();
  
  const symptomNames: Record<SymptomType, string> = {
    'cramps': 'Kramp',
    'headache': 'Baş ağrısı',
    'backache': 'Bel ağrısı',
    'nausea': 'Bulantı',
    'fatigue': 'Yorgunluk',
    'bloating': 'Şişkinlik',
    'breast tenderness': 'Göğüs hassasiyeti',
    'mood swings': 'Duygu değişimi',
    'none': 'Hiçbiri'
  };
  
  const handleSymptomPress = (symptom: SymptomType) => {
    if (symptom === 'none') {
      // If 'none' is selected, clear all other selections
      if (selectedSymptoms.includes('none')) {
        onSelectSymptom('none'); // Deselect 'none'
      } else {
        // Select only 'none'
        SYMPTOMS.forEach(s => {
          if (selectedSymptoms.includes(s)) {
            onSelectSymptom(s);
          }
        });
        onSelectSymptom('none');
      }
    } else {
      // If another symptom is selected, remove 'none' if it's selected
      if (selectedSymptoms.includes('none')) {
        onSelectSymptom('none');
      }
      onSelectSymptom(symptom);
    }
  };
  
  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.text }]}>Belirtiler</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.symptomsContainer}
      >
        {SYMPTOMS.map((symptom) => (
          <TouchableOpacity
            key={symptom}
            style={[
              styles.symptomButton,
              { backgroundColor: colors.neutral.light },
              selectedSymptoms.includes(symptom) && { backgroundColor: colors.accent.light }
            ]}
            onPress={() => handleSymptomPress(symptom)}
          >
            <Text style={[
              styles.symptomText,
              { color: colors.text },
              selectedSymptoms.includes(symptom) && { color: colors.accent.dark }
            ]}>
              {symptomNames[symptom]}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: SPACING.md,
  },
  title: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.md,
    marginBottom: SPACING.sm,
  },
  symptomsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
    paddingVertical: SPACING.xs,
  },
  symptomButton: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.round,
  },
  symptomText: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.sm,
  },
});