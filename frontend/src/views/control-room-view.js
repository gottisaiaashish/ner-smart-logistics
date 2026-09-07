/**
 * Control Room / Dispatcher GIS Command Center View
 * Production-Grade Command Center: Connects Environment -> Road Hazards -> AI Risk Engine -> Route Scoring -> Fleet Dispatch
 */

import { renderNavbar } from '../components/navbar.js';
import { GisMap } from '../components/gis-map.js';
import { store } from '../state/store.js';
import { openVehicleModal } from '../components/vehicle-modal.js';
import { openCheckpostDispatchModal } from '../components/checkpost-dispatch-modal.js';
import { openRoadModal } from '../components/road-modal.js';
import { openDeliveryModal } from '../components/delivery-modal.js';
import { openAlertModal } from '../components/alert-modal.js';
import { openAnalyticsModal } from '../components/analytics-modal.js';
import { openEnvironmentControlModal } from '../components/environment-control-modal.js';
import { openExplainableAIModal } from '../components/explainable-ai-modal.js';
import { sounds } from '../audio/sound-effects.js';

export function renderControlRoomView(appContainer) {
  const { vehicles, alerts, timeline, aiIntelligence, routesEvaluation, environment, logisticsImpact, executiveSummary, activeScenarioPreset } = store.state;

  const activeVehiclesCount = vehicles.length;
  const inTransitCount = vehicles.filter(v => v.status === 'IN_TRANSIT' || v.status === 'REROUTED').length;
  const emergencyAlertsCount = alerts.filter(a => a.severity === 'CRITICAL' || a.severity === 'HIGH').length;

  const riskScore = aiIntelligence.accessibilityRiskPct;
  const isHighRisk = riskScore >= 70;
  const riskStatusText = isHighRisk ? 'CRITICAL DISRUPTION' : riskScore >= 40 ? 'ELEVATED RISK' : 'NOMINAL';

  const riskColor = isHighRisk ? 'text-rose-400' : riskScore >= 40 ? 'text-amber-400' : 'text-emerald-400';
  const riskBorderColor = isHighRisk ? 'border-rose-500/60' : riskScore >= 40 ? 'border-amber-500/60' : 'border-emerald-500/60';
  const riskBgColor = isHighRisk ? 'bg-rose-950/25' : riskScore >= 40 ? 'bg-amber-950/25' : 'bg-emerald-950/25';

  appContainer.innerHTML = `
    <!-- Top Nav Header -->
    <div id="nav-container" class="shrink-0"></div>

    <!-- Main Command Layout -->
    <main class="h-[calc(100vh-53px)] flex flex-col lg:flex-row overflow-hidden relative w-full">
      
      <!-- LEFT / CENTER: Large GIS Tactical Map -->
      <section class="flex-1 flex flex-col h-full relative border-r border-command-border min-w-0">
        
        <!-- Top Executive Briefing Banner -->
        <div class="absolute top-4 left-4 right-4 z-[1000] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 hud-panel rounded-xl p-3.5 border border-cyan-500/30 shadow-2xl pointer-events-auto">
          <div class="flex items-center gap-3.5 flex-1 min-w-0">
            <span class="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse shrink-0"></span>
            <div class="min-w-0">
              <div class="flex items-center gap-2">
                <span class="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest">SITUATION BRIEFING</span>
                <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-command-800 text-slate-300 border border-command-border uppercase">
                  ${activeScenarioPreset.replace('_', ' ')}
                </span>
              </div>
              <p class="text-xs text-slate-200 font-medium truncate mt-1" title="${executiveSummary}">
                ${executiveSummary}
              </p>
            </div>
          </div>

          <!-- Action Button -->
          <div class="flex items-center gap-2 shrink-0">
            <button id="btn-banner-open-dispatch" class="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold transition shadow-md shadow-emerald-950 flex items-center gap-1.5">
              <span>+ Dispatch Checkpost Vehicle</span>
            </button>
            <button id="btn-banner-open-xai" class="px-3.5 py-1.5 rounded-lg bg-purple-950/70 hover:bg-purple-900/80 text-purple-200 text-xs font-mono font-semibold border border-purple-600/60 transition shadow-sm">
              Explain AI Risk
            </button>
          </div>
        </div>

        <!-- GIS Map Container -->
        <div id="gis-map-container" class="flex-1 w-full relative z-0 min-h-0 pt-16"></div>

        <!-- Bottom Timeline Feed Drawer: Live System Causality Stream -->
        <div class="h-44 bg-command-900/95 backdrop-blur-md border-t border-command-border flex flex-col z-10 shrink-0">
          <div class="px-5 py-2 border-b border-command-border flex items-center justify-between bg-command-950">
            <div class="flex items-center gap-2.5">
              <span class="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
              <h3 class="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider">
                Live Causality Event Stream & Telemetry Log
              </h3>
            </div>
            <div class="text-[11px] font-mono text-slate-400">
              Auto-Sync: <strong class="text-emerald-400">LIVE</strong>
            </div>
          </div>

          <div class="flex-1 overflow-x-auto p-3 flex items-center gap-3.5">
            ${timeline.map((evt) => {
              const borderBadge = evt.type === 'danger' ? 'border-rose-500/60 bg-rose-950/30 text-rose-200' : evt.type === 'ai' ? 'border-purple-500/60 bg-purple-950/30 text-purple-200' : evt.type === 'weather' ? 'border-cyan-500/60 bg-cyan-950/30 text-cyan-200' : evt.type === 'success' ? 'border-emerald-500/60 bg-emerald-950/30 text-emerald-200' : 'border-command-border bg-command-850 text-slate-300';
              return `
                <div class="p-3 rounded-lg border ${borderBadge} min-w-[300px] max-w-[360px] shrink-0 space-y-1.5 shadow-sm">
                  <div class="flex items-center justify-between text-[11px]">
                    <span class="font-mono font-bold uppercase tracking-tight">${evt.title}</span>
                    <span class="font-mono text-slate-400">${evt.time}</span>
                  </div>
                  <p class="text-xs text-slate-300 leading-snug line-clamp-2">${evt.desc}</p>
                </div>
              `;
            }).join('')}
          </div>
        </div>

      </section>

      <!-- RIGHT SIDEBAR: Control Room Brain (AI Intelligence, Multi-Route Engine, Logistics Impact, Fleet) -->
      <aside class="w-full lg:w-[420px] xl:w-[460px] h-full bg-command-950 overflow-y-auto flex flex-col divide-y divide-command-border shrink-0 z-10 shadow-2xl">
        
        <!-- SECTION 1: Logistics Impact Overview -->
        <div class="p-5 space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="text-xs font-mono font-bold text-slate-300 uppercase tracking-widest">
              Operational Impact Metrics
            </h3>
            <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-command-850 text-cyan-400 border border-command-border">
              SECTOR: ML-NH6
            </span>
          </div>

          <!-- Impact Metric Cards Grid -->
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            <!-- Affected Roads -->
            <div class="p-3 rounded-xl bg-command-850 border border-command-border hover:border-cyan-500/40 transition">
              <div class="text-[10px] font-mono text-slate-400 uppercase">Affected Roads</div>
              <div class="text-xl font-bold font-mono text-amber-400 mt-1">${logisticsImpact.affectedRoadsCount} Corridors</div>
              <span class="text-[10px] text-slate-400 font-mono">NH-6, NH-13</span>
            </div>

            <!-- Affected Vehicles -->
            <div class="p-3 rounded-xl bg-command-850 border border-command-border hover:border-cyan-500/40 transition">
              <div class="text-[10px] font-mono text-slate-400 uppercase">Affected Trucks</div>
              <div class="text-xl font-bold font-mono text-rose-400 mt-1">${logisticsImpact.affectedVehiclesCount} Units</div>
              <span class="text-[10px] text-rose-400 font-mono">TRUCK-07, 04</span>
            </div>

            <!-- Critical Deliveries at Risk -->
            <div class="p-3 rounded-xl bg-command-850 border border-rose-500/40 bg-rose-950/20 hover:border-rose-500 transition">
              <div class="text-[10px] font-mono text-rose-300 uppercase">Critical Cargo</div>
              <div class="text-xl font-bold font-mono text-rose-400 mt-1">${logisticsImpact.criticalDeliveriesAtRisk} Medical</div>
              <span class="text-[10px] text-rose-300 font-mono">Cold-Chain Vaccines</span>
            </div>

            <!-- Active Vehicles Monitored -->
            <div class="p-3 rounded-xl bg-command-850 border border-command-border hover:border-emerald-500/40 transition">
              <div class="text-[10px] font-mono text-slate-400 uppercase">Fleet Monitored</div>
              <div class="text-xl font-bold font-mono text-white mt-1">${activeVehiclesCount} Convoys</div>
              <span class="text-[10px] text-emerald-400 font-mono">100% Online</span>
            </div>

            <!-- Estimated Delay Delta -->
            <div class="p-3 rounded-xl bg-command-850 border border-command-border hover:border-amber-500/40 transition">
              <div class="text-[10px] font-mono text-slate-400 uppercase">Est. Delay</div>
              <div class="text-xl font-bold font-mono text-amber-400 mt-1">+${logisticsImpact.estimatedTotalDelayMin} min</div>
              <span class="text-[10px] text-amber-400 font-mono">Sonapur Pass</span>
            </div>

            <!-- Active Emergency Alerts -->
            <div class="p-3 rounded-xl bg-command-850 border border-command-border hover:border-rose-500/40 transition cursor-pointer" id="btn-card-alerts">
              <div class="text-[10px] font-mono text-slate-400 uppercase">Active Alerts</div>
              <div class="text-xl font-bold font-mono text-rose-400 mt-1">${emergencyAlertsCount}</div>
              <span class="text-[10px] text-rose-400 font-mono">View detail →</span>
            </div>
          </div>
        </div>

        <!-- SECTION 2: AI Accessibility Intelligence (Explainable AI Engine) -->
        <div class="p-5 space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-xs font-mono font-bold text-white uppercase tracking-widest">AI Accessibility Model</h3>
              <span class="text-[11px] text-slate-400 font-mono">Predictive hazard & cutoff forecasting</span>
            </div>
            <button id="btn-trigger-xai" class="text-xs font-mono font-semibold text-purple-300 bg-purple-950/80 hover:bg-purple-900 px-3 py-1 rounded-md border border-purple-700/80 transition">
              Explain Factors
            </button>
          </div>

          <!-- Risk Score Meter Box -->
          <div class="p-4 rounded-xl border ${riskBorderColor} ${riskBgColor} space-y-3">
            <div class="flex items-center justify-between">
              <div>
                <span class="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Disruption Risk Score</span>
                <div class="text-3xl font-mono font-extrabold ${riskColor} tracking-tight mt-0.5">
                  ${riskScore}%
                </div>
              </div>
              <div class="text-right">
                <span class="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Corridor State</span>
                <div class="px-2.5 py-1 rounded-md text-xs font-mono font-bold border ${riskBorderColor} ${riskColor} mt-0.5">
                  ${riskStatusText}
                </div>
              </div>
            </div>

            <!-- Risk Progress Bar -->
            <div class="w-full bg-command-900 rounded-full h-2 overflow-hidden border border-command-border">
              <div class="h-2 rounded-full transition-all duration-700 ${isHighRisk ? 'bg-rose-500' : riskScore >= 40 ? 'bg-amber-500' : 'bg-emerald-500'}" style="width: ${riskScore}%"></div>
            </div>

            <div class="text-xs text-slate-300 font-mono flex items-center justify-between pt-1">
              <span>Target: <strong class="text-white">${aiIntelligence.corridorName}</strong></span>
              <span class="text-slate-400">${aiIntelligence.confidenceScore}% Confidence</span>
            </div>
          </div>

          <!-- Primary Risk Drivers Breakdown -->
          <div class="space-y-2">
            <div class="flex items-center justify-between text-[10px] font-mono text-slate-400 uppercase tracking-wider">
              <span>Primary Risk Drivers</span>
              <span>Weight Delta</span>
            </div>
            <div class="space-y-1.5">
              ${aiIntelligence.factors.slice(0, 4).map(f => {
                const dotColor = f.severity === 'critical' ? 'bg-rose-500' : f.severity === 'high' ? 'bg-amber-500' : 'bg-cyan-500';
                return `
                  <div class="p-2 px-3 rounded-lg bg-command-850 border border-command-border flex items-center justify-between text-xs">
                    <div class="flex items-center gap-2.5">
                      <span class="w-1.5 h-1.5 rounded-full ${dotColor}"></span>
                      <span class="text-slate-200 text-xs">${f.name}</span>
                    </div>
                    <div class="flex items-center gap-2.5 font-mono">
                      <span class="text-slate-400 text-[11px]">${f.value}</span>
                      <span class="font-bold text-rose-400 text-xs">${f.delta}</span>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>

          <!-- AI Predicted Disruption -->
          <div class="p-3 rounded-lg bg-command-850 border border-command-border space-y-1">
            <div class="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold">
              AI Forecast: Cutoff in ${aiIntelligence.timeToCutoffMinutes} min
            </div>
            <p class="text-xs text-slate-200 font-mono leading-relaxed">${aiIntelligence.predictionText}</p>
          </div>
        </div>

        <!-- SECTION 3: Evaluated Multiple Routes Matrix -->
        <div class="p-5 space-y-3.5">
          <div class="flex items-center justify-between">
            <h3 class="text-xs font-mono font-bold text-slate-300 uppercase tracking-widest">
              Evaluated Corridors (Guwahati → Silchar)
            </h3>
            <span class="text-[10px] font-mono text-emerald-400">3 Analyzed</span>
          </div>

          <div class="space-y-2.5">
            <!-- ROUTE A -->
            <div class="p-3 rounded-xl border ${routesEvaluation.routeA.riskPct >= 70 ? 'border-rose-500/60 bg-rose-950/20' : 'border-command-border bg-command-850'} space-y-1.5">
              <div class="flex items-center justify-between">
                <div>
                  <span class="text-xs font-bold text-white font-mono">ROUTE A — Primary Arterial (NH-6)</span>
                  <div class="text-[11px] text-slate-400 font-mono mt-0.5">Via Shillong-Sonapur · 315 km · ETA 7h 45m</div>
                </div>
                <div class="text-right font-mono">
                  <div class="text-xs font-bold ${routesEvaluation.routeA.riskPct >= 70 ? 'text-rose-400' : 'text-amber-400'}">${routesEvaluation.routeA.riskPct}% Risk</div>
                  <span class="text-[10px] px-1.5 py-0.5 rounded border ${routesEvaluation.routeA.riskPct >= 70 ? 'bg-rose-950 text-rose-300 border-rose-600' : 'bg-amber-950 text-amber-300 border-amber-600'} font-semibold">${routesEvaluation.routeA.status}</span>
                </div>
              </div>
            </div>

            <!-- ROUTE B -->
            <div class="p-3.5 rounded-xl border border-emerald-500/70 bg-emerald-950/25 space-y-2.5 shadow-lg shadow-emerald-950/20">
              <div class="flex items-center justify-between">
                <div>
                  <div class="flex items-center gap-2">
                    <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span class="text-xs font-bold text-emerald-300 font-mono">ROUTE B — Safe Alternate (NH-27)</span>
                  </div>
                  <div class="text-[11px] text-slate-300 font-mono mt-0.5">Via Haflong-Umrangso · 348 km (+33 km) · ETA 8h 20m</div>
                </div>
                <div class="text-right font-mono">
                  <div class="text-xs font-bold text-emerald-400">${routesEvaluation.routeB.riskPct}% Risk</div>
                  <span class="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-600 font-bold">${routesEvaluation.routeB.status}</span>
                </div>
              </div>
              
              <div class="flex items-center justify-between pt-2 border-t border-emerald-500/30 text-xs">
                <span class="text-emerald-300 font-mono text-[11px]">Reinforced rock bedrock (Low Hazard)</span>
                <button id="btn-execute-reroute-route-b" class="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold text-xs transition shadow-md">
                  Execute Reroute
                </button>
              </div>
            </div>

            <!-- ROUTE C -->
            <div class="p-3 rounded-xl border border-command-border bg-command-850 space-y-1">
              <div class="flex items-center justify-between">
                <div>
                  <span class="text-xs font-bold text-slate-200 font-mono">ROUTE C — Emergency Northern Ridge</span>
                  <div class="text-[11px] text-slate-400 font-mono mt-0.5">Via Tezpur-Golaghat · 380 km (+65 km) · ETA 9h 10m</div>
                </div>
                <div class="text-right font-mono">
                  <div class="text-xs font-bold text-purple-400">${routesEvaluation.routeC.riskPct}% Risk</div>
                  <span class="text-[10px] px-1.5 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-600 font-semibold">${routesEvaluation.routeC.status}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- SECTION 4: Digital Push-to-Talk Console -->
        <div class="p-5 space-y-3.5">
          <div class="flex items-center justify-between">
            <h3 class="text-xs font-mono font-bold text-white uppercase tracking-widest">Digital Dispatch Console</h3>
            <span class="text-[10px] font-mono text-emerald-400">4G/SAT LINK ACTIVE</span>
          </div>

          <div class="p-3.5 rounded-xl bg-command-850 border border-command-border space-y-2">
            <button id="btn-cr-ptt-talk" class="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 text-white font-mono font-bold text-xs flex items-center justify-center gap-2 shadow-md transition select-none">
              HOLD TO TRANSMIT DISPATCH VOICE
            </button>
            <p class="text-[11px] text-slate-400 font-mono text-center">
              Transmits real-time audio advisory directly to connected driver cabs.
            </p>
          </div>
        </div>

        <!-- SECTION 5: Active Fleet Tracking -->
        <div class="p-5 space-y-3">
          <div class="flex items-center justify-between">
            <h3 class="text-xs font-mono font-bold text-slate-300 uppercase tracking-widest">
              Fleet Tracking (${vehicles.length})
            </h3>
            <span class="text-[11px] text-slate-500 font-mono">Select Unit</span>
          </div>

          <div class="space-y-2">
            ${vehicles.map(v => {
              const isCrit = v.riskLevel === 'CRITICAL';
              const isReroute = v.status === 'REROUTED';
              const statusBadge = isCrit ? 'text-rose-400 border-rose-500/50 bg-rose-950/40' : isReroute ? 'text-emerald-400 border-emerald-500/50 bg-emerald-950/40' : 'text-cyan-300 border-cyan-500/50 bg-cyan-950/40';

              return `
                <div class="btn-vehicle-card p-3 rounded-lg bg-command-850 hover:bg-command-800 border border-command-border cursor-pointer transition flex items-center justify-between" data-vid="${v.id}">
                  <div class="space-y-1">
                    <div class="flex items-center gap-2">
                      <span class="font-mono font-bold text-white text-xs">${v.id}</span>
                      <span class="text-[10px] font-mono px-1.5 py-0.2 rounded border ${statusBadge}">${v.status}</span>
                      <span class="text-[10px] font-mono px-1.5 py-0.2 rounded font-bold ${v.priority === 'CRITICAL' ? 'bg-rose-950 text-rose-300 border border-rose-600' : 'bg-slate-800 text-cyan-300'}">${v.priority}</span>
                    </div>
                    <div class="text-xs text-slate-300">${v.cargo}</div>
                    <div class="text-[11px] text-slate-400 font-mono">${v.currentLocationName}</div>
                  </div>
                  <div class="text-right font-mono">
                    <div class="text-xs font-bold text-cyan-400">${v.speed} km/h</div>
                    <div class="text-[11px] text-emerald-400">ETA ${v.eta}</div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

      </aside>

    </main>
  `;

  // Render Top Navbar
  const navContainer = appContainer.querySelector('#nav-container');
  if (navContainer) renderNavbar(navContainer, 'dashboard');

  // Initialize GIS Map
  setTimeout(() => {
    const gisMap = new GisMap('gis-map-container', {
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

    // Bind Action Buttons
    appContainer.querySelector('#btn-banner-open-env')?.addEventListener('click', () => openEnvironmentControlModal());
    appContainer.querySelector('#btn-banner-open-xai')?.addEventListener('click', () => openExplainableAIModal());
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
