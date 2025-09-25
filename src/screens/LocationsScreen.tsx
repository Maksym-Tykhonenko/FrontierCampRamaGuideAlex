import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  Image,
  ImageBackground,
  Pressable,
  Share,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

import type { CategoryKey, LocationItem } from '../types/locations';
import { CATEGORIES, LOCATIONS } from '../data/locations';
import { getImage } from '../assets/imageMap';

const ICONS = {
  bg: require('../assets/locations_screen.png'),
  brand: require('../assets/Group2.png'),
  car: require('../assets/Car.png'),
  favOff: require('../assets/passive_flag.png'),
  favOn: require('../assets/active_checkbox.png'),
  share: require('../assets/sharing.png'),
  search: require('../assets/search.png'),
  onb2: require('../assets/onb2.png'),
};

type ChipItem = { key: CategoryKey | 'all'; label: string };

export default function LocationsScreen() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const nav = useNavigation<any>();

  const [query, setQuery] = useState('');
  const [activeCat, setActiveCat] = useState<CategoryKey | 'all'>('all');
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});

  const chips: ChipItem[] = useMemo(
    () => [{ key: 'all', label: 'All' }, ...CATEGORIES],
    []
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return LOCATIONS.filter((loc) => {
      const byCat = activeCat === 'all' ? true : loc.category === activeCat;
      const byQuery =
        q.length === 0 ||
        loc.title.toLowerCase().includes(q) ||
        loc.region.toLowerCase().includes(q) ||
        loc.access.toLowerCase().includes(q);
      return byCat && byQuery;
    });
  }, [query, activeCat]);

  const ordered = useMemo(() => {
    const arr = [...filtered];
    arr.sort((a, b) => Number(!!favorites[b.id]) - Number(!!favorites[a.id]));
    return arr;
  }, [filtered, favorites]);

  const toggleFav = (id: string) =>
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));

  const onOpenDetails = (item: LocationItem) => {
    nav.navigate('LocationDetailsScreen', { id: item.id });
  };

  const onShare = async (item: LocationItem) => {
    try {
      const message = `${item.title} — ${item.region}\n${item.coords}`;
      const content: { title?: string; url?: string; message: string } = {
        title: item.title,
        message,
      };
      if (Platform.OS === 'ios') {
        content.url = `data:text/plain,${encodeURIComponent(message)}`;
      }
      await Share.share(
        content,
        Platform.OS === 'android' ? { dialogTitle: item.title } : undefined
      );
    } catch (e) {}
  };

  const renderCard = ({ item }: { item: LocationItem }) => {
    const favOn = !!favorites[item.id];
    return (
      <View style={[styles.card, { width: width - 24 }]}>
        <Image source={getImage(item.imageKey)} style={styles.cardImage} resizeMode="cover" />

        <Pressable onPress={() => onOpenDetails(item)} style={styles.btnCar} hitSlop={10}>
          <Image source={ICONS.car} style={styles.carIcon} resizeMode="contain" />
        </Pressable>

        <Pressable onPress={() => toggleFav(item.id)} style={styles.btnFav} hitSlop={10}>
          <Image source={favOn ? ICONS.favOn : ICONS.favOff} style={{ width: 44, height: 44 }} />
        </Pressable>

        <Pressable onPress={() => onShare(item)} style={styles.btnShare} hitSlop={10}>
          <Image source={ICONS.share} style={{ width: 44, height: 44 }} />
        </Pressable>

        <View style={styles.cardOverlay} pointerEvents="none">
          <Text style={styles.cardRegion}>{item.region}</Text>
          <Text style={styles.cardTitle} numberOfLines={1}>
            {item.title}
          </Text>
        </View>
      </View>
    );
  };

  const noResults = ordered.length === 0;

  return (
    <ImageBackground source={ICONS.bg} style={styles.bg} imageStyle={{ resizeMode: 'cover' }}>
      <View
        style={{
          paddingTop: insets.top + 8 + (Platform.OS === 'android' ? 20 : 0),
          flex: 1,
        }}
      >
        <View style={styles.headerRow}>
          <Image source={ICONS.brand} style={styles.brand} />
          <Text style={styles.headerTitle}>Camp Spotlight</Text>
        </View>

        <View style={styles.searchWrap}>
          <Image source={ICONS.search} style={styles.searchIcon} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search for a place..."
            placeholderTextColor="#9BA0A5"
            style={styles.searchInput}
          />
        </View>

        <FlatList<ChipItem>
          horizontal
          data={chips}
          keyExtractor={(it) => String(it.key)}
          contentContainerStyle={{ paddingHorizontal: 12, paddingBottom: 18 }}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => {
            const isActive = activeCat === item.key;
            return (
              <Pressable
                onPress={() => setActiveCat(item.key)}
                style={[styles.chip, isActive && styles.chipActive]}
              >
                <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
                  {item.label}
                </Text>
              </Pressable>
            );
          }}
        />

        {noResults ? (
          <View style={styles.emptyWrap}>
            <Image source={ICONS.onb2} style={styles.emptyImage} resizeMode="contain" />
            <Text style={styles.emptyTitle20}>
              {`We couldn’t find any\nlocations matching`}
            </Text>
          </View>
        ) : (
          <FlatList<LocationItem>
            data={ordered}
            keyExtractor={(it) => it.id}
            renderItem={renderCard}
            contentContainerStyle={{ paddingHorizontal: 12, paddingBottom: insets.bottom + 120 }}
            ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, backgroundColor: '#0E0F10' },

  headerRow: {
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  brand: {
    position: 'absolute',
    left: 12,
    width: 50,
    height: 50,
    borderRadius: 12,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: 0.5,
  },

  searchWrap: {
    marginHorizontal: 12,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#1A1B1E',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    marginBottom: 18,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  searchIcon: { width: 18, height: 18, marginRight: 8, opacity: 0.9 },
  searchInput: { flex: 1, color: '#FFFFFF', paddingVertical: 0 },

  chip: {
    height: 24,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: '#1A1B1E',
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipActive: { backgroundColor: '#E94040', borderColor: '#E94040' },
  chipText: { color: '#C9CDD2', fontWeight: '700', fontSize: 11, lineHeight: 14 },
  chipTextActive: { color: '#fff' },

  card: {
    backgroundColor: 'transparent',
    borderRadius: 16,
    overflow: 'hidden',
    alignSelf: 'center',
  },
  cardImage: { width: '100%', height: 220 },
  btnCar: { position: 'absolute', top: 10, left: 10, padding: 2, zIndex: 2 },
  carIcon: { width: 44, height: 38 },
  btnFav: { position: 'absolute', top: 8, right: 8, zIndex: 2 },
  btnShare: { position: 'absolute', right: 8, bottom: 8, zIndex: 2 },
  cardOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 10,
    backgroundColor: 'rgba(0,0,0,0.45)',
    zIndex: 1,
  },
  cardRegion: { color: '#C9CDD2', fontSize: 12, marginBottom: 2 },
  cardTitle: { color: '#FFFFFF', fontSize: 18, fontWeight: '800' },

  emptyWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center', 
    paddingHorizontal: 24,
    gap: 12,
    transform: [{ translateY: -130 }], 
  },
  emptyImage: { width: 232, height: 162 },
  emptyTitle20: { color: '#fff', textAlign: 'center', fontSize: 20, lineHeight: 26 },

  emptyTitle: { color: '#fff', fontWeight: '800', textAlign: 'center', fontSize: 16 },
  emptyHint: { color: '#AAB0B6', textAlign: 'center' },
});