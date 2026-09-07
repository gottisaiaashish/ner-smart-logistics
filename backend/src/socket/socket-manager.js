/**
 * Real-Time WebSocket Manager
 * Maintains connection pool across all active portals and broadcasts state mutations
 */

import { WebSocketServer } from 'ws';
import { systemState } from '../state/system-state.js';

class SocketManager {
  constructor() {
    this.wss = null;
    this.clients = new Set();
  }

  init(server) {
    this.wss = new WebSocketServer({ server });

    this.wss.on('connection', (ws, req) => {
      this.clients.add(ws);
      console.log(`[WebSocket] Client connected. Active sessions: ${this.clients.size}`);

      // Send initial full state snapshot
      ws.send(JSON.stringify({
        type: 'INIT_STATE',
        payload: systemState.getState()
      }));

      // Handle inbound messages
      ws.on('message', (message) => {
        try {
          const data = JSON.parse(message);
          this.handleInboundAction(data, ws);
        } catch (err) {
          console.error('[WebSocket] Error parsing inbound message:', err);
        }
      });

      ws.on('close', () => {
        this.clients.delete(ws);
      });

      ws.on('error', (err) => {
        console.error('[WebSocket] Client error:', err);
        this.clients.delete(ws);
      });
    });
  }

  handleInboundAction(data, senderWs) {
    const { action, payload } = data;
    console.log(`[WebSocket] Action received: ${action}`, payload);

    let updatedState = null;

    switch (action) {
      case 'CREATE_DISPATCH': {
        const res = systemState.createDispatch(payload);
        updatedState = res.state;
        break;
      }
      case 'SET_ENVIRONMENT_PARAM':
        updatedState = systemState.setEnvironmentParam(payload.key, payload.value);
        break;
      case 'APPLY_SCENARIO_PRESET':
        updatedState = systemState.applyScenarioPreset(payload.presetKey);
        break;
      case 'SET_TARGETED_PIN':
        updatedState = systemState.setTargetedPin(payload.lat, payload.lng, payload.label, payload.sector);
        break;
      case 'LAUNCH_HAZARD':
        updatedState = systemState.launchHazard(payload);
        break;
      case 'SEND_PTT_MESSAGE':
        updatedState = systemState.sendPttMessage(payload);
        break;
      case 'ACCEPT_REROUTE':
        updatedState = systemState.acceptReroute(payload.vehicleId);
        break;
      case 'ADVANCE_VEHICLE':
        updatedState = systemState.advanceVehicle(payload.vehicleId);
        break;
      case 'REVERSE_VEHICLE':
        updatedState = systemState.reverseVehicle(payload.vehicleId);
        break;
      case 'DELETE_VEHICLE':
        updatedState = systemState.deleteVehicle(payload.vehicleId);
        break;
      default:
        console.warn(`[WebSocket] Unhandled action: ${action}`);
        break;
    }

    if (updatedState) {
      this.broadcastStateUpdate(action, updatedState);
    }
  }

  broadcastStateUpdate(action, state) {
    const msg = JSON.stringify({
      type: 'STATE_UPDATE',
      action,
      payload: state,
      timestamp: Date.now()
    });

    for (const client of this.clients) {
      if (client.readyState === 1) { // WebSocket.OPEN
        client.send(msg);
      }
    }
  }
}

export const socketManager = new SocketManager();
