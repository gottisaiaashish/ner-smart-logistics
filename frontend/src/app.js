/**
 * Main Application Router & Orchestrator
 */

import { store, USER_ROLES } from './state/store.js';
import { renderLoginView } from './views/login-view.js';
import { renderControlRoomView } from './views/control-room-view.js';
import { renderDriverView } from './views/driver-view.js';
import { renderFieldOfficerView } from './views/field-officer-view.js';
import { renderMissionLaunchView } from './views/mission-launch-view.js';

const appContainer = document.getElementById('app');

function renderApp() {
  if (!appContainer) return;
  const { currentUser } = store.state;

  if (!currentUser) {
    renderLoginView(appContainer);
    return;
  }

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

// Initial render
document.addEventListener('DOMContentLoaded', () => {
  renderApp();
  store.subscribe(() => {
    renderApp();
  });
});

// If DOM is already loaded
if (document.readyState === 'interactive' || document.readyState === 'complete') {
  renderApp();
  store.subscribe(() => {
    renderApp();
  });
}
