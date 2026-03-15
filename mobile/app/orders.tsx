// ==========================================
// Order History Screen
// ==========================================
// Shows all orders the user has placed.

import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { getMyOrders } from '../services/orderService';
import { Order } from '../types';

const statusColors: Record<string, string> = {
  processing: 'bg-yellow-100 text-yellow-800',
  shipped: 'bg-blue-100 text-blue-800',
  delivered: 'bg-green-100 text-green-800',
  pending: 'bg-orange-100 text-orange-800',
  completed: 'bg-green-100 text-green-800',
  failed: 'bg-red-100 text-red-800',
};

export default function OrdersScreen() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchOrders = async () => {
    try {
      const data = await getMyOrders();
      setOrders(data);
    } catch (error) {
      console.log('Error fetching orders:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark">
      <SafeAreaView edges={['top']} className="flex-1">
        {/* Header */}
        <View className="flex-row items-center p-4 border-b border-primary/10">
          <TouchableOpacity onPress={() => router.back()} className="size-10 items-center justify-center">
            <MaterialIcons name="arrow-back" size={24} color="#ac7e0c" />
          </TouchableOpacity>
          <Text className="text-lg font-bold uppercase tracking-widest flex-1 text-center pr-10 text-slate-900 dark:text-white">
            My Orders
          </Text>
        </View>

        {loading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#ac7e0c" />
          </View>
        ) : orders.length === 0 ? (
          <View className="flex-1 items-center justify-center px-6">
            <MaterialIcons name="receipt-long" size={64} color="#d4d4d8" />
            <Text className="text-xl font-bold text-slate-900 dark:text-white mt-4">
              No orders yet
            </Text>
            <Text className="text-slate-500 mt-2 text-center">
              Your order history will appear here after you make a purchase.
            </Text>
            <TouchableOpacity
              className="bg-primary py-4 px-8 rounded-xl mt-6"
              onPress={() => router.push('/(tabs)/shop')}
            >
              <Text className="text-white font-bold uppercase tracking-widest text-sm">
                Start Shopping
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <ScrollView
            className="flex-1 px-4 py-4"
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchOrders(); }} tintColor="#ac7e0c" />
            }
          >
            {orders.map((order) => (
              <View
                key={order._id}
                className="bg-primary/5 border border-primary/10 rounded-2xl p-5 mb-4"
              >
                {/* Order Header */}
                <View className="flex-row justify-between items-start mb-3">
                  <View>
                    <Text className="text-xs text-slate-500 uppercase tracking-widest">
                      Order #{order._id.slice(-6).toUpperCase()}
                    </Text>
                    <Text className="text-xs text-slate-400 mt-1">
                      {new Date(order.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </Text>
                  </View>
                  <View className="px-3 py-1 rounded-full bg-primary/10">
                    <Text className="text-xs font-bold uppercase text-primary">
                      {order.orderStatus}
                    </Text>
                  </View>
                </View>

                {/* Items */}
                {order.items.map((item, idx) => (
                  <View key={idx} className="flex-row justify-between py-1">
                    <Text className="text-sm text-slate-700 dark:text-slate-300 flex-1" numberOfLines={1}>
                      {item.name} × {item.quantity}
                    </Text>
                    <Text className="text-sm font-medium text-slate-900 dark:text-white">
                      ${(item.price * item.quantity).toFixed(2)}
                    </Text>
                  </View>
                ))}

                {/* Total */}
                <View className="flex-row justify-between items-center mt-3 pt-3 border-t border-primary/10">
                  <Text className="text-sm font-bold text-slate-900 dark:text-white">Total</Text>
                  <Text className="text-lg font-bold text-primary">${order.totalAmount.toFixed(2)}</Text>
                </View>
              </View>
            ))}
          </ScrollView>
        )}
      </SafeAreaView>
    </View>
  );
}
