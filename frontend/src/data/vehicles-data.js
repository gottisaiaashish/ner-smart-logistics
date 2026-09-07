/**
 * Active Logistics Fleet Data for NER Command Center
 */

export const INITIAL_VEHICLES = [
  {
    id: 'TRUCK-07',
    registration: 'AS-01-EC-4492',
    name: 'BharatBenz 1617 Heavy Cargo (Cold Chain)',
    driverName: 'Ranjit Borah',
    driverPhone: '+91 98640 12894',
    cargo: 'Emergency Vaccines & Anti-Venom Kits',
    cargoType: 'Cold-Chain Medical',
    cargoWeight: '3.4 Tonnes',
    priority: 'CRITICAL', // CRITICAL, HIGH, NORMAL
    tempRequirement: '-20°C to -15°C',
    currentTemp: '-18.4°C (Nominal)',
    origin: 'Guwahati Central Medical Depot',
    destination: 'Silchar District Civil Hospital',
    currentLocationName: 'NH-6 near Nongpoh-Shillong descent',
    coordinates: [25.8200, 91.8900], // Currently on Route A
    speed: 48, // km/h
    heading: 145, // deg
    eta: '4h 15m',
    progressPct: 34,
    status: 'IN_TRANSIT', // IN_TRANSIT, REROUTED, DELAYED, DELIVERED, EMERGENCY
    networkStatus: 'ONLINE_4G', // ONLINE_4G, SAT_COM, OFFLINE
    activeCorridorId: 'corridor-route-a',
    assignedRoute: 'ROUTE_A', // ROUTE_A, ROUTE_B, ROUTE_C
    isDemoVehicle: true,
    battery: '94%',
    fuelLevel: '78%',
    lastGpsUpdate: 'Just now',
    riskLevel: 'LOW',
    routeHistory: [
      { time: '08:00 AM', event: 'Depot Dispatch at Guwahati Central Depot' },
      { time: '09:15 AM', event: 'Passed Jorabat Checkpoint (Speed: 52 km/h)' },
      { time: '10:30 AM', event: 'Nongpoh Weather Waypoint cleared' }
    ]
  },
  {
    id: 'TRUCK-12',
    registration: 'ML-05-AB-7719',
    name: 'Tata Signa 2823 Cryogenic Tanker',
    driverName: 'Lalramzauva Sailo',
    driverPhone: '+91 94361 88219',
    cargo: 'Liquid Medical Oxygen (LMO)',
    cargoType: 'Hazardous Critical Medical',
    cargoWeight: '8.2 Tonnes',
    priority: 'CRITICAL',
    tempRequirement: '-183°C Cryo',
    currentTemp: '-182.8°C',
    origin: 'Numaligarh Oxygen Plant',
    destination: 'Civil Hospital, Aizawl, Mizoram',
    currentLocationName: 'NH-27 near Lumding Junction',
    coordinates: [25.7510, 93.1750],
    speed: 42,
    heading: 180,
    eta: '6h 40m',
    progressPct: 52,
    status: 'IN_TRANSIT',
    networkStatus: 'SAT_COM',
    activeCorridorId: 'corridor-route-b',
    assignedRoute: 'ROUTE_B',
    isDemoVehicle: false,
    battery: '88%',
    fuelLevel: '65%',
    lastGpsUpdate: '12s ago',
    riskLevel: 'LOW',
    routeHistory: [
      { time: '06:30 AM', event: 'Departed Numaligarh Tanker Terminal' },
      { time: '09:45 AM', event: 'Nagaon Bypass passed without disruption' }
    ]
  },
  {
    id: 'TRUCK-04',
    registration: 'AS-03-BC-1120',
    name: 'Ashok Leyland Ecomet Disaster Relief',
    driverName: 'Bikash Das',
    driverPhone: '+91 97060 44321',
    cargo: 'Flood Relief Rations & Water Purification Kits',
    cargoType: 'Disaster Food & Water',
    cargoWeight: '5.5 Tonnes',
    priority: 'HIGH',
    origin: 'Tezpur Supply Depot',
    destination: 'Morigaon Flood Relief Center',
    currentLocationName: 'Brahmaputra Lowland Approach',
    coordinates: [26.2500, 92.3500],
    speed: 34,
    heading: 210,
    eta: '1h 10m',
    progressPct: 78,
    status: 'DELAYED',
    networkStatus: 'ONLINE_4G',
    activeCorridorId: 'corridor-route-a',
    assignedRoute: 'ROUTE_A',
    isDemoVehicle: false,
    battery: '91%',
    fuelLevel: '58%',
    lastGpsUpdate: '5s ago',
    riskLevel: 'MEDIUM',
    routeHistory: [
      { time: '07:00 AM', event: 'Loaded at Tezpur Relief Depot' },
      { time: '10:00 AM', event: 'Encountered 0.4m water logging at Sector 3' }
    ]
  },
  {
    id: 'TRUCK-19',
    registration: 'MN-01-T-9043',
    name: 'Mahindra Bolero Maxi-Truck 4x4',
    driverName: 'N. Sanatomba Singh',
    driverPhone: '+91 96120 77123',
    cargo: 'Emergency Whole Blood & Plasma Units',
    cargoType: 'Critical Bio-Supply',
    cargoWeight: '1.1 Tonnes',
    priority: 'CRITICAL',
    tempRequirement: '+4°C Cold Storage',
    currentTemp: '+3.8°C',
    origin: 'RIMS Blood Bank, Imphal',
    destination: 'Moreh Sub-Divisional Hospital',
    currentLocationName: 'NH-102 near Pallel Checkpoint',
    coordinates: [24.4560, 94.0840],
    speed: 55,
    heading: 130,
    eta: '1h 20m',
    progressPct: 62,
    status: 'IN_TRANSIT',
    networkStatus: 'ONLINE_4G',
    activeCorridorId: 'corridor-nh102',
    assignedRoute: 'NH102',
    isDemoVehicle: false,
    battery: '99%',
    fuelLevel: '82%',
    lastGpsUpdate: 'Just now',
    riskLevel: 'LOW',
    routeHistory: [
      { time: '09:00 AM', event: 'Dispatch authorized by Imphal Command' },
      { time: '09:50 AM', event: 'Passed Kakching junction' }
    ]
  }
];

