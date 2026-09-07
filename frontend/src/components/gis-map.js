/**
 * Leaflet Interactive Tactical GIS Map Component for North Eastern Region
 * Multi-route rendering (Route A, Route B, Route C), River Gauges, Weather Sensors, and Layer Toggles
 */

import { NER_CENTER, NER_DEFAULT_ZOOM, CORRIDORS, DISASTER_ZONES, RIVER_GAUGES, WEATHER_OBSERVATIONS, NER_REGIONS } from '../data/geo-data.js';
import { store } from '../state/store.js';

export class GisMap {
  constructor(mapContainerId, options = {}) {
    this.containerId = mapContainerId;
    this.options = options;
    this.map = null;
    this.layers = {
      corridors: null,
      hazards: null,
      incidents: null,
      vehicles: null,
      gauges: null,
      weather: null
    };
    this.visibleLayers = {
      corridors: true,
      hazards: true,
      incidents: true,
      vehicles: true,
      gauges: true,
      weather: true
    };
    this.tileLayers = {};
    this.activeTile = 'dark';
    this.onVehicleClick = options.onVehicleClick || null;
    this.onRoadClick = options.onRoadClick || null;
    this.onIncidentClick = options.onIncidentClick || null;
  }

  init() {
    const container = document.getElementById(this.containerId);
    if (!container) return;

    if (this.map) {
      try {
        this.map.remove();
      } catch (e) {}
      this.map = null;
    }

    if (container._leaflet_id) {
      container._leaflet_id = null;
    }

    this.map = L.map(this.containerId, {
      center: this.options.center || NER_CENTER,
      zoom: this.options.zoom || NER_DEFAULT_ZOOM,
      zoomControl: false,
      attributionControl: false
    });

    L.control.zoom({ position: 'topright' }).addTo(this.map);

    // Clean Free Basemaps (Watermark-free)
    // Dark Basemap (ESRI Dark Gray Canvas - 100% Free & Crisp)
    this.tileLayers.dark = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 16,
      attribution: 'Esri, HERE, Garmin, OpenStreetMap'
    }).addTo(this.map);

    // Reference Overlay (Street names & borders)
    this.tileLayers.darkRef = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 16
    }).addTo(this.map);

    // Satellite Basemap (ESRI World Imagery)
    this.tileLayers.satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 18
    });

    // Topo Basemap (OpenTopoMap)
    this.tileLayers.topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
      maxZoom: 17
    });

    // Layer Groups
    this.layers.hazards = L.layerGroup().addTo(this.map);
    this.layers.corridors = L.layerGroup().addTo(this.map);
    this.layers.gauges = L.layerGroup().addTo(this.map);
    this.layers.weather = L.layerGroup().addTo(this.map);
    this.layers.incidents = L.layerGroup().addTo(this.map);
    this.layers.vehicles = L.layerGroup().addTo(this.map);

    this.renderAll();

    // Only render full tactical command HUD on Control Room and Simulator, NOT on Driver Navigation Cockpit
    if (!this.options.isDriverView) {
      this.addTacticalHudControls();
    }

    setTimeout(() => {
      this.map.invalidateSize();
    }, 120);
  }

  setTileLayer(type) {
    if (this.tileLayers[this.activeTile]) {
      this.map.removeLayer(this.tileLayers[this.activeTile]);
    }
    if (this.tileLayers[type]) {
      this.tileLayers[type].addTo(this.map);
      this.activeTile = type;
    }
  }

  toggleLayer(layerName) {
    if (this.visibleLayers.hasOwnProperty(layerName)) {
      this.visibleLayers[layerName] = !this.visibleLayers[layerName];
      if (this.visibleLayers[layerName]) {
        this.layers[layerName].addTo(this.map);
      } else {
        this.map.removeLayer(this.layers[layerName]);
      }
    }
  }

  renderAll() {
    this.renderHazards();
    this.renderCorridors();
    this.renderRiverGauges();
    this.renderWeatherSensors();
    this.renderIncidents();
    this.renderVehicles();
    this.renderCustomMissions();
  }

  renderHazards() {
    this.layers.hazards.clearLayers();

    DISASTER_ZONES.forEach(zone => {
      const polygon = L.polygon(zone.polygon, {
        color: zone.color,
        fillColor: zone.fillColor,
        fillOpacity: zone.fillOpacity,
        weight: 2,
        dashArray: '5, 8'
      });

      polygon.bindTooltip(`
        <div class="font-sans text-xs p-1">
          <div class="font-bold ${zone.type === 'LANDSLIDE' ? 'text-rose-400' : 'text-cyan-400'} uppercase tracking-wider flex items-center gap-1.5">
            <span class="w-2.5 h-2.5 rounded-full ${zone.type === 'LANDSLIDE' ? 'bg-rose-500' : 'bg-cyan-500'} animate-ping"></span>
            ${zone.name}
          </div>
          <div class="text-slate-300 mt-1">Severity: <strong class="text-white">${zone.severity}</strong></div>
          <div class="text-slate-400 font-mono text-[11px]">${zone.rainfallRate || zone.riverLevel}</div>
          <div class="text-rose-300 font-mono font-bold mt-1">Disruption Probability: ${zone.riskScore}%</div>
        </div>
      `, { sticky: true });

      polygon.addTo(this.layers.hazards);
    });
  }

  renderCorridors() {
    this.layers.corridors.clearLayers();
    const { routesEvaluation, aiIntelligence, vehicles, driverContext } = store.state;
    const activeVehicle = vehicles.find(v => (v.id && v.id === driverContext.activeVehicleId) || (v.vehicleId && v.vehicleId === driverContext.activeVehicleId) || (v.portCode && v.portCode === driverContext.activeVehicleId)) || vehicles[0];
    const isVehicleRerouted = activeVehicle?.status === 'REROUTED' || activeVehicle?.assignedRoute === 'ROUTE_B_DIVERSION' || activeVehicle?.assignedRoute === 'ROUTE_B';
    const hasHazard = (store.state.customMissions || []).some(m => m.type === 'HAZARD_INJECTION');

    // 1. ROUTE A — Primary Arterial (NH-6)
    const isRouteAHighRisk = routesEvaluation.routeA.riskPct >= 70 || hasHazard;
    const isRouteAMedRisk = routesEvaluation.routeA.riskPct >= 40;
    
    // If auto-rerouted via connector, Route A is split: Active Green up to Jowai diversion, and Blocked Red after Jowai through Sonapur
    if (isVehicleRerouted || hasHazard) {
      // Blocked section of Route A (Jowai -> Ladrymbai -> Khliehriat -> Sonapur -> Kalain)
      const blockedSectionWaypoints = CORRIDORS.ROUTE_A.waypoints.slice(13, 21); // Jowai to Kalain
      const blockedLine = L.polyline(blockedSectionWaypoints, {
        color: '#f43f5e',
        weight: 5,
        opacity: 0.85,
        dashArray: '8, 8',
        className: 'animated-dash-route-a-danger'
      });
      blockedLine.bindTooltip(`
        <div class="font-sans text-xs p-1">
          <div class="font-bold text-rose-400 flex items-center justify-between gap-3">
            <span>ROUTE A CHOKEPOINT (BLOCKED)</span>
            <span class="font-mono text-[10px] px-1.5 py-0.2 rounded bg-rose-950 text-rose-300 border border-rose-600">IMPASSABLE</span>
          </div>
          <div class="text-rose-200 mt-1">Landslide debris blocking Sonapur Pass (Km 142)</div>
        </div>
      `, { sticky: true });
      blockedLine.addTo(this.layers.corridors);

      // ACTIVE AUTO-REROUTE PATH (Guwahati -> Shillong -> Jowai -> Nartiang -> Khanduli -> Umrangso -> Harangajao -> Silchar) - 100% VIBRANT GREEN
      const activeNavLine = L.polyline(CORRIDORS.ROUTE_B_DIVERSION.waypoints, {
        color: '#10b981',
        weight: 6.5,
        opacity: 1,
        className: 'animated-dash-route-b'
      });
      activeNavLine.bindTooltip(`
        <div class="font-sans text-xs p-1">
          <div class="font-bold text-emerald-400 flex items-center justify-between gap-3">
            <span>⚡ AI ACTIVE NAVIGATION ROUTE (SAFE BYPASS)</span>
            <span class="font-mono text-[10px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-500">OPTIMAL</span>
          </div>
          <div class="text-slate-200 mt-1">Direct safe transit: Jowai ↔ Umrangso Connector ↔ Route B Bedrock</div>
          <div class="text-emerald-300 font-mono text-[10px] mt-0.5">Clear of all landslides · Destination: Silchar Hospital</div>
        </div>
      `, { sticky: true });
      activeNavLine.addTo(this.layers.corridors);

    } else {
      // Normal Route A Active in Green
      const routeAColor = isRouteAHighRisk ? '#f43f5e' : isRouteAMedRisk ? '#f59e0b' : '#10b981';
      const routeALine = L.polyline(CORRIDORS.ROUTE_A.waypoints, {
        color: routeAColor,
        weight: 5.5,
        opacity: 0.95,
        className: isRouteAHighRisk ? 'animated-dash-route-a-danger' : 'animated-dash-route-a'
      });
      routeALine.bindTooltip(`
        <div class="font-sans text-xs p-1">
          <div class="font-bold text-emerald-400 flex items-center justify-between gap-3">
            <span>ROUTE A (Primary Corridor NH-6)</span>
            <span class="font-mono text-[10px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-600">${routesEvaluation.routeA.riskPct}% RISK</span>
          </div>
          <div class="text-slate-300 mt-1">Status: <strong class="text-emerald-400 font-bold">${routesEvaluation.routeA.status}</strong></div>
          <div class="text-slate-400 font-mono text-[10px]">Distance: 315 km · ETA: ${routesEvaluation.routeA.eta}</div>
        </div>
      `, { sticky: true });
      routeALine.addTo(this.layers.corridors);
    }

    // 2. ROUTE B — AI Safe Alternate (NH-27 / Umrangso Bypass)
    const isRouteBRecommended = routesEvaluation.recommendedRouteId === 'ROUTE_B';
    const routeBLine = L.polyline(CORRIDORS.ROUTE_B.waypoints, {
      color: '#059669',
      weight: isRouteBRecommended ? 4.5 : 3.5,
      opacity: 0.85,
      dashArray: '8, 8',
      className: 'animated-dash-route-b'
    });

    routeBLine.on('click', () => {
      if (this.onRoadClick) this.onRoadClick('corridor-route-b');
    });

    routeBLine.bindTooltip(`
      <div class="font-sans text-xs p-1">
        <div class="font-bold text-emerald-400 flex items-center justify-between gap-3">
          <span>ROUTE B (Umrangso Ridge Bypass)</span>
          <span class="font-mono text-[10px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-600">${routesEvaluation.routeB.riskPct}% RISK</span>
        </div>
        <div class="text-slate-300 mt-1">Status: <strong class="text-emerald-400 font-bold">${routesEvaluation.routeB.status}</strong></div>
        <div class="text-slate-400 font-mono text-[10px]">Distance: 348 km · Safe Bedrock</div>
      </div>
    `, { sticky: true });

    routeBLine.addTo(this.layers.corridors);

    // 3. ROUTE C — Emergency Northern Ridge Bypass
    const routeCLine = L.polyline(CORRIDORS.ROUTE_C.waypoints, {
      color: '#a855f7',
      weight: 3.5,
      opacity: 0.85,
      dashArray: '6, 6',
      className: 'animated-dash-route-c'
    });

    routeCLine.on('click', () => {
      if (this.onRoadClick) this.onRoadClick('corridor-route-c');
    });

    routeCLine.bindTooltip(`
      <div class="font-sans text-xs p-1">
        <div class="font-bold text-purple-400 flex items-center justify-between gap-3">
          <span>ROUTE C (Emergency Northern Bypass)</span>
          <span class="font-mono text-[10px] px-1.5 py-0.2 rounded bg-purple-950 text-purple-300 border border-purple-600">${routesEvaluation.routeC.riskPct}% RISK</span>
        </div>
        <div class="text-slate-300 mt-1">Status: <strong class="text-purple-400 font-bold">${routesEvaluation.routeC.status}</strong></div>
        <div class="text-slate-400 font-mono text-[10px]">Distance: 380 km (+65 km) · ETA: ${routesEvaluation.routeC.eta}</div>
      </div>
    `, { sticky: true });

    routeCLine.addTo(this.layers.corridors);

    // 4. NH-102 Manipur Lifeline
    const nh102Line = L.polyline(CORRIDORS.NH102_MANIPUR.waypoints, {
      color: '#06b6d4',
      weight: 3.5,
      opacity: 0.8
    });
    nh102Line.on('click', () => {
      if (this.onRoadClick) this.onRoadClick('corridor-nh102');
    });
    nh102Line.addTo(this.layers.corridors);

    // 5. NH-13 Sela Pass High Altitude
    const nh13Line = L.polyline(CORRIDORS.NH13_SELA.waypoints, {
      color: '#f43f5e',
      weight: 3.5,
      opacity: 0.85,
      dashArray: '5, 5'
    });
    nh13Line.on('click', () => {
      if (this.onRoadClick) this.onRoadClick('corridor-nh13-sela');
    });
    nh13Line.addTo(this.layers.corridors);

    // 6. INTERMEDIATE CONNECTORS & DIVERSION ROADS
    const connectors = [
      {
        data: CORRIDORS.CONNECTOR_JOWAI_UMRANGSO,
        color: '#38bdf8', // Cyan
        name: 'Jowai ↔ Umrangso Cross-Ridge Connector (SH-6)'
      },
      {
        data: CORRIDORS.CONNECTOR_KHLIEHRIAT_HARANGAJAO,
        color: '#fbbf24', // Amber
        name: 'Khliehriat ↔ Harangajao Mountain Cut (SH-17)'
      },
      {
        data: CORRIDORS.CONNECTOR_SHILLONG_JAGIROAD,
        color: '#34d399', // Emerald
        name: 'Shillong ↔ Jagiroad Valley Link (SH-3)'
      },
      {
        data: CORRIDORS.CONNECTOR_LUMDING_DIMAPUR,
        color: '#c084fc', // Purple
        name: 'Lumding ↔ Haflong ↔ Dimapur Lateral Link'
      }
    ];

    connectors.forEach(conn => {
      if (!conn.data || !conn.data.waypoints) return;
      const connLine = L.polyline(conn.data.waypoints, {
        color: conn.color,
        weight: 3.8,
        opacity: 0.85,
        dashArray: '4, 6'
      });

      connLine.bindTooltip(`
        <div class="font-sans text-xs p-1">
          <div class="font-bold text-cyan-300">${conn.name}</div>
          <div class="text-slate-300 text-[11px] mt-0.5">Emergency Inter-Corridor Feeder Route</div>
          <div class="text-slate-400 font-mono text-[10px]">${conn.data.distanceStr || 'Cross-Link'} · Risk: ${conn.data.baseRiskScore || 15}%</div>
        </div>
      `, { sticky: true });

      connLine.addTo(this.layers.corridors);
    });
  }

  renderRiverGauges() {
    this.layers.gauges.clearLayers();
    const { environment } = store.state;

    RIVER_GAUGES.forEach(gauge => {
      const isDanger = gauge.id === 'gauge-sonapur' && environment.riverWaterLevel > 1.2;
      const gaugeColor = isDanger ? 'bg-rose-600' : 'bg-sky-600';

      const iconHtml = `
        <div class="relative cursor-pointer group">
          <div class="w-6 h-6 rounded-md ${gaugeColor} border border-white/70 flex items-center justify-center text-white shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          </div>
          ${isDanger ? '<div class="absolute -inset-1 rounded-md bg-rose-500/50 animate-ping"></div>' : ''}
        </div>
      `;

      const markerIcon = L.divIcon({
        html: iconHtml,
        className: 'gauge-marker-icon',
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });

      const marker = L.marker([gauge.lat, gauge.lng], { icon: markerIcon });
      marker.bindTooltip(`
        <div class="font-sans text-xs p-1">
          <div class="font-bold text-sky-400">${gauge.name}</div>
          <div class="text-slate-300 font-mono mt-0.5">Corridor: ${gauge.corridor}</div>
          <div class="text-white font-mono text-[11px]">Water Gauge: <strong class="${isDanger ? 'text-rose-400' : 'text-emerald-400'}">+${environment.riverWaterLevel}m Above Base</strong></div>
          <div class="text-slate-400 text-[10px] font-mono">Danger Mark: ${gauge.dangerMark}m</div>
        </div>
      `);

      marker.addTo(this.layers.gauges);
    });
  }

  renderWeatherSensors() {
    this.layers.weather.clearLayers();
    const { environment } = store.state;

    // Sensor at Sonapur
    const sonapurSensor = L.marker([25.1120, 92.3850], {
      icon: L.divIcon({
        html: `
          <div class="w-7 h-7 rounded-full bg-cyan-600/30 border border-cyan-400 flex items-center justify-center text-cyan-300 shadow-xl backdrop-blur-sm animate-pulse-subtle">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 text-cyan-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="m8 19-2 3"/><path d="m12 19-2 3"/><path d="m16 19-2 3"/></svg>
          </div>
        `,
        className: 'weather-sensor-icon',
        iconSize: [28, 28],
        iconAnchor: [14, 14]
      })
    });

    sonapurSensor.bindTooltip(`
      <div class="font-sans text-xs p-1">
        <div class="font-bold text-cyan-400">Sonapur Automated Weather Station (AWS-09)</div>
        <div class="text-white font-mono mt-0.5">Precipitation: <strong class="text-rose-400">${environment.rainfall} mm/hr</strong></div>
        <div class="text-slate-300 font-mono text-[11px]">Humidity: ${environment.humidity}% · Wind: ${environment.windSpeed} km/h ${environment.windDirection}</div>
        <div class="text-slate-400 font-mono text-[10px]">Visibility: ${environment.visibility} km</div>
      </div>
    `);

    sonapurSensor.addTo(this.layers.weather);
  }

  renderIncidents() {
    this.layers.incidents.clearLayers();
    const { fieldReports } = store.state;

    fieldReports.forEach(report => {
      const isCritical = report.severity.includes('Critical') || report.severity.includes('Impassable');
      const iconHtml = `
        <div class="relative cursor-pointer group">
          <div class="w-8 h-8 rounded-full ${isCritical ? 'bg-rose-600 border-2 border-white' : 'bg-amber-600 border-2 border-white'} flex items-center justify-center text-white shadow-xl">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          </div>
          ${isCritical ? '<div class="absolute -inset-1.5 rounded-full bg-rose-500/50 animate-ping"></div>' : ''}
        </div>
      `;

      const markerIcon = L.divIcon({
        html: iconHtml,
        className: 'incident-map-marker',
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      const marker = L.marker(report.gps, { icon: markerIcon });
      marker.on('click', () => {
        if (this.onIncidentClick) this.onIncidentClick(report);
      });

      marker.bindTooltip(`
        <div class="font-sans text-xs p-1">
          <div class="font-bold text-rose-400">${report.incidentType} (${report.severity})</div>
          <div class="text-slate-200">${report.roadName}</div>
          <div class="text-slate-400 text-[10px] font-mono mt-0.5">By ${report.officerName} at ${report.timestamp}</div>
        </div>
      `);

      marker.addTo(this.layers.incidents);
    });
  }

  renderVehicles() {
    this.layers.vehicles.clearLayers();
    const { vehicles, selectedVehicleId } = store.state;

    vehicles.forEach(vehicle => {
      const isSelected = vehicle.id === selectedVehicleId;
      const isRerouted = vehicle.status === 'REROUTED';
      const isCriticalPriority = vehicle.priority === 'CRITICAL';
      const isEmergency = vehicle.riskLevel === 'CRITICAL' || vehicle.status === 'EMERGENCY';

      const statusColor = isEmergency ? 'bg-rose-600' : isRerouted ? 'bg-emerald-600' : 'bg-cyan-600';
      const haloColor = isEmergency ? 'ring-rose-400 ring-4' : isSelected ? 'ring-cyan-400 ring-4' : '';

      const vehicleHtml = `
        <div class="relative cursor-pointer transition-transform hover:scale-125 ${isSelected ? 'scale-110 z-30' : 'z-20'}">
          <div class="w-9 h-9 rounded-xl ${statusColor} ${haloColor} shadow-2xl border-2 border-white/80 flex items-center justify-center text-white">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/></svg>
          </div>
          
          <!-- Label Tag with Priority Indicator -->
          <div class="absolute -bottom-5 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded bg-command-900/95 border ${isCriticalPriority ? 'border-rose-500 text-rose-300' : 'border-cyan-500/60 text-white'} text-[10px] font-mono font-bold whitespace-nowrap shadow-xl flex items-center gap-1.5 z-40">
            ${isCriticalPriority ? '<span class="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping"></span>' : ''}
            <span>${vehicle.driverName ? `${vehicle.driverName} (${vehicle.id})` : vehicle.id}</span>
          </div>

          <!-- Pulsing Halo for Critical Emergency -->
          ${isEmergency ? '<div class="absolute -inset-2 rounded-xl bg-rose-500/40 animate-ping"></div>' : ''}
        </div>
      `;

      const vehicleIcon = L.divIcon({
        html: vehicleHtml,
        className: 'vehicle-marker-icon',
        iconSize: [36, 36],
        iconAnchor: [18, 18]
      });

      const marker = L.marker(vehicle.coordinates, { icon: vehicleIcon });

      marker.on('click', () => {
        store.setSelectedVehicle(vehicle.id);
        if (this.onVehicleClick) this.onVehicleClick(vehicle.id);
      });

      marker.bindTooltip(`
        <div class="font-sans text-xs p-1">
          <div class="font-bold text-white flex items-center justify-between gap-3">
            <span>${vehicle.id}</span>
            <span class="text-[9px] font-mono px-1.5 py-0.2 rounded font-bold ${isCriticalPriority ? 'bg-rose-950 text-rose-300 border border-rose-600' : 'bg-slate-800 text-cyan-300'}">
              PRIORITY: ${vehicle.priority}
            </span>
          </div>
          <div class="text-slate-300 mt-1 font-semibold">${vehicle.cargo}</div>
          <div class="text-slate-400 font-mono text-[10px] mt-0.5">Route: ${vehicle.assignedRoute}</div>
          <div class="text-slate-400 flex items-center gap-2 mt-0.5">
            <span>Speed: <strong class="text-white font-mono">${vehicle.speed} km/h</strong></span>
            <span>ETA: <strong class="text-emerald-400 font-mono">${vehicle.eta}</strong></span>
          </div>
          <div class="text-[10px] text-cyan-400 mt-1 font-mono">Click for Telemetry Inspector</div>
        </div>
      `);

      marker.addTo(this.layers.vehicles);
    });
  }

  renderCustomMissions() {
    const customMissions = store.state.customMissions || [];

    customMissions.forEach(m => {
      const gps = (m.gps && Array.isArray(m.gps)) ? m.gps : (m.lat && m.lng ? [m.lat, m.lng] : null);

      if (m.type === 'HAZARD_INJECTION' && gps && !isNaN(gps[0]) && !isNaN(gps[1])) {
        const hazardCircle = L.circle(gps, {
          radius: m.radiusMeters || 12000,
          color: '#f43f5e',
          fillColor: '#f43f5e',
          fillOpacity: 0.35,
          weight: 2,
          dashArray: '4, 4'
        });

        hazardCircle.bindTooltip(`
          <div class="font-sans text-xs p-1">
            <div class="font-bold text-rose-400 uppercase tracking-wide">PINNED HAZARD: ${m.hazardType || m.type || 'Disaster'}</div>
            <div class="text-white font-medium mt-0.5">${m.name}</div>
            <div class="text-rose-300 font-mono text-[10px] mt-1 font-bold">Severity: ${m.severity}</div>
          </div>
        `);
        hazardCircle.addTo(this.layers.hazards);
      } else if (m.type === 'DRONE_RELIEF' && m.originGps && m.targetGps) {
        // Drone Flight Vector Line
        const flightLine = L.polyline([m.originGps, m.targetGps], {
          color: '#a855f7',
          weight: 3,
          dashArray: '6, 6',
          opacity: 0.9
        });

        flightLine.bindTooltip(`
          <div class="font-sans text-xs p-1">
            <div class="font-bold text-purple-400">AERIAL DRONE LIFELINE: ${m.name}</div>
            <div class="text-slate-200">Payload: ${m.payload}</div>
            <div class="text-emerald-400 font-mono text-[10px]">Speed: ${m.speed} · ETA: ${m.eta}</div>
          </div>
        `);
        flightLine.addTo(this.layers.hazards);

        // Target Landing Marker
        const targetMarker = L.marker(m.targetGps, {
          icon: L.divIcon({
            html: `
              <div class="w-8 h-8 rounded-full bg-purple-600 border-2 border-white flex items-center justify-center text-white shadow-xl animate-bounce">
                <span class="font-mono text-[10px] font-bold">DRN</span>
              </div>
            `,
            className: 'drone-target-icon',
            iconSize: [32, 32],
            iconAnchor: [16, 16]
          })
        });
        targetMarker.addTo(this.layers.hazards);
      } else if (m.type === 'SENSOR_DEPLOYMENT' && gps && !isNaN(gps[0]) && !isNaN(gps[1])) {
        const sensorMarker = L.marker(gps, {
          icon: L.divIcon({
            html: `
              <div class="w-7 h-7 rounded-lg bg-cyan-600 border-2 border-white flex items-center justify-center text-white shadow-xl">
                <span class="font-mono text-[9px] font-bold">IOT</span>
              </div>
            `,
            className: 'iot-deployed-icon',
            iconSize: [28, 28],
            iconAnchor: [14, 14]
          })
        });
        sensorMarker.bindTooltip(`
          <div class="font-sans text-xs p-1">
            <div class="font-bold text-cyan-400">DEPLOYED SENSOR: ${m.name}</div>
            <div class="text-slate-200 font-mono text-[11px]">${m.reading}</div>
          </div>
        `);
        sensorMarker.addTo(this.layers.weather);
      }
    });
  }

  addTacticalHudControls() {
    const mapContainer = document.getElementById(this.containerId);
    if (!mapContainer) return;

    // Tactical HUD Box
    const controlHud = document.createElement('div');
    controlHud.className = 'absolute top-3 left-3 z-[1000] flex flex-col gap-2 pointer-events-auto select-none';
    controlHud.innerHTML = `
      <!-- Basemap Selector -->
      <div class="hud-panel rounded-xl p-1.5 flex items-center gap-1 shadow-2xl border border-command-border text-xs">
        <button id="btn-map-dark" class="px-2.5 py-1 rounded-lg font-mono font-medium transition ${this.activeTile === 'dark' ? 'bg-cyan-600 text-white font-bold' : 'text-slate-400 hover:text-white'}">
          TACTICAL
        </button>
        <button id="btn-map-sat" class="px-2.5 py-1 rounded-lg font-mono font-medium transition ${this.activeTile === 'satellite' ? 'bg-cyan-600 text-white font-bold' : 'text-slate-400 hover:text-white'}">
          SATELLITE
        </button>
        <button id="btn-map-topo" class="px-2.5 py-1 rounded-lg font-mono font-medium transition ${this.activeTile === 'topo' ? 'bg-cyan-600 text-white font-bold' : 'text-slate-400 hover:text-white'}">
          TERRAIN
        </button>
      </div>

      <!-- Quick Region Focus Bar -->
      <div class="hud-panel rounded-xl p-1.5 flex items-center gap-1.5 shadow-2xl border border-command-border text-[11px] overflow-x-auto max-w-[440px]">
        <span class="text-slate-400 font-mono px-1">SECTOR:</span>
        <button data-region="ALL" class="px-2 py-0.5 rounded-md bg-command-800 hover:bg-cyan-600 text-slate-200 transition font-mono">ALL NER</button>
        <button data-region="ML" class="px-2 py-0.5 rounded-md bg-command-800 hover:bg-cyan-600 text-slate-200 transition font-mono">Meghalaya</button>
        <button data-region="AS" class="px-2 py-0.5 rounded-md bg-command-800 hover:bg-cyan-600 text-slate-200 transition font-mono">Assam</button>
        <button data-region="AR" class="px-2 py-0.5 rounded-md bg-command-800 hover:bg-cyan-600 text-slate-200 transition font-mono">Arunachal</button>
        <button data-region="MN" class="px-2 py-0.5 rounded-md bg-command-800 hover:bg-cyan-600 text-slate-200 transition font-mono">Manipur</button>
        <button data-region="TR" class="px-2 py-0.5 rounded-md bg-command-800 hover:bg-cyan-600 text-slate-200 transition font-mono">Tripura</button>
      </div>

      <!-- Layer Toggle Chips -->
      <div class="hud-panel rounded-xl p-1.5 flex items-center gap-1 shadow-2xl border border-command-border text-[10px] font-mono overflow-x-auto max-w-[440px]">
        <button data-layer-toggle="corridors" class="px-2 py-0.5 rounded bg-cyan-600/30 text-cyan-300 border border-cyan-500/50 hover:bg-cyan-600/50 transition">
          ✓ Corridors
        </button>
        <button data-layer-toggle="hazards" class="px-2 py-0.5 rounded bg-rose-600/30 text-rose-300 border border-rose-500/50 hover:bg-rose-600/50 transition">
          ✓ Hazards
        </button>
        <button data-layer-toggle="gauges" class="px-2 py-0.5 rounded bg-sky-600/30 text-sky-300 border border-sky-500/50 hover:bg-sky-600/50 transition">
          ✓ River Gauges
        </button>
        <button data-layer-toggle="vehicles" class="px-2 py-0.5 rounded bg-emerald-600/30 text-emerald-300 border border-emerald-500/50 hover:bg-emerald-600/50 transition">
          ✓ Fleet
        </button>
      </div>
    `;

    mapContainer.appendChild(controlHud);

    // Bind Basemap Buttons
    controlHud.querySelector('#btn-map-dark')?.addEventListener('click', (e) => {
      this.setTileLayer('dark');
      this.updateTileButtonUI(e.target);
    });
    controlHud.querySelector('#btn-map-sat')?.addEventListener('click', (e) => {
      this.setTileLayer('satellite');
      this.updateTileButtonUI(e.target);
    });
    controlHud.querySelector('#btn-map-topo')?.addEventListener('click', (e) => {
      this.setTileLayer('topo');
      this.updateTileButtonUI(e.target);
    });

    // Bind Region Focus Buttons
    controlHud.querySelectorAll('[data-region]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const regionCode = e.currentTarget.getAttribute('data-region');
        if (regionCode === 'ALL') {
          this.map.flyTo(NER_CENTER, NER_DEFAULT_ZOOM, { duration: 1.2 });
        } else {
          const region = NER_REGIONS.find(r => r.id === regionCode);
          if (region) {
            this.map.flyTo(region.center, 9.2, { duration: 1.2 });
          }
        }
      });
    });

    // Bind Layer Toggle Chips
    controlHud.querySelectorAll('[data-layer-toggle]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const layerName = e.currentTarget.getAttribute('data-layer-toggle');
        this.toggleLayer(layerName);
        const isVis = this.visibleLayers[layerName];
        e.currentTarget.classList.toggle('opacity-50', !isVis);
      });
    });

    // Map Legend Overlay at Bottom Left
    const legendEl = document.createElement('div');
    legendEl.className = 'absolute bottom-3 left-3 z-[1000] hud-panel rounded-xl p-2.5 shadow-2xl border border-command-border text-[11px] flex flex-col gap-1.5 pointer-events-auto hidden md:flex';
    legendEl.innerHTML = `
      <div class="font-mono font-bold text-slate-300 uppercase tracking-wider text-[10px] pb-1 border-b border-slate-700/60 flex items-center justify-between">
        <span>Evaluated Corridors Legend</span>
        <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
      </div>
      <div class="flex items-center gap-2 text-slate-300">
        <span class="w-3.5 h-1 bg-amber-400 rounded"></span>
        <span>Route A (NH-6 Primary Arterial)</span>
      </div>
      <div class="flex items-center gap-2 text-slate-300">
        <span class="w-3.5 h-1 bg-emerald-400 rounded border-dashed border-t"></span>
        <span>Route B (AI Safe Alternate Bypass)</span>
      </div>
      <div class="flex items-center gap-2 text-slate-300">
        <span class="w-3.5 h-1 bg-purple-400 rounded border-dashed border-t"></span>
        <span>Route C (Emergency Ridge Contingency)</span>
      </div>
      <div class="flex items-center gap-2 text-slate-300">
        <span class="w-3 h-3 rounded bg-rose-500/50 border border-rose-400"></span>
        <span>Landslide / Rockfall Hazard Hotspot</span>
      </div>
      <div class="flex items-center gap-2 text-slate-300">
        <span class="w-3 h-3 rounded bg-sky-500/50 border border-sky-400"></span>
        <span>River Inundation Basin / Flood Lowland</span>
      </div>
    `;
    mapContainer.appendChild(legendEl);
  }

  updateTileButtonUI(activeBtn) {
    const parent = activeBtn.parentElement;
    parent.querySelectorAll('button').forEach(b => {
      b.className = 'px-2.5 py-1 rounded-lg font-mono font-medium transition text-slate-400 hover:text-white';
    });
    activeBtn.className = 'px-2.5 py-1 rounded-lg font-mono font-medium transition bg-cyan-600 text-white font-bold';
  }

  updateAll() {
    this.renderAll();
  }

  focusVehicle(vehicleId) {
    const vehicle = store.state.vehicles.find(v => v.id === vehicleId);
    if (vehicle && this.map) {
      this.map.flyTo(vehicle.coordinates, 10, { duration: 1 });
    }
  }
}

