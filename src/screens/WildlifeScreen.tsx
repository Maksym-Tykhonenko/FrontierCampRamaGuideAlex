import React from 'react';
import {
  View, Text, StyleSheet, Image, ImageBackground, FlatList, Pressable, Platform
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const BG = require('../assets/locations_screen.png');
const DEER = require('../assets/deer.png'); 

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

const WILDLIFE: WildlifeItem[] = [
  {
    id: 'black-bear',
    name: 'Black Bear',
    latin: 'Ursus americanus',
    level: 'Caution',
    where:
      'Forests across BC, AB, SK, MB, ON, QC, NB, NS, PE, NL; edges of campgrounds, berry patches.',
    signs:
      'Tracks with five toes, claw marks on trees, scat with seeds/berries; curious but usually avoids people.',
    whatToDo: [
      'Stay calm; do not run.',
      'Speak firmly; make yourself look larger; keep kids close.',
      'Back away slowly, giving an exit route.',
      'If it approaches: ready bear spray (effective range ~8–10 m).',
      'If contact seems imminent: use spray; leave area when safe.',
    ],
    foodSecurity:
      'Use bear canisters/lockers; never leave food or scented items out; cook/eat 60 m from your tent in backcountry.',
    addToPacklist:
      'Bear spray, odor-proof bags, hard-sided container (car), long cord for hangs, whistle/air horn.',
  },
  {
    id: 'grizzly',
    name: 'Grizzly/Brown Bear',
    latin: 'Ursus arctos',
    level: 'Extreme Caution',
    regionNote: 'Select ranges of BC, AB, YT, NT, NU.',
    where:
      'Alpine meadows, avalanche paths, river bars; common in the Rockies and North.',
    signs:
      'Large tracks with long claw marks, wide scat, deep digs in meadows.',
    whatToDo: [
      'Stay calm; do not run or climb trees.',
      'Low, calm voice; avoid direct eye contact; back away slowly.',
      'If it charges and seems defensive (surprised, with cubs): stand ground; use spray late (when within range).',
      'If contact occurs in a defensive attack: lie face-down, hands over neck, legs spread; remain still until it leaves.',
      'If the bear appears predatory (stalking, persistent): fight back with spray, rocks, sticks—aim for the face.',
    ],
    foodSecurity:
      'As above; cook well away from sleeping area; avoid fish odors on clothing.',
    addToPacklist:
      'Bear spray (+ holster), satellite communicator (remote zones), first-aid.',
  },
  {
    id: 'moose',
    name: 'Moose',
    latin: 'Alces alces',
    level: 'Caution',
    where:
      'Lakes, marsh edges, willow flats across much of Canada.',
    signs:
      'Large heart-shaped tracks; browse on willows/aquatic plants.',
    behavior:
      'Can seem calm but may charge if surprised, with calf, or during rut (fall).',
    whatToDo: [
      'Keep very wide distance; give moose the trail.',
      'If ears pin back or hair rises: you’re too close—retreat behind cover (trees, car).',
      'If it charges: run behind solid cover; moose are fast but tire quickly.',
    ],
    foodSecurity:
      'Not a food-conditioned species issue, but keep camps tidy to avoid attracting bears/wolves.',
    addToPacklist:
      'Headlamp (dusk visibility), trekking pole (brush), bright clothing for shoulder seasons.',
  },
  {
    id: 'elk',
    name: 'Elk/Wapiti',
    latin: 'Cervus canadensis',
    level: 'Caution',
    where:
      'Foothills, park towns (Banff/Jasper), meadows and edges.',
    signs:
      'Bugling in fall, groups in meadows, hoof prints with two toes.',
    whatToDo: [
      'Give a wide berth; never move between a bull and cows or a cow and calf.',
      'If a bull faces you, head up and antlers back—back away quickly behind cover.',
      'During calving, cows can charge—leave the area immediately.',
    ],
    foodSecurity: 'Standard clean-camp practices.',
    addToPacklist:
      'Binoculars (view from afar), map of town wildlife zones.',
  },
  {
    id: 'wolf',
    name: 'Grey Wolf',
    latin: 'Canis lupus',
    level: 'Caution',
    where:
      'Boreal forest, mountain valleys, tundra; often nocturnal near people.',
    signs:
      'Tracks (four toes, nails), chorus howls, scat with hair/bone.',
    behavior: 'Avoids humans; close approaches are rare.',
    whatToDo: [
      'Stand your ground; make yourself look larger; speak/shout.',
      'Back away facing the wolf; do not run.',
      'If it approaches within a few strides: throw rocks/sticks, use air horn or spray.',
    ],
    foodSecurity:
      'Never leave food/scraps; pack out fish remains away from camp.',
    addToPacklist: 'Air horn/whistle, headlamp with strong beam.',
  },
  {
    id: 'cougar',
    name: 'Cougar/Mountain Lion',
    latin: 'Puma concolor',
    level: 'Extreme Caution',
    where:
      'Forested canyons, coastal ranges (BC), mountain foothills.',
    signs:
      'Tracks (large cat print—no nail marks), caches of prey under debris.',
    behavior: 'Stealthy; may follow quietly.',
    whatToDo: [
      'Maintain eye contact; make yourself big; gather group together.',
      'Speak loudly, throw stones/sticks; do not crouch or run.',
      'If it attacks: fight back with whatever you have; protect neck/face.',
    ],
    foodSecurity: 'Keep kids close at dawn/dusk; control pets.',
    addToPacklist:
      'Bear spray (effective on cougars), bright headlamp.',
  },
  {
    id: 'lynx',
    name: 'Canada Lynx',
    latin: 'Lynx canadensis',
    level: 'Awareness',
    where:
      'Boreal/subalpine forests in the North and mountain parks.',
    signs:
      'Big, round, fluffy paw prints; hare remains; quiet, solitary sightings.',
    behavior: 'Shy; encounters are typically brief and at distance.',
    whatToDo: ['Enjoy from afar; keep pets leashed; give it space to leave.'],
    foodSecurity: 'Standard clean-camp.',
    addToPacklist: 'Camera, binoculars.',
  },
];

export default function WildlifeScreen() {
  const nav = useNavigation<any>();
  const insets = useSafeAreaInsets();

  const renderRow = ({ item }: { item: WildlifeItem }) => (
    <Pressable
      onPress={() => nav.navigate('WildlifeDetails', { item })}
      style={styles.row}
    >
      <Image source={DEER} style={styles.icon} />
      <View style={{ flex: 1 }}>
        <Text style={styles.level}>Caution Level: <Text style={styles.levelValue}>{item.level}</Text></Text>
        <Text style={styles.name} numberOfLines={2}>
          {item.name} <Text style={styles.latin}>({item.latin})</Text>
        </Text>
      </View>
    </Pressable>
  );

  return (
    <ImageBackground source={BG} style={styles.bg}>
      <View style={{ paddingTop: insets.top + 8 + (Platform.OS === 'android' ? 20 : 0), paddingHorizontal: 12 }}>
        <View style={styles.topBar}>
          <Text style={styles.title}>Wildlife</Text>
        </View>
      </View>

      <FlatList
        data={WILDLIFE}
        keyExtractor={(it) => it.id}
        renderItem={renderRow}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        contentContainerStyle={{ padding: 12, paddingBottom: insets.bottom + 80 }}
      />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, backgroundColor: '#0E0F10' },
  topBar: {
    height: 44, borderRadius: 12, backgroundColor: '#1A1B1E',
    alignItems: 'center', justifyContent: 'center', marginBottom: 10,
  },
  title: { color: '#fff', fontWeight: '800', fontSize: 20 },
  row: {
    minHeight: 72, backgroundColor: '#1A1B1E', borderRadius: 14,
    padding: 12, flexDirection: 'row', alignItems: 'center'
  },
  icon: { width: 44, height: 44, borderRadius: 22, marginRight: 12 },
  level: { color: '#9EA3A9', fontSize: 12, marginBottom: 2 },
  levelValue: { color: '#FFD35B' },
  name: { color: '#fff', fontWeight: '800', fontSize: 15 },
  latin: { color: '#C9CDD2', fontWeight: '600' },
});