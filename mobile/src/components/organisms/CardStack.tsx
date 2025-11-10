import React, { forwardRef, useImperativeHandle, useMemo, useRef, useState } from 'react';
import {
  Animated,
  PanResponder,
  View,
  StyleSheet,
  Dimensions,
  Platform,
} from 'react-native';
import Card from '../molecules/Card';
import type { Person } from '../../api/hooks';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');
const SWIPE_THRESHOLD = SCREEN_W * 0.25; // how far before it counts as swipe
const OFFSCREEN = SCREEN_W * 1.25;

export type CardStackHandle = {
  swipeLeft: () => void;
  swipeRight: () => void;
  reset: () => void;
};

type Props = {
  data: Person[];
  onLike: (p: Person) => Promise<void> | void;
  onNope: (p: Person) => Promise<void> | void;
  onReset?: () => void; // called after reset
};

const CardStack = forwardRef<CardStackHandle, Props>(function CardStack(
  { data, onLike, onNope, onReset },
  ref
) {
  const [index, setIndex] = useState(0);
  const position = useRef(new Animated.ValueXY()).current;
  const [animating, setAnimating] = useState(false);

  const current = data[index];

  const rotate = position.x.interpolate({
    inputRange: [-SCREEN_W, 0, SCREEN_W],
    outputRange: ['-15deg', '0deg', '15deg'],
    extrapolate: 'clamp',
  });

  const likeOpacity = position.x.interpolate({
    inputRange: [0, SWIPE_THRESHOLD],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });
  const nopeOpacity = position.x.interpolate({
    inputRange: [-SWIPE_THRESHOLD, 0],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const nextScale = position.x.interpolate({
    inputRange: [-SCREEN_W, 0, SCREEN_W],
    outputRange: [0.95, 0.98, 0.95],
    extrapolate: 'clamp',
  });

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > 6 || Math.abs(g.dy) > 6,
        onPanResponderMove: Animated.event([null, { dx: position.x, dy: position.y }], {
          useNativeDriver: false,
        }),
        onPanResponderRelease: (_, g) => {
          if (animating) return;

          if (g.dx > SWIPE_THRESHOLD) {
            // like
            setAnimating(true);
            Animated.spring(position, {
              toValue: { x: OFFSCREEN, y: g.dy },
              useNativeDriver: Platform.OS !== 'web',
            }).start(async () => {
              await safeCall(onLike, current);
              advance();
            });
          } else if (g.dx < -SWIPE_THRESHOLD) {
            // nope
            setAnimating(true);
            Animated.spring(position, {
              toValue: { x: -OFFSCREEN, y: g.dy },
              useNativeDriver: Platform.OS !== 'web',
            }).start(async () => {
              await safeCall(onNope, current);
              advance();
            });
          } else {
            Animated.spring(position, {
              toValue: { x: 0, y: 0 },
              friction: 6,
              useNativeDriver: Platform.OS !== 'web',
            }).start();
          }
        },
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [index, current, animating]
  );

  function advance() {
    position.setValue({ x: 0, y: 0 });
    setIndex((i) => Math.min(i + 1, data.length));
    setAnimating(false);
  }

  function programmaticSwipe(dir: 'left' | 'right') {
    if (!current || animating) return;
    setAnimating(true);
    Animated.timing(position, {
      toValue: { x: dir === 'right' ? OFFSCREEN : -OFFSCREEN, y: 0 },
      duration: 220,
      useNativeDriver: Platform.OS !== 'web',
    }).start(async () => {
      await safeCall(dir === 'right' ? onLike : onNope, current);
      advance();
    });
  }

  function reset() {
    setIndex(0);
    position.setValue({ x: 0, y: 0 });
    setAnimating(false);
    onReset?.();
  }

  useImperativeHandle(ref, () => ({
    swipeLeft: () => programmaticSwipe('left'),
    swipeRight: () => programmaticSwipe('right'),
    reset,
  }));

  // Render top 2 cards for smoothness
  const top = current;
  const second = data[index + 1];

  return (
    <View style={styles.wrap}>
      {/* second (under) */}
      {second ? (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.card,
            { transform: [{ scale: nextScale }] },
          ]}
        >
          <Card person={second} />
        </Animated.View>
      ) : null}

      {/* top (draggable) */}
      {top ? (
        <Animated.View
          {...panResponder.panHandlers}
          style={[
            styles.card,
            {
              transform: [{ translateX: position.x }, { translateY: position.y }, { rotate }],
            },
          ]}
        >
          <Card person={top} likeOpacity={likeOpacity as any} nopeOpacity={nopeOpacity as any} />
        </Animated.View>
      ) : null}
    </View>
  );
});

export default CardStack;

async function safeCall(fn?: (p: Person) => any, p?: Person) {
  try {
    if (fn && p) await fn(p);
  } catch (e) {
    console.warn('Swipe side-effect failed:', e);
  }
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    position: 'relative',
  },
  card: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
});
