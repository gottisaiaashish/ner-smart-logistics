/**
 * Checkpost Vehicle Dispatch & Port Access Code Generator Modal
 * Used in Control Room to register origin vehicles, assign routes, and generate Driver Port Codes
 */

import { store } from '../state/store.js';
import { sounds } from '../audio/sound-effects.js';

export function openCheckpostDispatchModal() {
  const container = document.getElementById('modal-container');
  if (!container) return;

  let generatedDispatch = null;

  const renderModal = () => {
    container.innerHTML = `
      <div class="fixed inset-0 z-[9999] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fadeIn">
        <div class="hud-panel rounded-2xl border border-cyan-500/40 bg-command-950 shadow-2xl w-full max-w-2xl flex flex-col divide-y divide-command-border">
          
          <!-- Header -->
          <div class="p-5 sm:p-6 flex items-center justify-between bg-command-900 shrink-0">
            <div>
              <div class="flex items-center gap-3">
                <span class="w-3 h-3 rounded-full bg-cyan-400 animate-ping"></span>
                <h2 class="text-base font-display font-bold text-white uppercase tracking-wider">
                  Checkpost Vehicle Dispatch & Port Generator
                </h2>
              </div>
              <p class="text-xs text-slate-400 font-mono mt-1">
                Register departing convoy at Guwahati checkpost and generate live Driver Port Key.
              </p>
            </div>

            <button id="btn-close-dispatch-modal" class="px-3 py-1.5 rounded-lg bg-command-800 hover:bg-command-700 text-slate-300 text-xs font-mono font-medium transition border border-command-border">
              Close
            </button>
          </div>

          <!-- Body -->
          <div class="p-5 sm:p-6 space-y-5">
            
            ${generatedDispatch ? `
              <!-- SUCCESS STATE: Generated Port Code -->
              <div class="p-6 rounded-2xl bg-gradient-to-br from-emerald-950/60 to-command-900 border-2 border-emerald-500 shadow-2xl text-center space-y-4 animate-fadeIn">
                <div class="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-400 flex items-center justify-center mx-auto text-xl font-bold">
                  ✓
                </div>

                <div>
                  <span class="text-xs font-mono text-emerald-400 uppercase tracking-widest block">CHECKPOST DISPATCH AUTHORIZED</span>
                  <h3 class="text-3xl font-mono font-black text-white mt-1 tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-300">
                    ${generatedDispatch.portCode}
                  </h3>
                  <p class="text-xs text-slate-300 font-mono mt-1">
                    Provide this Port Code to the driver to connect into the In-Cab Cockpit HUD.
                  </p>
                </div>

                <div class="p-4 rounded-xl bg-command-950/80 border border-command-border text-left grid grid-cols-2 gap-3 text-xs font-mono">
                  <div>
                    <span class="text-slate-500 block text-[10px]">VEHICLE NUMBER</span>
                    <strong class="text-white">${generatedDispatch.vehicleNumber}</strong>
                  </div>
                  <div>
                    <span class="text-slate-500 block text-[10px]">DRIVER</span>
                    <strong class="text-cyan-300">${generatedDispatch.driverName}</strong>
                  </div>
                  <div>
                    <span class="text-slate-500 block text-[10px]">CARGO & PRIORITY</span>
                    <strong class="text-rose-400">${generatedDispatch.cargo}</strong>
                  </div>
                  <div>
                    <span class="text-slate-500 block text-[10px]">INITIAL ROUTE</span>
                    <strong class="text-emerald-400">Route A (NH-6 Primary)</strong>
                  </div>
                </div>

                <div class="flex flex-col sm:flex-row gap-2 pt-2">
                  <button id="btn-copy-port-code" class="flex-1 py-3 rounded-xl bg-command-800 hover:bg-command-750 text-slate-200 font-mono font-bold text-xs border border-command-border transition">
                    Copy Port Code
                  </button>
                  <button id="btn-open-driver-portal" class="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold text-xs transition shadow-lg shadow-emerald-950">
                    Switch to Driver HUD Now
                  </button>
                </div>
              </div>
            ` : `
              <!-- DISPATCH FORM -->
              <form id="form-checkpost-dispatch" class="space-y-4">
                
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label class="block text-[10px] font-mono text-slate-300 uppercase mb-1">Vehicle Registration No.</label>
                    <input type="text" id="disp-veh-num" required class="w-full bg-command-850 border border-command-border rounded-xl px-3.5 py-2 text-xs text-white font-mono uppercase font-bold" value="AS-01-EE-7890">
                  </div>
                  <div>
                    <label class="block text-[10px] font-mono text-slate-300 uppercase mb-1">Vehicle Class</label>
                    <select id="disp-veh-type" class="w-full bg-command-850 border border-command-border rounded-xl px-3.5 py-2 text-xs text-white font-sans">
                      <option value="Refrigerated 4x4 Heavy Unit">Refrigerated 4x4 Heavy Logistics Unit</option>
                      <option value="All-Terrain Relief Truck">All-Terrain 6x6 Relief Truck</option>
                      <option value="Emergency Ambulance ALS">Advanced Life Support Mobile Unit</option>
                    </select>
                  </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label class="block text-[10px] font-mono text-slate-300 uppercase mb-1">Driver Full Name</label>
                    <input type="text" id="disp-driver-name" required class="w-full bg-command-850 border border-command-border rounded-xl px-3.5 py-2 text-xs text-white font-sans" value="Suresh Das">
                  </div>
                  <div>
                    <label class="block text-[10px] font-mono text-slate-300 uppercase mb-1">Driver Phone Contact</label>
                    <input type="text" id="disp-driver-phone" class="w-full bg-command-850 border border-command-border rounded-xl px-3.5 py-2 text-xs text-white font-mono" value="+91 94350-12894">
                  </div>
                </div>

                <div>
                  <label class="block text-[10px] font-mono text-slate-300 uppercase mb-1">Cargo Manifest & Temp Requirement</label>
                  <input type="text" id="disp-cargo" required class="w-full bg-command-850 border border-command-border rounded-xl px-3.5 py-2 text-xs text-white font-sans" value="Essential Rabies Vaccines & Anti-Venom (-20°C)">
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label class="block text-[10px] font-mono text-slate-300 uppercase mb-1">Departure Checkpost</label>
                    <input type="text" id="disp-origin" class="w-full bg-command-850 border border-command-border rounded-xl px-3.5 py-2 text-xs text-white font-sans" value="Khanapara Checkpost Staging Hub, Guwahati">
                  </div>
                  <div>
                    <label class="block text-[10px] font-mono text-slate-300 uppercase mb-1">Target Destination</label>
                    <select id="disp-dest" class="w-full bg-command-850 border border-command-border rounded-xl px-3.5 py-2 text-xs text-white font-sans">
                      <option value="District Civil Hospital, Silchar">District Civil Hospital, Silchar</option>
                      <option value="Aizawl Emergency Medical Depot">Aizawl Emergency Medical Depot</option>
                      <option value="Agartala Regional Relief Hub">Agartala Regional Relief Hub</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label class="block text-[10px] font-mono text-slate-300 uppercase mb-1">Initial Assigned Route</label>
                  <div class="p-3 rounded-xl bg-command-850 border border-command-border flex items-center justify-between text-xs font-mono">
                    <span class="text-slate-300">Route A: Primary NH-6 Corridor</span>
                    <span class="text-cyan-400 font-bold">212 km · 4h 15m</span>
                  </div>
                </div>

                <button type="submit" class="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-white font-mono font-bold text-xs flex items-center justify-center shadow-lg shadow-cyan-950 transition">
                  DISPATCH VEHICLE & GENERATE DRIVER PORT CODE
                </button>
              </form>
            `}

          </div>

        </div>
      </div>
    `;

    // Bind Close
    container.querySelector('#btn-close-dispatch-modal')?.addEventListener('click', () => {
      container.innerHTML = '';
    });

    // Bind Form Submit
    container.querySelector('#form-checkpost-dispatch')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const vehicleNumber = container.querySelector('#disp-veh-num').value;
      const vehicleType = container.querySelector('#disp-veh-type').value;
      const driverName = container.querySelector('#disp-driver-name').value;
      const driverPhone = container.querySelector('#disp-driver-phone').value;
      const cargo = container.querySelector('#disp-cargo').value;
      const origin = container.querySelector('#disp-origin').value;
      const destination = container.querySelector('#disp-dest').value;

      generatedDispatch = store.dispatchVehicle({
        vehicleNumber,
        vehicleType,
        driverName,
        driverPhone,
        cargo,
        origin,
        destination,
        priority: 'CRITICAL'
      });

      sounds.playSuccess();
      sounds.speakDispatch(`Vehicle ${vehicleNumber} dispatched. Port code: ${generatedDispatch.portCode}.`);
      renderModal();
    });

    // Copy Port Code
    container.querySelector('#btn-copy-port-code')?.addEventListener('click', () => {
      if (generatedDispatch?.portCode) {
        navigator.clipboard.writeText(generatedDispatch.portCode);
        alert(`Port code ${generatedDispatch.portCode} copied to clipboard!`);
      }
    });

    // Switch to Driver Portal
    container.querySelector('#btn-open-driver-portal')?.addEventListener('click', () => {
      container.innerHTML = '';
      store.loginWithPortCode(generatedDispatch.portCode);
    });
  };

  renderModal();
}
