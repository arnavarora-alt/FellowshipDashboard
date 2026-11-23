import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import Icon from '../components/Icon';
import { Avatar, Bars, Progress, SectionTitle, Stat, Sticker, Tag, Tilt, Sparkline } from '../components/ui';
import { useApp, allEvents } from '../store/AppState';
import { ROLES } from '../data/roles';
import { canAccess } from '../data/features';
import { APPLICATIONS, EVENTS, FOLLOWER_SERIES, HEALTH, HYGIENE, PEOPLE, UPDATES, EVENT_SERIES } from '../data/mock';
import { greeting, fmtFull, monthDay, relDay, pct } from '../lib/utils';
import { mascot, ART } from '../lib/assets';

const QUICK = {
  fellow: [['CalendarPlus', 'List an event', 'Tell Under25 what you are running', '/listevent'], ['UserPlus', 'Assign a task', 'Hand work to your Heads', '/assigntask'], ['Instagram', 'Club page', 'Followers and posting rhythm', '/clubpage'], ['Dumbbell', 'Drills', 'Eight resource packs', '/drills']],
  hoc: [['ClipboardCheck', 'Hygiene check', 'Eight things every page needs', '/hygiene'], ['Lightbulb', 'Ideas bank', 'Ready-to-shoot ideas', '/contentideas'], ['CalendarRange', 'Content calendar', 'Festivals and milestones', '/contentcal'], ['UserPlus', 'Assign a task', 'Delegate to your content team', '/assigntask']],
  hoo: [['Sparkles', 'Event ideas', 'Easy to run, easy to film', '/eventideas'], ['ClipboardList', 'Checklists', 'Before, day-of, after', '/checklists'], ['CalendarPlus', 'Event listing form', 'List an on-ground event', '/listevent'], ['UserPlus', 'Assign a task', 'Delegate to your ops team', '/assigntask']],
  core: [['ListChecks', 'My tasks', 'Your first task is waiting', '/tasks'], ['MapPin', 'City meetups', 'Meet other campuses', '/citymeetups'], ['PencilRuler', 'Plan an event', 'Pitch it to your Head of Operations', '/planevent'], ['Camera', 'Upload photos', 'Share campus moments', '/uploadphotos']],
  community: [['Ticket', 'Upcoming events', 'RSVP in a tap', '/events'], ['DoorOpen', 'Join the core team', 'Nine lead roles are open', '/join'], ['Mic', 'Talent hunt', 'Watch live or perform', '/talenthunt'], ['MessageSquarePlus', 'Suggestions', 'Tell us what to build', '/suggestions']],
  admin: [['Database', 'Full database', 'Search every member', '/database'], ['UserCheck', 'Applications', 'Accept, reject, interview', '/applications'], ['UserPlus', 'Assign a task', 'To any role', '/assigntask'], ['CalendarClock', 'Team calls', 'Schedule and track', '/calls']],
};

function Stats({ role }) {
  const { state, count } = useApp();
  const pending = state.applications.filter((a) => a.status === 'pending').length;
  const hy = count('check:hygiene:');
  const done = state.tasks.filter((t) => t.status === 'done').length;
  const rsvps = count('rsvp:');
  if (role === 'fellow') return <><Stat label="Followers (Sem 1 target 1,000)" value={1180} delta="+120 this month" /><Stat label="Core team built (target 100)" value={64} /><Stat label="Events run this semester" value={9} /><Stat label="Unlocks earned" value={2} /></>;
  if (role === 'hoc') return <><Stat label="Posts this month" value={18} delta="+4 vs last" /><Stat label="Reach (thousand)" value={14.1} count={false} delta="+13%" /><Stat label="Hygiene checks done" value={hy} suffix={`/${HYGIENE.length}`} /><Stat label="Content tasks open" value={state.tasks.filter((t) => t.assignee === 'hoc-bnmit' && t.status !== 'done').length} /></>;
  if (role === 'hoo') return <><Stat label="Events this month" value={3} /><Stat label="Total attendance" value={290} /><Stat label="RSVP to attendance" value={71} suffix="%" /><Stat label="Ops tasks open" value={state.tasks.filter((t) => t.assignee === 'hoo-bnmit' && t.status !== 'done').length} /></>;
  if (role === 'core') return <><Stat label="Tasks done" value={done} /><Stat label="Challenge points" value={150} /><Stat label="Events RSVPed" value={rsvps} /><Stat label="Days in the club" value={69} /></>;
  if (role === 'community') return <><Stat label="Events RSVPed" value={rsvps} /><Stat label="Certificates earned" value={1} /><Stat label="Lead roles open" value={9} /><Stat label="Members on your campus" value={132} /></>;
  const cities = new Set(PEOPLE.map((p) => p.city)).size;
  return <><Stat label="People in the program" value={PEOPLE.length} /><Stat label="Colleges" value={new Set(PEOPLE.map((p) => p.college)).size} /><Stat label="Applications waiting" value={pending} delta={`${cities} cities`} /><Stat label="Fellows needing a check-in" value={HEALTH.filter((h) => h.status === 'MIA').length} down delta="MIA" /></>;
}

