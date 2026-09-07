/**
 * Authoritative Server-Side In-Memory State Store
 * Supports Checkpost Dispatches with Port Codes & Live Rerouting
 */

import { calculateAiRisk } from '../ai/risk-engine.js';

export const SCENARIO_PRESETS = {
  NORMAL: {
    name: 'Nominal Baseline',
    rainfall: 4.2,
    landslideProb: 12,
    riverWaterLevel: 0.2,
    roadSurfaceCondition: 'DRY',
    trafficDensity: 'LOW',
    bridgeAccessibility: '100% OPEN',
    floodSeverity: 'NONE',
    networkConnectivity: 'ONLINE_4G_5G'
  },
  HEAVY_MONSOON: {
    name: 'Heavy Monsoon Squall',
    rainfall: 48.6,
    landslideProb: 65,
    riverWaterLevel: 1.4,
    roadSurfaceCondition: 'WET',
    trafficDensity: 'HEAVY',
    bridgeAccessibility: 'SINGLE_LANE',
    floodSeverity: 'MODERATE',
    networkConnectivity: 'ONLINE_4G_5G'
  },
  LANDSLIDE: {
    name: 'Sonapur Major Landslide',
    rainfall: 52.0,
    landslideProb: 94,
    riverWaterLevel: 1.8,
    roadSurfaceCondition: 'MUD_DEBRIS',
    trafficDensity: 'CONGESTED',
    bridgeAccessibility: 'CLOSED',
    floodSeverity: 'SEVERE',
    networkConnectivity: 'DEGRADED_MESH'
  }
};

