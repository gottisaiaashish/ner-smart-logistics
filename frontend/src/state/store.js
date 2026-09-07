/**
 * Reactive Central State Store for NER Smart Logistics Command & Control
 * Connects Environment Variables -> Road Conditions -> AI Risk Engine -> Route Scoring -> Fleet Dispatch -> Driver Hub
 */

import { INITIAL_VEHICLES } from '../data/vehicles-data.js';
import { INITIAL_ALERTS, INITIAL_TIMELINE, INITIAL_FIELD_REPORTS, INITIAL_DELIVERIES } from '../data/mock-state.js';
import { CORRIDORS, DISASTER_ZONES, RIVER_GAUGES } from '../data/geo-data.js';
import { socketClient } from './socket-client.js';
import { sounds } from '../audio/sound-effects.js';

const STORAGE_KEY = 'NER_LOGISTICS_STATE_V2';

export const USER_ROLES = {
  CONTROL_ROOM: 'CONTROL_ROOM',
  DRIVER: 'DRIVER',
  FIELD_OFFICER: 'FIELD_OFFICER',
  MISSION_LAUNCH: 'MISSION_LAUNCH'
};

export const PRESET_CREDENTIALS = [
  {
    username: 'control_room',
    password: 'password123',
    role: USER_ROLES.CONTROL_ROOM,
    name: 'Command Officer A. Bhattacharya',
    badge: 'NER-DISPATCH-01',
    hub: 'State Disaster Emergency Operations Center, Guwahati'
  },
  {
    username: 'driver_07',
    password: 'password123',
    role: USER_ROLES.DRIVER,
    name: 'Ranjit Borah',
    badge: 'FLEET-DRV-07',
    vehicleId: 'TRUCK-07',
    phone: '+91 98640 12894'
  },
  {
    username: 'field_officer',
    password: 'password123',
    role: USER_ROLES.FIELD_OFFICER,
    name: 'Inspector D. Sangma',
    badge: 'ML-POL-882',
    sector: 'Meghalaya East Jaintia Hills Sector'
  },
  {
    username: 'mission_commander',
    password: 'password123',
    role: USER_ROLES.MISSION_LAUNCH,
    name: 'Commander S. Roy',
    badge: 'C2-LAUNCH-99',
    hub: 'Tactical Mission Dispatch & Point Launcher'
  }
];

export const SCENARIO_PRESETS = {
  NORMAL: {
    id: 'NORMAL',
    name: 'NORMAL CONDITIONS',
    description: 'Dry pavement, seasonal mountain winds, optimal corridor transit.',
    env: {
      rainfall: 4.2,
      temperature: 24.5,
      humidity: 58,
      windSpeed: 12,
      windDirection: 'ENE',
      visibility: 14.5,
      riverWaterLevel: 0.15,
      floodSeverity: 'NONE',
      landslideProb: 8,
      roadSurfaceCondition: 'DRY',
      trafficDensity: 'LOW',
      roadDamageSeverity: 'NONE',
      bridgeAccessibility: '100% OPEN',
      networkConnectivity: 'ONLINE_4G_5G'
    }
  },
  HEAVY_MONSOON: {
    id: 'HEAVY_MONSOON',
    name: 'HEAVY MONSOON',
    description: 'Torrential cloudburst over Meghalaya ridge, rapid soil saturation.',
    env: {
      rainfall: 48.6,
      temperature: 20.2,
      humidity: 96,
      windSpeed: 38,
      windDirection: 'SSW',
      visibility: 1.8,
      riverWaterLevel: 1.85,
      floodSeverity: 'SEVERE',
      landslideProb: 76,
      roadSurfaceCondition: 'MUD_DEBRIS',
      trafficDensity: 'HEAVY',
      roadDamageSeverity: 'STRUCTURAL',
      bridgeAccessibility: 'SINGLE_LANE',
      networkConnectivity: 'ONLINE_4G_5G'
    }
  },
  FLASH_FLOOD: {
    id: 'FLASH_FLOOD',
    name: 'FLASH FLOOD',
    description: 'Brahmaputra & Barak lowlands overtopping causeways and culverts.',
    env: {
      rainfall: 62.4,
      temperature: 21.0,
      humidity: 98,
      windSpeed: 44,
      windDirection: 'S',
      visibility: 1.2,
      riverWaterLevel: 2.95,
      floodSeverity: 'CATASTROPHIC',
      landslideProb: 65,
      roadSurfaceCondition: 'IMPASSABLE',
      trafficDensity: 'CONGESTED',
      roadDamageSeverity: 'WASHOUT',
      bridgeAccessibility: 'SUBMERGED',
      networkConnectivity: 'DEGRADED_MESH'
    }
  },
  LANDSLIDE: {
    id: 'LANDSLIDE',
    name: 'LANDSLIDE',
    description: 'Severe slope shear failure at Sonapur (Km 142), 1.8m mud & boulder ingress.',
    env: {
      rainfall: 54.0,
      temperature: 19.5,
      humidity: 94,
      windSpeed: 32,
      windDirection: 'SE',
      visibility: 2.4,
      riverWaterLevel: 1.45,
      floodSeverity: 'MODERATE',
      landslideProb: 94,
      roadSurfaceCondition: 'IMPASSABLE',
      trafficDensity: 'GRIDLOCK',
      roadDamageSeverity: 'CRITICAL',
      bridgeAccessibility: 'CLOSED',
      networkConnectivity: 'ONLINE_4G_5G'
    }
  },
  ROAD_BLOCKED: {
    id: 'ROAD_BLOCKED',
    name: 'ROAD BLOCKED',
    description: 'Total dual-carriageway obstruction on NH-6 arterial corridor.',
    env: {
      rainfall: 42.0,
      temperature: 22.0,
      humidity: 90,
      windSpeed: 28,
      windDirection: 'SSE',
      visibility: 3.5,
      riverWaterLevel: 1.20,
      floodSeverity: 'MODERATE',
      landslideProb: 88,
      roadSurfaceCondition: 'IMPASSABLE',
      trafficDensity: 'GRIDLOCK',
      roadDamageSeverity: 'CRITICAL',
      bridgeAccessibility: 'CLOSED',
      networkConnectivity: 'ONLINE_4G_5G'
    }
  },
  EXTREME_WEATHER: {
    id: 'EXTREME_WEATHER',
    name: 'EXTREME WEATHER',
    description: 'High altitude freezing squall, zero visibility, blizzard icing at passes.',
    env: {
      rainfall: 72.5,
      temperature: 1.5,
      humidity: 99,
      windSpeed: 68,
      windDirection: 'N',
      visibility: 0.4,
      riverWaterLevel: 2.10,
      floodSeverity: 'SEVERE',
      landslideProb: 82,
      roadSurfaceCondition: 'IMPASSABLE',
      trafficDensity: 'GRIDLOCK',
      roadDamageSeverity: 'CRITICAL',
      bridgeAccessibility: 'CLOSED',
      networkConnectivity: 'DEGRADED_MESH'
    }
  },
  NETWORK_FAILURE: {
    id: 'NETWORK_FAILURE',
    name: 'NETWORK FAILURE',
    description: 'Optical fiber trunk severed in Dima Hasao; sat-mesh fallback engaged.',
    env: {
      rainfall: 22.0,
      temperature: 23.0,
      humidity: 78,
      windSpeed: 18,
      windDirection: 'E',
      visibility: 8.0,
      riverWaterLevel: 0.60,
      floodSeverity: 'LOW',
      landslideProb: 35,
      roadSurfaceCondition: 'WET',
      trafficDensity: 'MODERATE',
      roadDamageSeverity: 'MINOR',
      bridgeAccessibility: '100% OPEN',
      networkConnectivity: 'OFFLINE_BLACKOUT'
    }
  },
  RECOVERY: {
    id: 'RECOVERY',
    name: 'RECOVERY',
    description: 'Rainfall receding, SDRF clearance in progress, mesh syncing restored.',
    env: {
      rainfall: 8.5,
      temperature: 25.0,
      humidity: 68,
      windSpeed: 14,
      windDirection: 'NE',
      visibility: 11.0,
      riverWaterLevel: 0.45,
      floodSeverity: 'LOW',
      landslideProb: 22,
      roadSurfaceCondition: 'WET',
      trafficDensity: 'MODERATE',
      roadDamageSeverity: 'MINOR',
      bridgeAccessibility: '100% OPEN',
      networkConnectivity: 'ONLINE_4G_5G'
    }
  }
};

