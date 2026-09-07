/**
 * Tactical Mission & Point-to-Launch Dedicated Portal
 * Integrated with Live Simulation Engine, Scenario Sliders & Interactive Point-and-Click Map Dispatch
 */

import { renderNavbar } from '../components/navbar.js';
import { GisMap } from '../components/gis-map.js';
import { store, SCENARIO_PRESETS } from '../state/store.js';
import { simEngine } from '../simulation/sim-engine.js';
import { sounds } from '../audio/sound-effects.js';

export function renderMissionLaunchView(appContainer) {
  const targetedPin = store.state.targetedPin || {
    lat: 25.1120,
    lng: 92.3850,
    label: 'Sonapur Chokepoint (Km 142)',
    sector: 'Meghalaya East Jaintia Hills'
  };
  const customMissions = store.state.customMissions || [];
  const { aiIntelligence, routesEvaluation, environment, activeScenarioPreset, simulation } = store.state;

  // Active master console tab state (default to 'launch', can switch to 'scenario' or 'simulation')
  const activeMasterTab = appContainer._activeMasterTab || 'launch';

  // Helper for status badges
  const getRainStatus = (val) => val > 40 ? { label: 'SEVERE', color: 'text-rose-400 border-rose-500/60 bg-rose-950/40' } : val > 20 ? { label: 'ELEVATED', color: 'text-amber-400 border-amber-500/60 bg-amber-950/40' } : { label: 'NORMAL', color: 'text-emerald-400 border-emerald-500/60 bg-emerald-950/40' };
  const getLandslideStatus = (val) => val > 70 ? { label: 'HIGH RISK', color: 'text-rose-400 border-rose-500/60 bg-rose-950/40' } : val > 35 ? { label: 'MONITORED', color: 'text-amber-400 border-amber-500/60 bg-amber-950/40' } : { label: 'LOW RISK', color: 'text-emerald-400 border-emerald-500/60 bg-emerald-950/40' };
  const getRiverStatus = (val) => val > 1.8 ? { label: 'CRITICAL SURGE', color: 'text-rose-400 border-rose-500/60 bg-rose-950/40' } : val > 0.8 ? { label: 'ABOVE BASE', color: 'text-amber-400 border-amber-500/60 bg-amber-950/40' } : { label: 'NORMAL POOL', color: 'text-emerald-400 border-emerald-500/60 bg-emerald-950/40' };

  appContainer.innerHTML = `
    <!-- Top Nav Header -->
    <div id="nav-container" class="shrink-0"></div>

    <!-- Main Workspace Layout -->
    <main class="h-[calc(100vh-53px)] flex flex-col lg:flex-row overflow-hidden relative w-full">
      
      <!-- LEFT / CENTER: Interactive Map with Point-To-Launch Crosshair -->
      <section class="flex-1 flex flex-col h-full relative border-r border-command-border min-w-0">
        
        <!-- Top Target Lock HUD Banner -->
        <div class="absolute top-4 left-4 right-4 z-[1000] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hud-panel rounded-xl p-3.5 border border-cyan-500/40 shadow-2xl pointer-events-auto">
          <div class="flex items-center gap-3">
            <div class="w-3 h-3 rounded-full bg-cyan-400 animate-ping shrink-0"></div>
            <div>
              <div class="text-[10px] font-mono text-cyan-400 uppercase tracking-widest flex items-center gap-2">
                <span>GPS TARGET CROSSHAIR LOCK</span>
                <span class="text-slate-400">· CLICK ANYWHERE ON MAP TO TARGET</span>
              </div>
              <div class="text-xs font-bold text-white font-mono mt-0.5" id="target-coords-display">
                ${targetedPin.lat.toFixed(4)}° N, ${targetedPin.lng.toFixed(4)}° E — ${targetedPin.label}
              </div>
            </div>
          </div>

          <!-- Quick Actions & Snaps -->
          <div class="flex items-center gap-2 overflow-x-auto text-[10px] font-mono shrink-0">
            <span class="text-slate-400 uppercase">Snap:</span>
            <button data-snap="sonapur" class="px-2.5 py-1 rounded-md bg-command-800 hover:bg-cyan-600 text-slate-200 transition font-medium border border-command-border">
              Sonapur Chokepoint
            </button>
            <button data-snap="umrangso" class="px-2.5 py-1 rounded-md bg-command-800 hover:bg-emerald-600 text-slate-200 transition font-medium border border-command-border">
              Umrangso Bypass
            </button>
            <button data-snap="sela" class="px-2.5 py-1 rounded-md bg-command-800 hover:bg-rose-600 text-slate-200 transition font-medium border border-command-border">
              Sela Pass
            </button>
            <span class="text-slate-700">|</span>
            <button id="btn-quick-run-sim" class="px-3 py-1 rounded-md bg-rose-600 hover:bg-rose-500 text-white transition font-bold shadow-sm flex items-center gap-1.5">
              <span class="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
              Run Live Sim
            </button>
          </div>
        </div>

        <!-- GIS Map Container -->
        <div id="mission-map-container" class="flex-1 w-full h-full relative z-0 min-h-0 pt-20"></div>

        <!-- Bottom Active Missions Drawer -->
        <div class="h-36 bg-command-900/95 backdrop-blur-md border-t border-command-border flex flex-col z-10 shrink-0">
          <div class="px-5 py-2 border-b border-command-border flex items-center justify-between bg-command-950">
            <div class="flex items-center gap-2.5">
              <span class="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
              <h3 class="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider">
                Active Tactical Missions & Field Operations (${customMissions.length})
              </h3>
            </div>
            <div class="flex items-center gap-4 text-[11px] font-mono">
              <span class="text-slate-400">AI Risk: <strong class="${aiIntelligence.riskLevel === 'HIGH_RISK' ? 'text-rose-400' : 'text-emerald-400'}">${aiIntelligence.accessibilityRiskPct}%</strong></span>
              <span class="text-slate-400">Rec Route: <strong class="text-cyan-300">${routesEvaluation.recommendedRouteId === 'ROUTE_B' ? 'Route B (Umrangso)' : 'Route A (NH-6)'}</strong></span>
            </div>
          </div>

          <div class="flex-1 overflow-x-auto p-3 flex items-center gap-3">
            ${customMissions.length === 0 ? `
              <div class="text-slate-400 text-xs font-mono px-4">No active launched missions. Click the map to lock GPS and launch operations.</div>
            ` : customMissions.map(m => {
              const borderBadge = m.type === 'HAZARD_INJECTION' ? 'border-rose-500/60 bg-rose-950/30 text-rose-300' : m.type === 'DRONE_RELIEF' ? 'border-purple-500/60 bg-purple-950/30 text-purple-300' : m.type === 'CONVOY_DISPATCH' ? 'border-emerald-500/60 bg-emerald-950/30 text-emerald-300' : 'border-cyan-500/60 bg-cyan-950/30 text-cyan-300';
              return `
                <div class="p-3 rounded-lg border ${borderBadge} min-w-[280px] max-w-[340px] shrink-0 space-y-1 shadow-sm">
                  <div class="flex items-center justify-between text-[11px] font-mono font-bold">
                    <span class="uppercase">${m.name}</span>
                    <span class="text-[10px] px-1.5 py-0.2 rounded bg-command-900 border border-command-border">${m.status}</span>
                  </div>
                  <p class="text-xs text-slate-300 leading-snug truncate">${m.payload || m.reading || m.eta || m.name}</p>
                </div>
              `;
            }).join('')}
          </div>
        </div>

      </section>

      <!-- RIGHT SIDEBAR: Tactical Master Control Console (Point & Launch, Scenario Controls, Live Simulation) -->
      <aside class="w-full lg:w-[460px] xl:w-[500px] h-full bg-command-950 overflow-y-auto flex flex-col divide-y divide-command-border shrink-0 z-10 shadow-2xl">
        
        <!-- MASTER CONSOLE MODE TABS -->
        <div class="p-4 bg-command-900 shrink-0 space-y-3">
          <div class="flex items-center justify-between">
            <h3 class="text-xs font-mono font-bold text-slate-300 uppercase tracking-widest">
              Tactical Command Center
            </h3>
            <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-semibold">
              LIVE SYSTEM ENGINE
            </span>
          </div>

          <!-- 3 Master Tabs: Point & Launch, Scenario Controls, Live Simulation -->
          <div class="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-command-950 border border-command-border text-center text-[10px] font-mono font-bold">
            <button id="master-tab-launch" class="py-2.5 px-2 rounded-lg transition ${activeMasterTab === 'launch' ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}">
              Point & Launch
            </button>
            <button id="master-tab-scenario" class="py-2.5 px-2 rounded-lg transition ${activeMasterTab === 'scenario' ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}">
              Scenario Controls
            </button>
            <button id="master-tab-simulation" class="py-2.5 px-2 rounded-lg transition ${activeMasterTab === 'simulation' ? 'bg-rose-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}">
              Live Simulation
            </button>
          </div>
        </div>

        <!-- ========================================================================= -->
        <!-- MASTER PANEL 1: POINT & LAUNCH DISPATCH                                  -->
        <!-- ========================================================================= -->
        <div id="master-panel-launch" class="flex-1 p-5 space-y-5 ${activeMasterTab === 'launch' ? '' : 'hidden'}">
          
          <!-- Target Coordinates Readout -->
          <div class="p-4 rounded-xl bg-command-900 border border-command-border space-y-2">
            <div class="flex items-center justify-between">
              <div>
                <span class="text-[10px] font-mono text-slate-400 uppercase">TARGET LATITUDE</span>
                <div class="text-sm font-mono font-bold text-white mt-0.5" id="hud-target-lat">${targetedPin.lat.toFixed(4)}° N</div>
              </div>
              <div class="text-right">
                <span class="text-[10px] font-mono text-slate-400 uppercase">TARGET LONGITUDE</span>
                <div class="text-sm font-mono font-bold text-white mt-0.5" id="hud-target-lng">${targetedPin.lng.toFixed(4)}° E</div>
              </div>
            </div>
            <div class="pt-2 border-t border-command-border flex items-center justify-between text-[11px] text-slate-300 font-mono">
              <span>Sector: <strong class="text-cyan-300" id="hud-target-sector">${targetedPin.sector}</strong></span>
              <span class="text-slate-400">Map Click Armed</span>
            </div>
          </div>

          <!-- 4 Operation Launch Modes (Tabbed Selector) -->
          <div class="space-y-4">
            
            <div class="grid grid-cols-4 gap-1 p-1 rounded-xl bg-command-900 border border-command-border text-center text-[10px] font-mono font-bold">
              <button id="tab-btn-hazard" class="py-2 rounded-lg bg-rose-600 text-white shadow-md transition">
                Hazard
              </button>
              <button id="tab-btn-convoy" class="py-2 rounded-lg text-slate-400 hover:text-white transition">
                Convoy
              </button>
              <button id="tab-btn-drone" class="py-2 rounded-lg text-slate-400 hover:text-white transition">
                Drone
              </button>
              <button id="tab-btn-sensor" class="py-2 rounded-lg text-slate-400 hover:text-white transition">
                Sensor
              </button>
            </div>

            <!-- SUB-TAB 1: HAZARD INJECTION -->
            <div id="panel-launch-hazard" class="space-y-4">
              <div class="p-4 rounded-xl bg-rose-950/20 border border-rose-500/40 space-y-1">
                <span class="text-xs font-mono font-bold text-rose-300 uppercase tracking-wider">
                  Disaster & Obstacle Injection
                </span>
                <p class="text-xs text-slate-300">
                  Trigger an instantaneous disaster at the pinned GPS coordinates to test AI rerouting live.
                </p>
              </div>

              <form id="form-launch-hazard" class="space-y-3.5">
                <div>
                  <label class="block text-[10px] font-mono text-slate-300 uppercase mb-1">Hazard Category</label>
                  <select id="launch-hazard-type" class="w-full bg-command-850 border border-command-border rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-rose-500 font-sans">
                    <option value="Landslide">Landslide / Mudflow / Rockfall</option>
                    <option value="Flash Flood">Flash Flood & River Inundation</option>
                    <option value="Bridge Collapse">Culvert / Bridge Shear Failure</option>
                    <option value="Cloudburst">Convective Cloudburst Squall</option>
                    <option value="Road Cave-in">Road Embankment Washout</option>
                  </select>
                </div>

                <div>
                  <label class="block text-[10px] font-mono text-slate-300 uppercase mb-1">Severity / Blockage Level</label>
                  <select id="launch-hazard-severity" class="w-full bg-command-850 border border-command-border rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-rose-500 font-sans">
                    <option value="CRITICAL">Critical Cutoff (100% Lane Blockage)</option>
                    <option value="SEVERE">Severe Mud Accumulation (0.9m Debris)</option>
                    <option value="MODERATE">Moderate Speed Reduction (Single Lane)</option>
                  </select>
                </div>

                <div>
                  <label class="block text-[10px] font-mono text-slate-300 uppercase mb-1">Obstruction Label</label>
                  <input type="text" id="launch-hazard-name" class="w-full bg-command-850 border border-command-border rounded-xl px-3.5 py-2 text-xs text-white font-sans" value="Sonapur Dual-Carriageway Debris Slide">
                </div>

                <button type="submit" class="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-mono font-bold text-xs flex items-center justify-center shadow-lg shadow-rose-950 transition">
                  LAUNCH DISASTER AT PINNED GPS
                </button>
              </form>
            </div>

            <!-- SUB-TAB 2: CONVOY DISPATCH -->
            <div id="panel-launch-convoy" class="space-y-4 hidden">
              <div class="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/40 space-y-1">
                <span class="text-xs font-mono font-bold text-emerald-300 uppercase tracking-wider">
                  Emergency Convoy Dispatch
                </span>
                <p class="text-xs text-slate-300">
                  Deploy a new logistics unit originating from the pinned coordinates with live telemetry tracking.
                </p>
              </div>

              <form id="form-launch-convoy" class="space-y-3.5">
                <div>
                  <label class="block text-[10px] font-mono text-slate-300 uppercase mb-1">Cargo Manifest & Priority</label>
                  <input type="text" id="launch-convoy-cargo" class="w-full bg-command-850 border border-command-border rounded-xl px-3.5 py-2 text-xs text-white font-sans" value="600 Vials Rabies Serum & Blood Units (-20°C)">
                </div>

                <div>
                  <label class="block text-[10px] font-mono text-slate-300 uppercase mb-1">Destination Node</label>
                  <select id="launch-convoy-dest" class="w-full bg-command-850 border border-command-border rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-sans">
                    <option value="District Civil Hospital, Silchar">District Civil Hospital, Silchar</option>
                    <option value="Aizawl Emergency Operations Hub">Aizawl Emergency Operations Hub</option>
                    <option value="Agartala Regional Medical Depot">Agartala Regional Medical Depot</option>
                    <option value="Imphal Lifeline Relief Node">Imphal Lifeline Relief Node</option>
                  </select>
                </div>

                <div>
                  <label class="block text-[10px] font-mono text-slate-300 uppercase mb-1">Cargo Priority Level</label>
                  <select id="launch-convoy-priority" class="w-full bg-command-850 border border-command-border rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-sans">
                    <option value="CRITICAL">CRITICAL (Cold-Chain Life-Saving)</option>
                    <option value="HIGH">HIGH (Standard Medical)</option>
                    <option value="NORMAL">NORMAL (General Relief)</option>
                  </select>
                </div>

                <button type="submit" class="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-mono font-bold text-xs flex items-center justify-center shadow-lg shadow-emerald-950 transition">
                  LAUNCH CONVOY FROM PINNED GPS
                </button>
              </form>
            </div>

            <!-- SUB-TAB 3: DRONE AIRLIFT -->
            <div id="panel-launch-drone" class="space-y-4 hidden">
              <div class="p-4 rounded-xl bg-purple-950/20 border border-purple-500/40 space-y-1">
                <span class="text-xs font-mono font-bold text-purple-300 uppercase tracking-wider">
                  Aerial Drone Lifeline Flight
                </span>
                <p class="text-xs text-slate-300">
                  Bypass road blockages completely by deploying an autonomous long-range cargo drone directly to the pinned node.
                </p>
              </div>

              <form id="form-launch-drone" class="space-y-3.5">
                <div>
                  <label class="block text-[10px] font-mono text-slate-300 uppercase mb-1">Target Relief Destination</label>
                  <input type="text" id="launch-drone-target-name" class="w-full bg-command-850 border border-command-border rounded-xl px-3.5 py-2 text-xs text-white font-sans" value="Isolated Sonapur Medical Tent (Cutoff Sector)">
                </div>

                <div>
                  <label class="block text-[10px] font-mono text-slate-300 uppercase mb-1">Airlift Payload Manifest</label>
                  <input type="text" id="launch-drone-payload" class="w-full bg-command-850 border border-command-border rounded-xl px-3.5 py-2 text-xs text-white font-sans" value="15 Anti-Venom Vials, 4 Blood Bags & Automated Defibrillator">
                </div>

                <button type="submit" class="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-mono font-bold text-xs flex items-center justify-center shadow-lg shadow-purple-950 transition">
                  LAUNCH DRONE AIRLIFT TO TARGET PIN
                </button>
              </form>
            </div>

            <!-- SUB-TAB 4: IOT SENSOR -->
            <div id="panel-launch-sensor" class="space-y-4 hidden">
              <div class="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/40 space-y-1">
                <span class="text-xs font-mono font-bold text-cyan-300 uppercase tracking-wider">
                  Deploy Field Telemetry Sensor
                </span>
                <p class="text-xs text-slate-300">
                  Install a virtual IoT Automatic Weather & Gauge Station at the target coordinates for 24/7 AI risk telemetry.
                </p>
              </div>

              <form id="form-launch-sensor" class="space-y-3.5">
                <div>
                  <label class="block text-[10px] font-mono text-slate-300 uppercase mb-1">Sensor Instrument Type</label>
                  <select id="launch-sensor-type" class="w-full bg-command-850 border border-command-border rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-sans">
                    <option value="AWS Rain Gauge & Anemometer">Automatic Weather Station (AWS Rain & Wind)</option>
                    <option value="Ultrasonic River Depth Gauge">Ultrasonic River Stage Gauge</option>
                    <option value="Seismic Inclinometer & Soil Pore Pressure">Seismic Slope Inclinometer (Landslide Watch)</option>
                  </select>
                </div>

                <div>
                  <label class="block text-[10px] font-mono text-slate-300 uppercase mb-1">Station Identifier</label>
                  <input type="text" id="launch-sensor-name" class="w-full bg-command-850 border border-command-border rounded-xl px-3.5 py-2 text-xs text-white font-sans" value="Tactical AWS Sensor Unit #88">
                </div>

                <button type="submit" class="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-mono font-bold text-xs flex items-center justify-center shadow-lg shadow-cyan-950 transition">
                  DEPLOY SENSOR AT PINNED GPS
                </button>
              </form>
            </div>

          </div>

        </div>

        <!-- ========================================================================= -->
        <!-- MASTER PANEL 2: SCENARIO CONTROLS & ENVIRONMENT SLIDERS                  -->
        <!-- ========================================================================= -->
        <div id="master-panel-scenario" class="flex-1 p-5 space-y-5 ${activeMasterTab === 'scenario' ? '' : 'hidden'}">
          
          <!-- Live AI Accessibility Risk Impact Card -->
          <div class="p-4 rounded-xl bg-command-900 border border-command-border space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-xs font-mono font-bold text-slate-300 uppercase tracking-widest">
                AI Risk Impact Matrix
              </span>
              <span class="text-[10px] font-mono px-2 py-0.5 rounded ${aiIntelligence.riskLevel === 'HIGH_RISK' ? 'bg-rose-950 text-rose-300 border border-rose-800' : 'bg-emerald-950 text-emerald-300 border border-emerald-800'} font-semibold">
                ${aiIntelligence.statusLabel}
              </span>
            </div>

            <div class="flex items-center justify-between">
              <div>
                <span class="text-[10px] font-mono text-slate-400">CORRIDOR RISK</span>
                <div class="text-xl font-mono font-bold ${aiIntelligence.riskLevel === 'HIGH_RISK' ? 'text-rose-400' : 'text-emerald-400'}">
                  ${aiIntelligence.accessibilityRiskPct}%
                </div>
              </div>
              <div class="text-right">
                <span class="text-[10px] font-mono text-slate-400">RECOMMENDED ROUTE</span>
                <div class="text-xs font-mono font-bold text-cyan-300 mt-0.5">
                  ${routesEvaluation.recommendedRouteId === 'ROUTE_B' ? 'Route B (Umrangso Bypass)' : 'Route A (NH-6 Primary)'}
                </div>
              </div>
            </div>
          </div>

          <!-- Quick Scenario Presets -->
          <div class="space-y-2">
            <span class="text-xs font-mono font-bold text-slate-300 uppercase tracking-widest block">
              Quick Scenario Presets
            </span>
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
              ${Object.keys(SCENARIO_PRESETS).map(key => {
                const p = SCENARIO_PRESETS[key];
                const isActive = activeScenarioPreset === key;
                return `
                  <button data-scenario="${key}" class="px-2 py-2 rounded-xl text-[10px] font-mono font-bold transition flex flex-col items-center justify-center text-center border ${isActive ? 'bg-cyan-600 text-white border-cyan-400 shadow-md' : 'bg-command-850 text-slate-300 hover:bg-command-800 hover:text-white border-command-border'}">
                    <span>${p.name}</span>
                  </button>
                `;
              }).join('')}
            </div>
          </div>

          <!-- Environment Variable Sliders & Selectors -->
          <div class="space-y-4">
            <span class="text-xs font-mono font-bold text-slate-300 uppercase tracking-widest block">
              Live Environmental Variables
            </span>

            <!-- 1. Rainfall Rate Slider -->
            <div class="p-3.5 rounded-xl bg-command-850 border border-command-border space-y-2">
              <div class="flex items-center justify-between">
                <div>
                  <span class="text-xs font-mono font-bold text-white uppercase">1. Rainfall Rate</span>
                  <span class="text-[10px] text-slate-400 font-mono block">0.0 – 80.0 mm/hr</span>
                </div>
                <div class="text-right">
                  <span class="text-xs font-mono font-bold text-cyan-400">${environment.rainfall} mm/hr</span>
                  <span class="text-[9px] font-mono px-1.5 py-0.2 rounded border block mt-0.5 ${getRainStatus(environment.rainfall).color}">
                    ${getRainStatus(environment.rainfall).label}
                  </span>
                </div>
              </div>
              <input type="range" min="0" max="80" step="0.5" value="${environment.rainfall}" data-env-key="rainfall" class="tactical-slider w-full cursor-pointer">
            </div>

            <!-- 2. Landslide Probability Slider -->
            <div class="p-3.5 rounded-xl bg-command-850 border border-command-border space-y-2">
              <div class="flex items-center justify-between">
                <div>
                  <span class="text-xs font-mono font-bold text-white uppercase">2. Landslide Probability</span>
                  <span class="text-[10px] text-slate-400 font-mono block">Slope Saturation Index</span>
                </div>
                <div class="text-right">
                  <span class="text-xs font-mono font-bold text-rose-400">${environment.landslideProb}%</span>
                  <span class="text-[9px] font-mono px-1.5 py-0.2 rounded border block mt-0.5 ${getLandslideStatus(environment.landslideProb).color}">
                    ${getLandslideStatus(environment.landslideProb).label}
                  </span>
                </div>
              </div>
              <input type="range" min="0" max="100" step="1" value="${environment.landslideProb}" data-env-key="landslideProb" class="tactical-slider w-full cursor-pointer">
            </div>

            <!-- 3. River Gauge Level Slider -->
            <div class="p-3.5 rounded-xl bg-command-850 border border-command-border space-y-2">
              <div class="flex items-center justify-between">
                <div>
                  <span class="text-xs font-mono font-bold text-white uppercase">3. River Gauge Level</span>
                  <span class="text-[10px] text-slate-400 font-mono block">Umiam & Lubha River Basin</span>
                </div>
                <div class="text-right">
                  <span class="text-xs font-mono font-bold text-sky-400">+${environment.riverWaterLevel} m</span>
                  <span class="text-[9px] font-mono px-1.5 py-0.2 rounded border block mt-0.5 ${getRiverStatus(environment.riverWaterLevel).color}">
                    ${getRiverStatus(environment.riverWaterLevel).label}
                  </span>
                </div>
              </div>
              <input type="range" min="0" max="4.0" step="0.05" value="${environment.riverWaterLevel}" data-env-key="riverWaterLevel" class="tactical-slider w-full cursor-pointer">
            </div>

            <!-- 4. Road Surface Condition -->
            <div class="p-3.5 rounded-xl bg-command-850 border border-command-border space-y-1.5">
              <label class="block text-[10px] font-mono text-slate-300 uppercase">4. Road Surface Condition</label>
              <select data-env-key="roadSurfaceCondition" class="w-full bg-command-800 border border-command-border rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyan-500">
                <option value="DRY" ${environment.roadSurfaceCondition === 'DRY' ? 'selected' : ''}>DRY (Optimal Friction)</option>
                <option value="WET" ${environment.roadSurfaceCondition === 'WET' ? 'selected' : ''}>WET (Reduced Braking)</option>
                <option value="DEGRADED" ${environment.roadSurfaceCondition === 'DEGRADED' ? 'selected' : ''}>DEGRADED (Potholes & Slush)</option>
                <option value="MUD_DEBRIS" ${environment.roadSurfaceCondition === 'MUD_DEBRIS' ? 'selected' : ''}>MUD & DEBRIS (High Obstruction)</option>
                <option value="IMPASSABLE" ${environment.roadSurfaceCondition === 'IMPASSABLE' ? 'selected' : ''}>IMPASSABLE (Total Cutoff)</option>
              </select>
            </div>

            <!-- 5. Network Connectivity -->
            <div class="p-3.5 rounded-xl bg-command-850 border border-command-border space-y-1.5">
              <label class="block text-[10px] font-mono text-slate-300 uppercase">5. Telemetry & Mesh Link</label>
              <select data-env-key="networkConnectivity" class="w-full bg-command-800 border border-command-border rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyan-500">
                <option value="ONLINE_4G_5G" ${environment.networkConnectivity === 'ONLINE_4G_5G' ? 'selected' : ''}>ONLINE 4G/5G (Full Bandwidth)</option>
                <option value="DEGRADED_MESH" ${environment.networkConnectivity === 'DEGRADED_MESH' ? 'selected' : ''}>DEGRADED MESH (Low Bandwidth)</option>
                <option value="SAT_COM_FALLBACK" ${environment.networkConnectivity === 'SAT_COM_FALLBACK' ? 'selected' : ''}>SAT-COM FALLBACK ONLY</option>
                <option value="OFFLINE_BLACKOUT" ${environment.networkConnectivity === 'OFFLINE_BLACKOUT' ? 'selected' : ''}>OFFLINE BLACKOUT (Local Cache)</option>
              </select>
            </div>

            <button id="btn-reset-env-nominal" class="w-full py-2.5 rounded-xl bg-command-850 hover:bg-command-800 border border-command-border text-xs font-mono font-bold text-slate-300 transition">
              Reset All to Nominal Baseline
            </button>
          </div>

        </div>

        <!-- ========================================================================= -->
        <!-- MASTER PANEL 3: LIVE SIMULATION DEMO ENGINE                              -->
        <!-- ========================================================================= -->
        <div id="master-panel-simulation" class="flex-1 p-5 space-y-5 ${activeMasterTab === 'simulation' ? '' : 'hidden'}">
          
          <!-- 1-Click Automated Presentation Sequence -->
          <div class="p-5 rounded-xl bg-command-900 border border-rose-500/40 space-y-3 shadow-lg">
            <div class="flex items-center justify-between">
              <span class="text-xs font-mono font-bold text-rose-300 uppercase tracking-widest flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                Automated Presentation Pipeline
              </span>
              <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800 font-bold">
                ~15s FLOW
              </span>
            </div>
            
            <p class="text-xs text-slate-300 leading-relaxed">
              Executes the live causality chain: <strong>Normal Baseline</strong> → <strong>Rainfall Escalation</strong> → <strong>Sonapur Landslide Cutoff</strong> → <strong>AI Route B Advisory</strong> → <strong>Driver Accepts Diversion</strong>.
            </p>

            <button id="btn-run-full-demo" class="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-rose-600 via-purple-600 to-cyan-600 hover:opacity-95 text-white font-mono font-bold text-xs flex items-center justify-center shadow-xl shadow-rose-950 transition">
              RUN FULL LIVE PRESENTATION SCENARIO
            </button>
          </div>

          <!-- Step Progress Indicator -->
          <div class="p-4 rounded-xl bg-command-900 border border-command-border space-y-2">
            <div class="flex items-center justify-between text-[11px] font-mono">
              <span class="text-slate-400 uppercase">Simulation State:</span>
              <span class="text-cyan-300 font-bold">${simulation.isRunning ? `STEP ${simulation.step} / 5 RUNNING` : 'IDLE / READY'}</span>
            </div>
            <div class="w-full h-2 rounded-full bg-command-950 border border-command-border overflow-hidden">
              <div class="h-full bg-gradient-to-r from-cyan-500 to-rose-500 transition-all duration-500" style="width: ${simulation.step ? (simulation.step / 5) * 100 : 0}%"></div>
            </div>
          </div>

          <!-- Granular Manual Step Triggers -->
          <div class="space-y-3">
            <h3 class="text-xs font-mono font-bold text-slate-300 uppercase tracking-widest">
              Granular Step-By-Step Triggers
            </h3>

            <div class="grid grid-cols-1 gap-2.5">
              <button id="btn-step-1" class="p-3 rounded-xl bg-command-850 hover:bg-command-800 border border-command-border text-left transition flex items-center justify-between">
                <div>
                  <div class="text-xs font-bold text-white font-mono">1. Nominal Transit</div>
                  <div class="text-[11px] text-slate-400">TRUCK-07 on NH-6 Route A (18% risk)</div>
                </div>
                <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">STAGE 1</span>
              </button>

              <button id="btn-step-2" class="p-3 rounded-xl bg-command-850 hover:bg-command-800 border border-command-border text-left transition flex items-center justify-between">
                <div>
                  <div class="text-xs font-bold text-white font-mono">2. Rainfall Escalation (48.6 mm/hr)</div>
                  <div class="text-[11px] text-slate-400">Rain sensor spike, friction drop</div>
                </div>
                <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 font-bold">STAGE 2</span>
              </button>

              <button id="btn-step-3" class="p-3 rounded-xl bg-command-850 hover:bg-command-800 border border-command-border text-left transition flex items-center justify-between">
                <div>
                  <div class="text-xs font-bold text-white font-mono">3. Sonapur Landslide Cutoff</div>
                  <div class="text-[11px] text-slate-400">NH-6 blocked, AI Risk surges to 84%</div>
                </div>
                <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800 font-bold">STAGE 3</span>
              </button>

              <button id="btn-step-4" class="p-3 rounded-xl bg-command-850 hover:bg-command-800 border border-command-border text-left transition flex items-center justify-between">
                <div>
                  <div class="text-xs font-bold text-white font-mono">4. AI Route B Voice Advisory</div>
                  <div class="text-[11px] text-slate-400">PTT dispatch alert to TRUCK-07</div>
                </div>
                <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800 font-bold">STAGE 4</span>
              </button>

              <button id="btn-step-5" class="p-3 rounded-xl bg-command-850 hover:bg-command-800 border border-command-border text-left transition flex items-center justify-between">
                <div>
                  <div class="text-xs font-bold text-white font-mono">5. Driver Accepts & Diverts</div>
                  <div class="text-[11px] text-slate-400">Vehicle routed to Umrangso bypass</div>
                </div>
                <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-bold">STAGE 5</span>
              </button>
            </div>

            <div class="pt-2 flex items-center gap-2">
              <button id="btn-reset-demo" class="flex-1 py-2.5 rounded-xl bg-command-850 hover:bg-command-800 border border-command-border text-xs font-mono font-bold text-slate-300 transition">
                Reset Demo
              </button>
              <button id="btn-net-blackout" class="flex-1 py-2.5 rounded-xl bg-command-850 hover:bg-command-800 border border-command-border text-xs font-mono font-bold text-amber-300 transition">
                Network Blackout
              </button>
            </div>
          </div>

        </div>

      </aside>

    </main>
  `;

  // Render Top Navbar
  const navContainer = appContainer.querySelector('#nav-container');
  if (navContainer) renderNavbar(navContainer, 'launch');

  // Helper to switch master console tabs
  const setMasterTab = (tab) => {
    appContainer._activeMasterTab = tab;
    sounds.playPttPress();
    renderMissionLaunchView(appContainer);
  };

  appContainer.querySelector('#master-tab-launch')?.addEventListener('click', () => setMasterTab('launch'));
  appContainer.querySelector('#master-tab-scenario')?.addEventListener('click', () => setMasterTab('scenario'));
  appContainer.querySelector('#master-tab-simulation')?.addEventListener('click', () => setMasterTab('simulation'));

  // Quick Run Sim Button in Map HUD
  appContainer.querySelector('#btn-quick-run-sim')?.addEventListener('click', () => {
    sounds.playEmergencyAlert();
    simEngine.startEmergencyDemo();
    setMasterTab('simulation');
  });

  // Initialize Point-To-Launch GIS Map
  setTimeout(() => {
    const missionMap = new GisMap('mission-map-container', {
      center: [targetedPin.lat, targetedPin.lng],
      zoom: 9
    });
    missionMap.init();

    setTimeout(() => {
      if (missionMap.map) missionMap.map.invalidateSize();
    }, 150);

    // On-Map Target Crosshair Marker
    let targetMarker = null;

    const updateTargetPinOnMap = (lat, lng, label) => {
      if (targetMarker && missionMap.map) {
        missionMap.map.removeLayer(targetMarker);
      }

      const crosshairHtml = `
        <div class="relative cursor-pointer select-none">
          <div class="w-10 h-10 rounded-full border-2 border-cyan-400 bg-cyan-500/30 flex items-center justify-center text-white shadow-2xl animate-pulse">
            <span class="w-2 h-2 rounded-full bg-cyan-300"></span>
          </div>
          <div class="absolute -bottom-6 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded bg-command-900 border border-cyan-500 text-[10px] font-mono font-bold text-cyan-300 whitespace-nowrap shadow-xl">
            TARGET: ${lat.toFixed(3)}, ${lng.toFixed(3)}
          </div>
        </div>
      `;

      targetMarker = L.marker([lat, lng], {
        icon: L.divIcon({
          html: crosshairHtml,
          className: 'target-crosshair-icon',
          iconSize: [40, 40],
          iconAnchor: [20, 20]
        })
      });

      if (missionMap.map) {
        targetMarker.addTo(missionMap.map);
      }

      // Update UI Text
      const hudLat = appContainer.querySelector('#hud-target-lat');
      const hudLng = appContainer.querySelector('#hud-target-lng');
      const coordsDisplay = appContainer.querySelector('#target-coords-display');
      if (hudLat) hudLat.textContent = `${lat.toFixed(4)}° N`;
      if (hudLng) hudLng.textContent = `${lng.toFixed(4)}° E`;
      if (coordsDisplay) coordsDisplay.textContent = `${lat.toFixed(4)}° N, ${lng.toFixed(4)}° E — ${label || 'Pinned Target'}`;
    };

    updateTargetPinOnMap(targetedPin.lat, targetedPin.lng, targetedPin.label);

    // Handle Map Clicks to set GPS target
    if (missionMap.map) {
      missionMap.map.on('click', (e) => {
        const { lat, lng } = e.latlng;
        sounds.playPttPress();
        store.setTargetedPin(lat, lng, `Custom Pinned Target`);
        updateTargetPinOnMap(lat, lng, 'Custom Pinned Target');
      });
    }

    // Snap buttons
    appContainer.querySelectorAll('[data-snap]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const snapKey = e.currentTarget.getAttribute('data-snap');
        let lat = 25.1120, lng = 92.3850, lbl = 'Sonapur Chokepoint (NH-6)';
        if (snapKey === 'umrangso') {
          lat = 25.5100; lng = 92.7400; lbl = 'Umrangso Valley (Route B)';
        } else if (snapKey === 'sela') {
          lat = 27.5050; lng = 92.1050; lbl = 'Sela Pass Ridge (NH-13)';
        }
        sounds.playSuccess();
        store.setTargetedPin(lat, lng, lbl);
        updateTargetPinOnMap(lat, lng, lbl);
        if (missionMap.map) missionMap.map.flyTo([lat, lng], 10, { duration: 1 });
      });
    });

    // Sub-tab Navigation within Launcher Deck
    const tabHazard = appContainer.querySelector('#tab-btn-hazard');
    const tabConvoy = appContainer.querySelector('#tab-btn-convoy');
    const tabDrone = appContainer.querySelector('#tab-btn-drone');
    const tabSensor = appContainer.querySelector('#tab-btn-sensor');

    const panelHazard = appContainer.querySelector('#panel-launch-hazard');
    const panelConvoy = appContainer.querySelector('#panel-launch-convoy');
    const panelDrone = appContainer.querySelector('#panel-launch-drone');
    const panelSensor = appContainer.querySelector('#panel-launch-sensor');

    const setSubTab = (activeTab, activePanel, activeColor) => {
      [tabHazard, tabConvoy, tabDrone, tabSensor].forEach(t => {
        if (t) t.className = 'py-2 rounded-lg text-slate-400 hover:text-white transition';
      });
      [panelHazard, panelConvoy, panelDrone, panelSensor].forEach(p => {
        if (p) p.classList.add('hidden');
      });

      if (activeTab) activeTab.className = `py-2 rounded-lg ${activeColor} text-white shadow-md transition font-bold`;
      if (activePanel) activePanel.classList.remove('hidden');
      sounds.playPttPress();
    };

    tabHazard?.addEventListener('click', () => setSubTab(tabHazard, panelHazard, 'bg-rose-600'));
    tabConvoy?.addEventListener('click', () => setSubTab(tabConvoy, panelConvoy, 'bg-emerald-600'));
    tabDrone?.addEventListener('click', () => setSubTab(tabDrone, panelDrone, 'bg-purple-600'));
    tabSensor?.addEventListener('click', () => setSubTab(tabSensor, panelSensor, 'bg-cyan-600'));

    // Form 1: Launch Hazard
    appContainer.querySelector('#form-launch-hazard')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const type = appContainer.querySelector('#launch-hazard-type').value;
      const severity = appContainer.querySelector('#launch-hazard-severity').value;
      const name = appContainer.querySelector('#launch-hazard-name').value;

      store.launchHazardAtPin({
        type,
        severity,
        lat: store.state.targetedPin.lat,
        lng: store.state.targetedPin.lng,
        name
      });

      sounds.playEmergencyAlert();
      sounds.speakDispatch(`Hazard launched at pinned sector: ${type}. AI risk recalculated.`);
    });

    // Form 2: Launch Convoy
    appContainer.querySelector('#form-launch-convoy')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const cargo = appContainer.querySelector('#launch-convoy-cargo').value;
      const destName = appContainer.querySelector('#launch-convoy-dest').value;
      const priority = appContainer.querySelector('#launch-convoy-priority').value;

      store.launchConvoyAtPin({
        originGps: [store.state.targetedPin.lat, store.state.targetedPin.lng],
        originName: store.state.targetedPin.label,
        destName,
        cargo,
        priority
      });

      sounds.playSuccess();
      sounds.speakDispatch(`Emergency convoy launched from pinned location to ${destName}.`);
    });

    // Form 3: Launch Drone
    appContainer.querySelector('#form-launch-drone')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const targetName = appContainer.querySelector('#launch-drone-target-name').value;
      const payload = appContainer.querySelector('#launch-drone-payload').value;

      store.launchDroneAtPin({
        originGps: [26.1820, 91.7580], // Base in Guwahati
        targetGps: [store.state.targetedPin.lat, store.state.targetedPin.lng],
        targetName,
        payload
      });

      sounds.playSuccess();
      sounds.speakDispatch(`Lifeline drone airborne toward pinned target. Payload: ${payload}.`);
    });

    // Form 4: Deploy Sensor
    appContainer.querySelector('#form-launch-sensor')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const sensorType = appContainer.querySelector('#launch-sensor-type').value;
      const name = appContainer.querySelector('#launch-sensor-name').value;

      store.launchSensorAtPin({
        gps: [store.state.targetedPin.lat, store.state.targetedPin.lng],
        sensorType,
        name
      });

      sounds.playSuccess();
      sounds.speakDispatch(`IoT station deployed at pinned sector. Telemetry streaming live.`);
    });

    // BINDINGS FOR SCENARIO CONTROLS (PANEL 2)
    appContainer.querySelectorAll('[data-scenario]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const scenarioKey = e.currentTarget.getAttribute('data-scenario');
        sounds.playSuccess();
        store.applyScenarioPreset(scenarioKey);
        renderMissionLaunchView(appContainer);
      });
    });

    appContainer.querySelectorAll('input[type="range"][data-env-key]').forEach(input => {
      input.addEventListener('input', (e) => {
        const key = e.target.getAttribute('data-env-key');
        const val = parseFloat(e.target.value);
        store.setEnvironmentParam(key, val);
      });
      input.addEventListener('change', () => {
        sounds.playSuccess();
        renderMissionLaunchView(appContainer);
      });
    });

    appContainer.querySelectorAll('select[data-env-key]').forEach(select => {
      select.addEventListener('change', (e) => {
        const key = e.target.getAttribute('data-env-key');
        const val = e.target.value;
        store.setEnvironmentParam(key, val);
        sounds.playSuccess();
        renderMissionLaunchView(appContainer);
      });
    });

    appContainer.querySelector('#btn-reset-env-nominal')?.addEventListener('click', () => {
      store.applyScenarioPreset('NORMAL');
      sounds.playSuccess();
      renderMissionLaunchView(appContainer);
    });

    // BINDINGS FOR SIMULATION CONTROLS (PANEL 3)
    appContainer.querySelector('#btn-run-full-demo')?.addEventListener('click', () => {
      sounds.playEmergencyAlert();
      simEngine.startEmergencyDemo();
    });

    appContainer.querySelector('#btn-step-1')?.addEventListener('click', () => {
      simEngine.runStep1();
      renderMissionLaunchView(appContainer);
    });

    appContainer.querySelector('#btn-step-2')?.addEventListener('click', () => {
      simEngine.runStep2();
      renderMissionLaunchView(appContainer);
    });

    appContainer.querySelector('#btn-step-3')?.addEventListener('click', () => {
      simEngine.runStep3();
      renderMissionLaunchView(appContainer);
    });

    appContainer.querySelector('#btn-step-4')?.addEventListener('click', () => {
      simEngine.runStep4();
      renderMissionLaunchView(appContainer);
    });

    appContainer.querySelector('#btn-step-5')?.addEventListener('click', () => {
      simEngine.runStep5();
      renderMissionLaunchView(appContainer);
    });

    appContainer.querySelector('#btn-reset-demo')?.addEventListener('click', () => {
      store.resetAllState();
      sounds.playSuccess();
      renderMissionLaunchView(appContainer);
    });

    appContainer.querySelector('#btn-net-blackout')?.addEventListener('click', () => {
      store.applyScenarioPreset('NETWORK_FAILURE');
      sounds.playEmergencyAlert();
      renderMissionLaunchView(appContainer);
    });

  }, 50);
}
