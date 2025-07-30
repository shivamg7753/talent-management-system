// src/monitoring/alerts.js
const clients = new Map(); // Map<budgetId, Set<res>>

function addClient(budgetId, res) {
  if (!clients.has(budgetId)) clients.set(budgetId, new Set());
  clients.get(budgetId).add(res);

  res.on('close', () => {
    const set = clients.get(budgetId);
    if (set) {
      set.delete(res);
      if (set.size === 0) clients.delete(budgetId);
    }
  });
}

function notify(budgetId, eventName, payload) {
  const set = clients.get(budgetId);
  if (!set || set.size === 0) return;
  const msg = `event: ${eventName}\ndata: ${JSON.stringify(payload)}\n\n`;
  for (const res of set) res.write(msg);
}

module.exports = { addClient, notify };
