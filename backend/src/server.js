/**
 * NER Smart Logistics C2 Central Server
 * Express HTTP REST API + WebSocket Real-Time Broadcasting Hub
 */

import http from 'http';
import express from 'express';
import cors from 'cors';
import { apiRouter } from './routes/api.js';
import { socketManager } from './socket/socket-manager.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend Vite development
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

app.use(express.json());

// Mount API routes
app.use('/api', apiRouter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    service: 'NER Smart Logistics AI C2 Server',
    timestamp: new Date().toISOString()
  });
});

// Create HTTP Server
const server = http.createServer(app);

// Initialize WebSocket Manager on same HTTP server
socketManager.init(server);

// Start listening
server.listen(PORT, () => {
  console.log('====================================================');
  console.log(`🚀 NER AI Logistics C2 Backend running on port ${PORT}`);
  console.log(`📡 REST API:   http://localhost:${PORT}/api/state`);
  console.log(`⚡ WebSockets: ws://localhost:${PORT}`);
  console.log('====================================================');
});
