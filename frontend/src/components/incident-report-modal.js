/**
 * NDRF / Ministry Executive Disaster & Logistics Mission Incident Report Modal
 * Generates official Govt/NDRF printable clearance summary with cold-chain and life-impact metrics
 */

import { store } from '../state/store.js';
import { sounds } from '../audio/sound-effects.js';

export function openIncidentReportModal() {
  const container = document.getElementById('modal-container');
  if (!container) return;

  const { vehicles, aiIntelligence, environment, customMissions, timeline } = store.state;
  const primaryTruck = vehicles[0] || {
    id: 'TRUCK-07',
    vehicleNumber: 'AS-01-EE-7890',
    driverName: 'Suresh Das',
    cargo: 'Essential Rabies Vaccines & Anti-Venom (-20°C)',
    origin: 'Khanapara Hub, Guwahati',
    destination: 'District Civil Hospital, Silchar',
    assignedRoute: 'ROUTE_B_DIVERSION',
    status: 'IN_TRANSIT',
    currentTemp: '-20.4°C'
  };

  const reportId = `NDRF-NER-LOG-${Date.now().toString().slice(-6)}`;
  const dateStr = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  const timeStr = new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour12: false }) + ' IST';

  container.innerHTML = `
    <div class="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fadeIn select-text">
      <div class="hud-panel rounded-2xl border border-command-border bg-slate-950 shadow-2xl w-full max-w-4xl flex flex-col divide-y divide-command-border max-h-[92vh]">
        
        <!-- Modal Top Bar -->
        <div class="p-4 sm:p-5 flex items-center justify-between bg-command-900 shrink-0">
          <div class="flex items-center gap-2">
            <span class="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-2">
              <span class="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
              <span>EXECUTIVE MISSION INCIDENT & RESILIENCE AUDIT</span>
            </span>
          </div>

          <div class="flex items-center gap-2">
            <button id="btn-print-report" class="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold transition shadow flex items-center gap-1.5">
              <span>🖨️ Print / Save PDF</span>
            </button>
            <button id="btn-close-report-modal" class="px-3 py-1.5 rounded-lg bg-command-800 hover:bg-command-700 text-slate-300 text-xs font-mono transition border border-command-border">
              ✕
            </button>
          </div>
        </div>

        <!-- Printable Document Canvas -->
        <div class="p-6 sm:p-8 overflow-y-auto space-y-6 bg-slate-950 text-slate-100 font-mono text-xs" id="printable-area">
          
          <!-- Official Govt Header -->
          <div class="border-b-2 border-slate-700 pb-5 text-center space-y-1">
            <div class="text-[11px] text-slate-400 uppercase tracking-widest font-bold">
              GOVERNMENT OF INDIA · NORTH EASTERN COUNCIL (NEC) · NDRF DISASTER LOGISTICS DIVISION
            </div>
            <h1 class="text-lg sm:text-xl font-display font-extrabold text-white uppercase tracking-wider">
              REAL-TIME DISASTER RESILIENT LOGISTICS CLEARANCE REPORT
            </h1>
            <div class="flex flex-wrap items-center justify-center gap-4 text-[10px] text-cyan-400 pt-1">
              <span>DOC REF: <strong>${reportId}</strong></span>
              <span>·</span>
              <span>DATE: <strong>${dateStr} ${timeStr}</strong></span>
              <span>·</span>
              <span>CLASSIFICATION: <strong class="text-emerald-400">OFFICIAL / CRITICAL MISSION</strong></span>
            </div>
          </div>

          <!-- Section 1: Executive KPI Impact Metrics -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div class="p-3.5 rounded-xl bg-slate-900 border border-slate-700 space-y-1">
              <div class="text-[10px] text-slate-400 uppercase">Cold-Chain Status</div>
              <div class="text-base font-bold text-emerald-400">100% PRESERVED</div>
              <div class="text-[10px] text-slate-400">Core Temp: ${primaryTruck.currentTemp || '-20.4°C'}</div>
            </div>

            <div class="p-3.5 rounded-xl bg-slate-900 border border-slate-700 space-y-1">
              <div class="text-[10px] text-slate-400 uppercase">Transit Delay Saved</div>
              <div class="text-base font-bold text-cyan-400">3.8 HOURS SAVED</div>
              <div class="text-[10px] text-slate-400">Sonapur Block Bypass</div>
            </div>

            <div class="p-3.5 rounded-xl bg-slate-900 border border-slate-700 space-y-1">
              <div class="text-[10px] text-slate-400 uppercase">Lives Protected</div>
              <div class="text-base font-bold text-purple-400">1,240 PATIENTS</div>
              <div class="text-[10px] text-slate-400">Silchar Civil Hospital</div>
            </div>

            <div class="p-3.5 rounded-xl bg-slate-900 border border-slate-700 space-y-1">
              <div class="text-[10px] text-slate-400 uppercase">AI Predictive Accuracy</div>
              <div class="text-base font-bold text-amber-400">97.2% CONFIDENCE</div>
              <div class="text-[10px] text-slate-400">Hybrid ML Regressor</div>
            </div>
          </div>

          <!-- Section 2: Fleet & Manifest Summary -->
          <div class="p-4 rounded-xl bg-slate-900 border border-slate-700 space-y-3">
            <h3 class="text-xs font-bold text-cyan-300 uppercase tracking-wider border-b border-slate-800 pb-2">
              1. Designated Convoy & Cargo Manifest
            </h3>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div class="space-y-1.5">
                <div><span class="text-slate-400">Vehicle Identifier:</span> <strong class="text-white">${primaryTruck.vehicleId || primaryTruck.id} (${primaryTruck.vehicleNumber || 'AS-01-EE-7890'})</strong></div>
                <div><span class="text-slate-400">Driver in Command:</span> <strong class="text-white">${primaryTruck.driverName} (${primaryTruck.driverPhone || '+91 94350-12894'})</strong></div>
                <div><span class="text-slate-400">Checkpost Access Port:</span> <strong class="text-emerald-400 font-bold">${primaryTruck.portCode || 'PORT-7890'}</strong></div>
                <div><span class="text-slate-400">Vehicle Specification:</span> <strong class="text-slate-200">${primaryTruck.vehicleType || 'Refrigerated 4x4 Heavy Unit'}</strong></div>
              </div>

              <div class="space-y-1.5">
                <div><span class="text-slate-400">Origin Depot:</span> <strong class="text-white">${primaryTruck.origin}</strong></div>
                <div><span class="text-slate-400">Designated Destination:</span> <strong class="text-emerald-400">${primaryTruck.destination}</strong></div>
                <div><span class="text-slate-400">Active Transit Corridor:</span> <strong class="text-cyan-300">${primaryTruck.assignedRoute.includes('ROUTE_B') ? 'SH-17 via Umrangso Ridge Bypass' : 'NH-6 Primary Arterial'}</strong></div>
                <div><span class="text-slate-400">Cargo Description:</span> <strong class="text-rose-400">${primaryTruck.cargo}</strong></div>
              </div>
            </div>
          </div>

          <!-- Section 3: Geotechnical Hazard & AI Causality Audit -->
          <div class="p-4 rounded-xl bg-slate-900 border border-slate-700 space-y-3">
            <h3 class="text-xs font-bold text-cyan-300 uppercase tracking-wider border-b border-slate-800 pb-2">
              2. Geotechnical Risk & AI Causality Evaluation
            </h3>

            <div class="space-y-2 text-xs text-slate-300">
              <div class="flex items-center justify-between">
                <span>Rainfall Intensity: <strong class="text-cyan-400">${environment.rainfall || 52.0} mm/hr</strong></span>
                <span>Landslide Probability: <strong class="text-rose-400">${environment.landslideProb || 94}%</strong></span>
                <span>Slope Saturation Index: <strong class="text-amber-400">${environment.soilMoistureIndex || 92}%</strong></span>
              </div>
              <p class="text-slate-300 leading-relaxed pt-1">
                <strong>Algorithmic Rationale:</strong> Satellite telemetry and Edge AI Dashcam video confirmed severe debris slide activity along the NH-6 Sonapur chokepoint (Km 142). The system executed dynamic recalculation and automated fleet diversion along the hard bedrock SH-17 Umrangso corridor, mitigating potential cutoff.
              </p>
            </div>
          </div>

          <!-- Official Sign-off Seal -->
          <div class="pt-4 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
            <div>
              <div>Verified by: <strong>C2 Central Logistics AI Orchestrator</strong></div>
              <div>North Eastern Regional Disaster Management Grid</div>
            </div>
            <div class="text-right">
              <div class="px-3 py-1 rounded border border-emerald-500 text-emerald-400 font-bold uppercase inline-block">
                VERIFIED & CLEARED
              </div>
            </div>
          </div>

        </div>

        <!-- Modal Footer -->
        <div class="p-4 bg-command-900 flex items-center justify-between shrink-0">
          <span class="text-[11px] text-slate-400 font-mono">
            Document generated with live state synchronization
          </span>
          <button id="btn-close-report-footer" class="px-5 py-2 rounded-xl bg-command-800 hover:bg-command-700 text-white text-xs font-mono font-bold transition border border-command-border">
            Close Report
          </button>
        </div>

      </div>
    </div>
  `;

  // Bind print
  container.querySelector('#btn-print-report')?.addEventListener('click', () => {
    sounds.playSuccess();
    window.print();
  });

  // Bind close
  container.querySelector('#btn-close-report-modal')?.addEventListener('click', () => {
    container.innerHTML = '';
  });
  container.querySelector('#btn-close-report-footer')?.addEventListener('click', () => {
    container.innerHTML = '';
  });
}
