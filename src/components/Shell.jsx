import { useEffect, useMemo, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import Icon from './Icon';
import Palette from './Palette';
import { Avatar, Toasts } from './ui';
import RoleIntro from '../pages/RoleIntro';
import { GROUPS, featureByPath, featuresFor } from '../data/features';
import { ROLES } from '../data/roles';
import { NOTIFICATIONS } from '../data/mock';
import { useApp } from '../store/AppState';
import { logo, ART } from '../lib/assets';

const pop = { initial: { opacity: 0, scale: 0.96, y: -6 }, animate: { opacity: 1, scale: 1, y: 0 }, exit: { opacity: 0, scale: 0.97 }, transition: { duration: 0.16, ease: [0.23, 1, 0.32, 1] } };

export default function Shell() {
  const { user, logout, introSeen, markIntro, resetDemo } = useApp();
  const loc = useLocation();
  const nav = useNavigate();
  const role = ROLES[user.role];
  const [navOpen, setNavOpen] = useState(false);
  const [pal, setPal] = useState(false);
  const [menu, setMenu] = useState(null); // 'bell' | 'user'
  const [replay, setReplay] = useState(false);
  const [shut, setShut] = useState(() => (user.role === 'admin' ? { today: 1, campus: 1, content: 1, ops: 1, team: 1, learn: 1, involve: 1, support: 1 } : {}));

  const groups = useMemo(() => {
    const feats = featuresFor(user.role);
    const g = GROUPS.map((x) => ({ ...x, items: feats.filter((f) => f.group === x.id) })).filter((x) => x.items.length);
    return user.role === 'admin' ? [...g.filter((x) => x.id === 'start' || x.id === 'admin'), ...g.filter((x) => x.id !== 'start' && x.id !== 'admin')] : g;
  }, [user.role]);

  useEffect(() => { setNavOpen(false); setMenu(null); window.scrollTo(0, 0); }, [loc.pathname]);
  useEffect(() => {
    const onKey = (e) => { if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setPal((p) => !p); } };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const feat = featureByPath[loc.pathname];
  const showIntro = !introSeen(user.id) || replay;
  const done = (to) => { markIntro(user.id); setReplay(false); if (to) nav(to); };
  const notes = [...(NOTIFICATIONS.extra[user.role] || []), ...NOTIFICATIONS.all];

  return (
    <div className="app" data-role={user.role}>
      <aside className="rail" data-open={navOpen} aria-label="Main navigation">
        <div className="rail-brand">
          <img src={logo} alt="" />
          <div><b>Under25</b><span>Campus Fellowship 26-27</span></div>
        </div>
        <div className="rolechip">
          <div><small>Signed in as</small><b>{role.short}</b></div>
          <img src={ART[role.sticker]} alt="" />
        </div>
        <nav className="rail-nav">
          {groups.map((g) => (
            <div key={g.id} className="nav-group" data-open={!shut[g.id]}>
              {g.id !== 'start' && (
                <button className="nav-label" onClick={() => setShut((s) => ({ ...s, [g.id]: !s[g.id] }))} aria-expanded={!shut[g.id]}>
                  {g.label}<Icon name="ChevronDown" size={14} />
                </button>
              )}
              <div className="nav-links">
                {g.items.map((f) => (
                  <NavLink key={f.key} to={f.path} end={f.path === '/'} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                    <Icon name={f.icon} /> {f.label}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>
        <div className="rail-stripe" />
        <div className="rail-foot">
          <Avatar name={user.name} />
          <div className="grow"><b>{user.name}</b><span>{user.college}</span></div>
          <button className="btn btn-icon" onClick={logout} aria-label="Sign out"><Icon name="LogOut" size={18} /></button>
        </div>
      </aside>
      {navOpen && <div className="scrim-nav" onClick={() => setNavOpen(false)} />}

      <div className="main">
        <header className="top">
          <button className="btn btn-icon menu-btn" onClick={() => setNavOpen(true)} aria-label="Open menu"><Icon name="Menu" /></button>
          <span className="crumb">{feat?.label || 'Dashboard'}</span>
          <button className="top-search" onClick={() => setPal(true)} aria-label="Search">
            <Icon name="Search" size={18} /><span className="lbl">Search or jump to…</span><span className="kbd">Ctrl K</span>
          </button>
          <div className="top-actions">
            <button className="btn btn-icon" aria-label="Notifications" onClick={() => setMenu(menu === 'bell' ? null : 'bell')} style={{ position: 'relative' }}>
              <Icon name="Bell" size={19} /><i className="bell-dot" />
            </button>
            <button className="btn btn-icon" aria-label="Profile menu" onClick={() => setMenu(menu === 'user' ? null : 'user')}><Avatar name={user.name} size="sm" /></button>
            <AnimatePresence>
              {menu && <div style={{ position: 'fixed', inset: 0, zIndex: 55 }} onClick={() => setMenu(null)} />}
              {menu === 'bell' && (
                <motion.div className="popover" {...pop} key="bell" role="menu">
                  <h4 style={{ padding: '8px 12px' }}>Notifications</h4>
                  {notes.map((n) => (
                    <div key={n.id} className="pop-item"><span className="avatar sm"><Icon name={n.icon} size={16} /></span><span><b style={{ display: 'block', fontSize: 14 }}>{n.title}</b><span className="dim small">{n.text}</span></span></div>
                  ))}
                </motion.div>
              )}
              {menu === 'user' && (
                <motion.div className="popover" {...pop} key="user" role="menu">
                  <div className="pop-item"><Avatar name={user.name} /><span><b style={{ display: 'block' }}>{user.name}</b><span className="dim small">{role.label} · {user.id}</span></span></div>
                  <button className="pop-item" role="menuitem" onClick={() => { setMenu(null); setReplay(true); }}><Icon name="Play" size={18} /> Replay role briefing</button>
                  <button className="pop-item" role="menuitem" onClick={() => { setMenu(null); resetDemo(); }}><Icon name="RefreshCcw" size={18} /> Reset demo data</button>
                  <button className="pop-item" role="menuitem" onClick={logout}><Icon name="LogOut" size={18} /> Sign out</button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </header>
        <main className="content" id="main"><Outlet /></main>
      </div>

      <Palette open={pal} onClose={() => setPal(false)} role={user.role} />
      <Toasts />
      {showIntro && <RoleIntro user={user} onDone={done} />}
    </div>
  );
}
