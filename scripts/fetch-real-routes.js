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

function fetchGoogleDirections(origin, destination, waypoints = []) {
  return new Promise((resolve) => {
    let url = 'https://maps.googleapis.com/maps/api/directions/json?origin=' + origin + '&destination=' + destination + '&key=' + GOOGLE_KEY;
    if (waypoints.length > 0) {
      url += '&waypoints=' + waypoints.join('|');
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
            const steps = [];
            let totalDistM = 0;
            let totalDurS = 0;
            legs.forEach(leg => {
              totalDistM += leg.distance ? leg.distance.value : 0;
              totalDurS += leg.duration ? leg.duration.value : 0;
              if (leg.steps) {
                leg.steps.forEach(st => {
                  steps.push({
                    instruction: st.html_instructions ? st.html_instructions.replace(/<[^>]*>?/gm, '') : '',
                    distance: st.distance ? st.distance.text : '',
                    duration: st.duration ? st.duration.text : '',
                    start_location: [st.start_location.lat, st.start_location.lng],
                    end_location: [st.end_location.lat, st.end_location.lng],
                    maneuver: st.maneuver || 'straight'
                  });
                });
              }
            });
            resolve({
              points,
              steps,
              distanceKm: Math.round(totalDistM / 1000),
              durationMin: Math.round(totalDurS / 60),
              status: 'OK'
            });
          } else {
            console.error('Google Directions error:', json.status, json.error_message);
            resolve(null);
          }
        } catch (e) {
          console.error('Parse error:', e.message);
          resolve(null);
        }
      });
    }).on('error', (e) => {
      console.error('Req error:', e.message);
      resolve(null);
    });
  });
}

function fetchOsrmRoute(coords) {
  return new Promise((resolve) => {
    // coords is array of [lat, lng]
    const coordStr = coords.map(c => `${c[1]},${c[0]}`).join(';');
    const url = `https://router.project-osrm.org/route/v1/driving/${coordStr}?overview=full&geometries=geojson&steps=true`;
    const opts = {
      headers: { 'User-Agent': 'NERSmartLogistics/1.0 (SIH-2026-Project)' }
    };
    https.get(url, opts, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.code === 'Ok' && json.routes && json.routes[0]) {
            const rawPoints = json.routes[0].geometry.coordinates;
            const points = rawPoints.map(p => [Number(p[1].toFixed(6)), Number(p[0].toFixed(6))]);
            const steps = [];
            const legs = json.routes[0].legs || [];
            legs.forEach(leg => {
              if (leg.steps) {
                leg.steps.forEach(st => {
                  if (st.name || st.maneuver) {
                    steps.push({
                      instruction: st.maneuver ? `${st.maneuver.type} ${st.maneuver.modifier || ''} onto ${st.name || 'highway'}`.trim() : `Continue on ${st.name}`,
                      distance: (st.distance / 1000).toFixed(1) + ' km',
                      duration: Math.round(st.duration / 60) + ' min',
                      start_location: [st.maneuver.location[1], st.maneuver.location[0]],
                      end_location: [st.maneuver.location[1], st.maneuver.location[0]],
                      maneuver: st.maneuver.modifier || st.maneuver.type || 'straight'
                    });
                  }
                });
              }
            });
            resolve({
              points,
              steps,
              distanceKm: Math.round(json.routes[0].distance / 1000),
              durationMin: Math.round(json.routes[0].duration / 60),
              status: 'OK'
            });
          } else {
            resolve(null);
          }
        } catch (e) {
          resolve(null);
        }
      });
    }).on('error', () => resolve(null));
  });
}

async function run() {
  console.log('Fetching real Google Road Curvatures for all NER corridors...');
  
  // 1. Route A: Guwahati -> Shillong -> Jowai -> Sonapur -> Silchar (NH-6)
  console.log('Fetching Route A (NH-6)...');
  const routeA_g = await fetchGoogleDirections('26.1445,91.7362', '24.8333,92.7789', ['25.5788,91.8933', '25.4520,92.2030', '25.1120,92.3850']);
  const routeA_osrm = await fetchOsrmRoute([
    [26.1445, 91.7362], [26.0820, 91.8020], [25.9610, 91.8845], [25.6840, 91.9020],
    [25.5788, 91.8933], [25.5120, 92.0520], [25.4520, 92.2030], [25.3620, 92.2780],
    [25.1840, 92.3560], [25.1120, 92.3850], [24.9950, 92.4980], [24.9250, 92.6250],
    [24.8333, 92.7789]
  ]);
  const routeA = (routeA_osrm && routeA_osrm.points.length > 50) ? routeA_osrm : routeA_g;
  console.log('Route A Final Points:', routeA ? routeA.points.length : 0, 'Distance:', routeA ? routeA.distanceKm + ' km' : 'N/A');

  // 2. Route B: Guwahati -> Nagaon -> Dabaka -> Lumding -> Mahur/Haflong -> Harangajao -> Silchar (NH-27 East-West Corridor)
  console.log('Fetching Route B (NH-27 / Umrangso Bedrock)...');
  const routeB_osrm = await fetchOsrmRoute([
    [26.1445, 91.7362], [26.1820, 92.0540], [26.3450, 92.6840], [26.1280, 93.0320],
    [25.7510, 93.1750], [25.4850, 93.0250], [25.1764, 93.0238], [25.0450, 92.8120],
    [24.8333, 92.7789]
  ]);
  const routeB = routeB_osrm;
  console.log('Route B Final Points:', routeB ? routeB.points.length : 0, 'Distance:', routeB ? routeB.distanceKm + ' km' : 'N/A');

  // 3. Route B Diversion: Jowai -> Nartiang -> Khanduli -> Umrangso -> Haflong -> Silchar (SH-6 / SH-17 / NH-27)
  console.log('Fetching Route B Diversion (Jowai to Silchar via Umrangso)...');
  const routeBDiv_osrm = await fetchOsrmRoute([
    [26.1445, 91.7362], [25.5788, 91.8933], [25.4520, 92.2030], [25.5150, 92.3120],
    [25.5850, 92.4850], [25.5000, 92.7500], [25.4120, 92.9820], [25.1764, 93.0238],
    [25.0450, 92.8120], [24.8333, 92.7789]
  ]);
  const routeBDiv = routeBDiv_osrm;
  console.log('Route B Diversion Final Points:', routeBDiv ? routeBDiv.points.length : 0, 'Distance:', routeBDiv ? routeBDiv.distanceKm + ' km' : 'N/A');

  const output = {
    ROUTE_A: routeA,
    ROUTE_B: routeB,
    ROUTE_B_DIVERSION: routeBDiv
  };

  const fDir = path.join(__dirname, '..', 'frontend', 'src', 'data');
  const bDir = path.join(__dirname, '..', 'backend', 'src', 'data');
  
  if (!fs.existsSync(fDir)) fs.mkdirSync(fDir, { recursive: true });
  if (!fs.existsSync(bDir)) fs.mkdirSync(bDir, { recursive: true });

  fs.writeFileSync(path.join(fDir, 'real-routes-geometry.json'), JSON.stringify(output, null, 2));
  fs.writeFileSync(path.join(bDir, 'real-routes-geometry.json'), JSON.stringify(output, null, 2));
  console.log('SUCCESS! Real high-density road geometry successfully generated & saved!');
}

run();
