
import React from 'react';
import {
  View, Text, StyleSheet, Image, ImageBackground, ScrollView, Pressable, Share, Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, type RouteProp } from '@react-navigation/native';

const BG = require('../assets/locations_screen.png');
const DEER = require('../assets/deer.png');
const FWD = require('../assets/forward.png');
const SHARE_ICON = require('../assets/icons.png'); 

type WildlifeItem = {
  id: string;
  name: string;
  latin: string;
  level: 'Awareness' | 'Caution' | 'Extreme Caution';
  where: string;
  signs?: string;
  behavior?: string;
  whatToDo: string[];
  foodSecurity: string;
  addToPacklist: string;
  regionNote?: string;
};

type RouteT = RouteProp<Record<'WildlifeDetails', { item: WildlifeItem }>, 'WildlifeDetails'>;

export default function WildlifeDetailsScreen({ route }: { route: RouteT }) {
  const nav = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const { item } = route.params;

  const onShare = async () => {
    const text =
      `${item.name} (${item.latin})\n` +
      `Caution Level: ${item.level}\n` +
      `Where: ${item.where}\n` +
      (item.signs ? `Signs & behavior: ${item.signs}${item.behavior ? `; ${item.behavior}` : ''}\n` : '') +
      `What to do:\n- ${item.whatToDo.join('\n- ')}\n` +
      `Food security: ${item.foodSecurity}\n` +
      `Add to Packlist: ${item.addToPacklist}`;
    try { await Share.share({ title: item.name, message: text }); } catch {}
  };

  return (
    <ImageBackground source={BG} style={{ flex: 1 }}>
      <View style={{ paddingTop: insets.top + 6 + (Platform.OS === 'android' ? 20 : 0), paddingHorizontal: 12 }}>
        <View style={styles.topBar}>
          <Pressable onPress={() => nav.goBack()} hitSlop={10}>
            <Image source={FWD} style={[styles.backIcon, { transform: [{ scaleX: -1 }] }]} />
          </Pressable>
          <Text style={styles.topTitle}>Details</Text>
          <Pressable onPress={onShare} hitSlop={10} style={styles.shareBtn}>
            <Image source={SHARE_ICON} style={styles.shareIcon} resizeMode="contain" />
          </Pressable>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 16 }}>
        <View style={styles.card}>
          <Image source={DEER} style={styles.icon} />
          <View style={{ flex: 1 }}>
            <Text style={styles.level}>Caution Level: <Text style={styles.levelValue}>{item.level}</Text></Text>
            <Text style={styles.title}>
              {item.name} <Text style={styles.latin}>({item.latin})</Text>
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.hint}>
            {item.regionNote ? `${item.regionNote}\n` : ''}
            <Text style={styles.bold}>Where you'll meet me: </Text>
            {item.where}
          </Text>
        </View>

        {(item.signs || item.behavior) && (
          <View style={styles.section}>
            <Text style={styles.bold}>Signs & behavior: </Text>
            <Text style={styles.body}>
              {item.signs}{item.signs && item.behavior ? '; ' : ''}{item.behavior ?? ''}
            </Text>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.bold}>What to do if you encounter:</Text>
          {item.whatToDo.map((line, i) => (
            <Text key={i} style={styles.li}>{'\u2022'} {line}</Text>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.bold}>Food security: </Text>
          <Text style={styles.body}>{item.foodSecurity}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.bold}>Add to Packlist: </Text>
          <Text style={styles.body}>{item.addToPacklist}</Text>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  topBar: {
    height: 44, borderRadius: 12, backgroundColor: '#1A1B1E',
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, marginBottom: 8,
  },
  backIcon: { width: 22, height: 22, tintColor: '#fff' },
  topTitle: { flex: 1, color: '#fff', fontSize: 18, fontWeight: '800', textAlign: 'center' },
  shareBtn: {
    width: 32, height: 32, borderRadius: 16, backgroundColor: '#E94040',
    alignItems: 'center', justifyContent: 'center'
  },
  shareIcon: { width: 18, height: 18 },

  card: {
    backgroundColor: '#1A1B1E', borderRadius: 16, padding: 12, flexDirection: 'row',
    alignItems: 'center', marginBottom: 12
  },
  icon: { width: 44, height: 44, borderRadius: 22, marginRight: 12 },
  level: { color: '#9EA3A9', marginBottom: 2 },
  levelValue: { color: '#FFD35B' },
  title: { color: '#fff', fontSize: 18, fontWeight: '800' },
  latin: { color: '#C9CDD2', fontWeight: '700' },

  section: { backgroundColor: '#151618', borderRadius: 12, padding: 12, marginBottom: 10 },
  bold: { color: '#fff', fontWeight: '800' },
  body: { color: '#E6E9EE', marginTop: 4, lineHeight: 20 },
  li: { color: '#E6E9EE', lineHeight: 20, marginTop: 4 },

  hint: { color: '#E6E9EE', lineHeight: 20 },
});