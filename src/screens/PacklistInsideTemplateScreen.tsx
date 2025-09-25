import React, { useMemo, useRef, useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  Pressable,
  Alert,
  ImageBackground,
  Modal,
  TextInput,
  Share,
  Platform,
} from 'react-native';
import { useNavigation, type RouteProp } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PACKLIST_TEMPLATES } from '../data/packlists';
import {
  loadMyLists,
  createMyList,
  addItemToList,
  getMyList,
  removeItemFromList,
} from '../storage/packlists';

const BG = require('../assets/locations_screen.png');
const BACKPACK = require('../assets/backpack.png');
const CHECK_OFF = require('../assets/checkbox_off.png');
const CHECK_ON = require('../assets/checkbox_on.png');
const TRASH = require('../assets/trash.png');
const FWD = require('../assets/forward.png');
const CLOSE_YELLOW = require('../assets/close_yellow.png');
const SHARE_ICON = require('../assets/icons.png');

type RouteT = RouteProp<
  Record<'PacklistInsideTemplate', { templateId: string }>,
  'PacklistInsideTemplate'
>;

type TplItem = { id: string; text: string };

export default function PacklistInsideTemplateScreen({ route }: { route: RouteT }) {
  const nav = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const { templateId } = route.params;

  const tpl = useMemo(
    () => PACKLIST_TEMPLATES.find((t) => t.id === templateId),
    [templateId]
  );

  const [items, setItems] = useState<TplItem[]>(() => tpl?.items ?? []);
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [isAddOpen, setAddOpen] = useState(false);
  const [newItem, setNewItem] = useState('');
  const myListIdRef = useRef<string | null>(null);
  const syncTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let isActive = true;
    (async () => {
  
      if (!tpl || !isActive) return;

      const lists = await loadMyLists();
      const existing = lists.find(
        (l) => l.title.trim().toLowerCase() === tpl.title.trim().toLowerCase()
      );
      if (!existing || !isActive) return;

      myListIdRef.current = existing.id;
      const current = await getMyList(existing.id);
      const saved = current?.items ?? [];

      const savedTextSet = new Set(
        saved.map((i: any) => i.text?.trim()).filter(Boolean)
      );

      setChecked((prev) => {
        const next = new Set(prev);
        items.forEach((it) => {
          if (savedTextSet.has(it.text.trim())) next.add(it.id);
        });
        return next;
      });

      const templateTextSet = new Set(items.map((it) => it.text.trim()));
      const customFromSaved: TplItem[] = saved
        .filter((i: any) => !templateTextSet.has(i.text.trim()))
        .map((i: any) => ({ id: `myl-${i.id}`, text: i.text }));

      if (customFromSaved.length) {
        setItems((prev) => [...prev, ...customFromSaved]);
        setChecked((prev) => {
          const next = new Set(prev);
          customFromSaved.forEach((it) => next.add(it.id));
          return next;
        });
      }
    })();

    return () => {
      isActive = false;
      if (syncTimer.current) clearTimeout(syncTimer.current);
    };
  }, [tpl, items]); 

  if (!tpl) {
    return (
      <View style={styles.center}>
        <Text style={{ color: '#fff' }}>Template not found</Text>
      </View>
    );
  }

  const onShare = async () => {
    try {
      await Share.share({
        title: tpl.title,
        message: `${tpl.title} — ${items.length} items`,
      });
    } catch {}
  };

  const ensureMyListId = useCallback(async (): Promise<string> => {
    if (myListIdRef.current) return myListIdRef.current;
    const lists = await loadMyLists();
    const existing = lists.find(
      (l) => l.title.trim().toLowerCase() === tpl.title.trim().toLowerCase()
    );
    const id = existing ? existing.id : (await createMyList(tpl.title)).id;
    myListIdRef.current = id;
    return id;
  }, [tpl.title]);

  const computeTargetTexts = useCallback(() => {
    const chosenTexts = items
      .filter((it) => checked.has(it.id))
      .map((it) => it.text.trim())
      .filter(Boolean);
    return Array.from(new Set(chosenTexts));
  }, [items, checked]);

  const persistSelection = useCallback(async () => {
    const target = computeTargetTexts();
    if (target.length === 0) return;

    const listId = await ensureMyListId();
    const current = await getMyList(listId);

    const currentTexts = (current?.items ?? []).map((i: any) => i.text.trim());
    const toAdd = target.filter((t) => !currentTexts.includes(t));
    const toRemove = (current?.items ?? []).filter(
      (i: any) => !target.includes(i.text.trim())
    );

    for (const rm of toRemove) {
      await removeItemFromList(listId, rm.id);
    }
    for (const t of toAdd) {
      await addItemToList(listId, t);
    }
  }, [computeTargetTexts, ensureMyListId]);

  const schedulePersist = useCallback(() => {
    if (syncTimer.current) clearTimeout(syncTimer.current);
    syncTimer.current = setTimeout(() => {
      persistSelection().catch(() => {});
    }, 250);
  }, [persistSelection]);

  const toggleCheck = (id: string) => {
    setChecked((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
    schedulePersist();
  };

  const removeLocalItem = (id: string) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
    setChecked((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    schedulePersist();
  };

  const confirmRemove = (id: string) => {
    Alert.alert('Remove item?', 'This will remove the item from this template view.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => removeLocalItem(id) },
    ]);
  };

  const onAddItem = async () => {
    const title = newItem.trim();
    if (!title) return;

    const listId = await ensureMyListId();
    await addItemToList(listId, title);

    const customId = `custom-${Date.now()}`;
    setItems(prev => [...prev, { id: customId, text: title }]);
    setChecked(prev => {
      const n = new Set(prev);
      n.add(customId);
      return n;
    });

    setAddOpen(false);
    setNewItem('');
    schedulePersist();
  };

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
            <Image
              source={BACKPACK}
              style={{ width: 48, height: 48, borderRadius: 24, marginRight: 10 }}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>{tpl.title}</Text>
              <Text style={styles.sub}>{items.length} items</Text>
            </View>
          </View>
        }
        data={items}
        keyExtractor={(it) => it.id}
        renderItem={({ item }) => {
          const isOn = checked.has(item.id);
          return (
            <View style={styles.itemRow}>
              <Pressable onPress={() => toggleCheck(item.id)} hitSlop={8}>
                <Image source={isOn ? CHECK_ON : CHECK_OFF} style={styles.checkbox} />
              </Pressable>
              <Text
                style={[
                  styles.itemText,
                  isOn && { opacity: 0.6, textDecorationLine: 'line-through' },
                ]}
              >
                {item.text}
              </Text>
              <Pressable onPress={() => confirmRemove(item.id)} hitSlop={8}>
                <Image source={TRASH} style={{ width: 18, height: 18, opacity: 0.7 }} />
              </Pressable>
            </View>
          );
        }}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 16 }}
        ListFooterComponent={
          <View style={{ alignItems: 'center', paddingTop: 12 }}>
            <Pressable onPress={() => setAddOpen(true)} hitSlop={10}>
              <Image
                source={CLOSE_YELLOW}
                style={{ width: 56, height: 56, resizeMode: 'contain' }}
              />
            </Pressable>
          </View>
        }
      />

      <Modal
        transparent
        visible={isAddOpen}
        animationType="fade"
        onRequestClose={() => setAddOpen(false)}
      >
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
            <Pressable style={styles.modalBtn} onPress={onAddItem}>
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
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#0E0F10' },

  topBar: {
    height: 44,
    borderRadius: 12,
    backgroundColor: '#1A1B1E',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginBottom: 8,
  },
  backIcon: { width: 22, height: 22, tintColor: '#fff' },
  topTitle: { flex: 1, color: '#fff', fontSize: 18, fontWeight: '800', textAlign: 'center' },

  shareBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E94040',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareIcon: { width: 18, height: 18 },

  headerCard: {
    margin: 16,
    padding: 12,
    borderRadius: 16,
    backgroundColor: '#1A1B1E',
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: { color: '#fff', fontSize: 18, fontWeight: '800' },
  sub: { color: '#9EA3A9', marginTop: 2 },

  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#151618',
    borderRadius: 12,
    padding: 12,
  },
  checkbox: { width: 22, height: 22, marginRight: 10 },
  itemText: { flex: 1, color: '#E6E9EE' },

  modalWrap: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  modalCard: { width: '100%', borderRadius: 16, backgroundColor: '#121316', padding: 16 },
  modalTitle: { color: '#fff', fontWeight: '800', fontSize: 18, marginBottom: 10, textAlign: 'center' },
  modalInput: {
    height: 44,
    borderRadius: 12,
    backgroundColor: '#1A1B1E',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    color: '#fff',
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  modalBtn: {
    height: 44,
    borderRadius: 12,
    backgroundColor: '#E94040',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBtnText: { color: '#fff', fontWeight: '800' },
  modalBtnSecondary: {
    height: 40,
    borderRadius: 12,
    backgroundColor: '#2F3237',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  modalBtnSecondaryText: { color: '#fff', fontWeight: '700' },
});