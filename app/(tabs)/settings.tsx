import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Switch } from 'react-native';
import { usePeriodContext } from '@/context/PeriodContext';
import { useTheme } from '@/context/ThemeContext';
import { FONT_FAMILY, FONT_SIZE, SPACING, BORDER_RADIUS } from '@/constants/theme';
import { Clock, Calendar, Bell, CircleUser as UserCircle, ChevronRight, Trash2, Info, Shield, Moon } from 'lucide-react-native';
import { router } from 'expo-router';

export default function SettingsScreen() {
  const { userPreferences, setUserPreferences } = usePeriodContext();
  const { colors, isDarkMode, toggleTheme } = useTheme();
  const [remindersEnabled, setRemindersEnabled] = useState(false);
  
  const handleCycleLengthPress = () => {
    router.push('/cycle-length');
  };
  
  const handlePeriodDurationPress = () => {
    router.push('/period-duration');
  };
  
  return (
    <ScrollView style={[styles.container, { backgroundColor: isDarkMode ? colors.background : colors.neutral.light }]}>
      <View style={[styles.section, { backgroundColor: isDarkMode ? colors.card : colors.neutral.white }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Döngü Ayarları</Text>
        
        <TouchableOpacity 
          style={[styles.settingItem, { borderBottomColor: isDarkMode ? colors.neutral.dark : colors.neutral.medium }]}
          onPress={handleCycleLengthPress}
        >
          <View style={[styles.settingIconContainer, { backgroundColor: isDarkMode ? colors.primary.dark : colors.primary.light }]}>
            <Calendar size={20} color={isDarkMode ? colors.primary.light : colors.primary.main} />
          </View>
          <View style={styles.settingContent}>
            <Text style={[styles.settingLabel, { color: colors.text }]}>Döngü Uzunluğu</Text>
            <Text style={[styles.settingValue, { color: colors.neutral.darkGray }]}>
              {userPreferences?.cycleLength || 28} gün
            </Text>
            <Text style={[styles.settingDescription, { color: colors.neutral.darkGray }]}>
              Ortalama adet döngünüzün uzunluğunu ayarlayın
            </Text>
          </View>
          <ChevronRight size={20} color={isDarkMode ? colors.neutral.gray : colors.neutral.darkGray} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.settingItem, { borderBottomColor: isDarkMode ? colors.neutral.dark : colors.neutral.medium }]}
          onPress={handlePeriodDurationPress}
        >
          <View style={[styles.settingIconContainer, { backgroundColor: isDarkMode ? colors.primary.dark : colors.primary.light }]}>
            <Clock size={20} color={isDarkMode ? colors.primary.light : colors.primary.main} />
          </View>
          <View style={styles.settingContent}>
            <Text style={[styles.settingLabel, { color: colors.text }]}>Adet Süresi</Text>
            <Text style={[styles.settingValue, { color: colors.neutral.darkGray }]}>
              {userPreferences?.typicalDuration || 5} gün
            </Text>
            <Text style={[styles.settingDescription, { color: colors.neutral.darkGray }]}>
              Ortalama adet sürenizi ayarlayın
            </Text>
          </View>
          <ChevronRight size={20} color={isDarkMode ? colors.neutral.gray : colors.neutral.darkGray} />
        </TouchableOpacity>
      </View>
      
      <View style={[styles.section, { backgroundColor: isDarkMode ? colors.card : colors.neutral.white }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Uygulama Ayarları</Text>
        
        <TouchableOpacity 
          style={[styles.settingItem, { borderBottomColor: isDarkMode ? colors.neutral.dark : colors.neutral.medium }]}
          onPress={toggleTheme}
        >
          <View style={[styles.settingIconContainer, { backgroundColor: isDarkMode ? colors.primary.dark : colors.primary.light }]}>
            <Moon size={20} color={isDarkMode ? colors.primary.light : colors.primary.main} />
          </View>
          <View style={styles.settingContent}>
            <Text style={[styles.settingLabel, { color: colors.text }]}>Karanlık Mod</Text>
            <Text style={[styles.settingDescription, { color: colors.neutral.darkGray }]}>
              Koyu renk temayı açıp kapatın
            </Text>
          </View>
          <Switch
            value={isDarkMode}
            onValueChange={toggleTheme}
            trackColor={{ false: isDarkMode ? colors.neutral.dark : colors.neutral.medium, true: colors.primary.main }}
            thumbColor={colors.neutral.white}
          />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.settingItem, { borderBottomColor: isDarkMode ? colors.neutral.dark : colors.neutral.medium }]}
        >
          <View style={[styles.settingIconContainer, { backgroundColor: isDarkMode ? colors.primary.dark : colors.primary.light }]}>
            <Bell size={20} color={isDarkMode ? colors.primary.light : colors.primary.main} />
          </View>
          <View style={styles.settingContent}>
            <Text style={[styles.settingLabel, { color: colors.text }]}>Bildirimler</Text>
            <Text style={[styles.settingDescription, { color: colors.neutral.darkGray }]}>
              Hatırlatıcıları ve bildirimleri yönetin
            </Text>
          </View>
          <Switch
            value={remindersEnabled}
            onValueChange={setRemindersEnabled}
            trackColor={{ false: isDarkMode ? colors.neutral.dark : colors.neutral.medium, true: colors.primary.main }}
            thumbColor={colors.neutral.white}
          />
        </TouchableOpacity>
      </View>
      
      <View style={[styles.section, { backgroundColor: isDarkMode ? colors.card : colors.neutral.white }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Uygulama Ayarları</Text>
        
        <View style={styles.settingItem}>
          <View style={[styles.settingIconContainer, { backgroundColor: colors.primary.light }]}>
            <UserCircle size={20} color={colors.primary.main} />
          </View>
          <View style={styles.settingContent}>
            <Text style={[styles.settingLabel, { color: colors.text }]}>Karanlık Mod</Text>
            <Text style={[styles.settingDescription, { color: colors.neutral.darkGray }]}>
              Açık ve koyu tema arasında geçiş yap
            </Text>
          </View>
          <Switch
            value={isDarkMode}
            onValueChange={toggleTheme}
            trackColor={{ false: colors.neutral.medium, true: colors.primary.light }}
            thumbColor={isDarkMode ? colors.primary.main : colors.neutral.white}
          />
        </View>
        
        <TouchableOpacity 
          style={styles.settingItem}
          onPress={() => router.push('/privacy-policy')}
        >
          <View style={[styles.settingIconContainer, { backgroundColor: isDarkMode ? colors.primary.dark : colors.primary.light }]}>
            <Shield size={20} color={isDarkMode ? colors.primary.light : colors.primary.main} />
          </View>
          <View style={styles.settingContent}>
            <Text style={[styles.settingLabel, { color: colors.text }]}>Gizlilik Politikası</Text>
            <Text style={[styles.settingValue, { color: colors.neutral.darkGray }]}>
              Gizlilik politikamızı görüntüle
            </Text>
          </View>
          <ChevronRight size={20} color={isDarkMode ? colors.neutral.gray : colors.neutral.darkGray} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.settingItem}
          onPress={() => router.push('/about')}
        >
          <View style={[styles.settingIconContainer, { backgroundColor: isDarkMode ? colors.primary.dark : colors.primary.light }]}>
            <Info size={20} color={isDarkMode ? colors.primary.light : colors.primary.main} />
          </View>
          <View style={styles.settingContent}>
            <Text style={[styles.settingLabel, { color: colors.text }]}>Hakkında</Text>
            <Text style={[styles.settingValue, { color: colors.neutral.darkGray }]}>
              Uygulama bilgileri ve sürüm
            </Text>
          </View>
          <ChevronRight size={20} color={isDarkMode ? colors.neutral.gray : colors.neutral.darkGray} />
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity 
        style={[styles.dangerButton, { backgroundColor: isDarkMode ? colors.card : colors.neutral.white }]}
        onPress={() => {
          Alert.alert(
            'Tüm Verileri Temizle',
            'Tüm adet verilerini silmek istediğine emin misin? Bu işlem geri alınamaz.',
            [
              {
                text: 'İptal',
                style: 'cancel',
              },
              {
                text: 'Sil',
                onPress: () => {
                  // Implement data deletion
                },
                style: 'destructive',
              },
            ]
          );
        }}
      >
        <Trash2 size={20} color={colors.error} style={styles.dangerIcon} />
        <Text style={[styles.dangerButtonText, { color: colors.error }]}>Tüm Verileri Temizle</Text>
      </TouchableOpacity>
      
      <Text style={[styles.versionText, { color: isDarkMode ? colors.neutral.gray : colors.neutral.darkGray }]}>
        Sürüm 1.0.0
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SPACING.md,
  },
  title: {
    fontFamily: FONT_FAMILY.bold,
    fontSize: FONT_SIZE.xl,
    marginBottom: SPACING.md,
  },
  section: {
    marginBottom: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: FONT_SIZE.md,
    marginBottom: SPACING.md,
    paddingHorizontal: SPACING.sm,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    paddingHorizontal: SPACING.sm,
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  settingContent: {
    flex: 1,
  },
  settingLabel: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.md,
  },
  settingValue: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.sm,
    marginTop: 2,
  },
  settingDescription: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.sm,
    marginTop: 2,
  },
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginVertical: SPACING.lg,
    borderWidth: 1,
    borderColor: '#EF5350',
  },
  dangerIcon: {
    marginRight: SPACING.sm,
  },
  dangerButtonText: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.md,
  },
  versionText: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.sm,
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
});