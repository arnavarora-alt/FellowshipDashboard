export const fmtDate = (iso, o = { day: 'numeric', month: 'short' }) => new Date(iso).toLocaleDateString('en-IN', o);
export const fmtTime = (iso) => new Date(iso).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' });
export const fmtFull = (iso) => `${fmtDate(iso, { weekday: 'short', day: 'numeric', month: 'short' })}, ${fmtTime(iso)}`;
export const daysFrom = (iso) => Math.round((new Date(iso).setHours(0, 0, 0, 0) - new Date().setHours(0, 0, 0, 0)) / 86_400_000);
export const relDay = (iso) => {
  const d = daysFrom(iso);
  if (d === 0) return 'Today';
  if (d === 1) return 'Tomorrow';
  if (d === -1) return 'Yesterday';
  return d > 0 ? `In ${d} days` : `${-d} days ago`;
};
export const monthDay = (iso) => ({ d: new Date(iso).getDate(), m: new Date(iso).toLocaleDateString('en-IN', { month: 'short' }) });
export const greeting = () => {
  const h = new Date().getHours();
  return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
};
export const toCSV = (rows, cols) => {
  const esc = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  return [cols.map((c) => esc(c.label)).join(','), ...rows.map((r) => cols.map((c) => esc(r[c.key])).join(','))].join('\n');
};
export const download = (name, text, type = 'text/csv') => {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};
export const cx = (...a) => a.filter(Boolean).join(' ');
export const pct = (n, d) => (d ? Math.round((n / d) * 100) : 0);
export const compact = (n) => (n >= 1000 ? `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k` : String(n));
