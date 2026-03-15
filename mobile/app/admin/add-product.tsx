// ==========================================
// Admin: Add Product Screen
// ==========================================
// Admins use this form to add new products to the store.

import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  ActivityIndicator, Alert, KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import api from '../../services/api';

const categories = ['Men', 'Women', 'Kids', 'Accessories'];

export default function AddProductScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Men',
    imageUrls: '',
    sizes: '',
    colors: '',
    stockQty: '',
  });

  const handleSubmit = async () => {
    if (!form.name || !form.price || !form.description) {
      Alert.alert('Missing Fields', 'Name, price, and description are required.');
      return;
    }

    setLoading(true);
    try {
      await api.post('/products', {
        name: form.name,
        description: form.description,
        price: parseFloat(form.price),
        category: form.category,
        imageUrls: form.imageUrls.split(',').map((u) => u.trim()).filter(Boolean),
        sizes: form.sizes.split(',').map((s) => s.trim()).filter(Boolean),
        colors: form.colors.split(',').map((c) => c.trim()).filter(Boolean),
        stockQty: parseInt(form.stockQty) || 0,
      });

      Alert.alert('Success! 🎉', 'Product added to the catalog.', [
        { text: 'Add Another', onPress: () => setForm({ name: '', description: '', price: '', category: 'Men', imageUrls: '', sizes: '', colors: '', stockQty: '' }) },
        { text: 'Done', onPress: () => router.back() },
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to add product.');
    } finally {
      setLoading(false);
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
            Add Product
          </Text>
        </View>

        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
          <ScrollView className="flex-1 px-4 py-6" keyboardShouldPersistTaps="handled">
            {/* Name */}
            <View className="mb-4">
              <Text className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-2">Product Name *</Text>
              <TextInput
                className="bg-primary/5 border border-primary/20 rounded-xl px-4 h-12 text-slate-900 dark:text-white"
                placeholder="e.g. Classic Tailored Blazer"
                placeholderTextColor="#94a3b8"
                value={form.name}
                onChangeText={(text) => setForm({ ...form, name: text })}
              />
            </View>

            {/* Description */}
            <View className="mb-4">
              <Text className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-2">Description *</Text>
              <TextInput
                className="bg-primary/5 border border-primary/20 rounded-xl px-4 py-3 text-slate-900 dark:text-white"
                placeholder="Describe the product..."
                placeholderTextColor="#94a3b8"
                value={form.description}
                onChangeText={(text) => setForm({ ...form, description: text })}
                multiline
                numberOfLines={3}
                style={{ minHeight: 80, textAlignVertical: 'top' }}
              />
            </View>

            {/* Price + Stock in a row */}
            <View className="flex-row gap-3 mb-4">
              <View className="flex-1">
                <Text className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-2">Price ($) *</Text>
                <TextInput
                  className="bg-primary/5 border border-primary/20 rounded-xl px-4 h-12 text-slate-900 dark:text-white"
                  placeholder="99.00"
                  placeholderTextColor="#94a3b8"
                  value={form.price}
                  onChangeText={(text) => setForm({ ...form, price: text })}
                  keyboardType="decimal-pad"
                />
              </View>
              <View className="flex-1">
                <Text className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-2">Stock Qty</Text>
                <TextInput
                  className="bg-primary/5 border border-primary/20 rounded-xl px-4 h-12 text-slate-900 dark:text-white"
                  placeholder="50"
                  placeholderTextColor="#94a3b8"
                  value={form.stockQty}
                  onChangeText={(text) => setForm({ ...form, stockQty: text })}
                  keyboardType="number-pad"
                />
              </View>
            </View>

            {/* Category */}
            <View className="mb-4">
              <Text className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-2">Category</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {categories.map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    onPress={() => setForm({ ...form, category: cat })}
                    className={`h-10 px-5 mr-3 rounded-lg items-center justify-center ${
                      form.category === cat ? 'bg-primary' : 'bg-primary/10'
                    }`}
                  >
                    <Text className={`text-sm font-semibold ${form.category === cat ? 'text-white' : 'text-slate-900'}`}>
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Image URLs */}
            <View className="mb-4">
              <Text className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-2">Image URLs (comma separated)</Text>
              <TextInput
                className="bg-primary/5 border border-primary/20 rounded-xl px-4 py-3 text-slate-900 dark:text-white"
                placeholder="https://image1.jpg, https://image2.jpg"
                placeholderTextColor="#94a3b8"
                value={form.imageUrls}
                onChangeText={(text) => setForm({ ...form, imageUrls: text })}
                multiline
                style={{ minHeight: 60, textAlignVertical: 'top' }}
              />
            </View>

            {/* Sizes */}
            <View className="mb-4">
              <Text className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-2">Sizes (comma separated)</Text>
              <TextInput
                className="bg-primary/5 border border-primary/20 rounded-xl px-4 h-12 text-slate-900 dark:text-white"
                placeholder="S, M, L, XL"
                placeholderTextColor="#94a3b8"
                value={form.sizes}
                onChangeText={(text) => setForm({ ...form, sizes: text })}
              />
            </View>

            {/* Colors */}
            <View className="mb-4">
              <Text className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-2">Colors (comma separated)</Text>
              <TextInput
                className="bg-primary/5 border border-primary/20 rounded-xl px-4 h-12 text-slate-900 dark:text-white"
                placeholder="Black, Navy, White"
                placeholderTextColor="#94a3b8"
                value={form.colors}
                onChangeText={(text) => setForm({ ...form, colors: text })}
              />
            </View>

            {/* Submit */}
            <TouchableOpacity
              className="w-full bg-primary py-4 rounded-xl items-center justify-center flex-row gap-2 mt-4 mb-8"
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <>
                  <MaterialIcons name="add" size={20} color="white" />
                  <Text className="text-white font-bold text-sm uppercase tracking-widest">Add Product</Text>
                </>
              )}
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
