import React, { useEffect, useMemo, useRef } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  Pressable,
  Share,
  Platform,
  ImageBackground,
  StatusBar,
  StyleSheet as RNStyleSheet,
  Animated,
  Easing,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../navigation/types';
import { LOCATIONS } from '../data/locations';
import { getImage } from '../assets/imageMap';

type DetailsRoute = RouteProp<RootStackParamList, 'LocationDetailsScreen'>;

const ICONS = {
  bg: require('../assets/locations_screen.png'),
  share: require('../assets/icons.png'),
};

export default function LocationDetailsScreen({ route }: { route: DetailsRoute }) {
  const { id } = route.params;
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { height: winH, width: winW } = useWindowDimensions();

  const sizeClass: 'small' | 'medium' | 'large' =
    winH < 700 ? 'small' : winH < 820 ? 'medium' : 'large';

  const heroHeight = sizeClass === 'small' ? 180 : sizeClass === 'medium' ? 210 : 240;
  const titleFont = sizeClass === 'small' ? 20 : 22;
  const bodyFont = sizeClass === 'small' ? 14 : 15;

  const item = useMemo(() => LOCATIONS.find(l => l.id === id), [id]);

  const fadeHero = useRef(new Animated.Value(0)).current;
  const slideHero = useRef(new Animated.Value(16)).current;
  const fadeBody = useRef(new Animated.Value(0)).current;
  const slideBody = useRef(new Animated.Value(16)).current;

  useEffect(() => {
    Animated.stagger(120, [
      Animated.parallel([
        Animated.timing(fadeHero, { toValue: 1, duration: 350, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
        Animated.timing(slideHero, { toValue: 0, duration: 350, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(fadeBody, { toValue: 1, duration: 350, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
        Animated.timing(slideBody, { toValue: 0, duration: 350, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      ]),
    ]).start();
  }, [fadeHero, slideHero, fadeBody, slideBody]);

  if (!item) {
    return (
      <View style={styles.center}>
        <Text style={styles.missing}>Location not found</Text>
      </View>
    );
  }

  const onShare = async () => {
    try {
      const message = `${item.title} — ${item.region}\n${item.coords}`;
      const content: { title?: string; url?: string; message: string } = { title: item.title, message };
      if (Platform.OS === 'ios') content.url = `data:text/plain,${encodeURIComponent(message)}`;
      await Share.share(content, Platform.OS === 'android' ? { dialogTitle: item.title } : undefined);
    } catch {
   
    }
  };

  return (
    <ImageBackground
      source={ICONS.bg}
      style={styles.bg}
      imageStyle={[styles.bgImg, RNStyleSheet.absoluteFillObject]}
    >
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      <View style={[styles.header, { paddingTop: insets.top + 6 + (Platform.OS === 'android' ? 20 : 0) }]}>
        <Pressable onPress={() => navigation.goBack()} style={styles.headerBtn} hitSlop={10}>
          <Text style={styles.backArrow}>{'‹'}</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Details</Text>
        <Pressable onPress={onShare} style={styles.headerBtnRed} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Image source={ICONS.share} style={styles.shareIcon} resizeMode="contain" />
        </Pressable>
      </View>

      <ScrollView style={styles.wrap} contentContainerStyle={{ paddingBottom: 24 }}>
        <Animated.View
          style={[
            styles.heroWrap,
            { opacity: fadeHero, transform: [{ translateY: slideHero }] },
          ]}
        >
          <Image source={getImage(item.imageKey)} style={{ width: '100%', height: heroHeight, borderRadius: 16 }} resizeMode="cover" />
        </Animated.View>

        <Animated.View
          style={[
            styles.body,
            { opacity: fadeBody, transform: [{ translateY: slideBody }] },
          ]}
        >
          <Text style={[styles.region, { fontSize: sizeClass === 'small' ? 11 : 12 }]}>{item.region}</Text>

          <View style={styles.titleRow}>
            <Text style={[styles.title, { fontSize: titleFont }]}>{item.title}</Text>
      
          </View>

          <Text style={[styles.desc, { fontSize: bodyFont, lineHeight: bodyFont * 1.35 }]}>
            {item.description}
          </Text>
    
        </Animated.View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({

  bg: { flex: 1, backgroundColor: '#0E0F10' },
  bgImg: { resizeMode: 'cover' },

  header: {
    paddingHorizontal: 12,
    paddingBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backArrow: { color: '#fff', fontSize: 22, lineHeight: 22, marginTop: -1 },
  headerTitle: { flex: 1, textAlign: 'center', color: '#fff', fontSize: 18, fontWeight: '800' },
  headerBtnRed: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#E94040', alignItems: 'center', justifyContent: 'center' },
  shareIcon: { width: 14, height: 14 },

  wrap: { flex: 1 },

  heroWrap: {
    marginHorizontal: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },

  body: { paddingHorizontal: 16, paddingTop: 10 },
  region: { color: '#B8BDC3', marginBottom: 6 },

  titleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  title: { flex: 1, color: '#fff', fontWeight: '800' },

  desc: { color: '#D7DBE0', marginTop: 6 },

  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#0E0F10' },
  missing: { color: '#fff', fontSize: 16, fontWeight: '700' },
});