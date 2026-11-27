// Runs backend/Code.gs against an in-memory fake of Google's Apps Script services,
// so the protocol can be tested without a Google account.
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

export function createSheetMock(props = { ADMIN_KEY: 'test-admin-key', WRITE_TOKEN: 'test-token' }) {
  const tabs = new Map(); // name -> 2D array of cells

  const makeSheet = (name) => ({
    getName: () => name,
    getLastColumn: () => Math.max(0, ...(tabs.get(name) || []).map((r) => r.length)),
    getLastRow: () => (tabs.get(name) || []).length,
    getRange(r, c, nr, nc) {
      const grid = tabs.get(name);
      return {
        getValues: () => Array.from({ length: nr }, (_, i) => Array.from({ length: nc }, (_, j) => (grid[r - 1 + i] || [])[c - 1 + j] ?? '')),
        setValues: (vals) => { vals.forEach((row, i) => { grid[r - 1 + i] = grid[r - 1 + i] || []; row.forEach((v, j) => { grid[r - 1 + i][c - 1 + j] = v; }); }); return { setFontWeight: () => {} }; },
      };
    },
    setFrozenRows: () => {},
    appendRow: (row) => { tabs.get(name).push(row.slice()); },
  });

  const ctx = {
    ContentService: { MimeType: { JSON: 'json' }, createTextOutput: (t) => ({ text: t, setMimeType() { return this; } }) },
    PropertiesService: { getScriptProperties: () => ({ getProperty: (k) => props[k] }) },
    LockService: { getScriptLock: () => ({ waitLock() {}, releaseLock() {} }) },
    SpreadsheetApp: {
      getActive: () => ({
        getUrl: () => 'https://docs.google.com/spreadsheets/d/MOCK/edit',
        getSheets: () => [...tabs.keys()].map(makeSheet),
        getSheetByName: (n) => (tabs.has(n) ? makeSheet(n) : null),
        insertSheet: (n) => { tabs.set(n, []); return makeSheet(n); },
      }),
    },
    JSON, Object, Array, String, Date, Math, Error, RegExp,
  };
  vm.createContext(ctx);
  vm.runInContext(readFileSync(new URL('../backend/Code.gs', import.meta.url), 'utf8'), ctx);

  return {
    tabs,
    // simulates one POST from the dashboard; returns the parsed JSON reply
    post: (body) => JSON.parse(ctx.doPost({ postData: { contents: typeof body === 'string' ? body : JSON.stringify(body) } }).text),
  };
}
