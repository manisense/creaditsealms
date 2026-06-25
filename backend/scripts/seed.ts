import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { User, Role } from '../src/models/User';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/creditsea';

const seedUsers = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected.');

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('password123', salt);

    const rolesToSeed = [
      { name: 'Admin User', email: 'admin@creditsea.com', role: Role.Admin },
      { name: 'Sales Exec', email: 'sales@creditsea.com', role: Role.Sales },
      { name: 'Sanction Exec', email: 'sanction@creditsea.com', role: Role.Sanction },
      { name: 'Disbursement Exec', email: 'disbursement@creditsea.com', role: Role.Disbursement },
      { name: 'Collection Exec', email: 'collection@creditsea.com', role: Role.Collection }
    ];

    for (const u of rolesToSeed) {
      const exists = await User.findOne({ email: u.email });
      if (!exists) {
        await User.create({
          name: u.name,
          email: u.email,
          passwordHash,
          role: u.role
        });
        console.log(`Seeded ${u.role} account: ${u.email}`);
      } else {
        console.log(`Account ${u.email} already exists. Skipping.`);
      }
    }

    console.log('Seeding complete.');
  } catch (error) {
    console.error('Seeding error:', error);
  } finally {
    mongoose.disconnect();
  }
};

seedUsers();
