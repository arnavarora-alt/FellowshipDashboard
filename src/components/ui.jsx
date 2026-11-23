import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, animate, motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'motion/react';
import Icon from './Icon';
import { ART } from '../lib/assets';
import { useApp } from '../store/AppState';
import { toCSV, download } from '../lib/utils';

/* ---------- 3D tilt card (spring-smoothed, pointer-fine only) ---------- */
export function Tilt({ children, className = '', max = 6, to, onClick, glare = true, style, ...rest }) {
  const nav = useNavigate();
  const reduce = useReducedMotion();
  const el = useRef(null);
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rx = useSpring(useTransform(py, [-0.5, 0.5], [max, -max]), { stiffness: 170, damping: 18 });
  const ry = useSpring(useTransform(px, [-0.5, 0.5], [-max, max]), { stiffness: 170, damping: 18 });
  const fine = typeof window !== 'undefined' && window.matchMedia?.('(hover: hover) and (pointer: fine)').matches;

  const move = (e) => {
    if (reduce || !fine || !el.current) return;
    const r = el.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    px.set(x - 0.5);
    py.set(y - 0.5);
    el.current.style.setProperty('--gx', `${x * 100}%`);
    el.current.style.setProperty('--gy', `${y * 100}%`);
  };
  const leave = () => { px.set(0); py.set(0); };
  const act = to || onClick;
  const go = (e) => { if (onClick) onClick(e); else if (to) nav(to); };
  return (
    <motion.div
      ref={el}
      className={`tilt card ${act ? 'card-click' : ''} ${className}`}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 900, ...style }}
      onPointerMove={move}
      onPointerLeave={leave}
      {...(act ? { role: 'button', tabIndex: 0, onClick: go, onKeyDown: (e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), go(e)) } : {})}
      {...rest}
    >
      {children}
      {glare && <span className="tilt-glare" />}
    </motion.div>
  );
}

export const Card = ({ children, className = '', ...r }) => <div className={`card ${className}`} {...r}>{children}</div>;

export function Sticker({ name, size = 96, className = '', float = false, rot = 0, style }) {
  return <img className={`sticker ${float ? 'floaty' : ''} ${className}`} src={ART[name]} alt="" width={size} style={{ '--r': `${rot}deg`, ...style }} draggable="false" />;
}

export function PageHead({ title, sub, art = 'arrow-yellow', right }) {
  return (
    <header className="page-head">
      <div>
        <h1>{title}</h1>
        {sub && <p>{sub}</p>}
      </div>
      {right || (art && <Sticker name={art} className="ph-art" float />)}
    </header>
  );
}
export const SectionTitle = ({ children, right }) => (
  <div className="section-title">
    <h2>{children}</h2>
    {right}
  </div>
);
export const Tag = ({ children, tone = '', ...r }) => <span className={`tag ${tone ? `tag-${tone}` : ''}`} {...r}>{children}</span>;
export const Avatar = ({ name = '', size = '', style }) => (
  <span className={`avatar ${size}`} style={style}>{name.split(/\s+/).filter(Boolean).slice(0, 2).map((s) => s[0]).join('').toUpperCase() || '?'}</span>
);
export const Progress = ({ value, max = 100 }) => (
  <div className="progress" role="progressbar" aria-valuenow={Math.round(value)} aria-valuemin={0} aria-valuemax={max}>
    <i style={{ transform: `scaleX(${Math.min(1, value / max)})` }} />
  </div>
);
export const Empty = ({ title, text }) => (
  <div className="empty">
    <Sticker name="shapes-yellow" size={84} />
    <b style={{ color: 'var(--white)' }}>{title}</b>
    {text && <p className="small">{text}</p>}
  </div>
);

export function CountUp({ value, suffix = '' }) {
  const [n, setN] = useState(0);
  const reduce = useReducedMotion();
  useEffect(() => {
    if (reduce) { setN(value); return undefined; }
    const c = animate(0, value, { duration: 0.9, ease: [0.23, 1, 0.32, 1], onUpdate: (v) => setN(Math.round(v)) });
    return () => c.stop();
  }, [value, reduce]);
  return <>{n.toLocaleString('en-IN')}{suffix}</>;
}
export function Stat({ label, value, suffix = '', delta, down, count = true }) {
  return (
    <div className="stat">
      <b className="num">{count && typeof value === 'number' ? <CountUp value={value} suffix={suffix} /> : <>{value}{suffix}</>}</b>
      <span>{label}</span>
      {delta && <span className={`delta ${down ? 'down' : ''}`}>{delta}</span>}
    </div>
  );
}

