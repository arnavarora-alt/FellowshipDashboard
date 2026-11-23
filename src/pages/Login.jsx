import { useEffect, useRef, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'motion/react';
import { ROLES, ROLE_ORDER, USERS } from '../data/roles';
import { useApp } from '../store/AppState';
import { ART, logo, mascot } from '../lib/assets';
import Icon from '../components/Icon';

function Layer({ sx, sy, depth, className, src, rot = 0, tilt = 10 }) {
  const x = useTransform(sx, [-0.5, 0.5], [-depth, depth]);
  const y = useTransform(sy, [-0.5, 0.5], [-depth, depth]);
  const ry = useTransform(sx, [-0.5, 0.5], [-tilt, tilt]);
  const rx = useTransform(sy, [-0.5, 0.5], [tilt, -tilt]);
  return (
    <motion.div className={`layer ${className}`} style={{ x, y, rotateX: rx, rotateY: ry, rotateZ: rot }}>
      <img className="sticker" src={src} alt="" draggable="false" />
    </motion.div>
  );
}

function Scene() {
  const reduce = useReducedMotion();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 70, damping: 16 });
  const sy = useSpring(my, { stiffness: 70, damping: 16 });
  useEffect(() => {
    if (reduce) return undefined;
    const f = (e) => { mx.set(e.clientX / window.innerWidth - 0.5); my.set(e.clientY / window.innerHeight - 0.5); };
    window.addEventListener('pointermove', f);
    return () => window.removeEventListener('pointermove', f);
  }, [mx, my, reduce]);
  return (
    <div className="scene" aria-hidden="true">
      <Layer sx={sx} sy={sy} depth={46} tilt={14} className="l-mascot" src={mascot} />
      <Layer sx={sx} sy={sy} depth={90} tilt={8} rot={-10} className="l-a" src={ART['ok-purple']} />
      <Layer sx={sx} sy={sy} depth={70} tilt={8} rot={12} className="l-b" src={ART['trophy-purple']} />
      <Layer sx={sx} sy={sy} depth={110} tilt={8} rot={-6} className="l-c" src={ART['shapes-green']} />
      <Layer sx={sx} sy={sy} depth={60} tilt={8} rot={8} className="l-d" src={ART['arrow-green']} />
    </div>
  );
}

export default function Login() {
  const { user, login } = useApp();
  const nav = useNavigate();
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const submitRef = useRef(null);
  if (user) return <Navigate to="/" replace />;

  const fill = (u) => { setId(u.id); setPw(u.password); setError(''); submitRef.current?.focus(); };
  const submit = (e) => {
    e.preventDefault();
    const r = login(id, pw);
    if (!r.ok) setError(r.error);
    else nav('/', { replace: true });
  };
  const sorted = ROLE_ORDER.map((r) => USERS.find((u) => u.role === r));

  return (
    <div className="login" data-role="fellow">
      <section className="stage-3d">
        <div className="brand"><img src={logo} alt="Under25" /><b>Campus Fellowship</b></div>
        <Scene />
        <div>
          <h1>One login.<br /><em>Six ways</em><br />in.</h1>
          <p>Fellows, Heads, core team, community and the Under25 team all start here. Your ID decides what you see.</p>
        </div>
      </section>

      <section className="login-side">
        <div className="login-card">
          <h2>Log in</h2>
          <p className="dim">Use your user ID and password, or pick a demo account below.</p>
          <form className="login-form" onSubmit={submit} noValidate>
            <div className="field">
              <label htmlFor="uid">User ID</label>
              <input id="uid" className="input" value={id} onChange={(e) => { setId(e.target.value); setError(''); }} autoComplete="username" autoCapitalize="none" spellCheck="false" placeholder="e.g. fellow-bnmit" aria-invalid={!!error} />
            </div>
            <div className="field">
              <label htmlFor="pw">Password</label>
              <div style={{ position: 'relative' }}>
                <input id="pw" className="input" type={show ? 'text' : 'password'} value={pw} onChange={(e) => { setPw(e.target.value); setError(''); }} autoComplete="current-password" placeholder="Your password" aria-invalid={!!error} style={{ paddingRight: 48 }} />
                <button type="button" className="btn btn-icon" onClick={() => setShow((s) => !s)} aria-label={show ? 'Hide password' : 'Show password'} style={{ position: 'absolute', right: 2, top: 2, width: 40, height: 40, background: 'transparent' }}>
                  <Icon name={show ? 'Eye' : 'Lock'} size={18} />
                </button>
              </div>
            </div>
            {error && <p className="err" role="alert">{error}</p>}
            <button ref={submitRef} className="btn" type="submit" style={{ background: 'var(--yellow)', color: 'var(--ink)' }}>Log in</button>
          </form>
        </div>

        <div>
          <div className="accounts-head">
            <h3 className="display" style={{ fontSize: 28 }}>Demo accounts</h3>
            <span className="note">Click a card to fill the form. Demo only, no real data.</span>
          </div>
          <div className="accounts">
            {sorted.map((u) => {
              const r = ROLES[u.role];
              return (
                <button key={u.id} className="acct" style={{ '--c': r.swatch, '--cc': r.swatchText }} aria-pressed={id === u.id} onClick={() => fill(u)}>
                  <span className="go">{id === u.id ? 'Selected' : 'Use'}</span>
                  <b>{r.label}</b>
                  <code>ID <em>{u.id}</em><br />Password <em>{u.password}</em></code>
                </button>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
