import React, { useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet, RefreshControl } from 'react-native';
import { useQueryClient } from '@tanstack/react-query';
import { useLikedList } from '../api/hooks';
import { useAuth } from '../state/auth';

export default function LikedScreen() {
  const { token } = useAuth();
  const qc = useQueryClient();

  // When token changes (login), force a refresh of liked list
  useEffect(() => {
    if (token) qc.invalidateQueries({ queryKey: ['liked'] });
  }, [token, qc]);

  const { data, isLoading, isFetching, refetch } = useLikedList(!!token);
  const liked = data ?? [];

  if (!token) {
    return (
      <View style={styles.center}>
        <Text style={styles.muted}>Sign in to see your liked profiles.</Text>
      </View>
    );
  }

  if (isLoading && liked.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.muted}>Loading your likes…</Text>
      </View>
    );
  }

  return (
    <FlatList
      contentContainerStyle={liked.length ? styles.list : styles.center}
      data={liked}
      keyExtractor={(item) => String(item.id)}
      refreshControl={
        <RefreshControl refreshing={isFetching} onRefresh={() => refetch()} />
      }
      ListEmptyComponent={
        <Text style={styles.muted}>No liked profiles yet. Start swiping!</Text>
      }
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Image source={{ uri: item.pictures?.[0] }} style={styles.photo} />
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{item.name}, {item.age}</Text>
            <Text style={styles.loc}>{item.location}</Text>
          </View>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 },
  muted: { color: '#666' },
  list: { padding: 12, gap: 12 },
  card: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  photo: { width: 72, height: 72, borderRadius: 8, backgroundColor: '#eee' },
  name: { fontWeight: '700', fontSize: 16 },
  loc: { color: '#666', marginTop: 2 },
});
