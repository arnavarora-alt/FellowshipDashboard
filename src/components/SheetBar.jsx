import { useCallback, useEffect, useRef, useState } from 'react';
import Icon from './Icon';
import { adminKey, readSheet, sheetOn } from '../lib/sheet';

// Rows from the sheet that are not already in this browser (matched by id) are added.
export const mergeById = (local = [], remote = []) => {
  const seen = new Set(local.map((r) => r.id).filter(Boolean));
  return [...local, ...remote.filter((r) => !r.id || !seen.has(r.id))];
};

// Admin read access to the Google Sheet. `types` limits which tabs are fetched (omit for all).
export function useSheet(types) {
  const on = sheetOn();
  const [key, setKey] = useState(adminKey.get());
  const [st, setSt] = useState({ loading: false, error: '', rows: {}, sheetUrl: '' });
  const typesRef = useRef(types);
  typesRef.current = types;

  const load = useCallback(async (k) => {
    const use = k ?? adminKey.get();
    if (!on || !use) return;
    setSt((s) => ({ ...s, loading: true, error: '' }));
    try {
      const j = await readSheet(use, typesRef.current);
      setSt({ loading: false, error: '', rows: j.tabs || {}, sheetUrl: j.sheetUrl || '' });
    } catch (e) {
      if (/admin key/i.test(e.message)) { adminKey.clear(); setKey(''); }
      setSt((s) => ({ ...s, loading: false, error: e.message === 'Failed to fetch' ? 'Could not reach the Google Sheet. Check the web app URL and that it is deployed for Anyone.' : e.message }));
    }
  }, [on]);

  useEffect(() => {
    load();
    const t = setInterval(() => load(), 30000);
    return () => clearInterval(t);
  }, [load, key]);

  const connect = (k) => { adminKey.set(k); setKey(k); load(k); };
  return { on, key, connect, reload: () => load(), ...st, connected: on && !!key && !st.error };
}

export function SheetBar({ sheet }) {
  const [v, setV] = useState('');
  if (!sheet.on) {
    return (
      <div className="callout warn"><Icon name="Info" /><p className="small"><b>Not connected to a Google Sheet.</b> Forms are saved in the browser they were sent from, so you only see what was sent from this browser. Connect a sheet to receive forms from everyone (see backend/README.md).</p></div>
    );
  }
  if (!sheet.key) {
    return (
      <form className="callout" onSubmit={(e) => { e.preventDefault(); if (v.trim()) sheet.connect(v.trim()); }} style={{ flexWrap: 'wrap' }}>
        <Icon name="KeyRound" />
        <div className="grow"><b>Unlock the Google Sheet data</b><p className="small">Enter the admin key set in the script. It is kept only for this tab.</p>{sheet.error && <p className="err" role="alert">{sheet.error}</p>}</div>
        <input className="input" type="password" placeholder="Admin key" value={v} onChange={(e) => setV(e.target.value)} aria-label="Admin key" style={{ maxWidth: 240 }} />
        <button className="btn btn-sm" type="submit">Connect</button>
      </form>
    );
  }
  return (
    <div className={`callout ${sheet.error ? 'warn' : ''}`} style={{ alignItems: 'center', flexWrap: 'wrap' }}>
      <Icon name={sheet.error ? 'TriangleAlert' : 'CircleCheck'} />
      <p className="small grow">{sheet.error ? sheet.error : sheet.loading ? 'Reading the Google Sheet…' : <b>Connected to the Google Sheet. Showing forms from everyone.</b>}</p>
      {sheet.sheetUrl && <a className="btn btn-sm btn-ghost" href={sheet.sheetUrl} target="_blank" rel="noreferrer noopener"><Icon name="ExternalLink" size={14} /> Open sheet</a>}
      <button className="btn btn-sm btn-ghost" onClick={sheet.reload}><Icon name="RefreshCcw" size={14} /> Refresh</button>
    </div>
  );
}
