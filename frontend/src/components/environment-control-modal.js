/**
 * Master "ENVIRONMENT & SCENARIO CONTROL" Modal Component
 * Live interactive telemetry manipulation directly coupled to AI Risk Engine & Logistics Dispatch
 */

import { store, SCENARIO_PRESETS } from '../state/store.js';
import { sounds } from '../audio/sound-effects.js';

export function openEnvironmentControlModal() {
  const container = document.getElementById('modal-container');
  if (!container) return;

  const renderContent = () => {
    const { environment, activeScenarioPreset, environmentLastUpdated, aiIntelligence, routesEvaluation } = store.state;

    // Helper for status badge
    const getRainStatus = (val) => val > 40 ? { label: 'SEVERE', color: 'text-rose-400 border-rose-500/60 bg-rose-950/40' } : val > 20 ? { label: 'ELEVATED', color: 'text-amber-400 border-amber-500/60 bg-amber-950/40' } : { label: 'NORMAL', color: 'text-emerald-400 border-emerald-500/60 bg-emerald-950/40' };
    const getHumidityStatus = (val) => val > 90 ? { label: 'CRITICAL HIGH', color: 'text-rose-400 border-rose-500/60 bg-rose-950/40' } : val > 75 ? { label: 'HIGH', color: 'text-amber-400 border-amber-500/60 bg-amber-950/40' } : { label: 'OPTIMAL', color: 'text-emerald-400 border-emerald-500/60 bg-emerald-950/40' };
    const getRiverStatus = (val) => val > 1.8 ? { label: 'CRITICAL SURGE', color: 'text-rose-400 border-rose-500/60 bg-rose-950/40' } : val > 0.8 ? { label: 'ABOVE BASE', color: 'text-amber-400 border-amber-500/60 bg-amber-950/40' } : { label: 'NORMAL POOL', color: 'text-emerald-400 border-emerald-500/60 bg-emerald-950/40' };
    const getLandslideStatus = (val) => val > 70 ? { label: 'HIGH RISK', color: 'text-rose-400 border-rose-500/60 bg-rose-950/40' } : val > 35 ? { label: 'MONITORED', color: 'text-amber-400 border-amber-500/60 bg-amber-950/40' } : { label: 'LOW RISK', color: 'text-emerald-400 border-emerald-500/60 bg-emerald-950/40' };
    const getVisibilityStatus = (val) => val < 2.0 ? { label: 'DANGEROUS FOG', color: 'text-rose-400 border-rose-500/60 bg-rose-950/40' } : val < 5.0 ? { label: 'REDUCED', color: 'text-amber-400 border-amber-500/60 bg-amber-950/40' } : { label: 'CLEAR', color: 'text-emerald-400 border-emerald-500/60 bg-emerald-950/40' };
    const getWindStatus = (val) => val > 45 ? { label: 'GALE SQUALL', color: 'text-rose-400 border-rose-500/60 bg-rose-950/40' } : val > 25 ? { label: 'BREEZY', color: 'text-amber-400 border-amber-500/60 bg-amber-950/40' } : { label: 'CALM', color: 'text-emerald-400 border-emerald-500/60 bg-emerald-950/40' };

    container.innerHTML = `
      <div class="fixed inset-0 z-[9999] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fadeIn">
        <div class="hud-panel rounded-2xl border border-command-border bg-command-950 shadow-2xl w-full max-w-5xl max-h-[92vh] flex flex-col divide-y divide-command-border">
          
          <!-- Header -->
          <div class="p-5 sm:p-6 flex items-center justify-between bg-command-900 shrink-0">
            <div>
              <div class="flex items-center gap-3">
                <h2 class="text-base font-display font-bold text-white uppercase tracking-wider">
                  Environment & Scenario Simulator
                </h2>
                <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-semibold">
                  ACTIVE AI SYNC
                </span>
              </div>
              <p class="text-xs text-slate-400 font-mono mt-1">
                Dynamic environmental variables coupled directly to predictive AI cutoff metrics and multi-route evaluation.
              </p>
            </div>

            <div class="flex items-center gap-4">
              <div class="text-right hidden sm:block font-mono text-xs">
                <div class="text-slate-400 text-[10px]">TELEMETRY SYNC</div>
                <div class="text-cyan-400 font-bold mt-0.5">${environmentLastUpdated}</div>
              </div>
              <button id="btn-close-env-modal" class="px-3 py-1.5 rounded-lg bg-command-800 hover:bg-command-700 text-slate-300 text-xs font-mono font-medium transition border border-command-border">
                Close
              </button>
            </div>
          </div>

          <!-- Scenario Presets Bar -->
          <div class="p-5 bg-command-900/60 shrink-0 space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-xs font-mono font-bold text-slate-300 uppercase tracking-widest">
                Quick Scenario Presets (Stress Testing)
              </span>
              <span class="text-[11px] font-mono text-slate-400">
                Current: <strong class="text-cyan-400 uppercase">${activeScenarioPreset.replace('_', ' ')}</strong>
              </span>
            </div>

            <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
              ${Object.keys(SCENARIO_PRESETS).map(key => {
                const p = SCENARIO_PRESETS[key];
                const isActive = activeScenarioPreset === key;
                return `
                  <button data-scenario="${key}" class="px-2.5 py-2 rounded-xl text-[10px] font-mono font-bold transition flex flex-col items-center justify-center text-center border ${isActive ? 'bg-cyan-600 text-white border-cyan-400 shadow-md shadow-cyan-950' : 'bg-command-850 text-slate-300 hover:bg-command-800 hover:text-white border-command-border'}">
                    <span>${p.name}</span>
                  </button>
                `;
              }).join('')}
            </div>
          </div>

          <!-- Body: Two-Column Environment Variable Sliders -->
          <div class="p-5 sm:p-6 overflow-y-auto flex-1 space-y-5">
            
            <!-- Live AI Impact Preview Header Bar -->
            <div class="p-4 rounded-xl bg-command-900 border border-command-border flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
              <div class="flex items-center gap-3">
                <span class="w-2.5 h-2.5 rounded-full ${aiIntelligence.riskLevel === 'HIGH_RISK' ? 'bg-rose-500 animate-ping' : aiIntelligence.riskLevel === 'MEDIUM' ? 'bg-amber-500' : 'bg-emerald-500'}"></span>
                <span class="font-mono text-slate-300">AI Calculated Accessibility Risk:</span>
                <strong class="text-base font-bold ${aiIntelligence.riskLevel === 'HIGH_RISK' ? 'text-rose-400' : aiIntelligence.riskLevel === 'MEDIUM' ? 'text-amber-400' : 'text-emerald-400'} font-mono">
                  ${aiIntelligence.accessibilityRiskPct}% (${aiIntelligence.statusLabel})
                </strong>
              </div>

              <div class="flex items-center gap-2 font-mono text-xs">
                <span class="text-slate-400">Recommended Corridor:</span>
                <span class="px-2.5 py-1 rounded-md font-bold ${routesEvaluation.recommendedRouteId === 'ROUTE_B' ? 'bg-emerald-950 text-emerald-300 border border-emerald-700' : 'bg-cyan-950 text-cyan-300 border border-cyan-700'}">
                  ${routesEvaluation.recommendedRouteId === 'ROUTE_B' ? 'Route B (Umrangso Bypass)' : 'Route A (NH-6 Primary)'}
                </span>
              </div>
            </div>

            <!-- 14 Interactive Variable Sliders Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <!-- 1. Rainfall -->
              <div class="p-4 rounded-xl bg-command-850 border border-command-border space-y-2.5">
                <div class="flex items-center justify-between">
                  <div>
                    <span class="text-xs font-mono font-bold text-white uppercase">1. Rainfall Rate</span>
                    <span class="text-[10px] text-slate-400 font-mono block mt-0.5">Normal range: 0.0 – 15.0 mm/hr</span>
                  </div>
                  <div class="text-right">
                    <span class="text-sm font-mono font-bold text-cyan-400">${environment.rainfall} mm/hr</span>
                    <span class="text-[10px] font-mono px-1.5 py-0.2 rounded border block mt-0.5 ${getRainStatus(environment.rainfall).color}">
                      ${getRainStatus(environment.rainfall).label}
                    </span>
                  </div>
                </div>
                <input type="range" min="0" max="80" step="0.5" value="${environment.rainfall}" data-env-key="rainfall" class="tactical-slider w-full cursor-pointer">
              </div>

              <!-- 2. Landslide Probability -->
              <div class="p-4 rounded-xl bg-command-850 border border-command-border space-y-2.5">
                <div class="flex items-center justify-between">
                  <div>
                    <span class="text-xs font-mono font-bold text-white uppercase">2. Landslide Probability</span>
                    <span class="text-[10px] text-slate-400 font-mono block mt-0.5">Sonapur Ridge Slope Saturation</span>
                  </div>
                  <div class="text-right">
                    <span class="text-sm font-mono font-bold text-rose-400">${environment.landslideProb}%</span>
                    <span class="text-[10px] font-mono px-1.5 py-0.2 rounded border block mt-0.5 ${getLandslideStatus(environment.landslideProb).color}">
                      ${getLandslideStatus(environment.landslideProb).label}
                    </span>
                  </div>
                </div>
                <input type="range" min="0" max="100" step="1" value="${environment.landslideProb}" data-env-key="landslideProb" class="tactical-slider w-full cursor-pointer">
              </div>

              <!-- 3. River Water Gauge Level -->
              <div class="p-4 rounded-xl bg-command-850 border border-command-border space-y-2.5">
                <div class="flex items-center justify-between">
                  <div>
                    <span class="text-xs font-mono font-bold text-white uppercase">3. River Gauge Level</span>
                    <span class="text-[10px] text-slate-400 font-mono block mt-0.5">Umiam & Lubha River Basin</span>
                  </div>
                  <div class="text-right">
                    <span class="text-sm font-mono font-bold text-sky-400">+${environment.riverWaterLevel} m</span>
                    <span class="text-[10px] font-mono px-1.5 py-0.2 rounded border block mt-0.5 ${getRiverStatus(environment.riverWaterLevel).color}">
                      ${getRiverStatus(environment.riverWaterLevel).label}
                    </span>
                  </div>
                </div>
                <input type="range" min="0" max="4.0" step="0.05" value="${environment.riverWaterLevel}" data-env-key="riverWaterLevel" class="tactical-slider w-full cursor-pointer">
              </div>

              <!-- 4. Road Surface Condition -->
              <div class="p-4 rounded-xl bg-command-850 border border-command-border space-y-2.5">
                <div class="flex items-center justify-between">
                  <div>
                    <span class="text-xs font-mono font-bold text-white uppercase">4. Road Surface Condition</span>
                    <span class="text-[10px] text-slate-400 font-mono block mt-0.5">Friction & debris ingress metric</span>
                  </div>
                  <span class="text-xs font-mono font-bold px-2 py-0.5 rounded bg-command-800 text-amber-300 border border-command-border">
                    ${environment.roadSurfaceCondition}
                  </span>
                </div>
                <select data-env-key="roadSurfaceCondition" class="w-full bg-command-800 border border-command-border rounded-lg px-3 py-1.5 text-xs font-mono text-white focus:outline-none focus:border-cyan-500">
                  <option value="DRY" ${environment.roadSurfaceCondition === 'DRY' ? 'selected' : ''}>DRY (Optimal Friction)</option>
                  <option value="WET" ${environment.roadSurfaceCondition === 'WET' ? 'selected' : ''}>WET (Reduced Braking)</option>
                  <option value="DEGRADED" ${environment.roadSurfaceCondition === 'DEGRADED' ? 'selected' : ''}>DEGRADED (Potholes & Slush)</option>
                  <option value="MUD_DEBRIS" ${environment.roadSurfaceCondition === 'MUD_DEBRIS' ? 'selected' : ''}>MUD & DEBRIS (High Obstruction)</option>
                  <option value="IMPASSABLE" ${environment.roadSurfaceCondition === 'IMPASSABLE' ? 'selected' : ''}>IMPASSABLE (Total Cutoff)</option>
                </select>
              </div>

              <!-- 5. Traffic Density -->
              <div class="p-4 rounded-xl bg-command-850 border border-command-border space-y-2.5">
                <div class="flex items-center justify-between">
                  <div>
                    <span class="text-xs font-mono font-bold text-white uppercase">5. Traffic Density</span>
                    <span class="text-[10px] text-slate-400 font-mono block mt-0.5">Corridor congestion & bottleneck factor</span>
                  </div>
                  <span class="text-xs font-mono font-bold px-2 py-0.5 rounded bg-command-800 text-cyan-300 border border-command-border">
                    ${environment.trafficDensity}
                  </span>
                </div>
                <select data-env-key="trafficDensity" class="w-full bg-command-800 border border-command-border rounded-lg px-3 py-1.5 text-xs font-mono text-white focus:outline-none focus:border-cyan-500">
                  <option value="LOW" ${environment.trafficDensity === 'LOW' ? 'selected' : ''}>LOW (Free Flowing)</option>
                  <option value="MODERATE" ${environment.trafficDensity === 'MODERATE' ? 'selected' : ''}>MODERATE (Minor Queues)</option>
                  <option value="HEAVY" ${environment.trafficDensity === 'HEAVY' ? 'selected' : ''}>HEAVY (Slow Moving)</option>
                  <option value="CONGESTED" ${environment.trafficDensity === 'CONGESTED' ? 'selected' : ''}>CONGESTED (Severe Stalls)</option>
                  <option value="GRIDLOCK" ${environment.trafficDensity === 'GRIDLOCK' ? 'selected' : ''}>GRIDLOCK (Stationary Vehicles)</option>
                </select>
              </div>

              <!-- 6. Bridge Accessibility -->
              <div class="p-4 rounded-xl bg-command-850 border border-command-border space-y-2.5">
                <div class="flex items-center justify-between">
                  <div>
                    <span class="text-xs font-mono font-bold text-white uppercase">6. Bridge & Culvert Status</span>
                    <span class="text-[10px] text-slate-400 font-mono block mt-0.5">Structural integrity & passability</span>
                  </div>
                  <span class="text-xs font-mono font-bold px-2 py-0.5 rounded bg-command-800 text-purple-300 border border-command-border">
                    ${environment.bridgeAccessibility}
                  </span>
                </div>
                <select data-env-key="bridgeAccessibility" class="w-full bg-command-800 border border-command-border rounded-lg px-3 py-1.5 text-xs font-mono text-white focus:outline-none focus:border-cyan-500">
                  <option value="100% OPEN" ${environment.bridgeAccessibility === '100% OPEN' ? 'selected' : ''}>100% OPEN (Clear)</option>
                  <option value="WEIGHT_RESTRICTED" ${environment.bridgeAccessibility === 'WEIGHT_RESTRICTED' ? 'selected' : ''}>WEIGHT RESTRICTED (< 12T)</option>
                  <option value="SINGLE_LANE" ${environment.bridgeAccessibility === 'SINGLE_LANE' ? 'selected' : ''}>SINGLE LANE ONLY</option>
                  <option value="SUBMERGED" ${environment.bridgeAccessibility === 'SUBMERGED' ? 'selected' : ''}>SUBMERGED CAUSEWAY</option>
                  <option value="CLOSED" ${environment.bridgeAccessibility === 'CLOSED' ? 'selected' : ''}>CLOSED (Structural Risk)</option>
                </select>
              </div>

              <!-- 7. Flood Severity -->
              <div class="p-4 rounded-xl bg-command-850 border border-command-border space-y-2.5">
                <div class="flex items-center justify-between">
                  <div>
                    <span class="text-xs font-mono font-bold text-white uppercase">7. Flood Inundation</span>
                    <span class="text-[10px] text-slate-400 font-mono block mt-0.5">Lowland standing water depth</span>
                  </div>
                  <span class="text-xs font-mono font-bold px-2 py-0.5 rounded bg-command-800 text-sky-300 border border-command-border">
                    ${environment.floodSeverity}
                  </span>
                </div>
                <select data-env-key="floodSeverity" class="w-full bg-command-800 border border-command-border rounded-lg px-3 py-1.5 text-xs font-mono text-white focus:outline-none focus:border-cyan-500">
                  <option value="NONE" ${environment.floodSeverity === 'NONE' ? 'selected' : ''}>NONE (No Waterlogging)</option>
                  <option value="LOW" ${environment.floodSeverity === 'LOW' ? 'selected' : ''}>LOW (Marginal Shoulder Water)</option>
                  <option value="MODERATE" ${environment.floodSeverity === 'MODERATE' ? 'selected' : ''}>MODERATE (0.3m Causeway Overflow)</option>
                  <option value="SEVERE" ${environment.floodSeverity === 'SEVERE' ? 'selected' : ''}>SEVERE (0.8m Deep Flow)</option>
                  <option value="CATASTROPHIC" ${environment.floodSeverity === 'CATASTROPHIC' ? 'selected' : ''}>CATASTROPHIC (Breached Embankments)</option>
                </select>
              </div>

              <!-- 8. Network Connectivity -->
              <div class="p-4 rounded-xl bg-command-850 border border-command-border space-y-2.5">
                <div class="flex items-center justify-between">
                  <div>
                    <span class="text-xs font-mono font-bold text-white uppercase">8. Telemetry Link</span>
                    <span class="text-[10px] text-slate-400 font-mono block mt-0.5">4G/5G, mesh radio, satellite</span>
                  </div>
                  <span class="text-xs font-mono font-bold px-2 py-0.5 rounded bg-command-800 text-emerald-300 border border-command-border">
                    ${environment.networkConnectivity}
                  </span>
                </div>
                <select data-env-key="networkConnectivity" class="w-full bg-command-800 border border-command-border rounded-lg px-3 py-1.5 text-xs font-mono text-white focus:outline-none focus:border-cyan-500">
                  <option value="ONLINE_4G_5G" ${environment.networkConnectivity === 'ONLINE_4G_5G' ? 'selected' : ''}>ONLINE 4G/5G (Full Bandwidth)</option>
                  <option value="DEGRADED_MESH" ${environment.networkConnectivity === 'DEGRADED_MESH' ? 'selected' : ''}>DEGRADED MESH (Low Bandwidth)</option>
                  <option value="SAT_COM_FALLBACK" ${environment.networkConnectivity === 'SAT_COM_FALLBACK' ? 'selected' : ''}>SAT-COM FALLBACK ONLY</option>
                  <option value="OFFLINE_BLACKOUT" ${environment.networkConnectivity === 'OFFLINE_BLACKOUT' ? 'selected' : ''}>OFFLINE BLACKOUT (Local Cache)</option>
                </select>
              </div>

            </div>

          </div>

          <!-- Footer Actions -->
          <div class="p-5 bg-command-900 flex items-center justify-between shrink-0">
            <button id="btn-reset-env-nominal" class="px-4 py-2 rounded-xl bg-command-800 hover:bg-command-750 text-slate-300 text-xs font-mono font-bold border border-command-border transition">
              Reset to Nominal Baseline
            </button>
            <button id="btn-apply-env-close" class="px-6 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-mono font-bold transition shadow-lg shadow-cyan-950">
              Apply & Return to Map
            </button>
          </div>

        </div>
      </div>
    `;

    // Bind Presets
    container.querySelectorAll('[data-scenario]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const scenarioKey = e.currentTarget.getAttribute('data-scenario');
        sounds.playSuccess();
        store.applyScenarioPreset(scenarioKey);
        renderContent();
      });
    });

    // Bind Sliders
    container.querySelectorAll('input[type="range"][data-env-key]').forEach(input => {
      input.addEventListener('input', (e) => {
        const key = e.target.getAttribute('data-env-key');
        const val = parseFloat(e.target.value);
        store.setEnvironmentParam(key, val);
      });
      input.addEventListener('change', () => {
        sounds.playSuccess();
        renderContent();
      });
    });

    // Bind Selects
    container.querySelectorAll('select[data-env-key]').forEach(select => {
      select.addEventListener('change', (e) => {
        const key = e.target.getAttribute('data-env-key');
        const val = e.target.value;
        store.setEnvironmentParam(key, val);
        sounds.playSuccess();
        renderContent();
      });
    });

    // Reset button
    container.querySelector('#btn-reset-env-nominal')?.addEventListener('click', () => {
      store.applyScenarioPreset('NORMAL');
      sounds.playSuccess();
      renderContent();
    });

    // Close buttons
    container.querySelector('#btn-close-env-modal')?.addEventListener('click', () => {
      container.innerHTML = '';
    });
    container.querySelector('#btn-apply-env-close')?.addEventListener('click', () => {
      container.innerHTML = '';
    });
  };

  renderContent();
}
