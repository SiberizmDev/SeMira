import React from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { FONT_FAMILY, FONT_SIZE, SPACING, BORDER_RADIUS } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';

interface NotesInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export const NotesInput: React.FC<NotesInputProps> = ({
  value,
  onChangeText,
  placeholder = 'Nasıl hissettiğinle ilgili not ekle...'
}) => {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.text }]}>Notlar</Text>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: colors.neutral.light,
            color: colors.text,
            borderColor: colors.neutral.medium
          }
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.neutral.gray}
        multiline
        numberOfLines={4}
        textAlignVertical="top"
      />
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
  input: {
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.md,
    borderWidth: 1,
    minHeight: 100,
  },
});