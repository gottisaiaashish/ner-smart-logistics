/**
 * Hackathon Presenter Fast Simulation Controller Dock
 * Allows 1-click execution of the entire demo story or individual stress tests directly from any screen
 */

import { store } from '../state/store.js';
import { simEngine } from '../simulation/sim-engine.js';
import { openEnvironmentControlModal } from './environment-control-modal.js';
import { sounds } from '../audio/sound-effects.js';

export function openSimulationControllerModal() {
  const container = document.getElementById('modal-container');
  if (!container) return;

  const render = () => {
    const { simulation, activeScenarioPreset, aiIntelligence } = store.state;

    container.innerHTML = `
      <div class="fixed inset-0 z-[9999] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fadeIn">
        <div class="hud-panel rounded-2xl border border-command-border bg-command-950 shadow-2xl w-full max-w-2xl flex flex-col divide-y divide-command-border">
          
          <!-- Header -->
          <div class="p-5 sm:p-6 flex items-center justify-between bg-command-900 shrink-0">
            <div>
              <div class="flex items-center gap-3">
                <h2 class="text-base font-display font-bold text-white uppercase tracking-wider">
                  Live Simulation Master Control
                </h2>
                <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800 font-semibold">
                  PRESENTER DOCK
                </span>
              </div>
              <p class="text-xs text-slate-400 font-mono mt-1">
                Automated end-to-end disaster-resilient logistics demonstration pipeline
              </p>
            </div>

            <button id="btn-close-sim-modal" class="px-3 py-1.5 rounded-lg bg-command-800 hover:bg-command-700 text-slate-300 text-xs font-mono font-medium transition border border-command-border">
              Close
            </button>
          </div>

          <!-- Body -->
          <div class="p-5 sm:p-6 space-y-5">
            
            <!-- 1-Click Automated Scenario Story Run -->
            <div class="p-5 rounded-xl bg-command-900 border border-rose-500/40 space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-xs font-mono font-bold text-rose-300 uppercase tracking-widest flex items-center gap-2">
                  <span class="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                  Automated End-to-End Demo Sequence
                </span>
                <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800 font-bold">
                  ~14s FLOW
                </span>
              </div>
              
              <p class="text-xs text-slate-300 leading-relaxed font-sans">
                Executes the complete causality chain: <strong>Normal Baseline</strong> → <strong>Rainfall Escalation</strong> → <strong>Sonapur Landslide</strong> → <strong>AI Risk Surge (84%)</strong> → <strong>Route B Evaluated</strong> → <strong>Driver HUD Reroute Alert</strong> → <strong>Digital PTT Voice Dispatch</strong> → <strong>Route B Diversion</strong>.
              </p>

              <button id="btn-run-full-demo" class="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-rose-600 via-purple-600 to-cyan-600 hover:opacity-95 text-white font-mono font-bold text-xs flex items-center justify-center shadow-xl shadow-rose-950 transition">
                RUN FULL LIVE PRESENTATION SCENARIO
              </button>
            </div>

            <!-- Granular Manual Triggers -->
            <div class="space-y-3">
              <h3 class="text-xs font-mono font-bold text-slate-300 uppercase tracking-widest">
                Granular Presentation Step Triggers
              </h3>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button id="btn-trig-rain" class="p-3.5 rounded-xl bg-command-850 hover:bg-command-800 border border-command-border text-left transition space-y-1">
                  <div class="text-xs font-bold text-white font-mono">1. Trigger Rain Surge</div>
                  <div class="text-[11px] text-slate-400">Escalate rainfall to 48.6 mm/hr</div>
                </button>

                <button id="btn-trig-landslide" class="p-3.5 rounded-xl bg-command-850 hover:bg-command-800 border border-command-border text-left transition space-y-1">
                  <div class="text-xs font-bold text-white font-mono">2. Trigger Sonapur Slide</div>
                  <div class="text-[11px] text-slate-400">Degrade NH-6 to 84% critical cutoff</div>
                </button>

                <button id="btn-trig-reroute-advisory" class="p-3.5 rounded-xl bg-command-850 hover:bg-command-800 border border-command-border text-left transition space-y-1">
                  <div class="text-xs font-bold text-white font-mono">3. Dispatch Route B Advisory</div>
                  <div class="text-[11px] text-slate-400">Send PTT & Cockpit Alert to TRUCK-07</div>
                </button>

                <button id="btn-trig-driver-accept" class="p-3.5 rounded-xl bg-command-850 hover:bg-command-800 border border-command-border text-left transition space-y-1">
                  <div class="text-xs font-bold text-white font-mono">4. Driver Accepts Route B</div>
                  <div class="text-[11px] text-slate-400">Move truck to Umrangso bypass</div>
                </button>
              </div>
            </div>

            <!-- Additional Stress Tests -->
            <div class="grid grid-cols-2 gap-3">
              <button id="btn-trig-net-fail" class="py-2.5 px-4 rounded-xl bg-command-850 hover:bg-command-800 border border-command-border text-xs font-mono text-amber-300 flex items-center justify-center transition">
                Simulate Network Blackout
              </button>

              <button id="btn-trig-open-env-ctrl" class="py-2.5 px-4 rounded-xl bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-500/40 text-xs font-mono text-cyan-300 flex items-center justify-center transition">
                Open Sliders Control
              </button>
            </div>

          </div>

          <!-- Footer -->
          <div class="p-5 bg-command-900 flex items-center justify-between shrink-0">
            <button id="btn-reset-demo-all" class="px-4 py-2 rounded-xl bg-command-800 hover:bg-command-750 text-slate-300 text-xs font-mono font-bold border border-command-border transition">
              Reset Demo States
            </button>
            <button id="btn-close-sim-footer" class="px-5 py-2 rounded-xl bg-command-800 hover:bg-command-700 text-white text-xs font-mono font-bold transition border border-command-border">
              Close
            </button>
          </div>

        </div>
      </div>
    `;

    // Bind full demo run
    container.querySelector('#btn-run-full-demo')?.addEventListener('click', () => {
      container.innerHTML = '';
      sounds.playEmergencyAlert();
      simEngine.startEmergencyDemo();
    });

    // Bind step 1
    container.querySelector('#btn-trig-rain')?.addEventListener('click', () => {
      store.applyScenarioPreset('HEAVY_MONSOON');
      sounds.playEmergencyAlert();
      render();
    });

    // Bind step 2
    container.querySelector('#btn-trig-landslide')?.addEventListener('click', () => {
      store.applyScenarioPreset('LANDSLIDE');
      sounds.playEmergencyAlert();
      render();
    });

    // Bind step 3
    container.querySelector('#btn-trig-reroute-advisory')?.addEventListener('click', () => {
      sounds.playEmergencyAlert();
      store.sendPushToTalkMessage({
        sender: 'Control Room Dispatch',
        text: 'Attention TRUCK-07: NH-6 Sonapur is unsafe. Route B via Umrangso bypass is authorized.'
      });
      sounds.speakDispatch('Attention TRUCK-07. Reroute advisory sent. Take Route B.');
      render();
    });

    // Bind step 4
    container.querySelector('#btn-trig-driver-accept')?.addEventListener('click', () => {
      sounds.playSuccess();
      store.acceptReroute('TRUCK-07');
      sounds.speakDispatch('TRUCK-07 accepted diversion to Route B.');
      render();
    });

    // Network fail trigger
    container.querySelector('#btn-trig-net-fail')?.addEventListener('click', () => {
      store.applyScenarioPreset('NETWORK_FAILURE');
      sounds.playEmergencyAlert();
      render();
    });

    // Sliders trigger
    container.querySelector('#btn-trig-open-env-ctrl')?.addEventListener('click', () => {
      container.innerHTML = '';
      openEnvironmentControlModal();
    });

    // Reset
    container.querySelector('#btn-reset-demo-all')?.addEventListener('click', () => {
      store.resetAllState();
      sounds.playSuccess();
      render();
    });

    // Close
    container.querySelector('#btn-close-sim-modal')?.addEventListener('click', () => {
      container.innerHTML = '';
    });
    container.querySelector('#btn-close-sim-footer')?.addEventListener('click', () => {
      container.innerHTML = '';
    });
  };

  render();
}
