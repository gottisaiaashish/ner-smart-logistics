# 🚚 NER Smart Logistics (LogiSafe AI C2)

> **Disaster-Resilient AI Logistics Command & Control (C2) System for Northeast India**  
> Engineered for extreme terrain, monsoon floods, and high-vulnerability mountain corridors with real-time predictive AI risk engine, checkpost vehicle dispatch with Port Codes, in-cab driver cockpit HUD, and live multi-portal emergency rerouting.

---

## 🌟 Key Features

- 🛰️ **Control Room GIS Command Center**: Centralized situation briefing, real-time vehicle fleet telemetry, multiple route evaluations (Route A vs Route B), and digital push-to-talk (PTT) radio dispatch.
- 🏷️ **Checkpost Vehicle Dispatch & Port Key Generator**: Register departing convoys from checkpost origins (Guwahati / Khanapara) and automatically generate unique driver **Port Access Codes** (e.g. `PORT-7890`).
- 🚛 **In-Cab Driver Cockpit HUD**: Turn-by-turn navigation HUD accessible directly via Driver Port Code, complete with cold-chain sensor monitoring (-20°C vaccines), audible voice warnings, and 1-click Route B diversion acceptance.
- 🎯 **Tactical Point & Launch Simulator**: Point anywhere on the interactive map to drop real-time disasters (Landslides, Flash Floods, Cloudbursts, Bridge Failures), dispatch emergency relief convoys, launch cargo lifeline drones, or deploy IoT telemetry stations.
- ⚡ **Real-Time WebSocket Sync Backend**: Node.js + Express + WebSockets backend broadcasting causality state updates across all connected operator and driver screens with $<5\text{ms}$ latency.

---

## 🏗️ System Architecture

```
                               ┌────────────────────────┐
                               │   C2 Central Backend   │
                               │ Express + WebSockets   │
                               │   (Port 5000)          │
                               └───────────┬────────────┘
                                           │
                    ┌──────────────────────┼──────────────────────┐
                    │                      │                      │
                    ▼                      ▼                      ▼
           ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
           │  Control Room   │    │   Driver HUD    │    │ Point & Launch  │
           │   (Guwahati)    │    │  (PORT-7890)    │    │ (Commander)     │
           └─────────────────┘    └─────────────────┘    └─────────────────┘
```

---

## 🚀 Quick Start Guide

### 1. Start the Backend Server
```bash
cd backend
npm install
npm start
```
*Backend runs on `http://localhost:5000` (REST API) & `ws://localhost:5000` (WebSockets).*

### 2. Start the Frontend Development Server
```bash
cd frontend
npm install
npm run dev
```
*Frontend runs on `http://localhost:5174/`.*

---

## 🔄 Live Presentation Flow

1. **Step 1 (Checkpost Dispatch)**: Open **Control Room** $\to$ Click `+ Dispatch Checkpost Vehicle` $\to$ Enter details $\to$ Receive generated `PORT-7890`.
2. **Step 2 (Driver Access)**: Open a second tab $\to$ Enter `PORT-7890` in Driver Port Code Access $\to$ Launches Driver Cockpit moving on Route A.
3. **Step 3 (Point & Launch Trigger)**: Open **Point & Launch** $\to$ Click on Sonapur on the map $\to$ Launch Landslide / Rain.
4. **Step 4 (Live Reroute Acceptance)**: Driver HUD triggers emergency siren & Route B Reroute Advisory $\to$ Click `ACCEPT REROUTE` $\to$ Path pivots safely to Umrangso bypass in real time!

---

## 🛠️ Tech Stack
- **Frontend**: Vanilla JavaScript (ES Modules), Tailwind CSS, Leaflet.js GIS Mapping, Web Audio API + SpeechSynthesis PTT Dispatch.
- **Backend**: Node.js, Express, `ws` (WebSockets), CORS.
