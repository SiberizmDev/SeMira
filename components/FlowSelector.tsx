import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FlowLevel } from '@/types/period';
import { FONT_FAMILY, FONT_SIZE, SPACING, BORDER_RADIUS } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';

interface FlowSelectorProps {
  selectedFlow: FlowLevel | undefined;
  onSelectFlow: (flow: FlowLevel) => void;
}

const flowLevels: FlowLevel[] = ['light', 'medium', 'heavy'];
const flowLabels: Record<FlowLevel, string> = {
  light: 'Hafif',
  medium: 'Orta',
  heavy: 'Yoğun'
};

export const FlowSelector: React.FC<FlowSelectorProps> = ({ selectedFlow, onSelectFlow }) => {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.text }]}>Akış Seviyesi</Text>
      <View style={styles.buttonsContainer}>
        {flowLevels.map((level) => (
          <TouchableOpacity
            key={level}
            style={[
              styles.button,
              { backgroundColor: colors.neutral.light },
              selectedFlow === level && { backgroundColor: colors.primary.light }
            ]}
            onPress={() => onSelectFlow(level)}
          >
            <Text style={[
              styles.buttonText,
              { color: colors.text },
              selectedFlow === level && { color: colors.primary.dark }
            ]}>
              {flowLabels[level]}
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
    justifyContent: 'space-between',
    gap: SPACING.sm,
  },
  button: {
    flex: 1,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.md,
  },
});