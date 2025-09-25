import AsyncStorage from '@react-native-async-storage/async-storage';
import type { PackItem } from '../types/packlists';

const KEY = 'MY_PACKLISTS_V1';

export type MyList = {
  id: string;
  title: string;
  items: PackItem[];
  sourceId?: string;   
};

function newId(prefix: string) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export async function loadMyLists(): Promise<MyList[]> {
  const raw = await AsyncStorage.getItem(KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as MyList[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function saveMyLists(lists: MyList[]): Promise<void> {
  await AsyncStorage.setItem(KEY, JSON.stringify(lists));
}

export function selectMyLists(lists: MyList[]): MyList[] {
  return lists;
}

export async function createMyList(title: string): Promise<MyList> {
  const lists = await loadMyLists();
  const list: MyList = { id: newId('u'), title, items: [] };
  await saveMyLists([list, ...lists]);
  return list;
}

export async function upsertFromTemplate(
  tpl: { id: string; title: string; items: Array<{ id?: string; text: string }> }
): Promise<MyList> {
  const lists = await loadMyLists();

  const exists = lists.find(l => l.sourceId === tpl.id);
  if (exists) return exists;

  const items: PackItem[] = tpl.items.map((it, i) => ({
    id: it.id ?? `${i}_${newId('c')}`,
    text: it.text,
    done: false,
  }));

  const copy: MyList = {
    id: newId('u'),
    title: tpl.title,
    items,
    sourceId: tpl.id,
  };

  await saveMyLists([copy, ...lists]);
  return copy;
}

export async function getMyList(id: string): Promise<MyList | null> {
  const lists = await loadMyLists();
  return lists.find(l => l.id === id) ?? null;
}

export async function toggleItemDone(listId: string, itemId: string): Promise<MyList | null> {
  const lists = await loadMyLists();
  const idx = lists.findIndex(l => l.id === listId);
  if (idx === -1) return null;

  const list = { ...lists[idx] };
  list.items = list.items.map(it =>
    it.id === itemId ? { ...it, done: !it.done } : it
  );

  const updated = [...lists];
  updated[idx] = list;
  await saveMyLists(updated);
  return list;
}

export async function addItemToList(listId: string, text: string): Promise<MyList | null> {
  const lists = await loadMyLists();
  const idx = lists.findIndex(l => l.id === listId);
  if (idx === -1) return null;

  const list = { ...lists[idx] };
  list.items = [{ id: newId('n'), text, done: false }, ...list.items];

  const updated = [...lists];
  updated[idx] = list;
  await saveMyLists(updated);
  return list;
}

export async function removeItemFromList(listId: string, itemId: string): Promise<MyList | null> {
  const lists = await loadMyLists();
  const idx = lists.findIndex(l => l.id === listId);
  if (idx === -1) return null;

  const list = { ...lists[idx] };
  list.items = list.items.filter(it => it.id !== itemId);

  const updated = [...lists];
  updated[idx] = list;
  await saveMyLists(updated);
  return list;
}

export async function deleteListPermanently(listId: string): Promise<void> {
  const lists = await loadMyLists();
  await saveMyLists(lists.filter(l => l.id !== listId));
}
