/**
 * Authoritative Server-Side In-Memory State Store
 * Supports Checkpost Dispatches with Port Codes, AI Risk Predictions, Live CV Dashcam Hazard Ingestion & Dynamic Rerouting
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
    networkConnectivity: 'ONLINE_4G_5G',
    soilMoistureIndex: 32,
    slopeAngleDeg: 28
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
    networkConnectivity: 'ONLINE_4G_5G',
    soilMoistureIndex: 78,
    slopeAngleDeg: 42
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
    networkConnectivity: 'DEGRADED_MESH',
    soilMoistureIndex: 94,
    slopeAngleDeg: 48
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
        progressPct: 0,
        currentWaypointIdx: 0,
        coordinates: [26.11586, 91.8016],
        originGps: [26.11586, 91.8016],
        destGps: [24.83297, 92.77909],
        currentLocationName: 'Khanapara Staging Hub, Guwahati',
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
    this.cvDetections = [];

    this.recomputeIntelligence();
  }

  recomputeIntelligence() {
    const aiResult = calculateAiRisk(this.environment);
    this.aiIntelligence = {
      riskLevel: aiResult.riskLevel,
      accessibilityRiskPct: aiResult.accessibilityRiskPct,
      statusLabel: aiResult.statusLabel,
      evaluationConfidence: aiResult.evaluationConfidence,
      modelType: aiResult.modelType,
      xaiContributions: aiResult.xaiContributions,
      timeSeriesForecast: aiResult.timeSeriesForecast,
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
      name: dispatchData.driverName ? `${dispatchData.driverName} (${vehicleId})` : vehicleId,
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
      speed: 48,
      progressPct: 0,
      currentWaypointIdx: 0,
      coordinates: [26.1445, 91.7362],
      currentLocationName: dispatchData.origin || 'Guwahati Staging Hub',
      createdAt: new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour12: false }) + ' IST'
    };

    // Keep only the fresh user-dispatched truck to prevent ghost duplicate trucks
    this.dispatches = [newDispatch];
    this.vehicles = [newDispatch];

    this.addTimelineEvent({
      time: newDispatch.createdAt,
      title: `CHECKPOST DISPATCH: ${portCode}`,
      desc: `Vehicle ${newDispatch.vehicleNumber} dispatched for ${newDispatch.destination}. Driver: ${newDispatch.driverName}. Port Code: ${portCode}`,
      type: 'success'
    });

    return {
      portCode,
      vehicleId,
      state: this.getState()
    };
  }

  setEnvironmentParam(key, value) {
    if (this.environment[key] !== undefined) {
      this.environment[key] = value;
      this.environmentLastUpdated = new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour12: false }) + ' IST';
      this.recomputeIntelligence();

      this.addTimelineEvent({
        time: this.environmentLastUpdated,
        title: `ENV SENSOR TELEMETRY UPDATED`,
        desc: `Parameter '${key}' updated to ${value}. Risk recalculation executed: ${this.aiIntelligence.accessibilityRiskPct}%.`,
        type: 'weather'
      });
    }
    return this.getState();
  }

  applyScenarioPreset(presetKey) {
    if (SCENARIO_PRESETS[presetKey]) {
      this.activeScenarioPreset = presetKey;
      this.environment = { ...SCENARIO_PRESETS[presetKey] };
      this.environmentLastUpdated = new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour12: false }) + ' IST';
      this.recomputeIntelligence();

      this.addTimelineEvent({
        time: this.environmentLastUpdated,
        title: `SCENARIO SIMULATION: ${SCENARIO_PRESETS[presetKey].name}`,
        desc: `Environmental and geotechnical parameters synchronized. AI computed risk: ${this.aiIntelligence.accessibilityRiskPct}%.`,
        type: presetKey === 'NORMAL' ? 'success' : presetKey === 'LANDSLIDE' ? 'danger' : 'weather'
      });
    }
    return this.getState();
  }

  setTargetedPin(lat, lng, label, sector) {
    this.targetedPin = {
      lat: parseFloat(lat),
      lng: parseFloat(lng),
      label: label || 'Targeted GPS Point',
      sector: sector || 'NER Monitored Sector'
    };

    this.addTimelineEvent({
      time: new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour12: false }) + ' IST',
      title: `TACTICAL PIN TARGETED: ${this.targetedPin.label}`,
      desc: `Coordinates set to [${this.targetedPin.lat.toFixed(4)}, ${this.targetedPin.lng.toFixed(4)}]. Sector: ${this.targetedPin.sector}`,
      type: 'info'
    });

    return this.getState();
  }

  // Report Edge AI Dashcam Hazard Detection from Driver HUD
  reportCvHazard(hazardData) {
    const lat = parseFloat(hazardData.lat) || (this.targetedPin ? this.targetedPin.lat : 25.1120);
    const lng = parseFloat(hazardData.lng) || (this.targetedPin ? this.targetedPin.lng : 92.3850);

    const cvDetection = {
      id: `CV-${Date.now().toString().slice(-4)}`,
      label: hazardData.label || 'Rockfall Debris / Pavement Cutoff',
      confidence: hazardData.confidence || 94.6,
      distanceAheadMeters: hazardData.distanceAheadMeters || 45,
      lat,
      lng,
      timestamp: new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour12: false }) + ' IST',
      vehicleId: hazardData.vehicleId || 'TRUCK-07',
      driverName: hazardData.driverName || 'Driver Cockpit'
    };

    this.cvDetections.unshift(cvDetection);
    if (this.cvDetections.length > 20) this.cvDetections.pop();

    // Auto-launch hazard mission and trigger auto-reroute
    return this.launchHazard({
      type: hazardData.hazardType || 'Rockfall / Debris',
      name: `AI Dashcam Detected: ${cvDetection.label}`,
      severity: 'CRITICAL',
      lat,
      lng
    });
  }

  launchHazard(hazardData) {
    const lat = parseFloat(hazardData.lat) || (this.targetedPin ? this.targetedPin.lat : 25.1120);
    const lng = parseFloat(hazardData.lng) || (this.targetedPin ? this.targetedPin.lng : 92.3850);

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

    // Escalate risk on Route A and set AI recommendation to Route B
    this.environment.rainfall = Math.max(this.environment.rainfall, 54);
    this.environment.landslideProb = 96;
    this.environment.soilMoistureIndex = 95;
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

    // AUTOMATIC AUTO-REROUTE: Automatically shift in-transit vehicles onto the Safe Connector Bypass
    this.vehicles.forEach(vehicle => {
      if (vehicle.assignedRoute === 'ROUTE_A') {
        vehicle.assignedRoute = 'ROUTE_B_DIVERSION';
        vehicle.status = 'REROUTED';
        vehicle.autoRerouted = true;
      }
    });

    // Broadcast automated Reroute Advisory
    this.sendPttMessage({
      sender: 'Emergency C2 Controller',
      role: 'CONTROL_ROOM',
      text: `ATTENTION: Major ${hazardData.type || 'Landslide'} at [${lat.toFixed(3)}, ${lng.toFixed(3)}]. AI Auto-Reroute active via Jowai-Umrangso bypass to Silchar.`
    });

    this.addTimelineEvent({
      time: newMission.timestamp,
      title: `HAZARD LAUNCHED: ${newMission.name}`,
      desc: `Obstruction dropped at [${lat.toFixed(4)}, ${lng.toFixed(4)}]. NH-6 Route A blocked (Risk: 96%). Active fleet auto-diverted to Umrangso Safe Bypass.`,
      type: 'danger'
    });

    return this.getState();
  }

  getDenseWaypoints(routeType) {
    if (routeType === 'ROUTE_B') {
      return [
        { coords: [26.1445, 91.7362], name: 'Guwahati Central Depot' },
        { coords: [26.1150, 91.8420], name: 'Khanapara East Gate' },
        { coords: [26.1620, 91.9540], name: 'Sonapur Assam Highway' },
        { coords: [26.1820, 92.0540], name: 'Jagiroad Paper Mill Crossing' },
        { coords: [26.2450, 92.2150], name: 'Dharamtul Highway Sector' },
        { coords: [26.2950, 92.3920], name: 'Raha Toll Plaza' },
        { coords: [26.3450, 92.6840], name: 'Nagaon Central Bypass' },
        { coords: [26.2420, 92.8650], name: 'Kathiatoli Junction' },
        { coords: [26.1280, 93.0320], name: 'Dabaka Checkpost' },
        { coords: [26.0120, 93.0950], name: 'Hojai Agriculture Belt' },
        { coords: [25.8920, 93.1350], name: 'Lanka Rail Crossing' },
        { coords: [25.7510, 93.1750], name: 'Lumding Junction Ridge' },
        { coords: [25.6350, 93.1420], name: 'Langting Hill Pass' },
        { coords: [25.5420, 93.0850], name: 'Hatikhali Causeway' },
        { coords: [25.4850, 93.0250], name: 'Mahur Reinforced Bridge' },
        { coords: [25.4120, 92.9820], name: 'Umrangso Safe Rock Valley' },
        { coords: [25.3250, 92.9120], name: 'Gunjung Mountain Pass' },
        { coords: [25.2420, 92.8540], name: 'Jatinga Cloud Valley' },
        { coords: [25.1820, 92.8120], name: 'Harangajao Valley Bridge' },
        { coords: [25.0850, 92.7950], name: 'Ditokcherra Reinforced Tunnel' },
        { coords: [25.0120, 92.7820], name: 'Bandarkhal Causeway' },
        { coords: [24.9450, 92.7750], name: 'Damcherra Approach' },
        { coords: [24.8850, 92.7680], name: 'Silchar North Gate' },
        { coords: [24.8333, 92.7789], name: 'Silchar District Civil Hospital (Destination)' }
      ];
    }

    if (routeType === 'ROUTE_B_DIVERSION') {
      return [
        { coords: [26.1445, 91.7362], name: 'Guwahati Depot' },
        { coords: [26.0820, 91.8020], name: 'Khanapara Gate' },
        { coords: [26.0120, 91.8450], name: 'Jorabat Mountain Incline' },
        { coords: [25.9610, 91.8845], name: 'Nongpoh Valley Sector' },
        { coords: [25.8850, 91.8720], name: 'Umling Highway Rest Stop' },
        { coords: [25.7920, 91.8890], name: 'Umsning Expressway Node' },
        { coords: [25.6840, 91.9020], name: 'Umiam Lake Bridge' },
        { coords: [25.6120, 91.8950], name: 'Mawlai North Gate' },
        { coords: [25.5788, 91.8933], name: 'Shillong Central Hub' },
        { coords: [25.5420, 91.9650], name: 'Laitkor Peak' },
        { coords: [25.5120, 92.0520], name: 'Mawryngkneng' },
        { coords: [25.4850, 92.1250], name: 'Wahiajer Valley' },
        { coords: [25.4650, 92.1680], name: 'Ummulong Bypass' },
        { coords: [25.4500, 92.2000], name: 'Jowai Tactical Bypass Junction' },
        { coords: [25.4820, 92.3500], name: 'Shangpung Mountain Ridge' },
        { coords: [25.5200, 92.5200], name: 'Garampani Thermal Basin' },
        { coords: [25.4120, 92.9820], name: 'Umrangso Safe Rock Valley' },
        { coords: [25.3250, 92.9120], name: 'Gunjung Mountain Pass' },
        { coords: [25.2420, 92.8540], name: 'Jatinga Cloud Valley' },
        { coords: [25.1820, 92.8120], name: 'Harangajao Valley Bridge' },
        { coords: [25.0850, 92.7950], name: 'Ditokcherra Reinforced Tunnel' },
        { coords: [25.0120, 92.7820], name: 'Bandarkhal Causeway' },
        { coords: [24.9450, 92.7750], name: 'Damcherra Approach' },
        { coords: [24.8850, 92.7680], name: 'Silchar North Gate' },
        { coords: [24.8333, 92.7789], name: 'Silchar District Civil Hospital (Destination)' }
      ];
    }

    // Default: Route A (NH-6 Primary)
    return [
      { coords: [26.1445, 91.7362], name: 'Guwahati Depot' },
      { coords: [26.0820, 91.8020], name: 'Khanapara Gate' },
      { coords: [26.0120, 91.8450], name: 'Jorabat Incline' },
      { coords: [25.9610, 91.8845], name: 'Nongpoh Valley Sector' },
      { coords: [25.8850, 91.8720], name: 'Umling Highway Rest Stop' },
      { coords: [25.7920, 91.8890], name: 'Umsning Expressway Node' },
      { coords: [25.6840, 91.9020], name: 'Umiam Lake Bridge' },
      { coords: [25.6120, 91.8950], name: 'Mawlai North Gate' },
      { coords: [25.5788, 91.8933], name: 'Shillong Central Hub' },
      { coords: [25.5420, 91.9650], name: 'Laitkor Peak' },
      { coords: [25.5120, 92.0520], name: 'Mawryngkneng' },
      { coords: [25.485, 92.125], name: 'Wahiajer Valley' },
      { coords: [25.465, 92.168], name: 'Ummulong Bypass' },
      { coords: [25.4500, 92.2000], name: 'Jowai Central Gate' },
      { coords: [25.4120, 92.2450], name: 'Lad Rymbai Coal Basin' },
      { coords: [25.3250, 92.3120], name: 'Khliehriat District Hub' },
      { coords: [25.2420, 92.3540], name: 'Lumshnong Cement Corridor' },
      { coords: [25.1120, 92.3850], name: 'Sonapur Tunnel & High Vulnerability Slide Zone' },
      { coords: [24.9850, 92.4250], name: 'Malidor Meghalaya-Assam Border' },
      { coords: [24.8950, 92.5120], name: 'Kalain Tea Estate Road' },
      { coords: [24.8520, 92.6540], name: 'Badarpur Junction Crossing' },
      { coords: [24.8333, 92.7789], name: 'Silchar District Civil Hospital (Destination)' }
    ];
  }

  advanceVehicle(vehicleId = 'TRUCK-07') {
    const vehicle = this.vehicles.find(v => v.id === vehicleId || v.vehicleId === vehicleId || v.portCode === vehicleId) || this.vehicles[0];
    if (!vehicle) return this.getState();

    const waypoints = this.getDenseWaypoints(vehicle.assignedRoute);
    let curIdx = vehicle.currentWaypointIdx ?? 0;
    let nextIdx = curIdx + 1;

    if (nextIdx >= waypoints.length) {
      vehicle.status = 'DELIVERED';
      vehicle.progressPct = 100;
      vehicle.speed = 0;
      vehicle.eta = 'ARRIVED';
      vehicle.coordinates = waypoints[waypoints.length - 1].coords;
      vehicle.currentLocationName = waypoints[waypoints.length - 1].name;

      this.addTimelineEvent({
        time: new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour12: false }) + ' IST',
        title: `DELIVERY COMPLETED: ${vehicle.vehicleNumber || vehicle.id}`,
        desc: `Mission Successful! Critical Cold-Chain Medical Supplies arrived securely at ${vehicle.destination}. Zero vaccine spoilage recorded.`,
        type: 'success'
      });
      return this.getState();
    }

    vehicle.currentWaypointIdx = nextIdx;
    vehicle.coordinates = waypoints[nextIdx].coords;
    vehicle.currentLocationName = waypoints[nextIdx].name;
    vehicle.progressPct = Math.round((nextIdx / (waypoints.length - 1)) * 100);
    vehicle.speed = Math.floor(40 + Math.random() * 18);
    const remMinutes = Math.max(5, Math.round((waypoints.length - 1 - nextIdx) * 16));
    vehicle.eta = `${Math.floor(remMinutes / 60)}h ${remMinutes % 60}m`;

    this.addTimelineEvent({
      time: new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour12: false }) + ' IST',
      title: `GPS TELEMETRY: ${vehicle.vehicleId || vehicle.id}`,
      desc: `Vehicle advanced to node ${vehicle.currentLocationName} [${vehicle.coordinates[0].toFixed(4)}, ${vehicle.coordinates[1].toFixed(4)}]. Speed: ${vehicle.speed} km/h, Progress: ${vehicle.progressPct}%.`,
      type: 'info'
    });

    return this.getState();
  }

  reverseVehicle(vehicleId = 'TRUCK-07') {
    const vehicle = this.vehicles.find(v => v.id === vehicleId || v.vehicleId === vehicleId || v.portCode === vehicleId) || this.vehicles[0];
    if (!vehicle) return this.getState();

    const waypoints = this.getDenseWaypoints(vehicle.assignedRoute);
    let curIdx = vehicle.currentWaypointIdx ?? 0;
    let prevIdx = Math.max(0, curIdx - 1);

    vehicle.currentWaypointIdx = prevIdx;
    vehicle.coordinates = waypoints[prevIdx].coords;
    vehicle.currentLocationName = waypoints[prevIdx].name;
    vehicle.progressPct = Math.round((prevIdx / (waypoints.length - 1)) * 100);
    vehicle.speed = 32;
    const remMinutes = Math.max(15, Math.round((waypoints.length - 1 - prevIdx) * 18));
    vehicle.eta = `${Math.floor(remMinutes / 60)}h ${remMinutes % 60}m`;

    this.addTimelineEvent({
      time: new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour12: false }) + ' IST',
      title: `GPS REVERSE STEP: ${vehicle.vehicleId || vehicle.id}`,
      desc: `Reversed to previous road node ${vehicle.currentLocationName} [${vehicle.coordinates[0].toFixed(4)}, ${vehicle.coordinates[1].toFixed(4)}].`,
      type: 'info'
    });

    return this.getState();
  }

  acceptReroute(vehicleId = 'TRUCK-07') {
    const vehicle = this.vehicles.find(v => v.id === vehicleId || v.vehicleId === vehicleId || v.portCode === vehicleId) || this.vehicles[0];
    if (vehicle) {
      vehicle.assignedRoute = 'ROUTE_B_DIVERSION';
      vehicle.status = 'REROUTED';
      vehicle.autoRerouted = true;
      const waypoints = this.getDenseWaypoints('ROUTE_B_DIVERSION');
      vehicle.currentWaypointIdx = Math.min(vehicle.currentWaypointIdx || 13, waypoints.length - 1);
      vehicle.coordinates = waypoints[vehicle.currentWaypointIdx].coords;
      vehicle.currentLocationName = waypoints[vehicle.currentWaypointIdx].name;
      vehicle.progressPct = Math.round((vehicle.currentWaypointIdx / (waypoints.length - 1)) * 100);
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
      timeline: this.timeline,
      cvDetections: this.cvDetections
    };
  }
}

export const systemState = new SystemState();
