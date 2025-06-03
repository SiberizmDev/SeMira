import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MoodType } from '@/types/period';
import { FONT_FAMILY, FONT_SIZE, SPACING, BORDER_RADIUS } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';
import { Smile, Frown, Meh, Angry, HeartPulse } from 'lucide-react-native';

interface MoodSelectorProps {
  selectedMood: MoodType | undefined;
  onSelectMood: (mood: MoodType) => void;
}

const moods: { type: MoodType; icon: React.FC<{ size: number; color: string }> }[] = [
  { type: 'happy', icon: Smile },
  { type: 'sad', icon: Frown },
  { type: 'neutral', icon: Meh },
  { type: 'angry', icon: Angry },
  { type: 'energetic', icon: HeartPulse },
];

const moodLabels: Record<MoodType, string> = {
  happy: 'Mutlu',
  sad: 'Üzgün',
  neutral: 'Normal',
  angry: 'Sinirli',
  energetic: 'Enerjik'
};

export const MoodSelector: React.FC<MoodSelectorProps> = ({ selectedMood, onSelectMood }) => {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.text }]}>Ruh Haliniz</Text>
      <View style={styles.buttonsContainer}>
        {moods.map(({ type, icon: Icon }) => (
          <TouchableOpacity
            key={type}
            style={[
              styles.button,
              { backgroundColor: colors.neutral.light },
              selectedMood === type && { backgroundColor: colors.secondary.light }
            ]}
            onPress={() => onSelectMood(type)}
          >
            <Icon 
              size={24} 
              color={selectedMood === type ? colors.secondary.dark : colors.neutral.darkGray} 
            />
            <Text style={[
              styles.buttonText,
              { color: selectedMood === type ? colors.secondary.dark : colors.text }
            ]}>
              {moodLabels[type]}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.lg,
  },
  title: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: FONT_SIZE.md,
    marginBottom: SPACING.sm,
  },
  buttonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  button: {
    flex: 1,
    minWidth: '30%',
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    gap: SPACING.xs,
  },
  buttonText: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.sm,
  },
});