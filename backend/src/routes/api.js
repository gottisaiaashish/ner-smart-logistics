/**
 * REST API Routes with Checkpost Dispatch & Port Access
 */

import express from 'express';
import { systemState } from '../state/system-state.js';
import { socketManager } from '../socket/socket-manager.js';

export const apiRouter = express.Router();

// GET current system state snapshot
apiRouter.get('/state', (req, res) => {
  res.json({
    success: true,
    data: systemState.getState()
  });
});

// POST create checkpost vehicle dispatch & generate port code
apiRouter.post('/dispatch/create', (req, res) => {
  const result = systemState.createDispatch(req.body);
  socketManager.broadcastStateUpdate('DISPATCH_CREATED', result.state);
  res.json({ success: true, dispatch: result.dispatch, state: result.state });
});

// GET query dispatch by port code
apiRouter.get('/dispatch/lookup/:portCode', (req, res) => {
  const dispatch = systemState.getDispatchByPort(req.params.portCode);
  if (dispatch) {
    res.json({ success: true, dispatch });
  } else {
    res.status(404).json({ success: false, message: 'Invalid Port Code' });
  }
});

// POST environment variable update
apiRouter.post('/environment', (req, res) => {
  const { key, value } = req.body;
  if (!key) return res.status(400).json({ success: false, error: 'Missing key' });

  const updatedState = systemState.setEnvironmentParam(key, value);
  socketManager.broadcastStateUpdate('SET_ENVIRONMENT_PARAM', updatedState);
  res.json({ success: true, data: updatedState });
});

// POST apply scenario preset
apiRouter.post('/scenario/preset', (req, res) => {
  const { presetKey } = req.body;
  const updatedState = systemState.applyScenarioPreset(presetKey);
  socketManager.broadcastStateUpdate('APPLY_SCENARIO_PRESET', updatedState);
  res.json({ success: true, data: updatedState });
});

// POST launch hazard
apiRouter.post('/missions/hazard', (req, res) => {
  const updatedState = systemState.launchHazard(req.body);
  socketManager.broadcastStateUpdate('LAUNCH_HAZARD', updatedState);
  res.json({ success: true, data: updatedState });
});

// POST driver accept reroute
apiRouter.post('/reroute/accept', (req, res) => {
  const { vehicleId } = req.body;
  const updatedState = systemState.acceptReroute(vehicleId || 'TRUCK-07');
  socketManager.broadcastStateUpdate('ACCEPT_REROUTE', updatedState);
  res.json({ success: true, data: updatedState });
});

// POST PTT broadcast
apiRouter.post('/ptt/send', (req, res) => {
  const { sender, role, text } = req.body;
  const updatedState = systemState.sendPttMessage({ sender, role, text });
  socketManager.broadcastStateUpdate('SEND_PTT_MESSAGE', updatedState);
  res.json({ success: true, data: updatedState });
});
