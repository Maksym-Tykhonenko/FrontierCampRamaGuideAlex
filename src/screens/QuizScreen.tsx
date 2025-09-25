import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  Pressable,
  Alert,
  FlatList,
  Animated,
  Easing,
  useWindowDimensions,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const BG = require('../assets/locations_screen.png');
const ONB2 = require('../assets/onb2.png');
const FWD = require('../assets/forward.png'); 

type Q = {
  id: string;
  prompt: string;
  options: [string, string, string, string];
  correct: 0 | 1 | 2 | 3;
  why: string;
};

const LETTERS = ['A', 'B', 'C', 'D'] as const;

const QUESTIONS: Q[] = [
  {
    id: 'tent-spot',
    prompt: "You're choosing a tent spot in the Rockies. What’s best?",
    options: [
      'Valley bottom near a stream',
      'Flat, well-drained ground away from dead branches',
      'Right under a big fir tree',
      'On a ridge for the breeze',
    ],
    correct: 1,
    why: 'Drainage + widowmaker safety > views/breeze.',
  },
  {
    id: 'fire-ban',
    prompt: 'During a fire ban, which is generally allowed?',
    options: [
      'Wood campfire in a fire ring',
      'Candle lantern',
      'Gas stove with a shutoff valve',
      'Charcoal grill',
    ],
    correct: 2,
    why: 'Pressurized gas stoves with shutoff are often permitted; always check local rules.',
  },
  {
    id: 'bear-food',
    prompt: 'Best practice for food in backcountry bear country?',
    options: [
      'Inside tent',
      'In backpack under vestibule',
      'Proper bear hang 60–70 m from camp',
      'Bear canister/locker',
    ],
    correct: 3,
    why: "Hard-sided canister/locker beats hangs (trees aren't always suitable).",
  },
  {
    id: 'protozoa',
    prompt: 'Water treatment that removes protozoa (e.g., Giardia)?',
    options: ['Boiling 1 minute', 'Activated carbon only', 'UV on cloudy water', 'Let it settle'],
    correct: 0,
    why: 'Boiling is reliable; filters (≤0.2–0.3 μm) also work, but carbon/settling/UV on turbid water do not.',
  },
  {
    id: 'trip-safety',
    prompt: 'Before a trip, the smartest safety move is:',
    options: [
      'Pack extra snacks',
      'Tell a friend your route & return time',
      'Bring two knives',
      'Wear new boots to break them in',
    ],
    correct: 1,
    why: 'A check-in plan is a proven lifesaver if things go wrong.',
  },
  {
    id: 'black-bear',
    prompt: 'A black bear notices you at ~30 m. Best move?',
    options: [
      'Run downhill',
      'Make yourself look bigger, speak firmly, back away slowly',
      'Throw food to distract it',
      'Climb a tree',
    ],
    correct: 1,
    why: 'Calm, controlled retreat + presence; never run or feed.',
  },
  {
    id: 'grizzly-charge',
    prompt: 'With cubs nearby, a grizzly false-charges. Your response?',
    options: [
      'Sprint to the trees',
      'Stand ground, deploy bear spray within range',
      'Play dead immediately at 50 m',
      'Turn your back and walk fast',
    ],
    correct: 1,
    why: 'Stand ground; spray at ~8–10 m for defensive charges.',
  },
  {
    id: 'moose-ears',
    prompt: 'A moose pins its ears and steps toward you. Do:',
    options: [
      'Wave trekking poles and approach',
      'Run to the open meadow',
      'Put solid cover (trees/vehicle) between you and moose',
      'Throw your pack at it',
    ],
    correct: 2,
    why: 'Use obstacles; moose can sprint and trample.',
  },
  {
    id: 'cougar-shadow',
    prompt: 'A cougar shadows your group on a forest trail. Best action?',
    options: [
      'Maintain eye contact, get big, shout/throw, don’t run',
      'Crouch to look smaller',
      'Turn off headlamps to avoid provoking it',
      'Scatter and hide',
    ],
    correct: 0,
    why: 'Intimidate; never crouch/run; stay together.',
  },
  {
    id: 'wolves',
    prompt: 'Wolves approach curiously to within ~20 m. You should:',
    options: [
      'Stand your ground, shout, throw, back away facing them',
      'Offer food so they leave',
      'Turn and jog away',
      'Lie down and stay still',
    ],
    correct: 0,
    why: 'Haze confidently; do not flee or feed.',
  },
  {
    id: 'greywater',
    prompt: 'Dishwater disposal in backcountry?',
    options: ['Dump in stream', 'Scatter strained greywater 60–70 m from water', 'Pour at the tent door', 'Bury in fire pit'],
    correct: 1,
    why: 'Strain food bits; broadcast away from water/camp.',
  },
  {
    id: 'camp-distance',
    prompt: 'How far from lakes/streams should you camp (where required)?',
    options: ['10 m', '30 m', '60–70 m (≈200 ft)', 'Right on the shore'],
    correct: 2,
    why: 'Protects riparian areas and wildlife movement.',
  },
  {
    id: 'cathole',
    prompt: 'Human waste: ideal cathole?',
    options: [
      '5 cm deep, by the trail',
      '15–20 cm deep, 60–70 m from water/trail/camp',
      'In shallow moss',
      'Directly in water to “wash away”',
    ],
    correct: 1,
    why: 'Depth + distance support decomposition and hygiene.',
  },
  {
    id: 'right-of-way',
    prompt: 'Trail courtesy on a steep singletrack?',
    options: ['Uphill hiker has right of way', 'Downhill hiker does', 'Largest group does', 'Whoever is more tired'],
    correct: 0,
    why: 'Uphill momentum is harder to restart.',
  },
  {
    id: 'firewood',
    prompt: 'Firewood practice in managed campgrounds?',
    options: [
      'Break dead branches off trees',
      'Cut live limbs low',
      'Buy/bring local, dry firewood',
      'Burn driftwood from protected beaches',
    ],
    correct: 2,
    why: 'Local dry wood reduces pest spread; never cut or strip trees.',
  },
  {
    id: 'hypothermia',
    prompt: 'Early hypothermia signs in a camper?',
    options: ['Fumbling, mumbling, stumbling', 'Nosebleed, hiccups', 'Rash and itching', 'Ear pain only'],
    correct: 0,
    why: 'The “umbles” signal cooling + impaired function.',
  },
  {
    id: 'heat-exhaustion',
    prompt: 'Best first step for heat exhaustion?',
    options: ['Tighten clothing', 'Move to shade, cool with water, sip fluids', 'Run to create breeze', 'Drink alcohol for “vasodilation”'],
    correct: 1,
    why: 'Active cooling + hydration.',
  },
  {
    id: 'lightning',
    prompt: 'Lightning nearby (flash–bang <30s). You should:',
    options: [
      'Shelter under tallest lone tree',
      'Spread out, avoid ridges/isolated trees, crouch if caught',
      'Lie flat in open field',
      'Keep fishing with graphite rod',
    ],
    correct: 1,
    why: 'Minimize strike risk; avoid conductors and prominences.',
  },
  {
    id: 'bleeding',
    prompt: 'Severe bleeding on the trail. First priority?',
    options: ['Find a twig for a tourniquet', 'Direct, firm pressure on the wound', 'Elevate only', 'Give caffeine'],
    correct: 1,
    why: 'Direct pressure is the fastest lifesaver; tourniquet if trained and needed.',
  },
  {
    id: 'tick',
    prompt: 'Removing an attached tick?',
    options: ['Burn with a match', 'Twist with fingers', 'Pull steadily with fine-tipped tweezers close to skin', 'Smother with oil'],
    correct: 2,
    why: 'Clean, steady traction reduces retained mouthparts; clean site after.',
  },
  {
    id: 'contours',
    prompt: 'Contour lines packed tightly on your map mean:',
    options: ['Flat ground', 'Cliffs/very steep terrain', 'Wetlands', 'Private land'],
    correct: 1,
    why: 'Close lines = rapid elevation change.',
  },
  {
    id: 'orient-map',
    prompt: 'Best basic way to orient a paper map?',
    options: [
      'Point north arrow at your car',
      "Align map’s north with compass north",
      'Hold it however is comfy',
      'Fold until only your trail shows',
    ],
    correct: 1,
    why: 'Orientation makes terrain features match reality.',
  },
  {
    id: 'river-crossing',
    prompt: 'Safest river crossing choice?',
    options: ['Narrow, roaring chute', 'Widest, shallow braided section', 'Waterfall lip', 'Log above rapids'],
    correct: 1,
    why: 'Wide + shallow reduces force; unbuckle hip belt before crossing.',
  },
  {
    id: 'tstorms',
    prompt: 'You expect afternoon thunderstorms. Smart itinerary tweak?',
    options: [
      'Plan ridgeline travel at 3–5 PM',
      'Do high, exposed sections early',
      'Pack less water to go faster',
      'Ignore clouds if forecast was “sunny”',
    ],
    correct: 1,
    why: 'Beat convective storms by starting high travel early.',
  },
  {
    id: 'whiteout',
    prompt: 'Whiteout on a lake in canoe country. Best nav tactic?',
    options: [
      'Paddle toward where you “feel” shore is',
      'Take a compass bearing and handrail along shoreline',
      'Wait in middle for wind to push you',
      'Follow another group without asking',
    ],
    correct: 1,
    why: 'Bearing + handrail (known edge) is reliable; don’t guess.',
  },
];

