// ==========================================
// Product Detail Screen (Connected to API + Cart)
// ==========================================
// Now fetches real product data from the backend
// and uses the Zustand cart store to add items.

import { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, Dimensions, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getProductById } from '../../services/productService';
import { useCartStore } from '../../store/useCartStore';
import { Product } from '../../types';

const { width } = Dimensions.get('window');

export default function ProductDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { addItem } = useCartStore();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(id as string);
        setProduct(data);
        if (data.sizes.length > 0) setSelectedSize(data.sizes[0]);
        if (data.colors.length > 0) setSelectedColor(data.colors[0]);
      } catch (error) {
        console.log('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProduct();
  }, [id]);

  const handleAddToBag = () => {
    if (!product) return;
    if (product.sizes.length > 0 && !selectedSize) {
      Alert.alert('Select Size', 'Please select a size before adding to bag.');
      return;
    }
    addItem(product, selectedSize, selectedColor);
    Alert.alert('Added! 🛍️', `${product.name} has been added to your bag.`, [
      { text: 'Continue Shopping', style: 'cancel' },
      { text: 'View Bag', onPress: () => router.push('/(tabs)/bag') },
    ]);
  };

  if (loading) {
    return (
      <View className="flex-1 bg-background-light items-center justify-center">
        <ActivityIndicator size="large" color="#ac7e0c" />
      </View>
    );
  }

  if (!product) {
    return (
      <View className="flex-1 bg-background-light items-center justify-center">
        <Text className="text-slate-500">Product not found</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark">
      <SafeAreaView edges={['top']} className="flex-1">
        {/* Header */}
        <View className="flex-row items-center p-4 justify-between border-b border-primary/10 z-50">
          <TouchableOpacity onPress={() => router.back()} className="size-10 items-center justify-center rounded-full bg-black/5">
            <MaterialIcons name="arrow-back" size={24} color="#ac7e0c" />
          </TouchableOpacity>
          <Text className="text-slate-900 dark:text-slate-100 text-sm font-bold uppercase tracking-widest flex-1 text-center">
            {product.category}
          </Text>
          <View className="w-10" />
        </View>

        <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 24 }} bounces={false}>
          {/* Image Gallery */}
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            className="w-full bg-primary/5"
            style={{ height: width * 1.2 }}
          >
            {product.imageUrls.map((url, index) => (
              <Image
                key={index}
                source={{ uri: url }}
                style={{ width, height: width * 1.2 }}
                resizeMode="cover"
              />
            ))}
          </ScrollView>

          {/* Details Section */}
          <View className="px-6 py-6 border-b border-primary/10">
            <Text className="text-primary text-xs font-bold uppercase tracking-[0.2em]">{product.category}</Text>
            <Text className="text-slate-900 dark:text-slate-100 text-3xl font-light mt-2 leading-tight">{product.name}</Text>
            <Text className="text-slate-500 dark:text-slate-400 text-base mt-2 leading-relaxed">
              {product.description}
            </Text>
            <View className="flex-row items-center justify-between mt-6">
              <Text className="text-3xl font-light text-slate-900 dark:text-slate-100">${product.price.toFixed(2)}</Text>
              <Text className="text-primary text-sm font-medium">Free Express Shipping</Text>
            </View>
          </View>

          {/* Size Section */}
          {product.sizes.length > 0 && (
            <View className="px-6 py-6">
              <Text className="font-bold text-slate-900 dark:text-slate-100 mb-3">Select Size</Text>
              <View className="flex-row flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <TouchableOpacity
                    key={size}
                    onPress={() => setSelectedSize(size)}
                    className={`min-w-[60px] h-12 border items-center justify-center rounded px-4 ${
                      selectedSize === size ? 'border-primary bg-primary/5' : 'border-primary/20'
                    }`}
                  >
                    <Text className={`font-bold ${selectedSize === size ? 'text-primary' : 'text-slate-900 dark:text-slate-100'}`}>
                      {size}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Color Section */}
          {product.colors.length > 0 && (
            <View className="px-6 pb-6">
              <Text className="font-bold text-slate-900 dark:text-slate-100 mb-3">Color</Text>
              <View className="flex-row flex-wrap gap-2">
                {product.colors.map((color) => (
                  <TouchableOpacity
                    key={color}
                    onPress={() => setSelectedColor(color)}
                    className={`px-5 h-10 border items-center justify-center rounded-full ${
                      selectedColor === color ? 'border-primary bg-primary/10' : 'border-primary/20'
                    }`}
                  >
                    <Text className={`font-semibold text-sm ${selectedColor === color ? 'text-primary' : 'text-slate-700 dark:text-slate-300'}`}>
                      {color}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Add to Bag Button */}
          <View className="px-6 mt-2">
            <View className="flex-row gap-3">
              <TouchableOpacity
                className="flex-1 bg-primary py-4 rounded-lg flex-row items-center justify-center gap-2"
                onPress={handleAddToBag}
              >
                <MaterialIcons name="shopping-bag" size={20} color="white" />
                <Text className="text-white font-bold">Add to Bag</Text>
              </TouchableOpacity>
              <TouchableOpacity className="h-14 w-14 border border-primary/20 items-center justify-center rounded-lg">
                <MaterialIcons name="favorite-border" size={24} color="#ac7e0c" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Stock Info */}
          <View className="px-6 mt-4">
            <View className="p-4 bg-primary/5 rounded-lg flex-row items-center justify-center gap-2">
              <MaterialIcons name="inventory" size={16} color="#64748b" />
              <Text className="text-xs text-slate-500">
                {product.stockQty > 0 ? `${product.stockQty} items in stock` : 'Out of stock'}
              </Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
