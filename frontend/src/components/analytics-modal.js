/**
 * Operational Analytics & Emergency Logistics Intelligence Modal (Chart.js)
 */

export function openAnalyticsModal() {
  const container = document.getElementById('modal-container');
  if (!container) return;

  container.innerHTML = `
    <div class="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div class="hud-panel rounded-2xl max-w-5xl w-full border border-command-border bg-command-950 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 divide-y divide-command-border">
        
        <!-- Header -->
        <div class="bg-command-900 p-5 sm:p-6 flex items-center justify-between">
          <div>
            <div class="flex items-center gap-3">
              <h3 class="text-base font-display font-bold text-white uppercase tracking-wider">
                Logistics Accessibility & Intelligence Analytics
              </h3>
              <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800 font-semibold">
                ANALYTICS ENGINE
              </span>
            </div>
            <p class="text-xs text-slate-400 font-mono mt-1">
              Historical corridor disruption trends, reroute efficacy, and cold-chain compliance
            </p>
          </div>
          <button id="btn-close-analytics-modal" class="px-3 py-1.5 rounded-lg bg-command-800 hover:bg-command-700 text-slate-300 text-xs font-mono font-medium transition border border-command-border">
            Close
          </button>
        </div>

        <!-- Body -->
        <div class="p-5 sm:p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          
          <!-- Top Analytics Stats -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            <div class="bg-command-850 p-4 rounded-xl border border-command-border">
              <span class="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Delivery Success</span>
              <div class="text-2xl font-bold font-mono text-emerald-400 mt-1">98.4%</div>
              <span class="text-[11px] text-emerald-500 font-mono">↑ 4.2% with AI Reroutes</span>
            </div>
            <div class="bg-command-850 p-4 rounded-xl border border-command-border">
              <span class="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Avg Delay</span>
              <div class="text-2xl font-bold font-mono text-cyan-400 mt-1">34 <span class="text-sm font-normal text-slate-400">min</span></div>
              <span class="text-[11px] text-slate-400 font-mono">vs 4.5h without bypass</span>
            </div>
            <div class="bg-command-850 p-4 rounded-xl border border-command-border">
              <span class="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Model Accuracy</span>
              <div class="text-2xl font-bold font-mono text-purple-400 mt-1">94.8%</div>
              <span class="text-[11px] text-purple-300 font-mono">Lead Warning: 24m</span>
            </div>
            <div class="bg-command-850 p-4 rounded-xl border border-command-border">
              <span class="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Cold-Chain Compliance</span>
              <div class="text-2xl font-bold font-mono text-amber-400 mt-1">100%</div>
              <span class="text-[11px] text-slate-400 font-mono">0 Vials spoiled in transit</span>
            </div>
          </div>

          <!-- Charts Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Chart 1: Corridor Disruption Incidents -->
            <div class="bg-command-850 p-4 rounded-xl border border-command-border">
              <h4 class="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider mb-3">
                Monthly Disruption Events by Corridor
              </h4>
              <div class="h-60">
                <canvas id="chart-corridors"></canvas>
              </div>
            </div>

            <!-- Chart 2: Rainfall vs Accessibility Degradation -->
            <div class="bg-command-850 p-4 rounded-xl border border-command-border">
              <h4 class="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider mb-3">
                Precipitation (mm/h) vs Corridor Road Risk (%)
              </h4>
              <div class="h-60">
                <canvas id="chart-weather-risk"></canvas>
              </div>
            </div>
          </div>

        </div>

        <!-- Footer -->
        <div class="bg-command-900 p-4 px-6 flex items-center justify-end">
          <button id="btn-close-analytics-footer" class="px-5 py-2 rounded-xl bg-command-800 hover:bg-command-700 text-white text-xs font-mono font-medium transition border border-command-border">
            Close Analytics
          </button>
        </div>

      </div>
    </div>
  `;

  const closeModal = () => { container.innerHTML = ''; };
  container.querySelector('#btn-close-analytics-modal')?.addEventListener('click', closeModal);
  container.querySelector('#btn-close-analytics-footer')?.addEventListener('click', closeModal);

  // Initialize Chart.js
  if (window.Chart) {
    // Chart 1
    const ctx1 = document.getElementById('chart-corridors')?.getContext('2d');
    if (ctx1) {
      new Chart(ctx1, {
        type: 'bar',
        data: {
          labels: ['NH-6 Meghalaya', 'NH-27 Lumding', 'NH-102 Manipur', 'NH-13 Sela Pass', 'NH-51 Tura'],
          datasets: [{
            label: 'Landslides & Floods',
            data: [42, 18, 12, 38, 15],
            backgroundColor: ['#f43f5e', '#f59e0b', '#0ea5e9', '#8b5cf6', '#10b981'],
            borderRadius: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { ticks: { color: '#94a3b8', font: { size: 10 } }, grid: { color: '#1b2742' } },
            y: { ticks: { color: '#94a3b8', font: { size: 10 } }, grid: { color: '#1b2742' } }
          }
        }
      });
    }

    // Chart 2
    const ctx2 = document.getElementById('chart-weather-risk')?.getContext('2d');
    if (ctx2) {
      new Chart(ctx2, {
        type: 'line',
        data: {
          labels: ['10mm/h', '20mm/h', '30mm/h', '40mm/h', '50mm/h', '60mm/h'],
          datasets: [
            {
              label: 'NH-6 Risk %',
              data: [18, 32, 54, 78, 92, 98],
              borderColor: '#f43f5e',
              backgroundColor: 'rgba(244, 63, 94, 0.1)',
              fill: true,
              tension: 0.4
            },
            {
              label: 'Route B Bypass Risk %',
              data: [10, 14, 18, 24, 32, 38],
              borderColor: '#10b981',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              fill: true,
              tension: 0.4
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { labels: { color: '#94a3b8', font: { size: 10 } } } },
          scales: {
            x: { ticks: { color: '#94a3b8', font: { size: 10 } }, grid: { color: '#1b2742' } },
            y: { ticks: { color: '#94a3b8', font: { size: 10 } }, grid: { color: '#1b2742' } }
          }
        }
      });
    }
  }
}
