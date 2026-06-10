import React from 'react';
import { Redirect } from 'expo-router';
import { useApp } from '@/context/AppContext';

// Entry point: send first-time users through onboarding, returning users home.
// Crisis routing never depends on this gate (reachable from any header).
export default function Index() {
  const { onboarded } = useApp();
  return <Redirect href={onboarded ? '/(tabs)' : '/onboarding/welcome'} />;
}
