import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'motion/react';
import { BRIEFINGS, ROLES } from '../data/roles';
import { ART, logo, mascot } from '../lib/assets';
import Icon from '../components/Icon';

const HOLD_MS = 1100;

function Select({ role, user, onLock, onSkip }) {
  const reduce = useReducedMotion();
  const [holding, setHolding] = useState(false);
  const timer = useRef(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 14 });
  const sy = useSpring(my, { stiffness: 60, damping: 14 });
  const ry = useTransform(sx, [-0.5, 0.5], [-16, 16]);
  const rx = useTransform(sy, [-0.5, 0.5], [12, -12]);
  const ox = useTransform(sx, [-0.5, 0.5], [-30, 30]);
  const oy = useTransform(sy, [-0.5, 0.5], [-20, 20]);

  useEffect(() => {
    if (reduce) return undefined;
    const f = (e) => { mx.set(e.clientX / window.innerWidth - 0.5); my.set(e.clientY / window.innerHeight - 0.5); };
    window.addEventListener('pointermove', f);
    return () => window.removeEventListener('pointermove', f);
  }, [mx, my, reduce]);

  const start = useCallback(() => {
    if (timer.current) return;
    setHolding(true);
    timer.current = setTimeout(() => { timer.current = null; setHolding(false); onLock(); }, HOLD_MS);
  }, [onLock]);
  const stop = useCallback(() => {
    clearTimeout(timer.current);
    timer.current = null;
    setHolding(false);
  }, []);
  useEffect(() => () => clearTimeout(timer.current), []);

  const first = user.name.split(' ')[0];
  return (
    <motion.div key="select" className="intro-stage" exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
      <motion.div className="agent-name" aria-hidden="true" initial={{ opacity: 0, x: -80 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}>
        {role.codename}
      </motion.div>

      <div className="agent-info">
        <motion.p className="role-label" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.4, ease: [0.23, 1, 0.32, 1] }}>
          Welcome, {first}. Your role is
        </motion.p>
        <motion.h1 initial={{ opacity: 0, x: -50, skewX: -8 }} animate={{ opacity: 1, x: 0, skewX: 0 }} transition={{ delay: 0.22, duration: 0.55, ease: [0.23, 1, 0.32, 1] }}>
          {role.label}
        </motion.h1>
        <motion.p className="lead" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>{role.lead}</motion.p>
        <div className="abilities">
          {role.abilities.map(([ic, t], i) => (
            <motion.div key={t} className="ability" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + i * 0.07, duration: 0.35, ease: [0.23, 1, 0.32, 1] }}>
              <Icon name={ic} size={18} /> {t}
            </motion.div>
          ))}
        </div>
        <div className="lock-wrap">
          <button
            className="lock"
            data-holding={holding}
            onPointerDown={(e) => { e.currentTarget.setPointerCapture?.(e.pointerId); start(); }}
            onPointerUp={stop}
            onPointerCancel={stop}
            onKeyDown={(e) => { if ((e.key === 'Enter' || e.key === ' ') && !e.repeat) { e.preventDefault(); start(); } }}
            onKeyUp={(e) => { if (e.key === 'Enter' || e.key === ' ') stop(); }}
            onBlur={stop}
            aria-label="Hold to lock in your role"
          >
            <span className="fill" />
            <span><Icon name="Lock" size={20} style={{ display: 'inline', verticalAlign: '-3px', marginRight: 10 }} />{holding ? 'Locking in…' : 'Hold to lock in'}</span>
          </button>
          <button className="skip" onClick={onSkip}>Skip intro</button>
        </div>
      </div>

      <div className="agent-art" aria-hidden="true">
        <motion.img className="mascot" src={mascot} alt="" style={{ rotateY: ry, rotateX: rx }} initial={{ opacity: 0, scale: 0.8, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.6, ease: [0.23, 1, 0.32, 1] }} />
        <motion.img className="sk" src={ART[role.sticker]} alt="" style={{ left: '4%', top: '8%', x: ox, y: oy, rotate: -12 }} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }} />
        <motion.img className="sk" src={ART['arrow-outline']} alt="" style={{ right: '2%', bottom: '10%', x: ox, y: oy, rotate: 10 }} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.6 }} />
      </div>
    </motion.div>
  );
}

function Brief({ role, items, onGo, onEnter }) {
  return (
    <motion.div key="brief" className="brief" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }}>
      <div>
        <p style={{ color: 'var(--accent-text)', fontWeight: 700, marginBottom: 8 }}>Mission briefing for {role.label}</p>
        <h1>Your first {items.length} moves</h1>
      </div>
      <div className="loadout">
        {items.map((m, i) => (
          <motion.button
            key={m.title}
            className="mission"
            onClick={() => onGo(m.to)}
            initial={{ opacity: 0, rotateX: -60, y: 40 }}
            animate={{ opacity: 1, rotateX: 0, y: 0 }}
            transition={{ delay: 0.12 + i * 0.09, duration: 0.55, ease: [0.23, 1, 0.32, 1] }}
            whileTap={{ scale: 0.98 }}
            style={{ transformOrigin: 'top center' }}
          >
            <span className="n">{String(i + 1).padStart(2, '0')}</span>
            <span className="ico"><Icon name={m.icon} size={24} /></span>
            <h3>{m.title}</h3>
            <p>{m.text}</p>
            <span className="go">Open <Icon name="ArrowRight" size={18} /></span>
          </motion.button>
        ))}
      </div>
      <div className="brief-foot">
        <button className="btn" onClick={onEnter} style={{ '--bh': '56px', fontSize: 17 }}>Enter dashboard</button>
        <span className="dim small">You can replay this briefing any time from the profile menu.</span>
      </div>
    </motion.div>
  );
}

export default function RoleIntro({ user, onDone }) {
  const role = ROLES[user.role];
  const items = BRIEFINGS[user.role];
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState('select');
  const [wipe, setWipe] = useState(false);

  const lock = useCallback(() => {
    if (reduce) { setPhase('brief'); return; }
    setWipe(true);
    setTimeout(() => setPhase('brief'), 420);
    setTimeout(() => setWipe(false), 1000);
  }, [reduce]);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  return (
    <div className="intro" data-role={user.role} role="dialog" aria-modal="true" aria-label="Role briefing">
      {[8, 30, 58, 82].map((l, i) => <i key={l} className="intro-slash" style={{ left: `${l}%`, opacity: 0.07 + i * 0.03 }} />)}
      <div className="intro-top">
        <img src={logo} alt="Under25" width="44" height="44" />
        <span className="tagline">Under25 Campus Fellowship 2026-27</span>
      </div>
      <AnimatePresence mode="wait">
        {phase === 'select' ? (
          <Select key="s" role={role} user={user} onLock={lock} onSkip={() => onDone()} />
        ) : (
          <Brief key="b" role={role} items={items} onGo={(to) => onDone(to)} onEnter={() => onDone()} />
        )}
      </AnimatePresence>
      {wipe && (
        <div className="wipe" aria-hidden="true">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <motion.i key={i} initial={{ scaleY: 0 }} animate={{ scaleY: [0, 1, 1, 0] }} transition={{ duration: 0.95, times: [0, 0.42, 0.58, 1], delay: i * 0.04, ease: 'easeInOut' }} style={{ transformOrigin: i % 2 ? 'top' : 'bottom' }} />
          ))}
        </div>
      )}
    </div>
  );
}