export default function QuizScreen() {
  const insets = useSafeAreaInsets();
  const { height, width } = useWindowDimensions();
  const isSmall = height < 700 || width <= 320;
  const FS = isSmall ? 0.9 : 1;

  const [phase, setPhase] = useState<'intro' | 'quiz'>('intro');
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [locked, setLocked] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);

  const total = QUESTIONS.length;
  const q = useMemo(() => QUESTIONS[idx], [idx]);

  const anim = useRef(new Animated.Value(0)).current;
  const runIn = () => {
    anim.setValue(0);
    Animated.timing(anim, {
      toValue: 1,
      duration: 260,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  };
  useEffect(() => { if (phase === 'quiz') runIn(); }, [phase, idx]);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  const startQuiz = () => {
    setScore(0);
    setIdx(0);
    setSelected(null);
    setLocked(false);
    setPhase('quiz');
  };

  const confirmExitQuiz = () => {
    Alert.alert('Exit quiz?', 'Your progress will be lost.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Exit', style: 'destructive', onPress: () => setPhase('intro') },
    ]);
  };

  const pauseQuiz = () => {
    Alert.alert(
      'Quiz Paused',
      "You've paused the quiz. Catch your breath—your answers are safe",
      [
        { text: 'Exit', style: 'cancel', onPress: () => setPhase('intro') },
        { text: 'Resume' },
      ]
    );
  };

  const finishQuiz = () => {
    setPhase('intro');
    Alert.alert('Trail Report', `You scored ${score}/${total}`, [{ text: 'Ok' }]);
  };

  const goNext = () => {
    if (idx + 1 >= total) finishQuiz();
    else {
      setIdx(i => i + 1);
      setSelected(null);
      setLocked(false);
    }
  };

  const onPick = (optIndex: number) => {
    if (locked) return;
    setSelected(optIndex);
    setLocked(true);
    if (optIndex === q.correct) setScore(s => s + 1);
    timerRef.current = setTimeout(goNext, 900);
  };

  const renderOption = (opt: string, i: number) => {
    const isCorrect = i === q.correct;
    const isSelectedWrong = selected === i && i !== q.correct;
    return (
      <Pressable
        key={i}
        style={[
          styles.option,
          { minHeight: isSmall ? 44 : 50, paddingVertical: isSmall ? 8 : 10 },
          locked && isCorrect && styles.optionCorrect,
          locked && isSelectedWrong && styles.optionWrong,
        ]}
        onPress={() => onPick(i)}
        disabled={locked}
        hitSlop={6}
      >
        <View style={[styles.badge, { width: isSmall ? 24 : 26, height: isSmall ? 24 : 26, borderRadius: isSmall ? 12 : 13 }]}>
          <Text style={[styles.badgeText, { fontSize: isSmall ? 12 : 13 }]}>{LETTERS[i]}</Text>
        </View>
        <Text style={[styles.optionText, { fontSize: 14 * FS }]} numberOfLines={2}>
          {opt}
        </Text>
      </Pressable>
    );
  };

  if (phase === 'intro') {
    return (
      <ImageBackground source={BG} style={styles.bg}>
        <View style={{ paddingTop: insets.top + 8 + (Platform.OS === 'android' ? 20 : 0), paddingHorizontal: 12 }}>
          <View style={styles.topBarCenter}>
            <Text style={[styles.title, { fontSize: isSmall ? 18 : 20 }]}>CampRama Quiz</Text>
          </View>
        </View>

        <View style={styles.introWrap}>
          <Image source={ONB2} style={[styles.hero, { width: isSmall ? 200 : 230, height: isSmall ? 140 : 162 }]} />
          <Text style={[styles.introText, { fontSize: 14 * FS }]}>
            Sharpen your trail skills—quick, practical questions for safer trips
          </Text>

          <Pressable style={[styles.startBtn, { height: isSmall ? 42 : 44 }]} onPress={startQuiz}>
            <Text style={styles.startBtnText}>Start Quiz</Text>
          </Pressable>
        </View>

        <View style={{ height: insets.bottom + 12 }} />
      </ImageBackground>
    );
  }

  const translateY = anim.interpolate({ inputRange: [0, 1], outputRange: [16, 0] });
  const opacity = anim;

  const questionMinH = Math.max(160, Math.floor(height * (isSmall ? 0.30 : 0.35)));

  return (
    <ImageBackground source={BG} style={styles.bg}>
    
      <View style={{ paddingTop: insets.top + 8 + (Platform.OS === 'android' ? 20 : 0), paddingHorizontal: 12 }}>
        <View style={styles.headerRow}>
          <Pressable onPress={confirmExitQuiz} hitSlop={10}>
            <Image source={FWD} style={[styles.backIcon, { transform: [{ scaleX: -1 }] }]} />
          </Pressable>

          <View style={styles.narrowPill}>
            <Text style={[styles.progress, { fontSize: 14 * FS }]}>
              Question {idx + 1} of {total}
            </Text>
          </View>

          <Pressable onPress={pauseQuiz} hitSlop={10} style={styles.pausePill}>
            <Text style={styles.pauseText}>II</Text>
          </Pressable>
        </View>
      </View>

      <Animated.View style={[styles.contentWrap, { opacity, transform: [{ translateY }] }]}>
        <View style={[styles.questionWrap, { minHeight: questionMinH, marginTop: 40 }]}>
          <Text style={[styles.prompt, { fontSize: (isSmall ? 20 : 22) * FS, textAlign: 'center' }]}>
            {q.prompt}
          </Text>
        </View>

        <View style={styles.optionsWrap}>
          <FlatList
            data={q.options}
            renderItem={({ item, index }) => renderOption(item, index)}
            ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
            keyExtractor={(_, i) => `${q.id}_${i}`}
            contentContainerStyle={{ paddingTop: 8, paddingBottom: insets.bottom + 16 }}
            scrollEnabled
            keyboardShouldPersistTaps="handled"
          />
        </View>
      </Animated.View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, backgroundColor: '#0E0F10' },
  introWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  hero: { width: 230, height: 162, marginBottom: 16, resizeMode: 'contain' },
  introText: { color: '#C9CDD2', textAlign: 'center', marginBottom: 16 },
  startBtn: {
    height: 44, borderRadius: 12, backgroundColor: '#E94040',
    paddingHorizontal: 20, alignItems: 'center', justifyContent: 'center', alignSelf: 'stretch',
  },
  startBtnText: { color: '#fff', fontWeight: '800' },

  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10, paddingHorizontal: 12 },
  backIcon: { width: 22, height: 22, tintColor: '#fff' },
  narrowPill: {
    flex: 1, height: 40, borderRadius: 20, backgroundColor: '#1A1B1E',
    alignItems: 'center', justifyContent: 'center',
  },
  progress: { color: '#fff', fontWeight: '800' },
  pausePill: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#2F3237', alignItems: 'center', justifyContent: 'center' },
  pauseText: { color: '#fff', fontWeight: '800' },

  contentWrap: { flex: 1, paddingHorizontal: 16 },

  questionWrap: { justifyContent: 'center', alignItems: 'center' },
  prompt: { color: '#E6E9EE', lineHeight: 26 },

  optionsWrap: { flex: 1, justifyContent: 'flex-end' },

  option: {
    borderRadius: 14,
    backgroundColor: '#151618',
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionCorrect: { backgroundColor: '#1F6D39', borderWidth: 2, borderColor: '#2ED573' },
  optionWrong: { backgroundColor: '#5A1E22', borderWidth: 2, borderColor: '#E94040' },
  badge: {
    width: 26, height: 26, borderRadius: 13,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#FFD35B', marginRight: 10,
  },
  badgeText: { fontWeight: '800', color: '#000' },
  optionText: { color: '#fff', flex: 1 },

  topBarCenter: {
    height: 44, borderRadius: 12, backgroundColor: '#1A1B1E',
    alignItems: 'center', justifyContent: 'center', marginBottom: 10,
  },
  title: { color: '#fff', fontWeight: '800', fontSize: 20 },
});