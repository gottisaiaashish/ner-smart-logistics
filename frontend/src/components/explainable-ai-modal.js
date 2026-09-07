/**
 * Explainable AI "WHY DID THIS CHANGE?" Modal Component
 * Explains exact mathematical factor contributions, weights, and sensor correlations
 */

import { store } from '../state/store.js';
import { sounds } from '../audio/sound-effects.js';

export function openExplainableAIModal() {
  const container = document.getElementById('modal-container');
  if (!container) return;

  const { aiIntelligence, environment, routesEvaluation, simulation } = store.state;

  container.innerHTML = `
    <div class="fixed inset-0 z-[9999] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fadeIn">
      <div class="hud-panel rounded-2xl border border-command-border bg-command-950 shadow-2xl w-full max-w-3xl flex flex-col divide-y divide-command-border">
        
        <!-- Header -->
        <div class="p-5 sm:p-6 flex items-center justify-between bg-command-900 shrink-0">
          <div>
            <div class="flex items-center gap-3">
              <h2 class="text-base font-display font-bold text-white uppercase tracking-wider">
                Explainable AI Risk Engine (XAI)
              </h2>
              <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800 font-semibold">
                MODEL TRANSPARENCY
              </span>
            </div>
            <p class="text-xs text-slate-400 font-mono mt-1">
              Factor attribution breakdown & multi-corridor accessibility scoring formula
            </p>
          </div>

          <button id="btn-close-xai-modal" class="px-3 py-1.5 rounded-lg bg-command-800 hover:bg-command-700 text-slate-300 text-xs font-mono font-medium transition border border-command-border">
            Close
          </button>
        </div>

        <!-- Body -->
        <div class="p-5 sm:p-6 overflow-y-auto space-y-5">
          
          <!-- Key Metric Banner -->
          <div class="p-5 rounded-xl bg-purple-950/20 border border-purple-500/40 space-y-3">
            <div class="flex items-center justify-between">
              <div>
                <span class="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Monitored Corridor</span>
                <div class="text-sm font-bold text-white font-mono mt-0.5">${aiIntelligence.corridorName}</div>
              </div>
              <div class="text-right">
                <span class="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Accessibility Risk</span>
                <div class="text-3xl font-mono font-extrabold ${aiIntelligence.accessibilityRiskPct >= 70 ? 'text-rose-400' : 'text-amber-400'} mt-0.5">
                  ${aiIntelligence.accessibilityRiskPct}%
                </div>
              </div>
            </div>
            <div class="text-xs text-purple-300 font-mono pt-3 border-t border-purple-500/30 flex items-center justify-between">
              <span>Confidence: <strong class="text-white">${aiIntelligence.confidenceScore}%</strong> (Ensemble Modeling)</span>
              <span>Degradation Window: <strong class="text-amber-400">${aiIntelligence.timeToCutoffMinutes} min</strong></span>
            </div>
          </div>

          <!-- Section: Why Did the Risk Change? -->
          <div class="space-y-3">
            <h3 class="text-xs font-mono font-bold text-slate-300 uppercase tracking-widest">
              Primary Contributing Risk Drivers & Weights
            </h3>
            
            <div class="space-y-2.5">
              ${aiIntelligence.factors.map(f => {
                const colorBar = f.severity === 'critical' ? 'bg-rose-500' : f.severity === 'high' ? 'bg-amber-500' : 'bg-cyan-500';
                return `
                  <div class="p-3.5 rounded-xl bg-command-850 border border-command-border space-y-2">
                    <div class="flex items-center justify-between text-xs">
                      <div class="flex items-center gap-2.5">
                        <span class="w-2 h-2 rounded-full ${colorBar}"></span>
                        <strong class="text-white">${f.name}</strong>
                      </div>
                      <div class="flex items-center gap-3 font-mono">
                        <span class="text-slate-400">${f.value}</span>
                        <span class="font-bold text-rose-400">${f.delta}</span>
                      </div>
                    </div>
                    <div class="w-full bg-command-900 rounded-full h-1.5 overflow-hidden border border-command-border">
                      <div class="${colorBar} h-1.5 rounded-full" style="width: ${f.weightPct}%"></div>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>

          <!-- Section: Multi-Route Comparison -->
          <div class="space-y-3">
            <h3 class="text-xs font-mono font-bold text-slate-300 uppercase tracking-widest">
              Evaluated Multi-Route Comparative Matrix
            </h3>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <!-- Route A -->
              <div class="p-3.5 rounded-xl bg-command-850 border border-command-border space-y-1.5">
                <div class="text-[10px] font-mono text-slate-400 uppercase">Route A (Primary)</div>
                <div class="text-xs font-bold text-white">NH-6 Arterial</div>
                <div class="text-xl font-mono font-extrabold ${routesEvaluation.routeA.riskPct >= 70 ? 'text-rose-400' : 'text-amber-400'}">
                  ${routesEvaluation.routeA.riskPct}% Risk
                </div>
                <div class="text-xs text-slate-400 font-mono">ETA ${routesEvaluation.routeA.eta}</div>
                <span class="text-[10px] font-mono px-2 py-0.5 rounded border block text-center mt-1.5 ${routesEvaluation.routeA.riskPct >= 70 ? 'bg-rose-950/40 text-rose-300 border-rose-600' : 'bg-amber-950/40 text-amber-300 border-amber-600'} font-semibold">
                  ${routesEvaluation.routeA.status}
                </span>
              </div>

              <!-- Route B -->
              <div class="p-3.5 rounded-xl bg-command-850 border border-emerald-500/50 bg-emerald-950/10 space-y-1.5">
                <div class="text-[10px] font-mono text-emerald-400 uppercase">Route B (AI Safe)</div>
                <div class="text-xs font-bold text-white">NH-27 / Umrangso</div>
                <div class="text-xl font-mono font-extrabold text-emerald-400">
                  ${routesEvaluation.routeB.riskPct}% Risk
                </div>
                <div class="text-xs text-slate-400 font-mono">ETA ${routesEvaluation.routeB.eta}</div>
                <span class="text-[10px] font-mono px-2 py-0.5 rounded border block text-center mt-1.5 bg-emerald-950/40 text-emerald-300 border-emerald-600 font-bold">
                  ${routesEvaluation.routeB.status}
                </span>
              </div>

              <!-- Route C -->
              <div class="p-3.5 rounded-xl bg-command-850 border border-command-border space-y-1.5">
                <div class="text-[10px] font-mono text-purple-400 uppercase">Route C (Contingency)</div>
                <div class="text-xs font-bold text-white">Northern Ridge</div>
                <div class="text-xl font-mono font-extrabold text-purple-400">
                  ${routesEvaluation.routeC.riskPct}% Risk
                </div>
                <div class="text-xs text-slate-400 font-mono">ETA ${routesEvaluation.routeC.eta}</div>
                <span class="text-[10px] font-mono px-2 py-0.5 rounded border block text-center mt-1.5 bg-purple-950/40 text-purple-300 border-purple-600 font-semibold">
                  ${routesEvaluation.routeC.status}
                </span>
              </div>
            </div>
          </div>

          <!-- Section: AI Explainability Summary -->
          <div class="p-4 rounded-xl bg-command-850 border border-command-border space-y-1.5 text-xs text-slate-300">
            <span class="text-[10px] font-mono text-cyan-400 uppercase font-bold tracking-wider">Algorithmic Rationale:</span>
            <p class="leading-relaxed font-sans">
              ${aiIntelligence.predictionText}
            </p>
          </div>

        </div>

        <!-- Footer -->
        <div class="p-5 bg-command-900 flex items-center justify-end shrink-0">
          <button id="btn-close-xai-footer" class="px-6 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-mono font-bold transition shadow-lg shadow-purple-950">
            Acknowledge Rationale
          </button>
        </div>

      </div>
    </div>
  `;

  // Bind close
  container.querySelector('#btn-close-xai-modal')?.addEventListener('click', () => {
    container.innerHTML = '';
  });
  container.querySelector('#btn-close-xai-footer')?.addEventListener('click', () => {
    container.innerHTML = '';
  });
}
