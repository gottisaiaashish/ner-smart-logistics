import mongoose from 'mongoose';

const pttSchema = new mongoose.Schema({
  sender: { type: String, required: true },
  role: { type: String, default: 'FIELD' },
  text: { type: String, required: true },
  timestamp: { type: String }
}, { timestamps: true });

export const PttMessage = mongoose.models.PttMessage || mongoose.model('PttMessage', pttSchema);