class SystemState {
  constructor() {
    this.environment = { ...SCENARIO_PRESETS.NORMAL };
    this.activeScenarioPreset = 'NORMAL';
    this.environmentLastUpdated = new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour12: false }) + ' IST';

    // Start with default demo dispatch session
    this.dispatches = [
      {
        portCode: 'PORT-7890',
        vehicleId: 'TRUCK-07',
        vehicleNumber: 'AS-01-EE-7890',
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
        currentLocationName: 'NH-6 near Nongpoh-Shillong descent',
        createdAt: new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour12: false }) + ' IST'
      }
    ];

    this.vehicles = [...this.dispatches];
    this.alerts = [];
    this.pttFeed = [
      {
        id: 'PTT-01',
        sender: 'Guwahati Checkpost Dispatch',
        role: 'CONTROL_ROOM',
        timestamp: 'Just now',
        text: 'Unit AS-01-EE-7890 cleared at checkpost. Port code PORT-7890 active on Route A.',
        audioSimulated: true
      }
    ];

    this.targetedPin = {
      lat: 25.1120,
      lng: 92.3850,
      label: 'Sonapur Chokepoint (Km 142)',
      sector: 'Meghalaya East Jaintia Hills'
    };

    this.customMissions = [];
    this.timeline = [];

    this.recomputeIntelligence();
  }

  recomputeIntelligence() {
    const aiResult = calculateAiRisk(this.environment);
    this.aiIntelligence = {
      riskLevel: aiResult.riskLevel,
      accessibilityRiskPct: aiResult.accessibilityRiskPct,
      statusLabel: aiResult.statusLabel,
      evaluationConfidence: aiResult.evaluationConfidence,
      lastComputed: aiResult.lastComputed
    };
    this.routesEvaluation = aiResult.routesEvaluation;
  }

  // Create Checkpost Dispatch & Generate Port Code
  createDispatch(dispatchData) {
    const portNumber = Math.floor(1000 + Math.random() * 9000);
    const portCode = `PORT-${portNumber}`;
    const vehicleId = `TRUCK-${portNumber.toString().slice(-2)}`;

    const newDispatch = {
      id: vehicleId,
      vehicleId,
      name: vehicleId,
      portCode,
      vehicleNumber: dispatchData.vehicleNumber || `AS-01-EE-${portNumber}`,
      driverName: dispatchData.driverName || 'Designated Fleet Driver',
      driverPhone: dispatchData.driverPhone || '+91 98640-' + portNumber,
      vehicleType: dispatchData.vehicleType || 'Refrigerated 4x4 Heavy Unit',
      cargo: dispatchData.cargo || 'Cold-Chain Critical Relief Units',
      cargoType: dispatchData.vehicleType || 'Refrigerated 4x4 Heavy Unit',
      priority: dispatchData.priority || 'CRITICAL',
      cargoPriority: dispatchData.priority || 'CRITICAL',
      origin: dispatchData.origin || 'Khanapara Checkpost Hub, Guwahati',
      destination: dispatchData.destination || 'District Civil Hospital, Silchar',
      assignedRoute: 'ROUTE_A',
      status: 'IN_TRANSIT',
      speed: 52,
      progressPct: 5,
      coordinates: [26.1820, 91.7580],
      currentLocationName: dispatchData.origin || 'Khanapara Staging Checkpost',
      createdAt: new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour12: false }) + ' IST'
    };

    this.dispatches.unshift(newDispatch);
    this.vehicles.unshift(newDispatch);

    this.addTimelineEvent({
      time: newDispatch.createdAt,
      title: `CHECKPOST DISPATCH: ${portCode}`,
      desc: `Vehicle ${newDispatch.vehicleNumber} dispatched for ${newDispatch.destination}. Driver Port Code: ${portCode}`,
      type: 'success'
    });

    this.sendPttMessage({
      sender: 'Checkpost Dispatch Controller',
      role: 'CONTROL_ROOM',
      text: `Vehicle ${newDispatch.vehicleNumber} cleared at checkpost. Driver Access Code: ${portCode}. Route A assigned.`
    });

    return { dispatch: newDispatch, state: this.getState() };
  }

  deleteVehicle(vehicleId) {
    this.vehicles = this.vehicles.filter(v => v.id !== vehicleId && v.vehicleId !== vehicleId);
    this.dispatches = this.dispatches.filter(d => d.vehicleId !== vehicleId && d.portCode !== vehicleId && d.id !== vehicleId);
    return this.getState();
  }

  getDispatchByPort(portCode) {
    const cleanCode = portCode?.trim().toUpperCase();
    return this.dispatches.find(d => d.portCode === cleanCode || d.portCode.endsWith(cleanCode) || d.vehicleNumber.includes(cleanCode)) || this.dispatches[0];
  }

  setEnvironmentParam(key, value) {
    this.environment[key] = value;
    this.activeScenarioPreset = 'CUSTOM';
    this.environmentLastUpdated = new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour12: false }) + ' IST';
    this.recomputeIntelligence();
    return this.getState();
  }

  applyScenarioPreset(presetKey) {
    if (SCENARIO_PRESETS[presetKey]) {
      this.environment = { ...SCENARIO_PRESETS[presetKey] };
      this.activeScenarioPreset = presetKey;
      this.environmentLastUpdated = new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour12: false }) + ' IST';
      this.recomputeIntelligence();
    }
    return this.getState();
  }

  setTargetedPin(lat, lng, label = 'Pinned Coordinate', sector = 'Tactical Sector') {
    this.targetedPin = { lat, lng, label, sector };
    return this.getState();
  }

  launchHazard(hazardData) {
    const lat = parseFloat(hazardData.lat || this.targetedPin.lat);
    const lng = parseFloat(hazardData.lng || this.targetedPin.lng);
    const newMission = {
      id: `HAZARD-${Date.now().toString().slice(-4)}`,
      type: 'HAZARD_INJECTION',
      hazardType: hazardData.type || 'Landslide',
      name: hazardData.name || `${hazardData.type || 'Landslide'} Obstruction`,
      severity: hazardData.severity || 'CRITICAL',
      lat,
      lng,
      gps: [lat, lng],
      timestamp: new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour12: false }) + ' IST',
      status: 'ACTIVE_BLOCKAGE',
      radiusMeters: hazardData.severity === 'CRITICAL' ? 12000 : 6000
    };

    this.customMissions.unshift(newMission);

    // Escalate risk on Route A and force Route B recommendation
    this.environment.rainfall = Math.max(this.environment.rainfall, 54);
    this.environment.landslideProb = 96;
    this.environment.roadSurfaceCondition = 'IMPASSABLE';
    this.environment.bridgeAccessibility = 'CLOSED';
    this.recomputeIntelligence();
    
    if (this.routesEvaluation && this.routesEvaluation.routeA) {
      this.routesEvaluation.routeA.riskPct = 96;
      this.routesEvaluation.routeA.status = 'BLOCKED';
    }
    if (this.routesEvaluation) {
      this.routesEvaluation.recommendedRouteId = 'ROUTE_B';
    }

    // Broadcast automated Reroute Advisory
    this.sendPttMessage({
      sender: 'Emergency C2 Controller',
      role: 'CONTROL_ROOM',
      text: `ATTENTION ALL UNITS: Severe ${hazardData.type || 'Landslide'} at [${lat.toFixed(3)}, ${lng.toFixed(3)}]. Route A blocked. Divert to Route B via Umrangso bypass immediately.`
    });

    this.addTimelineEvent({
      time: newMission.timestamp,
      title: `HAZARD LAUNCHED: ${newMission.name}`,
      desc: `Obstruction dropped at [${lat.toFixed(4)}, ${lng.toFixed(4)}]. NH-6 Route A blocked (Risk: 96%). Route B bypass recommended.`,
      type: 'danger'
    });

    return this.getState();
  }

  advanceVehicle(vehicleId = 'TRUCK-07') {
    const vehicle = this.vehicles.find(v => v.id === vehicleId || v.vehicleId === vehicleId || v.portCode === vehicleId) || this.vehicles[0];
    if (!vehicle) return this.getState();

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

    let curIdx = vehicle.currentWaypointIdx ?? 0;
    let nextIdx = curIdx + 1;
    if (nextIdx >= waypoints.length) nextIdx = 0;

    vehicle.currentWaypointIdx = nextIdx;
    vehicle.coordinates = waypoints[nextIdx].coords;
    vehicle.currentLocationName = waypoints[nextIdx].name;
    vehicle.progressPct = Math.round((nextIdx / (waypoints.length - 1)) * 100);
    vehicle.speed = Math.floor(46 + Math.random() * 12);
    vehicle.eta = `${Math.max(1, 8 - nextIdx)}h ${Math.floor(10 + Math.random() * 40)}m`;

    this.addTimelineEvent({
      time: new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour12: false }) + ' IST',
      title: `GPS TELEMETRY UPDATE: ${vehicle.vehicleId || vehicle.id}`,
      desc: `Advanced to ${vehicle.currentLocationName} [${vehicle.coordinates[0].toFixed(4)}, ${vehicle.coordinates[1].toFixed(4)}]. Speed: ${vehicle.speed} km/h.`,
      type: 'info'
    });

    return this.getState();
  }

  reverseVehicle(vehicleId = 'TRUCK-07') {
    const vehicle = this.vehicles.find(v => v.id === vehicleId || v.vehicleId === vehicleId || v.portCode === vehicleId) || this.vehicles[0];
    if (!vehicle) return this.getState();

    const isRouteB = vehicle.assignedRoute === 'ROUTE_B' || vehicle.assignedRoute === 'ROUTE_B_DIVERSION';
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

    let curIdx = vehicle.currentWaypointIdx ?? 0;
    let prevIdx = Math.max(0, curIdx - 1);

    vehicle.currentWaypointIdx = prevIdx;
    vehicle.coordinates = waypoints[prevIdx].coords;
    vehicle.currentLocationName = waypoints[prevIdx].name;
    vehicle.progressPct = Math.round((prevIdx / (waypoints.length - 1)) * 100);
    vehicle.speed = 35;
    vehicle.eta = `${Math.max(1, waypoints.length - prevIdx)}h 20m`;

    this.addTimelineEvent({
      time: new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour12: false }) + ' IST',
      title: `GPS REVERSE STEP: ${vehicle.vehicleId || vehicle.id}`,
      desc: `Reversed to safety landmark ${vehicle.currentLocationName} [${vehicle.coordinates[0].toFixed(4)}, ${vehicle.coordinates[1].toFixed(4)}].`,
      type: 'info'
    });

    return this.getState();
  }

  acceptReroute(vehicleId = 'TRUCK-07') {
    const vehicle = this.vehicles.find(v => v.id === vehicleId || v.vehicleId === vehicleId || v.portCode === vehicleId) || this.vehicles[0];
    if (vehicle) {
      vehicle.assignedRoute = 'ROUTE_B';
      vehicle.currentLocationName = 'Umrangso Safe Rock Bypass (Route B)';
      vehicle.coordinates = [25.4120, 92.9820];
      vehicle.currentWaypointIdx = 5;
      vehicle.progressPct = 65;
      vehicle.speed = 52;
      vehicle.status = 'REROUTED';
      vehicle.eta = '3h 20m';
    }

    this.addTimelineEvent({
      time: new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour12: false }) + ' IST',
      title: `REROUTE CONFIRMED: ${vehicle?.vehicleNumber || vehicle?.id || vehicleId}`,
      desc: `Driver diverted successfully onto Route B (Umrangso bypass). Delivery safety preserved.`,
      type: 'success'
    });

    return this.getState();
  }

  sendPttMessage(msgData) {
    const newMsg = {
      id: `PTT-${Date.now().toString().slice(-4)}`,
      sender: msgData.sender || 'Operator',
      role: msgData.role || 'FIELD',
      timestamp: new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour12: false }) + ' IST',
      text: msgData.text,
      audioSimulated: true
    };
    this.pttFeed.unshift(newMsg);
    return this.getState();
  }

  addTimelineEvent(event) {
    this.timeline.unshift(event);
    if (this.timeline.length > 50) this.timeline.pop();
  }

  getState() {
    return {
      environment: this.environment,
      activeScenarioPreset: this.activeScenarioPreset,
      environmentLastUpdated: this.environmentLastUpdated,
      aiIntelligence: this.aiIntelligence,
      routesEvaluation: this.routesEvaluation,
      dispatches: this.dispatches,
      vehicles: this.vehicles,
      alerts: this.alerts,
      pttFeed: this.pttFeed,
      targetedPin: this.targetedPin,
      customMissions: this.customMissions,
      timeline: this.timeline
    };
  }
}

export const systemState = new SystemState();
