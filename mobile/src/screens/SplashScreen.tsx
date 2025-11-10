import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { useAuth } from '../state/auth';

export default function SplashScreen({ navigation }: any) {
  const { token } = useAuth();
  useEffect(() => {
    const id = setTimeout(() => {
      token ? navigation.replace('Tabs') : navigation.replace('Login');
    }, 600);
    return () => clearTimeout(id);
  }, [token]);
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: 28, fontWeight: '900' }}>tinder</Text>
    </View>
  );
}
