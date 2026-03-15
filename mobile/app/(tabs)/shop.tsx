// ==========================================
// Shop Screen (Connected to Backend API)
// ==========================================
// This screen now fetches REAL products from our backend
// instead of showing hardcoded data.

import { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TextInput, Image, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { getProducts } from '../../services/productService';
import { Product } from '../../types';

const categories = ['All', 'Men', 'Women', 'Kids', 'Accessories'];

export default function Shop() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Fetch products from the backend
  const fetchProducts = useCallback(async () => {
    try {
      const params: any = {};
      if (selectedCategory !== 'All') params.category = selectedCategory;
      if (searchQuery.trim()) params.search = searchQuery.trim();
      
      const result = await getProducts(params);
      setProducts(result.products);
    } catch (error) {
      console.log('Error fetching products:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [selectedCategory, searchQuery]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchProducts();
  };

  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark">
      <SafeAreaView edges={['top']} className="flex-1">
        {/* Header */}
        <View className="flex-row items-center p-4 justify-between border-b border-primary/10">
          <Text className="text-xl font-bold leading-tight tracking-tight text-slate-900 dark:text-white flex-1 text-center">
            Executive Collection
          </Text>
        </View>

        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 24 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#ac7e0c" />
          }
        >
          {/* Search Section */}
          <View className="px-4 py-6">
            <View className="flex-row items-center w-full h-12 bg-primary/5 dark:bg-primary/10 rounded-xl px-4 border border-primary/20">
              <MaterialIcons name="search" size={24} color="#ac7e0c" />
              <TextInput
                className="flex-1 ml-3 text-slate-900 dark:text-slate-100"
                placeholder="Search curated styles..."
                placeholderTextColor="#64748b"
                value={searchQuery}
                onChangeText={setSearchQuery}
                onSubmitEditing={fetchProducts}
                returnKeyType="search"
              />
            </View>
          </View>

          {/* Category Filters */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-4 pb-4">
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat}
                onPress={() => setSelectedCategory(cat)}
                className={`h-10 items-center justify-center rounded-lg px-5 mr-3 ${
                  selectedCategory === cat
                    ? 'bg-primary'
                    : 'bg-primary/10 border border-primary/10'
                }`}
              >
                <Text
                  className={`text-sm font-semibold ${
                    selectedCategory === cat ? 'text-white' : 'text-slate-900 dark:text-slate-100'
                  }`}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Product Grid */}
          {loading ? (
            <View className="items-center justify-center py-20">
              <ActivityIndicator size="large" color="#ac7e0c" />
              <Text className="text-slate-500 mt-4">Loading collection...</Text>
            </View>
          ) : products.length === 0 ? (
            <View className="items-center justify-center py-20">
              <MaterialIcons name="search-off" size={48} color="#94a3b8" />
              <Text className="text-slate-500 mt-4">No products found</Text>
            </View>
          ) : (
            <View className="px-4 py-6 flex-row flex-wrap justify-between">
              {products.map((item) => (
                <Link key={item._id} href={`/product/${item._id}`} asChild>
                  <TouchableOpacity className="w-[48%] mb-6">
                    <View className="aspect-[3/4] w-full overflow-hidden rounded-xl bg-slate-200 dark:bg-slate-800 mb-3 relative">
                      <Image
                        source={{ uri: item.imageUrls[0] }}
                        className="h-full w-full"
                        resizeMode="cover"
                      />
                      <TouchableOpacity className="absolute top-3 right-3 h-8 w-8 rounded-full bg-white/40 items-center justify-center">
                        <MaterialIcons name="favorite-border" size={18} color="#0f172a" />
                      </TouchableOpacity>
                    </View>
                    <View>
                      <Text className="text-xs uppercase tracking-widest text-primary font-bold">
                        {item.category}
                      </Text>
                      <Text className="font-bold text-base mt-1 text-slate-900 dark:text-white" numberOfLines={1}>
                        {item.name}
                      </Text>
                      <Text className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-1">
                        ${item.price.toFixed(2)}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </Link>
              ))}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
