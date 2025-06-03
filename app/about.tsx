import React from 'react';
import { View, Text, ScrollView, StyleSheet, Image, Linking } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { FONT_FAMILY, FONT_SIZE, SPACING, BORDER_RADIUS } from '@/constants/theme';
import { ArrowLeft, Heart } from 'lucide-react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { router } from 'expo-router';

export default function AboutScreen() {
  const { colors, isDarkMode } = useTheme();

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: isDarkMode ? colors.background : colors.neutral.light }]}
    >
      

      <View style={[styles.card, { backgroundColor: isDarkMode ? colors.card : colors.neutral.white }]}>
        <View style={styles.appInfo}>
          <Image 
            source={require('@/assets/images/icon.png')} 
            style={styles.appIcon}
          />
          <Text style={[styles.appName, { color: colors.text }]}>SeMira</Text>
          <Text style={[styles.version, { color: colors.neutral.darkGray }]}>Sürüm 1.0.0</Text>
        </View>

        <Text style={[styles.description, { color: colors.text }]}>
          SeMira, adet döngünüzü takip etmenizi kolaylaştıran, sade ve kullanıcı dostu bir uygulamadır.
        </Text>

        <View style={styles.divider} />

        <Text style={[styles.sectionTitle, { color: colors.text }]}>Özellikler</Text>
        <Text style={[styles.feature, { color: colors.text }]}>• Adet döngüsü takibi</Text>
        <Text style={[styles.feature, { color: colors.text }]}>• Semptom ve ruh hali kaydı</Text>
        <Text style={[styles.feature, { color: colors.text }]}>• Detaylı istatistikler</Text>
        <Text style={[styles.feature, { color: colors.text }]}>• Hatırlatıcılar</Text>
        <Text style={[styles.feature, { color: colors.text }]}>• Karanlık mod desteği</Text>

        <View style={styles.divider} />

        <View style={styles.credits}>
          <Heart size={20} color={colors.primary.main} />
          <Text style={[styles.creditsText, { color: colors.text }]}>
            Sevgiyle yapıldı
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  backButton: {
    marginRight: SPACING.md,
  },
  title: {
    fontFamily: FONT_FAMILY.bold,
    fontSize: FONT_SIZE.xl,
  },
  card: {
    margin: SPACING.md,
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    alignItems: 'center',
  },
  appInfo: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  appIcon: {
    width: 80,
    height: 80,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.md,
  },
  appName: {
    fontFamily: FONT_FAMILY.bold,
    fontSize: FONT_SIZE.xxl,
    marginBottom: SPACING.xs,
  },
  version: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.md,
  },
  description: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.md,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: SPACING.lg,
  },
  divider: {
    height: 1,
    width: '100%',
    backgroundColor: '#E0E0E0',
    marginVertical: SPACING.lg,
  },
  sectionTitle: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: FONT_SIZE.lg,
    marginBottom: SPACING.md,
    alignSelf: 'flex-start',
  },
  feature: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.md,
    lineHeight: 24,
    alignSelf: 'flex-start',
  },
  credits: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  creditsText: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.md,
  },
}); 