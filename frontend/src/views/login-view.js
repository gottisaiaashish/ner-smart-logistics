/**
 * Enterprise Authentication & Role Gateway View
 * Supports Driver Access via Checkpost Port Code & Direct Portal URLs (/control-room, /driver, /point-launch, /field-officer)
 */

import { store, PRESET_CREDENTIALS, USER_ROLES } from '../state/store.js';
import { navigateTo } from '../app.js';
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
          <span>MULTI-PORTAL GATEWAY ACTIVE</span>
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

        <!-- Right: Dedicated Portal Direct Links & Credentials -->
        <div class="lg:col-span-6">
          <div class="hud-panel rounded-2xl p-6 sm:p-8 border border-command-border bg-command-900/90 shadow-2xl space-y-5">
            
            <div>
              <h3 class="text-lg font-display font-bold text-white uppercase tracking-wider">Direct Portal Access</h3>
              <p class="text-xs text-slate-400 font-mono mt-0.5">Click any portal below to open its dedicated direct URL</p>
            </div>

            <!-- 4 Dedicated Portal Route Cards -->
            <div class="grid grid-cols-2 gap-3">
              
              <!-- Portal 1: Control Room -->
              <a href="/control-room" class="btn-portal-route p-4 rounded-xl bg-command-950 hover:bg-command-850 border border-cyan-500/30 hover:border-cyan-400 text-left transition flex flex-col justify-between group shadow-sm block" data-route="control-room">
                <div>
                  <div class="text-cyan-400 text-sm font-bold font-mono group-hover:text-cyan-300 transition">Control Room</div>
                  <div class="text-[11px] text-slate-400 font-mono mt-1">Checkpost & Dispatch</div>
                </div>
                <div class="text-[10px] font-mono text-cyan-500/80 mt-3 pt-2 border-t border-command-border/60 flex items-center justify-between">
                  <span>/control-room</span>
                  <span class="group-hover:translate-x-1 transition text-cyan-400">→</span>
                </div>
              </a>

              <!-- Portal 2: Driver HUD -->
              <a href="/driver" class="btn-portal-route p-4 rounded-xl bg-command-950 hover:bg-command-850 border border-emerald-500/30 hover:border-emerald-400 text-left transition flex flex-col justify-between group shadow-sm block" data-route="driver">
                <div>
                  <div class="text-emerald-400 text-sm font-bold font-mono group-hover:text-emerald-300 transition">Driver HUD</div>
                  <div class="text-[11px] text-slate-400 font-mono mt-1">Route A Live Cockpit</div>
                </div>
                <div class="text-[10px] font-mono text-emerald-500/80 mt-3 pt-2 border-t border-command-border/60 flex items-center justify-between">
                  <span>/driver</span>
                  <span class="group-hover:translate-x-1 transition text-emerald-400">→</span>
                </div>
              </a>

              <!-- Portal 3: Point & Launch -->
              <a href="/point-launch" class="btn-portal-route p-4 rounded-xl bg-command-950 hover:bg-command-850 border border-purple-500/30 hover:border-purple-400 text-left transition flex flex-col justify-between group shadow-sm block" data-route="point-launch">
                <div>
                  <div class="text-purple-400 text-sm font-bold font-mono group-hover:text-purple-300 transition">Point & Launch</div>
                  <div class="text-[11px] text-slate-400 font-mono mt-1">Simulate Rain & Hazards</div>
                </div>
                <div class="text-[10px] font-mono text-purple-500/80 mt-3 pt-2 border-t border-command-border/60 flex items-center justify-between">
                  <span>/point-launch</span>
                  <span class="group-hover:translate-x-1 transition text-purple-400">→</span>
                </div>
              </a>

              <!-- Portal 4: Field Officer -->
              <a href="/field-officer" class="btn-portal-route p-4 rounded-xl bg-command-950 hover:bg-command-850 border border-amber-500/30 hover:border-amber-400 text-left transition flex flex-col justify-between group shadow-sm block" data-route="field-officer">
                <div>
                  <div class="text-amber-400 text-sm font-bold font-mono group-hover:text-amber-300 transition">Field Officer</div>
                  <div class="text-[11px] text-slate-400 font-mono mt-1">Road Hazard Reporting</div>
                </div>
                <div class="text-[10px] font-mono text-amber-500/80 mt-3 pt-2 border-t border-command-border/60 flex items-center justify-between">
                  <span>/field-officer</span>
                  <span class="group-hover:translate-x-1 transition text-amber-400">→</span>
                </div>
              </a>

            </div>

            <!-- Standard Login Option -->
            <div class="pt-3 border-t border-command-border">
              <form id="login-form" class="space-y-3">
                <div class="grid grid-cols-2 gap-2">
                  <input type="text" id="input-username" placeholder="Username" class="bg-command-950 border border-command-border rounded-xl px-3 py-2 text-xs text-white font-mono placeholder:text-slate-600 focus:outline-none focus:border-cyan-400" value="control_room">
                  <input type="password" id="input-password" placeholder="Password" class="bg-command-950 border border-command-border rounded-xl px-3 py-2 text-xs text-white font-mono placeholder:text-slate-600 focus:outline-none focus:border-cyan-400" value="password123">
                </div>
                <button type="submit" class="w-full py-2.5 rounded-xl bg-command-800 hover:bg-command-750 text-slate-200 font-mono font-bold text-xs border border-command-border transition">
                  Login with Custom Credentials
                </button>
              </form>
              <div id="login-error-msg" class="hidden p-2 rounded-lg bg-rose-950/60 border border-rose-500/50 text-xs text-rose-300 font-mono mt-2"></div>
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
      navigateTo('driver');
    } else {
      sounds.playEmergencyAlert();
      if (portError) {
        portError.textContent = result.message || 'Invalid Port Code';
        portError.classList.remove('hidden');
      }
    }
  });

  // Bind Portal Route Clicks
  appContainer.querySelectorAll('.btn-portal-route').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      sounds.playSuccess();
      const route = e.currentTarget.getAttribute('data-route');
      navigateTo(route);
    });
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
      if (result.user.role === USER_ROLES.CONTROL_ROOM) navigateTo('control-room');
      else if (result.user.role === USER_ROLES.DRIVER) navigateTo('driver');
      else if (result.user.role === USER_ROLES.FIELD_OFFICER) navigateTo('field-officer');
      else if (result.user.role === USER_ROLES.MISSION_LAUNCH) navigateTo('point-launch');
    } else {
      sounds.playEmergencyAlert();
      if (errorMsg) {
        errorMsg.textContent = result.message;
        errorMsg.classList.remove('hidden');
      }
    }
  });
}
