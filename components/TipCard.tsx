import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FONT_FAMILY, FONT_SIZE, SPACING, BORDER_RADIUS, SHADOWS } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';
import { getRandomTip } from '@/constants/tips';
import { Lightbulb, RefreshCw } from 'lucide-react-native';

export const TipCard = () => {
  const [tip, setTip] = useState(getRandomTip());
  const { colors } = useTheme();
  
  const refreshTip = () => {
    setTip(getRandomTip());
  };
  
  // Change tip every 24 hours
  useEffect(() => {
    const interval = setInterval(() => {
      refreshTip();
    }, 24 * 60 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <View style={[styles.card, { backgroundColor: colors.card }]}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Lightbulb size={20} color={colors.primary.dark} style={styles.icon} />
          <Text style={[styles.title, { color: colors.primary.dark }]}>Günün İpucu</Text>
        </View>
        <TouchableOpacity onPress={refreshTip} style={styles.refreshButton}>
          <RefreshCw size={16} color={colors.primary.main} />
        </TouchableOpacity>
      </View>
      <View style={styles.content}>
        <Text style={[styles.tipTitle, { color: colors.text }]}>{tip.title}</Text>
        <Text style={[styles.tipContent, { color: colors.neutral.darkGray }]}>{tip.content}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginVertical: SPACING.md,
    ...SHADOWS.small,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: SPACING.xs,
  },
  title: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.md,
  },
  refreshButton: {
    padding: SPACING.xs,
  },
  content: {
    marginTop: SPACING.sm,
  },
  tipTitle: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: FONT_SIZE.lg,
    marginBottom: SPACING.xs,
  },
  tipContent: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.md,
    lineHeight: 22,
  },
});