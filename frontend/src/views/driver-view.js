/**
 * Vehicle Driver Dedicated In-Cab Cockpit & Digital Push-to-Talk Interface
 * Connected directly to Control Room Brain & AI Routing Engine
 */

import { renderNavbar } from '../components/navbar.js';
import { GisMap } from '../components/gis-map.js';
import { store } from '../state/store.js';
import { openRoadModal } from '../components/road-modal.js';
import { sounds } from '../audio/sound-effects.js';

export function renderDriverView(appContainer) {
  const { vehicles, driverContext, aiIntelligence, routesEvaluation, environment } = store.state;
  const vehicle = vehicles.find(v => v.id === driverContext.activeVehicleId) || vehicles[0];

  const isRerouted = vehicle.status === 'REROUTED';
  const showRerouteRequired = (aiIntelligence.accessibilityRiskPct >= 65 || routesEvaluation.routeA.riskPct >= 65) && !isRerouted;

  appContainer.innerHTML = `
    <!-- Top Nav Header -->
    <div id="nav-container" class="shrink-0"></div>

    <!-- Offline Resilience Banner (if toggled) -->
    ${driverContext.isOfflineMode ? `
      <div class="bg-amber-600 text-black px-6 py-2.5 text-xs font-mono font-bold flex items-center justify-between shadow-lg sticky top-[53px] z-20 shrink-0">
        <div class="flex items-center gap-3">
          <span class="w-2 h-2 rounded-full bg-black animate-ping"></span>
          <span>LIMITED CONNECTIVITY — OFFLINE CACHED ROUTE & RISK MAP ACTIVE (DEGRADED MODE)</span>
        </div>
        <div class="flex items-center gap-4 text-xs">
          <span>Synced: ${driverContext.lastSyncedTime}</span>
          <button id="btn-toggle-offline-banner" class="px-3 py-1 rounded bg-black/20 hover:bg-black/30 text-black font-mono border border-black/30 transition">
            Restore Link
          </button>
        </div>
      </div>
    ` : ''}

    <!-- Driver In-Cab HUD Layout -->
    <main class="h-[calc(100vh-53px)] flex flex-col lg:flex-row overflow-hidden relative w-full">
      
      <!-- LEFT / CENTER: In-Cab GPS Turn-by-Turn Navigation Map -->
      <section class="flex-1 flex flex-col h-full relative border-r border-command-border min-w-0">
        
        <!-- Large Turn-by-Turn HUD Banner at Top of Map -->
        <div class="absolute top-4 left-4 right-4 z-[1000] flex flex-col sm:flex-row gap-3 pointer-events-auto">
          
          <!-- Turn Instruction Card (Google Maps Style) -->
          <div class="hud-panel rounded-xl p-4 border border-cyan-500/40 shadow-2xl flex items-center justify-between gap-5 flex-1">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-xl ${isRerouted ? 'bg-emerald-600 text-white' : 'bg-cyan-600 text-white'} flex items-center justify-center font-extrabold text-2xl shadow-md font-mono shrink-0">
                ${isRerouted ? '↱' : '↑'}
              </div>
              <div>
                <div class="text-[10px] font-mono text-cyan-400 uppercase tracking-widest flex items-center gap-2">
                  <span>${isRerouted ? 'AI ROUTE B ENGAGED (SAFE BYPASS)' : 'PRIMARY ROUTE A (NH-6 ARTERIAL)'}</span>
                  <span class="text-slate-400">· Port: <strong class="text-emerald-400 font-mono px-1.5 py-0.5 rounded bg-command-950 border border-emerald-500/40">${vehicle.portCode || 'PORT-7890'}</strong></span>
                </div>
                <div class="text-sm font-bold text-white mt-0.5">
                  ${isRerouted ? 'Follow Umrangso North Cachar Bypass toward Silchar District Hospital' : 'Continue along NH-6 toward Shillong-Sonapur Chokepoint'}
                </div>
              </div>
            </div>

            <div class="text-right font-mono pr-2 shrink-0">
              <div class="text-xl font-bold text-emerald-400">${vehicle.eta}</div>
              <div class="text-[11px] text-slate-400">ETA to Hospital</div>
            </div>
          </div>

          <!-- Drive Forward / Step Waypoint Button -->
          <button id="btn-driver-drive-step" class="hud-panel px-4 py-3 rounded-xl bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/50 hover:border-cyan-400 text-xs font-mono font-bold text-cyan-300 flex items-center justify-center gap-2 transition shadow-md whitespace-nowrap" title="Advance Truck to Next Road Landmark">
            <span>🚗 Drive Forward ▶</span>
          </button>

          <!-- Enter Another Port Code / Change Ride -->
          <button id="btn-driver-change-port" class="hud-panel px-3.5 py-3 rounded-xl border border-cyan-500/40 hover:border-cyan-400 text-xs font-mono font-bold text-slate-300 hover:text-white flex items-center justify-center gap-1.5 transition shadow-md whitespace-nowrap">
            <span>🔑 Port Code</span>
          </button>

          <!-- Quick Offline Mode Toggle Button -->
          <button id="btn-driver-offline-toggle" class="hud-panel px-3 py-3 rounded-xl border border-command-border text-xs font-mono font-medium flex items-center justify-center gap-1.5 transition ${driverContext.isOfflineMode ? 'bg-amber-600/30 text-amber-300 border-amber-500' : 'text-slate-300 hover:text-white'}">
            <span>${driverContext.isOfflineMode ? 'Offline' : 'Mesh'}</span>
          </button>

        </div>

        <!-- REROUTE INTERVENTION CARD / BANNER -->
        ${showRerouteRequired ? `
          <div class="absolute bottom-6 left-4 right-4 z-[1000] hud-panel-danger rounded-2xl p-6 border-2 border-rose-500 bg-command-950/98 shadow-2xl space-y-4 pointer-events-auto">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <span class="w-3 h-3 rounded-full bg-rose-500 animate-ping"></span>
                <h3 class="text-base font-display font-extrabold text-white tracking-wider uppercase">
                  CONTROL ROOM ADVISORY: MANDATORY REROUTE
                </h3>
              </div>
              <span class="px-2.5 py-1 rounded bg-rose-500/20 text-rose-300 border border-rose-500 text-xs font-mono font-bold">
                CRITICAL ROAD RISK (${aiIntelligence.accessibilityRiskPct}%)
              </span>
            </div>

            <div class="p-3.5 rounded-xl bg-rose-950/50 border border-rose-900/80 text-xs text-rose-200 font-mono">
              <strong>Incident:</strong> Landslide probability spiked to ${environment.landslideProb}% at Sonapur (Km 142). Rain rate: ${environment.rainfall} mm/hr. Corridor accessibility cut off.
            </div>

            <div class="p-3.5 rounded-xl bg-emerald-950/50 border border-emerald-900/80 flex items-center justify-between text-xs font-mono">
              <div>
                <span class="text-emerald-400 font-bold">Recommended Alternate: Route B (NH-27 / Umrangso Bypass)</span>
                <p class="text-slate-300 mt-1">348 km · 8h 20m ETA · Reinforced Rock Bedrock · Risk: 22% (LOW)</p>
              </div>
              <span class="text-emerald-400 font-bold text-sm bg-emerald-950 px-3 py-1 rounded border border-emerald-800">94.6% Conf</span>
            </div>

            <div class="flex flex-col sm:flex-row items-center gap-3 pt-1">
              <button id="btn-accept-route-b" class="flex-1 py-3 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs font-mono transition flex items-center justify-center shadow-lg shadow-emerald-950">
                ACCEPT REROUTE (SWITCH TO ROUTE B)
              </button>
              <button id="btn-decline-reroute" class="py-3 px-5 rounded-xl bg-command-800 hover:bg-command-750 text-slate-300 text-xs font-mono font-medium border border-command-border">
                DECLINE
              </button>
              <button id="btn-call-dispatch" class="py-3 px-5 rounded-xl bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 text-xs font-mono font-bold border border-cyan-500/40">
                CONTACT DISPATCH
              </button>
            </div>
          </div>
        ` : ''}

        <!-- GPS Map Container -->
        <div id="driver-map-container" class="flex-1 w-full h-full relative z-0 min-h-0 pt-20"></div>

      </section>

      <!-- RIGHT SIDEBAR: In-Cab Cockpit Telemetry & Digital Push-to-Talk -->
      <aside class="w-full lg:w-[420px] xl:w-[460px] h-full bg-command-950 overflow-y-auto flex flex-col divide-y divide-command-border shrink-0 z-10 shadow-2xl">
        
        <!-- SECTION 1: In-Cab Cockpit Telemetry -->
        <div class="p-5 space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-sm font-display font-bold text-white">${vehicle.id} Cockpit HUD</h3>
              <span class="text-xs text-slate-400 font-mono">Driver: ${vehicle.driverName} (${vehicle.driverPhone})</span>
            </div>
            <span class="text-xs font-mono px-2.5 py-1 rounded border ${isRerouted ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50' : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'} font-semibold">
              ${vehicle.status}
            </span>
          </div>

          <!-- Speed & Destination HUD -->
          <div class="p-4 rounded-xl bg-command-850 border border-command-border grid grid-cols-2 gap-4 text-center">
            <div class="border-r border-command-border pr-2">
              <span class="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Live Speed</span>
              <div class="text-2xl font-mono font-extrabold text-cyan-400 mt-1">${vehicle.speed} <span class="text-xs text-slate-400 font-normal">km/h</span></div>
            </div>
            <div>
              <span class="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Road Risk State</span>
              <div class="text-base font-mono font-bold ${isRerouted ? 'text-emerald-400' : showRerouteRequired ? 'text-rose-400' : 'text-amber-400'} mt-1.5">
                ${isRerouted ? 'LOW RISK (22%)' : showRerouteRequired ? 'CRITICAL (84%)' : 'MONITORED'}
              </div>
            </div>
          </div>

          <!-- Cargo & Cold Chain Sensor -->
          <div class="p-4 rounded-xl bg-command-850 border border-command-border space-y-2">
            <div class="flex items-center justify-between text-xs">
              <span class="font-mono text-slate-400">CARGO MANIFEST [PRIORITY: <strong class="text-rose-400">${vehicle.priority}</strong>]</span>
              <span class="font-mono text-emerald-400">${vehicle.cargoType}</span>
            </div>
            <div class="text-xs font-bold text-white">${vehicle.cargo}</div>
            <div class="flex items-center justify-between text-[11px] text-slate-400 font-mono pt-2 border-t border-command-border">
              <span>Temp Sensor: <strong class="text-cyan-300">${vehicle.currentTemp}</strong></span>
              <span>Requirement: ${vehicle.tempRequirement}</span>
            </div>
          </div>

          <!-- Destination Info -->
          <div class="p-4 rounded-xl bg-command-850 border border-command-border text-xs space-y-1.5">
            <div class="flex items-center justify-between text-[10px] font-mono text-slate-400">
              <span>ORIGIN → DESTINATION</span>
              <span class="text-cyan-400">CORRIDOR: ${vehicle.assignedRoute}</span>
            </div>
            <div class="font-semibold text-white">${vehicle.origin}</div>
            <div class="text-slate-400 font-mono">↓</div>
            <div class="font-semibold text-emerald-400">${vehicle.destination}</div>
          </div>
        </div>

        <!-- SECTION 2: DIGITAL PUSH-TO-TALK (PTT) -->
        <div class="p-5 space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="text-xs font-mono font-bold text-white uppercase tracking-widest">Digital Push-to-Talk (PTT)</h3>
            <div class="flex items-center gap-2 text-xs font-mono text-emerald-400">
              <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>${driverContext.pttState || 'CONNECTED'}</span>
            </div>
          </div>

          <!-- Digital Radio Interface -->
          <div class="p-5 rounded-xl bg-command-850 border border-command-border space-y-4 text-center">
            
            <!-- Radio Waveform Visualizer -->
            <div class="h-8 bg-command-900 rounded-lg border border-command-border flex items-center justify-center gap-1.5 px-4 overflow-hidden" id="ptt-waveform">
              <div class="w-1.5 bg-cyan-500 rounded waveform-bar" style="height: 6px;"></div>
              <div class="w-1.5 bg-cyan-400 rounded waveform-bar" style="height: 14px;"></div>
              <div class="w-1.5 bg-cyan-300 rounded waveform-bar" style="height: 20px;"></div>
              <div class="w-1.5 bg-cyan-400 rounded waveform-bar" style="height: 12px;"></div>
              <div class="w-1.5 bg-cyan-500 rounded waveform-bar" style="height: 6px;"></div>
            </div>

            <!-- Large Tactile Push-To-Talk Button -->
            <button id="btn-ptt-talk" class="w-28 h-28 mx-auto rounded-full bg-gradient-to-b from-cyan-600 to-blue-800 hover:from-cyan-500 hover:to-blue-700 active:scale-95 border-4 border-cyan-400/60 shadow-xl shadow-cyan-950 flex flex-col items-center justify-center gap-1 text-white select-none cursor-pointer transition">
              <span class="text-xs font-mono font-bold tracking-wider">HOLD TO TALK</span>
            </button>

            <p class="text-[11px] text-slate-400 font-mono">
              Press and hold to transmit voice directly to Control Room Command
            </p>

          </div>

          <!-- Push-To-Talk Transcript / Incoming Feed -->
          <div class="space-y-2">
            <span class="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Radio Dispatch Transcripts</span>
            <div class="space-y-2 max-h-40 overflow-y-auto">
              ${driverContext.pttHistory.map(msg => `
                <div class="p-2.5 rounded-lg bg-command-850 border border-command-border text-xs space-y-1">
                  <div class="flex items-center justify-between text-[10px] font-mono">
                    <span class="text-cyan-400 font-bold">${msg.sender}</span>
                    <span class="text-slate-500">${msg.time}</span>
                  </div>
                  <p class="text-slate-200 text-xs leading-relaxed">${msg.text}</p>
                </div>
              `).join('')}
            </div>
          </div>

        </div>

      </aside>

    </main>
  `;

  // Render Top Navbar
  const navContainer = appContainer.querySelector('#nav-container');
  if (navContainer) renderNavbar(navContainer, 'driver');

  // Initialize Driver GIS Map
  setTimeout(() => {
    const driverMap = new GisMap('driver-map-container', {
      center: vehicle.coordinates,
      zoom: 10,
      isDriverView: true
    });
    driverMap.init();

    setTimeout(() => {
      if (driverMap.map) driverMap.map.invalidateSize();
    }, 150);

    // Bind Driver Controls
    appContainer.querySelector('#btn-accept-route-b')?.addEventListener('click', () => {
      sounds.playSuccess();
      store.acceptReroute(vehicle.id || 'TRUCK-07');
      sounds.speakDispatch('Route B accepted. Navigation guidance updated via Umrangso bypass.');
    });

    appContainer.querySelector('#btn-decline-reroute')?.addEventListener('click', () => {
      alert('Reroute advisory deferred. Control Room alerted.');
    });

    appContainer.querySelector('#btn-call-dispatch')?.addEventListener('click', () => {
      sounds.playPttPress();
      store.sendPushToTalkMessage({
        sender: 'Driver (TRUCK-07)',
        text: 'TRUCK-07 calling Control Room: Standing by at Nongpoh-Shillong junction for instructions.'
      });
      sounds.speakDispatch('Dispatch here, loud and clear TRUCK-07.');
    });

    // Drive Forward next waypoint
    appContainer.querySelector('#btn-driver-drive-step')?.addEventListener('click', () => {
      sounds.playSuccess();
      store.advanceVehicle(vehicle.id || 'TRUCK-07');
    });

    appContainer.querySelector('#btn-driver-change-port')?.addEventListener('click', () => {
      const code = prompt('Enter Checkpost Port Access Code (e.g. PORT-7890 or your Checkpost Code):', vehicle.portCode || 'PORT-7890');
      if (code && code.trim()) {
        const res = store.loginWithPortCode(code.trim());
        if (res.success) {
          sounds.playSuccess();
          sounds.speakDispatch(`Connecting to vehicle ${code.trim()}. Navigation HUD active.`);
        } else {
          sounds.playEmergencyAlert();
          alert(res.message || 'Invalid Port Code');
        }
      }
    });

    appContainer.querySelector('#btn-driver-offline-toggle')?.addEventListener('click', () => {
      store.toggleOfflineMode();
    });

    appContainer.querySelector('#btn-toggle-offline-banner')?.addEventListener('click', () => {
      store.toggleOfflineMode();
    });

    // Push-To-Talk Hold Actions
    const pttBtn = appContainer.querySelector('#btn-ptt-talk');
    if (pttBtn) {
      const startTalking = (e) => {
        e.preventDefault();
        sounds.playPttPress();
        pttBtn.classList.add('ring-8', 'ring-cyan-400/50', 'bg-cyan-500');
      };

      const stopTalking = (e) => {
        e.preventDefault();
        sounds.playPttRelease();
        pttBtn.classList.remove('ring-8', 'ring-cyan-400/50', 'bg-cyan-500');
        store.sendPushToTalkMessage({
          sender: 'Driver (TRUCK-07)',
          text: 'Voice from TRUCK-07: Copy Control. Navigating via designated waypoints.'
        });
      };

      pttBtn.addEventListener('mousedown', startTalking);
      pttBtn.addEventListener('mouseup', stopTalking);
      pttBtn.addEventListener('touchstart', startTalking);
      pttBtn.addEventListener('touchend', stopTalking);
    }
  }, 50);
}
