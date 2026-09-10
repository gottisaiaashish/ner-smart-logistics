/**
 * Control Room / Dispatcher GIS Command Center View
 * 100% Fullscreen Official NDMA / NDRF Disaster Logistics Operations Center
 * Clean, Non-Overlapping Unified Command Deck (Zero Collisions, Zero Clutter)
 * Pure SVG vector icons (Zero Emojis), High-Performance Tactical GIS Map
 */

import { GisMap } from '../components/gis-map.js';
import { store, USER_ROLES } from '../state/store.js';
import { navigateTo } from '../app.js';
import { openVehicleModal } from '../components/vehicle-modal.js';
import { openCheckpostDispatchModal } from '../components/checkpost-dispatch-modal.js';
import { openRoadModal } from '../components/road-modal.js';
import { openDeliveryModal } from '../components/delivery-modal.js';
import { openAlertModal } from '../components/alert-modal.js';
import { openAnalyticsModal } from '../components/analytics-modal.js';
import { openEnvironmentControlModal } from '../components/environment-control-modal.js';
import { openExplainableAIModal } from '../components/explainable-ai-modal.js';
import { openIncidentReportModal } from '../components/incident-report-modal.js';
import { sounds } from '../audio/sound-effects.js';

export function renderControlRoomView(appContainer) {
  const { vehicles, alerts, timeline, aiIntelligence, routesEvaluation, logisticsImpact, executiveSummary, activeScenarioPreset } = store.state;

  const activeVehiclesCount = vehicles.length;
  const emergencyAlertsCount = alerts.filter(a => a.severity === 'CRITICAL' || a.severity === 'HIGH').length;

  const riskScore = aiIntelligence.accessibilityRiskPct;
  const isHighRisk = riskScore >= 70;
  const riskStatusText = isHighRisk ? 'CRITICAL DISRUPTION' : riskScore >= 40 ? 'ELEVATED RISK' : 'NOMINAL';

  const riskColor = isHighRisk ? 'text-rose-400' : riskScore >= 40 ? 'text-amber-400' : 'text-emerald-400';
  const riskBorderColor = isHighRisk ? 'border-rose-500/60' : riskScore >= 40 ? 'border-amber-500/60' : 'border-emerald-500/60';
  const riskBgColor = isHighRisk ? 'bg-rose-950/40' : riskScore >= 40 ? 'bg-amber-950/40' : 'bg-emerald-950/40';

  appContainer.innerHTML = `
    <!-- 100% Fullscreen Official Tactical Command Center -->
    <main class="h-screen w-screen relative overflow-hidden bg-slate-950 select-none">
      
      <!-- LAYER 0: 100% Fullscreen Tactical GIS Canvas -->
      <div id="gis-map-container" class="absolute inset-0 w-full h-full z-0"></div>

      <!-- LAYER 1: Top Unified Official Command Header (Floating Glass Deck - NO COLLISION) -->
      <div class="relative z-20 m-3 pointer-events-auto">
        <div class="bg-[#0b1329]/95 backdrop-blur-2xl border border-slate-700/80 rounded-2xl p-2.5 shadow-2xl space-y-2 max-w-[1700px] mx-auto">
          
          <!-- TOP ROW: Brand + Situation Briefing + Action Buttons -->
          <div class="flex flex-wrap items-center justify-between gap-3">
            
            <!-- Left: Official Brand & Clock -->
            <div class="flex items-center gap-3 shrink-0">
              <div class="w-8 h-8 rounded-xl bg-cyan-950 border border-cyan-500/50 flex items-center justify-center font-mono font-bold text-xs text-cyan-400 shadow-md">
                NER
              </div>
              <div>
                <div class="flex items-center gap-1.5">
                  <span class="font-bold text-xs tracking-tight text-white uppercase font-mono">NER DISASTER C2</span>
                  <span class="text-[9px] font-mono px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-700 font-bold">LIVE</span>
                </div>
                <span id="live-ist-clock" class="text-[10px] text-slate-400 font-mono block">--:--:-- IST</span>
              </div>
            </div>

            <!-- Center: Situation Briefing -->
            <div class="flex-1 min-w-[280px] max-w-2xl px-3 py-1 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-3">
              <span class="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse shrink-0"></span>
              <div class="min-w-0 flex-1">
                <div class="flex items-center gap-2">
                  <span class="text-[10px] font-mono font-extrabold text-cyan-400 uppercase tracking-wider">SITUATION</span>
                  <span class="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 border border-slate-700 uppercase font-semibold">
                    ${activeScenarioPreset.replace('_', ' ')}
                  </span>
                </div>
                <p class="text-xs text-slate-200 font-medium truncate">
                  ${executiveSummary}
                </p>
              </div>
            </div>

            <!-- Right: Action Buttons Group -->
            <div class="flex items-center gap-2 shrink-0">
              <button id="btn-banner-open-dispatch" class="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white text-xs font-mono font-bold transition shadow-md shadow-emerald-950/60 flex items-center gap-1.5 border border-emerald-400/40">
                <svg class="w-3.5 h-3.5 text-emerald-100" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"/></svg>
                <span>+ Dispatch</span>
              </button>
              
              <button id="btn-banner-open-xai" class="px-3 py-1.5 rounded-xl bg-purple-950/90 hover:bg-purple-900 active:scale-95 text-purple-200 text-xs font-mono font-semibold border border-purple-500/60 transition shadow-md flex items-center gap-1.5">
                <svg class="w-3.5 h-3.5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                <span>Explain AI</span>
              </button>
              
              <button id="btn-banner-open-report" class="px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 active:scale-95 text-cyan-300 text-xs font-mono font-semibold border border-cyan-500/50 transition shadow-md flex items-center gap-1.5">
                <svg class="w-3.5 h-3.5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                <span>NDRF Report</span>
              </button>

              <button id="btn-switch-driver-portal" class="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-95 text-white text-xs font-mono font-bold transition shadow-md flex items-center gap-1.5 border border-blue-400/40" title="Switch to Driver In-Cab Cockpit">
                <svg class="w-3.5 h-3.5 text-blue-100" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/></svg>
                <span>Driver HUD</span>
              </button>

              <button id="btn-toggle-intel-dock" class="p-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 transition shadow-md" title="Toggle Intelligence Panel">
                <svg id="icon-intel-dock" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"/></svg>
              </button>
            </div>

          </div>

          <!-- BOTTOM ROW: Map Modes + Sector Filters + Tactical Layer Toggles -->
          <div class="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-800/80 text-xs">
            
            <!-- Basemap Selector -->
            <div class="flex items-center gap-1 pr-2 border-r border-slate-800 shrink-0">
              <button id="btn-map-road" class="px-2.5 py-0.5 rounded-lg font-mono font-bold transition bg-cyan-500 text-slate-950 shadow-sm text-[11px]">
                MAP
              </button>
              <button id="btn-map-sat" class="px-2.5 py-0.5 rounded-lg font-mono font-medium transition text-slate-300 hover:text-white text-[11px]">
                SATELLITE
              </button>
              <button id="btn-map-topo" class="px-2.5 py-0.5 rounded-lg font-mono font-medium transition text-slate-300 hover:text-white text-[11px]">
                TERRAIN
              </button>
              <button id="btn-map-traffic" class="px-2.5 py-0.5 rounded-lg font-mono font-medium transition text-slate-300 hover:text-white text-[11px]">
                TRAFFIC
              </button>
            </div>

            <!-- Sector Filters -->
            <div class="flex items-center gap-1 pr-2 border-r border-slate-800 shrink-0 text-[11px] font-mono">
              <span class="text-slate-400 px-1 font-bold">SECTOR:</span>
              <button data-region="ALL" class="px-2 py-0.5 rounded-md bg-slate-800 hover:bg-cyan-600 text-slate-200 transition">ALL NER</button>
              <button data-region="ML" class="px-2 py-0.5 rounded-md bg-slate-800 hover:bg-cyan-600 text-slate-200 transition">Meghalaya</button>
              <button data-region="AS" class="px-2 py-0.5 rounded-md bg-slate-800 hover:bg-cyan-600 text-slate-200 transition">Assam</button>
              <button data-region="AR" class="px-2 py-0.5 rounded-md bg-slate-800 hover:bg-cyan-600 text-slate-200 transition">Arunachal</button>
              <button data-region="MN" class="px-2 py-0.5 rounded-md bg-slate-800 hover:bg-cyan-600 text-slate-200 transition">Manipur</button>
            </div>

            <!-- Layer Toggles -->
            <div class="flex items-center gap-1 shrink-0 text-[10px] font-mono">
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

          </div>

        </div>
      </div>

      <!-- LAYER 2: Right-Side Command Intelligence Drawer (Docked cleanly below the header) -->
      <aside id="command-intel-dock" class="absolute top-28 right-3 bottom-3 w-[390px] xl:w-[430px] z-20 overflow-y-auto bg-[#0b1329]/95 backdrop-blur-2xl border border-slate-700/80 rounded-2xl p-4 space-y-4 shadow-2xl transition-all duration-300 flex flex-col divide-y divide-slate-800/80 pointer-events-auto">
        
        <!-- SECTION 1: Operational Impact Metrics -->
        <div class="space-y-3 pt-1">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-cyan-400"></span>
              <h3 class="text-xs font-mono font-bold text-slate-300 uppercase tracking-widest">
                Impact Metrics
              </h3>
            </div>
            <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-400 border border-slate-700">
              SECTOR: ML-NH6
            </span>
          </div>

          <!-- 3x2 Metric Grid -->
          <div class="grid grid-cols-3 gap-2">
            <div class="p-2 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 transition">
              <div class="text-[9px] font-mono text-slate-400 uppercase">Roads</div>
              <div class="text-base font-bold font-mono text-amber-400 mt-0.5">${logisticsImpact.affectedRoadsCount}</div>
              <span class="text-[9px] text-slate-500 font-mono">NH-6, NH-13</span>
            </div>

            <div class="p-2 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 transition">
              <div class="text-[9px] font-mono text-slate-400 uppercase">Trucks</div>
              <div class="text-base font-bold font-mono text-rose-400 mt-0.5">${logisticsImpact.affectedVehiclesCount}</div>
              <span class="text-[9px] text-rose-400 font-mono">TRUCK-07</span>
            </div>

            <div class="p-2 rounded-xl bg-slate-900/80 border border-rose-500/40 bg-rose-950/20 hover:border-rose-500 transition">
              <div class="text-[9px] font-mono text-rose-300 uppercase">Critical</div>
              <div class="text-base font-bold font-mono text-rose-400 mt-0.5">${logisticsImpact.criticalDeliveriesAtRisk} Med</div>
              <span class="text-[9px] text-rose-300 font-mono">Vaccines</span>
            </div>

            <div class="p-2 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/40 transition">
              <div class="text-[9px] font-mono text-slate-400 uppercase">Fleet</div>
              <div class="text-base font-bold font-mono text-white mt-0.5">${activeVehiclesCount} Units</div>
              <span class="text-[9px] text-emerald-400 font-mono">100% Online</span>
            </div>

            <div class="p-2 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 transition">
              <div class="text-[9px] font-mono text-slate-400 uppercase">Est Delay</div>
              <div class="text-base font-bold font-mono text-amber-400 mt-0.5">+${logisticsImpact.estimatedTotalDelayMin}m</div>
              <span class="text-[9px] text-amber-400 font-mono">Sonapur Pass</span>
            </div>

            <div class="p-2 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-rose-500/40 transition cursor-pointer" id="btn-card-alerts">
              <div class="text-[9px] font-mono text-slate-400 uppercase">Alerts</div>
              <div class="text-base font-bold font-mono text-rose-400 mt-0.5">${emergencyAlertsCount}</div>
              <span class="text-[9px] text-rose-400 font-mono">View →</span>
            </div>
          </div>
        </div>

        <!-- SECTION 2: AI Accessibility Risk Engine -->
        <div class="space-y-3 pt-3">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-xs font-mono font-bold text-white uppercase tracking-widest">AI Risk Model</h3>
              <span class="text-[10px] text-slate-400 font-mono">Predictive hazard & cutoff</span>
            </div>
            <button id="btn-trigger-xai" class="text-[11px] font-mono font-semibold text-purple-300 bg-purple-950/80 hover:bg-purple-900 px-2.5 py-1 rounded-lg border border-purple-700/80 transition">
              Explain Factors
            </button>
          </div>

          <!-- Risk Score Box -->
          <div class="p-3 rounded-xl border ${riskBorderColor} ${riskBgColor} space-y-2">
            <div class="flex items-center justify-between">
              <div>
                <span class="text-[9px] font-mono text-slate-400 uppercase tracking-wider">Disruption Risk</span>
                <div class="text-2xl font-mono font-extrabold ${riskColor} tracking-tight">
                  ${riskScore}%
                </div>
              </div>
              <div class="text-right">
                <span class="text-[9px] font-mono text-slate-400 uppercase tracking-wider">State</span>
                <div class="px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${riskBorderColor} ${riskColor} mt-0.5">
                  ${riskStatusText}
                </div>
              </div>
            </div>

            <div class="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden border border-slate-800">
              <div class="h-1.5 rounded-full transition-all duration-700 ${isHighRisk ? 'bg-rose-500' : riskScore >= 40 ? 'bg-amber-500' : 'bg-emerald-500'}" style="width: ${riskScore}%"></div>
            </div>

            <div class="text-[10px] text-slate-300 font-mono flex items-center justify-between pt-0.5">
              <span>Target: <strong class="text-white">${aiIntelligence.corridorName}</strong></span>
              <span class="text-slate-400">${aiIntelligence.confidenceScore}% Confidence</span>
            </div>
          </div>

          <!-- AI Forecast -->
          <div class="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
            <div class="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold">
              AI Forecast: Cutoff in ${aiIntelligence.timeToCutoffMinutes} min
            </div>
            <p class="text-[11px] text-slate-200 font-mono leading-relaxed">${aiIntelligence.predictionText}</p>
          </div>
        </div>

        <!-- SECTION 3: Evaluated Corridors (Guwahati → Silchar) -->
        <div class="space-y-3 pt-3">
          <div class="flex items-center justify-between">
            <h3 class="text-xs font-mono font-bold text-slate-300 uppercase tracking-widest">
              Corridor Alternatives
            </h3>
            <span class="text-[10px] font-mono text-emerald-400">3 Analyzed</span>
          </div>

          <!-- Route A (Primary - Blocked) -->
          <div class="p-2.5 rounded-xl border ${routesEvaluation.routeA.riskPct >= 70 ? 'border-rose-500/60 bg-rose-950/20' : 'border-slate-800 bg-slate-900/70'} space-y-1">
            <div class="flex items-center justify-between">
              <div>
                <span class="text-xs font-bold text-white font-mono">ROUTE A (NH-6)</span>
                <div class="text-[10px] text-slate-400 font-mono">Via Shillong-Sonapur · 315 km</div>
              </div>
              <div class="text-right font-mono">
                <div class="text-xs font-bold ${routesEvaluation.routeA.riskPct >= 70 ? 'text-rose-400' : 'text-amber-400'}">${routesEvaluation.routeA.riskPct}% Risk</div>
                <span class="text-[9px] px-1.5 py-0.2 rounded border ${routesEvaluation.routeA.riskPct >= 70 ? 'bg-rose-950 text-rose-300 border-rose-600' : 'bg-amber-950 text-amber-300 border-amber-600'} font-semibold">${routesEvaluation.routeA.status}</span>
              </div>
            </div>
          </div>

          <!-- Route B (Safe AI Alternate) -->
          <div class="p-3 rounded-xl border border-emerald-500/70 bg-emerald-950/30 space-y-2 shadow-lg shadow-emerald-950/30">
            <div class="flex items-center justify-between">
              <div>
                <div class="flex items-center gap-1.5">
                  <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span class="text-xs font-bold text-emerald-300 font-mono">ROUTE B (NH-27)</span>
                </div>
                <div class="text-[10px] text-slate-300 font-mono mt-0.5">Via Haflong-Umrangso · 348 km (+33 km)</div>
              </div>
              <div class="text-right font-mono">
                <div class="text-xs font-bold text-emerald-400">${routesEvaluation.routeB.riskPct}% Risk</div>
                <span class="text-[9px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-600 font-bold">${routesEvaluation.routeB.status}</span>
              </div>
            </div>
            
            <div class="flex items-center justify-between pt-1.5 border-t border-emerald-500/30 text-xs">
              <span class="text-emerald-300 font-mono text-[10px]">Low Hazard Corridors</span>
              <button id="btn-execute-reroute-route-b" class="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-mono font-bold text-xs transition shadow-md">
                Execute Reroute
              </button>
            </div>
          </div>
        </div>

        <!-- SECTION 4: Corridors Legend (Cleanly In Dock) -->
        <div class="space-y-2 pt-3">
          <div class="font-mono font-bold text-slate-300 uppercase tracking-wider text-[10px] flex items-center justify-between">
            <span>Evaluated Corridors Legend</span>
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          </div>
          <div class="space-y-1 text-[11px] text-slate-300 font-mono bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
            <div class="flex items-center gap-2">
              <span class="w-3.5 h-1 bg-amber-400 rounded"></span>
              <span>Route A: NH-6 Primary Arterial</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="w-3.5 h-1 bg-emerald-400 rounded border-dashed border-t"></span>
              <span>Route B: AI Safe Alternate (NH-27)</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="w-3.5 h-1 bg-purple-400 rounded border-dashed border-t"></span>
              <span>Route C: Emergency Ridge Bypass</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="w-2.5 h-2.5 rounded-full bg-rose-500 border border-rose-400"></span>
              <span>Landslide / Rockfall Hazard Hotspot</span>
            </div>
          </div>
        </div>

        <!-- SECTION 5: Digital Push-to-Talk Console -->
        <div class="space-y-2 pt-3">
          <div class="flex items-center justify-between">
            <h3 class="text-xs font-mono font-bold text-white uppercase tracking-widest">Dispatch Radio</h3>
            <span class="text-[10px] font-mono text-emerald-400">SAT-LINK ONLINE</span>
          </div>

          <button id="btn-cr-ptt-talk" class="w-full py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 text-white font-mono font-bold text-xs flex items-center justify-center gap-2 shadow-md transition select-none">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"/></svg>
            <span>HOLD TO TRANSMIT DISPATCH</span>
          </button>
        </div>

        <!-- SECTION 6: Active Fleet Tracking -->
        <div class="space-y-2 pt-3 pb-2">
          <div class="flex items-center justify-between">
            <h3 class="text-xs font-mono font-bold text-slate-300 uppercase tracking-widest">
              Fleet Units (${vehicles.length})
            </h3>
            <span class="text-[10px] text-slate-500 font-mono">Click to Zoom</span>
          </div>

          <div class="space-y-1.5 max-h-40 overflow-y-auto pr-1">
            ${vehicles.map(v => {
              const vid = v.id || v.vehicleId || 'TRUCK-01';
              const priority = v.priority || v.cargoPriority || 'CRITICAL';
              const isCrit = v.riskLevel === 'CRITICAL' || priority === 'CRITICAL';
              const isReroute = v.status === 'REROUTED';
              const statusBadge = isReroute ? 'text-emerald-400 border-emerald-500/50 bg-emerald-950/40' : isCrit ? 'text-rose-400 border-rose-500/50 bg-rose-950/40' : 'text-cyan-300 border-cyan-500/50 bg-cyan-950/40';

              return `
                <div class="btn-vehicle-card p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800 cursor-pointer transition flex items-center justify-between group" data-vid="${vid}">
                  <div class="space-y-0.5 flex-1 min-w-0 pr-2">
                    <div class="flex items-center gap-1.5">
                      <span class="font-mono font-bold text-white text-xs">${vid}</span>
                      <span class="text-[9px] font-mono px-1.5 py-0.2 rounded border ${statusBadge}">${v.status || 'IN_TRANSIT'}</span>
                    </div>
                    <div class="text-[11px] text-slate-300 truncate">${v.cargo || 'Medical Rations & Supplies'}</div>
                  </div>
                  <div class="flex items-center gap-2 shrink-0">
                    <div class="text-right font-mono">
                      <div class="text-xs font-bold text-cyan-400">${v.speed || 48} km/h</div>
                      <div class="text-[10px] text-emerald-400">ETA ${v.eta || '4h 15m'}</div>
                    </div>
                    <button class="btn-delete-vehicle p-1 rounded-lg bg-rose-950/40 hover:bg-rose-900 text-rose-400 hover:text-white border border-rose-800/50 transition opacity-70 group-hover:opacity-100" data-del-vid="${vid}" title="Delete Unit ${vid}">
                      <span class="text-xs font-mono font-bold">✕</span>
                    </button>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

      </aside>

      <!-- LAYER 3: Bottom Live Causality Log Drawer (Anchored from left-3 to right-[415px]) -->
      <div id="command-bottom-dock" class="absolute bottom-3 left-3 right-[415px] xl:right-[455px] z-20 pointer-events-none transition-all duration-300">
        <div class="pointer-events-auto bg-[#0b1329]/95 backdrop-blur-2xl border border-slate-700/80 rounded-2xl p-2.5 shadow-2xl space-y-1.5">
          <div class="flex items-center justify-between px-2 text-[10px] font-mono">
            <div class="flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
              <span class="font-bold text-slate-300 uppercase tracking-wider">Live Causality Event Stream</span>
            </div>
            <div class="text-slate-400">
              Sync: <strong class="text-emerald-400">LIVE GPS</strong>
            </div>
          </div>

          <div class="overflow-x-auto flex items-center gap-2.5 pb-0.5">
            ${timeline.map((evt) => {
              const borderBadge = evt.type === 'danger' ? 'border-rose-500/60 bg-rose-950/40 text-rose-200' : evt.type === 'ai' ? 'border-purple-500/60 bg-purple-950/40 text-purple-200' : evt.type === 'weather' ? 'border-cyan-500/60 bg-cyan-950/40 text-cyan-200' : evt.type === 'success' ? 'border-emerald-500/60 bg-emerald-950/40 text-emerald-200' : 'border-slate-800 bg-slate-900/80 text-slate-300';
              return `
                <div class="p-2 rounded-xl border ${borderBadge} min-w-[260px] max-w-[320px] shrink-0 space-y-0.5 shadow-sm">
                  <div class="flex items-center justify-between text-[10px]">
                    <span class="font-mono font-bold uppercase tracking-tight">${evt.title}</span>
                    <span class="font-mono text-slate-400">${evt.time}</span>
                  </div>
                  <p class="text-[11px] text-slate-300 leading-tight truncate">${evt.desc}</p>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </div>

    </main>
  `;

  // Start Live IST Clock
  const clockEl = appContainer.querySelector('#live-ist-clock');
  if (clockEl) {
    const updateClock = () => {
      const now = new Date();
      clockEl.textContent = now.toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour12: false }) + ' IST';
    };
    updateClock();
    setInterval(updateClock, 1000);
  }

  // Initialize GIS Map with clean standalone settings
  setTimeout(() => {
    const gisMap = new GisMap('gis-map-container', {
      standaloneControls: false,
      onVehicleClick: (vehicleId) => {
        sounds.playSuccess();
        openVehicleModal(vehicleId);
      },
      onRoadClick: (corridorId) => {
        sounds.playSuccess();
        openRoadModal(corridorId);
      },
      onIncidentClick: (report) => {
        sounds.playSuccess();
        openAlertModal();
      }
    });

    gisMap.init();

    setTimeout(() => {
      if (gisMap.map) gisMap.map.invalidateSize();
    }, 150);

    // Fast switch to driver portal
    appContainer.querySelector('#btn-switch-driver-portal')?.addEventListener('click', () => {
      sounds.playSuccess();
      navigateTo('driver');
    });

    // Basemap selector buttons
    const basemapButtons = {
      '#btn-map-road': 'googleRoad',
      '#btn-map-sat': 'googleSat',
      '#btn-map-topo': 'googleTerrain',
      '#btn-map-traffic': 'googleTraffic'
    };

    Object.entries(basemapButtons).forEach(([btnId, tileKey]) => {
      appContainer.querySelector(btnId)?.addEventListener('click', (e) => {
        gisMap.setTileLayer(tileKey);
        // Update active style
        Object.keys(basemapButtons).forEach(id => {
          const btn = appContainer.querySelector(id);
          if (btn) {
            btn.className = 'px-2.5 py-0.5 rounded-lg font-mono font-medium transition text-slate-300 hover:text-white text-[11px]';
          }
        });
        e.currentTarget.className = 'px-2.5 py-0.5 rounded-lg font-mono font-bold transition bg-cyan-500 text-slate-950 shadow-sm text-[11px]';
      });
    });

    // Sector Region Buttons
    appContainer.querySelectorAll('[data-region]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const regionCode = e.currentTarget.getAttribute('data-region');
        gisMap.flyToRegion(regionCode);
      });
    });

    // Layer Toggle Chips
    appContainer.querySelectorAll('[data-layer-toggle]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const layerName = e.currentTarget.getAttribute('data-layer-toggle');
        gisMap.toggleLayer(layerName);
        const isVis = gisMap.visibleLayers[layerName];
        e.currentTarget.classList.toggle('opacity-50', !isVis);
      });
    });

    // Toggle Intelligence Dock Drawer & adjust bottom log width
    const toggleDockBtn = appContainer.querySelector('#btn-toggle-intel-dock');
    const intelDock = appContainer.querySelector('#command-intel-dock');
    const bottomDock = appContainer.querySelector('#command-bottom-dock');
    if (toggleDockBtn && intelDock) {
      toggleDockBtn.addEventListener('click', () => {
        sounds.playSuccess();
        const isHidden = intelDock.classList.toggle('hidden');
        if (bottomDock) {
          if (isHidden) {
            bottomDock.classList.remove('right-[410px]', 'xl:right-[450px]');
          } else {
            bottomDock.classList.add('right-[410px]', 'xl:right-[450px]');
          }
        }
      });
    }

    // Bind Action Buttons
    appContainer.querySelector('#btn-banner-open-xai')?.addEventListener('click', () => openExplainableAIModal());
    appContainer.querySelector('#btn-banner-open-report')?.addEventListener('click', () => openIncidentReportModal());
    appContainer.querySelector('#btn-trigger-xai')?.addEventListener('click', () => openExplainableAIModal());
    appContainer.querySelector('#btn-card-alerts')?.addEventListener('click', () => openAlertModal());

    // Checkpost Vehicle Dispatch button
    appContainer.querySelector('#btn-banner-open-dispatch')?.addEventListener('click', () => {
      openCheckpostDispatchModal();
    });

    // Execute Reroute to Route B button
    appContainer.querySelector('#btn-execute-reroute-route-b')?.addEventListener('click', () => {
      sounds.playEmergencyAlert();
      store.acceptReroute('TRUCK-07');
      sounds.speakDispatch('Attention TRUCK-07: Reroute executed by Command Dispatch. Divert to Route B.');
    });

    // Control Room Hold-to-Talk PTT
    const crPttBtn = appContainer.querySelector('#btn-cr-ptt-talk');
    if (crPttBtn) {
      const startTalking = (e) => {
        e.preventDefault();
        sounds.playPttPress();
        crPttBtn.classList.add('ring-4', 'ring-cyan-400', 'bg-cyan-500');
      };

      const stopTalking = (e) => {
        e.preventDefault();
        sounds.playPttRelease();
        crPttBtn.classList.remove('ring-4', 'ring-cyan-400', 'bg-cyan-500');
        store.sendPushToTalkMessage({
          sender: 'Control Room Dispatch',
          text: 'Dispatch transmission to all units: Severe weather across NH-6 sector. Execute AI recommended diversions.'
        });
        sounds.speakDispatch('Broadcast transmitted to active fleet.');
      };

      crPttBtn.addEventListener('mousedown', startTalking);
      crPttBtn.addEventListener('mouseup', stopTalking);
      crPttBtn.addEventListener('touchstart', startTalking);
      crPttBtn.addEventListener('touchend', stopTalking);
    }

    // Delete vehicle handler
    appContainer.querySelectorAll('.btn-delete-vehicle').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const vid = e.currentTarget.getAttribute('data-del-vid');
        if (confirm(`Are you sure you want to delete / remove unit ${vid} from Fleet Tracking?`)) {
          sounds.playSuccess();
          store.deleteVehicle(vid);
        }
      });
    });

    // Vehicle cards focus
    appContainer.querySelectorAll('.btn-vehicle-card').forEach(card => {
      card.addEventListener('click', (e) => {
        const vid = e.currentTarget.getAttribute('data-vid');
        store.setSelectedVehicle(vid);
        gisMap.focusVehicle(vid);
        openVehicleModal(vid);
      });
    });
  }, 50);
}
