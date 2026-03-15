// ==========================================
// Checkout Screen
// ==========================================
// User enters shipping details, reviews the order,
// and proceeds to payment via Stripe.

import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore';
import { createPaymentIntent, confirmOrderPayment } from '../services/orderService';

export default function CheckoutScreen() {
  const router = useRouter();
  const { items, totalAmount, clearCart } = useCartStore();
  const { token, user } = useAuthStore();

  const taxRate = 0.08;
  const tax = totalAmount * taxRate;
  const grandTotal = totalAmount + tax;

  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState({
    fullName: user?.name || '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US',
    phone: '',
  });

  const handlePlaceOrder = async () => {
    // Validate all fields are filled
    const { fullName, address: addr, city, state, zipCode, phone } = address;
    if (!fullName || !addr || !city || !state || !zipCode || !phone) {
      Alert.alert('Missing Fields', 'Please fill in all shipping details.');
      return;
    }

    if (!token) {
      Alert.alert('Not Logged In', 'Please sign in to place an order.', [
        { text: 'Sign In', onPress: () => router.push('/login') },
      ]);
      return;
    }

    setLoading(true);
    try {
      // Prepare order items for the backend
      const orderItems = items.map((item) => ({
        product: item.product._id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        size: item.selectedSize,
        color: item.selectedColor,
        imageUrl: item.product.imageUrls[0],
      }));

      // Create payment intent on the backend
      const { orderId } = await createPaymentIntent(
        orderItems,
        grandTotal,
        address
      );

      // For now (without real Stripe keys), we simulate a successful payment
      // In production, you would use the Stripe SDK to show the payment sheet
      await confirmOrderPayment(orderId);

      // Payment succeeded!
      clearCart();
      Alert.alert(
        'Order Placed! 🎉',
        `Your order #${orderId.slice(-6).toUpperCase()} has been placed successfully. You will receive a confirmation shortly.`,
        [{ text: 'View Orders', onPress: () => router.replace('/(tabs)/profile') }]
      );
    } catch (error: any) {
      const message = error.response?.data?.message || 'Order failed. Please try again.';
      Alert.alert('Order Error', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark">
      <SafeAreaView edges={['top']} className="flex-1">
        {/* Header */}
        <View className="flex-row items-center p-4 border-b border-primary/10">
          <TouchableOpacity onPress={() => router.back()} className="size-10 items-center justify-center">
            <MaterialIcons name="arrow-back" size={24} color="#ac7e0c" />
          </TouchableOpacity>
          <Text className="text-lg font-bold uppercase tracking-widest flex-1 text-center pr-10 text-slate-900 dark:text-white">
            Checkout
          </Text>
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1"
        >
          <ScrollView className="flex-1 px-4 py-6" keyboardShouldPersistTaps="handled">
            {/* Progress Stepper */}
            <View className="flex-row items-center justify-center gap-4 mb-8">
              <View className="items-center gap-1">
                <View className="size-2 rounded-full bg-primary" />
                <Text className="text-[10px] uppercase font-bold text-primary">Bag</Text>
              </View>
              <View className="h-px w-12 bg-primary" />
              <View className="items-center gap-1">
                <View className="size-2 rounded-full bg-primary" />
                <Text className="text-[10px] uppercase font-bold text-primary">Ship</Text>
              </View>
              <View className="h-px w-12 bg-primary/20" />
              <View className="items-center gap-1">
                <View className="size-2 rounded-full bg-primary/20" />
                <Text className="text-[10px] uppercase font-medium text-slate-400">Pay</Text>
              </View>
            </View>

            {/* Shipping Form */}
            <Text className="text-lg font-bold text-slate-900 dark:text-white mb-4">
              Shipping Address
            </Text>

            {[
              { key: 'fullName', label: 'Full Name', placeholder: 'John Doe', keyboard: 'default' as const },
              { key: 'phone', label: 'Phone', placeholder: '+1 (555) 000-0000', keyboard: 'phone-pad' as const },
              { key: 'address', label: 'Street Address', placeholder: '123 Main Street', keyboard: 'default' as const },
              { key: 'city', label: 'City', placeholder: 'New York', keyboard: 'default' as const },
              { key: 'state', label: 'State', placeholder: 'NY', keyboard: 'default' as const },
              { key: 'zipCode', label: 'ZIP Code', placeholder: '10001', keyboard: 'number-pad' as const },
            ].map((field) => (
              <View key={field.key} className="mb-4">
                <Text className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-2">
                  {field.label}
                </Text>
                <TextInput
                  className="bg-primary/5 border border-primary/20 rounded-xl px-4 h-12 text-slate-900 dark:text-white"
                  placeholder={field.placeholder}
                  placeholderTextColor="#94a3b8"
                  value={address[field.key as keyof typeof address]}
                  onChangeText={(text) => setAddress({ ...address, [field.key]: text })}
                  keyboardType={field.keyboard}
                />
              </View>
            ))}

            {/* Order Summary */}
            <View className="mt-4 pt-6 border-t border-primary/10">
              <Text className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                Order Summary
              </Text>
              {items.map((item) => (
                <View key={`${item.product._id}-${item.selectedSize}`} className="flex-row justify-between mb-2">
                  <Text className="text-sm text-slate-600 dark:text-slate-400 flex-1" numberOfLines={1}>
                    {item.product.name} × {item.quantity}
                  </Text>
                  <Text className="text-sm font-medium text-slate-900 dark:text-white">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </Text>
                </View>
              ))}
              <View className="flex-row justify-between mt-2 mb-1">
                <Text className="text-sm text-slate-500">Shipping</Text>
                <Text className="text-sm text-primary font-medium">Free</Text>
              </View>
              <View className="flex-row justify-between mb-4">
                <Text className="text-sm text-slate-500">Tax</Text>
                <Text className="text-sm font-medium text-slate-900 dark:text-white">${tax.toFixed(2)}</Text>
              </View>
              <View className="pt-4 border-t border-primary/20 flex-row justify-between items-center">
                <Text className="text-lg font-bold uppercase tracking-wider text-slate-900 dark:text-white">Total</Text>
                <Text className="text-2xl font-extrabold text-primary">${grandTotal.toFixed(2)}</Text>
              </View>
            </View>

            {/* Place Order Button */}
            <TouchableOpacity
              className="w-full bg-primary py-4 rounded-xl items-center justify-center flex-row gap-2 mt-8 mb-8 shadow-lg shadow-primary/20"
              onPress={handlePlaceOrder}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <>
                  <MaterialIcons name="lock" size={18} color="white" />
                  <Text className="text-white font-bold text-sm uppercase tracking-widest">
                    Place Order
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
