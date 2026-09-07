/**
 * Enterprise Navigation Bar Component with Global System Health Status & Fast Portal Switcher
 * Production-grade typography-first interface with clean spacing and minimal indicators
 */

import { store, USER_ROLES, PRESET_CREDENTIALS } from '../state/store.js';
import { openEnvironmentControlModal } from './environment-control-modal.js';
import { openSimulationControllerModal } from './simulation-controller-bar.js';
import { openAlertModal } from './alert-modal.js';
import { openDeliveryModal } from './delivery-modal.js';
import { openAnalyticsModal } from './analytics-modal.js';
import { sounds } from '../audio/sound-effects.js';

export function renderNavbar(container, activeTab = 'dashboard') {
  const { currentUser, alerts, systemHealth, environment, activeScenarioPreset } = store.state;
  const activeAlertsCount = alerts.filter(a => a.status === 'ACTIVE').length;

  const isOffline = environment.networkConnectivity === 'OFFLINE_BLACKOUT';
  const isDegraded = environment.networkConnectivity === 'DEGRADED_MESH';

  container.innerHTML = `
    <header class="bg-command-900/95 backdrop-blur-xl border-b border-command-border px-5 py-2.5 flex items-center justify-between z-30 sticky top-0 shadow-lg select-none">
      
      <!-- Left: Branding & Role Portal Tabs -->
      <div class="flex items-center gap-6">
        
        <!-- Brand -->
        <div class="flex items-center gap-3 cursor-pointer" id="btn-brand-home">
          <div class="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-500/40 flex items-center justify-center font-mono font-bold text-xs text-cyan-400 relative">
            NER
            <span class="absolute -top-1 -right-1 w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
          </div>
          <div>
            <div class="flex items-center gap-2">
              <span class="font-display font-bold text-sm tracking-tight text-white uppercase">
                NER Smart Logistics
              </span>
              <span class="text-[9px] font-mono px-1.5 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-800/60 font-semibold">
                AI C2
              </span>
            </div>
            <p class="text-[10px] text-slate-400 font-mono tracking-wide hidden lg:block">
              Disaster-Resilient Logistics & Accessibility Intelligence
            </p>
          </div>
        </div>

        <!-- Current Authenticated Role Badge -->
        <div class="hidden md:flex items-center gap-2 px-3 py-1 rounded-lg bg-command-950 border border-command-border text-xs font-mono">
          <span class="w-2 h-2 rounded-full ${currentUser?.role === USER_ROLES.CONTROL_ROOM ? 'bg-cyan-400' : currentUser?.role === USER_ROLES.DRIVER ? 'bg-emerald-400' : currentUser?.role === USER_ROLES.FIELD_OFFICER ? 'bg-amber-400' : 'bg-purple-400'} animate-pulse"></span>
          <span class="text-slate-400 uppercase text-[10px]">Active Session:</span>
          <span class="text-white font-bold text-xs">${currentUser?.name || currentUser?.role?.replace('_', ' ')}</span>
        </div>

      </div>

      <!-- Center: Global System Status Bar -->
      <div class="hidden 2xl:flex items-center gap-4 px-4 py-1.5 rounded-lg bg-command-950 border border-command-border text-xs font-mono">
        <!-- Satellite -->
        <div class="flex items-center gap-2 text-[11px]">
          <span class="w-1.5 h-1.5 rounded-full ${isOffline ? 'bg-rose-500' : 'bg-emerald-400 animate-pulse'}"></span>
          <span class="text-slate-400">SAT</span>
          <span class="${isOffline ? 'text-rose-400 font-bold' : 'text-emerald-400 font-medium'}">${systemHealth.satellite}</span>
        </div>
        <span class="text-slate-700">|</span>

        <!-- Weather API -->
        <div class="flex items-center gap-2 text-[11px]">
          <span class="w-1.5 h-1.5 rounded-full ${isOffline ? 'bg-amber-500' : 'bg-emerald-400'}"></span>
          <span class="text-slate-400">WX</span>
          <span class="${isOffline ? 'text-amber-400' : 'text-emerald-400 font-medium'}">${systemHealth.weatherApi}</span>
        </div>
        <span class="text-slate-700">|</span>

        <!-- AI Engine -->
        <div class="flex items-center gap-2 text-[11px]">
          <span class="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse"></span>
          <span class="text-slate-400">AI RISK</span>
          <span class="text-purple-300 font-bold">${systemHealth.aiEngine}</span>
        </div>
        <span class="text-slate-700">|</span>

        <!-- GPS -->
        <div class="flex items-center gap-2 text-[11px]">
          <span class="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
          <span class="text-slate-400">GPS</span>
          <span class="text-cyan-300 font-medium">${systemHealth.gpsNetwork}</span>
        </div>
        <span class="text-slate-700">|</span>

        <!-- Clock -->
        <div class="text-slate-300 text-[11px] font-medium">
          <span id="live-ist-clock">--:--:-- IST</span>
        </div>
      </div>

      <!-- Right: Action Buttons & Controls -->
      <div class="flex items-center gap-2.5">
        


        ${currentUser?.role === USER_ROLES.CONTROL_ROOM ? `
          <!-- Logistics Dispatch -->
          <button id="btn-nav-deliveries" class="px-3 py-1.5 rounded-lg bg-command-800 hover:bg-command-750 border border-command-border text-slate-200 text-xs font-medium transition hidden md:inline-block">
            Dispatch
          </button>
          <!-- Analytics -->
          <button id="btn-nav-analytics" class="px-3 py-1.5 rounded-lg bg-command-800 hover:bg-command-750 border border-command-border text-slate-200 text-xs font-medium transition hidden md:inline-block">
            Analytics
          </button>
        ` : ''}

        <!-- Alert Notification Badge -->
        <button id="btn-nav-alerts" title="Emergency Alerts Center" class="px-3 py-1.5 rounded-lg bg-command-800 hover:bg-command-750 border border-command-border text-xs font-mono font-semibold text-slate-300 transition flex items-center gap-1.5">
          <span>Alerts</span>
          ${activeAlertsCount > 0 ? `
            <span class="w-5 h-5 bg-rose-500 text-[10px] font-bold text-white rounded-full inline-flex items-center justify-center animate-pulse">
              ${activeAlertsCount}
            </span>
          ` : `
            <span class="text-[10px] text-emerald-400">0</span>
          `}
        </button>

        <!-- Sound Effects Toggle -->
        <button id="btn-toggle-sound" title="Toggle Radio Audio" class="px-2.5 py-1.5 rounded-lg bg-command-800 hover:bg-command-750 border border-command-border text-xs font-mono ${sounds.muted ? 'text-slate-500' : 'text-cyan-400 font-semibold'} transition">
          ${sounds.muted ? 'Audio: OFF' : 'Audio: ON'}
        </button>

        <!-- User Logout / Switch -->
        <button id="btn-user-logout" title="Sign Out & Lock Terminal" class="px-3 py-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 border border-red-800/40 text-red-300 text-xs font-mono font-medium transition">
          Sign Out
        </button>
      </div>
    </header>
  `;

  // Start Live Clock
  const clockEl = container.querySelector('#live-ist-clock');
  if (clockEl) {
    const updateClock = () => {
      const now = new Date();
      clockEl.textContent = now.toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour12: false }) + ' IST';
    };
    updateClock();
    setInterval(updateClock, 1000);
  }

  // Sound Toggle
  container.querySelector('#btn-toggle-sound')?.addEventListener('click', () => {
    sounds.muted = !sounds.muted;
    renderNavbar(container, activeTab);
  });

  // Modals
  container.querySelector('#btn-open-scenario-ctrl')?.addEventListener('click', () => {
    openEnvironmentControlModal();
  });

  container.querySelector('#btn-open-sim-dock')?.addEventListener('click', () => {
    openSimulationControllerModal();
  });

  container.querySelector('#btn-nav-deliveries')?.addEventListener('click', () => {
    openDeliveryModal();
  });

  container.querySelector('#btn-nav-analytics')?.addEventListener('click', () => {
    openAnalyticsModal();
  });

  container.querySelector('#btn-nav-alerts')?.addEventListener('click', () => {
    openAlertModal();
  });

  container.querySelector('#btn-user-logout')?.addEventListener('click', () => {
    store.logout();
  });
}
