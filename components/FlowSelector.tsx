import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FlowLevel } from '@/types/period';
import { COLORS, FONT_FAMILY, FONT_SIZE, SPACING, BORDER_RADIUS } from '@/constants/theme';

interface FlowSelectorProps {
  selectedFlow: FlowLevel | undefined;
  onSelectFlow: (flow: FlowLevel) => void;
}

export const FlowSelector: React.FC<FlowSelectorProps> = ({
  selectedFlow,
  onSelectFlow
}) => {
  const flows: { level: FlowLevel; label: string }[] = [
    { level: 'light', label: 'Light' },
    { level: 'medium', label: 'Medium' },
    { level: 'heavy', label: 'Heavy' },
  ];
  
  const getFlowColor = (level: FlowLevel) => {
    switch (level) {
      case 'light':
        return {
          bg: COLORS.primary.light,
          text: COLORS.primary.dark,
          border: COLORS.primary.main
        };
      case 'medium':
        return {
          bg: COLORS.primary.main,
          text: COLORS.neutral.white,
          border: COLORS.primary.main
        };
      case 'heavy':
        return {
          bg: COLORS.primary.dark,
          text: COLORS.neutral.white,
          border: COLORS.primary.dark
        };
    }
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Flow Level</Text>
      <View style={styles.flowsContainer}>
        {flows.map((flow) => {
          const flowColors = getFlowColor(flow.level);
          const isSelected = selectedFlow === flow.level;
          
          return (
            <TouchableOpacity
              key={flow.level}
              style={[
                styles.flowButton,
                {
                  backgroundColor: isSelected ? flowColors.bg : COLORS.neutral.light,
                  borderColor: isSelected ? flowColors.border : COLORS.neutral.medium,
                }
              ]}
              onPress={() => onSelectFlow(flow.level)}
            >
              <Text 
                style={[
                  styles.flowText,
                  { color: isSelected ? flowColors.text : COLORS.neutral.darkGray }
                ]}
              >
                {flow.label}
              </Text>
            </TouchableOpacity>
          );
        })}
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
  flowsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  flowButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    marginHorizontal: SPACING.xs,
    borderWidth: 1,
  },
  flowText: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.md,
  },
});