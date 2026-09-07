import mongoose from 'mongoose';

const dispatchSchema = new mongoose.Schema({
  portCode: { type: String, required: true, unique: true, index: true },
  vehicleId: { type: String, required: true },
  vehicleNumber: { type: String, required: true },
  driverName: { type: String, required: true },
  driverPhone: { type: String },
  vehicleType: { type: String },
  cargo: { type: String, required: true },
  cargoPriority: { type: String, default: 'CRITICAL' },
  origin: { type: String, default: 'Khanapara Checkpost Hub, Guwahati' },
  destination: { type: String, default: 'District Civil Hospital, Silchar' },
  assignedRoute: { type: String, default: 'ROUTE_A' },
  status: { type: String, default: 'IN_TRANSIT' },
  speed: { type: Number, default: 48 },
  progressPct: { type: Number, default: 5 },
  coordinates: { type: [Number], default: [26.1820, 91.7580] },
  currentLocationName: { type: String, default: 'Khanapara Staging Checkpost' }
}, { timestamps: true });

export const Dispatch = mongoose.models.Dispatch || mongoose.model('Dispatch', dispatchSchema);
