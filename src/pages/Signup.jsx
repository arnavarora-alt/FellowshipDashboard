import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { motion } from 'motion/react';
import Icon from '../components/Icon';
import { PhotoPicker } from '../components/extra';
import { Scene } from './Login';
import { APPROVER_TEXT, useApp } from '../store/AppState';
import { logo } from '../lib/assets';
import { PEOPLE } from '../data/mock';

const ROLE_OPTIONS = [
  ['community', 'Community member'],
  ['core', 'Core team member'],
  ['hoc', 'Head of Content'],
  ['hoo', 'Head of Operations'],
  ['fellow', 'Fellow'],
];
const COLLEGES = [...new Set(PEOPLE.map((p) => p.college))].sort();

export default function Signup() {
  const { user, signup } = useApp();
  const [v, setV] = useState({ name: '', college: '', email: '', phone: '', role: 'community', team: '' });
  const [photo, setPhoto] = useState([]);
  const [err, setErr] = useState({});
  const [done, setDone] = useState(null);
  if (user) return <Navigate to="/" replace />;

  const set = (k, val) => { setV((s) => ({ ...s, [k]: val })); setErr((e) => ({ ...e, [k]: '' })); };
  const submit = (e) => {
    e.preventDefault();
    const bad = {};
    if (!v.name.trim()) bad.name = 'Enter your name.';
    if (!v.college.trim()) bad.college = 'Enter your college name.';
    if (!/^\S+@\S+\.\S+$/.test(v.email.trim())) bad.email = 'Enter a valid email. Your ID and password are sent here.';
    if (v.phone.replace(/\D/g, '').length < 10) bad.phone = 'Enter a 10 digit phone number.';
    if (!photo.length) bad.photo = 'Add a photo so your team can recognise you.';
    if (v.role === 'core' && !v.team) bad.team = 'Pick the team you are joining.';
    setErr(bad);
    if (Object.keys(bad).length) return;
    const r = signup({ ...v, name: v.name.trim(), college: v.college.trim(), phone: v.phone.trim(), photo: photo[0], team: v.role === 'core' ? v.team : '' });
    if (!r.ok) setErr({ email: r.error });
    else setDone(r);
  };

  return (
    <div className="login" data-role="fellow">
      <section className="stage-3d">
        <div className="brand"><img src={logo} alt="Under25" /><b>Campus Fellowship</b></div>
        <Scene />
        <div>
          <h1>Join the<br /><em>Under25</em><br />community</h1>
          <p>Sign up in a minute. Your ID and password arrive by email.</p>
        </div>
      </section>

      <section className="login-side">
        {done ? (
          <motion.div className="login-card stack" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}>
            <h2>{done.instant ? 'You’re in!' : 'Request sent'}</h2>
            <p>
              {done.instant
                ? <>We have emailed your user ID and password to <b>{done.email}</b>.</>
                : <>{APPROVER_TEXT[v.role]} Once approved, your user ID and password are emailed to <b>{done.email}</b>.</>}
            </p>
            <div className="callout"><Icon name="Mail" /><p className="small"><b>Demo note.</b> This prototype has no mail server. The email it would send is saved in the demo mailbox so you can read it.</p></div>
            <div className="row">
              <Link className="btn" to="/mailbox">Open demo mailbox</Link>
              <Link className="btn btn-ghost" to="/login">Back to log in</Link>
            </div>
          </motion.div>
        ) : (
          <div className="login-card">
            <h2>Sign up</h2>
            <p className="dim">New to the community? Tell us who you are.</p>
            <form className="login-form" onSubmit={submit} noValidate>
              <div className="field"><label htmlFor="su-name">Name *</label><input id="su-name" className="input" value={v.name} onChange={(e) => set('name', e.target.value)} autoComplete="name" aria-invalid={!!err.name} />{err.name && <span className="err" role="alert">{err.name}</span>}</div>
              <div className="field"><label htmlFor="su-col">College name *</label><input id="su-col" className="input" list="colleges" value={v.college} onChange={(e) => set('college', e.target.value)} aria-invalid={!!err.college} /><datalist id="colleges">{COLLEGES.map((c) => <option key={c} value={c} />)}</datalist>{err.college && <span className="err" role="alert">{err.college}</span>}</div>
              <div className="form-grid">
                <div className="field"><label htmlFor="su-mail">Email ID *</label><input id="su-mail" className="input" type="email" value={v.email} onChange={(e) => set('email', e.target.value)} autoComplete="email" aria-invalid={!!err.email} />{err.email && <span className="err" role="alert">{err.email}</span>}</div>
                <div className="field"><label htmlFor="su-ph">Phone number *</label><input id="su-ph" className="input" type="tel" value={v.phone} onChange={(e) => set('phone', e.target.value)} autoComplete="tel" aria-invalid={!!err.phone} />{err.phone && <span className="err" role="alert">{err.phone}</span>}</div>
              </div>
              <div className="field"><span className="label">Photo *</span><PhotoPicker value={photo} onChange={(p) => { setPhoto(p); setErr((e) => ({ ...e, photo: '' })); }} label="Add your photo" hint="A clear face photo. It is shrunk and kept in this browser only." />{err.photo && <span className="err" role="alert">{err.photo}</span>}</div>
              <div className="field">
                <label htmlFor="su-role">I am joining as</label>
                <select id="su-role" className="select" value={v.role} onChange={(e) => set('role', e.target.value)}>{ROLE_OPTIONS.map(([k, l]) => <option key={k} value={k}>{l}</option>)}</select>
              </div>
              {v.role === 'core' && (
                <div className="field"><label htmlFor="su-team">Which team? *</label>
                  <select id="su-team" className="select" value={v.team} onChange={(e) => set('team', e.target.value)} aria-invalid={!!err.team}><option value="">Choose one</option><option>Content</option><option>Operations</option></select>
                  {err.team && <span className="err" role="alert">{err.team}</span>}</div>
              )}
              <div className="callout"><Icon name={v.role === 'community' ? 'CircleCheck' : 'UserCheck'} /><p className="small"><b>{v.role === 'community' ? 'No approval needed.' : 'Needs approval.'}</b> {APPROVER_TEXT[v.role]}</p></div>
              <button className="btn" type="submit" style={{ background: 'var(--yellow)', color: 'var(--ink)' }}>Sign up</button>
            </form>
            <p className="signup-line">Already have an ID? <Link className="link" to="/login">Log in</Link></p>
          </div>
        )}
      </section>
    </div>
  );
}

export function Mailbox() {
  const { state } = useApp();
  return (
    <div className="login" data-role="fellow" style={{ gridTemplateColumns: 'minmax(0,1fr)' }}>
      <section className="login-side" style={{ maxWidth: 820, margin: '0 auto', width: '100%' }}>
        <div className="row-between"><h2 className="display" style={{ fontSize: 56 }}>Demo mailbox</h2><Link className="btn btn-ghost" to="/login">Back to log in</Link></div>
        <div className="callout"><Icon name="Info" /><p className="small">There is no mail server in this prototype. Every email the system would send, including the ID and password after approval, appears here. A live version sends them to the person’s real inbox.</p></div>
        <div className="stack">
          {state.outbox.map((m) => (
            <div className="mail" key={m.id}>
              <div className="row-between"><b>{m.subject}</b><span className="tiny dim">{new Date(m.at).toLocaleString('en-IN')}</span></div>
              <p className="small dim">To: {m.to}</p>
              <pre>{m.body}</pre>
            </div>
          ))}
          {!state.outbox.length && <div className="empty">No emails yet. Sign up or approve a request to see one.</div>}
        </div>
      </section>
    </div>
  );
}
