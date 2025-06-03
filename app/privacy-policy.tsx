import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { FONT_FAMILY, FONT_SIZE, SPACING, BORDER_RADIUS } from '@/constants/theme';
import { ArrowLeft } from 'lucide-react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { router } from 'expo-router';

export default function PrivacyPolicyScreen() {
  const { colors, isDarkMode } = useTheme();

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: isDarkMode ? colors.background : colors.neutral.light }]}
    >

      <View style={[styles.card, { backgroundColor: isDarkMode ? colors.card : colors.neutral.white }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Veri Toplama ve Kullanım</Text>
        <Text style={[styles.paragraph, { color: colors.text }]}>
          SeMira, adet döngünüzü takip etmenize yardımcı olmak için tasarlanmıştır. Uygulamamız, yalnızca sizin girdiğiniz verileri toplar ve bu veriler cihazınızda yerel olarak saklanır.
        </Text>
        
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Veri Güvenliği</Text>
        <Text style={[styles.paragraph, { color: colors.text }]}>
          Verilerinizin güvenliği bizim için önemlidir. Tüm veriler şifrelenerek saklanır ve üçüncü taraflarla paylaşılmaz.
        </Text>
        
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Bildirimler</Text>
        <Text style={[styles.paragraph, { color: colors.text }]}>
          Uygulamamız, yalnızca sizin izin verdiğiniz durumda bildirim gönderir. Bu bildirimleri istediğiniz zaman ayarlardan kapatabilirsiniz.
        </Text>
        
        <Text style={[styles.sectionTitle, { color: colors.text }]}>İletişim</Text>
        <Text style={[styles.paragraph, { color: colors.text }]}>
          Gizlilik politikamız hakkında sorularınız için bize e-posta ile ulaşabilirsiniz.
        </Text>
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
  },
  sectionTitle: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: FONT_SIZE.lg,
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  paragraph: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.md,
    lineHeight: 24,
    marginBottom: SPACING.md,
  },
}); 