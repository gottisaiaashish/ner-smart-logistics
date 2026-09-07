/**
 * Real Geographic Data for North Eastern Region (NER), India
 * Includes Key Highway Corridors (Route A, Route B, Route C), River Gauges, Weather Sensors, and Landslide Hotspots
 */

export const NER_CENTER = [25.75, 92.5]; // Center coordinates covering Assam, Meghalaya, etc.
export const NER_DEFAULT_ZOOM = 8;

export const NER_REGIONS = [
  { id: 'AS', name: 'Assam', center: [26.2006, 92.9376] },
  { id: 'ML', name: 'Meghalaya', center: [25.4670, 91.3662] },
  { id: 'AR', name: 'Arunachal Pradesh', center: [28.2180, 94.7278] },
  { id: 'MN', name: 'Manipur', center: [24.6637, 93.9063] },
  { id: 'MZ', name: 'Mizoram', center: [23.1645, 92.9376] },
  { id: 'NL', name: 'Nagaland', center: [26.1584, 94.5624] },
  { id: 'TR', name: 'Tripura', center: [23.9408, 91.9882] },
  { id: 'SK', name: 'Sikkim', center: [27.5330, 88.5122] }
];

export const CORRIDORS = {
  // ROUTE A — Primary Arterial Highway (Guwahati -> Shillong -> Jowai -> Sonapur -> Silchar via NH-6)
  ROUTE_A: {
    id: 'corridor-route-a',
    code: 'ROUTE_A',
    name: 'ROUTE A — Primary Corridor (NH-6)',
    shortName: 'Route A (NH-6 Arterial)',
    distanceKm: 315,
    distanceStr: '315 km',
    normalDuration: '7h 45m',
    normalEtaMinutes: 465,
    baseRiskScore: 18,
    criticalChokePoint: 'Sonapur Tunnel & Khliehriat Cut (Km 142)',
    vulnerabilityProfile: 'High slope shear vulnerability; severe torrential inundation prone',
    waypoints: [
      [26.1445, 91.7362], // Guwahati Central Depot (Origin)
      [25.9610, 91.8845], // Nongpoh
      [25.5788, 91.8933], // Shillong Hub
      [25.4520, 92.2030], // Jowai
      [25.1840, 92.3560], // Khliehriat
      [25.1120, 92.3850], // Sonapur Tunnel (Critical Landslide Zone)
      [24.9750, 92.5420], // Kalain
      [24.8333, 92.7789]  // Silchar District Hospital (Destination)
    ],
    vulnerabilities: ['Sonapur Mudslides', 'Heavy Monsoon Inundation', 'Slope Incline Shear']
  },

  // ROUTE B — AI Safe Alternate (Guwahati -> Nagaon -> Lumding -> Umrangso -> Harangajao -> Silchar via NH-27/SH-12)
  ROUTE_B: {
    id: 'corridor-route-b',
    code: 'ROUTE_B',
    name: 'ROUTE B — AI Safe Alternate (NH-27 / Umrangso Bypass)',
    shortName: 'Route B (AI Safe Alternate)',
    distanceKm: 348,
    distanceStr: '348 km (+33 km / 48 km bypass delta)',
    normalDuration: '8h 20m',
    normalEtaMinutes: 500,
    baseRiskScore: 14,
    criticalChokePoint: 'Umrangso Ridge (Reinforced Rock Formation)',
    vulnerabilityProfile: 'Stable basalt bedrock; all-weather culverts and bypass bridges',
    waypoints: [
      [26.1445, 91.7362], // Guwahati
      [26.1820, 92.0540], // Jagiroad
      [26.3450, 92.6840], // Nagaon Bypass
      [26.1280, 93.0320], // Dabaka
      [25.7510, 93.1750], // Lumding Ridge
      [25.4120, 92.9820], // Umrangso Valley (Stable Rock Structure)
      [25.1820, 92.8120], // Harangajao
      [24.8333, 92.7789]  // Silchar
    ],
    vulnerabilities: ['Occasional Heavy Morning Fog at Ridge']
  },

  // ROUTE C — Emergency Northern Ridge Backup (Guwahati -> Tezpur -> Golaghat -> Dimapur -> Silchar)
  ROUTE_C: {
    id: 'corridor-route-c',
    code: 'ROUTE_C',
    name: 'ROUTE C — Emergency Northern Ridge Bypass',
    shortName: 'Route C (Emergency Bypass)',
    distanceKm: 380,
    distanceStr: '380 km (+65 km contingency)',
    normalDuration: '9h 10m',
    normalEtaMinutes: 550,
    baseRiskScore: 28,
    criticalChokePoint: 'Karbi Anglong Hill Crossing',
    vulnerabilityProfile: 'Longer transit buffer, reinforced highway, higher fuel consumption',
    waypoints: [
      [26.1445, 91.7362], // Guwahati
      [26.4500, 92.4000], // Morigaon North
      [26.6500, 92.7900], // Tezpur River Bridge
      [26.5200, 93.9700], // Golaghat
      [25.9000, 93.7300], // Dimapur Approach
      [25.4500, 93.2000], // Haflong East
      [24.8333, 92.7789]  // Silchar
    ],
    vulnerabilities: ['Long transit distance (+65 km)', 'Higher fuel consumption']
  },

  // NH-102: Imphal -> Thoubal -> Moreh Border Corridor
  NH102_MANIPUR: {
    id: 'corridor-nh102',
    code: 'NH102',
    name: 'NH-102 (Imphal - Pallel - Moreh Border)',
    shortName: 'NH-102 Border Lifeline',
    distanceKm: 110,
    distanceStr: '110 km',
    normalDuration: '3h 15m',
    normalEtaMinutes: 195,
    baseRiskScore: 16,
    criticalChokePoint: 'Pallel Military Checkpoint',
    vulnerabilityProfile: 'Hill terrain curves, high security corridor',
    waypoints: [
      [24.8170, 93.9368], // Imphal Transit Base
      [24.6420, 93.9920], // Thoubal
      [24.5240, 94.0280], // Kakching
      [24.4560, 94.0840], // Pallel Checkpoint
      [24.2450, 94.3050]  // Moreh border depot
    ],
    vulnerabilities: ['Hill terrain narrow curves']
  },

  // Sela Pass NH-13 Arunachal Strategic Route
  NH13_SELA: {
    id: 'corridor-nh13-sela',
    code: 'NH13',
    name: 'NH-13 (Bhalukpong - Bomdila - Sela Pass - Tawang)',
    shortName: 'NH-13 High Altitude Corridor',
    distanceKm: 280,
    distanceStr: '280 km',
    normalDuration: '9h 30m',
    normalEtaMinutes: 570,
    baseRiskScore: 68,
    criticalChokePoint: 'Sela Pass Elevation 13,700 ft',
    vulnerabilityProfile: 'Sub-zero icing, rockfall hazard, high-altitude blizzard',
    waypoints: [
      [27.0120, 92.6500], // Bhalukpong Gate
      [27.2640, 92.4200], // Bomdila
      [27.3820, 92.2340], // Dirang
      [27.5050, 92.1020], // Sela Pass
      [27.5860, 91.8650]  // Tawang Hospital Depot
    ],
    vulnerabilities: ['Sub-zero icing', 'Rockfall hazard', 'High-altitude blizzard']
  }
};

