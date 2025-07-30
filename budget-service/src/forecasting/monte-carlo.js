// src/forecasting/monte-carlo.js
function randn() {
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

function simulate({ base, variabilityPct = 20, runs = 10000, floor, cap }) {
  if (!base || base <= 0) throw new Error('base must be > 0');
  const sigma = (variabilityPct / 100) * base;
  const samples = new Array(runs);

  for (let i = 0; i < runs; i++) {
    let val = base + randn() * sigma;
    if (typeof floor === 'number') val = Math.max(floor, val);
    if (typeof cap === 'number') val = Math.min(cap, val);
    samples[i] = Math.max(0, val);
  }
  samples.sort((a, b) => a - b);

  const p = (x) => samples[Math.max(0, Math.min(samples.length - 1, Math.floor(x * samples.length)))];
  return { min: Math.round(p(0.10)), likely: Math.round(p(0.50)), max: Math.round(p(0.90)), samplesCount: runs };
}

module.exports = { simulate };
