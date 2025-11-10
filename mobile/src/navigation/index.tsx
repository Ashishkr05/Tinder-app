// src/navigation/index.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import SwipeScreen from '../screens/SwipeScreen';
import LikedScreen from '../screens/LikedScreen';
import LoginScreen from '../screens/LoginScreen';
import { useAuth } from '../state/auth';

const Tab = createBottomTabNavigator();

export default function Navigation() {
  const { token } = useAuth();

  if (!token) return <LoginScreen />;

  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={{ headerShown: false }}>
        <Tab.Screen name="Swipe" component={SwipeScreen} />
        <Tab.Screen name="Liked" component={LikedScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
