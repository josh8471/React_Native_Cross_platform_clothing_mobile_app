// ==========================================
// Profile Screen (Connected to Auth)
// ==========================================
// Shows login button if not signed in.
// Shows user info + logout if signed in.

import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../store/useAuthStore';

export default function Profile() {
  const router = useRouter();
  const { user, token, logout } = useAuthStore();
  const isLoggedIn = !!token;

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: () => logout(),
        },
      ]
    );
  };

  // ── Not Logged In ──────────────────────────
  if (!isLoggedIn) {
    return (
      <View className="flex-1 bg-background-light dark:bg-background-dark">
        <SafeAreaView className="flex-1 items-center justify-center px-6">
          <View className="items-center">
            <View className="w-24 h-24 rounded-full bg-primary/10 items-center justify-center mb-6">
              <MaterialIcons name="person-outline" size={48} color="#ac7e0c" />
            </View>
            <Text className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              Welcome to Elite Attire
            </Text>
            <Text className="text-slate-500 text-center max-w-xs mb-8">
              Sign in to view orders, saved items, and personalized recommendations.
            </Text>
            <TouchableOpacity
              className="w-full bg-primary py-4 rounded-xl items-center mb-4"
              onPress={() => router.push('/login')}
            >
              <Text className="text-white font-bold text-sm uppercase tracking-widest">
                Sign In
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="w-full border border-primary py-4 rounded-xl items-center"
              onPress={() => router.push('/register')}
            >
              <Text className="text-primary font-bold text-sm uppercase tracking-widest">
                Create Account
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  // ── Logged In ──────────────────────────────
  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark">
      <SafeAreaView edges={['top']} className="flex-1">
        {/* Header */}
        <View className="p-4 border-b border-primary/10">
          <Text className="text-xl font-bold text-center text-slate-900 dark:text-white uppercase tracking-widest">
            My Account
          </Text>
        </View>

        <ScrollView className="flex-1 px-4 py-6">
          {/* User Info Card */}
          <View className="bg-primary/5 border border-primary/10 rounded-2xl p-6 mb-6">
            <View className="flex-row items-center">
              <View className="w-16 h-16 rounded-full bg-primary items-center justify-center">
                <Text className="text-white text-2xl font-bold">
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </Text>
              </View>
              <View className="ml-4 flex-1">
                <Text className="text-xl font-bold text-slate-900 dark:text-white">
                  {user?.name}
                </Text>
                <Text className="text-slate-500 text-sm mt-1">{user?.email}</Text>
                {user?.role === 'admin' && (
                  <View className="bg-primary self-start px-3 py-1 rounded-full mt-2">
                    <Text className="text-white text-xs font-bold">ADMIN</Text>
                  </View>
                )}
              </View>
            </View>
          </View>

          {/* Admin Dashboard Access (Conditional) */}
          {user?.role === 'admin' && (
            <TouchableOpacity
              className="bg-primary/20 border border-primary/30 rounded-2xl p-4 mb-6 flex-row items-center"
              onPress={() => router.push('/admin')}
            >
              <View className="w-12 h-12 rounded-xl bg-primary items-center justify-center">
                <MaterialIcons name="admin-panel-settings" size={24} color="white" />
              </View>
              <View className="ml-4 flex-1">
                <Text className="text-lg font-bold text-slate-900 dark:text-white">
                  Admin Dashboard
                </Text>
                <Text className="text-xs text-slate-500 mt-1">
                  Manage products, orders, and more
                </Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color="#ac7e0c" />
            </TouchableOpacity>
          )}

          {/* Menu Items */}
          {[
            { icon: 'shopping-bag' as const, label: 'My Orders', subtitle: 'Track and view order history', route: '/orders' },
            { icon: 'favorite' as const, label: 'Wishlist', subtitle: 'Items you love', route: null },
            { icon: 'location-on' as const, label: 'Addresses', subtitle: 'Manage delivery addresses', route: null },
            { icon: 'credit-card' as const, label: 'Payment Methods', subtitle: 'Saved cards and wallets', route: null },
            { icon: 'notifications' as const, label: 'Notifications', subtitle: 'Alerts and updates', route: null },
            { icon: 'help-outline' as const, label: 'Help & Support', subtitle: 'FAQ and contact us', route: null },
          ].map((item, index) => (
            <TouchableOpacity
              key={index}
              className="flex-row items-center py-4 border-b border-primary/5"
              onPress={() => item.route && router.push(item.route as any)}
            >
              <View className="w-10 h-10 rounded-lg bg-primary/10 items-center justify-center">
                <MaterialIcons name={item.icon} size={20} color="#ac7e0c" />
              </View>
              <View className="flex-1 ml-4">
                <Text className="text-base font-semibold text-slate-900 dark:text-white">
                  {item.label}
                </Text>
                <Text className="text-xs text-slate-500 mt-0.5">{item.subtitle}</Text>
              </View>
              <MaterialIcons name="chevron-right" size={20} color="#94a3b8" />
            </TouchableOpacity>
          ))}

          {/* Logout Button */}
          <TouchableOpacity
            className="mt-8 flex-row items-center justify-center py-4 border border-red-200 rounded-xl"
            onPress={handleLogout}
          >
            <MaterialIcons name="logout" size={20} color="#ef4444" />
            <Text className="text-red-500 font-bold ml-2">Sign Out</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
