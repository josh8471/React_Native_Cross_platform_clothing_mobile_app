// ==========================================
// Admin: Manage Orders Screen
// ==========================================
// View all orders and update their status.

import { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Alert, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import api from '../../services/api';

interface AdminOrder {
  _id: string;
  user: { name: string; email: string };
  items: { name: string; quantity: number; price: number }[];
  totalAmount: number;
  orderStatus: string;
  paymentStatus: string;
  createdAt: string;
}

const statusOptions = ['processing', 'shipped', 'delivered'];

export default function ManageOrdersScreen() {
  const router = useRouter();
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchOrders = useCallback(async () => {
    try {
      const { data } = await api.get('/orders');
      setOrders(data);
    } catch (e) {
      console.log('Error:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchOrders(); }, []);

  const updateStatus = (orderId: string, currentStatus: string) => {
    const currentIdx = statusOptions.indexOf(currentStatus);
    const nextStatus = statusOptions[currentIdx + 1];
    if (!nextStatus) {
      Alert.alert('Already Delivered', 'This order has been delivered.');
      return;
    }

    Alert.alert(
      'Update Status',
      `Mark this order as "${nextStatus}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: `Mark ${nextStatus}`,
          onPress: async () => {
            try {
              await api.put(`/orders/${orderId}/status`, { orderStatus: nextStatus });
              setOrders((prev) =>
                prev.map((o) => o._id === orderId ? { ...o, orderStatus: nextStatus } : o)
              );
            } catch (e: any) {
              Alert.alert('Error', e.response?.data?.message || 'Update failed.');
            }
          },
        },
      ]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processing': return { bg: 'bg-yellow-100', text: 'text-yellow-800' };
      case 'shipped': return { bg: 'bg-blue-100', text: 'text-blue-800' };
      case 'delivered': return { bg: 'bg-green-100', text: 'text-green-800' };
      default: return { bg: 'bg-slate-100', text: 'text-slate-800' };
    }
  };

  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark">
      <SafeAreaView edges={['top']} className="flex-1">
        <View className="flex-row items-center p-4 border-b border-primary/10">
          <TouchableOpacity onPress={() => router.back()}>
            <MaterialIcons name="arrow-back" size={24} color="#ac7e0c" />
          </TouchableOpacity>
          <Text className="text-lg font-bold uppercase tracking-widest flex-1 text-center pr-6 text-slate-900 dark:text-white">
            Orders
          </Text>
        </View>

        {loading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#ac7e0c" />
          </View>
        ) : orders.length === 0 ? (
          <View className="flex-1 items-center justify-center">
            <MaterialIcons name="receipt-long" size={64} color="#d4d4d8" />
            <Text className="text-xl font-bold text-slate-900 dark:text-white mt-4">No orders yet</Text>
          </View>
        ) : (
          <ScrollView
            className="flex-1 px-4 py-4"
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchOrders(); }} tintColor="#ac7e0c" />}
          >
            {orders.map((order) => {
              const colors = getStatusColor(order.orderStatus);
              return (
                <View key={order._id} className="bg-primary/5 border border-primary/10 rounded-2xl p-5 mb-4">
                  {/* Header */}
                  <View className="flex-row justify-between items-start mb-2">
                    <View>
                      <Text className="text-xs text-slate-500 uppercase tracking-widest">
                        #{order._id.slice(-6).toUpperCase()}
                      </Text>
                      <Text className="text-sm font-semibold text-slate-900 dark:text-white mt-1">
                        {order.user?.name || 'Unknown'}
                      </Text>
                      <Text className="text-xs text-slate-400">{order.user?.email}</Text>
                    </View>
                    <View className={`px-3 py-1 rounded-full ${colors.bg}`}>
                      <Text className={`text-xs font-bold uppercase ${colors.text}`}>
                        {order.orderStatus}
                      </Text>
                    </View>
                  </View>

                  {/* Items */}
                  {order.items.map((item, idx) => (
                    <Text key={idx} className="text-sm text-slate-600 dark:text-slate-400">
                      {item.name} × {item.quantity}
                    </Text>
                  ))}

                  {/* Footer */}
                  <View className="flex-row justify-between items-center mt-3 pt-3 border-t border-primary/10">
                    <Text className="text-lg font-bold text-primary">${order.totalAmount.toFixed(2)}</Text>
                    <TouchableOpacity
                      className="flex-row items-center gap-1 bg-primary px-4 py-2 rounded-lg"
                      onPress={() => updateStatus(order._id, order.orderStatus)}
                    >
                      <MaterialIcons name="update" size={16} color="white" />
                      <Text className="text-white font-bold text-xs uppercase">
                        {order.orderStatus === 'delivered' ? 'Done' : 'Advance'}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <Text className="text-xs text-slate-400 mt-2">
                    {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </Text>
                </View>
              );
            })}
          </ScrollView>
        )}
      </SafeAreaView>
    </View>
  );
}