/* ---------- tabs ---------- */
export function Tabs({ tabs, value, onChange }) {
  return (
    <div className="tabs" role="tablist">
      {tabs.map((t) => (
        <button key={t.id} role="tab" className="tab" aria-selected={value === t.id} onClick={() => onChange(t.id)}>{t.label}</button>
      ))}
    </div>
  );
}
export function Chips({ options, value, onChange, all = 'All' }) {
  return (
    <div className="chips">
      {all && <button className="chip" aria-pressed={value === ''} onClick={() => onChange('')}>{all}</button>}
      {options.map((o) => (
        <button key={o} className="chip" aria-pressed={value === o} onClick={() => onChange(value === o ? '' : o)}>{o}</button>
      ))}
    </div>
  );
}
export function SearchBox({ value, onChange, placeholder = 'Search' }) {
  return (
    <div className="search-box">
      <Icon name="Search" />
      <input className="input" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} aria-label={placeholder} />
    </div>
  );
}

/* ---------- modal ---------- */
export function Modal({ open, onClose, title, children, wide }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return undefined;
    const prev = document.activeElement;
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    setTimeout(() => ref.current?.querySelector('input,select,textarea,button')?.focus(), 30);
    return () => { document.removeEventListener('keydown', onKey); prev?.focus?.(); };
  }, [open, onClose]);
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="scrim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }} onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
          <motion.div ref={ref} className="modal" style={wide ? { width: 'min(760px,100%)' } : null} role="dialog" aria-modal="true" aria-label={title}
            initial={{ opacity: 0, scale: 0.96, y: 8 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.97 }} transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}>
            <div className="modal-head">
              <h2 className="display" style={{ fontSize: 34 }}>{title}</h2>
              <button className="btn btn-icon" onClick={onClose} aria-label="Close"><Icon name="X" /></button>
            </div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function Toasts() {
  const { toasts } = useApp();
  return (
    <div className="toasts" aria-live="polite">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div key={t.id} className="toast" layout initial={{ opacity: 0, y: 16, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, x: 24 }} transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}>
            <Icon name="CircleCheck" size={18} /> {t.msg}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

/* ---------- generic form ---------- */
export function Form({ fields, submitLabel = 'Send', onSubmit, initial = {}, footer, busyLabel }) {
  const [v, setV] = useState(() => Object.fromEntries(fields.map((f) => [f.name, initial[f.name] ?? f.default ?? ''])));
  const [err, setErr] = useState({});
  const id = useId();
  const set = (k, val) => { setV((s) => ({ ...s, [k]: val })); setErr((e) => ({ ...e, [k]: '' })); };
  const submit = (e) => {
    e.preventDefault();
    const bad = {};
    fields.forEach((f) => {
      const val = String(v[f.name] ?? '').trim();
      if (f.required && !val) bad[f.name] = `${f.label} is required.`;
      else if (f.type === 'email' && val && !/^\S+@\S+\.\S+$/.test(val)) bad[f.name] = 'Enter a valid email.';
    });
    setErr(bad);
    if (Object.keys(bad).length) return;
    onSubmit(v, () => setV(Object.fromEntries(fields.map((f) => [f.name, f.default ?? '']))));
  };
  return (
    <form onSubmit={submit} noValidate className="stack">
      <div className="form-grid">
        {fields.map((f) => {
          const fid = `${id}-${f.name}`;
          const common = { id: fid, value: v[f.name], onChange: (e) => set(f.name, e.target.value), placeholder: f.placeholder, 'aria-invalid': !!err[f.name] };
          return (
            <div key={f.name} className="field" style={f.wide || f.type === 'textarea' ? { gridColumn: '1 / -1' } : null}>
              <label htmlFor={fid}>{f.label}{f.required ? ' *' : ''}</label>
              {f.type === 'textarea' ? <textarea className="textarea" {...common} /> : f.type === 'select' ? (
                <select className="select" {...common}><option value="">{f.placeholder || 'Choose one'}</option>{f.options.map((o) => <option key={o} value={o}>{o}</option>)}</select>
              ) : <input className="input" type={f.type || 'text'} {...common} />}
              {err[f.name] && <span className="err" role="alert">{err[f.name]}</span>}
            </div>
          );
        })}
      </div>
      <div className="row">
        <button className="btn" type="submit">{submitLabel}</button>
        {footer}
      </div>
    </form>
  );
}

/* ---------- checklist ---------- */
export function CheckItem({ id, title, text }) {
  const { flag, toggle } = useApp();
  const on = flag(id);
  return (
    <button className="check" role="checkbox" aria-checked={on} onClick={() => toggle(id)}>
      <span className="box">{on && <Icon name="Check" size={14} strokeWidth={3.5} />}</span>
      <span><span className="check-title">{title}</span>{text && <span className="dim small" style={{ display: 'block' }}>{text}</span>}</span>
    </button>
  );
}

/* ---------- data table ---------- */
export function DataTable({ rows, cols, pageSize = 12, csv, empty = 'Nothing matches.' }) {
  const [sort, setSort] = useState({ key: null, dir: 1 });
  const [page, setPage] = useState(0);
  const sorted = useMemo(() => {
    if (!sort.key) return rows;
    return [...rows].sort((a, b) => (a[sort.key] > b[sort.key] ? 1 : a[sort.key] < b[sort.key] ? -1 : 0) * sort.dir);
  }, [rows, sort]);
  useEffect(() => setPage(0), [rows.length]);
  const pages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const slice = sorted.slice(page * pageSize, page * pageSize + pageSize);
  return (
    <div className="stack-sm">
      <div className="table-wrap">
        <table>
          <thead><tr>{cols.map((c) => (
            <th key={c.key} aria-sort={sort.key === c.key ? (sort.dir === 1 ? 'ascending' : 'descending') : 'none'}>
              <button onClick={() => setSort((s) => ({ key: c.key, dir: s.key === c.key ? -s.dir : 1 }))}>{c.label}<Icon name="ArrowUpDown" size={13} /></button>
            </th>))}</tr></thead>
          <tbody>
            {slice.map((r, i) => <tr key={r.id || i}>{cols.map((c) => <td key={c.key}>{c.render ? c.render(r) : r[c.key]}</td>)}</tr>)}
            {!slice.length && <tr><td colSpan={cols.length}><div className="empty">{empty}</div></td></tr>}
          </tbody>
        </table>
      </div>
      <div className="row-between small dim">
        <span>{sorted.length} result{sorted.length === 1 ? '' : 's'}</span>
        <div className="row">
          {csv && <button className="btn btn-sm btn-ghost" onClick={() => download(csv, toCSV(sorted, cols.filter((c) => !c.noCsv)))}><Icon name="Download" size={16} /> Export CSV</button>}
          <button className="btn btn-sm btn-ghost" disabled={page === 0} onClick={() => setPage((p) => p - 1)} aria-label="Previous page"><Icon name="ChevronRight" size={16} style={{ transform: 'rotate(180deg)' }} /></button>
          <span className="num">{page + 1} / {pages}</span>
          <button className="btn btn-sm btn-ghost" disabled={page >= pages - 1} onClick={() => setPage((p) => p + 1)} aria-label="Next page"><Icon name="ChevronRight" size={16} /></button>
        </div>
      </div>
    </div>
  );
}

/* ---------- charts (plain SVG / divs) ---------- */
export function Sparkline({ data, height = 120, label }) {
  const w = 480;
  const max = Math.max(...data);
  const min = Math.min(...data) * 0.9;
  const x = (i) => (i / (data.length - 1)) * w;
  const y = (v) => height - 8 - ((v - min) / (max - min || 1)) * (height - 24);
  const d = data.map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ');
  return (
    <svg viewBox={`0 0 ${w} ${height}`} width="100%" height={height} role="img" aria-label={label} preserveAspectRatio="none">
      <path d={`${d} L${w},${height} L0,${height} Z`} fill="var(--accent)" opacity="0.18" />
      <motion.path d={d} fill="none" stroke="var(--accent-text)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.9, ease: [0.23, 1, 0.32, 1] }} />
      <circle cx={x(data.length - 1)} cy={y(data[data.length - 1])} r="5" fill="var(--yellow)" />
    </svg>
  );
}
export function Bars({ data, labels, unit = '' }) {
  const max = Math.max(...data, 1);
  return (
    <div className="bars">
      {data.map((v, i) => (
        <div key={i} title={`${labels[i]}: ${v}${unit}`}>
          <span className="num" style={{ color: 'var(--white)', fontWeight: 700 }}>{v}{unit}</span>
          <motion.i style={{ height: `${(v / max) * 80}%` }} initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ delay: i * 0.04, duration: 0.5, ease: [0.23, 1, 0.32, 1] }} />
          <span>{labels[i]}</span>
        </div>
      ))}
    </div>
  );
}

export const ExtLink = ({ href, children, className = 'link' }) => (
  href ? <a className={className} href={href} target="_blank" rel="noreferrer noopener">{children}</a> : <span className="dim small">Link coming soon</span>
);
