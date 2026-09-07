/**
 * Alert Center & Emergency Notification Management Modal
 */

import { store } from '../state/store.js';
import { sounds } from '../audio/sound-effects.js';

export function openAlertModal() {
  const container = document.getElementById('modal-container');
  if (!container) return;

  let activeFilter = 'ALL';

  const renderAlerts = () => {
    const { alerts } = store.state;
    const filtered = activeFilter === 'ALL' ? alerts : alerts.filter(a => a.severity === activeFilter || a.category === activeFilter);

    container.innerHTML = `
      <div class="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
        <div class="hud-panel rounded-2xl max-w-4xl w-full border border-command-border bg-command-950 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 divide-y divide-command-border">
          
          <!-- Header -->
          <div class="bg-command-900 p-5 sm:p-6 flex items-center justify-between">
            <div>
              <div class="flex items-center gap-3">
                <h3 class="text-base font-display font-bold text-white uppercase tracking-wider">
                  Emergency Logistics Alert & Incident Center
                </h3>
                <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800 font-semibold">
                  LIVE INCIDENTS
                </span>
              </div>
              <p class="text-xs text-slate-400 font-mono mt-1">
                Real-time hazard warnings, corridor blockages, and automated mitigation feeds
              </p>
            </div>
            <button id="btn-close-alert-modal" class="px-3 py-1.5 rounded-lg bg-command-800 hover:bg-command-700 text-slate-300 text-xs font-mono font-medium transition border border-command-border">
              Close
            </button>
          </div>

          <!-- Body -->
          <div class="p-5 sm:p-6 space-y-5 max-h-[80vh] overflow-y-auto">
            
            <!-- Filter Pills -->
            <div class="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-mono">
              <span class="text-slate-400 uppercase tracking-wider text-[10px]">Filter:</span>
              ${['ALL', 'CRITICAL', 'HIGH', 'Heavy Rain', 'Landslide', 'Flood', 'Network Failure'].map(f => `
                <button data-filter="${f}" class="px-3 py-1 rounded-lg transition font-medium ${activeFilter === f ? 'bg-cyan-600 text-white font-bold' : 'bg-command-850 hover:bg-command-800 text-slate-300 border border-command-border'}">
                  ${f}
                </button>
              `).join('')}
            </div>

            <!-- Alerts List -->
            <div class="space-y-3">
              ${filtered.length === 0 ? `
                <div class="text-center py-12 text-slate-400 text-xs font-mono">No active alerts matching filter.</div>
              ` : filtered.map(alt => {
                const isCrit = alt.severity === 'CRITICAL';
                const isHigh = alt.severity === 'HIGH';
                const borderColor = isCrit ? 'border-rose-500/50 bg-rose-950/20' : isHigh ? 'border-amber-500/50 bg-amber-950/20' : 'border-command-border bg-command-850';
                const badgeColor = isCrit ? 'bg-rose-500/20 text-rose-300 border-rose-500' : isHigh ? 'bg-amber-500/20 text-amber-300 border-amber-500' : 'bg-slate-500/20 text-slate-300 border-slate-500';

                return `
                  <div class="p-4 rounded-xl border ${borderColor} space-y-3 transition">
                    <div class="flex items-start justify-between">
                      <div class="flex items-center gap-2.5">
                        <span class="px-2 py-0.5 rounded border text-[10px] font-mono font-bold ${badgeColor}">
                          ${alt.severity} · ${alt.category}
                        </span>
                        <h4 class="text-sm font-bold text-white">${alt.title}</h4>
                      </div>
                      <span class="text-xs font-mono text-slate-400">${alt.timestamp}</span>
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300 font-sans">
                      <div><strong class="text-slate-400 font-mono">Location:</strong> ${alt.location}</div>
                      <div><strong class="text-slate-400 font-mono">Affected Fleets:</strong> <span class="text-cyan-300 font-mono">${alt.affectedVehicles.join(', ') || 'General Traffic'}</span></div>
                    </div>

                    <div class="p-3 rounded-lg bg-command-900 border border-command-border flex items-center justify-between text-xs">
                      <div class="text-slate-200">
                        <span><strong>AI Action:</strong> ${alt.recommendedAction}</span>
                      </div>
                      <span class="font-mono text-[11px] text-emerald-400 shrink-0 ml-3">Confidence: ${alt.aiConfidence || '95%'}</span>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>

          </div>

          <!-- Footer -->
          <div class="bg-command-900 p-4 px-6 flex items-center justify-between">
            <button id="btn-broadcast-alert" class="px-4 py-2 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/40 text-xs font-mono font-semibold transition">
              Broadcast Radio Advisory to Fleets
            </button>
            <button id="btn-close-alert-footer" class="px-5 py-2 rounded-xl bg-command-800 hover:bg-command-700 text-slate-300 text-xs font-mono font-medium transition border border-command-border">
              Close
            </button>
          </div>

        </div>
      </div>
    `;

    const closeModal = () => { container.innerHTML = ''; };
    container.querySelector('#btn-close-alert-modal')?.addEventListener('click', closeModal);
    container.querySelector('#btn-close-alert-footer')?.addEventListener('click', closeModal);

    container.querySelectorAll('[data-filter]').forEach(b => {
      b.addEventListener('click', (e) => {
        activeFilter = e.currentTarget.getAttribute('data-filter');
        renderAlerts();
      });
    });

    container.querySelector('#btn-broadcast-alert')?.addEventListener('click', () => {
      sounds.playEmergencyAlert();
      sounds.speakDispatch('Emergency broadcast transmitted to all active logistics units across North Eastern corridors.');
      alert('Emergency Broadcast sent to all active fleet radios and driver in-cab terminals.');
    });
  };

  renderAlerts();
}
