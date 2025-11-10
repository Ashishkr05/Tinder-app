import React from 'react';
import { Image, View, Text, StyleSheet } from 'react-native';
import type { Person } from '../../api/hooks';

type Props = {
  person: Person;
  likeOpacity?: number;   // 0..1 (driven by drag)
  nopeOpacity?: number;   // 0..1
};

export default function Card({ person, likeOpacity = 0, nopeOpacity = 0 }: Props) {
  const photo = person.pictures?.[0];

  return (
    <View style={styles.card}>
      {!!photo && <Image source={{ uri: photo }} style={styles.photo} resizeMode="cover" />}

      {/* LIKE banner (top-left) */}
      <View style={[styles.banner, styles.likeBanner, { opacity: likeOpacity }]}>
        <Text style={styles.likeText}>LIKE</Text>
      </View>

      {/* NOPE banner (top-right) */}
      <View style={[styles.banner, styles.nopeBanner, { opacity: nopeOpacity }]}>
        <Text style={styles.nopeText}>NOPE</Text>
      </View>

      {/* Info footer */}
      <View style={styles.footer}>
        <Text style={styles.name}>
          {person.name} <Text style={styles.age}>{person.age}</Text>
        </Text>
        <Text style={styles.meta}>{person.location}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: '#000',
    flex: 1,
  },
  photo: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  footer: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 16,
    paddingTop: 12,
    gap: 6,
  },
  name: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '800',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowRadius: 8,
  },
  age: {
    color: '#fff',
    fontWeight: '600',
  },
  meta: {
    color: '#eee',
    fontSize: 14,
  },
  banner: {
    position: 'absolute',
    top: 24,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 4,
    borderRadius: 6,
    transform: [{ rotate: '-12deg' }],
  },
  likeBanner: {
    left: 16,
    borderColor: '#2ecc71',
    backgroundColor: 'rgba(46, 204, 113, 0.15)',
  },
  nopeBanner: {
    right: 16,
    borderColor: '#e74c3c',
    backgroundColor: 'rgba(231, 76, 60, 0.15)',
    transform: [{ rotate: '12deg' }],
  },
  likeText: {
    color: '#2ecc71',
    fontWeight: '900',
    letterSpacing: 2,
    fontSize: 22,
  },
  nopeText: {
    color: '#e74c3c',
    fontWeight: '900',
    letterSpacing: 2,
    fontSize: 22,
  },
});
