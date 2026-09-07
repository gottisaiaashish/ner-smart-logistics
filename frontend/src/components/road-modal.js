/**
 * Road Corridor Accessibility & Risk Inspector Modal
 */

import { CORRIDORS } from '../data/geo-data.js';
import { store } from '../state/store.js';

export function openRoadModal(corridorId) {
  const container = document.getElementById('modal-container');
  if (!container) return;

  const { aiIntelligence, simulation } = store.state;
  let corridor = null;

  if (corridorId === 'corridor-nh6' || corridorId === 'corridor-route-a') corridor = CORRIDORS.ROUTE_A;
  else if (corridorId === 'corridor-nh27-alt' || corridorId === 'corridor-route-b') corridor = CORRIDORS.ROUTE_B;
  else if (corridorId === 'corridor-route-c') corridor = CORRIDORS.ROUTE_C;
  else if (corridorId === 'corridor-nh102') corridor = CORRIDORS.NH102_MANIPUR;
  else if (corridorId === 'corridor-nh13-sela') corridor = CORRIDORS.NH13_SELA;
  else corridor = CORRIDORS.ROUTE_A;

  const isNH6 = corridorId === 'corridor-nh6' || corridorId === 'corridor-route-a';
  const riskPct = isNH6 
    ? (simulation.sonapurBlocked || aiIntelligence.riskLevel === 'HIGH_RISK' ? 86 : 42)
    : corridor.defaultRiskPct;

  const riskStatus = riskPct >= 80 ? 'BLOCKED' : riskPct >= 60 ? 'HIGH' : riskPct >= 35 ? 'MEDIUM' : 'LOW';

  const statusBadgeColor = {
    'LOW': 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    'MEDIUM': 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    'HIGH': 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    'BLOCKED': 'bg-rose-600/30 text-rose-200 border-rose-500 font-extrabold animate-pulse'
  }[riskStatus];

  container.innerHTML = `
    <div class="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div class="hud-panel rounded-2xl max-w-2xl w-full border border-command-border bg-command-950 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 divide-y divide-command-border">
        
        <!-- Header -->
        <div class="bg-command-900 p-5 sm:p-6 flex items-center justify-between">
          <div>
            <div class="flex items-center gap-3">
              <h3 class="text-base font-display font-bold text-white tracking-wide">${corridor.name}</h3>
              <span class="px-2.5 py-0.5 rounded border font-mono text-xs ${statusBadgeColor}">${riskStatus} RISK</span>
            </div>
            <p class="text-xs text-slate-400 font-mono mt-1">Corridor Distance: ${corridor.distance} · Normal Drive: ${corridor.normalDuration}</p>
          </div>
          <button id="btn-close-road-modal" class="px-3 py-1.5 rounded-lg bg-command-800 hover:bg-command-700 text-slate-300 text-xs font-mono font-medium transition border border-command-border">
            Close
          </button>
        </div>

        <!-- Body -->
        <div class="p-5 sm:p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          
          <!-- Risk Gauge & Probability Matrix -->
          <div class="bg-command-850 p-4 rounded-xl border border-command-border grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
            <div class="text-center sm:text-left sm:border-r border-command-border sm:pr-4">
              <span class="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Accessibility Index</span>
              <div class="text-3xl font-mono font-extrabold ${riskPct > 70 ? 'text-rose-400' : riskPct > 40 ? 'text-amber-400' : 'text-emerald-400'} mt-1">
                ${riskPct}%
              </div>
              <p class="text-[11px] text-slate-400 mt-1">AI calculated composite score</p>
            </div>

            <div class="sm:col-span-2 space-y-2">
              <div class="flex items-center justify-between text-xs">
                <span class="text-slate-300">Landslide / Shear Probability</span>
                <span class="font-mono font-bold ${isNH6 ? 'text-rose-400' : 'text-slate-300'}">${isNH6 ? '89%' : '12%'}</span>
              </div>
              <div class="w-full bg-slate-800 rounded-full h-1.5">
                <div class="${isNH6 ? 'bg-rose-500' : 'bg-emerald-500'} h-1.5 rounded-full" style="width: ${isNH6 ? '89%' : '12%'}"></div>
              </div>

              <div class="flex items-center justify-between text-xs">
                <span class="text-slate-300">Monsoon Water Inundation</span>
                <span class="font-mono font-bold ${isNH6 ? 'text-amber-400' : 'text-slate-300'}">${isNH6 ? '68%' : '20%'}</span>
              </div>
              <div class="w-full bg-slate-800 rounded-full h-1.5">
                <div class="bg-amber-500 h-1.5 rounded-full" style="width: ${isNH6 ? '68%' : '20%'}"></div>
              </div>
            </div>
          </div>

          <!-- Realtime Environmental Metrics -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div class="bg-command-850 p-3 rounded-xl border border-command-border">
              <span class="text-slate-400 font-mono text-[10px] uppercase">Weather Impact</span>
              <div class="font-bold text-white mt-1">${isNH6 ? 'Torrential Squall' : 'Overcast / Fog'}</div>
            </div>
            <div class="bg-command-850 p-3 rounded-xl border border-command-border">
              <span class="text-slate-400 font-mono text-[10px] uppercase">Flood Level</span>
              <div class="font-bold text-white mt-1">${isNH6 ? '+1.92m Runoff' : 'Nominal Level'}</div>
            </div>
            <div class="bg-command-850 p-3 rounded-xl border border-command-border">
              <span class="text-slate-400 font-mono text-[10px] uppercase">Traffic State</span>
              <div class="font-bold text-white mt-1">${isNH6 ? 'Halted at Pass' : 'Fluid Convoy'}</div>
            </div>
            <div class="bg-command-850 p-3 rounded-xl border border-command-border">
              <span class="text-slate-400 font-mono text-[10px] uppercase">Field Ingestion</span>
              <div class="font-bold text-white mt-1">Live (SDRF Sync)</div>
            </div>
          </div>

          <!-- AI Recommendation Panel -->
          <div class="bg-command-850 p-4 rounded-xl border ${isNH6 ? 'border-rose-500/50 bg-rose-950/20' : 'border-emerald-500/50 bg-emerald-950/20'} space-y-2">
            <div class="flex items-center justify-between">
              <h4 class="text-xs font-mono font-bold uppercase tracking-wider ${isNH6 ? 'text-rose-400' : 'text-emerald-400'}">
                AI Logistics Recommendation
              </h4>
            </div>
            <p class="text-xs text-slate-200 leading-relaxed font-sans">
              ${isNH6 
                ? 'CRITICAL ALERT: Divert all essential cold-chain logistics away from NH-6 Sonapur corridor. Recommend dispatching via Alternate Route B (NH-27 / Umrangso) to guarantee zero cold-chain degradation.'
                : 'Corridor structurally stable. Maintain scheduled convoy velocity with periodic weather checks.'}
            </p>
            ${isNH6 ? `
              <div class="flex items-center justify-between pt-2 border-t border-rose-900/60 text-xs font-mono">
                <span class="text-slate-300">Recommended Alternate: <strong class="text-emerald-400">Route B (+33 km, ETA nominal)</strong></span>
                <span class="text-emerald-400 font-bold">Confidence: 94.6%</span>
              </div>
            ` : ''}
          </div>

        </div>

        <!-- Footer -->
        <div class="bg-command-900 p-4 px-6 flex items-center justify-end">
          <button id="btn-close-road-footer" class="px-5 py-2 rounded-xl bg-command-800 hover:bg-command-700 text-slate-300 text-xs font-mono font-medium transition border border-command-border">
            Close Inspector
          </button>
        </div>

      </div>
    </div>
  `;

  const closeModal = () => { container.innerHTML = ''; };
  container.querySelector('#btn-close-road-modal')?.addEventListener('click', closeModal);
  container.querySelector('#btn-close-road-footer')?.addEventListener('click', closeModal);
}
