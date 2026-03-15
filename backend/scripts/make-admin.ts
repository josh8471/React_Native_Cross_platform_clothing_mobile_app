// ==========================================
// Utility Script: Make Admin
// ==========================================
// This script promotes a user to the 'admin' role
// by their email address.
// 
// Usage: npx ts-node scripts/make-admin.ts user@example.com

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import User from '../src/models/User';

// Load env vars
dotenv.config({ path: path.join(__dirname, '../.env') });

const makeAdmin = async () => {
  const email = process.argv[2];

  if (!email) {
    console.error('❌ Please provide an email address.');
    process.exit(1);
  }

  try {
    console.log('⏳ Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log('✅ Connected!');

    const user = await User.findOne({ email });

    if (!user) {
      console.error(`❌ User with email "${email}" not found.`);
      process.exit(1);
    }

    user.role = 'admin';
    await user.save();

    console.log(`\n🎉 SUCCESS! User "${user.name}" (${email}) is now an ADMIN.`);
    console.log('You can now access the Admin Dashboard from the mobile app Profile screen.\n');

    process.exit(0);
  } catch (error: any) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

makeAdmin();
