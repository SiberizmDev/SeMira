import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SymptomType } from '@/types/period';
import { COLORS, FONT_FAMILY, FONT_SIZE, SPACING, BORDER_RADIUS } from '@/constants/theme';

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
      <Text style={styles.title}>Belirtiler</Text>
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
              selectedSymptoms.includes(symptom) && styles.selectedSymptom
            ]}
            onPress={() => handleSymptomPress(symptom)}
          >
            <Text 
              style={[
                styles.symptomText,
                selectedSymptoms.includes(symptom) && styles.selectedSymptomText
              ]}
            >
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
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  symptomsContainer: {
    flexDirection: 'row',
    paddingVertical: SPACING.xs,
  },
  symptomButton: {
    backgroundColor: COLORS.neutral.light,
    borderRadius: BORDER_RADIUS.round,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    marginRight: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.neutral.medium,
  },
  selectedSymptom: {
    backgroundColor: COLORS.primary.light,
    borderColor: COLORS.primary.main,
  },
  symptomText: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.sm,
    color: COLORS.neutral.darkGray,
  },
  selectedSymptomText: {
    color: COLORS.primary.dark,
    fontFamily: FONT_FAMILY.medium,
  },
});