import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, FONT_FAMILY, FONT_SIZE, SPACING, BORDER_RADIUS, SHADOWS } from '@/constants/theme';
import { getRandomTip } from '@/constants/tips';
import { Lightbulb, RefreshCw } from 'lucide-react-native';

export const TipCard = () => {
  const [tip, setTip] = useState(getRandomTip());
  
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
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Lightbulb size={20} color={COLORS.primary.dark} style={styles.icon} />
          <Text style={styles.title}>Tip of the Day</Text>
        </View>
        <TouchableOpacity onPress={refreshTip} style={styles.refreshButton}>
          <RefreshCw size={16} color={COLORS.primary.main} />
        </TouchableOpacity>
      </View>
      <View style={styles.content}>
        <Text style={styles.tipTitle}>{tip.title}</Text>
        <Text style={styles.tipContent}>{tip.content}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.neutral.light,
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
    color: COLORS.primary.dark,
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
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  tipContent: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.md,
    color: COLORS.neutral.darkGray,
    lineHeight: 22,
  },
});