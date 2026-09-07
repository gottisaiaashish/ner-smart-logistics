/**
 * Real-Time Frontend WebSocket Client Bridge
 * Synchronizes client state with the authoritative C2 Backend server
 */

class SocketClient {
  constructor() {
    this.ws = null;
    this.url = 'ws://localhost:5000';
    this.isConnected = false;
    this.reconnectTimer = null;
    this.onStateUpdateCallback = null;
  }

  connect(onStateUpdate) {
    if (onStateUpdate) {
      this.onStateUpdateCallback = onStateUpdate;
    }

    try {
      this.ws = new WebSocket(this.url);

      this.ws.onopen = () => {
        console.log('[SocketClient] 🟢 Connected to C2 Backend Server (ws://localhost:5000)');
        this.isConnected = true;
        if (this.reconnectTimer) {
          clearTimeout(this.reconnectTimer);
          this.reconnectTimer = null;
        }
      };

      this.ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          if (message.type === 'INIT_STATE' || message.type === 'STATE_UPDATE') {
            console.log(`[SocketClient] 📥 Received ${message.type} from server:`, message.action || 'full snapshot');
            if (this.onStateUpdateCallback && message.payload) {
              this.onStateUpdateCallback(message.payload);
            }
          }
        } catch (err) {
          console.error('[SocketClient] Failed to parse message:', err);
        }
      };

      this.ws.onclose = () => {
        this.isConnected = false;
        console.warn('[SocketClient] 🔴 Disconnected from backend. Retrying in 3s...');
        this.scheduleReconnect();
      };

      this.ws.onerror = (err) => {
        this.isConnected = false;
        console.warn('[SocketClient] Connection error (running in local fallback mode).');
        this.ws.close();
      };
    } catch (e) {
      this.isConnected = false;
      this.scheduleReconnect();
    }
  }

  scheduleReconnect() {
    if (!this.reconnectTimer) {
      this.reconnectTimer = setTimeout(() => {
        this.reconnectTimer = null;
        this.connect();
      }, 3000);
    }
  }

  send(action, payload) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ action, payload }));
      return true;
    }
    return false;
  }
}

export const socketClient = new SocketClient();
