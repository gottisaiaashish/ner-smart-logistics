/**
 * Real-Time Frontend WebSocket Client Bridge
 * Auto-detects local development vs Render Cloud production backend
 */

class SocketClient {
  constructor() {
    this.ws = null;
    this.url = this.resolveBackendUrl();
    this.isConnected = false;
    this.reconnectTimer = null;
    this.onStateUpdateCallback = null;
  }

  resolveBackendUrl() {
    // Check localStorage or URL query param override
    const params = new URLSearchParams(window.location.search);
    const customUrl = params.get('backend') || localStorage.getItem('NER_BACKEND_URL');
    if (customUrl) return customUrl;

    // Localhost dev server
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return 'ws://localhost:5000';
    }

    // Render Cloud Production Server
    return 'wss://ner-smart-logistics-4mre.onrender.com';
  }

  connect(onStateUpdate) {
    if (onStateUpdate) {
      this.onStateUpdateCallback = onStateUpdate;
    }

    try {
      this.url = this.resolveBackendUrl();
      this.ws = new WebSocket(this.url);

      this.ws.onopen = () => {
        console.log(`[SocketClient] 🟢 Connected to C2 Backend Server (${this.url})`);
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
        console.warn(`[SocketClient] 🔴 Disconnected from ${this.url}. Retrying in 3s...`);
        this.scheduleReconnect();
      };

      this.ws.onerror = (err) => {
        this.isConnected = false;
        console.warn('[SocketClient] Connection error (running in fallback mode).');
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
