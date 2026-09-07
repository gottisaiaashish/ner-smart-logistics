/**
 * Field Officer Mobile / Tactical Incident Reporting View
 */

import { renderNavbar } from '../components/navbar.js';
import { GisMap } from '../components/gis-map.js';
import { store } from '../state/store.js';
import { sounds } from '../audio/sound-effects.js';

export function renderFieldOfficerView(appContainer) {
  const { currentUser, fieldReports } = store.state;

  appContainer.innerHTML = `
    <!-- Top Nav Header -->
    <div id="nav-container" class="shrink-0"></div>

    <!-- Field Officer Tactical Layout -->
    <main class="h-[calc(100vh-53px)] flex flex-col lg:flex-row overflow-hidden relative w-full">
      
      <!-- LEFT / CENTER: Interactive GIS Map & Field Pins -->
      <section class="flex-1 flex flex-col h-full relative border-r border-command-border min-w-0">
        
        <!-- Live GPS Field HUD Banner -->
        <div class="absolute top-4 left-4 right-4 z-[1000] flex items-center justify-between hud-panel rounded-xl p-3.5 border border-amber-500/40 shadow-2xl pointer-events-auto">
          <div class="flex items-center gap-3">
            <span class="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping"></span>
            <div>
              <div class="text-[10px] font-mono text-amber-400 uppercase tracking-wider">FIELD SECTOR GPS LOCK</div>
              <div class="text-xs font-bold text-white font-mono mt-0.5" id="field-gps-display">
                25.1120° N, 92.3850° E (Sonapur Ridge)
              </div>
            </div>
          </div>

          <div class="text-right">
            <span class="text-[10px] font-mono text-slate-400">ASSIGNED SECTOR</span>
            <div class="text-xs font-bold text-amber-300 font-mono mt-0.5">Meghalaya NH-6 Div</div>
          </div>
        </div>

        <!-- Field GIS Map Container -->
        <div id="field-map-container" class="flex-1 w-full h-full relative z-0 min-h-0 pt-20"></div>

      </section>

      <!-- RIGHT SIDEBAR: Field Incident Reporting Form & Report Feed -->
      <aside class="w-full lg:w-[420px] xl:w-[460px] h-full bg-command-950 overflow-y-auto flex flex-col divide-y divide-command-border shrink-0 z-10 shadow-2xl">
        
        <!-- Incident Reporting Form -->
        <div class="p-5 space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-xs font-mono font-bold text-white uppercase tracking-widest">
                Incident Reporting
              </h3>
              <span class="text-[11px] text-slate-400 font-mono">Officer: ${currentUser?.name || 'Inspector D. Sangma'}</span>
            </div>
            <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
              SDRF SYNC
            </span>
          </div>

          <form id="form-field-incident" class="space-y-3.5">
            <!-- Incident Type -->
            <div>
              <label class="block text-[11px] font-mono text-slate-300 mb-1.5 uppercase">Incident Category</label>
              <select id="field-incident-type" class="w-full bg-command-850 border border-command-border rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-sans">
                <option value="Landslide">Landslide / Mudslide / Rockfall</option>
                <option value="Flood">Flash Flood / River Water Overtopping</option>
                <option value="Road Damage">Road Surface Damage / Cave-in</option>
                <option value="Bridge Issue">Bridge Pillar / Culvert Damage</option>
                <option value="Accident">Vehicle Collision / Rollover</option>
                <option value="Traffic Block">Heavy Congealed Traffic Jam</option>
                <option value="Tree Blockage">Fallen Trees / Power Lines</option>
                <option value="Other">Other Strategic Hazard</option>
              </select>
            </div>

            <!-- Road / Corridor -->
            <div>
              <label class="block text-[11px] font-mono text-slate-300 mb-1.5 uppercase">Corridor Location</label>
              <input type="text" id="field-road-name" required placeholder="e.g. NH-6 near Sonapur Tunnel Entry" class="w-full bg-command-850 border border-command-border rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-sans" value="NH-6 near Sonapur Tunnel Entry (Km 142)">
            </div>

            <!-- Severity -->
            <div>
              <label class="block text-[11px] font-mono text-slate-300 mb-1.5 uppercase">Severity / Passability</label>
              <div class="grid grid-cols-2 gap-2.5">
                <label class="p-2.5 rounded-lg bg-command-850 border border-command-border flex items-center gap-2 cursor-pointer text-xs hover:border-amber-500">
                  <input type="radio" name="severity" value="Moderate (Slow Traffic)" class="text-amber-500">
                  <span class="text-slate-200 text-xs">Moderate</span>
                </label>
                <label class="p-2.5 rounded-lg bg-command-850 border border-rose-500/50 bg-rose-950/20 flex items-center gap-2 cursor-pointer text-xs">
                  <input type="radio" name="severity" value="Critical / Impassable" checked class="text-rose-500">
                  <span class="text-rose-300 font-bold text-xs">Impassable / Blocked</span>
                </label>
              </div>
            </div>

            <!-- GPS Coordinates -->
            <div class="grid grid-cols-2 gap-2.5">
              <div>
                <label class="block text-[10px] font-mono text-slate-400 mb-1 uppercase">Latitude</label>
                <input type="number" step="any" id="field-lat" required class="w-full bg-command-850 border border-command-border rounded-lg px-3 py-1.5 text-xs text-white font-mono" value="25.1120">
              </div>
              <div>
                <label class="block text-[10px] font-mono text-slate-400 mb-1 uppercase">Longitude</label>
                <input type="number" step="any" id="field-lng" required class="w-full bg-command-850 border border-command-border rounded-lg px-3 py-1.5 text-xs text-white font-mono" value="92.3850">
              </div>
            </div>

            <!-- Description -->
            <div>
              <label class="block text-[11px] font-mono text-slate-300 mb-1.5 uppercase">Field Observation</label>
              <textarea id="field-description" rows="2" required placeholder="Describe obstruction depth..." class="w-full bg-command-850 border border-command-border rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-sans leading-relaxed">Severe mud and boulder slide on both lanes. Debris depth approx 1.8m. Requesting heavy clearance earthmovers.</textarea>
            </div>

            <!-- Photo Attachment -->
            <div>
              <label class="block text-[11px] font-mono text-slate-300 mb-1.5 uppercase">Photo Evidence Capture</label>
              <div class="p-3 rounded-xl bg-command-850 border border-dashed border-command-border text-center space-y-2">
                <img id="field-photo-preview" src="https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=600&q=80" alt="Hazard Photo" class="w-full h-24 object-cover rounded-lg border border-command-border">
                <div class="flex items-center justify-center">
                  <button type="button" id="btn-camera-sim" class="px-3 py-1.5 rounded-lg bg-command-750 hover:bg-command-700 text-xs font-mono text-slate-300 border border-command-border">
                    Cycle Hazard Preset Photo
                  </button>
                </div>
              </div>
            </div>

            <!-- Submit Button -->
            <button type="submit" class="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-500 hover:to-rose-500 text-white font-bold text-xs font-mono flex items-center justify-center shadow-lg shadow-amber-950 transition">
              SUBMIT INCIDENT TO COMMAND CENTER
            </button>
          </form>
        </div>

        <!-- Recent Field Submissions Feed -->
        <div class="p-5 space-y-3">
          <h3 class="text-xs font-mono font-bold text-slate-300 uppercase tracking-widest">
            Active Verified Reports (${fieldReports.length})
          </h3>

          <div class="space-y-2.5">
            ${fieldReports.map(rep => `
              <div class="p-3 rounded-xl bg-command-850 border border-command-border space-y-1.5">
                <div class="flex items-start justify-between">
                  <div>
                    <span class="text-xs font-bold text-amber-400">${rep.incidentType}</span>
                    <div class="text-[11px] text-slate-400 font-mono mt-0.5">${rep.roadName}</div>
                  </div>
                  <span class="text-[10px] font-mono text-slate-500">${rep.timestamp}</span>
                </div>
                <p class="text-xs text-slate-300 leading-relaxed">${rep.description}</p>
                <div class="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1.5 border-t border-command-border">
                  <span>Officer: ${rep.officerName}</span>
                  <span class="text-emerald-400">AI Ingested</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

      </aside>

    </main>
  `;

  // Render Top Navbar
  const navContainer = appContainer.querySelector('#nav-container');
  if (navContainer) renderNavbar(navContainer, 'field');

  // Initialize Field GIS Map
  setTimeout(() => {
    const fieldMap = new GisMap('field-map-container', {
      center: [25.1120, 92.3850],
      zoom: 9
    });
    fieldMap.init();

    setTimeout(() => {
      if (fieldMap.map) fieldMap.map.invalidateSize();
    }, 150);

    // Photo simulation change
    const photoPresets = [
      'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=600&q=80'
    ];
    let photoIdx = 0;

    appContainer.querySelector('#btn-camera-sim')?.addEventListener('click', () => {
      photoIdx = (photoIdx + 1) % photoPresets.length;
      const preview = appContainer.querySelector('#field-photo-preview');
      if (preview) preview.src = photoPresets[photoIdx];
      sounds.playPttPress();
    });

    // Form Submit
    appContainer.querySelector('#form-field-incident')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const incidentType = appContainer.querySelector('#field-incident-type').value;
      const roadName = appContainer.querySelector('#field-road-name').value;
      const severity = appContainer.querySelector('input[name="severity"]:checked')?.value || 'Critical / Impassable';
      const lat = parseFloat(appContainer.querySelector('#field-lat').value);
      const lng = parseFloat(appContainer.querySelector('#field-lng').value);
      const description = appContainer.querySelector('#field-description').value;
      const photoUrl = appContainer.querySelector('#field-photo-preview')?.src;

      store.submitFieldIncident({
        incidentType,
        roadName,
        severity,
        gps: [lat, lng],
        description,
        photoUrl
      });

      sounds.playEmergencyAlert();
      sounds.speakDispatch(`Incident report received from Field Officer: ${incidentType} at ${roadName}.`);
      alert(`Incident submitted successfully! Synced to Control Room GIS map.`);
      renderFieldOfficerView(appContainer);
    });
  }, 50);
}
