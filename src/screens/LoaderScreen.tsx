import React, { useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  ImageBackground,
  Animated,
  Easing,
  useWindowDimensions,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Loader'>;

const BASE_W = 252;
const BASE_H = 292;
const REF_W = 375;
const REF_H = 812;

export default function LoaderScreen({ navigation }: Props) {
  const { width, height } = useWindowDimensions();

  const a = useRef(new Animated.Value(0)).current;
  const bounce = useRef(new Animated.Value(0)).current; // Додаємо bounce
  useEffect(() => {
    a.setValue(0);
    Animated.timing(a, {
      toValue: 1,
      duration: 700,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [a]);

  useEffect(() => {
    const startBounce = () => {
      Animated.sequence([
        Animated.timing(bounce, {
          toValue: -184, // висота підстрибування
          duration: 300,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(bounce, {
          toValue: 0,
          duration: 400,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
      ]).start();
    };

    const timeout = setTimeout(() => {
      startBounce();
      const interval = setInterval(startBounce, 2000);
      // Очищення інтервалу при анмаунті
      return () => clearInterval(interval);
    }, 3000);

    return () => clearTimeout(timeout);
  }, [bounce]);

  const k = Math.min(width / REF_W, height / REF_H);
  const maxW = Math.min(width * 0.8, BASE_W * k); 
  const frontierW = Math.round(maxW);
  const frontierH = Math.round((BASE_H / BASE_W) * frontierW);

  const frontierAnimStyle = {
    opacity: a,
    transform: [
      { translateY: a.interpolate({ inputRange: [0, 1], outputRange: [16, 0] }) },
      { scale: a.interpolate({ inputRange: [0, 1], outputRange: [0.96, 1] }) },
      { translateY: bounce }, // Додаємо підстрибування
    ],
  };

  return (
    <ImageBackground
      source={require('../assets/von_loder.png')}
      style={styles.bg}
      resizeMode="cover"
    >
      <View style={styles.center}>
        <Animated.Image
          source={require('../assets/Frontier.png')}
          resizeMode="contain"
          style={[{ width: frontierW, height: frontierH }, frontierAnimStyle]}
        />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
