import React, { useEffect, useMemo, useState } from 'react';
import {
  View, Text, StyleSheet, Image, FlatList, Pressable, Modal,
  TextInput, ImageBackground, Alert, Share, DeviceEventEmitter, Platform
} from 'react-native';
import { useNavigation, useFocusEffect, type RouteProp } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getMyList, toggleItemDone, addItemToList, removeItemFromList, deleteListPermanently } from '../storage/packlists';
import { EVT_MY_LISTS_CLEARED } from './SettingsScreen';

const BG = require('../assets/locations_screen.png');
const BACKPACK = require('../assets/backpack.png');
const CHECK_OFF = require('../assets/checkbox_off.png');
const CHECK_ON = require('../assets/checkbox_on.png');
const TRASH = require('../assets/trash.png');
const FWD = require('../assets/forward.png');
const CLOSE_YELLOW = require('../assets/close_yellow.png');
const SHARE_ICON = require('../assets/icons.png');

type RouteT = RouteProp<Record<'PacklistInside', { listId: string }>, 'PacklistInside'>;

export default function PacklistInsideScreen({ route }: { route: RouteT }) {
  const nav = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const { listId } = route.params;

  const [list, setList] = useState<any | null>(null);
  const [isAddOpen, setAddOpen] = useState(false);
  const [newItem, setNewItem] = useState('');

  useFocusEffect(
    React.useCallback(() => {
      (async () => {
        const l = await getMyList(listId);
        setList(l);
      })();
      return () => {};
    }, [listId])
  );

  useEffect(() => {
    const sub = DeviceEventEmitter.addListener(EVT_MY_LISTS_CLEARED, () => {
      setList(null);
      nav.goBack();
    });
    return () => sub.remove();
  }, [nav]);

  const items = useMemo(() => list?.items ?? [], [list]);

  const onToggle = async (itemId: string) => {
    const updated = await toggleItemDone(listId, itemId);
    setList(updated);
  };

  const onAdd = async () => {
    const t = newItem.trim();
    if (!t) return;
    const updated = await addItemToList(listId, t);
    setNewItem('');
    setAddOpen(false);
    setList(updated);
  };

  const onRemove = async (itemId: string) => {
    const updated = await removeItemFromList(listId, itemId);
    setList(updated);
  };

  const onDeleteList = () => {
    Alert.alert(
      'Delete this packlist?',
      "This will permanently remove the list and all checkmarks. This action can't be undone",
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteListPermanently(listId);
            nav.navigate('MainTabs', {
              screen: 'Packlists',
              params: { showTab: 'mine', bump: Date.now() },
            });
          },
        },
      ]
    );
  };

  const onShare = async () => {
    if (!list) return;
    try {
      await Share.share({ title: list.title, message: `${list.title} — ${items.length} items` });
    } catch {}
  };

  if (!list) return null;

  return (
    <ImageBackground source={BG} style={{ flex: 1 }}>
      <View style={{ paddingTop: insets.top + 6 + (Platform.OS === 'android' ? 20 : 0), paddingHorizontal: 12 }}>
        <View style={styles.topBar}>
          <Pressable onPress={() => nav.goBack()} hitSlop={10}>
            <Image source={FWD} style={[styles.backIcon, { transform: [{ scaleX: -1 }] }]} />
          </Pressable>
          <Text style={styles.topTitle}>Packlist</Text>
          <Pressable onPress={onShare} hitSlop={10} style={styles.shareBtn}>
            <Image source={SHARE_ICON} style={styles.shareIcon} resizeMode="contain" />
          </Pressable>
        </View>
      </View>
      <FlatList
        ListHeaderComponent={
          <View style={styles.headerCard}>
            <Image source={BACKPACK} style={{ width: 48, height: 48, borderRadius: 24, marginRight: 10 }} />
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>{list.title}</Text>
              <Text style={styles.sub}>{items.length} items</Text>
            </View>
            <Pressable onPress={onDeleteList} hitSlop={10}>
              <Image source={TRASH} style={{ width: 18, height: 18 }} />
            </Pressable>
          </View>
        }
        data={items}
        keyExtractor={(it: any) => it.id}
        renderItem={({ item }) => (
          <View style={styles.itemRow}>
            <Pressable onPress={() => onToggle(item.id)} hitSlop={8}>
              <Image source={item.done ? CHECK_ON : CHECK_OFF} style={styles.checkbox} />
            </Pressable>
            <Text style={[styles.itemText, item.done && { opacity: 0.6, textDecorationLine: 'line-through' }]}>{item.text}</Text>
            <Pressable onPress={() => onRemove(item.id)} hitSlop={8}>
              <Image source={TRASH} style={{ width: 18, height: 18, opacity: 0.7 }} />
            </Pressable>
          </View>
        )}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        contentContainerStyle={{ padding: 16 }}
        ListFooterComponent={
          <View style={{ alignItems: 'center', paddingTop: 12, paddingBottom: insets.bottom + 16 }}>
            <Pressable onPress={() => setAddOpen(true)} hitSlop={10}>
              <Image source={CLOSE_YELLOW} style={{ width: 56, height: 56, resizeMode: 'contain' }} />
            </Pressable>
          </View>
        }
      />
      <Modal transparent visible={isAddOpen} animationType="fade" onRequestClose={() => setAddOpen(false)}>
        <View style={styles.modalWrap}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Add an item</Text>
            <TextInput
              value={newItem}
              onChangeText={setNewItem}
              placeholder="Item Name"
              placeholderTextColor="#9BA0A5"
              style={styles.modalInput}
            />
            <Pressable style={styles.modalBtn} onPress={onAdd}>
              <Text style={styles.modalBtnText}>Add</Text>
            </Pressable>
            <Pressable style={styles.modalBtnSecondary} onPress={() => setAddOpen(false)}>
              <Text style={styles.modalBtnSecondaryText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
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
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: '#E94040', alignItems: 'center', justifyContent: 'center',
  },
  shareIcon: { width: 18, height: 18 },
  headerCard: {
    margin: 16, padding: 12, borderRadius: 16, backgroundColor: '#1A1B1E',
    flexDirection: 'row', alignItems: 'center',
  },
  title: { color: '#fff', fontSize: 18, fontWeight: '800' },
  sub: { color: '#9EA3A9', marginTop: 2 },
  itemRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#151618', borderRadius: 12, padding: 12 },
  checkbox: { width: 22, height: 22, marginRight: 10 },
  itemText: { flex: 1, color: '#E6E9EE' },
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