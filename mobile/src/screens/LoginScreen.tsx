import React, { useState } from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import { api } from '../api/client';
import { useAuth } from '../state/auth';

export default function LoginScreen({ navigation }: any) {
  const { setToken } = useAuth();
  const [email, setEmail] = useState('demo@user.test');
  const [password, setPassword] = useState('password');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    setError(null);
    setLoading(true);
    try {
      const payload = { email: email.trim().toLowerCase(), password: password.trim() };
      const { data } = await api.post('/login', payload);
      if (!data?.token) throw new Error('No token in response');
      setToken(data.token);          // <- this alone will switch to AppTabs
      // DO NOT: navigation.replace('Main')
    } catch (e: any) {
    const info = {
      message: e?.message,
      isAxios: !!e?.isAxiosError,
      status: e?.response?.status,
      data: e?.response?.data,
      requestURL: e?.config ? (e.config.baseURL || '') + (e.config.url || '') : undefined,
      code: e?.code, // ERR_NETWORK etc.
    };
    console.log('LOGIN error ->', info);
    setError('Login failed');
}
 finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, padding: 24, justifyContent: 'center', gap: 12 }}>
      <Text style={{ fontSize: 28, fontWeight: '700' }}>Welcome</Text>

      <TextInput
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="email-address"
        placeholder="Email"
        style={{ borderWidth: 1, padding: 10, borderRadius: 8 }}
      />

      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry
        style={{ borderWidth: 1, padding: 10, borderRadius: 8 }}
      />

      <Pressable
        onPress={onSubmit}
        disabled={loading}
        style={{
          backgroundColor: loading ? '#bbb' : '#111',
          padding: 12,
          borderRadius: 8,
          alignItems: 'center',
        }}
      >
        <Text style={{ color: 'white', fontWeight: '600' }}>
          {loading ? 'Signing in…' : 'SIGN IN'}
        </Text>
      </Pressable>

      {error ? <Text style={{ color: 'crimson' }}>{error}</Text> : null}
    </View>
  );
}