export const DISASTER_ZONES = [
  {
    id: 'zone-flood-brahmaputra',
    type: 'FLOOD',
    name: 'Brahmaputra Lowland Inundation Zone',
    severity: 'WARNING',
    riskScore: 78,
    riverLevel: '+2.85m above danger mark',
    polygon: [
      [26.25, 91.50],
      [26.38, 92.10],
      [26.45, 92.90],
      [26.28, 93.15],
      [26.10, 92.70],
      [26.08, 91.80]
    ],
    color: '#0284c7',
    fillColor: '#0284c7',
    fillOpacity: 0.28
  },
  {
    id: 'zone-landslide-sonapur',
    type: 'LANDSLIDE',
    name: 'Sonapur-Khliehriat Critical Landslide Hotspot',
    severity: 'CRITICAL',
    riskScore: 92,
    rainfallRate: '46.4 mm/hr (Heavy Torrential)',
    polygon: [
      [25.19, 92.25],
      [25.26, 92.42],
      [25.05, 92.48],
      [24.98, 92.32]
    ],
    color: '#f43f5e',
    fillColor: '#e11d48',
    fillOpacity: 0.38
  },
  {
    id: 'zone-flood-barak',
    type: 'FLOOD',
    name: 'Barak River Basin Inundation Zone',
    severity: 'ELEVATED',
    riskScore: 68,
    riverLevel: '+1.40m over baseline',
    polygon: [
      [24.92, 92.60],
      [24.98, 92.85],
      [24.78, 92.92],
      [24.72, 92.68]
    ],
    color: '#0ea5e9',
    fillColor: '#0ea5e9',
    fillOpacity: 0.22
  }
];

export const RIVER_GAUGES = [
  { id: 'gauge-sonapur', name: 'Sonapur River Gauge Stn 04', corridor: 'NH-6', lat: 25.1120, lng: 92.3850, dangerMark: 14.5, currentLevel: 16.22, unit: 'm', status: 'DANGER' },
  { id: 'gauge-kopili', name: 'Kopili River Umrangso Station', corridor: 'Route B', lat: 25.4120, lng: 92.9820, dangerMark: 12.0, currentLevel: 8.45, unit: 'm', status: 'SAFE' },
  { id: 'gauge-barak', name: 'Barak River Annapurna Ghat', corridor: 'Silchar Terminal', lat: 24.8333, lng: 92.7789, dangerMark: 19.8, currentLevel: 18.20, unit: 'm', status: 'ELEVATED' }
];

export const WEATHER_OBSERVATIONS = [
  { station: 'Guwahati Air Hub', temp: '27.4°C', cond: 'Moderate Rain', rainfall24h: '38 mm', wind: '18 km/h ENE', humidity: '92%' },
  { station: 'Shillong Plateau', temp: '17.8°C', cond: 'Dense Fog & Mist', rainfall24h: '52 mm', wind: '12 km/h SE', humidity: '98%' },
  { station: 'Sonapur Valley', temp: '24.2°C', cond: 'Torrential Downpour', rainfall24h: '94 mm', wind: '28 km/h S', humidity: '99%' },
  { station: 'Silchar Station', temp: '29.1°C', cond: 'Overcast & Humid', rainfall24h: '41 mm', wind: '8 km/h NW', humidity: '94%' },
  { station: 'Tawang Base', temp: '4.2°C', cond: 'Freezing Drizzle', rainfall24h: '16 mm', wind: '34 km/h N', humidity: '85%' }
];

