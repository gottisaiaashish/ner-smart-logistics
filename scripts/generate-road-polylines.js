const fs = require('fs');
const path = require('path');

const data = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'frontend', 'src', 'data', 'real-routes-geometry.json'), 'utf8'));

function subsamplePoints(pts, targetCount = 1200) {
  if (!pts || pts.length <= targetCount) return pts || [];
  const step = (pts.length - 1) / (targetCount - 1);
  const result = [];
  for (let i = 0; i < targetCount; i++) {
    const idx = Math.min(pts.length - 1, Math.round(i * step));
    result.push(pts[idx]);
  }
  // Ensure last point is exactly the destination
  result[result.length - 1] = pts[pts.length - 1];
  return result;
}

const routeA_pts = subsamplePoints(data.ROUTE_A.points, 1200);
const routeB_pts = subsamplePoints(data.ROUTE_B.points, 1200);
const routeBDiv_pts = subsamplePoints(data.ROUTE_B_DIVERSION.points, 1200);

console.log('Subsampled counts:', {
  ROUTE_A: routeA_pts.length,
  ROUTE_B: routeB_pts.length,
  ROUTE_B_DIVERSION: routeBDiv_pts.length
});

const fileContent = `/**
 * Real Highway Road Coordinates (Sub-meter Accuracy matching Google Maps)
 * Extracted from Google Directions & OSRM Arterial Network
 */

export const REAL_ROAD_POLYLINES = {
  ROUTE_A: ${JSON.stringify(routeA_pts)},
  ROUTE_B: ${JSON.stringify(routeB_pts)},
  ROUTE_B_DIVERSION: ${JSON.stringify(routeBDiv_pts)}
};
`;

fs.writeFileSync(path.join(__dirname, '..', 'frontend', 'src', 'data', 'real-road-polylines.js'), fileContent);
fs.writeFileSync(path.join(__dirname, '..', 'backend', 'src', 'data', 'real-road-polylines.js'), fileContent);
console.log('Written real-road-polylines.js successfully!');