class Store {
  constructor() {
    this.listeners = new Set();
    this.state = this.loadInitialState();

    // Initialize real-time WebSocket connection to backend
    socketClient.connect((serverState) => {
      this.handleServerStateSync(serverState);
    });

    // Cross-tab sync
    window.addEventListener('storage', (e) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          this.state = JSON.parse(e.newValue);
          this.notify();
        } catch (err) {
          console.error('Storage sync error', err);
        }
      }
    });
  }

  handleServerStateSync(serverState) {
    if (!serverState) return;
    if (serverState.environment) this.state.environment = { ...this.state.environment, ...serverState.environment };
    if (serverState.activeScenarioPreset) this.state.activeScenarioPreset = serverState.activeScenarioPreset;
    if (serverState.environmentLastUpdated) this.state.environmentLastUpdated = serverState.environmentLastUpdated;
    if (serverState.targetedPin) this.state.targetedPin = serverState.targetedPin;
    if (serverState.customMissions) this.state.customMissions = serverState.customMissions;
    if (serverState.timeline) this.state.timeline = serverState.timeline;
    if (serverState.pttFeed && serverState.pttFeed.length > 0) {
      const latestMsg = serverState.pttFeed[0];
      const isNew = !this.lastPlayedPttId || this.lastPlayedPttId !== latestMsg.id;
      
      this.state.driverContext.pttIncomingMessage = latestMsg;
      this.state.driverContext.pttState = 'RECEIVED';
      this.state.driverContext.pttHistory = serverState.pttFeed;

      if (isNew) {
        this.lastPlayedPttId = latestMsg.id;
        sounds.playPttPress();
        setTimeout(() => {
          sounds.speakDispatch(`${latestMsg.sender}: ${latestMsg.text}`);
        }, 100);
      }
    }
    if (serverState.vehicles && Array.isArray(serverState.vehicles)) {
      serverState.vehicles.forEach(sv => {
        const targetId = sv.id || sv.vehicleId;
        const idx = this.state.vehicles.findIndex(v => (v.id && v.id === targetId) || (v.vehicleId && v.vehicleId === targetId) || (v.portCode && sv.portCode && v.portCode === sv.portCode));
        if (idx !== -1) {
          this.state.vehicles[idx] = { ...this.state.vehicles[idx], ...sv };
        } else {
          this.state.vehicles.unshift(sv);
        }
      });
    }
    this.recalculateAIEngine();
    this.notify();
  }

  loadInitialState() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.environment && parsed.routesEvaluation) {
          if (!parsed.targetedPin) {
            parsed.targetedPin = {
              lat: 25.1120,
              lng: 92.3850,
              label: 'Sonapur Chokepoint (Km 142)',
              sector: 'Meghalaya East Jaintia Hills'
            };
          }
          if (!parsed.customMissions) {
            parsed.customMissions = [];
          }
          // Sanitize & fix vehicle IDs and remove broken 'undefined' entries
          if (parsed.vehicles) {
            parsed.vehicles = parsed.vehicles
              .filter(v => v && v.id !== 'undefined' && v.vehicleId !== 'undefined')
              .map((v, idx) => {
                const vid = v.id || v.vehicleId || `TRUCK-${String(idx + 1).padStart(2, '0')}`;
                return {
                  ...v,
                  id: vid,
                  vehicleId: vid,
                  name: vid,
                  priority: v.priority || v.cargoPriority || 'CRITICAL'
                };
              });
          }
          return parsed;
        }
      } catch (e) {
        console.warn('Initializing fresh state v2');
      }
    }

    // Default Fresh Environment State
    const defaultEnv = { ...SCENARIO_PRESETS.HEAVY_MONSOON.env };

    const initialVehicles = JSON.parse(JSON.stringify(INITIAL_VEHICLES));
    const initialAlerts = JSON.parse(JSON.stringify(INITIAL_ALERTS));
    const initialTimeline = JSON.parse(JSON.stringify(INITIAL_TIMELINE));
    const initialFieldReports = JSON.parse(JSON.stringify(INITIAL_FIELD_REPORTS));
    const initialDeliveries = JSON.parse(JSON.stringify(INITIAL_DELIVERIES));

    const stateObj = {
      currentUser: null,
      activeScenarioPreset: 'HEAVY_MONSOON',
      environment: defaultEnv,
      environmentLastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      
      // Global System Connectivity
      systemHealth: {
        satellite: 'ONLINE',
        weatherApi: 'CONNECTED',
        routingEngine: 'ONLINE',
        aiEngine: '94.6% CONF',
        gpsNetwork: 'LIVE',
        database: 'SYNCED'
      },

      vehicles: initialVehicles,
      alerts: initialAlerts,
      timeline: initialTimeline,
      fieldReports: initialFieldReports,
      deliveries: initialDeliveries,

      // Evaluated Multiple Routes
      routesEvaluation: {
        recommendedRouteId: 'ROUTE_B',
        routeA: {
          id: 'ROUTE_A',
          name: 'Route A — Primary Corridor (NH-6)',
          distance: '315 km',
          eta: '7h 45m',
          etaMinutes: 465,
          riskPct: 84,
          status: 'UNSAFE', // OPTIMAL, MONITORED, ELEVATED, UNSAFE, BLOCKED
          badgeColor: 'rose',
          chokePoint: 'Sonapur Tunnel & Khliehriat Cut'
        },
        routeB: {
          id: 'ROUTE_B',
          name: 'Route B — AI Safe Alternate (NH-27 / Umrangso)',
          distance: '348 km (+33 km delta)',
          eta: '8h 20m (+35m)',
          etaMinutes: 500,
          riskPct: 22,
          status: 'RECOMMENDED',
          badgeColor: 'emerald',
          chokePoint: 'Umrangso Valley (Reinforced Bedrock)'
        },
        routeC: {
          id: 'ROUTE_C',
          name: 'Route C — Emergency Northern Ridge Bypass',
          distance: '380 km (+65 km)',
          eta: '9h 10m (+85m)',
          etaMinutes: 550,
          riskPct: 34,
          status: 'BACKUP',
          badgeColor: 'purple',
          chokePoint: 'Karbi Anglong Hill Crossing'
        }
      },

      // AI Accessibility Intelligence
      aiIntelligence: {
        accessibilityRiskPct: 84,
        riskLevel: 'HIGH_RISK',
        statusLabel: 'CRITICAL ACCESSIBILITY RISK',
        corridorId: 'corridor-route-a',
        corridorName: 'NH-6 (Guwahati - Shillong - Silchar Arterial)',
        confidenceScore: 94.6,
        timeToCutoffMinutes: 18,
        predictionText: 'Current corridor may become fully inaccessible within 18 minutes due to active slope shear failure and mud debris accumulation.',
        recommendation: 'Immediate reroute of Priority 1 Cold-Chain Unit TRUCK-07 via Route B (Umrangso Safe Bypass).',
        factors: [
          { name: 'Torrential Precipitation', value: '48.6 mm/hr', weightPct: 24, delta: '+24%', severity: 'critical' },
          { name: 'Slope Instability (Shear Strain)', value: 'Critical (Sonapur)', weightPct: 22, delta: '+22%', severity: 'critical' },
          { name: 'River Water Gauge Level', value: '+1.85m Above Base', weightPct: 18, delta: '+18%', severity: 'high' },
          { name: 'Road Surface Degradation', value: 'Heavy Mud & Debris', weightPct: 15, delta: '+15%', severity: 'high' },
          { name: 'Traffic Gridlock Risk', value: 'Congealed Bottleneck', weightPct: 12, delta: '+12%', severity: 'medium' },
          { name: 'Bridge Pillar Structural Stress', value: 'Single Lane Restricted', weightPct: 9, delta: '+9%', severity: 'medium' }
        ]
      },

      // Operational Logistics Impact
      logisticsImpact: {
        affectedRoadsCount: 2,
        affectedVehiclesCount: 3,
        delayedDeliveriesCount: 2,
        criticalDeliveriesAtRisk: 1,
        estimatedTotalDelayMin: 45,
        highRiskCorridors: ['NH-6 Meghalaya Sector', 'Sela Pass NH-13'],
        recommendedAction: 'Execute Route B diversion on 3 vehicles to preserve life-saving supply deliveries.'
      },

      // Executive Briefing Summary ("What is Happening Now?")
      executiveSummary: 'Heavy monsoon squall detected across Meghalaya sector (48.6 mm/hr). NH-6 accessibility risk spiked to 84% at Sonapur bottleneck. 3 active transport units affected. AI recommends immediate Route B diversion for TRUCK-07 carrying critical vaccines.',

      // Demo & Simulation States
      simulation: {
        isRunning: false,
        step: 0,
        truck07Rerouted: false,
        truck07AcceptedReroute: false,
        sonapurBlocked: true
      },

      // Driver Context & Push-To-Talk
      driverContext: {
        activeVehicleId: 'TRUCK-07',
        isOfflineMode: false,
        lastSyncedTime: 'Just now',
        pttIncomingMessage: null,
        pttState: 'CONNECTED', // CONNECTED, TRANSMITTING, RECEIVED
        pttHistory: [
          { sender: 'Control Dispatcher', time: '10:48 AM', text: 'TRUCK-07, Sonapur tunnel on NH-6 has reported a 1.8m mudslide. Recommend taking Route B immediately.' },
          { sender: 'Driver (TRUCK-07)', time: '10:49 AM', text: 'Copy Dispatcher. Approaching diversion junction. Awaiting green signal.' }
        ]
      },

      selectedVehicleId: 'TRUCK-07',
      selectedCorridorId: 'corridor-route-a',

      // Point-to-Launch Dynamic Map Missions
      targetedPin: {
        lat: 25.1120,
        lng: 92.3850,
        label: 'Sonapur Chokepoint (Km 142)',
        sector: 'Meghalaya East Jaintia Hills'
      },
      customMissions: [
        {
          id: 'MSN-901',
          type: 'DRONE_RELIEF',
          name: 'Lifeline Cryo-Drone DL-04',
          originGps: [26.1820, 91.7580],
          targetGps: [25.1120, 92.3850],
          status: 'AIRBORNE',
          payload: '40 Vials Anti-Venom & Plasma',
          eta: '22 mins (Direct Flight)',
          speed: '110 km/h',
          battery: '94%'
        }
      ]
    };

    return stateObj;
  }

  save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch (e) {
      console.error('Failed to save state to localStorage', e);
    }
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    this.save();
    for (const listener of this.listeners) {
      try {
        listener(this.state);
      } catch (err) {
        console.error('State subscriber error', err);
      }
    }
  }

  // ==========================================
  // MATHEMATICAL AI RISK ENGINE & CAUSALITY CHAIN
  // ==========================================
  recalculateAIEngine() {
    const env = this.state.environment;
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    this.state.environmentLastUpdated = nowTime;

    // 1. Calculate Route A Risk (Passes Sonapur Landslide Zone)
    let rainRisk = Math.min(100, (env.rainfall / 60) * 100);
    let slideRisk = env.landslideProb;
    let riverRisk = Math.min(100, (env.riverWaterLevel / 2.5) * 100);
    let roadSurfaceRisk = env.roadSurfaceCondition === 'IMPASSABLE' ? 100 : env.roadSurfaceCondition === 'MUD_DEBRIS' ? 80 : env.roadSurfaceCondition === 'DEGRADED' ? 55 : env.roadSurfaceCondition === 'WET' ? 30 : 10;
    let trafficRisk = env.trafficDensity === 'GRIDLOCK' ? 100 : env.trafficDensity === 'CONGESTED' ? 75 : env.trafficDensity === 'HEAVY' ? 55 : env.trafficDensity === 'MODERATE' ? 30 : 10;
    let bridgeRisk = env.bridgeAccessibility === 'CLOSED' ? 100 : env.bridgeAccessibility === 'SUBMERGED' ? 95 : env.bridgeAccessibility === 'SINGLE_LANE' ? 50 : env.bridgeAccessibility === 'WEIGHT_RESTRICTED' ? 35 : 10;

    // Weighted Formula for Route A (Vulnerable to slides and rain)
    const routeARisk = Math.min(100, Math.round(
      (rainRisk * 0.26) +
      (slideRisk * 0.28) +
      (riverRisk * 0.16) +
      (roadSurfaceRisk * 0.14) +
      (trafficRisk * 0.08) +
      (bridgeRisk * 0.08)
    ));

    // Weighted Formula for Route B (Reinforced basalt, minimal landslide vulnerability)
    const routeBRisk = Math.min(100, Math.round(
      (rainRisk * 0.10) +
      (slideRisk * 0.06) +
      (riverRisk * 0.12) +
      (roadSurfaceRisk * 0.10) +
      (trafficRisk * 0.12) +
      (bridgeRisk * 0.05) + 12
    ));

    // Weighted Formula for Route C (Longer ridge transit, higher weather exposure)
    const routeCRisk = Math.min(100, Math.round(
      (rainRisk * 0.18) +
      (slideRisk * 0.12) +
      (riverRisk * 0.10) +
      (roadSurfaceRisk * 0.15) +
      (trafficRisk * 0.10) + 20
    ));

    // Update Route A Evaluation
    this.state.routesEvaluation.routeA.riskPct = routeARisk;
    this.state.routesEvaluation.routeA.status = routeARisk >= 75 ? 'UNSAFE' : routeARisk >= 50 ? 'ELEVATED' : routeARisk >= 30 ? 'MONITORED' : 'OPTIMAL';
    this.state.routesEvaluation.routeA.badgeColor = routeARisk >= 75 ? 'rose' : routeARisk >= 50 ? 'amber' : 'emerald';

    // Update Route B Evaluation
    this.state.routesEvaluation.routeB.riskPct = routeBRisk;
    this.state.routesEvaluation.routeB.status = routeBRisk <= 35 ? 'RECOMMENDED' : routeBRisk <= 60 ? 'SAFE' : 'MONITORED';
    this.state.routesEvaluation.routeB.badgeColor = routeBRisk <= 35 ? 'emerald' : 'cyan';

    // Update Route C Evaluation
    this.state.routesEvaluation.routeC.riskPct = routeCRisk;
    this.state.routesEvaluation.routeC.status = routeCRisk <= 40 ? 'BACKUP' : 'ELEVATED';
    this.state.routesEvaluation.routeC.badgeColor = 'purple';

    // AI Overall Risk Assignment
    this.state.aiIntelligence.accessibilityRiskPct = routeARisk;
    this.state.aiIntelligence.riskLevel = routeARisk >= 70 ? 'HIGH_RISK' : routeARisk >= 40 ? 'MEDIUM' : 'LOW';
    this.state.aiIntelligence.statusLabel = routeARisk >= 70 ? 'CRITICAL ACCESSIBILITY RISK' : routeARisk >= 40 ? 'ELEVATED HAZARD' : 'NOMINAL ACCESS';
    
    // Dynamic Time-to-Cutoff
    const timeCutoff = Math.max(5, Math.round(100 - routeARisk * 0.95));
    this.state.aiIntelligence.timeToCutoffMinutes = timeCutoff;

    // Dynamic Explainable Factor Breakdown
    const factorRain = Math.round((rainRisk * 0.26 / routeARisk) * 100) || 24;
    const factorSlide = Math.round((slideRisk * 0.28 / routeARisk) * 100) || 22;
    const factorRiver = Math.round((riverRisk * 0.16 / routeARisk) * 100) || 18;
    const factorRoad = Math.round((roadSurfaceRisk * 0.14 / routeARisk) * 100) || 15;
    const factorTraffic = Math.round((trafficRisk * 0.08 / routeARisk) * 100) || 12;
    const factorBridge = Math.round((bridgeRisk * 0.08 / routeARisk) * 100) || 9;

    this.state.aiIntelligence.factors = [
      { name: 'Torrential Precipitation', value: `${env.rainfall} mm/hr`, weightPct: factorRain, delta: `+${factorRain}%`, severity: env.rainfall > 35 ? 'critical' : env.rainfall > 20 ? 'high' : 'medium' },
      { name: 'Slope Instability (Shear Strain)', value: `${env.landslideProb}% Prob (Sonapur)`, weightPct: factorSlide, delta: `+${factorSlide}%`, severity: env.landslideProb > 60 ? 'critical' : env.landslideProb > 30 ? 'high' : 'medium' },
      { name: 'River Water Gauge Level', value: `+${env.riverWaterLevel}m Above Base`, weightPct: factorRiver, delta: `+${factorRiver}%`, severity: env.riverWaterLevel > 1.5 ? 'critical' : env.riverWaterLevel > 0.8 ? 'high' : 'medium' },
      { name: 'Road Surface Condition', value: env.roadSurfaceCondition.replace('_', ' '), weightPct: factorRoad, delta: `+${factorRoad}%`, severity: env.roadSurfaceCondition === 'IMPASSABLE' ? 'critical' : env.roadSurfaceCondition === 'MUD_DEBRIS' ? 'high' : 'medium' },
      { name: 'Traffic Density & Bottlenecks', value: env.trafficDensity, weightPct: factorTraffic, delta: `+${factorTraffic}%`, severity: env.trafficDensity === 'GRIDLOCK' ? 'critical' : 'medium' },
      { name: 'Bridge Structure Accessibility', value: env.bridgeAccessibility, weightPct: factorBridge, delta: `+${factorBridge}%`, severity: env.bridgeAccessibility === 'CLOSED' ? 'critical' : 'medium' }
    ];

    // Prediction Text
    if (routeARisk >= 75) {
      this.state.aiIntelligence.predictionText = `Current corridor (NH-6) will become completely impassable within ${timeCutoff} minutes. Debris flow & river swelling active.`;
      this.state.aiIntelligence.recommendation = 'Mandatory reroute of Priority 1 Cold-Chain Unit TRUCK-07 via Route B (Umrangso Safe Bypass).';
      this.state.routesEvaluation.recommendedRouteId = 'ROUTE_B';
    } else if (routeARisk >= 50) {
      this.state.aiIntelligence.predictionText = `Corridor degradation predicted within ${timeCutoff} minutes. Heavy convective rainfall and low friction hazard.`;
      this.state.aiIntelligence.recommendation = 'Prepare convoy speed limits (<35 km/h) and stage Route B diversion standby.';
      this.state.routesEvaluation.recommendedRouteId = 'ROUTE_B';
    } else {
      this.state.aiIntelligence.predictionText = 'All primary arterial corridors operating within nominal accessibility thresholds.';
      this.state.aiIntelligence.recommendation = 'Maintain standard corridor dispatch along Route A.';
      this.state.routesEvaluation.recommendedRouteId = 'ROUTE_A';
    }

    // Update Fleet Risk Levels according to Route and Priority
    this.state.vehicles.forEach(v => {
      if (v.assignedRoute === 'ROUTE_A' || v.assignedRoute === 'NH6_PRIMARY') {
        v.riskLevel = routeARisk >= 75 ? 'CRITICAL' : routeARisk >= 45 ? 'MEDIUM' : 'LOW';
        if (routeARisk >= 75 && v.status !== 'REROUTED') {
          v.speed = Math.max(15, v.speed - 12);
        }
      } else if (v.assignedRoute === 'ROUTE_B' || v.assignedRoute === 'NH27_ALTERNATE') {
        v.riskLevel = 'LOW';
      }
    });

    // Update Logistics Impact
    const affectedCount = this.state.vehicles.filter(v => v.riskLevel === 'CRITICAL' || v.riskLevel === 'MEDIUM').length;
    this.state.logisticsImpact.affectedVehiclesCount = affectedCount;
    this.state.logisticsImpact.highRiskCorridors = routeARisk >= 60 ? ['NH-6 Meghalaya Sector', 'Sela Pass NH-13'] : ['Sela Pass NH-13'];
    this.state.logisticsImpact.affectedRoadsCount = routeARisk >= 60 ? 2 : 1;
    this.state.logisticsImpact.criticalDeliveriesAtRisk = this.state.vehicles.filter(v => v.priority === 'CRITICAL' && v.riskLevel === 'CRITICAL').length;
    this.state.logisticsImpact.estimatedTotalDelayMin = routeARisk >= 75 ? 45 : routeARisk >= 50 ? 20 : 0;
    this.state.logisticsImpact.recommendedAction = routeARisk >= 75 ? `Reroute ${affectedCount} affected vehicle(s) immediately to preserve high-priority deliveries.` : 'All shipments currently maintaining on-schedule ETA.';

    // Update Dynamic Executive Summary
    if (routeARisk >= 75) {
      this.state.executiveSummary = `Severe environmental stress detected across Meghalaya sector (${env.rainfall} mm/hr rain, ${env.landslideProb}% slide prob). NH-6 marked HIGH RISK (${routeARisk}%). ${affectedCount} transport unit(s) affected. AI recommends Route B for TRUCK-07.`;
    } else if (routeARisk >= 45) {
      this.state.executiveSummary = `Elevated precipitation and soil saturation detected along NH-6 (${routeARisk}% risk). Traffic moving under caution advisory. Standby diversion active.`;
    } else {
      this.state.executiveSummary = `Normal weather across all sectors. All ${this.state.vehicles.length} logistics convoys moving along primary corridors with low disruption risk.`;
    }

    // Update System Health connectivity based on environment
    if (env.networkConnectivity === 'OFFLINE_BLACKOUT') {
      this.state.systemHealth.satellite = 'SAT-MESH (CACHED)';
      this.state.systemHealth.weatherApi = 'OFFLINE (LOCAL CACHE)';
      this.state.systemHealth.routingEngine = 'LOCAL ENGINE';
      this.state.systemHealth.gpsNetwork = 'DEGRADED LORAN';
      this.state.systemHealth.database = 'OFFLINE BUFFER';
      this.state.driverContext.isOfflineMode = true;
    } else if (env.networkConnectivity === 'DEGRADED_MESH') {
      this.state.systemHealth.satellite = 'MESH 88%';
      this.state.systemHealth.weatherApi = 'CONNECTED';
      this.state.systemHealth.routingEngine = 'ONLINE';
      this.state.systemHealth.gpsNetwork = 'LIVE';
      this.state.systemHealth.database = 'SYNCING';
    } else {
      this.state.systemHealth.satellite = 'ONLINE';
      this.state.systemHealth.weatherApi = 'CONNECTED';
      this.state.systemHealth.routingEngine = 'ONLINE';
      this.state.systemHealth.gpsNetwork = 'LIVE';
      this.state.systemHealth.database = 'SYNCED';
    }
  }

  // Set Single Environment Parameter & Trigger Causality Chain
  setEnvironmentParam(paramKey, value) {
    if (this.state.environment.hasOwnProperty(paramKey)) {
      const prevVal = this.state.environment[paramKey];
      this.state.environment[paramKey] = value;
      this.recalculateAIEngine();

      // Broadcast to C2 Backend over WebSocket
      socketClient.send('SET_ENVIRONMENT_PARAM', { key: paramKey, value });

      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      this.addTimelineEvent({
        time: timeStr,
        title: `SENSOR UPDATE: ${paramKey.toUpperCase()}`,
        desc: `Value changed: ${prevVal} → ${value}. AI recalculated route risk (${this.state.aiIntelligence.accessibilityRiskPct}%).`,
        type: 'weather'
      });

      this.notify();
    }
  }

  // Load Preset Scenario & Trigger Multi-Layer Causality Chain
  applyScenarioPreset(presetKey) {
    const preset = SCENARIO_PRESETS[presetKey];
    if (!preset) return;

    this.state.activeScenarioPreset = presetKey;
    this.state.environment = { ...preset.env };
    this.recalculateAIEngine();

    // Broadcast to C2 Backend over WebSocket
    socketClient.send('APPLY_SCENARIO_PRESET', { presetKey });

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    
    // Create detailed causality sequence
    this.addTimelineEvent({
      time: timeStr,
      title: `SCENARIO ENGAGED: ${preset.name}`,
      desc: preset.description,
      type: presetKey === 'NORMAL' || presetKey === 'RECOVERY' ? 'info' : 'danger'
    });

    if (presetKey === 'HEAVY_MONSOON' || presetKey === 'LANDSLIDE' || presetKey === 'ROAD_BLOCKED' || presetKey === 'FLASH_FLOOD' || presetKey === 'EXTREME_WEATHER') {
      this.addTimelineEvent({
        time: timeStr,
        title: 'AI RISK ENGINE EVALUATION',
        desc: `NH-6 Primary Corridor risk surged to ${this.state.aiIntelligence.accessibilityRiskPct}%. Route B evaluated as safest alternative (22% risk).`,
        type: 'ai'
      });

      this.addTimelineEvent({
        time: timeStr,
        title: 'DISPATCH REROUTE ADVISORY',
        desc: 'TRUCK-07 (Essential Vaccines) notified for diversion to Route B via Umrangso.',
        type: 'ai'
      });
    }

    this.notify();
  }

  // Authentication Actions
  login(username, password) {
    const cred = PRESET_CREDENTIALS.find(
      c => c.username.toLowerCase() === username.trim().toLowerCase() && c.password === password.trim()
    );

    if (cred) {
      this.state.currentUser = { ...cred };
      this.notify();
      return { success: true, user: this.state.currentUser };
    }
    return { success: false, message: 'Invalid credentials. Please use the pre-configured credentials below.' };
  }

  // Driver Login with Checkpost Port Access Code
  loginWithPortCode(portCode) {
    if (!portCode) return { success: false, message: 'Please enter a valid Port Code.' };
    const cleanCode = portCode.trim().toUpperCase();

    // Check existing dispatches or create dynamic session
    let dispatch = this.state.dispatches?.find(
      d => d.portCode === cleanCode || d.portCode.endsWith(cleanCode) || d.vehicleNumber.includes(cleanCode)
    );

    if (!dispatch) {
      // Auto-register session for this port code
      dispatch = {
        portCode: cleanCode.startsWith('PORT-') ? cleanCode : `PORT-${cleanCode}`,
        vehicleId: 'TRUCK-07',
        vehicleNumber: `AS-01-EE-${cleanCode.replace(/\D/g, '') || '7890'}`,
        driverName: 'Suresh Das',
        driverPhone: '+91 94350-12894',
        vehicleType: 'Refrigerated 4x4 Heavy Logistics Unit',
        cargo: 'Essential Rabies Vaccines & Anti-Venom (-20°C)',
        cargoPriority: 'CRITICAL',
        origin: 'Khanapara Checkpost Hub, Guwahati',
        destination: 'District Civil Hospital, Silchar',
        assignedRoute: 'ROUTE_A',
        status: 'IN_TRANSIT',
        speed: 48,
        progressPct: 15,
        coordinates: [26.1100, 91.8200],
        currentLocationName: 'NH-6 near Nongpoh-Shillong descent'
      };
      if (!this.state.dispatches) this.state.dispatches = [];
      this.state.dispatches.unshift(dispatch);
    }

    this.state.currentUser = {
      username: `driver_${dispatch.portCode}`,
      role: USER_ROLES.DRIVER,
      name: dispatch.driverName,
      badge: dispatch.portCode,
      vehicleId: dispatch.vehicleId || 'TRUCK-07',
      phone: dispatch.driverPhone
    };

    this.state.driverContext.activeVehicleId = dispatch.vehicleId || 'TRUCK-07';
    this.state.driverContext.portCode = dispatch.portCode;

    this.notify();
    return { success: true, user: this.state.currentUser, dispatch };
  }

  // Create Checkpost Dispatch & Generate Port Access Code
  dispatchVehicle(data) {
    const portNum = Math.floor(1000 + Math.random() * 9000);
    const portCode = `PORT-${portNum}`;
    const vehicleId = `TRUCK-${portNum.toString().slice(-2)}`;
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newDispatch = {
      id: vehicleId,
      vehicleId,
      name: vehicleId,
      portCode,
      vehicleNumber: data.vehicleNumber || `AS-01-EE-${portNum}`,
      driverName: data.driverName || 'Designated Fleet Driver',
      driverPhone: data.driverPhone || '+91 98640-' + portNum,
      vehicleType: data.vehicleType || 'Refrigerated 4x4 Heavy Logistics Unit',
      cargo: data.cargo || 'Essential Vaccines & Cold-Chain Blood Units',
      cargoType: data.vehicleType || 'Refrigerated 4x4',
      priority: data.priority || 'CRITICAL',
      cargoPriority: data.priority || 'CRITICAL',
      origin: data.origin || 'Khanapara Checkpost Hub, Guwahati',
      destination: data.destination || 'District Civil Hospital, Silchar',
      assignedRoute: 'ROUTE_A',
      activeCorridorId: 'corridor-route-a',
      status: 'IN_TRANSIT',
      speed: 48,
      progressPct: 5,
      coordinates: [26.1820, 91.7580],
      currentLocationName: data.origin || 'Khanapara Checkpost Staging Hub',
      eta: '4h 15m',
      riskLevel: 'LOW',
      fuelLevel: '98%',
      battery: '100%',
      currentTemp: '-20°C (Nominal)',
      tempRequirement: '-20°C to -18°C',
      routeHistory: [
        { time: timeStr, event: `Vehicle cleared at checkpost. Port code ${portCode} generated.` }
      ]
    };

    if (!this.state.dispatches) this.state.dispatches = [];
    this.state.dispatches.unshift(newDispatch);
    this.state.vehicles.unshift(newDispatch);
    this.state.driverContext.activeVehicleId = vehicleId;

    // Broadcast over WebSocket to backend
    socketClient.send('CREATE_DISPATCH', newDispatch);

    this.addTimelineEvent({
      time: timeStr,
      title: `CHECKPOST DISPATCH: ${portCode}`,
      desc: `Vehicle ${newDispatch.vehicleNumber} departing Guwahati for ${newDispatch.destination}. Assigned Route A.`,
      type: 'success'
    });

    this.sendPushToTalkMessage({
      sender: 'Guwahati Checkpost Command',
      text: `Vehicle ${newDispatch.vehicleNumber} cleared at checkpost. Port code: ${portCode}. Route A active.`
    });

    this.notify();
    return newDispatch;
  }

  // Delete / Remove Vehicle from Fleet Tracking
  deleteVehicle(vehicleId) {
    if (!vehicleId) return;
    this.state.vehicles = this.state.vehicles.filter(v => v.id !== vehicleId && v.vehicleId !== vehicleId);
    if (this.state.dispatches) {
      this.state.dispatches = this.state.dispatches.filter(d => d.vehicleId !== vehicleId && d.portCode !== vehicleId && d.id !== vehicleId);
    }
    // Also remove any remaining invalid entries
    this.state.vehicles = this.state.vehicles.filter(v => v && v.id && v.id !== 'undefined');
    
    socketClient.send('DELETE_VEHICLE', { vehicleId });
    this.notify();
  }

  logout() {
    this.state.currentUser = null;
    this.notify();
  }

  // Advance Vehicle along Route Waypoints
  advanceVehicle(vehicleId) {
    const v = this.state.vehicles.find(veh => veh.id === vehicleId || veh.vehicleId === vehicleId) || this.state.vehicles[0];
    if (!v) return;

    const isRouteB = v.assignedRoute === 'ROUTE_B' || v.status === 'REROUTED';
    const routeWaypoints = isRouteB ? CORRIDORS.ROUTE_B.waypoints : CORRIDORS.ROUTE_A.waypoints;
    const landmarkNames = isRouteB
      ? ['Guwahati Checkpost', 'Jagiroad Bypass', 'Nagaon Crossing', 'Dabaka Junction', 'Lumding Ridge', 'Umrangso Safe Valley', 'Harangajao Cut', 'Silchar District Hospital (Arrived)']
      : ['Guwahati Checkpost', 'Nongpoh Ascent', 'Shillong Central Hub', 'Jowai Pass', 'Khliehriat Chokepoint', 'Sonapur Landslide Sector', 'Kalain Approach', 'Silchar District Hospital (Arrived)'];

    if (v.currentWaypointIdx === undefined) {
      // Find closest waypoint
      v.currentWaypointIdx = 0;
    }
    v.currentWaypointIdx = (v.currentWaypointIdx + 1) % routeWaypoints.length;

    v.coordinates = [...routeWaypoints[v.currentWaypointIdx]];
    v.currentLocationName = landmarkNames[v.currentWaypointIdx] || `Corridor Milestone ${v.currentWaypointIdx * 45} km`;
    v.progressPct = Math.round(((v.currentWaypointIdx + 1) / routeWaypoints.length) * 100);
    
    const remainingHours = Math.max(0.5, (routeWaypoints.length - v.currentWaypointIdx - 1) * 0.8).toFixed(1);
    v.eta = v.currentWaypointIdx === routeWaypoints.length - 1 ? 'ARRIVED DESTINATION' : `${remainingHours}h remaining`;
    v.speed = v.status === 'DELAYED' ? 18 : 54;

    this.notify();
  }

  // State Mutators
  setSelectedVehicle(vehicleId) {
    this.state.selectedVehicleId = vehicleId;
    this.notify();
  }

  setSelectedCorridor(corridorId) {
    this.state.selectedCorridorId = corridorId;
    this.notify();
  }

  // Driver Reroute acceptance
  acceptReroute(vehicleId = 'TRUCK-07') {
    const vehicle = this.state.vehicles.find(v => v.id === vehicleId);
    if (vehicle) {
      vehicle.status = 'REROUTED';
      vehicle.assignedRoute = 'ROUTE_B';
      vehicle.activeCorridorId = 'corridor-route-b';
      vehicle.riskLevel = 'LOW';
      vehicle.currentLocationName = 'Diverted onto Route B (Umrangso Safe Ridge)';
      vehicle.coordinates = [25.7510, 93.1750]; // Move onto Route B
      vehicle.eta = '5h 10m (Clear Corridor)';
      vehicle.routeHistory.unshift({
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        event: 'Driver ACCEPTED AI Route B diversion. Navigation waypoints updated.'
      });
    }

    this.state.simulation.truck07Rerouted = true;
    this.state.simulation.truck07AcceptedReroute = true;

    // Broadcast over WebSocket to backend
    socketClient.send('ACCEPT_REROUTE', { vehicleId });

    // Add Live Causality Events
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    this.addTimelineEvent({
      time: timeStr,
      title: 'DRIVER HUB: REROUTE ACCEPTED',
      desc: `${vehicleId} acknowledged diversion to Route B. Vehicle GPS switched to Umrangso bypass.`,
      type: 'success'
    });

    this.addTimelineEvent({
      time: timeStr,
      title: 'TELEMETRY: CRITICAL SHIPMENT SECURED',
      desc: `${vehicleId} Cold-Chain delivery confirmed safe. Risk reduced from 84% to 22%.`,
      type: 'success'
    });

    this.notify();
  }

  // Field Officer Incident Submission
  submitFieldIncident({ incidentType, severity, roadName, gps, description, photoUrl }) {
    const newReport = {
      id: `FLD-${Math.floor(1000 + Math.random() * 9000)}`,
      officerName: this.state.currentUser?.name || 'Field Officer',
      officerBadge: this.state.currentUser?.badge || 'FLD-POL',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      incidentType,
      severity,
      roadName,
      gps,
      description,
      photoUrl: photoUrl || 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=600&q=80',
      verified: true
    };

    this.state.fieldReports.unshift(newReport);

    // Auto-update environment road damage severity & landslide probability based on field submission
    if (incidentType === 'Landslide') {
      this.state.environment.landslideProb = Math.min(100, this.state.environment.landslideProb + 25);
      this.state.environment.roadSurfaceCondition = 'MUD_DEBRIS';
      this.state.environment.roadDamageSeverity = 'CRITICAL';
    } else if (incidentType === 'Flood') {
      this.state.environment.riverWaterLevel = Math.min(3.5, this.state.environment.riverWaterLevel + 0.8);
      this.state.environment.floodSeverity = 'SEVERE';
    }

    this.recalculateAIEngine();

    // Broadcast over WebSocket
    socketClient.send('SET_ENVIRONMENT_PARAM', { key: 'roadSurfaceCondition', value: this.state.environment.roadSurfaceCondition });
    socketClient.send('SET_ENVIRONMENT_PARAM', { key: 'landslideProb', value: this.state.environment.landslideProb });

    // Create corresponding Alert
    const newAlert = {
      id: `ALT-${Math.floor(2000 + Math.random() * 8000)}`,
      timestamp: newReport.timestamp,
      title: `${incidentType} Reported: ${roadName}`,
      category: incidentType,
      location: roadName,
      severity: severity.includes('Critical') || severity.includes('Impassable') ? 'CRITICAL' : 'HIGH',
      affectedVehicles: ['TRUCK-07', 'TRUCK-04'],
      recommendedAction: 'Verify structural clearance. Advise Route B diversion immediately.',
      status: 'ACTIVE',
      aiConfidence: '97.2%'
    };
    this.state.alerts.unshift(newAlert);

    // Live causality timeline chain
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    this.addTimelineEvent({
      time: timeStr,
      title: `FIELD INCIDENT REPORTED (${incidentType.toUpperCase()})`,
      desc: `${roadName} — ${description.slice(0, 65)}...`,
      type: 'danger'
    });

    this.addTimelineEvent({
      time: timeStr,
      title: 'AI RECALCULATING IMPACT',
      desc: `Field incident ingested. Corridor accessibility degraded to ${100 - this.state.aiIntelligence.accessibilityRiskPct}%.`,
      type: 'ai'
    });

    this.notify();
    return newReport;
  }

  // Create Delivery Request
  createDelivery(deliveryData) {
    const newDel = {
      id: `DEL-${Math.floor(8800 + Math.random() * 1000)}`,
      cargo: deliveryData.cargo,
      commodityType: deliveryData.commodityType || 'Critical Relief',
      priority: deliveryData.priority || 'HIGH',
      origin: deliveryData.origin,
      destination: deliveryData.destination,
      vehicleId: deliveryData.vehicleId || 'TRUCK-19',
      driver: deliveryData.driver || 'N. Sanatomba Singh',
      eta: deliveryData.eta || '3h 30m',
      status: 'Assigned',
      distance: deliveryData.distance || '180 km',
      createdDate: 'Just now'
    };

    this.state.deliveries.unshift(newDel);
    this.addTimelineEvent({
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      title: 'NEW DELIVERY DISPATCHED',
      desc: `${newDel.id} (${newDel.cargo}) [PRIORITY: ${newDel.priority}] assigned to ${newDel.vehicleId}.`,
      type: 'info'
    });
    this.notify();
    return newDel;
  }

  // Timeline Helper
  addTimelineEvent({ time, title, desc, type = 'info' }) {
    this.state.timeline.unshift({
      time: time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      title,
      desc,
      type
    });
    if (this.state.timeline.length > 30) {
      this.state.timeline.pop();
    }
  }

  // Digital Push-to-Talk Send
  sendPushToTalkMessage({ sender, text }) {
    const message = {
      sender,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text
    };
    this.state.driverContext.pttHistory.unshift(message);
    this.state.driverContext.pttIncomingMessage = message;
    this.state.driverContext.pttState = 'RECEIVED';

    // Broadcast over WebSocket to C2 Backend
    socketClient.send('SEND_PTT_MESSAGE', { sender, text });

    this.notify();
  }

  // Set Target Crosshair Pin
  setTargetedPin(lat, lng, label = 'Custom Pinned Location') {
    const sector = lat > 26 ? 'Assam / Brahmaputra North' : lat > 25.4 ? 'Meghalaya Plateau / Khasi Hills' : 'Barak Valley / Dima Hasao';
    this.state.targetedPin = {
      lat: parseFloat(lat),
      lng: parseFloat(lng),
      label,
      sector
    };

    // Broadcast over WebSocket
    socketClient.send('SET_TARGETED_PIN', { lat: parseFloat(lat), lng: parseFloat(lng), label, sector });

    this.notify();
  }

  // 1. Launch Hazard / Disaster at Pinned GPS Location
  launchHazardAtPin({ type, severity, lat, lng, name }) {
    const hazardLat = parseFloat(lat);
    const hazardLng = parseFloat(lng);
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newMission = {
      id: `HAZ-${Math.floor(1000 + Math.random() * 9000)}`,
      type: 'HAZARD_INJECTION',
      hazardType: type || 'Landslide',
      severity: severity || 'CRITICAL',
      name: name || `${type} at Pin (${hazardLat.toFixed(4)}°N, ${hazardLng.toFixed(4)}°E)`,
      gps: [hazardLat, hazardLng],
      timestamp: timeStr,
      status: 'ACTIVE_DISRUPTION'
    };

    this.state.customMissions.unshift(newMission);

    // Dynamic environmental coupling
    if (type === 'Landslide' || type === 'Rockfall') {
      this.state.environment.landslideProb = 96;
      this.state.environment.roadSurfaceCondition = 'IMPASSABLE';
      this.state.environment.roadDamageSeverity = 'CRITICAL';
    } else if (type === 'Flood' || type === 'Cloudburst') {
      this.state.environment.rainfall = 65;
      this.state.environment.riverWaterLevel = 2.4;
      this.state.environment.floodSeverity = 'SEVERE';
    } else if (type === 'Bridge Collapse') {
      this.state.environment.bridgeAccessibility = 'CLOSED';
      this.state.environment.trafficDensity = 'GRIDLOCK';
    }

    this.recalculateAIEngine();

    // Broadcast over WebSocket
    socketClient.send('LAUNCH_HAZARD', { type, severity, lat: hazardLat, lng: hazardLng, name: newMission.name });

    this.addTimelineEvent({
      time: timeStr,
      title: `TACTICAL HAZARD LAUNCHED: ${type.toUpperCase()}`,
      desc: `Pinned at [${hazardLat.toFixed(4)}, ${hazardLng.toFixed(4)}]. Intersecting arterial route blocked. AI Risk spiked to ${this.state.aiIntelligence.accessibilityRiskPct}%.`,
      type: 'danger'
    });

    this.notify();
    return newMission;
  }

  // 2. Launch Convoy from Pinned GPS Location
  launchConvoyAtPin({ originGps, originName, destGps, destName, cargo, priority, commodityType }) {
    const newId = `TRUCK-${Math.floor(20 + Math.random() * 80)}`;
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newVehicle = {
      id: newId,
      name: `NER Lifeline Unit ${newId}`,
      registration: `AS-01-EE-${Math.floor(1000 + Math.random() * 9000)}`,
      driverName: 'Tactical Dispatch Driver',
      driverPhone: '+91 94350 ' + Math.floor(10000 + Math.random() * 90000),
      cargo: cargo || 'Emergency Cold-Chain Blood & Serum',
      cargoType: commodityType || 'Critical Medical',
      priority: priority || 'CRITICAL',
      origin: originName || 'Pinned Tactical Launch Base',
      destination: destName || 'District Civil Hospital, Silchar',
      coordinates: originGps || [26.1820, 91.7580],
      assignedRoute: 'ROUTE_B',
      activeCorridorId: 'corridor-route-b',
      status: 'IN_TRANSIT',
      speed: 52,
      fuelLevel: '95%',
      battery: '100%',
      currentTemp: '-20°C (Nominal)',
      tempRequirement: '-20°C to -18°C',
      eta: '4h 15m',
      riskLevel: 'LOW',
      currentLocationName: originName || 'Pinned Launch Point',
      lastGpsUpdate: 'Live Lock',
      progressPct: 15,
      routeHistory: [
        { time: timeStr, event: `Mission launched from pinned GPS location [${originGps[0]}, ${originGps[1]}].` }
      ]
    };

    this.state.vehicles.unshift(newVehicle);

    this.state.customMissions.unshift({
      id: `CONVOY-${newId}`,
      type: 'CONVOY_DISPATCH',
      name: `Dispatched ${newId} (${cargo})`,
      originGps,
      destGps: destGps || [24.8333, 92.7789],
      status: 'ROLLING',
      eta: '4h 15m',
      vehicleId: newId
    });

    // Broadcast over WebSocket
    socketClient.send('LAUNCH_CONVOY', { originGps, originName, destName, cargo, priority });

    this.addTimelineEvent({
      time: timeStr,
      title: `CONVOY LAUNCHED: ${newId}`,
      desc: `${cargo} [PRIORITY: ${priority}] dispatched from [${originGps[0].toFixed(3)}, ${originGps[1].toFixed(3)}] to ${destName}.`,
      type: 'success'
    });

    this.notify();
    return newVehicle;
  }

  // 3. Launch Drone Airlift from Pin
  launchDroneAtPin({ originGps, targetGps, targetName, payload }) {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const droneId = `DRONE-NER-${Math.floor(10 + Math.random() * 90)}`;

    const newMission = {
      id: `DRN-${Math.floor(1000 + Math.random() * 9000)}`,
      type: 'DRONE_RELIEF',
      name: `${droneId} Aerial Lifeline`,
      originGps: originGps || [26.1820, 91.7580],
      targetGps: targetGps || [25.1120, 92.3850],
      targetName: targetName || 'Isolated Sonapur Relief Node',
      payload: payload || 'Emergency Anti-Venom & Cryo Blood Units',
      status: 'AIRBORNE',
      eta: '18 mins (Direct Air Corridor)',
      speed: '115 km/h',
      battery: '98%',
      altitude: '450m AGL'
    };

    this.state.customMissions.unshift(newMission);

    // Broadcast over WebSocket
    socketClient.send('LAUNCH_DRONE', { originGps, targetGps, targetName, payload });

    this.addTimelineEvent({
      time: timeStr,
      title: `AERIAL DRONE LAUNCHED: ${droneId}`,
      desc: `Direct lifeline flight over landslide obstacle to ${targetName}. Payload: ${payload}.`,
      type: 'success'
    });

    this.notify();
    return newMission;
  }

  // 4. Launch IoT Weather / Gauge Sensor at Pin
  launchSensorAtPin({ gps, sensorType, name }) {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMission = {
      id: `SNS-${Math.floor(1000 + Math.random() * 9000)}`,
      type: 'SENSOR_DEPLOYMENT',
      name: name || `Tactical IoT AWS [${gps[0].toFixed(3)}, ${gps[1].toFixed(3)}]`,
      sensorType: sensorType || 'Automated Weather & Soil Moisture Station',
      gps,
      status: 'TRANSMITTING',
      timestamp: timeStr,
      reading: 'Precipitation: 42mm/hr · Soil Sat: 88% · Vibration: 1.2g'
    };

    this.state.customMissions.unshift(newMission);

    // Broadcast over WebSocket
    socketClient.send('LAUNCH_SENSOR', { gps, sensorType, name: newMission.name });

    this.addTimelineEvent({
      time: timeStr,
      title: `IOT SENSOR DEPLOYED AT PIN`,
      desc: `Station active at [${gps[0].toFixed(4)}, ${gps[1].toFixed(4)}]. Telemetry streaming to Control Room.`,
      type: 'weather'
    });

    this.notify();
    return newMission;
  }

  // Advance Vehicle Along Assigned Route Waypoints (Drive Forward)
  advanceVehicle(vehicleId = 'TRUCK-07') {
    const vehicle = this.state.vehicles.find(v => v.id === vehicleId || v.vehicleId === vehicleId || v.portCode === vehicleId) || this.state.vehicles[0];
    if (!vehicle) return;

    const isRouteB = vehicle.assignedRoute === 'ROUTE_B';
    const waypoints = isRouteB ? [
      { coords: [26.1445, 91.7362], name: 'Guwahati Staging Depot' },
      { coords: [26.1820, 92.0540], name: 'Jagiroad Bypass' },
      { coords: [26.3450, 92.6840], name: 'Nagaon Junction' },
      { coords: [26.1280, 93.0320], name: 'Dabaka Checkpost' },
      { coords: [25.7510, 93.1750], name: 'Lumding Ridge' },
      { coords: [25.4120, 92.9820], name: 'Umrangso Safe Rock Bypass' },
      { coords: [25.1820, 92.8120], name: 'Harangajao Bridge' },
      { coords: [24.8333, 92.7789], name: 'Silchar District Hospital (Destination)' }
    ] : [
      { coords: [26.1445, 91.7362], name: 'Guwahati Central Medical Depot' },
      { coords: [25.9610, 91.8845], name: 'NH-6 Nongpoh Waypoint' },
      { coords: [25.5788, 91.8933], name: 'Shillong Arterial Hub' },
      { coords: [25.4520, 92.2030], name: 'Jowai Mountain Pass' },
      { coords: [25.1840, 92.3560], name: 'Khliehriat Cut' },
      { coords: [25.1120, 92.3850], name: 'Sonapur Tunnel & Chokepoint' },
      { coords: [24.9750, 92.5420], name: 'Kalain Valley' },
      { coords: [24.8333, 92.7789], name: 'Silchar District Hospital (Destination)' }
    ];

    let curIdx = vehicle.currentWaypointIdx !== undefined ? vehicle.currentWaypointIdx : 0;
    let nextIdx = curIdx + 1;
    if (nextIdx >= waypoints.length) nextIdx = 0;

    vehicle.currentWaypointIdx = nextIdx;
    vehicle.coordinates = [...waypoints[nextIdx].coords];
    vehicle.currentLocationName = waypoints[nextIdx].name;
    vehicle.progressPct = Math.round((nextIdx / (waypoints.length - 1)) * 100);
    vehicle.speed = Math.floor(46 + Math.random() * 12);
    vehicle.eta = `${Math.max(1, 8 - nextIdx)}h ${Math.floor(10 + Math.random() * 40)}m`;

    this.addTimelineEvent({
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      title: `GPS TELEMETRY UPDATE: ${vehicle.id}`,
      desc: `Advanced to ${vehicle.currentLocationName} [${vehicle.coordinates[0].toFixed(4)}, ${vehicle.coordinates[1].toFixed(4)}]. Speed: ${vehicle.speed} km/h.`,
      type: 'info'
    });

    // Broadcast over WebSocket to sync all portals/screens
    socketClient.send('ADVANCE_VEHICLE', { vehicleId: vehicle.id || vehicleId });

    this.notify();
    return vehicle;
  }

  // Accept Route B Reroute
  acceptReroute(vehicleId = 'TRUCK-07') {
    const vehicle = this.state.vehicles.find(v => v.id === vehicleId || v.vehicleId === vehicleId || v.portCode === vehicleId) || this.state.vehicles[0];
    if (vehicle) {
      vehicle.assignedRoute = 'ROUTE_B';
      vehicle.activeCorridorId = 'corridor-route-b';
      vehicle.currentLocationName = 'Umrangso Safe Rock Bypass (Route B)';
      vehicle.coordinates = [25.4120, 92.9820];
      vehicle.currentWaypointIdx = 5;
      vehicle.progressPct = 65;
      vehicle.speed = 52;
      vehicle.status = 'REROUTED';
      vehicle.eta = '3h 20m';
      vehicle.riskLevel = 'LOW';
    }

    this.addTimelineEvent({
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      title: `REROUTE CONFIRMED: ${vehicle?.id || vehicleId}`,
      desc: `Driver diverted successfully onto Route B (Umrangso bypass). Delivery safety preserved.`,
      type: 'success'
    });

    // Broadcast over WebSocket
    socketClient.send('ACCEPT_REROUTE', { vehicleId: vehicle?.id || vehicleId });

    this.notify();
    return vehicle;
  }

  // Driver Login via Checkpost Port Code
  loginWithPortCode(code) {
    if (!code) return { success: false, message: 'Port Code is required' };
    const clean = code.trim().toUpperCase();
    const vehicle = this.state.vehicles.find(v => (v.portCode && v.portCode.toUpperCase() === clean) || (v.id && v.id.toUpperCase() === clean) || (v.vehicleNumber && v.vehicleNumber.toUpperCase().includes(clean)));

    if (vehicle) {
      this.state.driverContext.activeVehicleId = vehicle.id;
      this.state.selectedVehicleId = vehicle.id;
      this.notify();
      return { success: true, vehicle };
    }

    // If not found in current vehicles, create a mapped vehicle for this port code
    const newId = `TRUCK-${clean.replace(/[^0-9]/g, '').slice(-2) || '88'}`;
    const newV = {
      id: newId,
      vehicleId: newId,
      name: `Lifeline Unit ${newId}`,
      portCode: clean,
      registration: `AS-01-EE-${Math.floor(1000 + Math.random() * 9000)}`,
      driverName: 'Dispatched Checkpost Driver',
      driverPhone: '+91 98640 ' + Math.floor(10000 + Math.random() * 90000),
      cargo: 'Emergency Relief Supplies',
      cargoType: 'Critical Cold-Chain',
      priority: 'CRITICAL',
      origin: 'Checkpost Hub, Guwahati',
      destination: 'District Civil Hospital, Silchar',
      coordinates: [26.1445, 91.7362],
      assignedRoute: 'ROUTE_A',
      activeCorridorId: 'corridor-route-a',
      status: 'IN_TRANSIT',
      speed: 48,
      eta: '5h 15m',
      progressPct: 10,
      currentLocationName: 'Guwahati Depot',
      currentWaypointIdx: 0,
      currentTemp: '-18.5°C',
      tempRequirement: '-20°C to -15°C'
    };
    this.state.vehicles.unshift(newV);
    this.state.driverContext.activeVehicleId = newId;
    this.state.selectedVehicleId = newId;
    this.notify();
    return { success: true, vehicle: newV };
  }

  // Delete vehicle from fleet
  deleteVehicle(vehicleId) {
    this.state.vehicles = this.state.vehicles.filter(v => v.id !== vehicleId && v.vehicleId !== vehicleId && v.portCode !== vehicleId);
    if (this.state.selectedVehicleId === vehicleId) {
      this.state.selectedVehicleId = this.state.vehicles[0]?.id || null;
    }
    if (this.state.driverContext.activeVehicleId === vehicleId) {
      this.state.driverContext.activeVehicleId = this.state.vehicles[0]?.id || null;
    }
    socketClient.send('DELETE_VEHICLE', { vehicleId });
    this.notify();
  }

  // Reset demo state
  resetAllState() {
    localStorage.removeItem(STORAGE_KEY);
    this.state = this.loadInitialState();
    this.notify();
  }
}

export const store = new Store();

