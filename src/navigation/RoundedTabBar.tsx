import React from 'react';
import { View, Pressable, Image, StyleSheet } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const icons = {
  Locations: {
    active: require('../assets/locations_active.png'),
    inactive: require('../assets/locations_inactive.png'),
  },
  Packlists: {
    active: require('../assets/packlists_active.png'),
    inactive: require('../assets/packlists_inactive.png'),
  },
  Wildlife: {
    active: require('../assets/wildlife_active.png'),
    inactive: require('../assets/wildlife_inactive.png'),
  },
  Quiz: {
    active: require('../assets/quiz_active.png'),
    inactive: require('../assets/quiz_inactive.png'),
  },
  Settings: {
    active: require('../assets/settings_active.png'),
    inactive: require('../assets/settings_inactive.png'),
  },
} as const;

export default function RoundedTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[styles.wrap, { paddingBottom: Math.max(insets.bottom, 8) }]}
      pointerEvents="box-none"
    >
      <View style={styles.pill}>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name as never);
            }
          };

          const onLongPress = () => {
            navigation.emit({ type: 'tabLongPress', target: route.key });
          };

          const iconPair = (icons as any)[route.name];
          const src = isFocused ? iconPair?.active : iconPair?.inactive;

          return (
            <Pressable
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              onPress={onPress}
              onLongPress={onLongPress}
              style={styles.item}
              hitSlop={8}
            >
              {!!src && <Image source={src} style={styles.icon} resizeMode="contain" />}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
  },
  pill: {
    height: 66,
    paddingHorizontal: 18,
    borderRadius: 40,
    backgroundColor: '#222326',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '88%',
  },
  item: {
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 48,
    height: 48,
  },
});
