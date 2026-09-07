/**
 * Interactive Emergency Scenario Simulation Engine
 * Executes end-to-end hackathon demo flow:
 * Normal Transit -> Rain Surge -> Sonapur Landslide -> AI Risk Surge (84%) -> Route B Evaluation -> Driver Alert & PTT -> Driver Acceptance -> Safe Delivery Preserved
 */

import { store } from '../state/store.js';
import { sounds } from '../audio/sound-effects.js';

class SimulationEngine {
  constructor() {
    this.timer = null;
    this.currentStep = 0;
  }

  startEmergencyDemo() {
    if (this.timer) {
      clearInterval(this.timer);
    }

    this.currentStep = 0;
    store.state.simulation.isRunning = true;
    store.state.simulation.step = 0;
    store.state.simulation.truck07Rerouted = false;
    store.state.simulation.truck07AcceptedReroute = false;

    // Reset TRUCK-07 to initial normal state on Route A
    const truck07 = store.state.vehicles.find(v => v.id === 'TRUCK-07');
    if (truck07) {
      truck07.riskLevel = 'LOW';
      truck07.status = 'IN_TRANSIT';
      truck07.assignedRoute = 'ROUTE_A';
      truck07.activeCorridorId = 'corridor-route-a';
      truck07.currentLocationName = 'NH-6 near Nongpoh-Shillong descent';
      truck07.coordinates = [25.8200, 91.8900];
      truck07.speed = 48;
      truck07.eta = '4h 15m';
    }

    // Step 1: Initial Normal Transit
    store.applyScenarioPreset('NORMAL');
    this.runStep1();

    // Step 2 in 4.0s: Heavy Rain Squall Surges
    setTimeout(() => this.runStep2(), 4000);

    // Step 3 in 8.0s: Sonapur Mudslide Ingress Triggered
    setTimeout(() => this.runStep3(), 8000);

    // Step 4 in 12.0s: AI Evaluates Route B & Push-to-Talk Voice Dispatch
    setTimeout(() => this.runStep4(), 12000);

    // Step 5 in 15.5s: Driver Accepts & Diverts to Route B
    setTimeout(() => this.runStep5(), 15500);
  }

  runStep1() {
    this.currentStep = 1;
    store.state.simulation.step = 1;
    store.addTimelineEvent({
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      title: 'DEMO STAGE 1: NORMAL TRANSIT',
      desc: 'TRUCK-07 carrying Essential Vaccines moving along NH-6. Route A risk: 18% (NOMINAL).',
      type: 'info'
    });
    sounds.playSuccess();
    store.notify();
  }

  runStep2() {
    this.currentStep = 2;
    store.state.simulation.step = 2;
    store.applyScenarioPreset('HEAVY_MONSOON');

    const truck07 = store.state.vehicles.find(v => v.id === 'TRUCK-07');
    if (truck07) {
      truck07.riskLevel = 'MEDIUM';
      truck07.speed = 36;
      truck07.coordinates = [25.5788, 91.8933]; // Reached Shillong
    }

    store.addTimelineEvent({
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      title: 'DEMO STAGE 2: MONSOON RAIN SURGE',
      desc: 'Rain sensor spike to 48.6 mm/hr. NH-6 friction reduced by 40%. AI risk increased to 58%.',
      type: 'weather'
    });

    sounds.playEmergencyAlert();
    store.notify();
  }

  runStep3() {
    this.currentStep = 3;
    store.state.simulation.step = 3;
    store.applyScenarioPreset('LANDSLIDE');

    const truck07 = store.state.vehicles.find(v => v.id === 'TRUCK-07');
    if (truck07) {
      truck07.riskLevel = 'CRITICAL';
      truck07.speed = 18;
      truck07.coordinates = [25.3200, 92.2800]; // Approaching Jowai / Khliehriat
    }

    store.addTimelineEvent({
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      title: 'DEMO STAGE 3: SONAPUR LANDSLIDE DETECTED',
      desc: 'Major boulder & mud collapse on NH-6 Km 142. Route A accessibility degraded to 16% (84% Risk).',
      type: 'danger'
    });

    sounds.playEmergencyAlert();
    store.notify();
  }

  runStep4() {
    this.currentStep = 4;
    store.state.simulation.step = 4;

    // AI Dispatches Push to talk
    const dispatchText = 'Control Room Command to TRUCK-07: NH-6 Sonapur is completely blocked. AI Safe Route B via Umrangso bypass is authorized. Divert immediately.';
    store.sendPushToTalkMessage({
      sender: 'Control Room Command',
      text: dispatchText
    });

    store.addTimelineEvent({
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      title: 'DEMO STAGE 4: AI ROUTE B ADVISORY DISPATCHED',
      desc: 'Route B evaluated as safest alternative (22% risk). Driver Cockpit notified for diversion.',
      type: 'ai'
    });

    sounds.playEmergencyAlert();
    setTimeout(() => {
      sounds.speakDispatch('Attention TRUCK-07. Road block on NH-6. Divert to Alternate Route B.');
    }, 400);

    store.notify();
  }

  runStep5() {
    this.currentStep = 5;
    store.state.simulation.step = 5;
    store.acceptReroute('TRUCK-07');

    store.addTimelineEvent({
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      title: 'DEMO STAGE 5: CRITICAL DELIVERY PRESERVED',
      desc: 'TRUCK-07 successfully navigated onto Route B via Umrangso. Disruption bypassed.',
      type: 'success'
    });

    sounds.playSuccess();
    setTimeout(() => {
      sounds.speakDispatch('TRUCK-07 reroute confirmed. Delivery on schedule.');
    }, 500);

    store.notify();
  }
}

export const simEngine = new SimulationEngine();

