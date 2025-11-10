import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from './client';

export type Person = {
  id: number;
  name: string;
  age: number;
  location: string;
  pictures: string[];
  like_count: number;
};

export function useLogin() {
  return useMutation({
    mutationFn: async (body: { email: string; password: string }) => {
      const { data } = await api.post('/login', body);
      return data as { token: string; user?: any };
    },
  });
}

export function usePeople(page: number, perPage = 10) {
  return useQuery({
    queryKey: ['people', page, perPage],
    queryFn: async () => {
      const { data } = await api.get(`/people?page=${page}&per_page=${perPage}`);
      return (data?.data ?? data) as Person[];
    },
    staleTime: 60_000,
  });
}

/** Optimistic like with rollback + gentle re-sync */
export function useLike() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (person: Person) => {
      await api.post(`/people/${person.id}/like`);
      return { ok: true, person };
    },

    onMutate: async (person: Person) => {
      await qc.cancelQueries({ queryKey: ['liked'] });

      const prevLiked = qc.getQueryData<Person[]>(['liked']) ?? [];
      const exists = prevLiked.some(p => p.id === person.id);
      if (!exists) qc.setQueryData<Person[]>(['liked'], [person, ...prevLiked]);

      // bump like_count in people pages
      const queries = qc.getQueryCache().findAll({ queryKey: ['people'] });
      for (const q of queries) {
        const curr = qc.getQueryData<Person[]>(q.queryKey as any);
        if (!curr) continue;
        qc.setQueryData<Person[]>(
          q.queryKey as any,
          curr.map(p => (p.id === person.id ? { ...p, like_count: (p.like_count ?? 0) + 1 } : p))
        );
      }

      return { prevLiked };
    },

    onError: (_err, _person, ctx) => {
      if (ctx?.prevLiked) {
        qc.setQueryData<Person[]>(['liked'], ctx.prevLiked);
      }
    },

    onSuccess: () => {
      // small delay reduces race with token propagation
      setTimeout(() => {
        qc.invalidateQueries({ queryKey: ['liked'] });
        qc.invalidateQueries({ queryKey: ['people'] });
      }, 150);
    },
  });
}

export function useDislike() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (personId: number) => {
      const { data } = await api.post(`/people/${personId}/dislike`);
      return data;
    },
    onSuccess: (_data, personId) => {
      const prev = qc.getQueryData<Person[]>(['liked']) ?? [];
      qc.setQueryData<Person[]>(['liked'], prev.filter(p => p.id !== personId));
      qc.invalidateQueries({ queryKey: ['people'] });
    },
  });
}

/** Liked list with guarded fetch + no flashing */
export function useLikedList(enabled: boolean) {
  return useQuery({
    queryKey: ['liked'],
    queryFn: async () => {
      const { data } = await api.get('/me/likes');
      return (data?.data ?? data) as Person[];
    },
    enabled,                 // only fetch when we actually have a token
    keepPreviousData: true,  // avoid blink
    staleTime: 0,
    retry: (failCount, error: any) => {
      // Don’t spam-retry 401 without token
      if (error?.response?.status === 401) return false;
      return failCount < 2;
    },
  });
}
