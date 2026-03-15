// ==========================================
// Admin: Manage Products Screen
// ==========================================
// Lists all products with delete capability.

import { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, ActivityIndicator, Alert, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import api from '../../services/api';
import { Product } from '../../types';

export default function ManageProductsScreen() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchProducts = useCallback(async () => {
    try {
      const { data } = await api.get('/products?limit=100');
      setProducts(data.products);
    } catch (e) {
      console.log('Error:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchProducts(); }, []);

  const handleDelete = (id: string, name: string) => {
    Alert.alert('Delete Product', `Are you sure you want to delete "${name}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive',
        onPress: async () => {
          try {
            await api.delete(`/products/${id}`);
            setProducts((prev) => prev.filter((p) => p._id !== id));
            Alert.alert('Deleted', 'Product removed from catalog.');
          } catch (e: any) {
            Alert.alert('Error', e.response?.data?.message || 'Delete failed.');
          }
        },
      },
    ]);
  };

  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark">
      <SafeAreaView edges={['top']} className="flex-1">
        <View className="flex-row items-center p-4 border-b border-primary/10">
          <TouchableOpacity onPress={() => router.back()}>
            <MaterialIcons name="arrow-back" size={24} color="#ac7e0c" />
          </TouchableOpacity>
          <Text className="text-lg font-bold uppercase tracking-widest flex-1 text-center text-slate-900 dark:text-white">
            Products
          </Text>
          <TouchableOpacity onPress={() => router.push('/admin/add-product')}>
            <MaterialIcons name="add-circle" size={28} color="#ac7e0c" />
          </TouchableOpacity>
        </View>

        {loading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#ac7e0c" />
          </View>
        ) : (
          <ScrollView
            className="flex-1 px-4 py-4"
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchProducts(); }} tintColor="#ac7e0c" />}
          >
            {products.map((product) => (
              <View key={product._id} className="flex-row items-center py-3 border-b border-primary/5">
                <Image
                  source={{ uri: product.imageUrls[0] }}
                  className="w-16 h-16 rounded-lg bg-slate-200"
                  resizeMode="cover"
                />
                <View className="flex-1 ml-3">
                  <Text className="font-semibold text-slate-900 dark:text-white" numberOfLines={1}>{product.name}</Text>
                  <Text className="text-sm text-primary font-bold">${product.price.toFixed(2)}</Text>
                  <Text className="text-xs text-slate-500">{product.category} • {product.stockQty} in stock</Text>
                </View>
                <TouchableOpacity
                  className="w-10 h-10 items-center justify-center rounded-lg bg-red-50"
                  onPress={() => handleDelete(product._id, product.name)}
                >
                  <MaterialIcons name="delete-outline" size={20} color="#ef4444" />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        )}
      </SafeAreaView>
    </View>
  );
}
