/**
 * Mock Operational State Data & Incident Records
 */

export const INITIAL_ALERTS = [
  {
    id: 'ALT-1092',
    timestamp: '10:42 AM',
    title: 'Heavy Precipitation Surge Detected',
    category: 'Heavy Rain',
    location: 'East Jaintia Hills, Meghalaya (NH-6 Km 142)',
    severity: 'HIGH',
    affectedVehicles: ['TRUCK-07'],
    recommendedAction: 'Prepare alternate bypass Route B via Umrangso.',
    status: 'ACTIVE',
    aiConfidence: '92.4%'
  },
  {
    id: 'ALT-1088',
    timestamp: '09:55 AM',
    title: 'River Inundation Near Morigaon Lowlands',
    category: 'Flood',
    location: 'Brahmaputra South Bank (SH-18 Sector B)',
    severity: 'MEDIUM',
    affectedVehicles: ['TRUCK-04'],
    recommendedAction: 'Reduce convoy speed to < 35 km/h; monitor water gauges.',
    status: 'ACTIVE',
    aiConfidence: '88.1%'
  },
  {
    id: 'ALT-1076',
    timestamp: '08:30 AM',
    title: 'Sub-Zero Icing & Sleet Alert',
    category: 'Weather Block',
    location: 'Sela Pass Elevation 13,700 ft (NH-13)',
    severity: 'CRITICAL',
    affectedVehicles: ['CONVOY-09'],
    recommendedAction: 'Deploy snow plough; halt heavy multi-axle freight until clearance.',
    status: 'INVESTIGATING',
    aiConfidence: '96.0%'
  },
  {
    id: 'ALT-1065',
    timestamp: '07:15 AM',
    title: 'Optical Fiber Cut - Cellular Fallback Engaged',
    category: 'Network Failure',
    location: 'Dima Hasao Hill Tracts',
    severity: 'LOW',
    affectedVehicles: ['TRUCK-12'],
    recommendedAction: 'SAT-COM telemetry mesh relay engaged automatically.',
    status: 'RESOLVED',
    aiConfidence: '99.5%'
  }
];

export const INITIAL_TIMELINE = [
  { time: '10:47 AM', title: 'Driver Notified', desc: 'TRUCK-07 in-cab HUD updated with route advisory alert.', type: 'info' },
  { time: '10:46 AM', title: 'AI Alternate Route Generated', desc: 'Optimal diversion: Route B via Umrangso Ridge (+33 km, ETA +35m, Risk: 18%).', type: 'ai' },
  { time: '10:45 AM', title: 'AI Disruption Prediction', desc: 'Probability of complete Sonapur road cut-off reached 84% in next 25 mins.', type: 'warning' },
  { time: '10:44 AM', title: 'NH-6 Corridor Risk Escalated', desc: 'Rain gauge registered 46.4 mm/hr at Khliehriat sensor.', type: 'danger' },
  { time: '10:42 AM', title: 'Heavy Rainfall Detected', desc: 'Doppler radar indicates monsoon squall over East Jaintia Hills.', type: 'weather' }
];

export const INITIAL_FIELD_REPORTS = [
  {
    id: 'FLD-904',
    officerName: 'Inspector D. Sangma',
    officerBadge: 'ML-POL-882',
    timestamp: '10:38 AM',
    incidentType: 'Landslide',
    severity: 'Critical / Impassable',
    roadName: 'NH-6 near Sonapur Tunnel Entry',
    gps: [25.1120, 92.3850],
    description: 'Fresh mud and boulder slide on both lanes. Debris depth approx 1.8m. Earthmovers requested from Jowai division.',
    photoUrl: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=600&q=80',
    verified: true
  },
  {
    id: 'FLD-901',
    officerName: 'Sub-Inspector P. Gogoi',
    officerBadge: 'AS-SDRF-104',
    timestamp: '09:20 AM',
    incidentType: 'Flood / Waterlogging',
    severity: 'Moderate',
    roadName: 'SH-18 Morigaon lowland approach',
    gps: [26.2500, 92.3500],
    description: 'Water flowing over causeway at 0.35m depth. 4x4 heavy trucks passing slowly with guide markers.',
    photoUrl: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=600&q=80',
    verified: true
  },
  {
    id: 'FLD-895',
    officerName: 'Havildar T. Angami',
    officerBadge: 'NL-DEF-402',
    timestamp: '07:45 AM',
    incidentType: 'Road Damage / Cave-in',
    severity: 'Minor',
    roadName: 'Kohima-Dimapur Bypass Km 28',
    gps: [25.7500, 94.1000],
    description: 'Shoulder erosion on valley side. Single lane traffic moving with safety cones placed.',
    photoUrl: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=600&q=80',
    verified: false
  }
];

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
