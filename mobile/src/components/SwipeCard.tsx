import React, { useRef } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  PanResponder,
  StyleSheet,
  Text,
  View,
  Platform,
} from 'react-native';
import type { Person } from '../api/hooks';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const SWIPE_THRESHOLD = 0.25 * SCREEN_WIDTH; // how far to swipe before triggering

type Props = {
  person: Person;
  position: 'front' | 'back';
  onSwipeRight?: () => void;
  onSwipeLeft?: () => void;
};

export default function SwipeCard({ person, position, onSwipeRight, onSwipeLeft }: Props) {
  const pan = useRef(new Animated.ValueXY()).current;

  const rotate = pan.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    outputRange: ['-10deg', '0deg', '10deg'],
    extrapolate: 'clamp',
  });

  const likeOpacity = pan.x.interpolate({
    inputRange: [0, SWIPE_THRESHOLD],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const nopeOpacity = pan.x.interpolate({
    inputRange: [-SWIPE_THRESHOLD, 0],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  // gesture handling
  const panResponder =
    position === 'front'
      ? PanResponder.create({
          onStartShouldSetPanResponder: () => true,
          onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
            useNativeDriver: false,
          }),
          onPanResponderRelease: (_, { dx, vx }) => {
            if (dx > SWIPE_THRESHOLD || vx > 1.5) {
              // swipe right
              Animated.timing(pan, {
                toValue: { x: SCREEN_WIDTH + 100, y: pan.y.__getValue() },
                duration: 200,
                useNativeDriver: true,
              }).start(() => {
                onSwipeRight?.();
                pan.setValue({ x: 0, y: 0 });
              });
            } else if (dx < -SWIPE_THRESHOLD || vx < -1.5) {
              // swipe left
              Animated.timing(pan, {
                toValue: { x: -SCREEN_WIDTH - 100, y: pan.y.__getValue() },
                duration: 200,
                useNativeDriver: true,
              }).start(() => {
                onSwipeLeft?.();
                pan.setValue({ x: 0, y: 0 });
              });
            } else {
              // not enough movement → snap back
              Animated.spring(pan, {
                toValue: { x: 0, y: 0 },
                friction: 6,
                tension: 60,
                useNativeDriver: true,
              }).start();
            }
          },
        })
      : undefined;

  const cardStyle =
    position === 'back'
      ? [styles.card, { transform: [{ scale: 0.96 }], opacity: 0.9 }]
      : [
          styles.card,
          {
            transform: [{ translateX: pan.x }, { translateY: pan.y }, { rotate }],
          },
        ];

  return (
    <Animated.View
      {...(panResponder ? panResponder.panHandlers : {})}
      style={[cardStyle, styles.shadow]}
    >
      {/* Badges */}
      {position === 'front' && (
        <>
          <Animated.View style={[styles.badge, styles.like, { opacity: likeOpacity }]}>
            <Text style={styles.badgeText}>LIKE</Text>
          </Animated.View>
          <Animated.View style={[styles.badge, styles.nope, { opacity: nopeOpacity }]}>
            <Text style={styles.badgeText}>NOPE</Text>
          </Animated.View>
        </>
      )}

      {/* Profile photo */}
      <Image
        source={{ uri: person.pictures?.[0] }}
        style={styles.photo}
        resizeMode="cover"
      />

      {/* Info */}
      <View style={styles.meta}>
        <Text style={styles.name}>
          {person.name}, {person.age}
        </Text>
        <Text style={styles.loc}>{person.location}</Text>
      </View>
    </Animated.View>
  );
}

const CARD_W = SCREEN_WIDTH - 32;
const CARD_H = Math.min(SCREEN_HEIGHT * 0.72, 560);

const styles = StyleSheet.create({
  card: {
    position: 'absolute',
    width: CARD_W,
    height: CARD_H,
    alignSelf: 'center',
    borderRadius: 18,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  shadow: {
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 6 },
    elevation: 5,
  },
  photo: {
    width: '100%',
    height: '85%',
    backgroundColor: '#eee',
  },
  meta: {
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
  },
  loc: {
    color: '#666',
    marginTop: 2,
  },
  badge: {
    position: 'absolute',
    top: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 3,
    borderRadius: 8,
    zIndex: 5,
  },
  like: {
    left: 20,
    borderColor: '#12B886',
    transform: [{ rotate: '-15deg' }],
  },
  nope: {
    right: 20,
    borderColor: '#F03E3E',
    transform: [{ rotate: '15deg' }],
  },
  badgeText: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 2,
    color: Platform.select({ web: '#111', default: '#111' }),
  },
});
