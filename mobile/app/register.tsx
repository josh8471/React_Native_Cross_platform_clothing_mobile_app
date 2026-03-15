// ==========================================
// Register Screen
// ==========================================
// New users create an account here.
// On success, they are automatically logged in.

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
import { registerUser } from '../services/authService';
import { useAuthStore } from '../store/useAuthStore';

export default function RegisterScreen() {
  const router = useRouter();
  const { setCredentials } = useAuthStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert('Missing Fields', 'Please fill in all fields.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Password Mismatch', 'Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Weak Password', 'Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      const result = await registerUser(name, email.trim().toLowerCase(), password);
      setCredentials(result.user, result.token);
      router.replace('/(tabs)');
    } catch (error: any) {
      const message =
        error.response?.data?.message || 'Registration failed. Please try again.';
      Alert.alert('Registration Error', message);
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
            {/* Back Button */}
            <TouchableOpacity
              className="mb-6"
              onPress={() => router.back()}
            >
              <MaterialIcons name="arrow-back" size={24} color="#ac7e0c" />
            </TouchableOpacity>

            {/* Header */}
            <View className="items-center mb-8">
              <Text className="text-primary text-xs font-bold tracking-[0.3em] uppercase mb-2">
                Join Us
              </Text>
              <Text className="text-3xl font-bold text-slate-900 dark:text-white">
                Create Account
              </Text>
            </View>

            {/* Name Field */}
            <View className="mb-4">
              <Text className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-2">
                Full Name
              </Text>
              <View className="flex-row items-center bg-primary/5 border border-primary/20 rounded-xl px-4 h-14">
                <MaterialIcons name="person" size={20} color="#ac7e0c" />
                <TextInput
                  className="flex-1 ml-3 text-slate-900 dark:text-white text-base"
                  placeholder="John Doe"
                  placeholderTextColor="#94a3b8"
                  value={name}
                  onChangeText={setName}
                />
              </View>
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
                />
              </View>
            </View>

            {/* Password Field */}
            <View className="mb-4">
              <Text className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-2">
                Password
              </Text>
              <View className="flex-row items-center bg-primary/5 border border-primary/20 rounded-xl px-4 h-14">
                <MaterialIcons name="lock" size={20} color="#ac7e0c" />
                <TextInput
                  className="flex-1 ml-3 text-slate-900 dark:text-white text-base"
                  placeholder="Min 6 characters"
                  placeholderTextColor="#94a3b8"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
              </View>
            </View>

            {/* Confirm Password */}
            <View className="mb-6">
              <Text className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-2">
                Confirm Password
              </Text>
              <View className="flex-row items-center bg-primary/5 border border-primary/20 rounded-xl px-4 h-14">
                <MaterialIcons name="lock" size={20} color="#ac7e0c" />
                <TextInput
                  className="flex-1 ml-3 text-slate-900 dark:text-white text-base"
                  placeholder="Re-enter password"
                  placeholderTextColor="#94a3b8"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                />
              </View>
            </View>

            {/* Register Button */}
            <TouchableOpacity
              className="bg-primary py-4 rounded-xl items-center justify-center flex-row gap-2 shadow-lg shadow-primary/20"
              onPress={handleRegister}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white font-bold text-sm uppercase tracking-widest">
                  Create Account
                </Text>
              )}
            </TouchableOpacity>

            {/* Login Link */}
            <TouchableOpacity
              className="mt-6 items-center"
              onPress={() => router.back()}
            >
              <Text className="text-slate-500">
                Already have an account?{' '}
                <Text className="text-primary font-bold">Sign In</Text>
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
