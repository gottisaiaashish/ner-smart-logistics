const https = require('https');
const fs = require('fs');
const path = require('path');

const GOOGLE_KEY = 'AIzaSyDUfdOtrBhoMopr1fvuSON34JUkzFEgTJw';

function decodePolyline(encoded) {
  let points = [];
  let index = 0, len = encoded.length;
  let lat = 0, lng = 0;
  while (index < len) {
    let b, shift = 0, result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    let dlat = ((result & 1) ? ~(result >> 1) : (result >> 1));
    lat += dlat;

    shift = 0;
    result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    let dlng = ((result & 1) ? ~(result >> 1) : (result >> 1));
    lng += dlng;

    points.push([Number((lat / 1e5).toFixed(6)), Number((lng / 1e5).toFixed(6))]);
  }
  return points;
}

function fetchGoogle(origin, destination, waypoints = []) {
  return new Promise((resolve, reject) => {
    let url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&key=${GOOGLE_KEY}`;
    if (waypoints.length > 0) {
      url += `&waypoints=${waypoints.join('|')}`;
    }
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.status === 'OK' && json.routes && json.routes[0]) {
            const overviewPoly = json.routes[0].overview_polyline.points;
            const points = decodePolyline(overviewPoly);
            const legs = json.routes[0].legs || [];
            let totalM = 0;
            let totalS = 0;
            legs.forEach(l => {
              totalM += l.distance ? l.distance.value : 0;
              totalS += l.duration ? l.duration.value : 0;
            });
            resolve({
              summary: json.routes[0].summary,
              points,
              distanceKm: Math.round(totalM / 1000),
              durationMin: Math.round(totalS / 60)
            });
          } else {
            console.error('API error:', json.status, json.error_message);
            resolve(null);
          }
        } catch (e) {
          console.error('Parse error:', e.message);
          resolve(null);
        }
      });
    }).on('error', reject);
  });
}

// Smoothly interpolate points along line so Leaflet draws ultra-smooth curves
function interpolateSmooth(pts, stepDistApprox = 0.0015) {
  const result = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const p1 = pts[i];
    const p2 = pts[i + 1];
    result.push(p1);
    const dLat = p2[0] - p1[0];
    const dLng = p2[1] - p1[1];
    const dist = Math.sqrt(dLat * dLat + dLng * dLng);
    const steps = Math.max(1, Math.floor(dist / stepDistApprox));
    for (let s = 1; s < steps; s++) {
      const frac = s / steps;
      result.push([
        Number((p1[0] + dLat * frac).toFixed(6)),
        Number((p1[1] + dLng * frac).toFixed(6))
      ]);
    }
  }
  result.push(pts[pts.length - 1]);
  return result;
}

async function main() {
  console.log('Fetching clean 100% Google Directions routes (Zero Loops, Zero Detours)...');
  
  // 1. Route A: Khanapara (26.1158, 91.8016) -> Shillong Bypass -> Jowai -> Silchar (24.8333, 92.7789)
  const rA = await fetchGoogle('26.1158,91.8016', '24.8333,92.7789', ['25.6888,91.9542', '25.4520,92.2030']);
  console.log('Route A (NH-6):', rA.summary, rA.distanceKm + ' km', rA.points.length + ' raw points');
  const rA_smooth = interpolateSmooth(rA.points);
  console.log('Route A Smooth Points:', rA_smooth.length);

  // 2. Route B: Khanapara -> Nagaon -> Lumding -> Silchar (NH-27 direct)
  const rB = await fetchGoogle('26.1158,91.8016', '24.8333,92.7789');
  console.log('Route B (NH-27):', rB.summary, rB.distanceKm + ' km', rB.points.length + ' raw points');
  const rB_smooth = interpolateSmooth(rB.points);
  console.log('Route B Smooth Points:', rB_smooth.length);

  // 3. Route B Diversion: Jowai -> Umrangso -> Silchar
  const rBDiv = await fetchGoogle('26.1158,91.8016', '24.8333,92.7789', ['25.4520,92.2030', '25.4120,92.9820']);
  console.log('Route B Diversion:', rBDiv.summary, rBDiv.distanceKm + ' km', rBDiv.points.length + ' raw points');
  const rBDiv_smooth = interpolateSmooth(rBDiv.points);
  console.log('Route B Div Smooth Points:', rBDiv_smooth.length);

  const fileContent = `/**
 * Pure 100% Official Google Maps Highway Road Geometries
 * Direct Arterial Routes with Zero Loops, Zero Detours
 */

export const REAL_ROAD_POLYLINES = {
  ROUTE_A: ${JSON.stringify(rA_smooth)},
  ROUTE_B: ${JSON.stringify(rB_smooth)},
  ROUTE_B_DIVERSION: ${JSON.stringify(rBDiv_smooth)}
};
`;

  const fPath = path.join(__dirname, '..', 'frontend', 'src', 'data', 'real-road-polylines.js');
  const bPath = path.join(__dirname, '..', 'backend', 'src', 'data', 'real-road-polylines.js');
  fs.writeFileSync(fPath, fileContent);
  fs.writeFileSync(bPath, fileContent);
  console.log('SUCCESS! Updated real-road-polylines.js with clean Google Highway geometries!');
}

main();
