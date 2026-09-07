/**
 * Enterprise Authentication & Role Gateway View
 * Supports Driver Access via Checkpost Port Code & Direct Role Logins
 */

import { store, PRESET_CREDENTIALS, USER_ROLES } from '../state/store.js';
import { sounds } from '../audio/sound-effects.js';

export function renderLoginView(appContainer) {
  const { dispatches } = store.state;
  const samplePortCode = dispatches?.[0]?.portCode || 'PORT-7890';

  appContainer.innerHTML = `
    <div class="min-h-screen flex flex-col justify-between tactical-grid bg-command-950 relative p-6 sm:p-10">
      
      <!-- Top Tactical Header -->
      <div class="flex items-center justify-between z-10">
        <div class="flex items-center gap-3.5">
          <div class="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-500/40 flex items-center justify-center font-mono font-bold text-sm text-cyan-400 relative shadow-lg">
            NER
            <span class="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping"></span>
          </div>
          <div>
            <h1 class="text-xl font-display font-extrabold tracking-tight text-white uppercase">NER Smart Logistics</h1>
            <p class="text-xs text-cyan-400 font-mono">Disaster-Resilient Logistics & Accessibility Intelligence</p>
          </div>
        </div>

        <div class="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-command-900 border border-command-border text-xs font-mono text-slate-300">
          <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>NER-GIS COMMAND PORTAL v2.5</span>
        </div>
      </div>

      <!-- Main Login Center Container -->
      <div class="my-auto max-w-5xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center z-10 py-6">
        
        <!-- Left: Mission & Driver Quick Port Code Access -->
        <div class="lg:col-span-6 space-y-6">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-cyan-950/80 text-cyan-300 border border-cyan-800/80 text-xs font-mono">
            <span>North Eastern Council · Real-Time C2 Network</span>
          </div>

          <h2 class="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight leading-tight">
            Checkpost Vehicle Dispatch &<br>
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400">Live Driver Cockpit Access</span>
          </h2>

          <p class="text-sm text-slate-300 leading-relaxed font-sans">
            Vehicles dispatched from the Control Room Checkpost receive a unique <strong>Port Access Code</strong>. Enter the Port Code below to connect directly into the live In-Cab Cockpit HUD.
          </p>

          <!-- DRIVER QUICK PORT CODE LOGIN CARD -->
          <div class="p-5 rounded-2xl bg-gradient-to-br from-emerald-950/50 to-command-900 border border-emerald-500/40 shadow-xl space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-xs font-mono font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                Driver Vehicle Access by Port Code
              </span>
              <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                ACTIVE CHECKPOST
              </span>
            </div>

            <form id="form-port-login" class="flex gap-2">
              <input type="text" id="input-port-code" placeholder="Enter Port Code (e.g. ${samplePortCode})" class="flex-1 bg-command-950 border border-emerald-500/50 rounded-xl px-4 py-2.5 text-xs text-white font-mono placeholder:text-slate-500 focus:outline-none focus:border-emerald-400 uppercase font-bold" value="${samplePortCode}">
              <button type="submit" class="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold text-xs transition shadow-lg shadow-emerald-950 whitespace-nowrap">
                Launch Driver HUD
              </button>
            </form>
            <div id="port-error-msg" class="hidden text-[11px] font-mono text-rose-400"></div>
          </div>

        </div>

        <!-- Right: Operator Credentials & Role Cards -->
        <div class="lg:col-span-6">
          <div class="hud-panel rounded-2xl p-6 sm:p-8 border border-command-border bg-command-900/90 shadow-2xl space-y-5">
            
            <div>
              <h3 class="text-lg font-display font-bold text-white uppercase tracking-wider">Operator Portal Login</h3>
              <p class="text-xs text-slate-400 font-mono mt-0.5">Control Room, Field Officer, or Simulator Commander</p>
            </div>

            <!-- Login Form -->
            <form id="login-form" class="space-y-4">
              <div>
                <label class="block text-xs font-mono text-slate-300 mb-1.5 uppercase">
                  Operator Username
                </label>
                <input type="text" id="input-username" required placeholder="Enter username (e.g. control_room)" class="w-full bg-command-950 border border-command-border rounded-xl px-4 py-2.5 text-xs text-white font-mono placeholder:text-slate-600 focus:outline-none focus:border-cyan-400 transition" value="control_room">
              </div>

              <div>
                <label class="block text-xs font-mono text-slate-300 mb-1.5 uppercase">Password</label>
                <input type="password" id="input-password" required placeholder="••••••••" class="w-full bg-command-950 border border-command-border rounded-xl px-4 py-2.5 text-xs text-white font-mono placeholder:text-slate-600 focus:outline-none focus:border-cyan-400 transition" value="password123">
              </div>

              <div id="login-error-msg" class="hidden p-3 rounded-xl bg-rose-950/60 border border-rose-500/50 text-xs text-rose-300 font-mono"></div>

              <button type="submit" class="w-full py-3 px-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-mono font-bold text-xs flex items-center justify-center shadow-lg shadow-cyan-950 transition">
                Authorize & Open Command Room
              </button>
            </form>

            <!-- Quick 1-Click Role Login Cards -->
            <div class="pt-4 border-t border-command-border space-y-2.5">
              <div class="flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span class="uppercase">1-Click Fast Roles:</span>
                <span class="text-cyan-400">Demo Ready</span>
              </div>

              <div class="grid grid-cols-2 gap-2">
                <!-- Role 1: Control Room -->
                <button type="button" class="btn-quick-login p-3 rounded-xl bg-command-950 hover:bg-command-800 border border-command-border text-left transition hover:border-cyan-500/50" data-username="control_room" data-password="password123">
                  <div class="text-cyan-400 text-xs font-bold font-mono">Control Room</div>
                  <div class="text-[10px] text-slate-400 font-mono mt-0.5">Checkpost & Dispatch</div>
                </button>

                <!-- Role 2: Driver -->
                <button type="button" class="btn-quick-login p-3 rounded-xl bg-command-950 hover:bg-command-800 border border-command-border text-left transition hover:border-emerald-500/50" data-username="driver_07" data-password="password123">
                  <div class="text-emerald-400 text-xs font-bold font-mono">Driver HUD</div>
                  <div class="text-[10px] text-slate-400 font-mono mt-0.5">Route A Live Cockpit</div>
                </button>

                <!-- Role 3: Point & Launch -->
                <button type="button" class="btn-quick-login p-3 rounded-xl bg-command-950 hover:bg-command-800 border border-command-border text-left transition hover:border-purple-500/50" data-username="mission_commander" data-password="password123">
                  <div class="text-purple-400 text-xs font-bold font-mono">Point & Launch</div>
                  <div class="text-[10px] text-slate-400 font-mono mt-0.5">Simulate Rain & Hazards</div>
                </button>

                <!-- Role 4: Field Officer -->
                <button type="button" class="btn-quick-login p-3 rounded-xl bg-command-950 hover:bg-command-800 border border-command-border text-left transition hover:border-amber-500/50" data-username="field_officer" data-password="password123">
                  <div class="text-amber-400 text-xs font-bold font-mono">Field Officer</div>
                  <div class="text-[10px] text-slate-400 font-mono mt-0.5">Road Hazard Reporting</div>
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>

      <!-- Bottom Footer -->
      <div class="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500 font-mono z-10 pt-4 border-t border-command-border/60">
        <div>Northeast Disaster Management & Critical Accessibility Infrastructure Platform</div>
        <div>Assam · Meghalaya · Arunachal · Manipur · Mizoram · Nagaland · Tripura · Sikkim</div>
      </div>

    </div>
  `;

  // Bind Driver Port Code Form Submit
  const portForm = appContainer.querySelector('#form-port-login');
  const portError = appContainer.querySelector('#port-error-msg');

  portForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const portCode = appContainer.querySelector('#input-port-code').value.trim();
    const result = store.loginWithPortCode(portCode);
    if (result.success) {
      sounds.playSuccess();
    } else {
      sounds.playEmergencyAlert();
      if (portError) {
        portError.textContent = result.message || 'Invalid Port Code';
        portError.classList.remove('hidden');
      }
    }
  });

  // Bind Standard Form Submit
  const form = appContainer.querySelector('#login-form');
  const errorMsg = appContainer.querySelector('#login-error-msg');

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = appContainer.querySelector('#input-username').value;
    const password = appContainer.querySelector('#input-password').value;

    const result = store.login(username, password);
    if (result.success) {
      sounds.playSuccess();
    } else {
      sounds.playEmergencyAlert();
      if (errorMsg) {
        errorMsg.textContent = result.message;
        errorMsg.classList.remove('hidden');
      }
    }
  });

  // Bind 1-Click Fast Login
  appContainer.querySelectorAll('.btn-quick-login').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const u = e.currentTarget.getAttribute('data-username');
      const p = e.currentTarget.getAttribute('data-password');
      appContainer.querySelector('#input-username').value = u;
      appContainer.querySelector('#input-password').value = p;
      const res = store.login(u, p);
      if (res.success) sounds.playSuccess();
    });
  });
}
