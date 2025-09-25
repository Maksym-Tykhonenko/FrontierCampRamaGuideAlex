import React, { useMemo, useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  useWindowDimensions,
  ImageBackground,
  Animated,
  Easing,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Onboarding'>;

const REF_W = 375;
const REF_H = 812;

const SLIDES = [
  {
    key: 's1',
    title: 'Find Your Next Camp',
    text:
      'Discover curated Canadian campsites with maps, seasons, access notes, and essentials—ready for offline',
    img: require('../assets/onb1.png'), 
  },
  {
    key: 's2',
    title: 'Wildlife-Smart, Not Scared',
    text:
      'Clear animal profiles and step-by-step “what to do if” keep you safe around bears, moose, wolves, and more',
    img: require('../assets/onb2.png'), 
  },
  {
    key: 's3',
    title: 'Pack, Learn, Go',
    text:
      'Build checkable packlists, save pages for offline, and lock in skills with fast quizzes. Plan lighter, travel safer',
    img: require('../assets/onb3.png'), 
  },
];

export default function OnboardingScreen({ navigation }: Props) {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView>(null);
  const [page, setPage] = useState(0);

  const k = Math.min(width / REF_W, height / REF_H);
  const S = useMemo(() => {
    const maxW = width * 0.75;
    const baseW = 300 * k * 1.08; 
    const imgW = Math.round(Math.min(baseW, maxW));
    const imgH = Math.round(imgW * 1.12);

    return {
      imgW,
      imgH,
      cardMinH: Math.max(Math.round(height * 0.42), 300),
      cardPadH: Math.round(22 * k),
      cardPadW: Math.round(18 * k),
      cardRadius: Math.round(30 * k),
      titleFS: Math.max(20, Math.round(24 * k)),
      textFS: Math.max(13, Math.round(16 * k)),
      btnH: Math.max(48, Math.round(54 * k)),
      btnFS: Math.max(14, Math.round(16 * k)),
      dots: Math.max(7, Math.round(9 * k)),
      bottomSafe: Math.max(insets.bottom, 16),
    };
  }, [k, width, height, insets.bottom]);

  const aTop = useRef(new Animated.Value(0)).current;
  const aText = useRef(new Animated.Value(0)).current;

  const runAnim = () => {
    aTop.setValue(0);
    aText.setValue(0);
    Animated.stagger(120, [
      Animated.timing(aTop, { toValue: 1, duration: 520, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.timing(aText, { toValue: 1, duration: 460, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
    ]).start();
  };
  useEffect(runAnim, [page]); 

  const onMomentumEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const idx = Math.round(e.nativeEvent.contentOffset.x / width);
    if (idx !== page) setPage(idx);
  };

  const onNext = () => {
    if (page < SLIDES.length - 1) {
      scrollRef.current?.scrollTo({ x: (page + 1) * width, animated: true });
      setPage(p => Math.min(p + 1, SLIDES.length - 1));
    } else {
      navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] });
    }
  };

  const bgSource = require('../assets/von_loder.png');

  return (
    <ImageBackground source={bgSource} style={styles.bg} resizeMode="cover">
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onMomentumEnd}
        style={styles.flex}
      >
        {SLIDES.map((s, i) => {
          const active = i === page;
          const imgAnim = {
            opacity: aTop,
            transform: [
              { translateY: aTop.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) },
              { scale: aTop.interpolate({ inputRange: [0, 1], outputRange: [0.95, 1] }) },
            ],
          };
          const textAnim = {
            opacity: aText,
            transform: [{ translateY: aText.interpolate({ inputRange: [0, 1], outputRange: [14, 0] }) }],
          };

          return (
            <View key={s.key} style={[styles.page, { width }]}>
              <View style={styles.topWrap}>
                {active ? (
                  <Animated.Image
                    source={s.img}
                    style={[{ width: S.imgW, height: S.imgH }, imgAnim]}
                    resizeMode="contain"
                  />
                ) : (
                  <Animated.Image
                    source={s.img}
                    style={{ width: S.imgW, height: S.imgH, opacity: 0.85 }}
                    resizeMode="contain"
                  />
                )}
              </View>

              <Animated.View
                style={[
                  styles.card,
                  {
                    minHeight: S.cardMinH,
                    paddingTop: S.cardPadH + 4,
                    paddingBottom: S.cardPadH + S.bottomSafe,
                    paddingHorizontal: S.cardPadW,
                    borderTopLeftRadius: S.cardRadius,
                    borderTopRightRadius: S.cardRadius,
                  },
                  active && textAnim,
                ]}
              >
                <Text style={[styles.title, { fontSize: S.titleFS }]}>{s.title}</Text>
                <Text style={[styles.text, { fontSize: S.textFS, marginBottom: 14 }]}>{s.text}</Text>

                <View style={{ height: 6 }} />
                <View style={styles.dotsRow}>
                  {SLIDES.map((_, di) => (
                    <View
                      key={di}
                      style={[
                        styles.dot,
                        {
                          width: S.dots,
                          height: S.dots,
                          opacity: page === di ? 1 : 0.35,
                          transform: [{ scale: page === di ? 1.18 : 1 }],
                        },
                      ]}
                    />
                  ))}
                </View>

                <Pressable onPress={onNext} style={[styles.btn, { height: S.btnH }]}>
                  <Text style={[styles.btnText, { fontSize: S.btnFS }]}>
                    {i < SLIDES.length - 1 ? 'Next' : 'Get Started'}
                  </Text>
                </Pressable>
              </Animated.View>
            </View>
          );
        })}
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  bg: { flex: 1 },
  page: { flex: 1, justifyContent: 'flex-end' },
  topWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingTop: 32,
  },
  card: {
    backgroundColor: 'rgba(12,12,12,0.92)',
    shadowColor: '#000',
    shadowOpacity: 0.22,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: -7 },
   
    elevation: 12,
  },
  title: {
    color: '#FFFFFF',
    fontWeight: '800',
    lineHeight: 30,
    textAlign: 'center',
    marginBottom: 8,
  },
  text: {
    color: '#FFFFFF',
    opacity: 0.86,
    textAlign: 'center',
    lineHeight: 21,
    marginHorizontal: 10,
  },
  dotsRow: {
    alignSelf: 'center',
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
    marginBottom: 16,
  },
  dot: {
    borderRadius: 999,
    backgroundColor: '#fff',
  },
  btn: {
    alignSelf: 'center',
    minWidth: 230,
    paddingHorizontal: 24,
    borderRadius: 16,
    backgroundColor: '#E94040',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: { color: '#fff', fontWeight: '800' },
});
