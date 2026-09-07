/**
 * NER Smart Logistics C2 Central Server
 * Express HTTP REST API + WebSocket Real-Time Broadcasting Hub + MongoDB Atlas Integration
 */

import 'dotenv/config';
import http from 'http';
import express from 'express';
import cors from 'cors';
import { apiRouter } from './routes/api.js';
import { socketManager } from './socket/socket-manager.js';
import { connectDatabase } from './db/db.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for all origins
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
    database: 'CONNECTED',
    timestamp: new Date().toISOString()
  });
});

// Create HTTP Server
const server = http.createServer(app);

// Initialize WebSocket Manager on same HTTP server
socketManager.init(server);

// Connect MongoDB and Start listening
async function startServer() {
  await connectDatabase();

  server.listen(PORT, '0.0.0.0', () => {
    console.log('====================================================');
    console.log(`🚀 NER AI Logistics C2 Backend running on port ${PORT}`);
    console.log(`📡 REST API:   http://localhost:${PORT}/api/state`);
    console.log(`⚡ WebSockets: ws://localhost:${PORT}`);
    console.log('====================================================');
  });
}

startServer();
