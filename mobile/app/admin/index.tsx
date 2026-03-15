// ==========================================
// Admin Dashboard Screen
// ==========================================
// Main admin hub — shows quick stats and links
// to product management and order management.

import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../store/useAuthStore';
import api from '../../services/api';

export default function AdminDashboard() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [stats, setStats] = useState({ products: 0, orders: 0, users: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [productsRes, ordersRes] = await Promise.all([
          api.get('/products?limit=1'),
          api.get('/orders'),
        ]);
        setStats({
          products: productsRes.data.totalProducts || 0,
          orders: Array.isArray(ordersRes.data) ? ordersRes.data.length : 0,
          users: 0,
        });
      } catch (e) {
        console.log('Stats error:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  // Redirect non-admin users
  if (user?.role !== 'admin') {
    return (
      <View className="flex-1 bg-background-light items-center justify-center px-6">
        <MaterialIcons name="lock" size={64} color="#ef4444" />
        <Text className="text-xl font-bold text-slate-900 mt-4">Access Denied</Text>
        <Text className="text-slate-500 text-center mt-2">You need admin privileges to access this area.</Text>
        <TouchableOpacity className="bg-primary py-3 px-8 rounded-xl mt-6" onPress={() => router.back()}>
          <Text className="text-white font-bold">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark">
      <SafeAreaView edges={['top']} className="flex-1">
        <View className="p-4 border-b border-primary/10">
          <View className="flex-row items-center justify-between">
            <TouchableOpacity onPress={() => router.back()}>
              <MaterialIcons name="arrow-back" size={24} color="#ac7e0c" />
            </TouchableOpacity>
            <Text className="text-lg font-bold uppercase tracking-widest text-slate-900 dark:text-white">
              Admin Panel
            </Text>
            <View className="w-6" />
          </View>
        </View>

        <ScrollView className="flex-1 px-4 py-6">
          {/* Welcome */}
          <Text className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
            Hello, {user?.name} 👋
          </Text>
          <Text className="text-slate-500 mb-6">Manage your store from here.</Text>

          {/* Stats Cards */}
          {loading ? (
            <ActivityIndicator size="large" color="#ac7e0c" className="my-8" />
          ) : (
            <View className="flex-row gap-3 mb-8">
              {[
                { label: 'Products', value: stats.products, icon: 'inventory-2' as const, color: '#ac7e0c' },
                { label: 'Orders', value: stats.orders, icon: 'receipt-long' as const, color: '#2563eb' },
              ].map((stat) => (
                <View key={stat.label} className="flex-1 bg-primary/5 border border-primary/10 rounded-2xl p-5">
                  <MaterialIcons name={stat.icon} size={28} color={stat.color} />
                  <Text className="text-3xl font-bold text-slate-900 dark:text-white mt-2">{stat.value}</Text>
                  <Text className="text-xs uppercase tracking-widest text-slate-500 mt-1">{stat.label}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Quick Actions */}
          <Text className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-3">
            Quick Actions
          </Text>
          {[
            { icon: 'add-box' as const, label: 'Add New Product', subtitle: 'Add items to your catalog', route: '/admin/add-product' },
            { icon: 'inventory' as const, label: 'Manage Products', subtitle: 'Edit or remove products', route: '/admin/products' },
            { icon: 'local-shipping' as const, label: 'Manage Orders', subtitle: 'View and update order status', route: '/admin/orders' },
          ].map((item, index) => (
            <TouchableOpacity
              key={index}
              className="flex-row items-center py-4 border-b border-primary/5"
              onPress={() => router.push(item.route as any)}
            >
              <View className="w-12 h-12 rounded-xl bg-primary/10 items-center justify-center">
                <MaterialIcons name={item.icon} size={24} color="#ac7e0c" />
              </View>
              <View className="flex-1 ml-4">
                <Text className="text-base font-semibold text-slate-900 dark:text-white">{item.label}</Text>
                <Text className="text-xs text-slate-500 mt-0.5">{item.subtitle}</Text>
              </View>
              <MaterialIcons name="chevron-right" size={20} color="#94a3b8" />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
