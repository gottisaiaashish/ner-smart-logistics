/**
 * Main Application Router & Multi-Portal URL Orchestrator
 * Supports dedicated direct URLs:
 * /control-room   or  #/control-room   -> Control Room Portal
 * /driver         or  #/driver         -> Driver Cockpit HUD
 * /point-launch   or  #/point-launch   -> Point & Launch Simulator Portal
 * /field-officer  or  #/field-officer  -> Field Officer Portal
 * /login          or  #/login          -> Gateway Login Page
 */

import { store, USER_ROLES, PRESET_CREDENTIALS } from './state/store.js';
import { renderLoginView } from './views/login-view.js';
import { renderControlRoomView } from './views/control-room-view.js';
import { renderDriverView } from './views/driver-view.js';
import { renderFieldOfficerView } from './views/field-officer-view.js';
import { renderMissionLaunchView } from './views/mission-launch-view.js';

const appContainer = document.getElementById('app');

export function getActiveRoute() {
  const path = window.location.pathname.toLowerCase().replace(/^\/+|\/+$/g, '');
  const hash = window.location.hash.toLowerCase().replace(/^[#/]+|[#/]+$/g, '');
  const target = path || hash;

  if (target.includes('control')) return 'control-room';
  if (target.includes('driver')) return 'driver';
  if (target.includes('point') || target.includes('launch') || target.includes('sim')) return 'point-launch';
  if (target.includes('field')) return 'field-officer';
  if (target.includes('login')) return 'login';

  return 'home';
}

export function navigateTo(route) {
  const cleanPath = route.startsWith('/') ? route : `/${route}`;
  const targetUrl = cleanPath === '/home' ? '/' : cleanPath;
  if (window.location.pathname !== targetUrl) {
    window.history.pushState(null, '', targetUrl);
  }
  renderApp();
}

export function renderApp() {
  if (!appContainer) return;
  const activeRoute = getActiveRoute();
  const { currentUser } = store.state;

  // Auto-authenticate role if accessing direct portal URL
  if (activeRoute === 'control-room') {
    if (!currentUser || currentUser.role !== USER_ROLES.CONTROL_ROOM) {
      store.state.currentUser = { ...PRESET_CREDENTIALS[0] };
    }
    renderControlRoomView(appContainer);
    return;
  }

  if (activeRoute === 'driver') {
    if (!currentUser || currentUser.role !== USER_ROLES.DRIVER) {
      store.state.currentUser = { ...PRESET_CREDENTIALS[1] };
    }
    renderDriverView(appContainer);
    return;
  }

  if (activeRoute === 'point-launch') {
    if (!currentUser || currentUser.role !== USER_ROLES.MISSION_LAUNCH) {
      store.state.currentUser = { ...PRESET_CREDENTIALS[3] };
    }
    renderMissionLaunchView(appContainer);
    return;
  }

  if (activeRoute === 'field-officer') {
    if (!currentUser || currentUser.role !== USER_ROLES.FIELD_OFFICER) {
      store.state.currentUser = { ...PRESET_CREDENTIALS[2] };
    }
    renderFieldOfficerView(appContainer);
    return;
  }

  // Home / Login page
  if (!currentUser || activeRoute === 'login' || activeRoute === 'home') {
    renderLoginView(appContainer);
  } else {
    // If logged in, route according to role
    switch (currentUser.role) {
      case USER_ROLES.CONTROL_ROOM:
        renderControlRoomView(appContainer);
        break;
      case USER_ROLES.DRIVER:
        renderDriverView(appContainer);
        break;
      case USER_ROLES.FIELD_OFFICER:
        renderFieldOfficerView(appContainer);
        break;
      case USER_ROLES.MISSION_LAUNCH:
        renderMissionLaunchView(appContainer);
        break;
      default:
        renderLoginView(appContainer);
        break;
    }
  }
}

// Handle browser URL navigation events (back/forward, hash changes)
window.addEventListener('hashchange', renderApp);
window.addEventListener('popstate', renderApp);

let isAppInitialized = false;
function initApp() {
  if (isAppInitialized) return;
  isAppInitialized = true;
  renderApp();
  store.subscribe(() => {
    renderApp();
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
