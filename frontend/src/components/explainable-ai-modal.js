/**
 * Explainable AI "WHY DID THIS CHANGE?" & Predictive Forecasting Modal Component
 * Explains geological factor contributions, weights, and time-series risk forecasting
 */

import { store } from '../state/store.js';
import { sounds } from '../audio/sound-effects.js';

export function openExplainableAIModal() {
  const container = document.getElementById('modal-container');
  if (!container) return;

  const { aiIntelligence, environment, routesEvaluation } = store.state;

  const xaiList = aiIntelligence.xaiContributions || [
    { name: 'Slope Instability & Soil Saturation', pct: 38, icon: '⛰️' },
    { name: 'Rainfall Intensity & Runoff', pct: 26, icon: '🌧️' },
    { name: 'Pavement & Mud Debris State', pct: 16, icon: '🚧' },
    { name: 'River Basin Swelling', pct: 10, icon: '🌊' },
    { name: 'Bridge Restriction', pct: 6, icon: '🌉' },
    { name: 'Traffic Bottlenecks', pct: 4, icon: '🚚' }
  ];

  const forecasts = aiIntelligence.timeSeriesForecast || [
    { timeOffset: '+0h (Current)', riskPct: aiIntelligence.accessibilityRiskPct || 28, status: 'LOW' },
    { timeOffset: '+1h Forecast', riskPct: 32, status: 'LOW' },
    { timeOffset: '+2h Forecast', riskPct: 44, status: 'MEDIUM' },
    { timeOffset: '+4h Forecast', riskPct: 58, status: 'MEDIUM' },
    { timeOffset: '+6h Forecast', riskPct: 72, status: 'HIGH_RISK' }
  ];

  container.innerHTML = `
    <div class="fixed inset-0 z-[9999] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fadeIn">
      <div class="hud-panel rounded-2xl border border-command-border bg-command-950 shadow-2xl w-full max-w-4xl flex flex-col divide-y divide-command-border max-h-[90vh]">
        
        <!-- Header -->
        <div class="p-5 sm:p-6 flex items-center justify-between bg-command-900 shrink-0">
          <div>
            <div class="flex items-center gap-3">
              <h2 class="text-base font-display font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <span>🧠 Explainable AI & Predictive Landslide Engine</span>
              </h2>
              <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-700 font-semibold">
                XAI TRANSPARENCY v3.2
              </span>
            </div>
            <p class="text-xs text-slate-400 font-mono mt-1">
              Geotechnical Slope Stability · Multi-Factor Regression · Time-Series Predictive Horizon
            </p>
          </div>

          <button id="btn-close-xai-modal" class="px-3 py-1.5 rounded-lg bg-command-800 hover:bg-command-700 text-slate-300 text-xs font-mono font-medium transition border border-command-border">
            ✕ Close
          </button>
        </div>

        <!-- Body -->
        <div class="p-5 sm:p-6 overflow-y-auto space-y-6">
          
          <!-- Key Metric Banner -->
          <div class="p-5 rounded-xl bg-gradient-to-r from-purple-950/40 via-command-900 to-cyan-950/40 border border-purple-500/40 space-y-4">
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span class="text-[10px] font-mono text-slate-400 uppercase tracking-wider">AI Regressor Model</span>
                <div class="text-sm font-bold text-cyan-300 font-mono mt-0.5">
                  ${aiIntelligence.modelType || 'Hybrid Random Forest & Geological Slope Stability Regressor'}
                </div>
                <div class="text-xs text-slate-300 font-mono mt-1">
                  Confidence Score: <strong class="text-emerald-400 font-bold">${aiIntelligence.evaluationConfidence || 97.2}%</strong>
                </div>
              </div>

              <div class="text-left sm:text-right">
                <span class="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Current Corridor Risk</span>
                <div class="text-3xl font-mono font-extrabold ${aiIntelligence.accessibilityRiskPct >= 70 ? 'text-rose-400' : aiIntelligence.accessibilityRiskPct >= 40 ? 'text-amber-400' : 'text-emerald-400'} mt-0.5">
                  ${aiIntelligence.accessibilityRiskPct}%
                </div>
                <span class="text-[10px] font-mono px-2 py-0.5 rounded ${aiIntelligence.accessibilityRiskPct >= 70 ? 'bg-rose-950 text-rose-300 border border-rose-800' : 'bg-emerald-950 text-emerald-300 border border-emerald-800'} font-bold">
                  ${aiIntelligence.statusLabel || 'NOMINAL TRANSIT'}
                </span>
              </div>
            </div>
          </div>

          <!-- SECTION 1: TIME-SERIES PREDICTIVE LANDSLIDE FORECAST HORIZON (+1h to +6h) -->
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <h3 class="text-xs font-mono font-bold text-slate-200 uppercase tracking-widest flex items-center gap-2">
                <span>⏱️ Predictive Time-Series Landslide Forecast Horizon</span>
              </h3>
              <span class="text-[10px] font-mono text-cyan-400">Next 6 Hours Outlook</span>
            </div>

            <div class="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              ${forecasts.map(fc => {
                const isCrit = fc.riskPct >= 70;
                const isMed = fc.riskPct >= 40 && fc.riskPct < 70;
                const badgeColor = isCrit ? 'border-rose-500 bg-rose-950/30 text-rose-300' : isMed ? 'border-amber-500 bg-amber-950/30 text-amber-300' : 'border-emerald-500 bg-emerald-950/30 text-emerald-300';
                return `
                  <div class="p-3 rounded-xl border ${badgeColor} space-y-1.5 text-center">
                    <div class="text-[10px] font-mono font-bold uppercase text-slate-300">${fc.timeOffset}</div>
                    <div class="text-xl font-mono font-extrabold ${isCrit ? 'text-rose-400' : isMed ? 'text-amber-400' : 'text-emerald-400'}">
                      ${fc.riskPct}%
                    </div>
                    <div class="w-full bg-black/40 rounded-full h-1.5 overflow-hidden border border-white/10">
                      <div class="${isCrit ? 'bg-rose-500' : isMed ? 'bg-amber-500' : 'bg-emerald-500'} h-1.5" style="width: ${fc.riskPct}%"></div>
                    </div>
                    <div class="text-[9px] font-mono uppercase font-bold text-slate-400">${fc.status.replace('_', ' ')}</div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>

          <!-- SECTION 2: EXPLAINABLE AI (XAI) FACTOR CONTRIBUTIONS -->
          <div class="space-y-3">
            <h3 class="text-xs font-mono font-bold text-slate-200 uppercase tracking-widest flex items-center gap-2">
              <span>📊 Multi-Factor Geological & Meteorological Contributions (XAI)</span>
            </h3>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              ${xaiList.map(item => `
                <div class="p-3.5 rounded-xl bg-command-850 border border-command-border space-y-2">
                  <div class="flex items-center justify-between text-xs">
                    <div class="flex items-center gap-2">
                      <span class="text-sm">${item.icon}</span>
                      <strong class="text-slate-200">${item.name}</strong>
                    </div>
                    <span class="font-mono font-bold text-cyan-400">${item.pct}% Weight</span>
                  </div>
                  <div class="w-full bg-command-950 rounded-full h-2 overflow-hidden border border-command-border">
                    <div class="bg-gradient-to-r from-cyan-500 to-purple-500 h-2 rounded-full transition-all duration-500" style="width: ${item.pct}%"></div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- SECTION 3: MULTI-ROUTE MATRIX EVALUATION -->
          <div class="space-y-3">
            <h3 class="text-xs font-mono font-bold text-slate-200 uppercase tracking-widest">
              Evaluated Transit Corridors Matrix
            </h3>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <!-- Route A -->
              <div class="p-3.5 rounded-xl bg-command-850 border ${routesEvaluation.routeA?.riskPct >= 65 ? 'border-rose-500/60 bg-rose-950/15' : 'border-command-border'} space-y-1.5">
                <div class="text-[10px] font-mono text-slate-400 uppercase">Primary Corridor</div>
                <div class="text-xs font-bold text-white">${routesEvaluation.routeA?.name || 'NH-6 Arterial'}</div>
                <div class="text-xl font-mono font-extrabold ${routesEvaluation.routeA?.riskPct >= 70 ? 'text-rose-400' : 'text-emerald-400'}">
                  ${routesEvaluation.routeA?.riskPct || 28}% Risk
                </div>
                <div class="text-[11px] text-slate-400 font-mono">Distance: 212 km · ETA: ${routesEvaluation.routeA?.etaHours || '4.5h'}</div>
                <span class="text-[10px] font-mono px-2 py-0.5 rounded border block text-center mt-1.5 ${routesEvaluation.routeA?.riskPct >= 70 ? 'bg-rose-950/60 text-rose-300 border-rose-600' : 'bg-emerald-950/60 text-emerald-300 border-emerald-600'} font-bold">
                  ${routesEvaluation.routeA?.passable ? 'PASSABLE' : 'CRITICAL CUTOFF'}
                </span>
              </div>

              <!-- Route B -->
              <div class="p-3.5 rounded-xl bg-command-850 border border-emerald-500/60 bg-emerald-950/20 space-y-1.5">
                <div class="text-[10px] font-mono text-emerald-400 uppercase">AI Resilient Corridor</div>
                <div class="text-xs font-bold text-white">${routesEvaluation.routeB?.name || 'SH-17 via Umrangso'}</div>
                <div class="text-xl font-mono font-extrabold text-emerald-400">
                  ${routesEvaluation.routeB?.riskPct || 18}% Risk
                </div>
                <div class="text-[11px] text-slate-400 font-mono">Distance: 257 km · ETA: ${routesEvaluation.routeB?.etaHours || '5.2h'}</div>
                <span class="text-[10px] font-mono px-2 py-0.5 rounded border block text-center mt-1.5 bg-emerald-950/80 text-emerald-300 border-emerald-500 font-bold">
                  RECOMMENDED RESILIENT BYPASS
                </span>
              </div>

              <!-- Route C -->
              <div class="p-3.5 rounded-xl bg-command-850 border border-purple-500/40 space-y-1.5">
                <div class="text-[10px] font-mono text-purple-400 uppercase">Off-Grid Contingency</div>
                <div class="text-xs font-bold text-white">${routesEvaluation.routeC?.name || 'Tactical 4x4 Trail'}</div>
                <div class="text-xl font-mono font-extrabold text-purple-400">
                  ${routesEvaluation.routeC?.riskPct || 24}% Risk
                </div>
                <div class="text-[11px] text-slate-400 font-mono">Distance: 289 km · ETA: ${routesEvaluation.routeC?.etaHours || '6.8h'}</div>
                <span class="text-[10px] font-mono px-2 py-0.5 rounded border block text-center mt-1.5 bg-purple-950/60 text-purple-300 border-purple-600 font-semibold">
                  HEAVY 4x4 CONVOYS ONLY
                </span>
              </div>
            </div>
          </div>

        </div>

        <!-- Footer -->
        <div class="p-5 bg-command-900 flex items-center justify-end shrink-0">
          <button id="btn-close-xai-footer" class="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-mono font-bold transition shadow-lg shadow-purple-950">
            Acknowledge Intelligence Briefing
          </button>
        </div>

      </div>
    </div>
  `;

  // Bind close events
  container.querySelector('#btn-close-xai-modal')?.addEventListener('click', () => {
    container.innerHTML = '';
  });
  container.querySelector('#btn-close-xai-footer')?.addEventListener('click', () => {
    container.innerHTML = '';
  });
}
