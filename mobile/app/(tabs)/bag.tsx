// ==========================================
// Shopping Bag Screen (Connected to Zustand Cart)
// ==========================================
// Now reads REAL cart items from the Zustand store
// instead of showing hardcoded items.

import { View, Text, ScrollView, TextInput, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCartStore } from '../../store/useCartStore';

export default function Bag() {
  const router = useRouter();
  const { items, totalAmount, removeItem, updateQuantity } = useCartStore();
  const taxRate = 0.08;
  const tax = totalAmount * taxRate;
  const grandTotal = totalAmount + tax;
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark">
      <SafeAreaView edges={['top']} className="flex-1">
        {/* Header */}
        <View className="flex-row items-center p-4 justify-between border-b border-primary/10">
          <TouchableOpacity onPress={() => router.back()} className="size-10 items-center justify-center rounded-full">
            <MaterialIcons name="arrow-back" size={24} color="#0f172a" />
          </TouchableOpacity>
          <Text className="text-lg font-bold leading-tight tracking-tight flex-1 text-center pr-10 uppercase text-slate-900 dark:text-white">
            Shopping Bag
          </Text>
        </View>

        {/* Empty Cart State */}
        {items.length === 0 ? (
          <View className="flex-1 items-center justify-center px-6">
            <MaterialIcons name="shopping-bag" size={64} color="#d4d4d8" />
            <Text className="text-xl font-bold text-slate-900 dark:text-white mt-4">
              Your bag is empty
            </Text>
            <Text className="text-slate-500 mt-2 text-center">
              Browse our collection and add your favorite pieces.
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
          <ScrollView className="flex-1 px-4 py-6" contentContainerStyle={{ paddingBottom: 24 }}>
            {/* Progress Stepper */}
            <View className="flex-row items-center justify-center gap-4 mb-8">
              <View className="items-center gap-1">
                <View className="size-2 rounded-full bg-primary" />
                <Text className="text-[10px] uppercase font-bold text-primary">Bag</Text>
              </View>
              <View className="h-px w-12 bg-primary/20" />
              <View className="items-center gap-1">
                <View className="size-2 rounded-full bg-primary/20" />
                <Text className="text-[10px] uppercase font-medium text-slate-400">Ship</Text>
              </View>
              <View className="h-px w-12 bg-primary/20" />
              <View className="items-center gap-1">
                <View className="size-2 rounded-full bg-primary/20" />
                <Text className="text-[10px] uppercase font-medium text-slate-400">Pay</Text>
              </View>
            </View>

            {/* Cart Items */}
            {items.map((cartItem) => (
              <View key={`${cartItem.product._id}-${cartItem.selectedSize}-${cartItem.selectedColor}`} className="flex-row items-start gap-4 pb-6 border-b border-primary/5 mb-6">
                <Image
                  source={{ uri: cartItem.product.imageUrls[0] }}
                  className="aspect-[3/4] rounded-lg w-24 shrink-0 bg-slate-200"
                />
                <View className="flex-1 justify-between min-h-[120px]">
                  <View>
                    <View className="flex-row justify-between items-start">
                      <Text className="text-base font-semibold leading-tight text-slate-900 dark:text-slate-100 flex-1 pr-2">
                        {cartItem.product.name}
                      </Text>
                      <TouchableOpacity onPress={() => removeItem(cartItem.product._id)}>
                        <MaterialIcons name="close" size={20} color="#94a3b8" />
                      </TouchableOpacity>
                    </View>
                    <Text className="text-primary text-sm font-medium mt-1">
                      {cartItem.selectedColor} • Size {cartItem.selectedSize}
                    </Text>
                  </View>
                  <View className="flex-row items-center justify-between mt-4">
                    <View className="flex-row items-center gap-3 bg-primary/5 rounded-full px-3 py-1 border border-primary/10">
                      <TouchableOpacity onPress={() => updateQuantity(cartItem.product._id, cartItem.quantity - 1)}>
                        <Text className="text-lg font-bold text-primary">-</Text>
                      </TouchableOpacity>
                      <Text className="text-sm font-bold w-4 text-center text-slate-900 dark:text-white">
                        {cartItem.quantity}
                      </Text>
                      <TouchableOpacity onPress={() => updateQuantity(cartItem.product._id, cartItem.quantity + 1)}>
                        <Text className="text-lg font-bold text-primary">+</Text>
                      </TouchableOpacity>
                    </View>
                    <Text className="text-lg font-bold text-slate-900 dark:text-white">
                      ${(cartItem.product.price * cartItem.quantity).toFixed(2)}
                    </Text>
                  </View>
                </View>
              </View>
            ))}

            {/* Order Summary */}
            <View className="space-y-4 pt-4">
              <View className="flex-row justify-between items-center mb-2">
                <Text className="text-sm text-slate-500">Subtotal ({totalItems} items)</Text>
                <Text className="text-sm font-medium text-slate-900 dark:text-white">${totalAmount.toFixed(2)}</Text>
              </View>
              <View className="flex-row justify-between items-center mb-2">
                <Text className="text-sm text-slate-500">Shipping</Text>
                <Text className="text-sm text-primary font-medium">Free</Text>
              </View>
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-sm text-slate-500">Estimated Tax</Text>
                <Text className="text-sm font-medium text-slate-900 dark:text-white">${tax.toFixed(2)}</Text>
              </View>
              <View className="pt-4 border-t border-primary/20 flex-row justify-between items-center">
                <Text className="text-lg font-bold uppercase tracking-wider text-slate-900 dark:text-white">Total</Text>
                <Text className="text-2xl font-extrabold text-primary">${grandTotal.toFixed(2)}</Text>
              </View>
            </View>

            {/* Promo Code */}
            <View className="relative mt-8">
              <TextInput
                className="w-full bg-primary/5 border border-primary/20 rounded-lg px-4 py-3 text-sm text-slate-900 dark:text-white"
                placeholder="Promo Code"
                placeholderTextColor="#64748b"
              />
              <TouchableOpacity className="absolute right-2 top-2 bottom-2 px-4 justify-center items-center rounded bg-primary/10">
                <Text className="text-xs font-bold uppercase text-primary">Apply</Text>
              </TouchableOpacity>
            </View>

            {/* Checkout Button */}
            <TouchableOpacity
              className="w-full bg-primary py-4 rounded-xl items-center justify-center flex-row gap-2 uppercase tracking-widest mt-8 shadow-lg shadow-primary/20 mb-6 px-4"
              onPress={() => router.push('/checkout')}
            >
              <Text className="text-white font-bold text-sm">Proceed to Checkout</Text>
              <MaterialIcons name="arrow-forward" size={16} color="white" />
            </TouchableOpacity>
          </ScrollView>
        )}
      </SafeAreaView>
    </View>
  );
}
