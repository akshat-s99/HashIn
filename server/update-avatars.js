import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
dotenv.config({ path: '/Users/mac/HashIn/server/.env' });
import { User } from './src/models/User.model.js';

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to DB');

  const users = await User.find({});
  for (const u of users) {
    const seed = encodeURIComponent(u.firstName + ' ' + u.lastName);
    u.avatar = `https://api.multiavatar.com/${seed}.svg`;
    await u.save({ validateBeforeSave: false });
  }

  console.log(`Updated ${users.length} users with Multiavatar avatars!`);
  process.exit(0);
}

run().catch(console.error);
