// ==========================================
// Database Seed Script
// ==========================================
// Run this ONCE to fill your database with sample products.
// Command: npx ts-node src/seed.ts

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product';
import User from './models/User';

dotenv.config();

const sampleProducts = [
  {
    name: 'Classic Tailored Blazer',
    description: 'A timeless tailored blazer crafted from premium wool blend. Perfect for boardroom meetings and evening events.',
    price: 289.00,
    category: 'Men',
    imageUrls: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800'],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Navy', 'Charcoal', 'Black'],
    stockQty: 25,
  },
  {
    name: 'Silk Wrap Dress',
    description: 'Elegant silk wrap dress with a flattering silhouette. Transitions effortlessly from day to evening.',
    price: 195.00,
    category: 'Women',
    imageUrls: ['https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800'],
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Burgundy', 'Emerald', 'Ivory'],
    stockQty: 30,
  },
  {
    name: 'Premium Cotton Oxford Shirt',
    description: 'Crisp Oxford shirt made from 100% Egyptian cotton. A wardrobe essential for the modern professional.',
    price: 89.00,
    category: 'Men',
    imageUrls: ['https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['White', 'Light Blue', 'Pink'],
    stockQty: 50,
  },
  {
    name: 'Cashmere Crew Neck Sweater',
    description: 'Luxuriously soft cashmere sweater. Lightweight yet warm, perfect for layering.',
    price: 245.00,
    category: 'Women',
    imageUrls: ['https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800'],
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Camel', 'Grey', 'Navy'],
    stockQty: 20,
  },
  {
    name: 'Kids Organic Cotton Tee',
    description: 'Soft organic cotton t-shirt for kids. Fun colors and comfortable fit for everyday adventures.',
    price: 29.00,
    category: 'Kids',
    imageUrls: ['https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=800'],
    sizes: ['3-4Y', '5-6Y', '7-8Y', '9-10Y'],
    colors: ['Red', 'Blue', 'Green', 'Yellow'],
    stockQty: 100,
  },
  {
    name: 'Leather Crossbody Bag',
    description: 'Handcrafted Italian leather crossbody bag with adjustable strap and gold-tone hardware.',
    price: 175.00,
    category: 'Accessories',
    imageUrls: ['https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800'],
    sizes: [],
    colors: ['Tan', 'Black', 'Cognac'],
    stockQty: 15,
  },
  {
    name: 'Slim Fit Chinos',
    description: 'Modern slim-fit chinos in stretch cotton. Comfortable for all-day wear with a polished look.',
    price: 79.00,
    category: 'Men',
    imageUrls: ['https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800'],
    sizes: ['28', '30', '32', '34', '36'],
    colors: ['Khaki', 'Navy', 'Olive'],
    stockQty: 40,
  },
  {
    name: 'Pleated Midi Skirt',
    description: 'Flowing pleated midi skirt in a luxurious satin finish. Pairs beautifully with blouses and heels.',
    price: 120.00,
    category: 'Women',
    imageUrls: ['https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=800'],
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Gold', 'Silver', 'Black'],
    stockQty: 18,
  },
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Product.deleteMany({});
    await User.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create admin user
    await User.create({
      name: 'Admin User',
      email: 'admin@eliteattire.com',
      password: 'admin123456',
      role: 'admin',
    });
    console.log('👤 Created admin user (admin@eliteattire.com / admin123456)');

    // Create test customer
    await User.create({
      name: 'Test Customer',
      email: 'customer@test.com',
      password: 'customer123',
      role: 'user',
    });
    console.log('👤 Created test customer (customer@test.com / customer123)');

    // Insert sample products
    await Product.insertMany(sampleProducts);
    console.log(`🛍️  Inserted ${sampleProducts.length} sample products`);

    console.log('\n🎉 Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

seedDatabase();
