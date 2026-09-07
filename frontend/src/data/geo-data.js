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
  // ROUTE A — Primary Arterial Highway (Dense 24 Waypoints for Smooth Progressive Movement)
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
      [26.1445, 91.7362], // 0: Guwahati Central Staging Depot
      [26.0820, 91.8020], // 1: Khanapara Checkpost Gate
      [26.0120, 91.8450], // 2: Jorabat Mountain Incline
      [25.9610, 91.8845], // 3: Nongpoh Valley Waypoint
      [25.8850, 91.8720], // 4: Umling Highway Rest Stop
      [25.7920, 91.8890], // 5: Umsning Expressway Node
      [25.6840, 91.9020], // 6: Umiam Lake Bridge
      [25.6120, 91.8950], // 7: Mawlai North Gate
      [25.5788, 91.8933], // 8: Shillong Central Hub
      [25.5420, 91.9650], // 9: Laitkor Peak Ascent
      [25.5120, 92.0520], // 10: Mawryngkneng Junction
      [25.4850, 92.1250], // 11: Wahiajer Valley
      [25.4650, 92.1680], // 12: Ummulong Bypass
      [25.4520, 92.2030], // 13: Jowai Chokepoint & Diversion Hub (SH-6)
      [25.3620, 92.2780], // 14: Ladrymbai Coal Belt
      [25.1840, 92.3560], // 15: Khliehriat Cut (SH-17 Link)
      [25.1480, 92.3720], // 16: Lumshnong Limestone Pass
      [25.1120, 92.3850], // 17: Sonapur Tunnel (High Landslide Hotspot)
      [25.0450, 92.4420], // 18: Malidhar Border Post
      [24.9950, 92.4980], // 19: Gumra Valley
      [24.9750, 92.5420], // 20: Kalain River Causeway
      [24.9250, 92.6250], // 21: Bhaga Interchange
      [24.8720, 92.7120], // 22: Silchar North Outskirts
      [24.8333, 92.7789]  // 23: Silchar District Civil Hospital (Destination)
    ],
    vulnerabilities: ['Sonapur Mudslides', 'Heavy Monsoon Inundation', 'Slope Incline Shear']
  },

  // ROUTE B — AI Safe Alternate (Dense 24 Waypoints via Umrangso Bedrock)
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
      [26.1445, 91.7362], // 0: Guwahati Central Depot
      [26.1150, 91.8420], // 1: Khanapara East
      [26.1620, 91.9540], // 2: Sonapur Assam Expressway
      [26.1820, 92.0540], // 3: Jagiroad Paper Mill Crossing
      [26.2450, 92.2150], // 4: Dharamtul Highway Sector
      [26.2950, 92.3920], // 5: Raha Toll Plaza
      [26.3450, 92.6840], // 6: Nagaon Central Bypass
      [26.2420, 92.8650], // 7: Kathiatoli Junction
      [26.1280, 93.0320], // 8: Dabaka Checkpost
      [26.0120, 93.0950], // 9: Hojai Agriculture Belt
      [25.8920, 93.1350], // 10: Lanka Rail Crossing
      [25.7510, 93.1750], // 11: Lumding Junction Ridge
      [25.6350, 93.1420], // 12: Langting Hill Pass
      [25.5420, 93.0850], // 13: Hatikhali Causeway
      [25.4850, 93.0250], // 14: Mahur Reinforced Bridge
      [25.4120, 92.9820], // 15: Umrangso Safe Rock Valley (Basalt Formation)
      [25.3250, 92.9120], // 16: Gunjung Mountain Pass
      [25.2420, 92.8540], // 17: Jatinga Cloud Valley
      [25.1820, 92.8120], // 18: Harangajao Valley Bridge
      [25.0850, 92.7950], // 19: Ditokcherra Reinforced Tunnel
      [25.0120, 92.7820], // 20: Bandarkhal Causeway
      [24.9450, 92.7750], // 21: Damcherra Approach
      [24.8850, 92.7680], // 22: Silchar North Gate
      [24.8333, 92.7789]  // 23: Silchar District Civil Hospital
    ],
    vulnerabilities: ['Occasional Heavy Morning Fog at Ridge']
  },

  // ROUTE B DIVERSION — Mid-Corridor Connector from Jowai across to Umrangso onto Route B (Dense 24 Points)
  ROUTE_B_DIVERSION: {
    id: 'corridor-route-b-div',
    code: 'ROUTE_B_DIVERSION',
    name: 'AI Dynamic Reroute (Jowai ↔ Umrangso Safe Rock Bypass)',
    shortName: 'AI Dynamic Reroute (Umrangso Bypass)',
    distanceKm: 326,
    distanceStr: '326 km bypass',
    normalDuration: '7h 55m',
    baseRiskScore: 15,
    waypoints: [
      [26.1445, 91.7362], // 0: Guwahati Depot
      [26.0820, 91.8020], // 1: Khanapara
      [26.0120, 91.8450], // 2: Jorabat
      [25.9610, 91.8845], // 3: Nongpoh
      [25.8850, 91.8720], // 4: Umling
      [25.7920, 91.8890], // 5: Umsning
      [25.6840, 91.9020], // 6: Umiam
      [25.6120, 91.8950], // 7: Mawlai
      [25.5788, 91.8933], // 8: Shillong Hub
      [25.5420, 91.9650], // 9: Laitkor Peak
      [25.5120, 92.0520], // 10: Mawryngkneng
      [25.4850, 92.1250], // 11: Wahiajer
      [25.4650, 92.1680], // 12: Ummulong
      [25.4520, 92.2030], // 13: Jowai Diversion Junction (Turn onto SH-6)
      [25.5150, 92.3120], // 14: Nartiang Monolith Pass
      [25.5850, 92.4850], // 15: Khanduli Border Post
      [25.5420, 92.6850], // 16: Sahsniang Ridge Road
      [25.4850, 92.8420], // 17: Kopili Dam Reservoir Causeway
      [25.4120, 92.9820], // 18: Umrangso Safe Rock Valley
      [25.2850, 92.8850], // 19: Gunjung Bypass
      [25.1820, 92.8120], // 20: Harangajao Bridge
      [25.0450, 92.7850], // 21: Ditokcherra Section
      [24.9250, 92.7650], // 22: Silchar Bypass Road
      [24.8333, 92.7789]  // 23: Silchar District Hospital
    ]
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

  // CONNECTOR 1: Jowai -> Nartiang -> Khanduli -> Umrangso Cross-Ridge Connector (SH-6)
  CONNECTOR_JOWAI_UMRANGSO: {
    id: 'corridor-conn-jowai-umrangso',
    code: 'CONN_JOWAI_UMRANGSO',
    name: 'Jowai-Umrangso Cross-Ridge Connector (SH-6)',
    shortName: 'Jowai ↔ Umrangso Link',
    distanceKm: 88,
    distanceStr: '88 km cross-link',
    normalDuration: '2h 10m',
    baseRiskScore: 16,
    waypoints: [
      [25.4520, 92.2030], // Jowai (Route A)
      [25.5680, 92.4200], // Nartiang Monolith Junction
      [25.6400, 92.6800], // Khanduli Border Post
      [25.4120, 92.9820]  // Umrangso (Route B)
    ]
  },

  // CONNECTOR 2: Khliehriat -> Saipung -> Harangajao Mountain Cut (SH-17 Bypass)
  CONNECTOR_KHLIEHRIAT_HARANGAJAO: {
    id: 'corridor-conn-khliehriat-harangajao',
    code: 'CONN_KHLIEHRIAT_HARANGAJAO',
    name: 'Khliehriat-Saipung-Harangajao Cut (SH-17)',
    shortName: 'Khliehriat ↔ Harangajao Cut',
    distanceKm: 72,
    distanceStr: '72 km mountain cut',
    normalDuration: '1h 50m',
    baseRiskScore: 19,
    waypoints: [
      [25.1840, 92.3560], // Khliehriat (Route A)
      [25.3200, 92.6100], // Saipung Reserve Post
      [25.1820, 92.8120]  // Harangajao (Route B)
    ]
  },

  // CONNECTOR 3: Shillong -> Mawlasnai -> Jagiroad Cross-Valley Link
  CONNECTOR_SHILLONG_JAGIROAD: {
    id: 'corridor-conn-shillong-jagiroad',
    code: 'CONN_SHILLONG_JAGIROAD',
    name: 'Shillong-Mawlasnai-Jagiroad Link (SH-3)',
    shortName: 'Shillong ↔ Jagiroad Valley Link',
    distanceKm: 94,
    distanceStr: '94 km valley link',
    normalDuration: '2h 25m',
    baseRiskScore: 15,
    waypoints: [
      [25.5788, 91.8933], // Shillong (Route A)
      [25.8200, 92.0100], // Mawlasnai Pass
      [26.1820, 92.0540]  // Jagiroad (Route B)
    ]
  },

  // CONNECTOR 4: Lumding -> Haflong -> Dimapur Lateral
  CONNECTOR_LUMDING_DIMAPUR: {
    id: 'corridor-conn-lumding-dimapur',
    code: 'CONN_LUMDING_DIMAPUR',
    name: 'Lumding-Haflong-Dimapur Ridge Arterial',
    shortName: 'Lumding ↔ Dimapur Ridge',
    distanceKm: 82,
    distanceStr: '82 km ridge arterial',
    normalDuration: '1h 45m',
    baseRiskScore: 20,
    waypoints: [
      [25.7510, 93.1750], // Lumding (Route B)
      [25.4500, 93.2000], // Haflong East (Route C)
      [25.9000, 93.7300]  // Dimapur (Route C)
    ]
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

