import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Switch } from 'react-native';
import { usePeriodContext } from '@/context/PeriodContext';
import { COLORS, FONT_FAMILY, FONT_SIZE, SPACING, BORDER_RADIUS } from '@/constants/theme';
import { Clock, Calendar, Bell, CircleUser as UserCircle, ChevronRight, Trash2, Info, Shield } from 'lucide-react-native';

export default function SettingsScreen() {
  const { userPreferences, setUserPreferences } = usePeriodContext();
  const [remindersEnabled, setRemindersEnabled] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  
  const handleCycleLengthPress = () => {
    if (!userPreferences) return;
    
    Alert.prompt(
      'Cycle Length',
      'Enter your average cycle length in days:',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Save',
          onPress: (value) => {
            const cycleLength = parseInt(value || '28', 10);
            if (cycleLength >= 21 && cycleLength <= 35) {
              setUserPreferences({
                ...userPreferences,
                cycleLength,
              });
            } else {
              Alert.alert('Invalid Value', 'Please enter a value between 21 and 35 days.');
            }
          },
        },
      ],
      'plain-text',
      userPreferences.cycleLength?.toString() || '28'
    );
  };
  
  const handlePeriodDurationPress = () => {
    if (!userPreferences) return;
    
    Alert.prompt(
      'Period Duration',
      'Enter your average period duration in days:',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Save',
          onPress: (value) => {
            const typicalDuration = parseInt(value || '5', 10);
            if (typicalDuration >= 2 && typicalDuration <= 10) {
              setUserPreferences({
                ...userPreferences,
                typicalDuration,
              });
            } else {
              Alert.alert('Invalid Value', 'Please enter a value between 2 and 10 days.');
            }
          },
        },
      ],
      'plain-text',
      userPreferences.typicalDuration?.toString() || '5'
    );
  };
  
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Ayarlar</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Döngü Ayarları</Text>
        
        <TouchableOpacity 
          style={styles.settingItem}
          onPress={handleCycleLengthPress}
        >
          <View style={styles.settingIconContainer}>
            <Calendar size={20} color={COLORS.primary.main} />
          </View>
          <View style={styles.settingContent}>
            <Text style={styles.settingLabel}>Döngü Uzunluğu</Text>
            <Text style={styles.settingValue}>
              {userPreferences?.cycleLength || 28} gün
            </Text>
          </View>
          <ChevronRight size={20} color={COLORS.neutral.gray} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.settingItem}
          onPress={handlePeriodDurationPress}
        >
          <View style={styles.settingIconContainer}>
            <Clock size={20} color={COLORS.primary.main} />
          </View>
          <View style={styles.settingContent}>
            <Text style={styles.settingLabel}>Adet Süresi</Text>
            <Text style={styles.settingValue}>
              {userPreferences?.typicalDuration || 5} gün
            </Text>
          </View>
          <ChevronRight size={20} color={COLORS.neutral.gray} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Bildirimler</Text>
        
        <View style={styles.settingItem}>
          <View style={styles.settingIconContainer}>
            <Bell size={20} color={COLORS.primary.main} />
          </View>
          <View style={styles.settingContent}>
            <Text style={styles.settingLabel}>Adet Hatırlatıcıları</Text>
            <Text style={styles.settingDescription}>
              Adetin başlamadan önce bildirim al
            </Text>
          </View>
          <Switch
            value={remindersEnabled}
            onValueChange={setRemindersEnabled}
            trackColor={{ false: COLORS.neutral.medium, true: COLORS.primary.light }}
            thumbColor={remindersEnabled ? COLORS.primary.main : COLORS.neutral.white}
          />
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Uygulama Ayarları</Text>
        
        <View style={styles.settingItem}>
          <View style={styles.settingIconContainer}>
            <UserCircle size={20} color={COLORS.primary.main} />
          </View>
          <View style={styles.settingContent}>
            <Text style={styles.settingLabel}>Karanlık Mod</Text>
            <Text style={styles.settingDescription}>
              Açık ve koyu tema arasında geçiş yap
            </Text>
          </View>
          <Switch
            value={darkMode}
            onValueChange={setDarkMode}
            trackColor={{ false: COLORS.neutral.medium, true: COLORS.primary.light }}
            thumbColor={darkMode ? COLORS.primary.main : COLORS.neutral.white}
          />
        </View>
        
        <TouchableOpacity 
          style={styles.settingItem}
        >
          <View style={styles.settingIconContainer}>
            <Shield size={20} color={COLORS.primary.main} />
          </View>
          <View style={styles.settingContent}>
            <Text style={styles.settingLabel}>Gizlilik Politikası</Text>
            <Text style={styles.settingDescription}>
              Gizlilik politikamızı görüntüle
            </Text>
          </View>
          <ChevronRight size={20} color={COLORS.neutral.gray} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.settingItem}
        >
          <View style={styles.settingIconContainer}>
            <Info size={20} color={COLORS.primary.main} />
          </View>
          <View style={styles.settingContent}>
            <Text style={styles.settingLabel}>Hakkında</Text>
            <Text style={styles.settingDescription}>
              Uygulama sürümü ve bilgi
            </Text>
          </View>
          <ChevronRight size={20} color={COLORS.neutral.gray} />
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity 
        style={styles.dangerButton}
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
        <Trash2 size={20} color={COLORS.error} style={styles.dangerIcon} />
        <Text style={styles.dangerButtonText}>Tüm Verileri Temizle</Text>
      </TouchableOpacity>
      
      <Text style={styles.versionText}>Sürüm 1.0.0</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: SPACING.md,
  },
  title: {
    fontFamily: FONT_FAMILY.bold,
    fontSize: FONT_SIZE.xl,
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  section: {
    marginBottom: SPACING.lg,
    backgroundColor: COLORS.neutral.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    shadowColor: COLORS.neutral.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: FONT_SIZE.md,
    color: COLORS.text,
    marginBottom: SPACING.md,
    paddingHorizontal: SPACING.sm,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.neutral.light,
    paddingHorizontal: SPACING.sm,
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary.light,
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
    color: COLORS.text,
  },
  settingValue: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.sm,
    color: COLORS.primary.main,
    marginTop: 2,
  },
  settingDescription: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.sm,
    color: COLORS.neutral.darkGray,
    marginTop: 2,
  },
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.neutral.white,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginVertical: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.error,
  },
  dangerIcon: {
    marginRight: SPACING.sm,
  },
  dangerButtonText: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.md,
    color: COLORS.error,
  },
  versionText: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.sm,
    color: COLORS.neutral.gray,
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
});