// ==========================================
// Login Screen
// ==========================================
// This is where users log into the app.
// It calls the backend login API, and on success,
// saves the user + token to Zustand (useAuthStore).

import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { loginUser } from '../services/authService';
import { useAuthStore } from '../store/useAuthStore';

export default function LoginScreen() {
  const router = useRouter();
  const { setCredentials } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Missing Fields', 'Please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      const result = await loginUser(email.trim().toLowerCase(), password);
      // Save user and token to our global store
      setCredentials(result.user, result.token);
      // Go back to the main app
      router.replace('/(tabs)');
    } catch (error: any) {
      const message =
        error.response?.data?.message || 'Login failed. Please try again.';
      Alert.alert('Login Error', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark">
      <SafeAreaView className="flex-1">
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1"
        >
          <ScrollView
            contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
            className="px-6"
            keyboardShouldPersistTaps="handled"
          >
            {/* Header */}
            <View className="items-center mb-10">
              <Text className="text-primary text-xs font-bold tracking-[0.3em] uppercase mb-2">
                Welcome Back
              </Text>
              <Text className="text-3xl font-bold text-slate-900 dark:text-white">
                ELITE ATTIRE
              </Text>
              <Text className="text-slate-500 mt-2 text-center">
                Sign in to access your account
              </Text>
            </View>

            {/* Email Field */}
            <View className="mb-4">
              <Text className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-2">
                Email
              </Text>
              <View className="flex-row items-center bg-primary/5 border border-primary/20 rounded-xl px-4 h-14">
                <MaterialIcons name="email" size={20} color="#ac7e0c" />
                <TextInput
                  className="flex-1 ml-3 text-slate-900 dark:text-white text-base"
                  placeholder="your@email.com"
                  placeholderTextColor="#94a3b8"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </View>

            {/* Password Field */}
            <View className="mb-6">
              <Text className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-2">
                Password
              </Text>
              <View className="flex-row items-center bg-primary/5 border border-primary/20 rounded-xl px-4 h-14">
                <MaterialIcons name="lock" size={20} color="#ac7e0c" />
                <TextInput
                  className="flex-1 ml-3 text-slate-900 dark:text-white text-base"
                  placeholder="Enter password"
                  placeholderTextColor="#94a3b8"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <MaterialIcons
                    name={showPassword ? 'visibility' : 'visibility-off'}
                    size={20}
                    color="#94a3b8"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Login Button */}
            <TouchableOpacity
              className="bg-primary py-4 rounded-xl items-center justify-center flex-row gap-2 shadow-lg shadow-primary/20"
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <>
                  <Text className="text-white font-bold text-sm uppercase tracking-widest">
                    Sign In
                  </Text>
                  <MaterialIcons name="arrow-forward" size={16} color="white" />
                </>
              )}
            </TouchableOpacity>

            {/* Register Link */}
            <TouchableOpacity
              className="mt-6 items-center"
              onPress={() => router.push('/register')}
            >
              <Text className="text-slate-500">
                Don't have an account?{' '}
                <Text className="text-primary font-bold">Create One</Text>
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
