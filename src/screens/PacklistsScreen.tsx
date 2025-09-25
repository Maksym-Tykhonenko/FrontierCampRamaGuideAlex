import React, { useEffect, useMemo, useState } from 'react';
import {
  View, Text, StyleSheet, Image, ImageBackground, FlatList,
  Pressable, Modal, TextInput, DeviceEventEmitter, Platform
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { PACKLIST_TEMPLATES } from '../data/packlists';
import { loadMyLists, createMyList, selectMyLists } from '../storage/packlists';
import type { MyList } from '../storage/packlists';
import { EVT_MY_LISTS_CLEARED } from './SettingsScreen';

const BG = require('../assets/locations_screen.png');
const BRAND = require('../assets/Group2.png');
const PLUS_RED = require('../assets/plus_red.png');
const BACKPACK = require('../assets/backpack.png');
const FWD = require('../assets/forward.png');
const ONB2 = require('../assets/onb2.png');

type MyListRow = MyList;

export default function PacklistsScreen() {
  const insets = useSafeAreaInsets();
  const nav = useNavigation<any>();

  const [tab, setTab] = useState<'templates' | 'mine'>('templates');
  const [myLists, setMyLists] = useState<MyListRow[]>([]);
  const [isNewOpen, setNewOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');

  const reloadLists = async () => {
    const lists = await loadMyLists();
    setMyLists(lists);
  };

  useFocusEffect(
    React.useCallback(() => {
      reloadLists();
      return () => {};
    }, [])
  );

  useEffect(() => {
    const sub = DeviceEventEmitter.addListener(EVT_MY_LISTS_CLEARED, () => {
      setMyLists([]);
    });
    return () => sub.remove();
  }, []);

  const onCreateList = async () => {
    const title = newTitle.trim();
    if (!title) return;
    const fresh = await createMyList(title);
    setNewOpen(false);
    setNewTitle('');
    setMyLists(prev => [fresh, ...prev]);
    nav.navigate('PacklistInside', { listId: fresh.id });
  };

  const data = useMemo(
    () => (tab === 'templates' ? PACKLIST_TEMPLATES : selectMyLists(myLists)),
    [tab, myLists]
  );

  const renderRow = ({ item }: any) => {
    if (tab === 'templates') {
      return (
        <View style={styles.row}>
          <Image source={BACKPACK} style={{ width: 48, height: 48, borderRadius: 24 }} />
          <View style={{ flex: 1, marginHorizontal: 10 }}>
            <Text style={styles.rowTitle}>{item.title}</Text>
            <Text style={styles.rowSub}>{item.items.length} items</Text>
          </View>
          <Pressable
            onPress={() => nav.navigate('PacklistInsideTemplate', { templateId: item.id })}
            hitSlop={12}
          >
            <Image source={FWD} style={{ width: 20, height: 20 }} />
          </Pressable>
        </View>
      );
    }
    return (
      <View style={styles.row}>
        <Image source={BACKPACK} style={{ width: 48, height: 48, borderRadius: 24 }} />
        <View style={{ flex: 1, marginHorizontal: 10 }}>
          <Text style={styles.rowTitle}>{item.title}</Text>
          <Text style={styles.rowSub}>{item.items.length} items</Text>
        </View>
        <Pressable onPress={() => nav.navigate('PacklistInside', { listId: item.id })} hitSlop={12}>
          <Image source={FWD} style={{ width: 20, height: 20 }} />
        </Pressable>
      </View>
    );
  };

  return (
    <ImageBackground source={BG} style={styles.bg}>
      <View style={{ paddingTop: insets.top + 8 + (Platform.OS === 'android' ? 20 : 0), flex: 1 }}>
        <View style={styles.header}>
          <Image source={BRAND} style={styles.brand} />
          <Text style={styles.headerTitle}>Packlists</Text>
          <Pressable onPress={() => setNewOpen(true)} hitSlop={10}>
            <Image source={PLUS_RED} style={{ width: 36, height: 36 }} />
          </Pressable>
        </View>
        <View style={styles.tabs}>
          <Pressable onPress={() => setTab('templates')} style={[styles.tab, tab === 'templates' && styles.tabActive]}>
            <Text style={[styles.tabText, tab === 'templates' && styles.tabTextActive]}>Templates</Text>
          </Pressable>
          <Pressable onPress={() => setTab('mine')} style={[styles.tab, tab === 'mine' && styles.tabActive]}>
            <Text style={[styles.tabText, tab === 'mine' && styles.tabTextActive]}>My Lists</Text>
          </Pressable>
        </View>
        {tab === 'mine' && data.length === 0 ? (
          <View style={styles.empty}>
            <Image source={ONB2} style={{ width: 230, height: 162, marginBottom: 10 }} />
            <Text style={styles.emptyText}>
              Build your first packlist. Start from a template or create your own
            </Text>
          </View>
        ) : (
          <FlatList
            data={data}
            keyExtractor={(it: any) => it.id}
            renderItem={renderRow}
            contentContainerStyle={{ paddingHorizontal: 12, paddingBottom: insets.bottom + 16 }}
            ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          />
        )}
      </View>
      <Modal transparent visible={isNewOpen} animationType="fade" onRequestClose={() => setNewOpen(false)}>
        <View style={styles.modalWrap}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Create a List</Text>
            <TextInput
              value={newTitle}
              onChangeText={setNewTitle}
              placeholder="List Name"
              placeholderTextColor="#9BA0A5"
              style={styles.modalInput}
            />
            <Pressable style={styles.modalBtn} onPress={onCreateList}>
              <Text style={styles.modalBtnText}>Create</Text>
            </Pressable>
            <Pressable style={styles.modalBtnSecondary} onPress={() => setNewOpen(false)}>
              <Text style={styles.modalBtnSecondaryText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, backgroundColor: '#0E0F10' },
  header: { height: 64, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12 },
  brand: { width: 50, height: 50, borderRadius: 12, marginRight: 8 },
  headerTitle: { flex: 1, textAlign: 'center', color: '#fff', fontWeight: '800', fontSize: 24 },
  tabs: { flexDirection: 'row', paddingHorizontal: 12, gap: 10, marginBottom: 10 },
  tab: {
    flex: 1, height: 40, borderRadius: 20, backgroundColor: '#1A1B1E',
    alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'transparent'
  },
  tabActive: { backgroundColor: '#E94040', borderColor: '#E94040' },
  tabText: { color: '#C9CDD2', fontWeight: '700' },
  tabTextActive: { color: '#fff' },
  row: {
    minHeight: 72, backgroundColor: '#1A1B1E', borderRadius: 14,
    padding: 12, flexDirection: 'row', alignItems: 'center'
  },
  rowTitle: { color: '#fff', fontWeight: '800', fontSize: 15, marginBottom: 2 },
  rowSub: { color: '#9EA3A9', fontSize: 12 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  emptyText: { color: '#C9CDD2', textAlign: 'center' },
  modalWrap: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center', padding: 24 },
  modalCard: { width: '100%', borderRadius: 16, backgroundColor: '#121316', padding: 16 },
  modalTitle: { color: '#fff', fontWeight: '800', fontSize: 18, marginBottom: 10, textAlign: 'center' },
  modalInput: {
    height: 44, borderRadius: 12, backgroundColor: '#1A1B1E', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
    color: '#fff', paddingHorizontal: 12, marginBottom: 10
  },
  modalBtn: { height: 44, borderRadius: 12, backgroundColor: '#E94040', alignItems: 'center', justifyContent: 'center' },
  modalBtnText: { color: '#fff', fontWeight: '800' },
  modalBtnSecondary: { height: 40, borderRadius: 12, backgroundColor: '#2F3237', alignItems: 'center', justifyContent: 'center', marginTop: 8 },
  modalBtnSecondaryText: { color: '#fff', fontWeight: '700' },
});