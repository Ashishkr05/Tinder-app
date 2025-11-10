// mobile/src/screens/SwipeScreen.tsx
import React, { useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Pressable,
  Animated,
  Easing,
  Vibration,
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import SwipeCard from '../components/SwipeCard';
import { useDislike, useLike, usePeople, Person } from '../api/hooks';

const PER_PAGE = 10;
type FeedbackKind = 'like' | 'nope' | 'reset';

export default function SwipeScreen() {
  const [page, setPage] = useState(1);
  const [index, setIndex] = useState(0);

  const { data: people, isLoading, isError, refetch, isFetching } = usePeople(page, PER_PAGE);
  const like = useLike();       // expects a Person (optimistic add to "liked")
  const dislike = useDislike(); // expects a personId

  const deck = useMemo(() => people ?? [], [people]);
  const current: Person | undefined = deck[index];
  const next: Person | undefined = deck[index + 1];

  // Feedback banner animation
  const bannerOpacity = useRef(new Animated.Value(0)).current;
  const bannerY = useRef(new Animated.Value(-16)).current;
  const [banner, setBanner] = useState<{ text: string; color: string }>({ text: '', color: '#111' });

  const showBanner = (kind: FeedbackKind) => {
    const map = {
      like:  { text: 'Liked',       color: '#12B886' },
      nope:  { text: 'Nope',        color: '#F03E3E' },
      reset: { text: 'Deck reset',  color: '#3B5BDB' },
    } as const;
    setBanner(map[kind]);
    bannerOpacity.setValue(0);
    bannerY.setValue(-16);
    Animated.parallel([
      Animated.timing(bannerOpacity, { toValue: 1, duration: 160, useNativeDriver: true }),
      Animated.timing(bannerY, {
        toValue: 0,
        duration: 200,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start(() => {
      Animated.timing(bannerOpacity, {
        toValue: 0,
        delay: 700,
        duration: 220,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: true,
      }).start();
    });
  };

  const advance = () => {
    const nextIndex = index + 1;
    if (nextIndex < deck.length) {
      setIndex(nextIndex);
      // light prefetch when nearing end
      if (nextIndex >= deck.length - 2) setPage((p) => p + 1);
    } else {
      setPage((p) => p + 1);
      setIndex(0);
    }
  };

  const onLike = async () => {
    if (!current) return;
    try {
      Vibration.vibrate?.(15);
      await like.mutateAsync(current);      // pass the whole person (optimistic liked list)
      showBanner('like');
    } finally {
      advance();
    }
  };

  const onNope = async () => {
    if (!current) return;
    try {
      Vibration.vibrate?.(10);
      await dislike.mutateAsync(current.id); // dislike still uses id
      showBanner('nope');
    } finally {
      advance();
    }
  };

  const onReset = () => {
    Vibration.vibrate?.(8);
    setIndex(0);
    refetch();
    showBanner('reset');
  };

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={styles.muted}>Loading people…</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>Failed to load. Pull to refresh or try again.</Text>
        <Pressable onPress={() => refetch()} style={[styles.cta, styles.ctaDark]}>
          <Text style={styles.ctaText}>Retry</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Floating feedback banner */}
      <Animated.View
        pointerEvents="none"
        style={[
          styles.banner,
          { opacity: bannerOpacity, transform: [{ translateY: bannerY }], backgroundColor: banner.color },
        ]}
      >
        <Text style={styles.bannerText}>{banner.text}</Text>
      </Animated.View>

      {/* Card Stack */}
      <View style={styles.deck}>
        {next ? <SwipeCard person={next} position="back" /> : null}

        {current ? (
          <SwipeCard
            person={current}
            position="front"
            // IMPORTANT: match the prop names your SwipeCard actually calls
            onSwipeRight={onLike}
            onSwipeLeft={onNope}
          />
        ) : (
          <View style={styles.center}>
            <Text style={styles.muted}>
              {isFetching ? 'Loading…' : 'No more profiles on this page.'}
            </Text>
            <Pressable
              onPress={() => {
                setPage((p) => p + 1);
                setIndex(0);
              }}
              style={[styles.cta, styles.ctaDark, { marginTop: 12 }]}
            >
              <Text style={styles.ctaText}>Load More</Text>
            </Pressable>
          </View>
        )}
      </View>

      {/* Bottom Action Bar */}
      <View style={styles.actions}>
        <ActionIconBtn
          label="Nope"
          icon={<Feather name="x" size={28} />}
          tint="#F03E3E"
          disabled={!current}
          onPress={onNope}
        />

        <ActionIconBtn
          label="Reset"
          icon={<Ionicons name="refresh" size={26} />}
          tint="#3B5BDB"
          onPress={onReset}
        />

        <ActionIconBtn
          label="Like"
          icon={<Feather name="check" size={28} />}
          tint="#12B886"
          disabled={!current}
          onPress={onLike}
        />
      </View>
    </View>
  );
}

/** Reusable animated round button with press scale + colored pulse ring */
function ActionIconBtn({
  icon,
  label,
  tint,
  disabled,
  onPress,
}: {
  icon: React.ReactNode;
  label: string;
  tint: string;
  disabled?: boolean;
  onPress: () => void;
}) {
  const scale = useRef(new Animated.Value(1)).current;
  const ring = useRef(new Animated.Value(0)).current;

  const pressIn = () =>
    Animated.spring(scale, { toValue: 0.94, useNativeDriver: true, friction: 6 }).start();
  const pressOut = () =>
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, friction: 6 }).start();

  const triggerRing = () => {
    ring.setValue(0);
    Animated.timing(ring, {
      toValue: 1,
      duration: 420,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  };

  const onPressWrapped = () => {
    triggerRing();
    onPress();
  };

  const ringScale = ring.interpolate({ inputRange: [0, 1], outputRange: [1, 1.35] });
  const ringOpacity = ring.interpolate({ inputRange: [0, 0.6, 1], outputRange: [0.25, 0.12, 0] });

  return (
    <View style={styles.actBtnWrap}>
      <Animated.View
        style={[
          styles.ring,
          { backgroundColor: tint, transform: [{ scale: ringScale }], opacity: ringOpacity },
        ]}
      />
      <Animated.View style={[styles.actBtn, { transform: [{ scale }] }]}>
        <Pressable
          accessibilityLabel={label}
          onPress={onPressWrapped}
          onPressIn={pressIn}
          onPressOut={pressOut}
          disabled={disabled}
          style={[styles.innerBtn, { borderColor: tint, opacity: disabled ? 0.5 : 1 }]}
        >
          <View style={{ tintColor: tint }}>
            <Text style={{ color: tint }}>{icon as any}</Text>
          </View>
        </Pressable>
      </Animated.View>
    </View>
  );
}

const R = 56;

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 16, paddingTop: 8, paddingBottom: 18 },
  deck: { flex: 1, justifyContent: 'center' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 },
  muted: { color: '#666', marginTop: 8 },
  error: { color: '#c1121f', fontWeight: '600', marginBottom: 10 },

  banner: {
    position: 'absolute',
    top: 10,
    alignSelf: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    zIndex: 50,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  bannerText: { color: '#fff', fontWeight: '700', letterSpacing: 0.3 },

  actions: {
    flexDirection: 'row',
    gap: 22,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 6,
  },

  actBtnWrap: {
    width: R * 1.6,
    height: R * 1.6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: {
    position: 'absolute',
    width: R,
    height: R,
    borderRadius: R / 2,
  },

  actBtn: {
    width: R,
    height: R,
    borderRadius: R / 2,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
    backgroundColor: '#fff',
  },
  innerBtn: {
    flex: 1,
    borderRadius: R / 2,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },

  cta: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e6e6e6',
    backgroundColor: '#fff',
  },
  ctaDark: { backgroundColor: '#111', borderColor: '#111' },
  ctaText: { color: '#fff', fontWeight: '600' },
});
