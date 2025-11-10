import 'react-native-gesture-handler';
import 'react-native-reanimated';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Navigation from './src/navigation';
import { AuthProvider } from './src/state/auth';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { refetchOnWindowFocus: false, retry: 1, staleTime: 60_000 },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Navigation />
      </AuthProvider>
    </QueryClientProvider>
  );
}
