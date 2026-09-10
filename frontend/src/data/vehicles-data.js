/**
 * Active Logistics Fleet Data for NER Command Center
 * Starts clean with checkpost dispatched units
 */

export const INITIAL_VEHICLES = [
  {
    id: 'TRUCK-07',
    vehicleId: 'TRUCK-07',
    name: 'BharatBenz 1617 Heavy Cargo (Cold Chain)',
    portCode: 'PORT-7890',
    registration: 'AS-01-EC-4492',
    driverName: 'Ranjit Borah',
    driverPhone: '+91 98640 12894',
    cargo: 'Emergency Vaccines & Anti-Venom Kits',
    cargoType: 'Cold-Chain Medical',
    cargoWeight: '3.4 Tonnes',
    priority: 'CRITICAL',
    tempRequirement: '-20°C to -15°C',
    currentTemp: '-18.4°C (Nominal)',
    origin: 'Khanapara Staging Hub, Guwahati',
    destination: 'Silchar District Civil Hospital',
    currentLocationName: 'Khanapara Staging Hub',
    coordinates: [26.11586, 91.8016],
    originGps: [26.11586, 91.8016],
    destGps: [24.83297, 92.77909],
    speed: 48,
    heading: 145,
    eta: '4h 15m',
    progressPct: 0,
    currentWaypointIdx: 0,
    status: 'IN_TRANSIT',
    networkStatus: 'ONLINE_4G',
    activeCorridorId: 'corridor-route-a',
    assignedRoute: 'ROUTE_A',
    isDemoVehicle: true,
    battery: '98%',
    fuelLevel: '92%',
    lastGpsUpdate: 'Just now',
    riskLevel: 'LOW',
    routeHistory: [
      { time: 'Just now', event: 'Vehicle cleared at checkpost. Port code PORT-7890 active.' }
    ]
  }
];

