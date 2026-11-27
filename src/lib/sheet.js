// Sends every form to the Google Sheet backend and lets admins read it back.
// Rows that fail to send (offline, script down) wait in a local queue and are retried.
import { SHEET_URL, SHEET_TOKEN } from '../data/links';

const QUEUE = 'u25.sheetQueue';
const store = (k) => { try { return localStorage.getItem(k) || ''; } catch { return ''; } };

export const sheetUrl = () => SHEET_URL || store('u25.sheetUrl');
const token = () => SHEET_TOKEN || store('u25.sheetToken');
export const sheetOn = () => !!sheetUrl();

// Flat, sheet-friendly row: arrays joined, big blobs (photos) dropped.
export const flatRow = (o = {}) => Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined).map(([k, v]) => {
  if (Array.isArray(v)) return [k, v.filter((x) => typeof x !== 'string' || !x.startsWith('data:')).join(', ')];
  if (typeof v === 'string' && v.startsWith('data:')) return [k, '[photo kept in the dashboard]'];
  if (v && typeof v === 'object') return [k, JSON.stringify(v)];
  return [k, v];
}));

const readQueue = () => { try { return JSON.parse(store(QUEUE) || '[]'); } catch { return []; } };
const writeQueue = (q) => { try { localStorage.setItem(QUEUE, JSON.stringify(q.slice(-200))); } catch { /* ignore */ } };

async function send(item) {
  const res = await fetch(sheetUrl(), { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify({ action: 'append', token: token(), type: item.type, row: item.row }) });
  const j = await res.json();
  if (!j.ok) throw new Error(j.error || 'Rejected');
}

export async function flushQueue() {
  if (!sheetOn()) return;
  const q = readQueue();
  if (!q.length) return;
  const left = [];
  for (const item of q) {
    try { await send(item); } catch { left.push(item); }
  }
  writeQueue(left);
}

// Fire and forget. Never throws, never blocks the form.
export function pushRow(type, row) {
  if (!sheetOn()) return;
  const item = { type, row: flatRow(row) };
  send(item).catch(() => writeQueue([...readQueue(), item]));
}

export async function readSheet(key, types) {
  const res = await fetch(sheetUrl(), { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify({ action: 'read', key, types }) });
  const j = await res.json();
  if (!j.ok) throw new Error(j.error || 'Could not read the sheet');
  // the script prefixes formula-looking text with an apostrophe; Sheets hides it, so hide it here too
  const unquote = (v) => (typeof v === 'string' && /^'[=+-@]/.test(v) ? v.slice(1) : v);
  Object.values(j.tabs || {}).forEach((rows) => rows.forEach((r) => Object.keys(r).forEach((k) => { r[k] = unquote(r[k]); })));
  return j;
}

export const adminKey = {
  get: () => { try { return sessionStorage.getItem('u25.adminKey') || ''; } catch { return ''; } },
  set: (k) => { try { sessionStorage.setItem('u25.adminKey', k); } catch { /* ignore */ } },
  clear: () => { try { sessionStorage.removeItem('u25.adminKey'); } catch { /* ignore */ } },
};
