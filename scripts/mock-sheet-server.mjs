// Local stand-in for the deployed Apps Script web app, for trying the dashboard without a Google account.
//   node scripts/mock-sheet-server.mjs            (listens on http://127.0.0.1:8787, admin key "test-admin-key", token "test-token")
// Then in the browser console:  localStorage.setItem('u25.sheetUrl','http://127.0.0.1:8787'); localStorage.setItem('u25.sheetToken','test-token')
import http from 'node:http';
import { createSheetMock } from './sheet-mock.mjs';

const mock = createSheetMock();
const cors = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type', 'Content-Type': 'application/json' };
http.createServer((req, res) => {
  if (req.method === 'OPTIONS') { res.writeHead(204, cors); return res.end(); }
  if (req.method !== 'POST') { res.writeHead(200, cors); return res.end(JSON.stringify({ ok: true, service: 'mock' })); }
  let raw = '';
  req.on('data', (c) => { raw += c; });
  req.on('end', () => {
    const out = mock.post(raw);
    console.log(new Date().toISOString().slice(11, 19), JSON.parse(raw || '{}').action, JSON.parse(raw || '{}').type || '', out.ok ? 'ok' : out.error);
    res.writeHead(200, cors);
    res.end(JSON.stringify(out));
  });
}).listen(8787, '127.0.0.1', () => console.log('mock sheet on http://127.0.0.1:8787'));
