/**
 * MongoDB Atlas Connection Module with Resilient Fallback
 */

import mongoose from 'mongoose';

export async function connectDatabase() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.warn('[MongoDB] ⚠️ No MONGODB_URI provided. Running in high-speed In-Memory mode.');
    return false;
  }

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000
    });
    console.log('[MongoDB] 🟢 Connected successfully to MongoDB Atlas (smart_logistics)');
    return true;
  } catch (err) {
    console.error('[MongoDB] 🔴 Connection error (falling back to In-Memory mode):', err.message);
    return false;
  }
}
