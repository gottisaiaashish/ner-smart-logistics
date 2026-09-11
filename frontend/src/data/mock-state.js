/**
 * Mock Operational State Data & Incident Records
 */

export const INITIAL_ALERTS = [];

export const INITIAL_TIMELINE = [];

export const INITIAL_FIELD_REPORTS = [];

export const INITIAL_DELIVERIES = [
  {
    id: 'DEL-8801',
    cargo: 'Emergency COVID & Japanese Encephalitis Vaccines (Cold Chain)',
    commodityType: 'Medical & Vaccines',
    priority: 'CRITICAL',
    origin: 'Guwahati Central Medical Depot',
    destination: 'Silchar District Civil Hospital',
    vehicleId: 'TRUCK-07',
    driver: 'Ranjit Borah',
    eta: '4h 15m',
    status: 'In Transit',
    distance: '315 km',
    createdDate: 'Today, 07:30 AM'
  },
  {
    id: 'DEL-8802',
    cargo: 'Liquid Medical Oxygen Cylinders & Concentrators',
    commodityType: 'Hazardous Oxygen',
    priority: 'HIGH',
    origin: 'Numaligarh Oxygen Plant',
    destination: 'Civil Hospital, Aizawl',
    vehicleId: 'TRUCK-12',
    driver: 'Lalramzauva Sailo',
    eta: '6h 40m',
    status: 'In Transit',
    distance: '348 km',
    createdDate: 'Today, 06:00 AM'
  },
  {
    id: 'DEL-8803',
    cargo: 'Disaster Relief Rations & Baby Nutrient Packs',
    commodityType: 'Food & Relief',
    priority: 'MEDIUM',
    origin: 'Tezpur Supply Depot',
    destination: 'Morigaon Relief Base',
    vehicleId: 'TRUCK-04',
    driver: 'Bikash Das',
    eta: '1h 10m',
    status: 'Delayed',
    distance: '142 km',
    createdDate: 'Today, 06:45 AM'
  },
  {
    id: 'DEL-8804',
    cargo: 'Emergency Whole Blood Units & Plasma Bags',
    commodityType: 'Critical Bio-Supply',
    priority: 'CRITICAL',
    origin: 'RIMS Blood Bank, Imphal',
    destination: 'Moreh Sub-Divisional Hospital',
    vehicleId: 'TRUCK-19',
    driver: 'N. Sanatomba Singh',
    eta: '1h 20m',
    status: 'In Transit',
    distance: '110 km',
    createdDate: 'Today, 08:30 AM'
  }
];
