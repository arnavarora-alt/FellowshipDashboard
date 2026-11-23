import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import Icon from './Icon';
import { featuresFor, GROUPS } from '../data/features';
import { PEOPLE, EVENTS } from '../data/mock';
import { DRILLS } from '../data/content';

// Ctrl/Cmd + K: jump to any page. Admins can also search the database (the "search for everything" backend feature).
export default function Palette({ open, onClose, role }) {
  const nav = useNavigate();
  const [q, setQ] = useState('');
  const [i, setI] = useState(0);
  const inp = useRef(null);

  const items = useMemo(() => {
    const term = q.trim().toLowerCase();
    const pages = featuresFor(role).map((f) => ({ k: `p-${f.key}`, g: GROUPS.find((g) => g.id === f.group)?.label, label: f.label, hint: f.blurb, icon: f.icon, to: f.path }));
    let out = pages;
    if (term) {
      out = pages.filter((p) => `${p.label} ${p.hint}`.toLowerCase().includes(term));
      const extra = [];
      EVENTS.filter((e) => e.title.toLowerCase().includes(term)).slice(0, 4).forEach((e) => extra.push({ k: e.id, g: 'Events', label: e.title, hint: e.where, icon: 'CalendarDays', to: '/events' }));
      DRILLS.filter((d) => d.title.toLowerCase().includes(term)).slice(0, 3).forEach((d) => extra.push({ k: d.id, g: 'Drills', label: d.title, hint: d.cat, icon: 'Dumbbell', to: '/drills' }));
      if (role === 'admin') PEOPLE.filter((p) => `${p.name} ${p.college} ${p.email} ${p.id} ${p.role}`.toLowerCase().includes(term)).slice(0, 8).forEach((p) => extra.push({ k: p.id, g: 'People', label: p.name, hint: `${p.role}, ${p.college}`, icon: 'Contact', to: `/database?q=${encodeURIComponent(p.name)}` }));
      out = [...out, ...extra];
    }
    return out.slice(0, 30);
  }, [q, role]);

  useEffect(() => { if (open) { setQ(''); setI(0); setTimeout(() => inp.current?.focus(), 20); } }, [open]);
  useEffect(() => setI(0), [q]);

  const go = (it) => { onClose(); nav(it.to); };
  const onKey = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setI((n) => Math.min(items.length - 1, n + 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setI((n) => Math.max(0, n - 1)); }
    else if (e.key === 'Enter' && items[i]) { e.preventDefault(); go(items[i]); }
    else if (e.key === 'Escape') onClose();
  };
  let last = '';
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="scrim" style={{ placeItems: 'start center' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
          <motion.div className="palette" role="dialog" aria-modal="true" aria-label="Search" initial={{ opacity: 0, scale: 0.97, y: -8 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}>
            <input ref={inp} value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={onKey} placeholder={role === 'admin' ? 'Search pages, events, drills and people…' : 'Search pages, events and drills…'} aria-label="Search" />
            <ul role="listbox">
              {items.map((it, n) => {
                const head = it.g !== last ? it.g : null;
                last = it.g;
                return (
                  <li key={it.k}>
                    {head && <div className="grp">{head}</div>}
                    <button role="option" aria-selected={n === i} onMouseMove={() => setI(n)} onClick={() => go(it)}>
                      <Icon name={it.icon} size={18} />
                      <span className="grow"><b>{it.label}</b><span style={{ display: 'block', fontSize: 12, opacity: 0.7 }}>{it.hint}</span></span>
                    </button>
                  </li>
                );
              })}
              {!items.length && <li className="empty">No results for “{q}”.</li>}
            </ul>
            <div className="palette-foot"><span><span className="kbd">↑</span> <span className="kbd">↓</span> move</span><span><span className="kbd">Enter</span> open</span><span><span className="kbd">Esc</span> close</span></div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
