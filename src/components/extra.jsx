import { useEffect, useRef, useState } from 'react';
import Icon from './Icon';
import { Tag } from './ui';
import { useApp } from '../store/AppState';
import { readImage } from '../lib/image';

/* Campus Partner tag: visible to every user next to the college name */
export function CampusTag({ college, small = true }) {
  const { isPartner } = useApp();
  if (!college || !isPartner(college)) return null;
  return (
    <Tag tone="yellow" title={`${college} is an Under25 Campus Partner`} style={small ? { fontSize: 11, padding: '2px 8px' } : undefined}>
      <Icon name="BadgeCheck" size={12} /> Campus Partner
    </Tag>
  );
}

/* Photo picker: shrinks images and returns data URLs */
export function PhotoPicker({ value = [], onChange, count = 1, label = 'Choose photo', hint }) {
  const ref = useRef(null);
  const [err, setErr] = useState('');
  const pick = async (files) => {
    setErr('');
    try {
      const list = [...files].slice(0, count);
      const out = await Promise.all(list.map((f) => readImage(f, count > 1 ? 560 : 320)));
      onChange(count > 1 ? [...value, ...out].slice(0, count) : out);
    } catch (e) { setErr(e.message); }
  };
  return (
    <div className="stack-sm">
      <input ref={ref} type="file" accept="image/*" multiple={count > 1} hidden onChange={(e) => { pick(e.target.files); e.target.value = ''; }} />
      <div className="row" style={{ gap: 10 }}>
        {value.map((v, i) => (
          <span key={i} style={{ position: 'relative' }}>
            <img src={v} alt={`Photo ${i + 1}`} style={{ width: count > 1 ? 96 : 84, height: count > 1 ? 72 : 84, objectFit: 'cover', borderRadius: 12 }} />
            <button type="button" className="btn btn-icon" aria-label="Remove photo" style={{ position: 'absolute', top: -8, right: -8, width: 26, height: 26 }} onClick={() => onChange(value.filter((_, j) => j !== i))}><Icon name="X" size={13} /></button>
          </span>
        ))}
        {value.length < count && (
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => ref.current?.click()}>
            <Icon name="Upload" size={16} /> {label}{count > 1 ? ` (${value.length}/${count})` : ''}
          </button>
        )}
      </div>
      {hint && <p className="tiny dim">{hint}</p>}
      {err && <p className="err" role="alert">{err}</p>}
    </div>
  );
}

/* Embedded PDF. Works from a data URL too (single-file build) by turning it into a blob. */
export function PdfViewer({ src, title, height = '78vh' }) {
  const [url, setUrl] = useState(null);
  useEffect(() => {
    let made = null;
    let live = true;
    (async () => {
      try {
        if (src.startsWith('data:')) {
          const b = await (await fetch(src)).blob();
          made = URL.createObjectURL(b);
          if (live) setUrl(made);
        } else if (live) setUrl(src);
      } catch { if (live) setUrl(src); }
    })();
    return () => { live = false; if (made) URL.revokeObjectURL(made); };
  }, [src]);
  return (
    <div className="stack-sm">
      <div className="row-between">
        <span className="dim small">Scroll to read. Use the toolbar to zoom or download.</span>
        {url && <a className="btn btn-sm btn-ghost" href={url} target="_blank" rel="noreferrer noopener"><Icon name="ExternalLink" size={15} /> Open in a new tab</a>}
      </div>
      {url ? <iframe title={title} src={url} style={{ width: '100%', height, border: 0, borderRadius: 16, background: 'var(--white)' }} /> : <div className="card empty">Loading…</div>}
    </div>
  );
}
