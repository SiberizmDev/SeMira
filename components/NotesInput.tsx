import React from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { COLORS, FONT_FAMILY, FONT_SIZE, SPACING, BORDER_RADIUS } from '@/constants/theme';

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
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notlar</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={COLORS.neutral.gray}
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
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  input: {
    backgroundColor: COLORS.neutral.light,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.md,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: COLORS.neutral.medium,
    minHeight: 100,
  },
});