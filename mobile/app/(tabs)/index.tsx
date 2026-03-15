import { View, Text, ScrollView, ImageBackground, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';

export default function Home() {
  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark">
      <SafeAreaView edges={['top']} className="flex-1">
        {/* Top Navigation */}
        <View className="flex-row items-center p-4 justify-between border-b border-primary/10">
          <TouchableOpacity className="size-12 items-center justify-center">
            <MaterialIcons name="menu" size={28} color="#0f172a" className="dark:color-slate-100" />
          </TouchableOpacity>
          <Text className="text-slate-900 dark:text-slate-100 text-xl font-extrabold tracking-[0.2em] flex-1 text-center font-display">
            ELITE ATTIRE
          </Text>
          <View className="w-12 items-end justify-center">
            <TouchableOpacity className="items-center justify-center">
              <MaterialIcons name="shopping-bag" size={28} color="#0f172a" className="dark:color-slate-100" />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 24 }}>
          {/* Hero Section */}
          <View className="px-4 py-4">
            <ImageBackground
              source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCWK1pFgXlGP8qbz-8hSiVJBz9Ef_TO2vusDZUltXn8bXlQ8XclhCUDVAQeAn2Zvq9XIOk2_NFvX7NW81Ikcp_uJ3wgjpOaAQVNbsEoIQ4d6yCuLwlKd3gLwNGNrFMoyFWKZAPWOC1lptUKun18BlBo2TpxErJbFiNLVCPJeDG7DXmzjzW149H4zCnSQPaXqgorvAGHtjARSBouO_4kwlnmqzml8bsYcub1Bc2Ib_T9R540sb1dvjjxji_d6SW8ufAMp9nrW0x5awO7' }}
              className="overflow-hidden rounded-xl bg-slate-800 aspect-[4/5] justify-end"
              imageStyle={{ opacity: 0.8 }}
            >
              <View className="p-6 space-y-4" style={{ backgroundColor: 'rgba(34, 29, 16, 0.4)' }}>
                <View className="bg-primary self-start px-3 py-1 mb-2 rounded-sm">
                  <Text className="text-white text-[10px] font-bold tracking-widest uppercase">New Arrival</Text>
                </View>
                <Text className="text-white text-4xl font-bold leading-tight font-display mb-2">
                  The Executive Collection
                </Text>
                <Text className="text-slate-200 text-base font-light mb-4">
                  Precision tailoring meets modern ambition. Discover the silhouettes defining the next generation of leadership.
                </Text>
                <TouchableOpacity className="bg-primary py-4 rounded-lg items-center">
                  <Text className="text-white font-bold">Explore Collection</Text>
                </TouchableOpacity>
              </View>
            </ImageBackground>
          </View>

          {/* Brand Snippet */}
          <View className="py-8 px-4 items-center">
            <Text className="text-primary text-sm font-bold tracking-[0.3em] uppercase mb-4">
              Our Philosophy
            </Text>
            <Text className="text-2xl font-bold mb-4 leading-snug text-center text-slate-900 dark:text-white">
              Redefining Professionalism for the Modern Era
            </Text>
            <Text className="text-slate-600 dark:text-slate-400 leading-relaxed text-base text-center">
              We believe that what you wear is your first introduction to the world. Our pieces are meticulously crafted to transition seamlessly from high-stakes boardrooms to evening engagements.
            </Text>
          </View>

          {/* Featured Categories */}
          <View className="px-4 py-4">
            <View className="flex-row items-center justify-between mb-6">
              <Text className="text-xl font-bold font-display tracking-tight text-slate-900 dark:text-white">
                Curated Categories
              </Text>
              <TouchableOpacity className="flex-row items-center">
                <Text className="text-primary font-semibold text-sm mr-1">View All</Text>
                <MaterialIcons name="arrow-forward" size={16} color="#ac7e0c" />
              </TouchableOpacity>
            </View>

            {/* Suits */}
            <TouchableOpacity className="mb-6">
              <ImageBackground
                source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDy8YSKUDqHfl-pn4iFDhwUlGXv8ht3xil0I9JfeimgDAFqV4zQOMRV4zvRa0aMGRa1tx_2pSwDUdkpd0FkBWHdhBd5Pxq4xkgGjh597f3Ihy11thwEpFB6e4FJuMdIjxKVzfzOQgRjwGXEaXsq_1n1DYO37OJNH6VxM0r8XhsL6yQvHAVzgcbdYEXNKCYWBY0_LwLa-e5zQh9-Q24ltPViSJUNs7MbwlPSwmZ3oIIAam6Wis-Xjg8jWB3Vga61rJ9o2oirxx4raqA-' }}
                className="aspect-[3/4] overflow-hidden rounded-xl bg-slate-200 mb-3"
              />
              <Text className="text-lg font-bold text-slate-900 dark:text-white">Bespoke Suits</Text>
              <Text className="text-slate-500 dark:text-slate-400 text-sm">Perfectly measured excellence</Text>
            </TouchableOpacity>

            {/* Blouses */}
            <TouchableOpacity className="mb-6">
              <ImageBackground
                source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDziFwrL-aA5zPmEVbjz8Ug1ubgJ7fa47jPpfe7WgYcMXcw3auOc81SYka0uWaLaTIvxShvowozRSlnqMZa4N-gRzNli0Xcj8kTijGZVWoP2eR2G2g_0Ndgbx_QDLtzrvs7-HAYU9K7xJsDZMAZCNlyWUxUvy_GMacyFTpxwSDPpTKifec26bH9WIPZLqr9uplelCCViKWbbYRvlSt2fv7qIuGd-MAmiLjPwjPgRXRVQlNu-0yEwcDCvTDgoVkVOOIBcr0bQpB45zuw' }}
                className="aspect-[3/4] overflow-hidden rounded-xl bg-slate-200 mb-3"
              />
              <Text className="text-lg font-bold text-slate-900 dark:text-white">Signature Blouses</Text>
              <Text className="text-slate-500 dark:text-slate-400 text-sm">Silk and cotton essentials</Text>
            </TouchableOpacity>
            
            {/* Accessories */}
            <TouchableOpacity className="mb-6">
              <ImageBackground
                source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCpkMmhnmb4FUXphmKENBEg9h1ZpgdsGsvXBYWrZ6Dw4mDbj6uWqfj8BD7Cu5Bm2mm3kWWbLUaLGetkphPGrNkiATjlvVD0b1Aavu14JlO4VaPeF9OhwAR8VEWM4JuzGn-ZQ0muoWH2KHqyC98Pulq2TVNKfYgKlHAr4brXmATGpcXia5crJID7G0BmP4kpOAP3eIvRnUVC71jBbMN6XKFcrTuDWUhLcRYu-IvpaLoxSF3BCW55MVVBDk2gtn6NaYgDt2qAe-aac0no' }}
                className="aspect-[3/4] overflow-hidden rounded-xl bg-slate-200 mb-3"
              />
              <Text className="text-lg font-bold text-slate-900 dark:text-white">The Accents</Text>
              <Text className="text-slate-500 dark:text-slate-400 text-sm">Timepieces and fine leather goods</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
