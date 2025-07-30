// src/monitoring/burn-rate.js
function burnRate(spent, total) {
  if (!total || total <= 0) return 0;
  return (Number(spent) / Number(total)) * 100;
}
module.exports = { burnRate };
