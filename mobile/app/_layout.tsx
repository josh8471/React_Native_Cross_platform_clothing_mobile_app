import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import { Manrope_300Light, Manrope_400Regular, Manrope_500Medium, Manrope_600SemiBold, Manrope_700Bold, Manrope_800ExtraBold } from '@expo-google-fonts/manrope';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import '../global.css';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { loadStoredAuth } = useAuthStore();

  const [loaded, error] = useFonts({
    Manrope_300Light,
    Manrope_400Regular,
    Manrope_500Medium,
    Manrope_600SemiBold,
    Manrope_700Bold,
    Manrope_800ExtraBold
  });

  useEffect(() => {
    // Load saved login session from phone storage
    loadStoredAuth();
  }, []);

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="product/[id]" options={{ headerShown: false, presentation: 'modal' }} />
      <Stack.Screen name="login" options={{ headerShown: false, presentation: 'modal' }} />
      <Stack.Screen name="register" options={{ headerShown: false, presentation: 'modal' }} />
      <Stack.Screen name="checkout" options={{ headerShown: false }} />
      <Stack.Screen name="orders" options={{ headerShown: false }} />
      <Stack.Screen name="admin/index" options={{ headerShown: false }} />
      <Stack.Screen name="admin/add-product" options={{ headerShown: false }} />
      <Stack.Screen name="admin/products" options={{ headerShown: false }} />
      <Stack.Screen name="admin/orders" options={{ headerShown: false }} />
    </Stack>
  );
}
