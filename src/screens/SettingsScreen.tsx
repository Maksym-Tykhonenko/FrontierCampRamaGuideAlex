
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  Pressable,
  Switch,
  Share,
  Alert,
  DeviceEventEmitter,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BG = require('../assets/locations_screen.png');
const BRAND = require('../assets/Group2.png');
const SHARE_ICON = require('../assets/icons.png');

const SETTINGS_NOTIF_KEY = 'settings_notifications_enabled';
const MY_LISTS_KEY = 'MY_PACKLISTS_V1';

export const EVT_MY_LISTS_CLEARED = 'MY_LISTS_CLEARED';

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const [enabled, setEnabled] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(SETTINGS_NOTIF_KEY);
        if (saved != null) setEnabled(JSON.parse(saved));
      } catch {}
    })();
  }, []);

  const toggle = async () => {
    try {
      const next = !enabled;
      setEnabled(next);
      await AsyncStorage.setItem(SETTINGS_NOTIF_KEY, JSON.stringify(next));
    } catch {}
  };

  const onShare = async () => {
    try {
      await Share.share({
        title: 'Frontier CampRama Guide',
        message:
          'Check out Frontier CampRama Guide — trail wisdom, packlists and safety tips!',
      });
    } catch {}
  };

  const onClearSaved = () => {
    Alert.alert(
      'Clear saved data?',
      'This will permanently delete all your lists and checkmarks in “My Lists”. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
          
              await AsyncStorage.removeItem(MY_LISTS_KEY);
            } finally {
        
              DeviceEventEmitter.emit(EVT_MY_LISTS_CLEARED);
            }
          },
        },
      ],
    );
  };

  return (
    <ImageBackground source={BG} style={styles.bg}>
      <View style={{ paddingTop: insets.top + 8 + (Platform.OS === 'android' ? 20 : 0), paddingHorizontal: 12 }}>
  
        <View style={styles.header}>
          <Image source={BRAND} style={styles.brand} />
          <Text style={styles.headerTitle}>Settings</Text>
          <View style={{ width: 50, height: 50 }} />
        </View>

        <View style={{ gap: 10, marginTop: 12 }}>
 
          <View style={styles.row}>
            <Text style={styles.rowText}>Notifications</Text>
            <Switch
              value={enabled}
              onValueChange={toggle}
              trackColor={{ false: '#444', true: '#E94040' }}
              thumbColor="#fff"
            />
          </View>

          <Pressable style={styles.row} onPress={onShare} hitSlop={8}>
            <Text style={styles.rowText}>Share the app</Text>
            <View style={styles.shareBtn}>
              <Image
                source={SHARE_ICON}
                style={{ width: 16, height: 16, resizeMode: 'contain' }}
              />
            </View>
          </Pressable>

          <Pressable style={styles.row} onPress={onClearSaved} hitSlop={8}>
            <Text style={styles.rowText}>Clear saved data</Text>
            <View style={[styles.shareBtn, { backgroundColor: '#2B2C2F' }]}>
              <Text style={{ color: '#C9CDD2', fontWeight: '800' }}>×</Text>
            </View>
          </Pressable>
        </View>
      </View>

      <View style={{ height: insets.bottom + 12 }} />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, backgroundColor: '#0E0F10' },

  header: {
    height: 64,
    borderRadius: 16,
    backgroundColor: '#1A1B1E',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  brand: { width: 50, height: 50, borderRadius: 12, marginRight: 8 },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    color: '#fff',
    fontWeight: '800',
    fontSize: 22,
  },

  row: {
    minHeight: 52,
    borderRadius: 16,
    backgroundColor: '#1A1B1E',
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowText: { color: '#E6E9EE', fontSize: 15, fontWeight: '700' },

  shareBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E94040',
    alignItems: 'center',
    justifyContent: 'center',
  },
});