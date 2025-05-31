import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MoodType } from '@/types/period';
import { COLORS, FONT_FAMILY, FONT_SIZE, SPACING, BORDER_RADIUS } from '@/constants/theme';
import { Smile, Frown, Meh, Angry, HeartPulse } from 'lucide-react-native';

interface MoodSelectorProps {
  selectedMood: MoodType | undefined;
  onSelectMood: (mood: MoodType) => void;
}

export const MoodSelector: React.FC<MoodSelectorProps> = ({
  selectedMood,
  onSelectMood
}) => {
  const moods: { type: MoodType; icon: React.ReactNode; label: string }[] = [
    { 
      type: 'happy', 
      icon: <Smile size={24} color={selectedMood === 'happy' ? COLORS.primary.main : COLORS.neutral.gray} />,
      label: 'Mutlu'
    },
    { 
      type: 'neutral', 
      icon: <Meh size={24} color={selectedMood === 'neutral' ? COLORS.primary.main : COLORS.neutral.gray} />,
      label: 'Nötr'
    },
    { 
      type: 'sad', 
      icon: <Frown size={24} color={selectedMood === 'sad' ? COLORS.primary.main : COLORS.neutral.gray} />,
      label: 'Üzgün'
    },
    { 
      type: 'irritable', 
      icon: <Angry size={24} color={selectedMood === 'irritable' ? COLORS.primary.main : COLORS.neutral.gray} />,
      label: 'Sinirli'
    },
    { 
      type: 'anxious', 
      icon: <HeartPulse size={24} color={selectedMood === 'anxious' ? COLORS.primary.main : COLORS.neutral.gray} />,
      label: 'Endişeli'
    },
  ];
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nasıl hissediyorsun?</Text>
      <View style={styles.moodsContainer}>
        {moods.map((mood) => (
          <TouchableOpacity
            key={mood.type}
            style={[
              styles.moodButton,
              selectedMood === mood.type && styles.selectedMood
            ]}
            onPress={() => onSelectMood(mood.type)}
          >
            {mood.icon}
            <Text 
              style={[
                styles.moodText,
                selectedMood === mood.type && styles.selectedMoodText
              ]}
            >
              {mood.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
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
  moodsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  moodButton: {
    alignItems: 'center',
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    width: '18%',
  },
  selectedMood: {
    backgroundColor: COLORS.primary.light,
  },
  moodText: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.xs,
    color: COLORS.neutral.darkGray,
    marginTop: SPACING.xs,
    textAlign: 'center',
  },
  selectedMoodText: {
    color: COLORS.primary.dark,
    fontFamily: FONT_FAMILY.medium,
  },
});