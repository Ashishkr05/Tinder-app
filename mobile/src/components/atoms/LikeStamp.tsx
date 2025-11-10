import React from 'react';
import { View, Text } from 'react-native';

export default function LikeStamp({ type }: { type: 'like' | 'nope' }) {
  const like = type === 'like';
  return (
    <View
      style={{
        position: 'absolute',
        top: 24,
        left: like ? 24 : undefined,
        right: like ? undefined : 24,
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderWidth: 4,
        borderRadius: 8,
        borderColor: like ? '#22c55e' : '#ef4444',
        transform: [{ rotate: like ? '-18deg' : '18deg' }],
        backgroundColor: 'rgba(255,255,255,0.9)',
      }}
    >
      <Text style={{ fontSize: 28, fontWeight: '900', letterSpacing: 2, color: like ? '#16a34a' : '#dc2626' }}>
        {like ? 'LIKE' : 'NOPE'}
      </Text>
    </View>
  );
}