export default function Home() {
  const { user, state, flag, toggle, setTaskStatus } = useApp();
  const nav = useNavigate();
  const role = ROLES[user.role];
  const first = user.name.split(' ')[0];
  const myTasks = state.tasks.filter((t) => (user.role === 'admin' ? true : t.assignee === user.id) && t.status !== 'done').slice(0, 4);
  const events = allEvents(state).filter((e) => (e.leaders ? user.role !== 'community' : true) && (e.city === 'All' || e.city === user.city || user.role === 'admin')).sort((a, b) => new Date(a.when) - new Date(b.when)).slice(0, 4);
  const quick = QUICK[user.role].filter((q) => canAccess(user.role, q[3].slice(1)));

  return (
    <div className="stack" style={{ gap: 24 }}>
      <motion.section className="hero tilt-stage" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}>
        <div>
          <p style={{ fontWeight: 700, marginBottom: 10 }}>{greeting()}, {first}</p>
          <h1>{role.tagline}</h1>
          <p>{role.lead}</p>
          <div className="row" style={{ marginTop: 22 }}>
            <Link className="btn" style={{ background: 'var(--ink)', color: 'var(--white)' }} to={quick[0]?.[3] || '/events'}>{quick[0]?.[1] || 'Open events'}</Link>
            <Link className="btn btn-ghost" style={{ color: 'inherit', boxShadow: 'inset 0 0 0 1.5px currentColor' }} to="/updates">What’s new</Link>
          </div>
        </div>
        <div className="stage" aria-hidden="true">
          <motion.img className="mascot" src={mascot} alt="" animate={{ y: [0, -12, 0], rotateZ: [-2, 2, -2] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }} />
          <img className="orbit sticker" src={ART[role.sticker]} alt="" style={{ left: '4%', top: '6%', transform: 'translateZ(120px) rotate(-12deg)' }} />
          <img className="orbit sticker" src={ART['arrow-outline']} alt="" style={{ right: '6%', bottom: '4%', width: 70, transform: 'translateZ(140px) rotate(10deg)' }} />
        </div>
      </motion.section>

      <div className="card"><div className="grid g4"><Stats role={user.role} /></div></div>

      <div className="grid g4">
        {quick.map(([ic, t, d, to]) => (
          <Tilt key={to} to={to} className="">
            <div className="quick lift"><span className="ico"><Icon name={ic} /></span><span><b>{t}</b><span>{d}</span></span></div>
          </Tilt>
        ))}
      </div>

      <div className="split">
        <div className="card">
          <div className="card-head"><div><h3>{user.role === 'admin' ? 'Tasks across the program' : 'Your next tasks'}</h3><p className="dim small">Tap a box to mark it done.</p></div><Link className="link small" to="/tasks">All tasks</Link></div>
          {myTasks.length ? myTasks.map((t) => (
            <div className="list-row" key={t.id}>
              <button className="check" style={{ width: 'auto', padding: 8, background: 'transparent' }} role="checkbox" aria-checked={false} aria-label={`Mark ${t.title} done`} onClick={() => setTaskStatus(t.id, 'done')}><span className="box" /></button>
              <div className="grow"><b>{t.title}</b><p className="dim small">Due {relDay(t.due).toLowerCase()} · from {t.by}</p></div>
              <Tag tone={t.priority === 'High' ? 'orange' : ''}>{t.priority}</Tag>
            </div>
          )) : <p className="dim">You are all caught up.</p>}
        </div>
        <div className="card">
          <div className="card-head"><div><h3>Coming up</h3></div><Link className="link small" to="/events">All events</Link></div>
          {events.map((e) => {
            const md = monthDay(e.when);
            const on = flag(`rsvp:${e.id}`);
            return (
              <div className="list-row" key={e.id}>
                <div className="event-date"><b>{md.d}</b><span>{md.m}</span></div>
                <div className="grow"><b>{e.title}</b><p className="dim small">{fmtFull(e.when)} · {e.where}</p></div>
                <button className={`btn btn-sm ${on ? 'btn-soft' : ''}`} onClick={() => toggle(`rsvp:${e.id}`)}>{on ? 'Going' : 'RSVP'}</button>
              </div>
            );
          })}
        </div>
      </div>

      {user.role === 'admin' && (
        <div className="split">
          <div className="card"><div className="card-head"><h3>Followers across pilot campuses</h3></div><Sparkline data={FOLLOWER_SERIES} label="Followers over 12 weeks" /></div>
          <div className="card"><div className="card-head"><h3>Events held and planned</h3></div><Bars data={EVENT_SERIES.map((e) => e.held || e.plan)} labels={EVENT_SERIES.map((e) => e.m)} /></div>
        </div>
      )}
      {user.role === 'community' && (
        <Tilt className="card-accent" to="/join">
          <div className="row-between lift"><div><h3 style={{ fontSize: 30 }} className="display">Ready for more?</h3><p style={{ maxWidth: '48ch' }}>Nine lead roles are open on your campus club. Apply in two minutes and join the core team.</p></div><Sticker name="trophy-yellow" size={96} float /></div>
        </Tilt>
      )}

      <div>
        <SectionTitle right={<Link className="link small" to="/updates">See all</Link>}>What’s new</SectionTitle>
        <div className="grid g3">
          {UPDATES.slice(0, 3).map((u) => (
            <div className="card" key={u.id}><Tag tone="soft">{u.tag}</Tag><h3 style={{ margin: '10px 0 6px' }}>{u.title}</h3><p className="dim small">{u.text}</p></div>
          ))}
        </div>
      </div>
    </div>
  );
}
